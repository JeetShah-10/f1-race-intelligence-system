# backend/app/simulation/weather_model.py
"""
Dynamic weather evolution model for race simulations.

Models realistic weather transitions during a race:
  - Dry  Light Rain  Heavy Rain
  - Gradual temperature changes
  - Track wetness accumulation and drying
  - Tyre compound recommendations

Weather changes create strategic decision points (pit for inters/wets).
"""

import random
import math
from dataclasses import dataclass, field
from typing import Optional, Dict, Tuple
from enum import Enum


class WeatherCondition(str, Enum):
    DRY = "dry"
    LIGHT_RAIN = "light_rain"
    HEAVY_RAIN = "heavy_rain"


# Transition probabilities per lap
# P(next_state | current_state)
TRANSITION_PROBS: Dict[str, Dict[str, float]] = {
    "dry": {
        "dry": 0.96,
        "light_rain": 0.04,
        "heavy_rain": 0.00,
    },
    "light_rain": {
        "dry": 0.10,
        "light_rain": 0.80,
        "heavy_rain": 0.10,
    },
    "heavy_rain": {
        "dry": 0.00,
        "light_rain": 0.12,
        "heavy_rain": 0.88,
    },
}


@dataclass
class WeatherState:
    """Current weather conditions for a given lap."""
    condition: str = "dry"
    track_temp: float = 35.0
    air_temp: float = 25.0
    humidity: float = 40.0
    track_wetness: float = 0.0      # 0.0 (bone dry) to 1.0 (fully wet)
    rain_intensity: float = 0.0     # 0.0 (no rain) to 1.0 (monsoon)
    wind_speed: float = 5.0


class WeatherEvolutionModel:
    """
    Models dynamic weather evolution throughout a race.

    Usage:
        model = WeatherEvolutionModel(
            initial_condition="dry",
            initial_air_temp=25.0,
            initial_track_temp=40.0,
            rain_probability=0.3,
        )
        for lap in range(1, 58):
            state = model.evolve(lap, total_laps=57)
            compound = model.get_tyre_recommendation(state)
    """

    def __init__(
        self,
        initial_condition: str = "dry",
        initial_air_temp: float = 25.0,
        initial_track_temp: float = 40.0,
        rain_probability: float = 0.0,
        rng_seed: Optional[int] = None,
    ):
        self.rng = random.Random(rng_seed)
        self.current_condition = initial_condition
        self.initial_air_temp = initial_air_temp
        self.initial_track_temp = initial_track_temp
        self.rain_probability = rain_probability
        self.track_wetness = 0.0 if initial_condition == "dry" else 0.5
        self._history: list = []

    def evolve(self, lap: int, total_laps: int) -> WeatherState:
        """
        Advance weather by one lap.

        Args:
            lap: Current lap number (1-indexed)
            total_laps: Total race laps

        Returns:
            WeatherState for this lap
        """
        progress = lap / total_laps

        #  Condition Transitions 
        self._maybe_transition()

        #  Temperature Evolution 
        # Air temp: slight drift + sinusoidal variation
        air_temp = self.initial_air_temp + 2.0 * math.sin(progress * math.pi)
        air_temp += self.rng.gauss(0, 0.3)

        # Track temp depends on condition
        if self.current_condition == "dry":
            track_temp = self.initial_track_temp + 3.0 * math.sin(progress * math.pi * 0.8)
        elif self.current_condition == "light_rain":
            track_temp = self.initial_track_temp - 5.0  # rain cools track
        else:
            track_temp = self.initial_track_temp - 10.0

        track_temp += self.rng.gauss(0, 0.5)

        #  Track Wetness 
        if self.current_condition == "heavy_rain":
            self.track_wetness = min(1.0, self.track_wetness + 0.08)
        elif self.current_condition == "light_rain":
            self.track_wetness = min(0.7, self.track_wetness + 0.03)
        else:
            # Track dries out gradually (rubber + temperature)
            drying_rate = 0.02 + (track_temp - 20) * 0.001
            self.track_wetness = max(0.0, self.track_wetness - drying_rate)

        #  Rain Intensity 
        if self.current_condition == "heavy_rain":
            rain_intensity = 0.6 + self.rng.uniform(0, 0.4)
        elif self.current_condition == "light_rain":
            rain_intensity = 0.1 + self.rng.uniform(0, 0.3)
        else:
            rain_intensity = 0.0

        #  Humidity 
        base_humidity = 40.0 + rain_intensity * 50.0
        humidity = base_humidity + self.rng.gauss(0, 3.0)

        state = WeatherState(
            condition=self.current_condition,
            track_temp=round(track_temp, 1),
            air_temp=round(air_temp, 1),
            humidity=round(max(0, min(100, humidity)), 1),
            track_wetness=round(self.track_wetness, 3),
            rain_intensity=round(rain_intensity, 3),
            wind_speed=round(5.0 + self.rng.gauss(0, 2.0), 1),
        )

        self._history.append(state)
        return state

    def _maybe_transition(self):
        """
        Randomly transition weather condition based on probabilities.
        Rain probability scales the chance of transitioning TO rain.
        """
        probs = TRANSITION_PROBS[self.current_condition].copy()

        # Scale rain transitions by rain_probability setting
        if self.current_condition == "dry":
            rain_chance = probs["light_rain"] * (1 + self.rain_probability * 5)
            probs["light_rain"] = min(0.3, rain_chance)
            probs["dry"] = 1.0 - probs["light_rain"]

        # Roll
        roll = self.rng.random()
        cumulative = 0.0

        for condition, prob in probs.items():
            cumulative += prob
            if roll <= cumulative:
                self.current_condition = condition
                break

    def get_tyre_recommendation(self, state: WeatherState) -> str:
        """
        Recommend tyre compound based on current weather.

        Returns: 'SOFT', 'MEDIUM', 'HARD', 'INTERMEDIATE', or 'WET'
        """
        if state.track_wetness >= 0.6:
            return "WET"
        elif state.track_wetness >= 0.25 or state.condition == "light_rain":
            return "INTERMEDIATE"
        else:
            # Dry compound selection based on track temp
            if state.track_temp >= 45:
                return "HARD"
            elif state.track_temp >= 30:
                return "MEDIUM"
            else:
                return "SOFT"

    def get_grip_multiplier(self, state: WeatherState, compound: str) -> float:
        """
        Get grip level multiplier based on weather + compound combination.
        1.0 = full grip, <1.0 = reduced grip.

        Wrong compound on wrong surface = significant penalty.
        """
        is_wet_compound = compound.upper() in ("INTERMEDIATE", "WET")
        is_wet_track = state.track_wetness > 0.2 or state.condition != "dry"

        if is_wet_track and not is_wet_compound:
            # Slicks on wet = dangerous, massive time loss
            penalty = state.track_wetness * 0.5
            return max(0.4, 1.0 - penalty)

        elif not is_wet_track and is_wet_compound:
            # Wet tyres on dry = overheating, slower
            return 0.85

        elif is_wet_track and is_wet_compound:
            # Correct compound for conditions
            if state.track_wetness >= 0.6 and compound.upper() == "WET":
                return 0.95
            elif state.track_wetness < 0.6 and compound.upper() == "INTERMEDIATE":
                return 0.95
            else:
                return 0.90

        # Dry tyres on dry track = full grip
        return 1.0

    def get_pace_delta(self, state: WeatherState, compound: str) -> float:
        """
        Get the pace delta (seconds) due to weather conditions.
        Accounts for track wetness, wrong compound, etc.
        """
        grip = self.get_grip_multiplier(state, compound)

        # Base pace loss from wet track
        wet_loss = state.track_wetness * 3.0  # up to 3s on fully wet track

        # Compound mismatch penalty
        grip_loss = (1.0 - grip) * 5.0  # up to 3s for wrong compound

        return round(wet_loss + grip_loss, 3)

    @property
    def history(self) -> list:
        """Get all weather states from the race."""
        return self._history
