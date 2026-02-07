from typing import Dict, List, Optional, Any
import math

class StrategyService:
    """
    Advanced Strategy Engine for F1 Simulations.
    Handles tyre degradation modeling, pit stop window optimization, and undercut analysis.
    """

    def __init__(self):
        # Base tyre life (Laps) for generic track at 30°C
        self.base_life = {
            "soft": 15,
            "medium": 25,
            "hard": 40,
            "intermediate": 30,
            "wet": 25
        }
        
        # Performance Delta (Seconds per lap slower)
        self.pace_delta = {
            "soft": 0.0,
            "medium": 0.5,
            "hard": 1.1,
            "intermediate": 2.0, # vs dry slick
            "wet": 5.0          # vs dry slick
        }

    def calculate_tyre_life(self, compound: str, track_temp: float, aggression: float = 1.0) -> int:
        """
        Calculate expected tyre life based on compound, temperature, and driver aggression.
        """
        base = self.base_life.get(compound.lower(), 20)
        
        # Temperature factor: Hot track kills softs faster
        temp_factor = 1.0
        if track_temp > 40 and compound == "soft":
            temp_factor = 0.8
        elif track_temp < 20 and compound == "hard":
            temp_factor = 0.9 # Grainng risk, usually less grip but maybe not less "life" in physical sense, but effective life
            
        # Aggression factor: pushing consumes tyre
        aggression_factor = 1.0 / aggression
        
        return int(base * temp_factor * aggression_factor)

    def predict_tyre_pace(self, compound: str, lap_age: int, track_temp: float) -> float:
        """
        Predict the lap time penalty due to tyre wear.
        Returns seconds added to base pace.
        """
        compound = compound.lower()
        if compound not in self.base_life:
            return 0.0
            
        life_expectancy = self.calculate_tyre_life(compound, track_temp)
        
        # Simplified linear degradation + "cliff" at end of life
        wear_percentage = min(lap_age / life_expectancy, 1.2)
        
        base_deg = 0.05 * lap_age # 0.05s per lap loss basic
        
        cliff_penalty = 0.0
        if wear_percentage > 1.0:
            # The Cliff: Performance drops massively after 100% life
            cliff_penalty = (wear_percentage - 1.0) * 10.0 # Huge penalty
            
        return base_deg + cliff_penalty

    def analyze_undercut(self, gap_to_ahead: float, my_lap_time: float, ahead_lap_time: float, 
                        fresh_tyre_pace_gain: float = 1.5, pit_loss: float = 20.0) -> Dict[str, Any]:
        """
        Determine if an undercut is viable.
        
        gap_to_ahead: seconds behind the target.
        my_lap_time: current lap time on old tyres.
        ahead_lap_time: target's lap time on old tyres.
        fresh_tyre_pace_gain: expected gain from new rubber (e.g., 1.5s).
        """
        
        # If we pit now:
        # Lap 1 (Outlap): We are slow due to pit loss, but fast due to fresh tyres? 
        # Actually outlap is usually slow. The "Undercut" works over the FULL cycle of Inlap+Pit+Outlap vs Staying out.
        
        # Simplified Logic:
        # If I pit now, I gain `fresh_tyre_pace_gain` per lap relative to my current pace.
        # If the guy ahead stays out, he continues at `ahead_lap_time`.
        
        # Catching rate = (ahead_lap_time) - (my_lap_time - fresh_tyre_pace_gain)
        # Note: my_lap_time is "pace on old tyres". New pace = my_pace_old - gain.
        
        predicted_new_pace = my_lap_time - fresh_tyre_pace_gain
        catching_rate = ahead_lap_time - predicted_new_pace
        
        return {
            "viable": catching_rate > 0 and gap_to_ahead < (catching_rate * 2), # Can catch in ~2 laps?
            "predicted_gain_per_lap": round(catching_rate, 3),
            "recommendation": "BOX" if (catching_rate > 0.8 and gap_to_ahead < 2.0) else "STAY_OUT"
        }
