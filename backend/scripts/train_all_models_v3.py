# backend/scripts/train_all_models_v3.py
"""
Unified model training script v3.

Fetches 99K+ laps from Supabase `fastf1_training_data` and trains ALL models:
  1. Baseline lap-time model      -> baseline_pace_model.pkl
  2. Degradation model             -> degradation_model.pkl
  3. Sector-time model (v1)        -> race_pace_v1.pkl
  4. Race rank model (ensemble)    -> race_rank_model_v0.pkl
  5. Label encoders                -> label_encoders.pkl, sector_label_encoders.pkl

Usage:
    cd backend
    python scripts/train_all_models_v3.py
"""

import sys
import os
import json
from pathlib import Path
from datetime import datetime

import numpy as np
import pandas as pd
import lightgbm as lgb
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor, VotingRegressor
from sklearn.neural_network import MLPRegressor
from sklearn.pipeline import Pipeline
from dotenv import load_dotenv

# ---------- Paths ----------
ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")
MODEL_DIR = ROOT / "app" / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = (
    os.getenv("SUPABASE_SERVICE_KEY")
    or os.getenv("SUPABASE_KEY")
    or os.getenv("SUPABASE_ANON_KEY")
)

# Output paths (must match pace_model.py expectations)
BASELINE_MODEL_PATH   = MODEL_DIR / "baseline_pace_model.pkl"
DEGRADATION_MODEL_PATH = MODEL_DIR / "degradation_model.pkl"
LABEL_ENCODERS_PATH   = MODEL_DIR / "label_encoders.pkl"
SECTOR_MODEL_PATH     = MODEL_DIR / "race_pace_v1.pkl"
SECTOR_ENCODERS_PATH  = MODEL_DIR / "sector_label_encoders.pkl"
RANK_MODEL_PATH       = MODEL_DIR / "race_rank_model_v0.pkl"
META_PATH             = MODEL_DIR / "pace_model_v2_meta.json"


# ============================================================
# HISTORICAL driver -> team mapping (2022-2025 race data)
#
# These are the teams each driver actually raced for when the
# training data was recorded. At inference time, the separate
# driver_mapping.py module translates 2026 grid assignments
# (e.g. PER@Cadillac) to these historical team labels.
#
# 2026 Grid (for reference - handled by driver_mapping.py):
#   McLaren: NOR, PIA       Red Bull: VER, HAD
#   Ferrari: LEC, HAM       Mercedes: RUS, ANT
#   Williams: ALB, SAI      Racing Bulls: LAW, LIN
#   Aston Martin: ALO, STR  Haas: OCO, BEA
#   Audi: HUL, BOR          Alpine: GAS, COL
#   Cadillac: BOT, PER
# ============================================================
DRIVER_TEAM_MAP = {
    # Drivers on 2025/2024 grid (historical team they raced for)
    "ver": "Red Bull Racing",
    "per": "Red Bull Racing",   # 2026: Cadillac (mapped by driver_mapping.py)
    "lec": "Ferrari",
    "ham": "Mercedes",          # 2026: Ferrari (mapped by driver_mapping.py)
    "nor": "McLaren",
    "pia": "McLaren",
    "rus": "Mercedes",
    "ant": "Mercedes",
    "alo": "Aston Martin",
    "str": "Aston Martin",
    "gas": "Alpine",
    "col": "Alpine",
    "alb": "Williams",
    "sai": "Ferrari",           # 2026: Williams (mapped by driver_mapping.py)
    "law": "AlphaTauri",        # 2026: Racing Bulls
    "had": "Red Bull Racing",
    "hul": "Haas",              # 2026: Audi (mapped by driver_mapping.py)
    "bor": "Alfa Romeo",        # 2026: Audi (mapped by driver_mapping.py)
    "oco": "Alpine",            # 2026: Haas (mapped by driver_mapping.py)
    "bea": "Haas",
    "bot": "Alfa Romeo",        # 2026: Cadillac (mapped by driver_mapping.py)
    # Historical drivers (no longer on 2026 grid)
    "ric": "McLaren",
    "tsu": "AlphaTauri",
    "doo": "Alpine",
    "mag": "Haas",
    "vet": "Aston Martin",
    "msc": "Haas",
    "lat": "Williams",
    "dev": "AlphaTauri",
    "sar": "Williams",
    "zho": "Alfa Romeo",
}


# ============================================================
# 1. FETCH DATA
# ============================================================
def fetch_training_data() -> pd.DataFrame:
    """Fetch all 99K+ rows from Supabase fastf1_training_data table."""
    from supabase import create_client

    print("   Connecting to Supabase...")
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)

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
            print(f"   Fetched {offset:,} rows...")

    print(f"   Total rows fetched: {len(all_rows):,}")
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
        "grid_position": "GridPosition",
    }
    df = df.rename(columns=column_map)

    # Map driver -> team using historical lookup
    df["Team"] = df["Driver"].map(DRIVER_TEAM_MAP).fillna("Unknown")
    unknown_count = (df["Team"] == "Unknown").sum()
    if unknown_count > 0:
        unknown_drivers = df[df["Team"] == "Unknown"]["Driver"].unique()
        print(f"   [!] {unknown_count} rows have unknown team: {unknown_drivers}")

    return df


# ============================================================
# 2. CLEAN DATA
# ============================================================
def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and filter training data."""
    initial = len(df)

    # Remove rows with no lap time
    df = df[df["LapTime"].notna() & (df["LapTime"] > 0)]

    # Filter unrealistic lap times (<60s or >200s)
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
    pct = removed / initial * 100 if initial > 0 else 0
    print(f"   Cleaned: {removed:,} rows removed ({pct:.1f}%), {len(df):,} remaining")
    return df


# ============================================================
# 3. TRAIN BASELINE LAP-TIME MODEL
# ============================================================
def train_baseline(df: pd.DataFrame) -> tuple:
    """Train LightGBM baseline lap-time model."""
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

    print(f"   Features: {available}")
    print(f"   Train: {len(X_train):,}, Val: {len(X_val):,}")

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
    print(f"\n   Feature Importance:")
    for feat, imp in sorted_imp:
        print(f"     {feat:20s} -> {imp}")

    return model, label_encoders, rmse, mae


# ============================================================
# 4. TRAIN DEGRADATION MODEL
# ============================================================
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
        print(f"     {d:5s} -> {', '.join(parts)}")

    return degradation_slopes


# ============================================================
# 5. TRAIN SECTOR-TIME MODEL
# ============================================================
def prepare_sector_features(df: pd.DataFrame) -> pd.DataFrame:
    """Melt S1/S2/S3 into long format + add fuel/traffic features."""
    # Calculate fuel load (110kg start, 1.6kg/lap burn)
    df = df.copy()
    df["FuelLoad"] = np.maximum(0.0, 110.0 - (df["LapNumber"] - 1) * 1.6)

    # TyreAge = TyreLife
    df["TyreAge"] = df["TyreLife"].fillna(0)

    # Simple traffic index (midfield = higher traffic)
    if "Position" in df.columns:
        total_cars = 20
        mid = total_cars / 2
        df["TrafficIndex"] = df["Position"].apply(
            lambda p: max(0.0, min(1.0, 1.0 - abs(p - mid) / mid)) if pd.notna(p) else 0.0
        )
        # Reduce traffic for leader and tail
        df.loc[df["Position"] <= 3, "TrafficIndex"] *= 0.3
        df.loc[df["Position"] >= total_cars - 2, "TrafficIndex"] *= 0.3
    else:
        df["TrafficIndex"] = 0.0

    # Melt sector times into long format
    sectors = []
    for sector_num, col_name in [(1, "Sector1Time"), (2, "Sector2Time"), (3, "Sector3Time")]:
        if col_name not in df.columns:
            continue
        chunk = df[["CircuitKey", "Compound", "TyreAge", "FuelLoad",
                     "TrafficIndex", "Driver", "Team", col_name]].copy()
        chunk["Sector"] = sector_num
        chunk = chunk.rename(columns={col_name: "SectorTime"})
        chunk = chunk.dropna(subset=["SectorTime"])
        # Filter unrealistic sector times
        chunk = chunk[(chunk["SectorTime"] > 15) & (chunk["SectorTime"] < 60)]
        sectors.append(chunk)

    if sectors:
        return pd.concat(sectors, ignore_index=True)
    return pd.DataFrame()


def train_sector_model(df: pd.DataFrame) -> tuple:
    """Train LightGBM sector-time model on melted S1/S2/S3 data."""
    sector_features = ["CircuitKey", "Compound", "TyreAge", "FuelLoad",
                       "TrafficIndex", "Sector", "Driver", "Team"]
    target = "SectorTime"

    X = df[sector_features].copy()
    y = df[target].copy()

    # Label encode categoricals
    sector_label_encoders = {}
    for col in ["CircuitKey", "Compound", "Driver", "Team"]:
        le = LabelEncoder()
        X[col] = X[col].astype(str)
        X[col] = le.fit_transform(X[col])
        sector_label_encoders[col] = le

    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

    print(f"   Features: {sector_features}")
    print(f"   Train: {len(X_train):,}, Val: {len(X_val):,}")
    print(f"   Unique circuits: {df['CircuitKey'].nunique()}")

    model = lgb.LGBMRegressor(
        objective="regression",
        random_state=42,
        n_estimators=300,
        learning_rate=0.05,
        num_leaves=63,
        max_depth=8,
        min_child_samples=20,
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

    print(f"\n   Sector Model Results:")
    print(f"     RMSE: {rmse:.4f}s")
    print(f"     MAE:  {mae:.4f}s")

    return model, sector_label_encoders, rmse, mae


# ============================================================
# 6. TRAIN RANK MODEL (Ensemble)
# ============================================================
def aggregate_race_stats(df: pd.DataFrame) -> pd.DataFrame:
    """
    Aggregate lap-level data to race-level driver statistics.
    
    IMPORTANT: The features produced here MUST match exactly what
    prediction_service.py expects in self.feature_columns:
      ["grid_position", "avg_lap_time", "std_lap_time", "num_laps", "finished"]
    """
    # Filter valid laps only
    df_valid = df[(df["LapTime"] > 60) & (df["LapTime"] < 160)].copy()

    if len(df_valid) < 100:
        print("   [!] Not enough valid laps for rank model aggregation")
        return pd.DataFrame()

    # Aggregate per driver per race
    race_stats = df_valid.groupby(["year", "round", "Driver"]).agg(
        avg_lap_time=("LapTime", "mean"),
        std_lap_time=("LapTime", "std"),
        num_laps=("LapTime", "count"),
        laps_completed=("LapNumber", "max"),
    ).reset_index()

    # Grid position from first lap
    grid_info = df_valid.groupby(["year", "round", "Driver"])["Position"].first().reset_index()
    grid_info.columns = ["year", "round", "Driver", "grid_position"]

    # Final position
    final_info = df_valid.groupby(["year", "round", "Driver"])["Position"].last().reset_index()
    final_info.columns = ["year", "round", "Driver", "final_position"]

    race_stats = race_stats.merge(grid_info, on=["year", "round", "Driver"], how="left")
    race_stats = race_stats.merge(final_info, on=["year", "round", "Driver"], how="left")

    # Finished metric (completed > 90% of max laps in that race)
    max_laps = df_valid.groupby(["year", "round"])["LapNumber"].max().reset_index()
    max_laps.columns = ["year", "round", "max_laps"]
    race_stats = race_stats.merge(max_laps, on=["year", "round"], how="left")
    race_stats["finished"] = ((race_stats["laps_completed"] / race_stats["max_laps"]) > 0.90).astype(int)

    # Fill NaN
    race_stats["std_lap_time"] = race_stats["std_lap_time"].fillna(race_stats["std_lap_time"].mean())

    return race_stats


def generate_synthetic_data(df: pd.DataFrame, num_samples: int = 1000) -> pd.DataFrame:
    """Generate synthetic race scenarios to augment the dataset."""
    synthetic_rows = []
    for _ in range(num_samples):
        base_row = df.sample(1).iloc[0].copy()
        noise_level = np.random.uniform(0.98, 1.02)
        base_row["avg_lap_time"] *= noise_level
        base_row["std_lap_time"] *= np.random.uniform(0.9, 1.1)
        grid_shift = np.random.randint(-2, 3)
        base_row["grid_position"] = np.clip(base_row["grid_position"] + grid_shift, 1, 22)
        base_row["num_laps"] = max(10, base_row["num_laps"] + np.random.randint(-3, 4))
        if np.random.random() < 0.05:
            base_row["finished"] = 1 - base_row["finished"]
        synthetic_rows.append(base_row)
    return pd.DataFrame(synthetic_rows)


def train_rank_model(df: pd.DataFrame) -> tuple:
    """
    Train ensemble rank model on race-level aggregated stats.
    
    Features MUST match prediction_service.py feature_columns:
      ["grid_position", "avg_lap_time", "std_lap_time", "num_laps", "finished"]
    """
    feature_cols = ["grid_position", "avg_lap_time", "std_lap_time",
                    "num_laps", "finished"]
    target = "final_position"

    # Filter valid rows
    race_stats = df.dropna(subset=feature_cols + [target])

    if len(race_stats) < 50:
        print("   [!] Not enough valid race entries for rank model")
        return None, 0, 0

    # Generate synthetic data
    synthetic = generate_synthetic_data(race_stats[feature_cols + [target]], num_samples=1000)
    combined = pd.concat([race_stats, synthetic], axis=0, ignore_index=True)

    print(f"   Real: {len(race_stats):,}, Synthetic: {len(synthetic):,}, Combined: {len(combined):,}")

    X = combined[feature_cols]
    y = combined[target]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Ensemble
    gb_reg = GradientBoostingRegressor(n_estimators=150, learning_rate=0.05, max_depth=4, random_state=42)
    rf_reg = RandomForestRegressor(n_estimators=150, max_depth=None, random_state=42)
    mlp_reg = Pipeline([
        ("scaler", StandardScaler()),
        ("mlp", MLPRegressor(hidden_layer_sizes=(64, 32), max_iter=500, random_state=42))
    ])

    ensemble = VotingRegressor(
        estimators=[("gb", gb_reg), ("rf", rf_reg), ("mlp", mlp_reg)],
        weights=[0.35, 0.40, 0.25],
    )

    ensemble.fit(X_train, y_train)

    train_r2 = ensemble.score(X_train, y_train)
    test_r2 = ensemble.score(X_test, y_test)

    print(f"\n   Rank Model Results:")
    print(f"     Train R²: {train_r2:.4f}")
    print(f"     Test R²:  {test_r2:.4f}")

    return ensemble, train_r2, test_r2


# ============================================================
# MAIN
# ============================================================
def main():
    print("=" * 60)
    print("  F1 Unified Model Training v3")
    print(f"  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    if not SUPABASE_URL or not SUPABASE_KEY:
        print("[!] Missing SUPABASE_URL or SUPABASE_KEY in .env")
        sys.exit(1)

    # ---- 1. Fetch data ----
    print("\n[1/6] Fetching training data from Supabase...")
    df = fetch_training_data()
    print(f"   Total rows: {len(df):,}")
    print(f"   Years: {sorted(df['year'].unique())}")
    print(f"   Circuits: {df['CircuitKey'].nunique()}")
    print(f"   Drivers: {df['Driver'].nunique()}")
    print(f"   Teams: {df['Team'].nunique()}")

    # ---- 2. Clean data ----
    print("\n[2/6] Cleaning data...")
    df_clean = clean_data(df)

    # ---- 3. Baseline model ----
    print("\n[3/6] Training baseline lap-time model (LightGBM)...")
    baseline_model, label_encoders, bl_rmse, bl_mae = train_baseline(df_clean)

    # ---- 4. Degradation model ----
    print("\n[4/6] Training degradation models (per driver × compound)...")
    degradation_slopes = train_degradation(df_clean)

    # ---- 5. Sector model ----
    print("\n[5/6] Training sector-time model (race_pace_v1)...")
    sector_df = prepare_sector_features(df_clean)
    print(f"   Melted sector rows: {len(sector_df):,}")
    if len(sector_df) > 100:
        sector_model, sector_encoders, sec_rmse, sec_mae = train_sector_model(sector_df)
    else:
        print("   [!] Not enough sector data. Skipping sector model.")
        sector_model, sector_encoders, sec_rmse, sec_mae = None, {}, 0, 0

    # ---- 6. Rank model ----
    print("\n[6/6] Training rank model (Ensemble)...")
    race_stats = aggregate_race_stats(df_clean)
    print(f"   Race-level entries: {len(race_stats):,}")
    if len(race_stats) > 50:
        rank_model, rank_train_r2, rank_test_r2 = train_rank_model(race_stats)
    else:
        print("   [!] Not enough race data. Skipping rank model.")
        rank_model, rank_train_r2, rank_test_r2 = None, 0, 0

    # ---- Save ----
    print("\n" + "=" * 60)
    print("  Saving models...")
    print("=" * 60)

    joblib.dump(baseline_model, BASELINE_MODEL_PATH)
    print(f"   -> {BASELINE_MODEL_PATH}")

    joblib.dump(label_encoders, LABEL_ENCODERS_PATH)
    print(f"   -> {LABEL_ENCODERS_PATH}")

    joblib.dump(degradation_slopes, DEGRADATION_MODEL_PATH)
    print(f"   -> {DEGRADATION_MODEL_PATH}")

    if sector_model is not None:
        joblib.dump(sector_model, SECTOR_MODEL_PATH)
        joblib.dump(sector_encoders, SECTOR_ENCODERS_PATH)
        print(f"   -> {SECTOR_MODEL_PATH}")
        print(f"   -> {SECTOR_ENCODERS_PATH}")

    if rank_model is not None:
        joblib.dump(rank_model, RANK_MODEL_PATH)
        print(f"   -> {RANK_MODEL_PATH}")

    # Save metadata
    meta = {
        "version": "v3",
        "trained_on": "Supabase fastf1_training_data (99K+ rows)",
        "trained_at": datetime.now().isoformat(),
        "total_samples": len(df),
        "cleaned_samples": len(df_clean),
        "sector_samples": len(sector_df),
        "years": sorted(int(y) for y in df["year"].unique()),
        "circuits": int(df["CircuitKey"].nunique()),
        "drivers": int(df["Driver"].nunique()),
        "baseline": {"rmse": round(bl_rmse, 4), "mae": round(bl_mae, 4)},
        "sector": {"rmse": round(sec_rmse, 4), "mae": round(sec_mae, 4)},
        "rank": {"train_r2": round(rank_train_r2, 4), "test_r2": round(rank_test_r2, 4)},
        "features_baseline": ["Compound", "TyreLife", "Driver", "Team", "SpeedST", "SpeedFL", "LapNumber"],
        "features_sector": ["CircuitKey", "Compound", "TyreAge", "FuelLoad", "TrafficIndex", "Sector", "Driver", "Team"],
    }
    with open(META_PATH, "w") as f:
        json.dump(meta, f, indent=2)
    print(f"   -> {META_PATH}")

    # Summary
    print("\n" + "=" * 60)
    print("   Training Complete!")
    print(f"   Baseline: RMSE {bl_rmse:.4f}s | MAE {bl_mae:.4f}s")
    print(f"   Sector:   RMSE {sec_rmse:.4f}s | MAE {sec_mae:.4f}s")
    print(f"   Rank:     Train R² {rank_train_r2:.4f} | Test R² {rank_test_r2:.4f}")
    print(f"   Samples:  {len(df_clean):,} laps | {len(sector_df):,} sector rows")
    print("=" * 60)


if __name__ == "__main__":
    main()
