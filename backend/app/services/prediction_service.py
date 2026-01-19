import joblib
import pandas as pd
from pathlib import Path
import numpy as np
from app.schemas.ml_simulation_handoff import MLHandoff
from app.ml.pace_model import PaceModel
from app.schemas.simulation import SimulationRequest

MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "race_rank_model_v0.pkl"

class PredictionService:
    def __init__(self):
        try:
            self.rank_model = joblib.load(MODEL_PATH)
        except (FileNotFoundError, EOFError, ValueError) as e:
            print(f"Error loading rank model: {e}")
            self.rank_model = None

        self.pace_model = PaceModel()
        self.pace_model.load_models()

        # This MUST match Colab feature contract
        self.feature_columns = [
            "grid_position",
            "avg_lap_time",
            "std_lap_time",
            "num_laps",
            "finished"
        ]

    def predict_race_rank(self, drivers: list[dict]):
        df = pd.DataFrame(drivers)

        # enforce column order
        X = df[self.feature_columns].fillna(df.mean(numeric_only=True))

        if self.rank_model:
            predictions = self.rank_model.predict(X)
        else:
            # Dummy prediction logic if model loading failed
            predictions = np.random.permutation(len(X)) + 1
            
        df["predicted_position"] = predictions

        return df.sort_values("predicted_position")

    def get_simulation_handoff(self, request: SimulationRequest) -> list[MLHandoff]:
        """
        Generates a list of MLHandoff objects using the PaceModel.
        """
        handoff_data = []
        for driver in request.drivers:
            baseline_lap_time = self.pace_model.predict_baseline_pace(
                driver=driver.driver,
                compound=driver.compound,
                tyre_life=driver.tyre_life,
                track_temp=request.track_temp,
                air_temp=request.air_temp,
                team=driver.team,
                speed_st=request.speed_st or 0, # Use 0 if not provided
                speed_fl=request.speed_fl or 0, # Use 0 if not provided
                session_type=request.session_type
            )
            
            degradation_slope = self.pace_model.get_degradation_slope(
                driver=driver.driver,
                compound=driver.compound
            )

            handoff = MLHandoff(
                driver_id=driver.driver,
                baseline_lap_time=baseline_lap_time,
                tyre_degradation_slope=degradation_slope
            )
            handoff_data.append(handoff)
        
        return handoff_data