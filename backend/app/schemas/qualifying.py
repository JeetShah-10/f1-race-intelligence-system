from pydantic import BaseModel
from typing import List, Optional
from app.schemas.simulation import DriverInput

class QualifyingRequest(BaseModel):
    circuit_id: str
    year: int = 2026
    weather: str = "DRY"
    track_temp: float = 30.0
    air_temp: float = 25.0
    drivers: List[DriverInput] = []
    grid: str | None = None  # "current_2026" preset

    def model_post_init(self, __context):
        # Populate grid preset if drivers list is empty
        # Source of truth: frontend/src/data/f1-data.ts (2026 Grid)
        if not self.drivers and self.grid == "current_2026":
            self.drivers = [
                # McLaren
                DriverInput(driver="NOR", team="McLaren", grid_position=1, compound="SOFT"),
                DriverInput(driver="PIA", team="McLaren", grid_position=2, compound="SOFT"),
                # Red Bull Racing
                DriverInput(driver="VER", team="Red Bull Racing", grid_position=3, compound="SOFT"),
                DriverInput(driver="HAD", team="Red Bull Racing", grid_position=4, compound="SOFT"),
                # Ferrari
                DriverInput(driver="LEC", team="Ferrari", grid_position=5, compound="SOFT"),
                DriverInput(driver="HAM", team="Ferrari", grid_position=6, compound="SOFT"),
                # Mercedes
                DriverInput(driver="RUS", team="Mercedes", grid_position=7, compound="SOFT"),
                DriverInput(driver="ANT", team="Mercedes", grid_position=8, compound="SOFT"),
                # Williams
                DriverInput(driver="ALB", team="Williams", grid_position=9, compound="SOFT"),
                DriverInput(driver="SAI", team="Williams", grid_position=10, compound="SOFT"),
                # Racing Bulls
                DriverInput(driver="LAW", team="Racing Bulls", grid_position=11, compound="SOFT"),
                DriverInput(driver="LIN", team="Racing Bulls", grid_position=12, compound="SOFT"),
                # Aston Martin
                DriverInput(driver="ALO", team="Aston Martin", grid_position=13, compound="SOFT"),
                DriverInput(driver="STR", team="Aston Martin", grid_position=14, compound="SOFT"),
                # Haas
                DriverInput(driver="OCO", team="Haas", grid_position=15, compound="SOFT"),
                DriverInput(driver="BEA", team="Haas", grid_position=16, compound="SOFT"),
                # Audi
                DriverInput(driver="HUL", team="Audi", grid_position=17, compound="SOFT"),
                DriverInput(driver="BOR", team="Audi", grid_position=18, compound="SOFT"),
                # Alpine
                DriverInput(driver="GAS", team="Alpine", grid_position=19, compound="SOFT"),
                DriverInput(driver="COL", team="Alpine", grid_position=20, compound="SOFT"),
                # Cadillac
                DriverInput(driver="BOT", team="Cadillac", grid_position=21, compound="SOFT"),
                DriverInput(driver="PER", team="Cadillac", grid_position=22, compound="SOFT"),
            ]

class QualifyingResultItem(BaseModel):
    driver_id: str
    team: str
    position: int
    q1_time: float | None = None
    q2_time: float | None = None
    q3_time: float | None = None
    best_time: float | None = None
    gap_to_pole: float | None = None

class QualifyingResult(BaseModel):
    circuit_id: str
    weather: str
    results: List[QualifyingResultItem]
