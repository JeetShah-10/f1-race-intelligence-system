# backend/app/simulation/lap_snapshot.py
from dataclasses import dataclass, field
from typing import List, Dict, Optional


@dataclass(frozen=True)
class LapSnapshot:
    """
    Immutable snapshot of the race state at the end of a lap.
    Used for internal tracking, history, and WebSocket streaming.
    
    Contains everything needed to render one "frame" of the race.
    """
    lap_number: int
    
    # Standings
    driver_positions: List[str]              # Driver IDs in order, P1 to last
    lap_times: Dict[str, float]              # driver_id -> lap time for this lap
    gaps_to_leader: Dict[str, float]         # driver_id -> gap to leader (seconds)
    intervals: Dict[str, float]              # driver_id -> gap to car directly ahead (seconds)
    
    # Sector Data
    sector_times: Dict[str, List[float]]     # driver_id -> [S1, S2, S3] times
    
    # Tyre Data
    tyre_compounds: Dict[str, str]           # driver_id -> compound name
    tyre_ages: Dict[str, int]                # driver_id -> tyre age in laps
    
    # Pit Stops
    pit_stop_counts: Dict[str, int]          # driver_id -> total pit stops
    
    # Race Status
    sc_status: str = "CLEAR"                 # CLEAR, SC, VSC, RED_FLAG
    weather: str = "DRY"
    track_temp: float = 30.0
    
    # Metadata (for drivers who DNF'd on this lap)
    dnf_this_lap: List[str] = field(default_factory=list)
