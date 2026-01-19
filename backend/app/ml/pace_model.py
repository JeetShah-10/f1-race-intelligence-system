# c:\Users\DEV\OneDrive\Pictures\Desktop\F1 Meow\backend\app\ml\pace_model.py
import pandas as pd
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
from pathlib import Path
import numpy as np

MODEL_DIR = Path(__file__).resolve().parent
MODEL_PATH = MODEL_DIR / "baseline_pace_model.pkl"
DEGRADATION_MODEL_PATH = MODEL_DIR / "degradation_model.pkl"
LABEL_ENCODERS_PATH = MODEL_DIR / "label_encoders.pkl"

class PaceModel:
    def __init__(self):
        self.model = None
        self.degradation_models = {}
        self.label_encoders = {}

    def train_baseline_model(self, df: pd.DataFrame):
        """
        Trains a LightGBM regressor to predict baseline lap times.
        """
        # Features and Target
        features = [
            "Compound", "TyreLife", "TrackTemp", "AirTemp",
            "Driver", "Team", "SpeedST", "SpeedFL", "SessionType"
        ]
        target = "LapTime"

        X = df[features]
        y = df[target]

        # Categorical features
        categorical_features = ["Driver", "Team", "Compound", "SessionType"]
        for col in categorical_features:
            le = LabelEncoder()
            X[col] = le.fit_transform(X[col])
            self.label_encoders[col] = le
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # LightGBM Model
        lgbm = lgb.LGBMRegressor(objective='regression_l1', random_state=42)
        lgbm.fit(X_train, y_train,
                 eval_set=[(X_test, y_test)],
                 eval_metric='mae',
                 callbacks=[lgb.early_stopping(10)])
        
        self.model = lgbm
        joblib.dump(self.model, MODEL_PATH)
        joblib.dump(self.label_encoders, LABEL_ENCODERS_PATH)
        print(f"Baseline model trained and saved to {MODEL_PATH}")

    def fit_degradation_model(self, df: pd.DataFrame):
        """
        Fits a simple linear degradation model for each driver and compound.
        """
        # LapTime = base + (deg_slope * TyreLife)
        degradation_slopes = {}

        for driver in df['Driver'].unique():
            degradation_slopes[driver] = {}
            for compound in df['Compound'].unique():
                subset = df[(df['Driver'] == driver) & (df['Compound'] == compound)]
                if len(subset) > 2:
                    # Fit a linear model: y = mx + c where y=LapTime, x=TyreLife
                    m, c = np.polyfit(subset['TyreLife'], subset['LapTime'], 1)
                    degradation_slopes[driver][compound] = m
                else:
                    # Default degradation if not enough data
                    degradation_slopes[driver][compound] = 0.02 # default slope
        
        self.degradation_models = degradation_slopes
        joblib.dump(self.degradation_models, DEGRADATION_MODEL_PATH)
        print(f"Degradation models trained and saved to {DEGRADATION_MODEL_PATH}")


    def load_models(self):
        """Loads all models from disk."""
        if MODEL_PATH.exists():
            self.model = joblib.load(MODEL_PATH)
        if DEGRADATION_MODEL_PATH.exists():
            self.degradation_models = joblib.load(DEGRADATION_MODEL_PATH)
        if LABEL_ENCODERS_PATH.exists():
            self.label_encoders = joblib.load(LABEL_ENCODERS_PATH)
        print("Models loaded.")

    def predict_baseline_pace(self, driver: str, compound: str, tyre_life: int, track_temp: float, air_temp: float, 
                                team: str, speed_st: float, speed_fl: float, session_type: str) -> float:
        """
        Predicts the baseline pace for a single lap.
        """
        if not self.model or not self.label_encoders:
            raise RuntimeError("Models are not loaded. Call load_models() first.")

        # Create a dataframe for prediction
        data = {
            "Driver": [driver], "Compound": [compound], "TyreLife": [tyre_life],
            "TrackTemp": [track_temp], "AirTemp": [air_temp], "Team": [team],
            "SpeedST": [speed_st], "SpeedFL": [speed_fl], "SessionType": [session_type]
        }
        df = pd.DataFrame(data)

        # Apply label encoding
        for col, le in self.label_encoders.items():
            # Handling unseen labels during prediction
            df[col] = df[col].apply(lambda x: le.transform([x])[0] if x in le.classes_ else -1)

        prediction = self.model.predict(df)
        return prediction[0]

    def get_degradation_slope(self, driver: str, compound: str) -> float:
        """
        Gets the tyre degradation slope for a driver and compound.
        """
        return self.degradation_models.get(driver, {}).get(compound, 0.02)
