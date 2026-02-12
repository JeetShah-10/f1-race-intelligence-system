# backend/app/api/compare.py
"""
Driver head-to-head comparison API.

POST /api/compare/drivers — Compare two drivers across circuits using
the 2026 season config and optionally historical FastF1 data.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import json
from pathlib import Path

from app.services.prediction_service import PredictionService
from app.simulation.simulation_context import SimulationContext
from app.simulation.race_engine import RaceEngine
from app.schemas.simulation import DriverInput

router = APIRouter()
prediction_service = PredictionService()

# Load 2026 season config
CONFIG_PATH = Path(__file__).parent.parent / "config" / "2026_season.json"
with open(CONFIG_PATH) as f:
    SEASON_CONFIG = json.load(f)


# ── Schemas ──

class CompareRequest(BaseModel):
    driver1: str           # e.g. "VER"
    driver2: str           # e.g. "NOR"
    circuits: Optional[List[str]] = None  # If None, use default set
    year: int = 2026
    num_simulations: int = 3  # Races per circuit for statistical significance


class CircuitBreakdown(BaseModel):
    circuit: str
    driver1_avg_position: float
    driver2_avg_position: float
    driver1_avg_time: float
    driver2_avg_time: float
    winner: str


class HeadToHeadResult(BaseModel):
    driver1: str
    driver2: str
    driver1_team: str
    driver2_team: str
    race_wins: Dict[str, int]
    avg_position: Dict[str, float]
    avg_pace_gap: float    # seconds (positive = driver1 faster)
    circuits_raced: int
    circuit_breakdown: List[CircuitBreakdown]


# Default circuits for comparison
DEFAULT_CIRCUITS = ["monaco", "silverstone", "monza", "spa", "suzuka"]


def _find_driver_config(code: str) -> Optional[dict]:
    """Find driver in 2026 season config."""
    for d in SEASON_CONFIG.get("drivers", []):
        if d.get("code", "").upper() == code.upper():
            return d
    return None


def _find_team_name(team_id: str) -> str:
    """Get team name from ID."""
    for t in SEASON_CONFIG.get("teams", []):
        if t.get("id") == team_id:
            return t.get("name", team_id)
    return team_id


def _build_grid_with_drivers(d1_code: str, d2_code: str) -> List[DriverInput]:
    """Build a full 20-driver grid with our two comparison drivers."""
    drivers = []
    for i, d in enumerate(SEASON_CONFIG.get("drivers", [])[:20]):
        team = _find_team_name(d.get("team_id", ""))
        drivers.append(DriverInput(
            driver=d.get("code", f"DR{i}"),
            team=team,
            grid_position=i + 1,
            compound="MEDIUM" if i < 10 else "HARD",
        ))
    return drivers


@router.post("/drivers", response_model=HeadToHeadResult)
def compare_drivers(request: CompareRequest):
    """
    Compare two drivers head-to-head across multiple circuits.

    Runs simulations on each circuit and aggregates results.
    """
    # Validate drivers
    d1_config = _find_driver_config(request.driver1)
    d2_config = _find_driver_config(request.driver2)

    if not d1_config:
        raise HTTPException(404, f"Driver '{request.driver1}' not found in 2026 config")
    if not d2_config:
        raise HTTPException(404, f"Driver '{request.driver2}' not found in 2026 config")

    d1_team = _find_team_name(d1_config.get("team_id", ""))
    d2_team = _find_team_name(d2_config.get("team_id", ""))

    circuits = request.circuits or DEFAULT_CIRCUITS
    circuit_breakdown = []
    total_wins = {request.driver1: 0, request.driver2: 0}
    all_positions = {request.driver1: [], request.driver2: []}
    all_times = {request.driver1: [], request.driver2: []}

    grid = _build_grid_with_drivers(request.driver1, request.driver2)

    for circuit in circuits:
        circuit_d1_positions = []
        circuit_d2_positions = []
        circuit_d1_times = []
        circuit_d2_times = []

        for sim_run in range(request.num_simulations):
            try:
                ml_handoff = prediction_service.get_simulation_handoff_raw(grid)
                pace_model = prediction_service.get_pace_model()

                ctx = SimulationContext(
                    drivers=grid,
                    weather="DRY",
                    circuit=circuit,
                    year=request.year,
                    lap_count=50,
                    track_temp=35.0,
                    air_temp=25.0,
                    ml_handoff=ml_handoff,
                    pace_model=pace_model,
                )

                engine = RaceEngine(ctx)
                result = engine.run()

                # Find our two drivers in results
                for r in result.get("results", []):
                    code = r.get("driver_id", "")
                    if code == request.driver1:
                        circuit_d1_positions.append(r.get("position", 20))
                        circuit_d1_times.append(r.get("total_time", 0))
                    elif code == request.driver2:
                        circuit_d2_positions.append(r.get("position", 20))
                        circuit_d2_times.append(r.get("total_time", 0))

            except Exception as e:
                print(f"Simulation error for {circuit}: {e}")
                continue

        if circuit_d1_positions and circuit_d2_positions:
            d1_avg_pos = sum(circuit_d1_positions) / len(circuit_d1_positions)
            d2_avg_pos = sum(circuit_d2_positions) / len(circuit_d2_positions)
            d1_avg_time = sum(circuit_d1_times) / len(circuit_d1_times) if circuit_d1_times else 0
            d2_avg_time = sum(circuit_d2_times) / len(circuit_d2_times) if circuit_d2_times else 0

            winner = request.driver1 if d1_avg_pos < d2_avg_pos else request.driver2
            total_wins[winner] = total_wins.get(winner, 0) + 1

            all_positions[request.driver1].extend(circuit_d1_positions)
            all_positions[request.driver2].extend(circuit_d2_positions)
            all_times[request.driver1].extend(circuit_d1_times)
            all_times[request.driver2].extend(circuit_d2_times)

            circuit_breakdown.append(CircuitBreakdown(
                circuit=circuit,
                driver1_avg_position=round(d1_avg_pos, 1),
                driver2_avg_position=round(d2_avg_pos, 1),
                driver1_avg_time=round(d1_avg_time, 2),
                driver2_avg_time=round(d2_avg_time, 2),
                winner=winner,
            ))

    # Aggregate
    d1_avg = sum(all_positions[request.driver1]) / max(len(all_positions[request.driver1]), 1)
    d2_avg = sum(all_positions[request.driver2]) / max(len(all_positions[request.driver2]), 1)

    d1_time_avg = sum(all_times[request.driver1]) / max(len(all_times[request.driver1]), 1)
    d2_time_avg = sum(all_times[request.driver2]) / max(len(all_times[request.driver2]), 1)
    pace_gap = round(d2_time_avg - d1_time_avg, 3)

    return HeadToHeadResult(
        driver1=request.driver1,
        driver2=request.driver2,
        driver1_team=d1_team,
        driver2_team=d2_team,
        race_wins=total_wins,
        avg_position={
            request.driver1: round(d1_avg, 1),
            request.driver2: round(d2_avg, 1),
        },
        avg_pace_gap=pace_gap,
        circuits_raced=len(circuit_breakdown),
        circuit_breakdown=circuit_breakdown,
    )
