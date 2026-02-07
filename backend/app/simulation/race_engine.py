# backend/app/simulation/race_engine.py
import random
from app.simulation.driver_state import DriverState
from app.simulation.lap_snapshot import LapSnapshot
from app.schemas.ml_simulation_handoff import MLHandoff
from app.schemas.simulation import DriverInput
from app.simulation.simulation_context import SimulationContext
from typing import List



from app.simulation.events import RaceEvent, EventManager
from app.simulation.crash_model import CrashModel
from app.services.season_config_service import SeasonConfigService
from app.simulation.events import SafetyCarEvent

class RaceEngine:
    """
    Deterministic race simulation engine.
    This class is responsible for race progression logic,
    NOT machine learning.
    """

    def __init__(self, ctx: SimulationContext):
        """
        ctx: SimulationContext - Encapsulated simulation configuration
        """
        self.weather = ctx.weather
        self.circuit = ctx.circuit
        self.lap_count = ctx.lap_count
        self.current_lap = 0
        
        # Centralized RNG for determinism
        self.rng = random.Random()
        
        # Simulation Flags (SC, Red Flag, etc)
        self.flags = {}

        # Debug/Invariant checking (False by default for production performance)
        self.CHECK_INVARIANTS = False
        
        # Internal state history
        self.snapshots: List[LapSnapshot] = []
        
        # Event Manager handles the lifecycle of race events
        self.event_manager = EventManager()
        
        # Register Core Strategy Events
        from app.simulation.events import PitStopEvent
        self.event_manager.register_event(PitStopEvent())

        # Logic Services
        self.crash_model = CrashModel()
        self.season_config = SeasonConfigService()

        # Create a lookup for the ML handoff data
        self.ml_data = {h.driver_id: h for h in ctx.ml_handoff}

        # Initialize DriverState objects
        self.drivers = []
        for d in ctx.drivers:
            # MANDATORY: ML Handoff Validation
            if d.driver not in self.ml_data:
                raise ValueError(f"ML data missing for driver: {d.driver}")

            ml_stats = self.ml_data[d.driver]

            # Determine Consistency & Reliability (2026 Logic)
            d_cfg = self.season_config.get_driver_config(d.driver)
            d_mods = d_cfg.get("performance_modifiers", {}) if d_cfg else {}
            
            t_cfg = self.season_config.get_team_config(d.team)
            t_mods = t_cfg.get("performance_modifiers", {}) if t_cfg else {}

            # Defaults: 0.95 base + modifier
            consistency = 0.95 * d_mods.get("consistency", 1.0)
            # Reliability is often defined as "0.85" in config, so let's use that directly if present, else 0.98 default
            reliability = t_mods.get("reliability_score", 0.98)

            driver_state = DriverState(
                driver_id=d.driver, # Mapping DriverInput.driver -> DriverState.driver_id
                team=d.team,
                grid_position=d.grid_position,
                base_pace=ml_stats.baseline_lap_time,
                consistency=consistency,
                reliability=reliability
            )
            driver_state.tyre_degradation_slope = ml_stats.tyre_degradation_slope
            driver_state.tire_compound = d.compound # ensure initial compound is set
            self.drivers.append(driver_state)

        self.driver_map = {driver.driver_id: driver for driver in self.drivers}


    from typing import Generator

    def run(self):
        """
        Main race loop (Batch Mode).
        Executes the stream to completion.
        """
        for _ in self.stream():
            pass
        return self.final_results()

    def stream(self) -> Generator[LapSnapshot, None, None]:
        """
        Generator that yields race state lap-by-lap.
        Used for Real-Time/WebSocket streaming.
        """
        self.initialize_race()

        if self.CHECK_INVARIANTS:
            self._check_invariants(lap_idx=0, phase="start")

        for lap in range(1, self.lap_count + 1):
            self._begin_lap(lap)
            self._process_events(lap)
            self._process_lap(lap)
            self._update_standings(lap)
            self._end_lap(lap)

            if self.CHECK_INVARIANTS:
                self._check_invariants(lap_idx=lap, phase="end_of_lap")
            
            # Yield the latest snapshot
            if self.snapshots:
                yield self.snapshots[-1]
        
        if self.CHECK_INVARIANTS:
            self._check_invariants(lap_idx=self.lap_count, phase="finish")
        
    def _process_events(self, lap: int):
        """
        Check for and trigger any events scheduled for this lap.
        Delegates to EventManager.
        """
        self.event_manager.process_scheduled_events(self, lap)

    def _begin_lap(self, lap: int):
        """Start of a new lap."""
        self.current_lap = lap
        self.event_manager.on_lap_start(self, lap)

    def _end_lap(self, lap: int):
        """End of a lap."""
        self.event_manager.on_lap_end(self, lap)

    def _process_lap(self, lap: int):
        """Process simulation logic for all drivers for the current lap."""
        for driver in self.drivers:
            if not driver.is_running:
                continue
                
            # SAFETY CAR OVERRIDE
            if self.flags.get("SC"):
                # Fixed slow lap time (e.g. 120s)
                lap_time = 120.0
                # Still add noise? Maybe less.
                lap_time += self.rng.uniform(-0.5, 0.5)
                self._update_driver_state(driver, lap_time)
                continue

            # 1. Tyre Degradation (Linear)
            degradation = driver.tyre_degradation_slope * driver.tire_age
            
            # 2. Fuel Penalty (Linear Burn)
            # Fuel effect: ~0.03s per lap remaining.
            # Laps remaining = Total - Current
            laps_remaining = self.lap_count - lap
            fuel_penalty = laps_remaining * 0.035
            
            # 3. Random Variance (Gaussian/Normal Distribution)
            random_noise = self.rng.gauss(0, 0.15) # Mean=0, Std=0.15s

            lap_time = driver.base_pace + degradation + fuel_penalty + random_noise
            
            # 4. Apply Pit Stop Penalty
            if driver.in_pit:
                # Add pit loss (e.g. 22s)
                lap_time += getattr(driver, 'pit_penalty', 20.0)
                # Reset flag
                driver.in_pit = False
                driver.pit_penalty = 0.0

            # 4. Check for Crashes/Failures (Dynamic Events)
            # Only check if flag is clear (don't crash under SC ... usually)
            if not self.flags.get("SC"):
                incident = self.crash_model.evaluate_lap(
                    driver_id=driver.driver_id,
                    team_id=driver.team,
                    circuit_id=self.circuit,
                    weather=self.weather,
                    driver_consistency=driver.consistency,
                    reliability_score=driver.reliability
                )

                if incident == "CRASH":
                    print(f"💥 CRASH: {driver.driver_id} Lap {lap}")
                    driver.is_running = False
                    driver.has_dnf = True
                    driver.record_event("CRASH", lap)
                    
                    # Trigger Safety Car (Random duration 2-4 laps)
                    duration = self.rng.randint(2, 4)
                    self.event_manager.register_event(SafetyCarEvent(start_lap=lap + 1, duration=duration))
                    continue

                elif incident == "MECHANICAL":
                    print(f"🔥 ENGINE: {driver.driver_id} Lap {lap}")
                    driver.is_running = False
                    driver.has_dnf = True
                    driver.record_event("MECHANICAL", lap)
                    continue

            self._update_driver_state(driver, lap_time)

    def _update_driver_state(self, driver: DriverState, lap_time: float):
        """Update a single driver's state with the lap result."""
        driver.last_lap_time = lap_time
        driver.lap_times.append(lap_time)
        driver.current_time += lap_time
        driver.tire_age += 1

    def _update_standings(self, lap: int):
        """Update race order at the end of the lap."""
        # Sort by Laps Completed (Desc), then Total Time (Asc)
        sorted_drivers = sorted(self.drivers, key=lambda d: (-len(d.lap_times), d.current_time))
        
        leader_time = sorted_drivers[0].current_time
        
        driver_positions = []
        lap_times = {}
        gaps = {}

        for i, driver in enumerate(sorted_drivers):
            # Update mutable driver state
            driver.position = i + 1
            
            # Capture snapshot data
            driver_positions.append(driver.driver_id)
            lap_times[driver.driver_id] = driver.last_lap_time
            gaps[driver.driver_id] = driver.current_time - leader_time

        # Store immutable snapshot
        snapshot = LapSnapshot(
            lap_number=lap,
            driver_positions=driver_positions,
            lap_times=lap_times,
            gaps_to_leader=gaps
        )
        self.snapshots.append(snapshot)

    def initialize_race(self):
        """
        Prepare race start state.
        (Grid order, initial gaps, tire assignment, etc.)
        """
        for driver in self.drivers:
            driver.current_time = 0.0
            driver.tire_age = 0
            # Simple grid start penalty (0.5s per grid slot)
            driver.current_time += (driver.grid_position - 1) * 0.5


    def final_results(self):
        """
        Return final classification and metadata.
        """
        # Sort by Laps Completed (Desc), then Total Time (Asc)
        sorted_drivers = sorted(self.drivers, key=lambda d: (-len(d.lap_times), d.current_time))
        results = []
        leader_time = sorted_drivers[0].current_time
        for i, driver in enumerate(sorted_drivers):
            results.append({
                "driver_id": driver.driver_id,
                "team": driver.team,
                "position": i + 1,
                "time": driver.current_time,
                "gap_to_leader": driver.current_time - leader_time,
                "lap_times": driver.lap_times,
                "status": "Finished" if driver.is_running else "DNF"
            })

        return {
            "circuit": self.circuit,
            "weather": self.weather,
            "laps": self.lap_count,
            "results": results
        }

    def _check_invariants(self, lap_idx: int, phase: str):
        """
        Pure internal consistency check.
        Raises AssertionError if simulation state violates physical or logical rules.
        """
        import math

        # 1. Driver count consistency
        current_driver_count = len(self.drivers)
        initial_driver_count = len(self.driver_map)
        if current_driver_count != initial_driver_count:
            raise AssertionError(f"Invariant broken: Driver count changed from {initial_driver_count} to {current_driver_count}")

        # 2. State checks per driver
        seen_drivers = set()
        for driver in self.drivers:
            # Uniqueness
            if driver.driver_id in seen_drivers:
                raise AssertionError(f"Invariant broken: Duplicate driver ID {driver.driver_id}")
            seen_drivers.add(driver.driver_id)
            
            # Non-negative time
            if driver.current_time < 0:
                raise AssertionError(f"Invariant broken: Negative current_time for {driver.driver_id}: {driver.current_time}")

            # Lap time validity (if running)
            if driver.is_running and driver.last_lap_time is not None:
                if driver.last_lap_time <= 0:
                    raise AssertionError(f"Invariant broken: Non-positive lap time for {driver.driver_id}: {driver.last_lap_time}")

        # 3. Snapshot consistency (post-lap only)
        if phase == "end_of_lap":
            if not self.snapshots:
                raise AssertionError("Invariant broken: No snapshot created after lap end")
            last_snapshot = self.snapshots[-1]
            if last_snapshot.lap_number != lap_idx:
                raise AssertionError(f"Invariant broken: Snapshot lap number {last_snapshot.lap_number} mismatch with current lap {lap_idx}")
            
            # Gap consistency
            for d_id, gap in last_snapshot.gaps_to_leader.items():
                if math.isnan(gap) or math.isinf(gap):
                    raise AssertionError(f"Invariant broken: NaN or Inf gap for {d_id}")

        # 4. Final state consistency
        if phase == "finish":
             if len(self.snapshots) != self.lap_count:
                 raise AssertionError(f"Invariant broken: Expected {self.lap_count} snapshots, got {len(self.snapshots)}")
