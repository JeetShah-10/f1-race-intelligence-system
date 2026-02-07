# backend/app/simulation/driver_state.py

class DriverState:
    """
    Represents the mutable race state of a single driver.
    This object is updated lap-by-lap by the RaceEngine.
    """

    def __init__(
        self,
        driver_id: str,
        team: str,
        grid_position: int,
        base_pace: float,
        consistency: float = 0.95,
        reliability: float = 0.95
    ):
        # Identity
        self.driver_id = driver_id
        self.team = team

        # Skills & Reliability
        self.consistency = consistency
        self.reliability = reliability

        # Race position
        self.grid_position = grid_position
        self.position = grid_position

        # Pace (from ML baseline)
        self.base_pace = base_pace
        self.tyre_degradation_slope = 0.0

        # Time tracking
        self.current_time = 0.0
        self.last_lap_time = None
        self.lap_times = []

        # Tire state
        self.tire_compound = None
        self.tire_age = 0
        self.current_stint = 1

        # Status flags
        self.is_running = True
        self.has_dnf = False
        self.in_pit = False

        # Event tracking
        self.pit_stops = []
        self.events = []

    def record_event(self, event_type: str, lap: int, metadata: dict = None):
        self.events.append({
            "lap": lap,
            "type": event_type,
            "metadata": metadata or {}
        })
