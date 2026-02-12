# backend/app/simulation/tyre_degradation_model.py
"""
Non-linear tyre degradation model.

Models the four phases of tyre behaviour:
  1. Scrub-in (laps 0-3): Tyres heating up, improving grip
  2. Optimal window (laps 3-X): Peak performance
  3. Linear degradation (laps X-Y): Gradual loss
  4. Performance cliff (laps Y+): Rapid dropoff

Compound profiles based on real F1 tyre characteristics.
"""

import math
from dataclasses import dataclass
from typing import Dict, Tuple, Optional


# ── Compound Profiles ──

COMPOUND_PROFILES: Dict[str, Dict] = {
    "SOFT": {
        "base_pace_delta": -0.6,  # seconds faster than MEDIUM baseline
        "optimal_life": 12,       # peak window ends at lap X
        "cliff_life": 18,         # cliff onset
        "max_life": 25,           # tyres are essentially dead
        "scrub_in_laps": 2,
        "deg_rate": 0.035,        # seconds per lap in linear phase
        "cliff_rate": 0.12,       # seconds per lap in cliff phase
    },
    "MEDIUM": {
        "base_pace_delta": 0.0,   # reference compound
        "optimal_life": 18,
        "cliff_life": 28,
        "max_life": 38,
        "scrub_in_laps": 2,
        "deg_rate": 0.022,
        "cliff_rate": 0.09,
    },
    "HARD": {
        "base_pace_delta": 0.5,   # seconds slower than MEDIUM
        "optimal_life": 25,
        "cliff_life": 40,
        "max_life": 55,
        "scrub_in_laps": 3,
        "deg_rate": 0.014,
        "cliff_rate": 0.07,
    },
    "INTERMEDIATE": {
        "base_pace_delta": 2.5,   # dry pace delta (fast on wet surface)
        "optimal_life": 20,
        "cliff_life": 35,
        "max_life": 50,
        "scrub_in_laps": 2,
        "deg_rate": 0.018,
        "cliff_rate": 0.06,
    },
    "WET": {
        "base_pace_delta": 5.0,
        "optimal_life": 25,
        "cliff_life": 45,
        "max_life": 60,
        "scrub_in_laps": 2,
        "deg_rate": 0.012,
        "cliff_rate": 0.05,
    },
}


@dataclass
class DegradationResult:
    """Result of degradation calculation for a single lap."""
    pace_delta: float           # total seconds added to baseline (negative = faster)
    tyre_health: float          # 0.0 (dead) to 1.0 (new)
    phase: str                  # 'scrub_in', 'optimal', 'linear', 'cliff'
    cliff_warning: bool         # True if approaching cliff
    recommended_pit: bool       # True if past optimal stop window


class TyreDegradationModel:
    """
    Non-linear tyre degradation model with four-phase behaviour.

    Usage:
        model = TyreDegradationModel()
        result = model.get_degradation("SOFT", tyre_life=12, track_temp=45.0)
        print(f"Pace loss: {result.pace_delta:.3f}s, Phase: {result.phase}")
    """

    def __init__(self, profiles: Optional[Dict] = None):
        self.profiles = profiles or COMPOUND_PROFILES

    def get_degradation(
        self,
        compound: str,
        tyre_life: int,
        track_temp: float = 35.0,
        aggression: float = 1.0,
    ) -> DegradationResult:
        """
        Calculate tyre degradation for a given compound and tyre age.

        Args:
            compound: Tyre compound (SOFT, MEDIUM, HARD, INTERMEDIATE, WET)
            tyre_life: Number of laps on current set
            track_temp: Track temperature in °C
            aggression: Driver aggression factor (0.8-1.2)

        Returns:
            DegradationResult with pace_delta, health, and phase info
        """
        profile = self.profiles.get(compound.upper(), self.profiles["MEDIUM"])

        # Temperature scaling: hotter track = faster degradation
        # Reference temp is 30°C
        temp_factor = 1.0 + (track_temp - 30.0) * 0.008

        # Driver aggression multiplier
        agg_factor = aggression

        # Combined multiplier
        multiplier = temp_factor * agg_factor

        # Determine phase and compute degradation
        scrub_end = profile["scrub_in_laps"]
        optimal_end = profile["optimal_life"]
        cliff_start = profile["cliff_life"]
        max_life = profile["max_life"]

        base_pace = profile["base_pace_delta"]

        if tyre_life <= scrub_end:
            # Phase 1: Scrub-in — tyres warming up
            # Starts ~0.3s slow, converges to base pace
            warmup_remaining = (scrub_end - tyre_life) / scrub_end
            pace_delta = base_pace + 0.3 * warmup_remaining
            phase = "scrub_in"

        elif tyre_life <= optimal_end:
            # Phase 2: Optimal window — minimal degradation
            laps_in_phase = tyre_life - scrub_end
            pace_delta = base_pace + laps_in_phase * 0.003 * multiplier
            phase = "optimal"

        elif tyre_life <= cliff_start:
            # Phase 3: Linear degradation — steady dropoff
            laps_in_optimal = optimal_end - scrub_end
            optimal_deg = laps_in_optimal * 0.003 * multiplier
            laps_in_linear = tyre_life - optimal_end
            linear_deg = laps_in_linear * profile["deg_rate"] * multiplier
            pace_delta = base_pace + optimal_deg + linear_deg
            phase = "linear"

        else:
            # Phase 4: Cliff — exponential degradation
            laps_in_optimal = optimal_end - scrub_end
            optimal_deg = laps_in_optimal * 0.003 * multiplier
            laps_in_linear = cliff_start - optimal_end
            linear_deg = laps_in_linear * profile["deg_rate"] * multiplier
            laps_past_cliff = tyre_life - cliff_start

            # Exponential cliff
            cliff_deg = profile["cliff_rate"] * (math.exp(0.08 * laps_past_cliff) - 1) * multiplier
            pace_delta = base_pace + optimal_deg + linear_deg + cliff_deg
            phase = "cliff"

        # Health (1.0 = new, 0.0 = dead)
        health = max(0.0, 1.0 - (tyre_life / max_life))

        # Warnings
        cliff_warning = tyre_life >= (cliff_start - 3) and tyre_life < cliff_start
        recommended_pit = tyre_life >= cliff_start

        return DegradationResult(
            pace_delta=round(pace_delta, 4),
            tyre_health=round(health, 3),
            phase=phase,
            cliff_warning=cliff_warning,
            recommended_pit=recommended_pit,
        )

    def get_optimal_pit_window(
        self,
        compound: str,
        track_temp: float = 35.0,
    ) -> Dict[str, int]:
        """
        Get the recommended pit stop window for a compound.

        Returns:
            dict with 'earliest', 'optimal', 'latest' lap numbers
        """
        profile = self.profiles.get(compound.upper(), self.profiles["MEDIUM"])

        # Temperature shifts the window earlier
        temp_shift = max(0, int((track_temp - 30.0) * 0.15))

        return {
            "earliest": max(1, profile["optimal_life"] - 3 - temp_shift),
            "optimal": max(1, profile["cliff_life"] - 5 - temp_shift),
            "latest": max(1, profile["cliff_life"] - temp_shift),
        }

    def get_compound_pace_delta(self, compound: str) -> float:
        """Get the raw pace delta for a compound vs MEDIUM baseline."""
        profile = self.profiles.get(compound.upper(), self.profiles["MEDIUM"])
        return profile["base_pace_delta"]

    def get_tyre_health(self, compound: str, tyre_life: int) -> float:
        """Quick health check without full degradation calc."""
        profile = self.profiles.get(compound.upper(), self.profiles["MEDIUM"])
        return max(0.0, 1.0 - (tyre_life / profile["max_life"]))
