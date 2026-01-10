import joblib
import pandas as pd
from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "race_rank_model_v0.pkl"

class RaceRankPredictor:
    def __init__(self):
        try:
            self.model = joblib.load(MODEL_PATH)
        except (FileNotFoundError, EOFError, ValueError) as e:
            print(f"Error loading model: {e}")
            print("Using a dummy model that returns random predictions.")
            self.model = None

        # This MUST match Colab feature contract
        self.feature_columns = [
            "grid_position",
            "avg_lap_time",
            "std_lap_time",
            "num_laps",
            "finished"
        ]

    def predict(self, drivers: list[dict]):
        df = pd.DataFrame(drivers)

        # enforce column order
        X = df[self.feature_columns].fillna(df.mean(numeric_only=True))

        if self.model:
            predictions = self.model.predict(X)
        else:
            # Dummy prediction logic if model loading failed
            import numpy as np
            predictions = np.random.permutation(len(X)) + 1
            
        df["predicted_position"] = predictions

        return df.sort_values("predicted_position")