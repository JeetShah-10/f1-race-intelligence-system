# backend/app/simulation/random_event_injector.py
"""
Random Event Injector - Generates realistic race events independently of crashes.

In real F1, ~60% of races have at least one Safety Car period, and many SC deployments
are caused by debris, barrier damage, or stranded cars - not always from a crash in the
current race. Weather can also shift mid-race independently.

This module injects:
  - Random Safety Cars (debris, track obstruction)
  - Random VSC periods (car stopped in safe area)
  - Weather transitions (dry -> damp -> wet and back)

Probabilities are calibrated per-lap and per-circuit for realism.
"""

import random
import logging
from typing import Optional, TYPE_CHECKING

logger = logging.getLogger(__name__)

if TYPE_CHECKING:
    from app.simulation.race_engine import RaceEngine

from app.simulation.events import SafetyCarEvent, VSCEvent, WeatherChangeEvent


# Circuit-specific weather volatility (probability of weather change per lap)
# Higher = more likely to see rain mid-race
CIRCUIT_WEATHER_VOLATILITY = {
    "silverstone": 0.015,    # Famously unpredictable British weather
    "spa": 0.020,            # Spa is notorious for micro-climates and sudden rain
    "montreal": 0.012,       # Montreal can get surprise showers
    "suzuka": 0.010,         # Typhoon season proximity
    "interlagos": 0.018,     # São Paulo weather is highly volatile
    "albert_park": 0.008,    # Melbourne is generally stable
    "shanghai": 0.010,       # Moderate volatility
    "hungaroring": 0.006,    # Usually hot and dry
    "monaco": 0.003,         # Sheltered, rarely changes mid-race
    "bahrain": 0.001,        # Desert, almost never rains
    "jeddah": 0.001,         # Desert coast
    "miami": 0.008,          # Subtropical, occasional storms
    "singapore": 0.005,      # Night race, occasional tropical showers
    "baku": 0.003,           # Generally dry Caspian climate
    "austin": 0.008,         # Texas weather is unpredictable
    "mexico": 0.005,         # High altitude, usually dry
    "las_vegas": 0.002,      # Desert, very dry
    "lusail": 0.001,         # Qatar desert
    "yas_marina": 0.001,     # Abu Dhabi, virtually never rains
    "madrid": 0.005,         # Continental Spain, moderate
    "zandvoort": 0.012,      # North Sea coast, changeable
    "monza": 0.006,          # Northern Italy, moderate
    "spielberg": 0.010,      # Alpine, can get sudden storms
    "imola": 0.007,          # Emilia-Romagna, moderate
    "barcelona": 0.004,      # Mediterranean, usually dry
}

DEFAULT_WEATHER_VOLATILITY = 0.005

# Weather transition matrix (what weather can transition to)
WEATHER_TRANSITIONS = {
    "dry": ["damp"],
    "damp": ["dry", "wet"],
    "wet": ["damp"],
}


class RandomEventInjector:
    """
    Generates random race events each lap, independent of crash/mechanical incidents.
    
    Respects existing SC/VSC state - won't stack multiple neutralizations.
    Events become more probable in the first 5 laps (Lap 1 chaos) and during
    the final 10 laps (when drivers push harder and make mistakes).
    
    Calibrated so that across a typical 57-lap race:
      - ~40% chance of at least one random SC/VSC event
      - ~15-25% chance of a weather change (circuit-dependent)
    """

    # Base probabilities per lap (before circuit/phase multipliers)
    BASE_SC_PROB = 0.008       # 0.8% per lap -> ~40% over 57 laps
    BASE_VSC_PROB = 0.012      # 1.2% per lap
    
    # Lap-1 chaos multiplier (first 3 laps have much higher incident rates)
    OPENING_LAP_MULTIPLIER = 3.0
    OPENING_LAP_RANGE = 3      # First N laps
    
    # Final stint push multiplier (last 10 laps, drivers pushing hard)
    CLOSING_LAPS_MULTIPLIER = 1.5
    CLOSING_LAPS_RANGE = 10

    def __init__(self, rng: random.Random = None):
        self.rng = rng or random.Random()
        self._cooldown = 0  # Laps of cooldown after an event (prevents stacking)

    def evaluate_lap(
        self,
        engine: "RaceEngine",
        lap: int,
    ) -> None:
        """
        Evaluate whether a random event should be injected this lap.
        Called from race_engine._process_events() each lap.
        """
        # Don't inject if SC/VSC/Red Flag is already active
        if engine.flags.get("SC") or engine.flags.get("VSC") or engine.flags.get("RED_FLAG"):
            return
        
        # Cooldown period after last event
        if self._cooldown > 0:
            self._cooldown -= 1
            return
        
        # Don't inject in first lap (race start handled separately)
        if lap < 2:
            return
        
        # Calculate phase multiplier
        phase_mult = 1.0
        if lap <= self.OPENING_LAP_RANGE:
            phase_mult = self.OPENING_LAP_MULTIPLIER
        elif lap > engine.lap_count - self.CLOSING_LAPS_RANGE:
            phase_mult = self.CLOSING_LAPS_MULTIPLIER
        
        # 1. Check for random Safety Car (debris, marshals, etc.)
        sc_prob = self.BASE_SC_PROB * phase_mult
        if self.rng.random() < sc_prob:
            duration = self.rng.randint(2, 5)
            event = SafetyCarEvent(start_lap=lap + 1, duration=duration)
            engine.event_manager.register_event(event)
            logger.info("[SC] RANDOM SC DEPLOYED (Lap %d) - debris on track", lap)
            self._cooldown = duration + 3  # Cooldown after SC
            return  # Only one event per lap
        
        # 2. Check for random VSC (car stopped safely, minor debris)
        vsc_prob = self.BASE_VSC_PROB * phase_mult
        if self.rng.random() < vsc_prob:
            duration = self.rng.randint(1, 3)
            event = VSCEvent(start_lap=lap + 1, duration=duration)
            engine.event_manager.register_event(event)
            logger.info("[VSC] RANDOM VSC DEPLOYED (Lap %d) - track obstruction", lap)
            self._cooldown = duration + 2
            return
        
        # 3. Check for weather change
        self._check_weather_change(engine, lap)

    def _check_weather_change(self, engine: "RaceEngine", lap: int) -> None:
        """
        Check for mid-race weather transitions based on circuit volatility.
        """
        circuit_id = engine.circuit.lower()
        volatility = CIRCUIT_WEATHER_VOLATILITY.get(circuit_id, DEFAULT_WEATHER_VOLATILITY)
        
        if self.rng.random() < volatility:
            current_weather = engine.weather.lower()
            possible_transitions = WEATHER_TRANSITIONS.get(current_weather, [])
            
            if possible_transitions:
                new_weather = self.rng.choice(possible_transitions)
                event = WeatherChangeEvent(change_lap=lap + 1, new_weather=new_weather)
                engine.event_manager.register_event(event)
                logger.info("[WEATHER] TRANSITION SCHEDULED (Lap %d): %s -> %s", lap + 1, current_weather, new_weather)
                self._cooldown = 5  # Don't change weather again for 5 laps
