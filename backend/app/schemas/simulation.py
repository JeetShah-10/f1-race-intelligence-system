# backend/app/schemas/simulation.py
"""
Pydantic schemas for simulation request/response.
Enriched with sector times, tyre data, and event tracking.
"""

from pydantic import BaseModel
from typing import List, Optional


class DriverInput(BaseModel):
    """Input data for a single driver in the simulation."""
    driver: str
    team: str
    grid_position: int
    compound: str = "MEDIUM"
    tyre_life: int = 0
    avg_lap_time: float | None = None
    std_lap_time: float | None = None
    num_laps: int = 0
    finished: int = 1


class EventConfig(BaseModel):
    """User-defined race event (SC, VSC, Red Flag, Weather)."""
    type: str          # "SC", "VSC", "RED_FLAG", "WEATHER"
    start_lap: int
    duration: int = 3
    new_weather: str | None = None  # For weather change events


class SimulationRequest(BaseModel):
    """Full simulation request with all parameters.
    
    Accepts both internal naming (circuit_id) and guide-spec naming (trackId).
    """
    circuit_id: str = ""
    circuit: str | None = None        # Alias for circuit_id (backwards compat)
    trackId: str | None = None        # Guide-spec alias for circuit_id
    year: int = 2026
    session_type: str = "R"
    lap_count: int = 57
    weather: str = "DRY"
    track_temp: float = 30.0
    air_temp: float = 25.0
    drivers: List[DriverInput] = []   # Can be empty when using grid preset
    grid: str | None = None           # Grid preset name, e.g. "current_2026"
    speed_st: float | None = None
    speed_fl: float | None = None
    events: List[EventConfig] = []

    def model_post_init(self, __context):
        # Resolve trackId -> circuit_id
        if self.trackId and not self.circuit_id:
            self.circuit_id = self.trackId
        elif not self.circuit_id and not self.trackId:
            self.circuit_id = "unknown"
        # Ensure circuit is populated from circuit_id
        if self.circuit is None:
            self.circuit = self.circuit_id

        # Populate grid preset if drivers list is empty
        if not self.drivers and self.grid == "current_2026":
            # 2026 Official Grid - Source of truth: frontend/src/data/f1-data.ts
            self.drivers = [
                # McLaren
                DriverInput(driver="NOR", team="McLaren", grid_position=1, compound="MEDIUM"),
                DriverInput(driver="PIA", team="McLaren", grid_position=2, compound="MEDIUM"),
                # Red Bull Racing
                DriverInput(driver="VER", team="Red Bull Racing", grid_position=3, compound="MEDIUM"),
                DriverInput(driver="HAD", team="Red Bull Racing", grid_position=4, compound="MEDIUM"),
                # Ferrari
                DriverInput(driver="LEC", team="Ferrari", grid_position=5, compound="MEDIUM"),
                DriverInput(driver="HAM", team="Ferrari", grid_position=6, compound="MEDIUM"),
                # Mercedes
                DriverInput(driver="RUS", team="Mercedes", grid_position=7, compound="HARD"),
                DriverInput(driver="ANT", team="Mercedes", grid_position=8, compound="HARD"),
                # Williams
                DriverInput(driver="ALB", team="Williams", grid_position=9, compound="HARD"),
                DriverInput(driver="SAI", team="Williams", grid_position=10, compound="HARD"),
                # Racing Bulls
                DriverInput(driver="LAW", team="Racing Bulls", grid_position=11, compound="HARD"),
                DriverInput(driver="LIN", team="Racing Bulls", grid_position=12, compound="HARD"),
                # Aston Martin
                DriverInput(driver="ALO", team="Aston Martin", grid_position=13, compound="HARD"),
                DriverInput(driver="STR", team="Aston Martin", grid_position=14, compound="HARD"),
                # Haas
                DriverInput(driver="OCO", team="Haas", grid_position=15, compound="HARD"),
                DriverInput(driver="BEA", team="Haas", grid_position=16, compound="HARD"),
                # Audi
                DriverInput(driver="HUL", team="Audi", grid_position=17, compound="HARD"),
                DriverInput(driver="BOR", team="Audi", grid_position=18, compound="HARD"),
                # Alpine
                DriverInput(driver="GAS", team="Alpine", grid_position=19, compound="HARD"),
                DriverInput(driver="COL", team="Alpine", grid_position=20, compound="HARD"),
                # Cadillac
                DriverInput(driver="BOT", team="Cadillac", grid_position=21, compound="HARD"),
                DriverInput(driver="PER", team="Cadillac", grid_position=22, compound="HARD"),
            ]


class LapData(BaseModel):
    """Per-lap data for a driver in the simulation result."""
    lap: int
    time: float
    sector_1: float | None = None
    sector_2: float | None = None
    sector_3: float | None = None
    compound: str = "MEDIUM"
    tyre_age: int = 0

    # Backwards-compatible aliases
    @property
    def lap_number(self) -> int:
        return self.lap

    @property
    def lap_time(self) -> float:
        return self.time


class DriverResult(BaseModel):
    """Complete result for a single driver."""
    driver_id: str
    team: str
    position: int
    total_time: float
    gap_to_leader: float
    status: str                        # "Finished" or "DNF"
    laps: List[LapData]
    total_pit_stops: int = 0
    pit_stops: List[dict] = []
    events: List[dict] = []

    # Backwards-compatible aliases
    @property
    def final_position(self) -> int:
        return self.position

    @property
    def lap_data(self) -> List[LapData]:
        return self.laps


class SimulationResult(BaseModel):
    """Complete simulation result."""
    circuit: str
    weather: str = "DRY"
    total_laps: int
    results: List[DriverResult]

    # Backwards compat
    @property
    def circuit_id(self) -> str:
        return self.circuit

    @property
    def status(self) -> str:
        return "completed"
