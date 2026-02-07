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

class EventConfig(BaseModel):
    type: str # "SC", "VSC", "RED"
    start_lap: int
    duration: int = 3

class SimulationRequest(BaseModel):
    circuit_id: str
    year: int = 2023
    session_type: str = "R"
    lap_count: int = 57
    track_temp: float = 30.0
    air_temp: float = 25.0
    drivers: List[DriverInput]
    speed_st: float | None = None
    speed_fl: float | None = None
    events: List[EventConfig] = [] # Optional user-defined events

class LapData(BaseModel):
    lap_number: int
    lap_time: float
    position: int
    gap_to_front: float
    tyre_life: int
    compound: str

class DriverResult(BaseModel):
    driver_id: str
    team: str
    final_position: int
    total_time: float
    gap_to_leader: float
    status: str
    lap_data: List[LapData]

class SimulationResult(BaseModel):
    circuit_id: str
    status: str
    total_laps: int
    results: List[DriverResult]
