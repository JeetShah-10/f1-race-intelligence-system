from app.simulation.driver_state import DriverState

d = DriverState(
    driver_id="VER",
    team="Red Bull",
    grid_position=1,
    base_pace=1.0
)

print(d.driver_id, d.position, d.base_pace)