# backend/app/simulation/strategy_ai.py
"""
Strategy AI — Per-team pit decision engine integrated into the race loop.

Each lap, the engine asks StrategyAI.evaluate() for every driver.
The AI decides whether to pit and which compound to use, based on:
  1. Tyre cliff detection (performance dropping below pit-loss threshold)
  2. Undercut opportunity (stuck behind slower car)
  3. Safety Car opportunism (free pit stop)
  4. Mandatory compound rule (must use at least 2 dry compounds)
  5. Laps remaining (don't pit if too few laps left)
"""

import random
from dataclasses import dataclass
from typing import Optional, List, Set, TYPE_CHECKING

if TYPE_CHECKING:
    from app.simulation.driver_state import DriverState


# ── Compound Performance Data ──
COMPOUND_DATA = {
    "SOFT":         {"pace_offset": 0.0,  "base_life": 16,  "wear_rate": 0.055},
    "MEDIUM":       {"pace_offset": 0.5,  "base_life": 26,  "wear_rate": 0.035},
    "HARD":         {"pace_offset": 1.1,  "base_life": 42,  "wear_rate": 0.022},
    "INTERMEDIATE": {"pace_offset": 2.0,  "base_life": 30,  "wear_rate": 0.030},
    "WET":          {"pace_offset": 5.0,  "base_life": 30,  "wear_rate": 0.028},
}

DRY_COMPOUNDS = {"SOFT", "MEDIUM", "HARD"}
WET_COMPOUNDS = {"INTERMEDIATE", "WET"}


@dataclass
class PitDecision:
    """Result of a strategy evaluation."""
    should_pit: bool
    target_compound: Optional[str] = None
    reason: str = ""
    urgency: float = 0.0  # 0.0 = no rush, 1.0 = critical


class StrategyAI:
    """
    Per-driver, per-lap strategy evaluator.
    
    Integrates with the RaceEngine loop — replaces hard-coded PitStopEvent logic.
    """
    
    # Pit stop time loss (typical F1 stationary + pit lane delta)
    PIT_LOSS_TIME = 22.0
    
    # Don't pit if fewer than this many laps remain (not worth it)
    MIN_LAPS_FOR_PIT = 5
    
    # Tyre health below which we consider mandatory pit
    CRITICAL_HEALTH = 0.08
    
    # Tyre health below which we start considering pit
    CONCERN_HEALTH = 0.20
    
    # How much pace loss (seconds) makes pitting worthwhile vs. staying out
    PIT_WORTHINESS_THRESHOLD = 1.8  # seconds per lap lost from tyre deg

    def __init__(self, rng: random.Random = None):
        self.rng = rng or random.Random()
        # Track which compounds each driver has used (for mandatory rule)
        self.used_compounds: dict[str, Set[str]] = {}
    
    def register_driver(self, driver_id: str, starting_compound: str):
        """Register a driver's starting compound."""
        self.used_compounds[driver_id] = {starting_compound.upper()}

    def evaluate(
        self,
        driver: "DriverState",
        lap: int,
        total_laps: int,
        sc_active: bool = False,
        vsc_active: bool = False,
        weather: str = "DRY",
    ) -> PitDecision:
        """
        Evaluate whether a driver should pit this lap.
        
        Returns PitDecision with should_pit, target_compound, reason.
        """
        laps_remaining = total_laps - lap
        compound = (driver.tire_compound or "MEDIUM").upper()
        
        # ── Rule 0: Don't pit if already in pit or not running ──
        if driver.in_pit or not driver.is_running:
            return PitDecision(should_pit=False, reason="already_in_pit_or_dnf")
        
        # ── Rule 1: Don't pit if too few laps remain ──
        if laps_remaining < self.MIN_LAPS_FOR_PIT:
            # Exception: mandatory compound not met
            if not self._has_met_compound_rule(driver.driver_id, weather):
                return PitDecision(
                    should_pit=True,
                    target_compound=self._select_compound(driver, laps_remaining, weather),
                    reason="mandatory_compound_rule",
                    urgency=0.9,
                )
            return PitDecision(should_pit=False, reason="too_few_laps")
        
        # ── Rule 2: Critical tyre health — MUST pit ──
        if driver.tyre_health <= self.CRITICAL_HEALTH:
            return PitDecision(
                should_pit=True,
                target_compound=self._select_compound(driver, laps_remaining, weather),
                reason="critical_tyre_health",
                urgency=1.0,
            )
        
        # ── Rule 3: Safety Car Opportunism ──
        if sc_active or vsc_active:
            # Pit under SC/VSC if tyres are worn (health < 50%) — it's "free"
            if driver.tyre_health < 0.50 and driver.tire_age >= 8:
                return PitDecision(
                    should_pit=True,
                    target_compound=self._select_compound(driver, laps_remaining, weather),
                    reason="sc_opportunistic_pit",
                    urgency=0.8,
                )
        
        # ── Rule 4: Weather change — wrong tyres ──
        is_wet = weather.upper() in ("WET", "RAIN", "DAMP")
        on_dry_tyres = compound in DRY_COMPOUNDS
        on_wet_tyres = compound in WET_COMPOUNDS
        
        if is_wet and on_dry_tyres:
            return PitDecision(
                should_pit=True,
                target_compound="INTERMEDIATE" if weather.upper() == "DAMP" else "WET",
                reason="weather_change_to_wet",
                urgency=1.0,
            )
        if not is_wet and on_wet_tyres:
            return PitDecision(
                should_pit=True,
                target_compound=self._select_compound(driver, laps_remaining, "DRY"),
                reason="weather_change_to_dry",
                urgency=0.9,
            )
        
        # ── Rule 5: Tyre cliff approaching — performance degradation ──
        if driver.tyre_health <= self.CONCERN_HEALTH:
            # Calculate pace loss from tyre deg
            pace_loss = driver.tyre_pace_penalty
            if pace_loss >= self.PIT_WORTHINESS_THRESHOLD:
                return PitDecision(
                    should_pit=True,
                    target_compound=self._select_compound(driver, laps_remaining, weather),
                    reason="tyre_cliff_approaching",
                    urgency=0.7,
                )
        
        # ── Rule 6: Undercut opportunity ──
        if (driver.laps_behind_car >= 3 
            and driver.gap_to_car_ahead < 2.0 
            and driver.tire_age >= 10
            and driver.tyre_health < 0.55):
            # Probabilistic: 40% chance of attempting undercut
            if self.rng.random() < 0.40:
                return PitDecision(
                    should_pit=True,
                    target_compound=self._select_compound(driver, laps_remaining, weather),
                    reason="undercut_attempt",
                    urgency=0.6,
                )
        
        # ── Rule 7: Standard window — tyre life exceeded base life ──
        base_life = COMPOUND_DATA.get(compound, {}).get("base_life", 25)
        if driver.tire_age >= base_life:
            # Pit with high probability once past base life
            if self.rng.random() < 0.70:
                return PitDecision(
                    should_pit=True,
                    target_compound=self._select_compound(driver, laps_remaining, weather),
                    reason="standard_tyre_window",
                    urgency=0.5,
                )
        
        return PitDecision(should_pit=False, reason="no_pit_needed")

    def execute_pit(self, driver: "DriverState", decision: PitDecision, lap: int):
        """Execute the pit stop: set flags and reset tyre state."""
        old_compound = driver.tire_compound
        new_compound = decision.target_compound or "MEDIUM"
        
        # Set pit flags for engine to apply time penalty
        driver.in_pit = True
        # Add variance to pit stop time (±0.5s for crew performance)
        driver.pit_penalty = self.PIT_LOSS_TIME + self.rng.uniform(-0.5, 0.5)
        
        # Reset tyres
        driver.tire_age = 0
        driver.tyre_health = 1.0
        driver.tire_compound = new_compound
        driver.current_stint += 1
        driver.total_pit_stops += 1
        
        # Track compound usage
        if driver.driver_id in self.used_compounds:
            self.used_compounds[driver.driver_id].add(new_compound)
        
        # Record event
        driver.record_event("PIT_STOP", lap, {
            "old_compound": old_compound,
            "new_compound": new_compound,
            "duration": driver.pit_penalty,
            "reason": decision.reason,
        })
        driver.pit_stops.append({
            "lap": lap,
            "old": old_compound,
            "new": new_compound,
            "duration": driver.pit_penalty,
        })

    def _select_compound(self, driver: "DriverState", laps_remaining: int, weather: str) -> str:
        """
        Choose the optimal compound for the next stint.
        
        Logic:
        - If wet: INTERMEDIATE or WET
        - If < 15 laps left: SOFT (sprint to end)
        - If < 30 laps left: MEDIUM
        - Otherwise: HARD
        - Avoid re-using same compound if possible (variety)
        """
        if weather.upper() in ("WET", "RAIN"):
            return "WET"
        if weather.upper() == "DAMP":
            return "INTERMEDIATE"
        
        current = (driver.tire_compound or "MEDIUM").upper()
        
        if laps_remaining <= 15:
            preferred = "SOFT"
        elif laps_remaining <= 30:
            preferred = "MEDIUM"
        else:
            preferred = "HARD"
        
        # Try to avoid same compound
        if preferred == current:
            if preferred == "SOFT":
                preferred = "MEDIUM"
            elif preferred == "HARD":
                preferred = "MEDIUM"
            elif preferred == "MEDIUM":
                preferred = "HARD" if laps_remaining > 20 else "SOFT"
        
        return preferred

    def _has_met_compound_rule(self, driver_id: str, weather: str) -> bool:
        """Check if driver has used at least 2 different dry compounds."""
        if weather.upper() in ("WET", "RAIN", "DAMP"):
            return True  # Compound rule relaxed in wet races
        used = self.used_compounds.get(driver_id, set())
        dry_used = used & DRY_COMPOUNDS
        return len(dry_used) >= 2
