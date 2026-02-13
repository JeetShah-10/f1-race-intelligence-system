# backend/app/simulation/events.py
"""
Race Event System - Lifecycle hooks and concrete event implementations.

Events can modify RaceEngine and DriverState via:
  - before_lap(): called before simulation for the lap
  - after_lap(): called after simulation for the lap
  - apply(): called if applies_to_lap() returns True
  
Concrete events:
  - SafetyCarEvent: Full SC with bunching
  - VSCEvent: Virtual SC with 40% speed reduction, no bunching
  - RedFlagEvent: Race stopped, grid reformed, standing restart
  - WeatherChangeEvent: Triggers tyre strategy re-evaluation
"""

from abc import ABC, abstractmethod
import logging
from typing import TYPE_CHECKING, List, Optional

logger = logging.getLogger(__name__)

if TYPE_CHECKING:
    from app.simulation.race_engine import RaceEngine


class RaceEvent(ABC):
    """
    Abstract base class for race events.
    Events can modify the state of the RaceEngine or DriverState.
    """
    @abstractmethod
    def applies_to_lap(self, lap: int) -> bool:
        pass

    @abstractmethod
    def apply(self, engine: "RaceEngine") -> None:
        pass

    def before_lap(self, engine: "RaceEngine", lap: int) -> None:
        pass

    def after_lap(self, engine: "RaceEngine", lap: int) -> None:
        pass


class EventManager:
    """
    Manages the lifecycle and execution of race events.
    Supports safe iteration - events registered mid-race are queued.
    """
    def __init__(self):
        self.events: List[RaceEvent] = []
        self._pending: List[RaceEvent] = []

    def register_event(self, event: RaceEvent):
        """Register an event. If called during iteration, queued for next lap."""
        self._pending.append(event)

    def on_lap_start(self, engine: "RaceEngine", lap: int):
        # Flush pending events before processing
        self._flush_pending()
        for event in self.events:
            event.before_lap(engine, lap)

    def on_lap_end(self, engine: "RaceEngine", lap: int):
        for event in self.events:
            event.after_lap(engine, lap)

    def process_scheduled_events(self, engine: "RaceEngine", lap: int):
        for event in self.events:
            if event.applies_to_lap(lap):
                event.apply(engine)

    def _flush_pending(self):
        """Move pending events to active list."""
        if self._pending:
            self.events.extend(self._pending)
            self._pending.clear()


# 
# CONCRETE IMPLEMENTATIONS
# 

class SafetyCarEvent(RaceEvent):
    """
    Full Safety Car (SC) period.
    - Reduces all drivers to fixed slow pace (~120s)
    - Bunches the field on deployment lap (gaps compressed to 0.5s)
    - No overtaking allowed
    """
    
    SC_LAP_TIME = 120.0  # Fixed slow pace during SC
    
    def __init__(self, start_lap: int, duration: int):
        self.start_lap = start_lap
        self.end_lap = start_lap + duration
        
    def applies_to_lap(self, lap: int) -> bool:
        return self.start_lap <= lap < self.end_lap

    def apply(self, engine: "RaceEngine") -> None:
        pass  # Using hooks

    def before_lap(self, engine: "RaceEngine", lap: int) -> None:
        if self.applies_to_lap(lap):
            print(f"[!] SAFETY CAR ACTIVE (Lap {lap})")
            
            # Set global flag
            engine.flags["SC"] = True
            engine.flags["VSC"] = False  # SC overrides VSC
            
            # Bunching on first lap of SC
            if lap == self.start_lap:
                print("   -> BUNCHING FIELD")
                sorted_drivers = sorted(engine.drivers, key=lambda d: d.position)
                leader = sorted_drivers[0]
                current_t = leader.current_time
                for d in sorted_drivers:
                    if d.is_running:
                        d.current_time = current_t
                        current_t += 1.0  # 1.0s gap under SC (realistic train spacing)
                        
    def after_lap(self, engine: "RaceEngine", lap: int) -> None:
        if lap == self.end_lap - 1:
            logger.info("[SC] SAFETY CAR ENDING - restart spread applied")
            engine.flags["SC"] = False
            
            # Restart spread: faster cars pull away, slower cars lose time
            # Simulates the chaos of a SC restart where gaps re-form
            import random
            for d in engine.drivers:
                if d.is_running:
                    restart_delta = random.uniform(-0.3, 0.5)  # Asymmetric: easier to lose time
                    d.current_time += restart_delta


class VSCEvent(RaceEvent):
    """
    Virtual Safety Car (VSC) period.
    - All drivers must maintain a minimum lap time (~40% slower than race pace)
    - NO bunching - gaps maintained
    - Pit stops still allowed (and strategically advantageous)
    """
    
    VSC_PACE_MULTIPLIER = 1.40  # 40% slower 
    
    def __init__(self, start_lap: int, duration: int):
        self.start_lap = start_lap
        self.end_lap = start_lap + duration
        
    def applies_to_lap(self, lap: int) -> bool:
        return self.start_lap <= lap < self.end_lap

    def apply(self, engine: "RaceEngine") -> None:
        pass

    def before_lap(self, engine: "RaceEngine", lap: int) -> None:
        if self.applies_to_lap(lap):
            logger.info("[VSC] VIRTUAL SAFETY CAR (Lap %d)", lap)
            engine.flags["VSC"] = True
            engine.flags["SC"] = False  # VSC doesn't coexist with SC
                        
    def after_lap(self, engine: "RaceEngine", lap: int) -> None:
        if lap == self.end_lap - 1:
            logger.info("[VSC] VSC ENDING")
            engine.flags["VSC"] = False


class RedFlagEvent(RaceEvent):
    """
    Red Flag - Race stopped.
    - All drivers return to pit lane
    - Grid reformed in current positions
    - Standing restart on the next lap
    - All tyre ages reset (teams can change tyres freely)
    """
    
    def __init__(self, trigger_lap: int, restart_lap: int):
        self.trigger_lap = trigger_lap
        self.restart_lap = restart_lap  # Typically trigger_lap + 3-5
        self.triggered = False
        
    def applies_to_lap(self, lap: int) -> bool:
        return lap == self.trigger_lap or lap == self.restart_lap

    def apply(self, engine: "RaceEngine") -> None:
        pass

    def before_lap(self, engine: "RaceEngine", lap: int) -> None:
        if lap == self.trigger_lap and not self.triggered:
            logger.info("[RED FLAG] RED FLAG (Lap %d) - RACE STOPPED", lap)
            self.triggered = True
            engine.flags["RED_FLAG"] = True
            engine.flags["SC"] = False
            engine.flags["VSC"] = False
            
            # All drivers get free tyre change
            for driver in engine.drivers:
                if driver.is_running:
                    driver.tire_age = 0
                    driver.tyre_health = 1.0
                    driver.record_event("RED_FLAG_TYRE_RESET", lap)
                    
        if lap == self.restart_lap:
            logger.info("[RESTART] RACE RESTART (Lap %d) - Standing Start", lap)
            engine.flags["RED_FLAG"] = False
            
            # Apply standing start gaps (similar to race start)
            sorted_drivers = sorted(engine.drivers, key=lambda d: d.position)
            leader = sorted_drivers[0]
            current_t = leader.current_time
            for d in sorted_drivers:
                if d.is_running:
                    d.current_time = current_t
                    current_t += 0.5

    def after_lap(self, engine: "RaceEngine", lap: int) -> None:
        pass


class WeatherChangeEvent(RaceEvent):
    """
    Weather transition event.
    Changes the weather condition at a specific lap.
    Triggers tyre strategy re-evaluation in the StrategyAI.
    """
    
    def __init__(self, change_lap: int, new_weather: str):
        self.change_lap = change_lap
        self.new_weather = new_weather
        self.applied = False
        
    def applies_to_lap(self, lap: int) -> bool:
        return lap == self.change_lap and not self.applied

    def apply(self, engine: "RaceEngine") -> None:
        pass

    def before_lap(self, engine: "RaceEngine", lap: int) -> None:
        if not self.applies_to_lap(lap):
            return
            
        old_weather = engine.weather
        engine.weather = self.new_weather
        self.applied = True
        
        logger.info("[WEATHER] WEATHER CHANGE (Lap %d): %s -> %s", lap, old_weather, self.new_weather)
        
        for driver in engine.drivers:
            if driver.is_running:
                driver.record_event("WEATHER_CHANGE", lap, {
                    "old": old_weather,
                    "new": self.new_weather,
                })

    def after_lap(self, engine: "RaceEngine", lap: int) -> None:
        pass
