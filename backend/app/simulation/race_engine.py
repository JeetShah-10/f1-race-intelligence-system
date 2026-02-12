# backend/app/simulation/race_engine.py
"""
Deterministic F1 Race Simulation Engine — Sector-Based Architecture.

The engine processes each lap in 3 sector ticks. Within each sector:
  1. Calculate sector time using Hybrid Physics (ML + Game State)
  2. Check for overtakes in DRS zones
  3. Evaluate incidents
  
Between laps, the engine:
  1. Evaluates StrategyAI pit decisions
  2. Burns fuel
  3. Degrades tyres (non-linear)
  4. Updates standings and gaps
  5. Yields a LapSnapshot for streaming
"""

import random
import math
from typing import List, Generator, Dict, Optional, Any

from app.simulation.driver_state import DriverState
from app.simulation.lap_snapshot import LapSnapshot
from app.simulation.simulation_context import SimulationContext
from app.simulation.events import EventManager, SafetyCarEvent, VSCEvent
from app.simulation.crash_model import CrashModel
from app.simulation.overtake_model import OvertakeModel, apply_overtake
from app.simulation.strategy_ai import StrategyAI, COMPOUND_DATA
from app.services.season_config_service import SeasonConfigService
from app.schemas.ml_simulation_handoff import MLHandoff
from app.schemas.simulation import DriverInput


# ── Constants ──
SECTORS_PER_LAP = 3
FUEL_BURN_PER_LAP = 1.6        # kg
DIRTY_AIR_THRESHOLD = 1.5      # seconds — within this gap, driver loses downforce
DIRTY_AIR_PENALTY = 0.3        # seconds per lap penalty in dirty air
SC_LAP_TIME = 120.0            # fixed slow pace during Safety Car
VSC_PACE_MULTIPLIER = 1.40     # 40% slower during VSC
GRID_START_PENALTY = 0.5       # seconds per grid slot at start


class RaceEngine:
    """
    Deterministic race simulation engine with sector-level physics.
    
    Orchestrates: sector time calculation, overtaking, tyre degradation,
    fuel burn, strategy decisions, safety cars, and incident handling.
    """

    def __init__(self, ctx: SimulationContext):
        self.weather = ctx.weather
        self.circuit = ctx.circuit
        self.lap_count = ctx.lap_count
        self.track_temp = getattr(ctx, 'track_temp', 30.0)
        self.air_temp = getattr(ctx, 'air_temp', 25.0)
        self.current_lap = 0

        # ── Centralized RNG for determinism ──
        self.rng = random.Random()

        # ── Race Flags ──
        self.flags: Dict[str, bool] = {}

        # ── Invariant checking ──
        self.CHECK_INVARIANTS = False

        # ── State history ──
        self.snapshots: List[LapSnapshot] = []

        # ── Event Manager ──
        self.event_manager = EventManager()

        # ── Logic Services ──
        self.crash_model = CrashModel()
        self.overtake_model = OvertakeModel(rng=self.rng)
        self.strategy_ai = StrategyAI(rng=self.rng)
        self.season_config = SeasonConfigService()
        
        # ── ML Integration ──
        from app.ml.tyre_model import BayesianTyreModel
        self.tyre_model = BayesianTyreModel()
        
        self.pace_model = ctx.pace_model  # Dynamic ML Model
        # Fallback data if model is missing
        self.ml_data = {h.driver_id: h for h in ctx.ml_handoff} if ctx.ml_handoff else {}

        # ── Initialize Drivers ──
        self.drivers: List[DriverState] = []
        for d in ctx.drivers:
            # Stats fallback
            handoff = self.ml_data.get(d.driver)
            baseline_pace = handoff.baseline_lap_time if handoff else 90.0
            deg_slope = handoff.tyre_degradation_slope if handoff else 0.05

            d_cfg = self.season_config.get_driver_config(d.driver)
            d_mods = d_cfg.get("performance_modifiers", {}) if d_cfg else {}
            t_cfg = self.season_config.get_team_config(d.team)
            t_mods = t_cfg.get("performance_modifiers", {}) if t_cfg else {}

            # Derive driver attributes from config
            consistency = d_mods.get("consistency", 0.90)
            reliability = t_mods.get("reliability_score", 0.95)
            raw_pace = d_mods.get("raw_pace", 0.0)
            
            # Aggression: derived from consistency (less consistent = more aggressive)
            aggression = max(0.1, min(1.0, 1.0 - consistency + 0.2))
            
            # Defending skill: correlated with consistency and experience
            defending_skill = max(0.2, min(0.95, consistency * 0.8 + 0.1))
            
            # Overtaking skill: correlated with aggression and pace
            overtaking_skill = max(0.2, min(0.98, aggression * 0.7 + 0.2))

            driver_state = DriverState(
                driver_id=d.driver,
                team=d.team,
                grid_position=d.grid_position,
                base_pace=baseline_pace, # Used as fallback or reference
                consistency=consistency,
                reliability=reliability,
                aggression=aggression,
                skill_rating=raw_pace,
                defending_skill=defending_skill,
                overtaking_skill=overtaking_skill,
            )
            driver_state.tyre_degradation_slope = deg_slope
            driver_state.tire_compound = (d.compound or "MEDIUM").upper()
            
            # Register with StrategyAI
            self.strategy_ai.register_driver(d.driver, driver_state.tire_compound)
            
            self.drivers.append(driver_state)

        self.driver_map = {d.driver_id: d for d in self.drivers}

    # ──────────────────────────────────────────────────────────────────────────
    # PUBLIC API
    # ──────────────────────────────────────────────────────────────────────────

    def run(self):
        """Batch Mode — run to completion and return final results."""
        for _ in self.stream():
            pass
        return self.final_results()

    def stream(self) -> Generator[LapSnapshot, None, None]:
        """
        Generator that yields race state lap-by-lap.
        Each lap is processed as 3 sector ticks internally.
        """
        self.initialize_race()

        if self.CHECK_INVARIANTS:
            self._check_invariants(lap_idx=0, phase="start")

        for lap in range(1, self.lap_count + 1):
            self._begin_lap(lap)
            self._process_events(lap)
            self._process_lap(lap)
            self._evaluate_strategy(lap)
            self._update_standings(lap)
            self._end_lap(lap)

            if self.CHECK_INVARIANTS:
                self._check_invariants(lap_idx=lap, phase="end_of_lap")

            if self.snapshots:
                yield self.snapshots[-1]

        if self.CHECK_INVARIANTS:
            self._check_invariants(lap_idx=self.lap_count, phase="finish")

    # ──────────────────────────────────────────────────────────────────────────
    # INITIALIZATION
    # ──────────────────────────────────────────────────────────────────────────

    def initialize_race(self):
        """Set up race start state: grid positions, initial gaps."""
        for driver in self.drivers:
            driver.current_time = 0.0
            driver.tire_age = 0
            driver.tyre_health = 1.0
            driver.fuel_load = 110.0
            # Grid start penalty
            driver.current_time += (driver.grid_position - 1) * GRID_START_PENALTY

    # ──────────────────────────────────────────────────────────────────────────
    # LAP LIFECYCLE
    # ──────────────────────────────────────────────────────────────────────────

    def _begin_lap(self, lap: int):
        self.current_lap = lap
        for driver in self.drivers:
            if driver.is_running:
                driver.reset_sectors()
        self.event_manager.on_lap_start(self, lap)

    def _end_lap(self, lap: int):
        self.event_manager.on_lap_end(self, lap)

    def _process_events(self, lap: int):
        self.event_manager.process_scheduled_events(self, lap)

    # ──────────────────────────────────────────────────────────────────────────
    # CORE SIMULATION — SECTOR-BASED
    # ──────────────────────────────────────────────────────────────────────────

    def _process_lap(self, lap: int):
        """
        Process one complete lap for all drivers.
        Internally ticks through 3 sectors for higher-fidelity physics.
        """
        # Track which drivers DNF this lap
        dnf_this_lap = []

        for driver in self.drivers:
            if not driver.is_running:
                continue

            # ── Red Flag: Skip simulation ──
            if self.flags.get("RED_FLAG"):
                # Effectively a caution lap — very slow
                sector_time = SC_LAP_TIME / SECTORS_PER_LAP
                for s in range(1, SECTORS_PER_LAP + 1):
                    driver.record_sector(sector_time + self.rng.uniform(-0.1, 0.1))
                lap_time = sum(driver.sector_times)
                self._update_driver_state(driver, lap_time)
                continue

            # ── Safety Car Override ──
            if self.flags.get("SC"):
                sector_time = SC_LAP_TIME / SECTORS_PER_LAP
                for s in range(1, SECTORS_PER_LAP + 1):
                    driver.record_sector(sector_time + self.rng.uniform(-0.1, 0.1))
                lap_time = sum(driver.sector_times)
                self._update_driver_state(driver, lap_time)
                continue

            # ── Normal / VSC Lap ──
            # Check for crash BEFORE processing sectors
            if not self.flags.get("SC") and not self.flags.get("VSC"):
                incident = self._check_incident(driver, lap)
                if incident:
                    dnf_this_lap.append(driver.driver_id)
                    continue

            # Process 3 sectors
            
            # ── Bayesian Tyre Model Prediction (Per Lap) ──
            # Calculate lap performance impact once per lap
            pred_impact, uncertainty, tyre_info = self.tyre_model.predict_next_lap(
                 driver_id=driver.driver_id,
                 current_lap=lap,
                 compound=driver.tire_compound or "MEDIUM",
                 laps_on_tyre=driver.tire_age,
                 track_condition=self.weather
            )
            
            # Store for usage in sectors (divide by 3)
            driver.current_lap_mod = pred_impact / SECTORS_PER_LAP
            
            # Store effective wear for degradation step
            driver.current_lap_wear = tyre_info.get('effective_deg', 0.05)

            for sector in range(1, SECTORS_PER_LAP + 1):
                sector_time = self._calculate_sector_time(driver, sector, lap)
                driver.record_sector(sector_time)

                # Overtake check (only in non-SC/VSC conditions)
                if not self.flags.get("SC") and not self.flags.get("VSC"):
                    self._check_overtake(driver, sector, lap)

            lap_time = sum(driver.sector_times)

            # ── VSC Pace Cap ──
            if self.flags.get("VSC"):
                min_vsc_time = driver.base_pace * VSC_PACE_MULTIPLIER
                if lap_time < min_vsc_time:
                    lap_time = min_vsc_time + self.rng.uniform(-0.3, 0.3)

            # ── Pit Stop Penalty ──
            if driver.in_pit:
                lap_time += driver.pit_penalty
                driver.in_pit = False
                driver.pit_penalty = 0.0

            self._update_driver_state(driver, lap_time)

        # ── Post-lap: Fuel burn & tyre degradation ──
        for driver in self.drivers:
            if not driver.is_running:
                continue
            driver.burn_fuel(FUEL_BURN_PER_LAP)
            self._degrade_tyres(driver)
            driver.tire_age += 1

    def _calculate_sector_time(self, driver: DriverState, sector: int, lap: int) -> float:
        """
        Calculate sector time using Hybrid Physics.
        
        Method A (Sector ML Model — race_pace_v1 — Preferred):
           T_sector = ML_Predict_Sector(Circuit, Compound, TyreAge, FuelLoad,
                                         TrafficIndex, Sector, Driver, Team)
                    + δ_traffic (game-state dirty-air on top)
                    + ε (noise)

        Method B (Legacy ML — baseline_pace_model):
           T_sector = ML_Predict_LapTime(Driver, Compound, ...) × sector_weight
                    + δ_traffic + ε

        Method C (GLM Fallback):
           T_sector = Base × weight + δ_tyre + δ_fuel + δ_traffic + δ_driver + ε
        """
        sector_weights = [0.30, 0.38, 0.32]  # S2 typically longest

        # Compute fuel load in kg for ML input
        fuel_load_kg = max(0.0, 110.0 - (lap - 1) * FUEL_BURN_PER_LAP)

        # Compute traffic index from gap to car ahead
        traffic_index = 0.0
        if driver.gap_to_car_ahead > 0.05 and driver.gap_to_car_ahead < DIRTY_AIR_THRESHOLD:
            traffic_index = min(1.0, 1.0 - (driver.gap_to_car_ahead / DIRTY_AIR_THRESHOLD))

        # Sentinel — gets set by whichever method succeeds
        base_sector = None
        delta_tyre = 0.0
        delta_fuel = 0.0
        delta_driver = 0.0

        # ── METHOD A: Sector ML Model (race_pace_v1) ──
        if base_sector is None and self.pace_model and getattr(self.pace_model, 'has_sector_model', False):
            try:
                base_sector = self.pace_model.predict_sector_time(
                    sector=sector,
                    driver=driver.driver_id,
                    compound=driver.tire_compound,
                    tyre_age=driver.tire_age,
                    team=driver.team,
                    circuit=self.circuit,
                    fuel_load=fuel_load_kg,
                    traffic_index=traffic_index,
                )
            except Exception:
                base_sector = None  # Fall through to Method B

        # ── METHOD B: Legacy ML (full lap model) ──
        if base_sector is None and self.pace_model:
            try:
                predicted_lap = self.pace_model.predict_lap_time(
                    driver=driver.driver_id,
                    compound=driver.tire_compound,
                    tyre_life=driver.tire_age,
                    team=driver.team,
                    speed_st=0,
                    speed_fl=0,
                    lap_number=lap
                )
                base_sector = predicted_lap * sector_weights[sector - 1]
            except Exception:
                base_sector = None  # Fall through to Method C

        # ── METHOD C: GLM Fallback (Enhanced with Bayesian Physics) ──
        if base_sector is None:
            base_sector = driver.base_pace * sector_weights[sector - 1]
            
            # Use the pre-calculated per-sector modifier from the Bayesian model
            # This includes: Fuel Penalty + Tyre Deg + Warmup + Compound/Track Mismatch
            physics_mod = getattr(driver, 'current_lap_mod', 0.0)
            
            # Driver Skill (still relevant as base pace modifier)
            delta_driver = driver.skill_rating / SECTORS_PER_LAP
            
            # Combine
            base_sector += physics_mod + delta_driver
            
            # Legacy variables for compatibility/logging (set to 0 as they are in physics_mod)
            delta_tyre = 0.0
            delta_fuel = 0.0

        # ── Game State Modifiers (Applied to ALL methods) ──

        # δ_traffic: Dirty air penalty (on top of ML predictions)
        delta_traffic = 0.0
        if driver.gap_to_car_ahead < DIRTY_AIR_THRESHOLD and driver.gap_to_car_ahead > 0.05:
            closeness = 1.0 - (driver.gap_to_car_ahead / DIRTY_AIR_THRESHOLD)
            sector_dirty_weight = [0.2, 0.5, 0.3]  # S2 has most corners
            delta_traffic = DIRTY_AIR_PENALTY * closeness * sector_dirty_weight[sector - 1]

        # ε: Random noise based on driver consistency
        sigma = 0.05 + (1.0 - driver.consistency) * 0.4
        noise = self.rng.gauss(0, sigma / SECTORS_PER_LAP)

        sector_time = base_sector + delta_tyre + delta_fuel + delta_traffic + delta_driver + noise

        # Floor: sector time can't be unrealistically fast
        min_time = (driver.base_pace * sector_weights[sector - 1]) * 0.8
        return max(sector_time, min_time)

    def _check_overtake(self, driver: DriverState, sector: int, lap: int):
        """
        Check if the driver can attempt an overtake on the car directly ahead.
        Uses the OvertakeModel for probability-based evaluation.
        """
        if driver.position <= 1:
            return  # Leader can't overtake anyone

        # Find the car directly ahead
        defender = self._get_driver_at_position(driver.position - 1)
        if not defender or not defender.is_running:
            return

        result = self.overtake_model.evaluate_overtake(
            attacker=driver,
            defender=defender,
            circuit_id=self.circuit,
            sector=sector,
            weather=self.weather,
        )

        if result:
            apply_overtake(driver, defender, result, lap)
            # Apply time deltas to current sector
            if driver.sector_times:
                driver.sector_times[-1] += result["attacker_time_delta"]
                driver.sector_times[-1] = max(driver.sector_times[-1], 5.0)
            if defender.sector_times and len(defender.sector_times) >= sector:
                defender.sector_times[sector - 1] += result["defender_time_delta"]

    def _check_incident(self, driver: DriverState, lap: int) -> bool:
        """
        Check for crashes/mechanical failures.
        Returns True if driver is out (DNF).
        """
        incident = self.crash_model.evaluate_lap(
            driver_id=driver.driver_id,
            team_id=driver.team,
            circuit_id=self.circuit,
            weather=self.weather,
            driver_consistency=driver.consistency,
            reliability_score=driver.reliability,
        )

        if incident == "CRASH":
            print(f"💥 CRASH: {driver.driver_id} Lap {lap}")
            driver.is_running = False
            driver.has_dnf = True
            driver.record_event("CRASH", lap)
            
            # Determine severity
            severity_roll = self.rng.random()
            if severity_roll < 0.15:
                # Red Flag (15% chance for serious crash)
                from app.simulation.events import RedFlagEvent
                restart_lap = min(lap + self.rng.randint(3, 5), self.lap_count)
                self.event_manager.register_event(RedFlagEvent(trigger_lap=lap + 1, restart_lap=restart_lap))
            elif severity_roll < 0.45:
                # Full Safety Car (30% chance)
                duration = self.rng.randint(2, 4)
                self.event_manager.register_event(SafetyCarEvent(start_lap=lap + 1, duration=duration))
            else:
                # VSC (55% chance for lighter incidents)
                duration = self.rng.randint(1, 3)
                self.event_manager.register_event(VSCEvent(start_lap=lap + 1, duration=duration))
            return True

        elif incident == "MECHANICAL":
            print(f"🔥 MECHANICAL: {driver.driver_id} Lap {lap}")
            driver.is_running = False
            driver.has_dnf = True
            driver.record_event("MECHANICAL", lap)
            
            # Mechanical failures usually cause VSC
            if self.rng.random() < 0.6:
                duration = self.rng.randint(1, 2)
                self.event_manager.register_event(VSCEvent(start_lap=lap + 1, duration=duration))
            return True

        return False

    def _degrade_tyres(self, driver: DriverState):
        """
        Degrade tyres using the rate calculated by the Bayesian model.
        """
        # Retrieve the wear calculated for this lap (or heuristic fallback)
        wear_amount = getattr(driver, 'current_lap_wear', 0.05)
        
        # Apply strict sanitization
        wear_amount = max(0.001, min(wear_amount, 0.2)) # Cap at 20% per lap sanity check
        
        driver.degrade_tyres(wear_amount)

    # ──────────────────────────────────────────────────────────────────────────
    # STRATEGY — Integrated StrategyAI
    # ──────────────────────────────────────────────────────────────────────────

    def _evaluate_strategy(self, lap: int):
        """Evaluate pit strategy for all drivers using StrategyAI."""
        for driver in self.drivers:
            if not driver.is_running:
                continue
            
            decision = self.strategy_ai.evaluate(
                driver=driver,
                lap=lap,
                total_laps=self.lap_count,
                sc_active=bool(self.flags.get("SC")),
                vsc_active=bool(self.flags.get("VSC")),
                weather=self.weather,
            )

            if decision.should_pit:
                self.strategy_ai.execute_pit(driver, decision, lap)

    # ──────────────────────────────────────────────────────────────────────────
    # STANDINGS & GAPS
    # ──────────────────────────────────────────────────────────────────────────

    def _update_standings(self, lap: int):
        """Update race order, gaps, intervals, and create snapshot."""
        # Sort: more laps completed first, then by total time
        sorted_drivers = sorted(
            self.drivers,
            key=lambda d: (-len(d.lap_times), d.current_time)
        )

        leader_time = sorted_drivers[0].current_time if sorted_drivers else 0.0

        driver_positions = []
        lap_times = {}
        gaps = {}
        intervals = {}
        sector_times = {}
        tyre_compounds = {}
        tyre_ages = {}
        pit_stop_counts = {}
        dnf_this_lap = []

        prev_time = leader_time
        for i, driver in enumerate(sorted_drivers):
            pos = i + 1
            driver.position = pos

            driver_positions.append(driver.driver_id)
            lap_times[driver.driver_id] = driver.last_lap_time or 0.0
            gaps[driver.driver_id] = driver.current_time - leader_time

            # Interval to car ahead
            if pos == 1:
                intervals[driver.driver_id] = 0.0
            else:
                intervals[driver.driver_id] = driver.current_time - prev_time

            # Update gap_to_car_ahead for DRS/overtake checks
            if pos == 1:
                driver.gap_to_car_ahead = 999.0
                driver.is_in_drs = False
                driver.laps_behind_car = 0
            else:
                gap_ahead = driver.current_time - prev_time
                if driver.gap_to_car_ahead < 2.0 and gap_ahead < 2.0:
                    driver.laps_behind_car += 1
                else:
                    driver.laps_behind_car = 0
                driver.gap_to_car_ahead = gap_ahead
                driver.is_in_drs = gap_ahead <= 1.0

            prev_time = driver.current_time

            # Sector times
            sector_times[driver.driver_id] = list(driver.sector_times) if driver.sector_times else []

            # Tyre data
            tyre_compounds[driver.driver_id] = driver.tire_compound or "MEDIUM"
            tyre_ages[driver.driver_id] = driver.tire_age
            pit_stop_counts[driver.driver_id] = driver.total_pit_stops

            # DNF tracking
            if not driver.is_running and driver.has_dnf:
                # Check if DNF happened this lap
                for ev in driver.events:
                    if ev["lap"] == lap and ev["type"] in ("CRASH", "MECHANICAL"):
                        dnf_this_lap.append(driver.driver_id)

        # Determine SC status string
        sc_status = "CLEAR"
        if self.flags.get("RED_FLAG"):
            sc_status = "RED_FLAG"
        elif self.flags.get("SC"):
            sc_status = "SC"
        elif self.flags.get("VSC"):
            sc_status = "VSC"

        snapshot = LapSnapshot(
            lap_number=lap,
            driver_positions=driver_positions,
            lap_times=lap_times,
            gaps_to_leader=gaps,
            intervals=intervals,
            sector_times=sector_times,
            tyre_compounds=tyre_compounds,
            tyre_ages=tyre_ages,
            pit_stop_counts=pit_stop_counts,
            sc_status=sc_status,
            weather=self.weather,
            track_temp=self.track_temp,
            dnf_this_lap=dnf_this_lap,
        )
        self.snapshots.append(snapshot)

    def _update_driver_state(self, driver: DriverState, lap_time: float):
        """Update a single driver's state with the lap result."""
        driver.last_lap_time = lap_time
        driver.lap_times.append(lap_time)
        driver.current_time += lap_time

    # ──────────────────────────────────────────────────────────────────────────
    # HELPERS
    # ──────────────────────────────────────────────────────────────────────────

    def _get_driver_at_position(self, position: int) -> Optional[DriverState]:
        """Find driver at a specific position."""
        for d in self.drivers:
            if d.position == position and d.is_running:
                return d
        return None

    def final_results(self):
        """Return final classification and metadata."""
        sorted_drivers = sorted(
            self.drivers,
            key=lambda d: (-len(d.lap_times), d.current_time)
        )
        results = []
        leader_time = sorted_drivers[0].current_time if sorted_drivers else 0.0

        for i, driver in enumerate(sorted_drivers):
            results.append({
                "driver_id": driver.driver_id,
                "team": driver.team,
                "position": i + 1,
                "total_time": driver.current_time,
                "gap_to_leader": driver.current_time - leader_time,
                "lap_times": driver.lap_times,
                "laps": [{"lap": idx + 1, "time": t} for idx, t in enumerate(driver.lap_times)],
                "status": "Finished" if driver.is_running else "DNF",
                "tyre_compound": driver.tire_compound,
                "total_pit_stops": driver.total_pit_stops,
                "pit_stops": driver.pit_stops,
                "events": driver.events,
            })

        return {
            "circuit": self.circuit,
            "weather": self.weather,
            "total_laps": self.lap_count,
            "results": results,
        }

    # ──────────────────────────────────────────────────────────────────────────
    # INVARIANT CHECKING
    # ──────────────────────────────────────────────────────────────────────────

    def _check_invariants(self, lap_idx: int, phase: str):
        """Pure internal consistency check."""
        # 1. Driver count consistency
        if len(self.drivers) != len(self.driver_map):
            raise AssertionError(
                f"Driver count changed: {len(self.driver_map)} -> {len(self.drivers)}"
            )

        # 2. Per-driver checks
        seen = set()
        for driver in self.drivers:
            if driver.driver_id in seen:
                raise AssertionError(f"Duplicate driver ID: {driver.driver_id}")
            seen.add(driver.driver_id)

            if driver.current_time < 0:
                raise AssertionError(
                    f"Negative time for {driver.driver_id}: {driver.current_time}"
                )

            if driver.is_running and driver.last_lap_time is not None:
                if driver.last_lap_time <= 0:
                    raise AssertionError(
                        f"Non-positive lap time for {driver.driver_id}: {driver.last_lap_time}"
                    )

        # 3. Snapshot consistency
        if phase == "end_of_lap":
            if not self.snapshots:
                raise AssertionError("No snapshot after lap end")
            last = self.snapshots[-1]
            if last.lap_number != lap_idx:
                raise AssertionError(
                    f"Snapshot lap {last.lap_number} != current lap {lap_idx}"
                )
            for d_id, gap in last.gaps_to_leader.items():
                if math.isnan(gap) or math.isinf(gap):
                    raise AssertionError(f"NaN/Inf gap for {d_id}")

        if phase == "finish":
            if len(self.snapshots) != self.lap_count:
                raise AssertionError(
                    f"Expected {self.lap_count} snapshots, got {len(self.snapshots)}"
                )
