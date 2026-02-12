# backend/scripts/train_models.py
"""
Train production ML models using multi-circuit data.

Trains:
  1. Baseline pace model (LightGBM) — predicts full lap time
  2. Tyre degradation model per compound × circuit
  3. Sector-time model (race_pace_v1) — predicts S1/S2/S3 individually

Usage:
    python scripts/train_models.py [--data-dir data/raw]
"""

import pandas as pd
import numpy as np
import sys
import os
import glob
import argparse

# Setup Paths
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(ROOT_DIR)

from app.ml.pace_model import PaceModel
from app.ml.features import prepare_features, prepare_sector_features


def load_all_data(data_dir: str) -> pd.DataFrame:
    """Load all circuit parquet files into a single DataFrame."""
    parquet_files = glob.glob(os.path.join(data_dir, '*_laps.parquet'))

    if not parquet_files:
        # Try the old single-file format
        legacy_path = os.path.join(data_dir, 'Bahrain_2021_2023_laps.parquet')
        if os.path.exists(legacy_path):
            print(f"  📂 Using legacy data: {legacy_path}")
            return pd.read_parquet(legacy_path)
        return pd.DataFrame()

    frames = []
    for f in parquet_files:
        try:
            df = pd.read_parquet(f)
            frames.append(df)
            print(f"  📂 Loaded {os.path.basename(f)}: {len(df)} laps")
        except Exception as e:
            print(f"  ❌ Error loading {f}: {e}")

    if frames:
        combined = pd.concat(frames, ignore_index=True)
        print(f"\n  📊 Total dataset: {len(combined)} laps from {len(frames)} files")
        return combined

    return pd.DataFrame()


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Filter and clean raw data for training."""
    initial_count = len(df)

    # Only use green flag laps (TrackStatus == '1')
    if 'TrackStatus' in df.columns:
        df = df[df['TrackStatus'] == '1'].copy()

    # Fill missing speed columns
    for col in ['SpeedST', 'SpeedFL', 'SpeedI1', 'SpeedI2']:
        if col in df.columns:
            df[col] = df[col].fillna(df[col].mean())

    # Drop laps with missing lap times
    if 'LapTime' in df.columns:
        df = df.dropna(subset=['LapTime'])

    # Remove extreme outliers
    if 'LapTime' in df.columns:
        if hasattr(df['LapTime'].iloc[0], 'total_seconds'):
            df['LapTimeSeconds'] = df['LapTime'].apply(
                lambda x: x.total_seconds() if pd.notna(x) else None
            )
        else:
            df['LapTimeSeconds'] = df['LapTime']
        df = df[(df['LapTimeSeconds'] > 60) & (df['LapTimeSeconds'] < 150)].copy()

    print(f"  🧹 Cleaned: {initial_count} → {len(df)} laps")
    return df


def train_production_models(data_dir: str):
    """Train all production models."""
    print("🧠 Starting Production Model Training...")
    print(f"   Data directory: {data_dir}\n")

    # 1. Load Data
    df = load_all_data(data_dir)
    if df.empty:
        print("❌ No data found. Run fetch_training_data.py first.")
        return

    # 2. Clean Data
    df = clean_data(df)
    if df.empty:
        print("❌ No valid data after cleaning.")
        return

    # 3. Train Models
    model = PaceModel()

    print("\n[1/3] Training Baseline Pace Model...")
    try:
        model.train_baseline_model(df)
        print("  ✅ Baseline model trained and saved.")
    except Exception as e:
        print(f"  ❌ Error training baseline model: {e}")

    print("\n[2/3] Training Degradation Model...")
    try:
        model.fit_degradation_model(df)
        print("  ✅ Degradation model trained and saved.")
    except Exception as e:
        print(f"  ❌ Error training degradation model: {e}")

    print("\n[3/3] Training Sector-Time Model (race_pace_v1)...")
    try:
        # Check if sector times are available in the data
        has_sectors = all(
            col in df.columns
            for col in ['Sector1Time', 'Sector2Time', 'Sector3Time']
        )

        if has_sectors:
            # Prepare sector-level features (melts into long format)
            sector_df = prepare_sector_features(df)

            if not sector_df.empty and len(sector_df) > 100:
                model.train_sector_model(sector_df)
                print("  ✅ Sector model (race_pace_v1) trained and saved.")
            else:
                print(f"  ⚠️ Not enough valid sector data ({len(sector_df)} rows). Skipping.")
        else:
            print("  ⚠️ Sector time columns not found in data. Skipping sector model.")
            print("     Re-run fetch_training_data.py to include Sector1Time/2/3.")
    except Exception as e:
        print(f"  ❌ Error training sector model: {e}")
        import traceback
        traceback.print_exc()

    model_dir = os.path.join(ROOT_DIR, 'app', 'models')
    print(f"\n✅ Training Complete. Models saved to {model_dir}/")

    # List saved files
    if os.path.isdir(model_dir):
        files = os.listdir(model_dir)
        print(f"   Files: {', '.join(files)}")


def main():
    parser = argparse.ArgumentParser(description='Train F1 ML models')
    parser.add_argument('--data-dir', type=str,
                        default=os.path.join(ROOT_DIR, 'data', 'raw'),
                        help='Data directory with parquet files')
    args = parser.parse_args()
    train_production_models(args.data_dir)


if __name__ == "__main__":
    main()
