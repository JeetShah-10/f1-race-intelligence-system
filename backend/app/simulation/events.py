from abc import ABC, abstractmethod
from typing import TYPE_CHECKING, List

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
    """
    def __init__(self):
        self.events: List[RaceEvent] = []

    def register_event(self, event: RaceEvent):
        self.events.append(event)

    def on_lap_start(self, engine: "RaceEngine", lap: int):
        for event in self.events:
            event.before_lap(engine, lap)

    def on_lap_end(self, engine: "RaceEngine", lap: int):
        for event in self.events:
            event.after_lap(engine, lap)
            
    def process_scheduled_events(self, engine: "RaceEngine", lap: int):
        for event in self.events:
            if event.applies_to_lap(lap):
                event.apply(engine)

# ------------------------------------------------------------------------------
# CONCRETE IMPLEMENTATIONS
# ------------------------------------------------------------------------------

class PitStopEvent(RaceEvent):
    """
    Evaluates pit strategy for all drivers on every lap.
    Triggers a pit stop if a driver's tyres are dead.
    """
    
    # Tyre Life Limits (Laps) - Simplified for MVP
    TYRE_LIMITS = {
        "SOFT": 15,
        "MEDIUM": 25,
        "HARD": 40,
        "INTERMEDIATE": 30,
        "WET": 30
    }
    
    # Pit Stop Cost (Seconds) - Bahrain Avg
    PIT_LOSS_TIME = 22.0

    def applies_to_lap(self, lap: int) -> bool:
        # Check every lap
        return True

    def apply(self, engine: "RaceEngine") -> None:
        pass # Not used for this event type, we use before_lap to check status

    def before_lap(self, engine: "RaceEngine", lap: int) -> None:
        """
        Check if any driver needs to pit.
        """
        for driver in engine.drivers:
            if not driver.is_running:
                continue

            current_compound = driver.tire_compound or "SOFT" # Default if not set
            limit = self.TYRE_LIMITS.get(current_compound, 20)
            
            # Simple Strategy: Box if Life > Limit
            if driver.tire_age >= limit and driver.tire_age > 0:
                self._execute_pit_stop(driver, lap)

    def _execute_pit_stop(self, driver, lap):
        """
        Perform the pit stop.
        """
        print(f"🔧 PIT STOP: {driver.driver_id} (Lap {lap}) | Age: {driver.tire_age} -> Boxing!")
        
        # 1. Add Time Penalty
        # This adds to current_time directly, effectively making this lap 22s slower
        # But wait, race_engine adds lap_time to current_time later.
        # So we should add checking logic in race_engine? 
        # Or just modify state here.
        
        # Correct approach: Set a flag so race_engine adds the delta to the LAP TIME.
        driver.in_pit = True
        driver.pit_penalty = self.PIT_LOSS_TIME
        
        # 2. Reset Tyres
        driver.tire_age = 0
        driver.current_stint += 1
        
        # 3. Change Compound automatically (Soft -> Med -> Hard cycle)
        if driver.tire_compound == "SOFT":
            driver.tire_compound = "MEDIUM"
        elif driver.tire_compound == "MEDIUM":
            driver.tire_compound = "HARD"
        else:
            driver.tire_compound = "SOFT"
            
        driver.record_event("PIT_STOP", lap, {"duration": self.PIT_LOSS_TIME})

class SafetyCarEvent(RaceEvent):
    """
    Represents a Safety Car (SC) period.
    Reduces pace and bunches the field.
    """
    
    SC_DELTA_TIME = 120.0 # Slow lap time during SC
    
    def __init__(self, start_lap: int, duration: int):
        self.start_lap = start_lap
        self.end_lap = start_lap + duration
        
    def applies_to_lap(self, lap: int) -> bool:
        return self.start_lap <= lap < self.end_lap

    def apply(self, engine: "RaceEngine") -> None:
        pass # Using hooks

    def before_lap(self, engine: "RaceEngine", lap: int) -> None:
        if self.applies_to_lap(lap):
            print(f"⚠️ SAFETY CAR ACTIVE (Lap {lap})")
            
            # 1. Set global Engine Flag
            engine.flags["SC"] = True
            
            # 2. Bunching Logic (Only on first lap of SC)
            if lap == self.start_lap:
                 print("   -> BUNCHING FIELD")
                 # Sort by position
                 sorted_drivers = sorted(engine.drivers, key=lambda d: d.position)
                 leader = sorted_drivers[0]
                 
                 # Reset times: Leader time, then +0.5s for each car behind
                 current_t = leader.current_time
                 for d in sorted_drivers:
                     d.current_time = current_t
                     current_t += 0.5 # 0.5s gap under SC
                     
    def after_lap(self, engine: "RaceEngine", lap: int) -> None:
        if lap == self.end_lap - 1:
            print("🟩 SAFETY CAR ENDING")
            engine.flags["SC"] = False
