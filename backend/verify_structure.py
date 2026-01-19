
from app.simulation.race_engine import RaceEngine
from app.simulation.driver_state import DriverState

drivers = [
    DriverState("VER", "Red Bull", 1, 1.0),
    DriverState("HAM", "Mercedes", 2, 1.02),
]

engine = RaceEngine(
    drivers=drivers,
    weather="Dry",
    circuit="Monza",
    lap_count=5
)

result = engine.run()
print(result)
