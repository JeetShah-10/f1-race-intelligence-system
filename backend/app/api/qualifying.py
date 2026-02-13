from fastapi import APIRouter, HTTPException
from app.schemas.qualifying import QualifyingRequest, QualifyingResult, QualifyingResultItem
from app.services.prediction_service import PredictionService
from app.services.driver_mapping import to_ml_driver_sector, to_ml_team_sector
import random

router = APIRouter()
prediction_service = PredictionService()

@router.post("/qualify", response_model=QualifyingResult)
def run_qualifying(request: QualifyingRequest):
    pace_model = prediction_service.get_pace_model()
    circuit = request.circuit_id
    
    # Initialize all drivers
    drivers = request.drivers
    results_map = {d.driver: {"q1": None, "q2": None, "q3": None, "best": None} for d in drivers}
    
    #  Q1 Session 
    # All drivers participate
    q1_times = []
    for d in drivers:
        time = _simulate_qualifying_lap(pace_model, d.driver, d.team, circuit, "Q1")
        q1_times.append((d, time))
        results_map[d.driver]["q1"] = time
        results_map[d.driver]["best"] = time

    # Sort and eliminate bottom 5
    q1_sorted = sorted(q1_times, key=lambda x: x[1])
    q2_drivers = [x[0] for x in q1_sorted[:15]]
    
    #  Q2 Session 
    q2_times = []
    for d in q2_drivers:
        time = _simulate_qualifying_lap(pace_model, d.driver, d.team, circuit, "Q2")
        q2_times.append((d, time))
        results_map[d.driver]["q2"] = time
        if time < results_map[d.driver]["best"]:
            results_map[d.driver]["best"] = time

    # Sort and eliminate bottom 5
    q2_sorted = sorted(q2_times, key=lambda x: x[1])
    q3_drivers = [x[0] for x in q2_sorted[:10]]

    #  Q3 Session 
    q3_times = []
    for d in q3_drivers:
        time = _simulate_qualifying_lap(pace_model, d.driver, d.team, circuit, "Q3")
        q3_times.append((d, time))
        results_map[d.driver]["q3"] = time
        if time < results_map[d.driver]["best"]:
             results_map[d.driver]["best"] = time

    q3_sorted = sorted(q3_times, key=lambda x: x[1])
    
    #  Construct Final Classification 
    # Order: Q3 sorted (1-10), Q2 eliminated (11-15), Q1 eliminated (16-20)
    
    final_order = []
    
    # 1-10: Based on Q3 times
    final_order.extend(q3_sorted)
    
    # 11-15: Based on Q2 times (drivers who made Q2 but not Q3)
    q2_eliminated = [x for x in q2_sorted if x[0] not in q3_drivers]
    final_order.extend(q2_eliminated)
    
    # 16-20: Based on Q1 times (drivers who didn't make Q2)
    q1_eliminated = [x for x in q1_sorted if x[0] not in q2_drivers]
    final_order.extend(q1_eliminated)
    
    # Build Response
    pole_time = final_order[0][1]
    
    response_items = []
    for i, (driver, _) in enumerate(final_order):
        d_res = results_map[driver.driver]
        item = QualifyingResultItem(
            driver_id=driver.driver,
            team=driver.team,
            position=i + 1,
            q1_time=d_res["q1"],
            q2_time=d_res["q2"],
            q3_time=d_res["q3"],
            best_time=d_res["best"],
            gap_to_pole=d_res["best"] - pole_time if d_res["best"] else None
        )
        response_items.append(item)
        
    return QualifyingResult(
        circuit_id=circuit,
        weather=request.weather,
        results=response_items
    )

def _simulate_qualifying_lap(model, driver, team, circuit, session):
    """
    Simulate a single qualifying lap using the ML pace model.
    
    Since the sector model was trained on Bahrain data only, we apply
    circuit-specific time offsets calibrated to real-world lap time
    differences between circuits (relative to Bahrain ~90s base).
    """
    # Circuit-specific lap time offsets (relative to Bahrain ~90s)
    # Positive = slower circuit, Negative = faster circuit
    circuit_offsets = {
        "bahrain": 0.0,
        "jeddah": -3.5,        # Jeddah is faster (~87s)
        "albert_park": -4.0,   # Melbourne (~86s)
        "suzuka": 1.5,         # Suzuka is longer (~91.5s)
        "shanghai": 4.0,       # Shanghai (~94s)
        "miami": -1.0,         # Miami (~89s)
        "imola": -4.5,         # Imola shorter (~85.5s)
        "monaco": -16.0,       # Monaco very short (~74s)
        "montreal": -4.0,      # Montreal (~86s)
        "barcelona": -10.0,    # Barcelona (~80s)
        "spielberg": -22.0,    # Austria short (~68s)
        "silverstone": -2.5,   # Silverstone (~87.5s)
        "hungaroring": -12.0,  # Hungary short (~78s)
        "spa": 16.0,           # Spa long (~106s)
        "zandvoort": -18.0,    # Zandvoort short (~72s)
        "monza": -9.0,         # Monza fast (~81s)
        "baku": 10.0,          # Baku street (~100s)
        "singapore": 5.0,     # Singapore street (~95s)
        "austin": 5.0,         # COTA medium (~95s)
        "mexico": 7.0,         # Mexico City altitude (~97s)
        "interlagos": -19.0,   # Interlagos short (~71s)
        "las_vegas": 4.0,      # Las Vegas (~94s)
        "lusail": -2.0,        # Qatar (~88s)
        "yas_marina": -4.0,    # Abu Dhabi (~86s)
        "madrid": -2.0,        # Madrid (~88s)
    }
    
    # Get circuit offset (default to 0 for unknown circuits)
    circuit_key = circuit.lower().replace(" ", "_").replace("-", "_")
    offset = circuit_offsets.get(circuit_key, 0.0)
    
    # Map driver/team to ML model IDs
    ml_driver = to_ml_driver_sector(driver)
    ml_team = to_ml_team_sector(team)
    
    # Base pace from ML model (pass circuit for sector model)
    base_time = model.predict_lap_time(
        driver=ml_driver,
        compound="SOFT",
        tyre_life=1,
        team=ml_team,
        speed_st=320.0,
        speed_fl=300.0,
        lap_number=1,
        circuit=circuit_key,
    )
    
    # Apply circuit offset
    base_time += offset
    
    # Qualifying adjustments (ML trained on race pace, quali is ~3.5s faster)
    quali_adjustment = -3.5
    
    # Track evolution per session
    evolution = {"Q1": 0.0, "Q2": -0.2, "Q3": -0.4}[session]
    
    # Seeded random variance for deterministic results
    # Include circuit in seed so different circuits produce different grids
    rng = random.Random(hash(f"{circuit}_{driver}_{team}_{session}"))
    variance = rng.uniform(-0.3, 0.3)
    
    return base_time + quali_adjustment + evolution + variance
