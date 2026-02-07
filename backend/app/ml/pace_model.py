import pandas as pd
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
from pathlib import Path
import numpy as np

MODEL_DIR = Path(__file__).resolve().parent.parent / "models"
MODEL_PATH = MODEL_DIR / "baseline_pace_model.pkl"
DEGRADATION_MODEL_PATH = MODEL_DIR / "degradation_model.pkl"
LABEL_ENCODERS_PATH = MODEL_DIR / "label_encoders.pkl"

class PaceModel:
    def __init__(self):
        self.model = None
        self.degradation_models = {}
        self.label_encoders = {}
        
        # Consistent feature list matching Data Probe availability
        self.features = [
            "Compound", "TyreLife", "Driver", "Team", 
             "SessionType", "TrackTemps", "AirTemp" # Original plan
        ]
        # REVISED Feature List based on what we actually fetched (no weather)
        self.features = [
            "Compound", "TyreLife", "Driver", "Team", 
             "SpeedST", "SpeedFL", "LapNumber" 
        ]
        
    def train_baseline_model(self, df: pd.DataFrame):
        """
        Trains a LightGBM regressor to predict baseline lap times.
        """
        # Ensure we have the columns
        available_features = [f for f in self.features if f in df.columns]
        target = "LapTime"

        X = df[available_features]
        # Check for numeric LapTime
        if df[target].dtype == 'timedelta64[ns]':
             y = df[target].dt.total_seconds()
        else:
             y = df[target]

        # Categorical handling
        categorical_features = ["Driver", "Team", "Compound"]
        # Filter categoricals that are actually in X
        categorical_features = [c for c in categorical_features if c in X.columns]
        
        for col in categorical_features:
            le = LabelEncoder()
            # Convert to string to handle mixed types if any
            X[col] = X[col].astype(str)
            X[col] = le.fit_transform(X[col])
            self.label_encoders[col] = le
        
        print(f"Training on features: {available_features}")
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # LightGBM Model
        lgbm = lgb.LGBMRegressor(objective='regression', random_state=42, n_estimators=100)
        lgbm.fit(X_train, y_train,
                 eval_set=[(X_test, y_test)],
                 eval_metric='rmse',
                 callbacks=[lgb.early_stopping(10)])
        
        self.model = lgbm
        
        # Save artifacts
        if not MODEL_DIR.exists():
            MODEL_DIR.mkdir(parents=True)
            
        joblib.dump(self.model, MODEL_PATH)
        joblib.dump(self.label_encoders, LABEL_ENCODERS_PATH)
        print(f"Baseline model trained and saved to {MODEL_PATH}")

    def fit_degradation_model(self, df: pd.DataFrame):
        """
        Fits a simple linear degradation model for each driver and compound.
        """
        # Ensure numeric LapTime
        if df['LapTime'].dtype == 'timedelta64[ns]':
            df['LapTime'] = df['LapTime'].dt.total_seconds()
            
        degradation_slopes = {}

        for driver in df['Driver'].unique():
            degradation_slopes[driver] = {}
            for compound in df['Compound'].unique():
                subset = df[(df['Driver'] == driver) & (df['Compound'] == compound)]
                # Simple filter for outliers
                subset = subset[subset['LapTime'] < subset['LapTime'].quantile(0.95)]
                
                if len(subset) > 5:
                    # Fit line
                    try:
                        m, c = np.polyfit(subset['TyreLife'], subset['LapTime'], 1)
                        # We only care if deg is positive (getting slower)
                        if m < 0: m = 0.01 
                        degradation_slopes[driver][compound] = m
                    except:
                        degradation_slopes[driver][compound] = 0.05
                else:
                    degradation_slopes[driver][compound] = 0.05 # default
        
        self.degradation_models = degradation_slopes
        joblib.dump(self.degradation_models, DEGRADATION_MODEL_PATH)
        print(f"Degradation models trained and saved to {DEGRADATION_MODEL_PATH}")

    def load_models(self):
        if MODEL_PATH.exists():
            self.model = joblib.load(MODEL_PATH)
        if DEGRADATION_MODEL_PATH.exists():
            self.degradation_models = joblib.load(DEGRADATION_MODEL_PATH)
        if LABEL_ENCODERS_PATH.exists():
            self.label_encoders = joblib.load(LABEL_ENCODERS_PATH)
        print("Models loaded.")

    def predict_baseline_pace(self, driver: str, compound: str, tyre_life: int, 
                              team: str, speed_st: float, speed_fl: float, lap_number: int, **kwargs) -> float:
        """
        Predicts baseline pace. kwargs eats unused arguments like air_temp.
        """
        if not self.model:
            raise RuntimeError("Models not loaded")

        # Create single row DF
        # We need to construct it with same columns as training (self.features)
        # But list of features keeps changing. Let's make it robust.
        input_data = {
            "Driver": [driver],
            "Compound": [compound], 
            "TyreLife": [tyre_life],
            "Team": [team],
            "SpeedST": [speed_st],
            "SpeedFL": [speed_fl],
            "LapNumber": [lap_number]
        }
        
        # Only include columns that were in training
        # We need to know what features the model expects. 
        # Ideally we saved feature names, but for MVP we assume fixed list matching __init__
        # Let's filter input_data to match self.features
        
        df = pd.DataFrame(input_data)
        
        # Encode
        for col, le in self.label_encoders.items():
            if col in df.columns:
                # Handle unseen
                df[col] = df[col].astype(str)
                df[col] = df[col].apply(lambda x: le.transform([x])[0] if x in le.classes_ else -1)
        
        # Select features
        df = df[self.features] # This might error if missing cols
        
        try:
            return self.model.predict(df)[0]
        except Exception as e:
            print(f"Prediction error: {e}")
            return 95.0 # fallback
            
    def get_degradation_slope(self, driver: str, compound: str) -> float:
        return self.degradation_models.get(driver, {}).get(compound, 0.05)
