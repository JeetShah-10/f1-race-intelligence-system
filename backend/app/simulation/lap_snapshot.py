from dataclasses import dataclass
from typing import List, Dict

@dataclass(frozen=True)
class LapSnapshot:
    """
    Immutable snapshot of the race state at the end of a lap.
    Used for internal tracking and history.
    """
    lap_number: int
    driver_positions: List[str]  # Driver IDs in order, 1st to last
    lap_times: Dict[str, float]  # Driver ID -> Lap time for this specific lap
    gaps_to_leader: Dict[str, float]  # Driver ID -> Gap to leader (seconds)
