import pandas as pd
import sys
import os

# Setup Paths
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(ROOT_DIR, 'data', 'raw', 'Bahrain_2021_2023_laps.parquet')
sys.path.append(ROOT_DIR)

from app.ml.pace_model import PaceModel

def train_production_models():
    print("🧠 Starting Production Model Training...")
    
    if not os.path.exists(DATA_PATH):
        print(f"❌ Data file not found: {DATA_PATH}")
        return

    # 1. Load Data
    try:
        df = pd.read_parquet(DATA_PATH)
        print(f"✅ Loaded {len(df)} laps.")
    except Exception as e:
        print(f"❌ Error loading parquet: {e}")
        return

    # 2. Filter / Prep
    # Basic filtering to remove outliers/SC
    df = df[df['TrackStatus'] == '1'].copy()
    
    # Fill NAs
    df['SpeedST'] = df['SpeedST'].fillna(df['SpeedST'].mean())
    df['SpeedFL'] = df['SpeedFL'].fillna(df['SpeedFL'].mean())
    
    # 3. Train
    model = PaceModel()
    
    print("\n[Training Baseline Pace Model]")
    model.train_baseline_model(df)
    
    print("\n[Training Degradation Model]")
    model.fit_degradation_model(df)
    
    print("\n✅ Training Complete. Models saved to app/models/")

if __name__ == "__main__":
    train_production_models()
