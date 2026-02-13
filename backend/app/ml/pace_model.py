# backend/app/ml/pace_model.py
"""
PaceModel - LightGBM models for F1 pace prediction.

Two models:
1. Baseline lap-time model (legacy, backwards-compatible)
2. Sector-time model (Master Plan spec: predicts S1/S2/S3 individually)

The sector model uses features: CircuitKey, Compound, TyreAge, FuelLoad,
TrafficIndex, Sector, Driver, Team - as specified in the simulation master plan.
"""

import pandas as pd
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
from pathlib import Path
import numpy as np
from typing import Dict, Any, Optional


MODEL_DIR = Path(__file__).resolve().parent.parent / "models"

# Legacy model paths
BASELINE_MODEL_PATH = MODEL_DIR / "baseline_pace_model.pkl"
DEGRADATION_MODEL_PATH = MODEL_DIR / "degradation_model.pkl"
LABEL_ENCODERS_PATH = MODEL_DIR / "label_encoders.pkl"

# Master Plan model paths
SECTOR_MODEL_PATH = MODEL_DIR / "race_pace_v1.pkl"
SECTOR_ENCODERS_PATH = MODEL_DIR / "sector_label_encoders.pkl"


class PaceModel:
    def __init__(self):
        self.model = None                 # Legacy lap-time model
        self.sector_model = None          # New sector-time model (race_pace_v1)
        self.degradation_models = {}
        self.label_encoders: Dict[str, LabelEncoder] = {}
        self.sector_label_encoders: Dict[str, LabelEncoder] = {}

        # Legacy feature set (lap-time model)
        self.features = [
             "Compound", "TyreLife", "Driver", "Team",
             "SpeedST", "SpeedFL", "LapNumber"
        ]

        # Master Plan feature set (sector-time model)
        self.sector_features = [
            "CircuitKey", "Compound", "TyreAge", "FuelLoad",
            "TrafficIndex", "Sector", "Driver", "Team"
        ]

    # 
    # SECTOR-TIME MODEL (Master Plan - race_pace_v1.pkl)
    # 

    def train_sector_model(self, df: pd.DataFrame):
        """
        Train a LightGBM model to predict individual sector times.

        The input DataFrame should be in long format (one row per sector)
        with columns: CircuitKey, Compound, TyreAge, FuelLoad, TrafficIndex,
        Sector, Driver, Team, SectorTime.

        Use features.prepare_sector_features() to get the right format.
        """
        target = "SectorTime"

        # Validate required columns
        required = self.sector_features + [target]
        missing = [c for c in required if c not in df.columns]
        if missing:
            raise ValueError(f"Missing columns for sector model training: {missing}")

        # Filter out impossible sector times
        df = df[(df[target] > 15) & (df[target] < 60)].copy()

        X = df[self.sector_features].copy()
        y = df[target].copy()

        # Label encode categorical features
        categorical = ["CircuitKey", "Compound", "Driver", "Team"]
        self.sector_label_encoders = {}

        for col in categorical:
            le = LabelEncoder()
            X[col] = X[col].astype(str)
            X[col] = le.fit_transform(X[col])
            self.sector_label_encoders[col] = le

        print(f"  Training sector model on {len(X)} samples")
        print(f"  Features: {self.sector_features}")
        print(f"  Unique circuits: {df['CircuitKey'].nunique()}")

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        model = lgb.LGBMRegressor(
            objective='regression',
            random_state=42,
            n_estimators=200,
            learning_rate=0.05,
            num_leaves=63,
            min_child_samples=20,
        )
        model.fit(
            X_train, y_train,
            eval_set=[(X_test, y_test)],
            eval_metric='rmse',
            callbacks=[lgb.early_stopping(15)]
        )

        self.sector_model = model

        # Save
        MODEL_DIR.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.sector_model, SECTOR_MODEL_PATH)
        joblib.dump(self.sector_label_encoders, SECTOR_ENCODERS_PATH)

        # Report quality
        from sklearn.metrics import mean_absolute_error
        y_pred = model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        print(f"   Sector model MAE: {mae:.3f}s")
        print(f"   Saved to {SECTOR_MODEL_PATH}")

    def predict_sector_time(
        self,
        sector: int,
        driver: str,
        compound: str,
        tyre_age: int,
        team: str,
        circuit: str,
        fuel_load: float = 80.0,
        traffic_index: float = 0.0,
    ) -> float:
        """
        Predict a single sector time using the sector model (race_pace_v1).

        Args:
            sector: 1, 2, or 3
            driver: Driver code (e.g., "VER")
            compound: Tyre compound (e.g., "SOFT")
            tyre_age: Laps on current tyre set
            team: Team name (e.g., "Red Bull Racing")
            circuit: Circuit key (e.g., "bahrain")
            fuel_load: Fuel remaining in kg
            traffic_index: 0.0 (clear air) to 1.0 (heavy traffic)

        Returns:
            Predicted sector time in seconds.
        """
        if self.sector_model is None:
            raise RuntimeError("Sector model (race_pace_v1) not loaded")

        input_data = {
            "CircuitKey": [circuit.lower().replace(' ', '_')],
            "Compound": [compound],
            "TyreAge": [tyre_age],
            "FuelLoad": [fuel_load],
            "TrafficIndex": [traffic_index],
            "Sector": [sector],
            "Driver": [driver],
            "Team": [team],
        }
        df = pd.DataFrame(input_data)

        # Apply label encoding
        for col in ["CircuitKey", "Compound", "Driver", "Team"]:
            if col in self.sector_label_encoders:
                le = self.sector_label_encoders[col]
                df[col] = df[col].astype(str).map(
                    lambda x, _le=le: _le.transform([x])[0] if x in _le.classes_ else -1
                )

        # Ensure all features present and ordered
        for feat in self.sector_features:
            if feat not in df.columns:
                df[feat] = 0
        df = df[self.sector_features]

        try:
            return float(self.sector_model.predict(df)[0])
        except Exception:
            return 30.0  # Safe fallback (~90s lap / 3 sectors)

    # 
    # LEGACY LAP-TIME MODEL (baseline_pace_model.pkl)
    # 

    def train_baseline_model(self, df: pd.DataFrame):
        """Trains a LightGBM regressor to predict full lap times."""
        available_features = [f for f in self.features if f in df.columns]
        target = "LapTime"

        X = df[available_features].copy()

        if df[target].dtype == 'timedelta64[ns]':
            y = df[target].dt.total_seconds()
        else:
            y = df[target]

        categorical_features = [c for c in ["Driver", "Team", "Compound"] if c in X.columns]
        for col in categorical_features:
            le = LabelEncoder()
            X[col] = X[col].astype(str)
            X[col] = le.fit_transform(X[col])
            self.label_encoders[col] = le

        print(f"Training on features: {available_features}")

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        lgbm = lgb.LGBMRegressor(objective='regression', random_state=42, n_estimators=100)
        lgbm.fit(X_train, y_train,
                 eval_set=[(X_test, y_test)],
                 eval_metric='rmse',
                 callbacks=[lgb.early_stopping(10)])

        self.model = lgbm

        MODEL_DIR.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.model, BASELINE_MODEL_PATH)
        joblib.dump(self.label_encoders, LABEL_ENCODERS_PATH)
        print(f"Baseline model trained and saved to {BASELINE_MODEL_PATH}")

    def fit_degradation_model(self, df: pd.DataFrame):
        """Fits a simple linear degradation model per driver × compound."""
        if df['LapTime'].dtype == 'timedelta64[ns]':
            df = df.copy()
            df['LapTime'] = df['LapTime'].dt.total_seconds()

        degradation_slopes = {}
        for driver in df['Driver'].unique():
            degradation_slopes[driver] = {}
            for compound in df['Compound'].unique():
                subset = df[(df['Driver'] == driver) & (df['Compound'] == compound)]
                subset = subset[subset['LapTime'] < subset['LapTime'].quantile(0.95)]
                if len(subset) > 5:
                    try:
                        m, c = np.polyfit(subset['TyreLife'], subset['LapTime'], 1)
                        if m < 0: m = 0.01
                        degradation_slopes[driver][compound] = m
                    except Exception:
                        degradation_slopes[driver][compound] = 0.05
                else:
                    degradation_slopes[driver][compound] = 0.05

        self.degradation_models = degradation_slopes
        joblib.dump(self.degradation_models, DEGRADATION_MODEL_PATH)
        print(f"Degradation models trained and saved to {DEGRADATION_MODEL_PATH}")

    # 
    # MODEL LOADING
    # 

    def load_models(self):
        """Load all available models from disk."""
        if BASELINE_MODEL_PATH.exists():
            self.model = joblib.load(BASELINE_MODEL_PATH)
        if DEGRADATION_MODEL_PATH.exists():
            self.degradation_models = joblib.load(DEGRADATION_MODEL_PATH)
        if LABEL_ENCODERS_PATH.exists():
            self.label_encoders = joblib.load(LABEL_ENCODERS_PATH)
        if SECTOR_MODEL_PATH.exists():
            self.sector_model = joblib.load(SECTOR_MODEL_PATH)
        if SECTOR_ENCODERS_PATH.exists():
            self.sector_label_encoders = joblib.load(SECTOR_ENCODERS_PATH)

        loaded = []
        if self.model: loaded.append("baseline")
        if self.sector_model: loaded.append("sector (race_pace_v1)")
        if self.degradation_models: loaded.append("degradation")
        print(f"Models loaded: {', '.join(loaded) if loaded else 'none'}")

    # 
    # LEGACY PREDICTION (backwards compatible)
    # 

    def predict_baseline_pace(self, driver: str, compound: str, tyre_life: int,
                              team: str, speed_st: float, speed_fl: float, lap_number: int, **kwargs) -> float:
        """Wrapper for MLHandoff / static baseline at lap 1."""
        return self.predict_lap_time(
            driver=driver, compound=compound, tyre_life=tyre_life,
            team=team, speed_st=speed_st, speed_fl=speed_fl,
            lap_number=lap_number
        )

    def predict_lap_time(self, driver: str, compound: str, tyre_life: int,
                         team: str, speed_st: float, speed_fl: float, lap_number: int,
                         circuit: str = "bahrain") -> float:
        """
        Predicts lap time for a single lap.
        
        If sector model is available, sums 3 sector predictions.
        Otherwise falls back to the legacy baseline model.
        """
        # Prefer sector model if available
        if self.sector_model is not None:
            try:
                fuel_load = max(0.0, 110.0 - (lap_number - 1) * 1.6)
                total = 0.0
                for s in [1, 2, 3]:
                    total += self.predict_sector_time(
                        sector=s, driver=driver, compound=compound,
                        tyre_age=tyre_life, team=team,
                        circuit=circuit,
                        fuel_load=fuel_load, traffic_index=0.0,
                    )
                return total
            except Exception:
                pass  # Fall through to legacy

        # Legacy baseline model
        if not self.model:
            raise RuntimeError("Models not loaded")

        input_data = {
            "Compound": [compound],
            "TyreLife": [tyre_life],
            "Driver": [driver],
            "Team": [team],
            "SpeedST": [speed_st],
            "SpeedFL": [speed_fl],
            "LapNumber": [lap_number]
        }
        df = pd.DataFrame(input_data)

        for col in ["Driver", "Team", "Compound"]:
            if col in self.label_encoders:
                le = self.label_encoders[col]
                df[col] = df[col].astype(str).map(
                    lambda x, _le=le: _le.transform([x])[0] if x in _le.classes_ else -1
                )

        df[["SpeedST", "SpeedFL"]] = df[["SpeedST", "SpeedFL"]].fillna(0.0)

        for feat in self.features:
            if feat not in df.columns:
                df[feat] = 0
        df = df[self.features]

        try:
            return float(self.model.predict(df)[0])
        except Exception:
            return 95.0

    def get_degradation_slope(self, driver: str, compound: str) -> float:
        val = self.degradation_models.get(driver, {}).get(compound, 0.05)
        if isinstance(val, dict):
            # Handle legacy format where slope might be stored in a dict
            return float(val.get('coeffs', [0.05])[0]) if isinstance(val.get('coeffs'), (list, np.ndarray)) else 0.05
        try:
            return float(val)
        except (ValueError, TypeError):
            return 0.05

    @property
    def has_sector_model(self) -> bool:
        """Check if the sector-level model is available."""
        return self.sector_model is not None
