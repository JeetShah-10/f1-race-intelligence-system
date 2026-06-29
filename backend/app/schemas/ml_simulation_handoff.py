from pydantic import BaseModel
from typing import Optional, List

class MLHandoff(BaseModel):
    """
    Data transfer object for ML model outputs
    to be consumed by the simulation engine.
    
    This is the Contract between 'Data Scientist' and 'Simulation Engineer'.
    """
    driver_id: str
    
    # Pace Model
    baseline_lap_time: float  # Base seconds (e.g., 92.5) for a 'perfect' lap on fresh tyres
    
    # Tyre Model
    initial_tyre_life: float = 0.0
    tyre_degradation_slope: float = 0.1  # Seconds lost per lap of age
    tyre_compound: str = "SOFT"
    
    # Variance Model (The "Human Factor")
    pace_variance: float = 0.2  # Standard deviation in seconds
    mistake_probability: float = 0.01  # Chance of a major error (+5s)
    
    # Reliability / DNF Model
    dnf_probability: float = 0.001
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "driver_id": "VER",
                "baseline_lap_time": 91.5,
                "initial_tyre_life": 3.0,
                "tyre_degradation_slope": 0.08,
                "tyre_compound": "C3",
                "pace_variance": 0.15,
                "mistake_probability": 0.005,
                "dnf_probability": 0.0001
            }
        }
    }
