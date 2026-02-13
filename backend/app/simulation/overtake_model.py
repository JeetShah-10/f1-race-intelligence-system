# backend/app/simulation/overtake_model.py
"""
Probabilistic overtaking model for the F1 simulation engine.

Overtakes happen in DRS zones when conditions align:
  1. Gap to car ahead < DRS_THRESHOLD (1.0s)
  2. Current sector contains a DRS zone
  3. Probability based on speed delta, tyre advantage, aggression, defending skill

The model also supports non-DRS overtakes at lower probability for
exceptional pace advantages (e.g., fresh tyres vs cliff tyres).
"""

import random
import math
from typing import Optional, Dict, List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.simulation.driver_state import DriverState


#  Circuit DRS Zone Configuration 
# Maps circuit_id -> list of sectors (1-indexed) that contain DRS zones
CIRCUIT_DRS_ZONES: Dict[str, List[int]] = {
    # Modern F1 tracks typically have 2-3 DRS zones
    "bahrain": [1, 3],
    "jeddah": [1, 2, 3],
    "albert_park": [1, 3],
    "suzuka": [1, 3],
    "shanghai": [1, 2],
    "miami": [1, 3],
    "imola": [2, 3],
    "monaco": [],                # No realistic overtaking corridor
    "barcelona": [1, 3],
    "montreal": [2, 3],
    "spielberg": [1, 3],
    "silverstone": [1, 3],
    "hungaroring": [1],
    "spa": [1, 3],
    "zandvoort": [1],
    "monza": [1, 2],
    "baku": [1, 2],
    "singapore": [1],
    "austin": [1, 3],
    "mexico": [1, 3],
    "interlagos": [1, 3],
    "las_vegas": [1, 2],
    "lusail": [1, 3],
    "yas_marina": [1, 3],
    "madrid": [1, 2, 3],
}

# Default for unknown circuits
DEFAULT_DRS_ZONES = [1, 3]


class OvertakeModel:
    """
    Determines whether an overtake attempt succeeds on a given sector tick.
    
    Parameters tuned for realistic overtake rates:
    - ~25-40 overtakes per race at high-overtake circuits (Bahrain, Baku)
    - ~5-10 overtakes per race at difficult-to-pass circuits (Monaco, Hungary)
    """

    # DRS activation threshold (seconds behind car ahead)
    DRS_THRESHOLD = 1.0
    
    # Minimum gap to attempt any overtake (too close = already alongside)
    MIN_GAP = 0.05
    
    # Base probability per sector in a DRS zone (tuned for realism)
    BASE_DRS_PROB = 0.12
    
    # Base probability for non-DRS overtake (much harder)
    BASE_NON_DRS_PROB = 0.02
    
    # Time cost of a failed overtake attempt (lost momentum)
    FAILED_ATTEMPT_PENALTY = 0.15  # seconds
    
    # Time cost of a successful overtake (both drivers compromised)
    OVERTAKE_TIME_COST_ATTACKER = 0.05   # seconds (drafting advantage)
    OVERTAKE_TIME_COST_DEFENDER = 0.20   # seconds (defensive line, lost momentum)

    def __init__(self, rng: random.Random = None):
        self.rng = rng or random.Random()

    def get_drs_zones(self, circuit_id: str) -> List[int]:
        """Get DRS zone sectors for a circuit."""
        return CIRCUIT_DRS_ZONES.get(circuit_id.lower(), DEFAULT_DRS_ZONES)

    def is_drs_sector(self, circuit_id: str, sector: int) -> bool:
        """Check if the current sector is a DRS zone."""
        return sector in self.get_drs_zones(circuit_id)

    def evaluate_overtake(
        self,
        attacker: "DriverState",
        defender: "DriverState",
        circuit_id: str,
        sector: int,
        weather: str = "DRY",
    ) -> Optional[Dict]:
        """
        Evaluate whether an overtake attempt happens and succeeds.
        
        Returns:
            None if no attempt, or dict with:
              - success: bool
              - attacker_time_delta: float (time gained/lost)
              - defender_time_delta: float (time gained/lost)
        """
        gap = attacker.gap_to_car_ahead
        
        # No overtake if gap is too large or negative (already ahead)
        if gap > self.DRS_THRESHOLD or gap < self.MIN_GAP:
            return None

        # No overtaking if either driver is not running
        if not attacker.is_running or not defender.is_running:
            return None

        #  Calculate Overtake Probability 
        is_drs = self.is_drs_sector(circuit_id, sector)
        base_prob = self.BASE_DRS_PROB if is_drs else self.BASE_NON_DRS_PROB
        
        # Factor 1: Tyre advantage (attacker has better tyres)
        tyre_delta = attacker.tyre_health - defender.tyre_health
        tyre_factor = 1.0 + (tyre_delta * 2.5)  # Increased importance of tyre delta

        # Factor 2: Aggression of attacker
        aggression_factor = 0.5 + attacker.aggression  # 0.5 to 1.5
        
        # Factor 3: Skill Matchup (New!)
        # Overtaking skill vs Defending skill
        skill_delta = getattr(attacker, 'overtaking_skill', 0.5) - defender.defending_skill
        skill_factor = 1.0 + (skill_delta * 2.0) # strong impact from skill gap

        # Factor 4: Proximity bonus
        proximity_factor = 1.0 + (1.0 - gap / self.DRS_THRESHOLD) * 0.8  # Closer = much easier
        
        # Factor 5: Weather & Tyre Suitability (New!)
        weather_factor = 1.0
        weather_upper = weather.upper()
        
        attacker_compound = (attacker.tire_compound or "MEDIUM").upper()
        defender_compound = (defender.tire_compound or "MEDIUM").upper()
        
        # Check for massive crossover advantage (e.g. Slicks on Wet vs Wets)
        if weather_upper in ["WET", "RAIN"]:
            # Attacker on appropriate tyre, Defender on wrong tyre
            if attacker_compound in ["WET", "INTERMEDIATE"] and defender_compound not in ["WET", "INTERMEDIATE"]:
                weather_factor = 5.0 # Almost guaranteed pass
            elif attacker_compound == "WET" and defender_compound == "INTERMEDIATE" and weather_upper == "WET":
                 weather_factor = 1.5
        
        # Factor 6: Laps stuck behind
        stuck_factor = 1.0 + min(attacker.laps_behind_car * 0.1, 0.5)  # Frustration builds up

        # Combined probability
        prob = base_prob * tyre_factor * aggression_factor * skill_factor * proximity_factor * weather_factor * stuck_factor
        prob = max(0.0, min(prob, 0.95))  # Cap at 95%

        #  Attempt Decision 
        # Not every close-proximity results in an attempt
        attempt_threshold = 0.3 + (0.4 * (1.0 - attacker.aggression))  # Aggressive drivers attempt more
        if self.rng.random() > (1.0 - attempt_threshold * (gap / self.DRS_THRESHOLD)):
            # No attempt this sector
            return None

        #  Outcome 
        roll = self.rng.random()
        if roll < prob:
            # SUCCESS
            return {
                "success": True,
                "attacker_time_delta": -self.OVERTAKE_TIME_COST_ATTACKER,
                "defender_time_delta": self.OVERTAKE_TIME_COST_DEFENDER,
            }
        else:
            # FAILED ATTEMPT
            return {
                "success": False,
                "attacker_time_delta": self.FAILED_ATTEMPT_PENALTY,
                "defender_time_delta": 0.0,
            }


def apply_overtake(
    attacker: "DriverState",
    defender: "DriverState",
    result: Dict,
    lap: int,
):
    """
    Apply the result of an overtake evaluation to driver states.
    Handles position swapping and time adjustments.
    """
    if result["success"]:
        # Swap positions
        attacker.position, defender.position = defender.position, attacker.position
        
        # Reset stuck counter
        attacker.laps_behind_car = 0
        
        # Record event
        attacker.record_event("OVERTAKE", lap, {
            "passed": defender.driver_id,
            "new_position": attacker.position,
        })
        defender.record_event("OVERTAKEN", lap, {
            "by": attacker.driver_id,
            "new_position": defender.position,
        })
    else:
        # Failed attempt recorded for attacker
        attacker.record_event("OVERTAKE_FAILED", lap, {
            "target": defender.driver_id,
            "time_lost": result["attacker_time_delta"],
        })
