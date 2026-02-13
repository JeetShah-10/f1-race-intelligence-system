# backend/app/api/season.py
"""
Season championship simulation API.

POST /api/season/simulate - Simulate an entire F1 season
with full point scoring, constructor standings, and progression.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import json
import random
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

# F1 Points system (top 10 + fastest lap)
POINTS_TABLE = {1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 1}
SPRINT_POINTS = {1: 8, 2: 7, 3: 6, 4: 5, 5: 4, 6: 3, 7: 2, 8: 1}

# 2026 Calendar (24 races)
CALENDAR_2026 = [
    {"round": 1, "name": "Australian GP", "circuit": "albert_park", "laps": 58},
    {"round": 2, "name": "Chinese GP", "circuit": "shanghai", "laps": 56},
    {"round": 3, "name": "Japanese GP", "circuit": "suzuka", "laps": 53},
    {"round": 4, "name": "Bahrain GP", "circuit": "bahrain", "laps": 57},
    {"round": 5, "name": "Saudi Arabian GP", "circuit": "jeddah", "laps": 50},
    {"round": 6, "name": "Miami GP", "circuit": "miami", "laps": 57},
    {"round": 7, "name": "Emilia Romagna GP", "circuit": "imola", "laps": 63},
    {"round": 8, "name": "Monaco GP", "circuit": "monaco", "laps": 78},
    {"round": 9, "name": "Spanish GP", "circuit": "barcelona", "laps": 66},
    {"round": 10, "name": "Canadian GP", "circuit": "montreal", "laps": 70},
    {"round": 11, "name": "Austrian GP", "circuit": "spielberg", "laps": 71},
    {"round": 12, "name": "British GP", "circuit": "silverstone", "laps": 52},
    {"round": 13, "name": "Belgian GP", "circuit": "spa", "laps": 44},
    {"round": 14, "name": "Hungarian GP", "circuit": "hungaroring", "laps": 70},
    {"round": 15, "name": "Dutch GP", "circuit": "zandvoort", "laps": 72},
    {"round": 16, "name": "Italian GP", "circuit": "monza", "laps": 53},
    {"round": 17, "name": "Azerbaijan GP", "circuit": "baku", "laps": 51},
    {"round": 18, "name": "Singapore GP", "circuit": "singapore", "laps": 62},
    {"round": 19, "name": "US GP", "circuit": "cota", "laps": 56},
    {"round": 20, "name": "Mexico City GP", "circuit": "mexico", "laps": 71},
    {"round": 21, "name": "Brazilian GP", "circuit": "interlagos", "laps": 71},
    {"round": 22, "name": "Las Vegas GP", "circuit": "las_vegas", "laps": 50},
    {"round": 23, "name": "Qatar GP", "circuit": "qatar", "laps": 57},
    {"round": 24, "name": "Abu Dhabi GP", "circuit": "abu_dhabi", "laps": 58},
]


#  Schemas 

class SeasonRequest(BaseModel):
    num_races: int = 24
    weather_variance: float = 0.2     # Probability of rain per race
    include_sprints: bool = False
    seed: Optional[int] = None


class RaceWinner(BaseModel):
    round: int
    circuit: str
    name: str
    winner: str
    winner_team: str
    fastest_lap: Optional[str] = None


class DriverStanding(BaseModel):
    position: int
    driver: str
    team: str
    points: float
    wins: int
    podiums: int


class ConstructorStanding(BaseModel):
    position: int
    constructor: str
    points: float
    wins: int


class ChampionshipPoint(BaseModel):
    round: int
    driver: str
    cumulative_points: float


class SeasonResult(BaseModel):
    num_races: int
    driver_standings: List[DriverStanding]
    constructor_standings: List[ConstructorStanding]
    race_winners: List[RaceWinner]
    championship_progression: List[ChampionshipPoint]
    world_champion: str
    constructors_champion: str


def _build_full_grid() -> List[DriverInput]:
    """Build the full 2026 grid from config."""
    drivers = []
    for i, d in enumerate(SEASON_CONFIG.get("drivers", [])[:20]):
        team_name = d.get("team_id", "Unknown")
        for t in SEASON_CONFIG.get("teams", []):
            if t.get("id") == d.get("team_id"):
                team_name = t.get("name", team_name)
                break
        drivers.append(DriverInput(
            driver=d.get("code", f"DR{i}"),
            team=team_name,
            grid_position=i + 1,
            compound="MEDIUM" if i < 10 else "HARD",
        ))
    return drivers


@router.post("/simulate", response_model=SeasonResult)
def simulate_season(request: SeasonRequest):
    """
    Simulate an entire F1 season.

    Runs individual race simulations for each round,
    tracks points, and determines champions.
    """
    rng = random.Random(request.seed)
    calendar = CALENDAR_2026[:request.num_races]

    # Points tracking
    driver_points: Dict[str, float] = {}
    driver_wins: Dict[str, int] = {}
    driver_podiums: Dict[str, int] = {}
    driver_teams: Dict[str, str] = {}
    constructor_points: Dict[str, float] = {}
    constructor_wins: Dict[str, int] = {}

    race_winners: List[RaceWinner] = []
    progression: List[ChampionshipPoint] = []

    grid = _build_full_grid()

    # Initialize tracking
    for d in grid:
        driver_points[d.driver] = 0
        driver_wins[d.driver] = 0
        driver_podiums[d.driver] = 0
        driver_teams[d.driver] = d.team

    for race in calendar:
        try:
            # Randomize grid (qualifying simulation approximation)
            shuffled = list(range(len(grid)))
            rng.shuffle(shuffled)

            race_grid = []
            for new_pos, orig_idx in enumerate(shuffled):
                d = grid[orig_idx]
                race_grid.append(DriverInput(
                    driver=d.driver,
                    team=d.team,
                    grid_position=new_pos + 1,
                    compound="MEDIUM" if new_pos < 10 else "HARD",
                ))

            weather = "DRY"
            if rng.random() < request.weather_variance:
                weather = rng.choice(["LIGHT_RAIN", "HEAVY_RAIN"])

            ml_handoff = prediction_service.get_simulation_handoff_raw(race_grid)
            pace_model = prediction_service.get_pace_model()

            ctx = SimulationContext(
                drivers=race_grid,
                weather=weather,
                circuit=race["circuit"],
                year=2026,
                lap_count=race["laps"],
                track_temp=30.0 + rng.uniform(-10, 15),
                air_temp=22.0 + rng.uniform(-5, 10),
                ml_handoff=ml_handoff,
                pace_model=pace_model,
            )

            engine = RaceEngine(ctx)
            result = engine.run()

            # Score points
            fastest_lap_driver = None
            fastest_time = float("inf")
            race_result = result.get("results", [])

            for r in race_result:
                code = r.get("driver_id", "")
                pos = r.get("position", 99)

                if pos in POINTS_TABLE:
                    pts = POINTS_TABLE[pos]
                    driver_points[code] = driver_points.get(code, 0) + pts
                    team = driver_teams.get(code, "")
                    constructor_points[team] = constructor_points.get(team, 0) + pts

                if pos == 1:
                    driver_wins[code] = driver_wins.get(code, 0) + 1
                    team = driver_teams.get(code, "")
                    constructor_wins[team] = constructor_wins.get(team, 0) + 1

                if pos <= 3:
                    driver_podiums[code] = driver_podiums.get(code, 0) + 1

                # Track fastest lap
                total = r.get("total_time", float("inf"))
                if total < fastest_time:
                    fastest_time = total
                    fastest_lap_driver = code

            # Fastest lap bonus point (only if in top 10)
            if fastest_lap_driver:
                for r in race_result:
                    if r.get("driver_id") == fastest_lap_driver and r.get("position", 99) <= 10:
                        driver_points[fastest_lap_driver] += 1
                        break

            # Record winner
            if race_result:
                w = race_result[0]
                race_winners.append(RaceWinner(
                    round=race["round"],
                    circuit=race["circuit"],
                    name=race["name"],
                    winner=w.get("driver_id", ""),
                    winner_team=w.get("team", ""),
                    fastest_lap=fastest_lap_driver,
                ))

            # Championship progression
            for code, pts in driver_points.items():
                progression.append(ChampionshipPoint(
                    round=race["round"],
                    driver=code,
                    cumulative_points=pts,
                ))

        except Exception as e:
            print(f"Season sim error at {race['name']}: {e}")
            continue

    # Generate final standings
    sorted_drivers = sorted(driver_points.items(), key=lambda x: x[1], reverse=True)
    driver_standings = [
        DriverStanding(
            position=i + 1,
            driver=code,
            team=driver_teams.get(code, ""),
            points=pts,
            wins=driver_wins.get(code, 0),
            podiums=driver_podiums.get(code, 0),
        )
        for i, (code, pts) in enumerate(sorted_drivers)
    ]

    sorted_constructors = sorted(constructor_points.items(), key=lambda x: x[1], reverse=True)
    const_standings = [
        ConstructorStanding(
            position=i + 1,
            constructor=name,
            points=pts,
            wins=constructor_wins.get(name, 0),
        )
        for i, (name, pts) in enumerate(sorted_constructors)
    ]

    return SeasonResult(
        num_races=len(calendar),
        driver_standings=driver_standings,
        constructor_standings=const_standings,
        race_winners=race_winners,
        championship_progression=progression,
        world_champion=sorted_drivers[0][0] if sorted_drivers else "",
        constructors_champion=sorted_constructors[0][0] if sorted_constructors else "",
    )
