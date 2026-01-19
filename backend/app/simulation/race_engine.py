# backend/app/simulation/race_engine.py
import random
from app.simulation.driver_state import DriverState
from app.schemas.ml_simulation_handoff import MLHandoff
from typing import List


class RaceEngine:
    """
    Deterministic race simulation engine.
    This class is responsible for race progression logic,
    NOT machine learning.
    """

    def __init__(self, drivers: List[dict], weather: str, circuit: str, lap_count: int, ml_handoff: List[MLHandoff]):
        """
        drivers: list of driver dicts from API
        weather: str (Dry / Light Rain / Wet)
        circuit: str
        lap_count: int
        ml_handoff: list of MLHandoff objects
        """
        self.weather = weather
        self.circuit = circuit
        self.lap_count = lap_count
        self.current_lap = 0
        self.timeline = []

        # Create a lookup for the ML handoff data
        self.ml_data = {h.driver_id: h for h in ml_handoff}

        # Initialize DriverState objects
        self.drivers = []
        for d in drivers:
            driver_state = DriverState(
                driver_id=d["driver_id"],
                team=d["team"],
                grid_position=d["grid_position"],
                base_pace=self.ml_data.get(d["driver_id"]).baseline_lap_time
            )
            driver_state.tyre_degradation_slope = self.ml_data.get(d["driver_id"]).tyre_degradation_slope
            self.drivers.append(driver_state)

        self.driver_map = {driver.driver_id: driver for driver in self.drivers}


    def run(self):
        """
        Main race loop.
        """
        self.initialize_race()

        for lap in range(1, self.lap_count + 1):
            self.current_lap = lap
            self.simulate_lap(lap)

        return self.final_results()

    def initialize_race(self):
        """
        Prepare race start state.
        (Grid order, initial gaps, tire assignment, etc.)
        """
        for driver in self.drivers:
            # driver.tire_compound is set in the request
            driver.tire_age = 0
            # Start of race, small gap based on grid position
            driver.current_time = driver.grid_position * 0.2 

    def simulate_lap(self, lap):
        """
        Simulate one lap of the race.
        """
        for driver in self.drivers:
            if driver.is_running:
                degradation = driver.tyre_degradation_slope * driver.tire_age
                random_noise = random.uniform(-0.1, 0.1) # a tenth of a second variance
                
                lap_time = driver.base_pace + degradation + random_noise
                
                driver.last_lap_time = lap_time
                driver.lap_times.append(lap_time)
                driver.current_time += lap_time
                driver.tire_age += 1


    def final_results(self):
        """
        Return final classification and metadata.
        """
        sorted_drivers = sorted(self.drivers, key=lambda d: d.current_time)
        results = []
        leader_time = sorted_drivers[0].current_time
        for i, driver in enumerate(sorted_drivers):
            results.append({
                "driver_id": driver.driver_id,
                "position": i + 1,
                "time": driver.current_time,
                "gap_to_leader": driver.current_time - leader_time,
                "lap_times": driver.lap_times,
                "status": "Finished" if driver.is_running else "DNF"
            })

        return {
            "circuit": self.circuit,
            "weather": self.weather,
            "laps": self.lap_count,
            "results": results
        }
