import random
from typing import Dict, Optional

class CrashModel:
    """
    Determines if a crash or mechanical failure occurs based on:
    - Circuit Risk (Monaco > Monza)
    - Weather (Wet > Dry)
    - Driver Consistency (Rookie > Veteran)
    - Car Reliability (Audi < Red Bull)
    """

    CIRCUIT_RISK = {
        "monaco": 0.05, # High risk per lap
        "baku": 0.04,
        "singapore": 0.03,
        "spa": 0.02,
        "monza": 0.01,
        "default": 0.015
    }

    WEATHER_MULTIPLIER = {
        "dry": 1.0,
        "light_rain": 2.5,
        "wet": 5.0
    }

    def __init__(self):
        self.rng = random.Random()

    def evaluate_lap(self, 
                     driver_id: str, 
                     team_id: str, 
                     circuit_id: str, 
                     weather: str, 
                     driver_consistency: float = 0.95,
                     reliability_score: float = 0.95) -> Optional[str]:
        """
        Evaluates risk for a single driver on a single lap.
        Returns 'CRASH', 'MECHANICAL', or None.
        """
        
        # 1. Base Probability
        base_prob = self.CIRCUIT_RISK.get(circuit_id, self.CIRCUIT_RISK["default"])
        
        # 2. Weather Modifier
        base_prob *= self.WEATHER_MULTIPLIER.get(weather, 1.0)
        
        # 3. Driver Skill Modifier (Lower consistency = Higher Risk)
        # e.g. 0.85 consistency -> 1.15x risk
        driver_factor = 2.0 - driver_consistency
        
        # 4. Final Crash Probability (per lap)
        # Scale down significantly because base_prob is "event risk per race" roughly, 
        # but we check every lap. 
        # Actually, let's treat base_prob as "Probability of SOME crash in the race on this track".
        # So per lap ~ base_prob / 50 laps.
        
        crash_prob_per_lap = (base_prob * driver_factor) / 60.0
        
        if self.rng.random() < crash_prob_per_lap:
            return "CRASH"
            
        # 5. Mechanical Failure
        # Reliability 0.95 -> 5% chance of failure per race
        # Per lap ~ 0.05 / 50 = 0.001
        
        fail_prob_per_lap = (1.0 - reliability_score) / 60.0
        
        if self.rng.random() < fail_prob_per_lap:
            return "MECHANICAL"
            
        return None
