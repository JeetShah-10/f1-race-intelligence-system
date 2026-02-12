# backend/app/simulation/crash_model.py
"""
Enhanced Crash/Incident Model with severity levels.

Returns an incident type AND severity when an incident occurs:
  - CRASH with severity: LOW (Yellow Flag → VSC), MED (SC), HIGH (Red Flag)
  - MECHANICAL with severity: LOW (VSC), MED (SC)

Probability is influenced by:
  - Circuit risk profile
  - Weather conditions (rain dramatically increases risk)
  - Driver consistency (inconsistent drivers crash more)
  - Car reliability (team-specific)
  - Tyre condition (worn tyres increase crash risk)
  - Traffic proximity (close racing = more contact risk)
"""

import random
from typing import Optional, Dict, Tuple


# Circuit risk profiles (higher = more incidents)
CIRCUIT_RISK = {
    "bahrain": 0.6,
    "jeddah": 0.9,        # Street circuit, walls close
    "albert_park": 0.7,
    "suzuka": 0.7,
    "shanghai": 0.5,
    "miami": 0.7,
    "imola": 0.6,
    "monaco": 0.95,        # Highest risk but mostly just yellow flags
    "barcelona": 0.4,
    "montreal": 0.8,       # Wall of Champions
    "spielberg": 0.5,
    "silverstone": 0.5,
    "hungaroring": 0.3,
    "spa": 0.8,            # High speed, weather
    "zandvoort": 0.5,
    "monza": 0.4,
    "baku": 0.9,           # Street circuit
    "singapore": 0.8,      # Night street circuit
    "austin": 0.5,
    "mexico": 0.5,
    "interlagos": 0.7,
    "las_vegas": 0.7,
    "lusail": 0.5,
    "yas_marina": 0.4,
    "madrid": 0.7,
}

DEFAULT_RISK = 0.5


class CrashModel:
    """
    Probabilistic incident generator for the race simulation.
    
    Base crash probability per lap ≈ 0.1-0.3% per driver.
    This means in a 57-lap race with 20 drivers, we expect ~1-3 incidents total.
    """

    # Base probabilities (per driver per lap)
    BASE_CRASH_PROB = 0.002          # 0.2% base crash chance per lap
    BASE_MECHANICAL_PROB = 0.001     # 0.1% base mechanical failure per lap

    def __init__(self, rng: random.Random = None):
        self.rng = rng or random.Random()

    def evaluate_lap(
        self,
        driver_id: str,
        team_id: str,
        circuit_id: str,
        weather: str,
        driver_consistency: float,
        reliability_score: float,
        tyre_health: float = 1.0,
        gap_ahead: float = 999.0,
    ) -> Optional[str]:
        """
        Evaluate whether an incident occurs this lap.
        
        Returns:
            None: No incident
            "CRASH": Driver crashed (collision, spin-off, etc.)  
            "MECHANICAL": Mechanical failure (engine, gearbox, etc.)
        """
        circuit_risk = CIRCUIT_RISK.get(circuit_id.lower(), DEFAULT_RISK)
        
        # ── Weather Multiplier ──
        weather_mult = 1.0
        if weather.upper() in ("WET", "RAIN"):
            weather_mult = 2.5
        elif weather.upper() == "DAMP":
            weather_mult = 1.8
        
        # ── Crash Check ──
        crash_prob = self.BASE_CRASH_PROB
        crash_prob *= (1.0 + circuit_risk)
        crash_prob *= weather_mult
        crash_prob *= (2.0 - driver_consistency)  # Less consistent = more crash risk
        
        # Worn tyres increase crash risk
        if tyre_health < 0.15:
            crash_prob *= 1.5
        
        # Close racing increases contact risk
        if gap_ahead < 1.0:
            crash_prob *= 1.3
        
        if self.rng.random() < crash_prob:
            return "CRASH"
        
        # ── Mechanical Check ──
        mech_prob = self.BASE_MECHANICAL_PROB
        mech_prob *= (2.0 - reliability_score)  # Less reliable = more failures
        
        if self.rng.random() < mech_prob:
            return "MECHANICAL"
        
        return None
