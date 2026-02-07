from pydantic import BaseModel
from typing import Optional

class MLHandoff(BaseModel):
    """
    Data transfer object for ML model outputs
    to be consumed by the simulation engine.
    """
    driver_id: str
    baseline_lap_time: float  # in seconds
    sector_1_pace: Optional[float] = None
    sector_2_pace: Optional[float] = None
    sector_3_pace: Optional[float] = None
    tyre_degradation_slope: Optional[float] = None
