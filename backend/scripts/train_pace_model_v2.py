# backend/scripts/train_pace_model_v2.py
"""
Enhanced pace model training script (v2).

Fetches real FastF1 data from Supabase `fastf1_training_data` table
(99K+ laps across 2022-2025) and trains:
  1. Baseline lap-time model  -> baseline_pace_model.pkl
  2. Degradation model        -> degradation_model.pkl
  3. Label encoders            -> label_encoders.pkl

Usage:
    cd backend
    python scripts/train_pace_model_v2.py
"""

import sys
import os
import json
from pathlib import Path

import numpy as np
import pandas as pd
import lightgbm as lgb
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn.preprocessing import LabelEncoder
from dotenv import load_dotenv

#  Paths 
ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")
MODEL_DIR = ROOT / "app" / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_ANON_KEY")

# Model output paths (must match pace_model.py expectations)
BASELINE_MODEL_PATH = MODEL_DIR / "baseline_pace_model.pkl"
DEGRADATION_MODEL_PATH = MODEL_DIR / "degradation_model.pkl"
LABEL_ENCODERS_PATH = MODEL_DIR / "label_encoders.pkl"
META_PATH = MODEL_DIR / "pace_model_v2_meta.json"


def fetch_training_data() -> pd.DataFrame:
    """Fetch all training data from Supabase fastf1_training_data table."""
    from supabase import create_client

    print("  Connecting to Supabase...")
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

    # Supabase limits to 1000 rows per request - paginate
    all_rows = []
    page_size = 1000
    offset = 0

    while True:
        resp = (
            sb.table("fastf1_training_data")
            .select("*")
            .range(offset, offset + page_size - 1)
            .execute()
        )
        rows = resp.data
        if not rows:
            break
        all_rows.extend(rows)
        offset += page_size
        if len(rows) < page_size:
            break
        if offset % 10000 == 0:
            print(f"  Fetched {offset} rows...")

    print(f"  Total rows fetched: {len(all_rows)}")
    df = pd.DataFrame(all_rows)

    # Remap column names to match PaceModel expectations
    column_map = {
        "lap_time_seconds": "LapTime",
        "driver_id": "Driver",
        "compound": "Compound",
        "tyre_life": "TyreLife",
        "lap_number": "LapNumber",
        "speed_trap": "SpeedST",
        "finish_line_speed": "SpeedFL",
        "circuit_id": "CircuitKey",
        "sector1_seconds": "Sector1Time",
        "sector2_seconds": "Sector2Time",
        "sector3_seconds": "Sector3Time",
        "air_temp": "AirTemp",
        "track_temp": "TrackTemp",
        "rainfall": "Rainfall",
        "position": "Position",
    }
    df = df.rename(columns=column_map)

    # We need a Team column - derive from driver-team mapping in 2026_season.json
    # or just use the driver as a proxy (the model learns per-driver anyway)
    # For now, use driver as team proxy since historical data doesn't have team
    if "Team" not in df.columns:
        df["Team"] = df["Driver"]  # Will be label-encoded anyway

    return df


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and filter training data."""
    initial = len(df)

    # Remove rows with no lap time
    df = df[df["LapTime"].notna() & (df["LapTime"] > 0)]

    # Filter unrealistic lap times (< 60s or > 200s)
    df = df[(df["LapTime"] >= 60) & (df["LapTime"] <= 200)]

    # Filter unrealistic tyre life
    df = df[df["TyreLife"].notna() & (df["TyreLife"] >= 0) & (df["TyreLife"] <= 60)]

    # Ensure compound is valid
    valid_compounds = {"SOFT", "MEDIUM", "HARD", "INTERMEDIATE", "WET"}
    df = df[df["Compound"].isin(valid_compounds)]

    # Fill NaN speed values with 0
    for col in ["SpeedST", "SpeedFL"]:
        if col in df.columns:
            df[col] = df[col].fillna(0)

    removed = initial - len(df)
    print(f"  Cleaned: {removed} rows removed ({removed/initial*100:.1f}%), {len(df)} remaining")
    return df


def train_baseline(df: pd.DataFrame) -> tuple:
    """Train the baseline lap time prediction model."""
    features = ["Compound", "TyreLife", "Driver", "Team", "SpeedST", "SpeedFL", "LapNumber"]
    available = [f for f in features if f in df.columns]

    X = df[available].copy()
    y = df["LapTime"].copy()

    # Label encode categoricals
    label_encoders = {}
    for col in ["Driver", "Team", "Compound"]:
        if col in X.columns:
            le = LabelEncoder()
            X[col] = X[col].astype(str)
            X[col] = le.fit_transform(X[col])
            label_encoders[col] = le

    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

    print(f"  Features: {available}")
    print(f"  Train: {len(X_train)}, Val: {len(X_val)}")

    model = lgb.LGBMRegressor(
        objective="regression",
        random_state=42,
        n_estimators=300,
        num_leaves=63,
        max_depth=8,
        learning_rate=0.05,
        feature_fraction=0.8,
        bagging_fraction=0.8,
        bagging_freq=5,
    )
    model.fit(
        X_train, y_train,
        eval_set=[(X_val, y_val)],
        eval_metric="rmse",
        callbacks=[lgb.early_stopping(30), lgb.log_evaluation(50)],
    )

    preds = model.predict(X_val)
    rmse = np.sqrt(mean_squared_error(y_val, preds))
    mae = mean_absolute_error(y_val, preds)

    print(f"\n   Baseline Model Results:")
    print(f"     RMSE: {rmse:.4f}s")
    print(f"     MAE:  {mae:.4f}s")

    # Feature importance
    importance = dict(zip(available, model.feature_importances_))
    sorted_imp = sorted(importance.items(), key=lambda x: x[1], reverse=True)
    print(f"\n  Feature Importance:")
    for feat, imp in sorted_imp:
        print(f"    {feat:20s} -> {imp}")

    return model, label_encoders, rmse, mae


def train_degradation(df: pd.DataFrame) -> dict:
    """Train per-driver per-compound degradation slopes."""
    degradation_slopes = {}

    for driver in df["Driver"].unique():
        degradation_slopes[driver] = {}
        for compound in df["Compound"].unique():
            subset = df[(df["Driver"] == driver) & (df["Compound"] == compound)]
            subset = subset[subset["LapTime"] < subset["LapTime"].quantile(0.95)]
            if len(subset) > 5:
                try:
                    m, c = np.polyfit(subset["TyreLife"], subset["LapTime"], 1)
                    if m < 0:
                        m = 0.01
                    degradation_slopes[driver][compound] = round(m, 4)
                except Exception:
                    degradation_slopes[driver][compound] = 0.05
            else:
                degradation_slopes[driver][compound] = 0.05

    n_drivers = len(degradation_slopes)
    n_compounds = sum(len(v) for v in degradation_slopes.values())
    print(f"   Degradation models: {n_drivers} drivers × {n_compounds} total slopes")

    # Print sample
    sample_drivers = list(degradation_slopes.keys())[:5]
    for d in sample_drivers:
        slopes = degradation_slopes[d]
        parts = [f"{c}: {s:.3f}s/lap" for c, s in sorted(slopes.items())]
        print(f"    {d:5s} -> {', '.join(parts)}")

    return degradation_slopes


def main():
    print("=" * 60)
    print("  F1 Pace Model v2 - Training on Real FastF1 Data")
    print("=" * 60)

    if not SUPABASE_URL or not SUPABASE_KEY:
        print(" Missing SUPABASE_URL or SUPABASE_KEY in .env")
        sys.exit(1)

    # 1. Fetch data
    print("\n[1/5] Fetching training data from Supabase...")
    df = fetch_training_data()
    print(f"  Total rows: {len(df)}")
    print(f"  Years: {sorted(df['year'].unique())}")
    print(f"  Circuits: {df['CircuitKey'].nunique()}")
    print(f"  Drivers: {df['Driver'].nunique()}")

    # 2. Clean
    print("\n[2/5] Cleaning data...")
    df = clean_data(df)

    # 3. Train baseline model
    print("\n[3/5] Training baseline lap-time model (LightGBM)...")
    model, label_encoders, rmse, mae = train_baseline(df)

    # 4. Train degradation model
    print("\n[4/5] Training degradation models (per driver × compound)...")
    degradation_slopes = train_degradation(df)

    # 5. Save everything
    print("\n[5/5] Saving models...")
    joblib.dump(model, BASELINE_MODEL_PATH)
    print(f"  -> {BASELINE_MODEL_PATH}")

    joblib.dump(label_encoders, LABEL_ENCODERS_PATH)
    print(f"  -> {LABEL_ENCODERS_PATH}")

    joblib.dump(degradation_slopes, DEGRADATION_MODEL_PATH)
    print(f"  -> {DEGRADATION_MODEL_PATH}")

    # Save metadata
    meta = {
        "version": "v2",
        "trained_on": "Supabase fastf1_training_data",
        "samples": len(df),
        "years": sorted(df["year"].unique().tolist()),
        "circuits": df["CircuitKey"].nunique(),
        "drivers": df["Driver"].nunique(),
        "rmse": round(rmse, 4),
        "mae": round(mae, 4),
        "features": ["Compound", "TyreLife", "Driver", "Team", "SpeedST", "SpeedFL", "LapNumber"],
    }
    with open(META_PATH, "w") as f:
        json.dump(meta, f, indent=2)
    print(f"  -> {META_PATH}")

    print("\n" + "=" * 60)
    print("   Training complete!")
    print(f"  RMSE: {rmse:.4f}s | MAE: {mae:.4f}s | Samples: {len(df)}")
    print("=" * 60)


if __name__ == "__main__":
    main()
