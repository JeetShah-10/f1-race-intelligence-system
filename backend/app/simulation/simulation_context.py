from dataclasses import dataclass, field
from typing import List
from app.schemas.simulation import DriverInput
from app.schemas.ml_simulation_handoff import MLHandoff
from app.simulation.handoff_validator import validate_ml_handoff

@dataclass
class SimulationContext:
    """
    Encapsulates all configuration required to run a simulation.
    Acts as a single point of truth for simulation state initialization.
    """
    drivers: List[DriverInput]
    weather: str
    circuit: str
    year: int
    lap_count: int
    track_temp: float
    air_temp: float
    ml_handoff: List[MLHandoff]

    def __post_init__(self):
        # Validate ML handoff data on initialization
        validate_ml_handoff(self.ml_handoff)

        # Basic consistency check: Ensure we have handoff data for each driver
        driver_ids = {d.driver for d in self.drivers}
        handoff_ids = {h.driver_id for h in self.ml_handoff}
        
        missing_handoffs = driver_ids - handoff_ids
        if missing_handoffs:
            raise ValueError(f"Missing ML handoff data for drivers: {', '.join(missing_handoffs)}")

