from pydantic import BaseModel
from typing import List

class DriverInput(BaseModel):
    driver: str
    team: str
    grid_position: int
    avg_lap_time: float | None
    std_lap_time: float | None
    num_laps: int
    finished: int

class SimulationRequest(BaseModel):
    drivers: List[DriverInput]
