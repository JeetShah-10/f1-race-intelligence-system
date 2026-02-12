# backend/app/api/circuits.py
"""
Circuit detail endpoint — reads from Supabase `circuits` table.
"""

from fastapi import APIRouter, HTTPException
from app.services.database_service import DatabaseService

router = APIRouter()
db_service = DatabaseService()

# Static metadata enrichment
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


@router.get("/")
async def list_circuits():
    """List all circuits."""
    circuits = db_service.get_circuits()
    
    # Fallback if DB is empty: Use CIRCUIT_META keys
    if not circuits:
        result = []
        for cid, meta in CIRCUIT_META.items():
            # Basic formatting for name/country since they aren't in meta
            name = cid.replace("_", " ").title()
            country = "Unknown" 
            
            result.append({
                "id": cid,
                "name": name,
                "country": country,
                "length": meta["length"],
                "turns": meta["turns"],
                "laps": meta["laps"],
                "drsZones": meta["drs_zones"],
            })
        return {"circuits": result}

    result = []
    for c in circuits:
        cid = c.get("circuit_id", "")
        meta = CIRCUIT_META.get(cid, {"laps": 50, "turns": 15, "drs_zones": 2, "length": 5.0})
        result.append({
            "id": cid,
            "name": c.get("name", ""),
            "country": c.get("country", ""),
            "length": meta["length"],
            "turns": meta["turns"],
            "laps": meta["laps"],
            "drsZones": meta["drs_zones"],
        })
    return {"circuits": result}


@router.get("/{circuit_id}")
async def get_circuit(circuit_id: str):
    """Get a single circuit by ID with full metadata."""
    circuit = db_service.get_circuit(circuit_id)
    if not circuit:
        raise HTTPException(status_code=404, detail=f"Circuit '{circuit_id}' not found")

    meta = CIRCUIT_META.get(circuit_id, {"laps": 50, "turns": 15, "drs_zones": 2, "length": 5.0})
    return {
        "id": circuit_id,
        "name": circuit.get("name", ""),
        "location": circuit.get("location", ""),
        "country": circuit.get("country", ""),
        "lat": circuit.get("lat"),
        "lng": circuit.get("lng"),
        "length": meta["length"],
        "turns": meta["turns"],
        "laps": meta["laps"],
        "drsZones": meta["drs_zones"],
    }
