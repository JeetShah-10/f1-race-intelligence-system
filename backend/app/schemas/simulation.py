from pydantic import BaseModel
from typing import List

class DriverInput(BaseModel):
    driver: str
    team: str
    grid_position: int
    compound: str
    tyre_life: int
    avg_lap_time: float | None
    std_lap_time: float | None
    num_laps: int
    finished: int

class SimulationRequest(BaseModel):
    drivers: List[DriverInput]
    track_temp: float
    air_temp: float
    session_type: str
    lap_count: int
    # Making these optional for now
    speed_st: float | None = None
    speed_fl: float | None = None
    circuit: str | None = None
    weather: str | None = None
