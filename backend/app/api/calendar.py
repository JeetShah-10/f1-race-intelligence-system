# backend/app/api/calendar.py
"""
Race calendar endpoint — reads from Supabase `races` table.
"""

from fastapi import APIRouter, Query
from app.services.database_service import DatabaseService

router = APIRouter()
db_service = DatabaseService()

# Circuit metadata for lap counts, turns, DRS zones (not stored in Supabase)
CIRCUIT_META = {
    "albert_park": {"laps": 58, "turns": 14, "drs_zones": 4, "length": 5.278},
    "shanghai": {"laps": 56, "turns": 16, "drs_zones": 2, "length": 5.451},
    "suzuka": {"laps": 53, "turns": 18, "drs_zones": 1, "length": 5.807},
    "bahrain": {"laps": 57, "turns": 15, "drs_zones": 3, "length": 5.412},
    "jeddah": {"laps": 50, "turns": 27, "drs_zones": 3, "length": 6.174},
    "miami": {"laps": 57, "turns": 19, "drs_zones": 3, "length": 5.412},
    "monaco": {"laps": 78, "turns": 19, "drs_zones": 1, "length": 3.337},
    "barcelona": {"laps": 66, "turns": 14, "drs_zones": 2, "length": 4.675},
    "montreal": {"laps": 70, "turns": 14, "drs_zones": 2, "length": 4.361},
    "silverstone": {"laps": 52, "turns": 18, "drs_zones": 2, "length": 5.891},
    "red_bull_ring": {"laps": 71, "turns": 10, "drs_zones": 3, "length": 4.318},
    "budapest": {"laps": 70, "turns": 14, "drs_zones": 2, "length": 4.381},
    "spa": {"laps": 44, "turns": 19, "drs_zones": 2, "length": 7.004},
    "zandvoort": {"laps": 72, "turns": 14, "drs_zones": 1, "length": 4.259},
    "monza": {"laps": 53, "turns": 11, "drs_zones": 2, "length": 5.793},
    "baku": {"laps": 51, "turns": 20, "drs_zones": 2, "length": 6.003},
    "marina_bay": {"laps": 62, "turns": 23, "drs_zones": 3, "length": 4.940},
    "cota": {"laps": 56, "turns": 20, "drs_zones": 2, "length": 5.513},
    "mexico": {"laps": 71, "turns": 17, "drs_zones": 3, "length": 4.304},
    "interlagos": {"laps": 71, "turns": 15, "drs_zones": 2, "length": 4.309},
    "las_vegas": {"laps": 50, "turns": 17, "drs_zones": 2, "length": 6.201},
    "losail": {"laps": 57, "turns": 16, "drs_zones": 2, "length": 5.380},
    "yas_marina": {"laps": 58, "turns": 16, "drs_zones": 2, "length": 5.281},
    "madrid": {"laps": 66, "turns": 16, "drs_zones": 2, "length": 4.670},
}


@router.get("/{year}")
async def get_race_calendar(year: int = 2026):
    """Get full race calendar for a year with circuit metadata."""
    races = db_service.get_calendar(year)
    if not races:
        return {"calendar": [], "year": year}

    calendar = []
    for race in races:
        cid = race.get("circuit_id", "")
        meta = CIRCUIT_META.get(cid, {"laps": 50, "turns": 15, "drs_zones": 2, "length": 5.0})
        circuit_data = race.get("circuits", {}) or {}

        calendar.append({
            "raceId": race.get("race_id"),
            "round": race.get("round"),
            "name": race.get("name"),
            "date": race.get("date"),
            "circuitId": cid,
            "circuitName": circuit_data.get("name", race.get("name", "")),
            "country": circuit_data.get("country", ""),
            "lat": circuit_data.get("lat"),
            "lng": circuit_data.get("lng"),
            "totalLaps": meta["laps"],
            "turns": meta["turns"],
            "drsZones": meta["drs_zones"],
            "length": meta["length"],
        })

    return {"calendar": calendar, "year": year}
