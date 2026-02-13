# backend/app/simulation/driver_state.py

from typing import List, Optional


class DriverState:
    """
    Represents the mutable race state of a single driver.
    This object is updated sector-by-sector and lap-by-lap by the RaceEngine.
    
    Fields are grouped into:
      - Identity (immutable after init)
      - Skills & Ratings (static per race)
      - Race Position (dynamic)
      - Pace & Time (dynamic)  
      - Tyre State (dynamic)
      - Fuel State (dynamic)
      - Sector Tracking (dynamic, reset each lap)
      - Proximity / DRS (dynamic)
      - Status Flags (dynamic)
      - Event History (append-only)
    """

    def __init__(
        self,
        driver_id: str,
        team: str,
        grid_position: int,
        base_pace: float,
        consistency: float = 0.95,
        reliability: float = 0.95,
        aggression: float = 0.5,
        skill_rating: float = 0.0,
        defending_skill: float = 0.5,
        overtaking_skill: float = 0.5,
    ):
        #  Identity 
        self.driver_id = driver_id
        self.team = team

        #  Skills & Ratings (static per race) 
        self.consistency = consistency
        self.reliability = reliability
        self.aggression = aggression          # 0.0 = conservative, 1.0 = ultra-aggressive
        self.skill_rating = skill_rating      # derived from raw_pace modifier (negative = faster)
        self.defending_skill = defending_skill # 0.0 = easy to pass, 1.0 = impenetrable
        self.overtaking_skill = overtaking_skill # 0.0 = hesitant, 1.0 = clinical

        #  Race Position 
        self.grid_position = grid_position
        self.position = grid_position

        #  Pace (from ML baseline) 
        self.base_pace = base_pace
        self.tyre_degradation_slope = 0.0

        #  Time Tracking 
        self.current_time = 0.0
        self.last_lap_time: Optional[float] = None
        self.lap_times: List[float] = []

        #  Tyre State 
        self.tire_compound: Optional[str] = None
        self.tire_age = 0
        self.current_stint = 1
        self.tyre_health = 1.0               # 1.0 = fresh, 0.0 = destroyed (non-linear)
        self.total_pit_stops = 0

        #  Fuel State 
        self.fuel_load = 110.0                # kg at race start (F1 typical ~110kg)

        #  Sector Tracking (reset each lap) 
        self.current_sector = 0               # 0 = not started, 1/2/3 during lap
        self.sector_times: List[float] = []   # [S1, S2, S3] for the current lap
        self.best_sector_times: List[Optional[float]] = [None, None, None]

        #  Proximity / DRS 
        self.gap_to_car_ahead = 999.0         # seconds
        self.is_in_drs = False
        self.laps_behind_car = 0              # consecutive laps stuck behind car ahead

        #  Status Flags 
        self.is_running = True
        self.has_dnf = False
        self.in_pit = False
        self.pit_penalty = 0.0

        #  Event History 
        self.pit_stops: List[dict] = []
        self.events: List[dict] = []

    #  Helper Methods 

    def reset_sectors(self):
        """Reset sector data for a new lap."""
        self.current_sector = 0
        self.sector_times = []

    def record_sector(self, sector_time: float):
        """Record a sector time and advance the sector counter."""
        self.sector_times.append(sector_time)
        self.current_sector = len(self.sector_times)
        # Update personal best
        idx = self.current_sector - 1
        if idx < 3:
            if self.best_sector_times[idx] is None or sector_time < self.best_sector_times[idx]:
                self.best_sector_times[idx] = sector_time

    def record_event(self, event_type: str, lap: int, metadata: dict = None):
        self.events.append({
            "lap": lap,
            "type": event_type,
            "metadata": metadata or {}
        })

    def burn_fuel(self, kg_per_lap: float = 1.6):
        """Burn fuel for one lap. Fuel load cannot go below 0."""
        self.fuel_load = max(0.0, self.fuel_load - kg_per_lap)

    def degrade_tyres(self, wear_amount: float):
        """
        Reduce tyre health. Uses exponential curve so last 20% of life
        degrades much faster than first 80%.
        """
        self.tyre_health = max(0.0, self.tyre_health - wear_amount)

    @property
    def is_on_cliff(self) -> bool:
        """Returns True if tyres are in the 'cliff' zone (< 15% health)."""
        return self.tyre_health < 0.15

    @property
    def tyre_pace_penalty(self) -> float:
        """
        Non-linear tyre degradation penalty.
        Gentle at high health, steep cliff at low health.
        Uses exponential: penalty = A * e^(B * (1 - health)) - A
        """
        import math
        A = 0.1
        B = 4.0
        penalty = A * (math.exp(B * (1.0 - self.tyre_health)) - 1.0)
        return min(penalty, 10.0)  # cap at 10s to prevent runaway

    def __repr__(self):
        status = "" if self.is_running else ""
        return (
            f"{status} P{self.position} {self.driver_id} "
            f"[{self.tire_compound or '?'} age:{self.tire_age} hp:{self.tyre_health:.0%}] "
            f"fuel:{self.fuel_load:.0f}kg gap:{self.gap_to_car_ahead:.1f}s"
        )
