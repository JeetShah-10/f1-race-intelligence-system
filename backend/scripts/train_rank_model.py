"""
Train Race Rank Model (Ensemble + Synthetic Data)

This script trains a robust model to predict final race positions based on
race-level aggregated statistics. It uses an ensemble approach and synthetic data augmentation.
"""
import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor, VotingRegressor
from sklearn.neural_network import MLPRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib
import sys
import os

# Setup paths
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(ROOT_DIR, 'data', 'raw', 'Bahrain_2021_2023_laps.parquet')
MODEL_DIR = os.path.join(ROOT_DIR, 'app', 'models')
MODEL_PATH = os.path.join(MODEL_DIR, 'race_rank_model_v0.pkl')

sys.path.append(ROOT_DIR)

def generate_synthetic_data(df: pd.DataFrame, num_samples: int = 1000) -> pd.DataFrame:
    """
    Generate synthetic race scenarios to augment the dataset.
    Perturbs lap times, grid positions, and reliability factors.
    """
    synthetic_rows = []
    
    # Analyze distributions
    lap_time_std = df['avg_lap_time'].std()
    speed_std = df['avg_speed_st'].std()
    
    for _ in range(num_samples):
        # Sample a random base row
        base_row = df.sample(1).iloc[0].copy()
        
        # Perturb features
        noise_level = np.random.uniform(0.98, 1.02)
        base_row['avg_lap_time'] *= noise_level
        base_row['avg_speed_st'] *= (2 - noise_level) # inverse relation roughly
        
        # Perturb grid position (+/- 2 spots, clipped)
        grid_shift = np.random.randint(-2, 3)
        base_row['grid_position'] = np.clip(base_row['grid_position'] + grid_shift, 1, 20)
        
        # Perturb reliability (finished status)
        if np.random.random() < 0.05: # 5% chance of DNF swap
            base_row['finished'] = 1 - base_row['finished']
            
        synthetic_rows.append(base_row)
        
    return pd.DataFrame(synthetic_rows)

def aggregate_race_stats(df: pd.DataFrame) -> pd.DataFrame:
    """
    Aggregate lap-level data to race-level driver statistics.
    """
    # Ensure numeric LapTime
    if df['LapTime'].dtype == 'timedelta64[ns]':
        df['LapTime'] = df['LapTime'].dt.total_seconds()
    
    # Filter valid laps only (no pit in/out, no SC)
    # Note: TrackStatus '1' is Green Flag
    df_valid = df[df['TrackStatus'] == '1'].copy()
    if df_valid.empty:
        df_valid = df.copy() # Fallback if status missing
        
    df_valid = df_valid[df_valid['LapTime'] > 60]
    df_valid = df_valid[df_valid['LapTime'] < 160]
    
    # Aggregate per driver per race
    race_stats = df_valid.groupby(['Year', 'Round', 'Driver']).agg({
        'LapTime': ['mean', 'std', 'count'],
        'Position': 'last',  # Final position (approx)
        'LapNumber': 'max',  # Laps completed
        'SpeedST': 'mean',
        'SpeedFL': 'mean'
    }).reset_index()
    
    # Flatten column names
    race_stats.columns = [
        'Year', 'Round', 'Driver',
        'avg_lap_time', 'std_lap_time', 'num_valid_laps',
        'final_position_obs', 'laps_completed',
        'avg_speed_st', 'avg_speed_fl'
    ]
    
    # Get accurate Final Position and Grid Position from metadata if avl, else infer
    # Here we infer Grid from first lap position? No, get from lap 1?
    # Better: Get min position from lap 1 for grid (approx) or use Position column
    
    grid_info = df.groupby(['Year', 'Round', 'Driver'])['Position'].first().reset_index()
    grid_info.columns = ['Year', 'Round', 'Driver', 'grid_position']
    
    final_info = df.groupby(['Year', 'Round', 'Driver'])['Position'].last().reset_index()
    final_info.columns = ['Year', 'Round', 'Driver', 'final_position']
    
    race_stats = race_stats.merge(grid_info, on=['Year', 'Round', 'Driver'], how='left')
    race_stats = race_stats.merge(final_info, on=['Year', 'Round', 'Driver'], how='left')
    
    # Feature: Finished race (completed > 90% of max laps in that race)
    max_laps_per_race = df.groupby(['Year', 'Round'])['LapNumber'].max().reset_index()
    max_laps_per_race.columns = ['Year', 'Round', 'max_laps']
    race_stats = race_stats.merge(max_laps_per_race, on=['Year', 'Round'], how='left')
    race_stats['finished'] = (race_stats['laps_completed'] / race_stats['max_laps']) > 0.90
    race_stats['finished'] = race_stats['finished'].astype(int)
    
    # Fill NaN
    race_stats['std_lap_time'] = race_stats['std_lap_time'].fillna(race_stats['std_lap_time'].mean())
    race_stats['avg_speed_st'] = race_stats['avg_speed_st'].fillna(race_stats['avg_speed_st'].median())
    race_stats['avg_speed_fl'] = race_stats['avg_speed_fl'].fillna(race_stats['avg_speed_fl'].median())
    
    return race_stats


def train_rank_model():
    print("🏁 Starting Race Rank Model Training (Ensemble)...")
    
    if not os.path.exists(DATA_PATH):
        print(f"❌ Data file not found: {DATA_PATH}")
        return
    
    # Load data
    try:
        df = pd.read_parquet(DATA_PATH)
        print(f"✅ Loaded {len(df)} laps.")
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        return
    
    # Aggregate to race-level
    race_stats = aggregate_race_stats(df)
    print(f"✅ Aggregated to {len(race_stats)} driver-race entries.")
    
    # Features and target
    feature_cols = [
        'grid_position',
        'avg_lap_time',
        'std_lap_time',
        'avg_speed_st',
        'avg_speed_fl',
        'finished'
    ]
    target = 'final_position'
    
    # Filter valid rows
    race_stats = race_stats.dropna(subset=feature_cols + [target])
    
    # Generate synthetic data
    print("🧬 Generating synthetic data...")
    synthetic_df = generate_synthetic_data(race_stats[feature_cols + [target]], num_samples=500)
    
    combined_df = pd.concat([race_stats, synthetic_df], axis=0)
    print(f"✅ Combined Real ({len(race_stats)}) + Synthetic ({len(synthetic_df)}) samples.")
    
    X = combined_df[feature_cols]
    y = combined_df[target]
    
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Define Ensemble Components
    gb_reg = GradientBoostingRegressor(n_estimators=100, learning_rate=0.05, max_depth=4, random_state=42)
    rf_reg = RandomForestRegressor(n_estimators=100, max_depth=None, random_state=42)
    mlp_reg = Pipeline([
        ('scaler', StandardScaler()),
        ('mlp', MLPRegressor(hidden_layer_sizes=(64, 32), max_iter=500, random_state=42))
    ])
    
    ensemble = VotingRegressor(
        estimators=[
            ('gb', gb_reg),
            ('rf', rf_reg),
            ('mlp', mlp_reg)
        ],
        weights=[0.35, 0.40, 0.25] # Slightly higher weight to RF/GB
    )
    
    print("🚀 Training Ensemble Model...")
    ensemble.fit(X_train, y_train)
    
    # Evaluate
    train_score = ensemble.score(X_train, y_train)
    test_score = ensemble.score(X_test, y_test)
    
    print(f"\n📊 Model Performance:")
    print(f"   Train R²: {train_score:.4f}")
    print(f"   Test R²:  {test_score:.4f}")
    
    # Save
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)
    
    joblib.dump(ensemble, MODEL_PATH)
    print(f"\n✅ Ensemble Model saved to {MODEL_PATH}")


if __name__ == "__main__":
    train_rank_model()
