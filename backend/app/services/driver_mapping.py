# backend/app/services/driver_mapping.py
"""
Driver / Team ID Mapping Layer for 2026 Season

Translates between three ID systems:
  1. Backend IDs     - lowercase short codes: "ver", "red_bull"
  2. Schema names    - display names from schemas: "Red Bull Racing", "Racing Bulls"
  3. ML Encoder IDs  - what the trained LightGBM models expect

Two ML models with DIFFERENT encoders:
  - Baseline model (v2): trained on Supabase data, lowercase driver codes
                         Team column = driver_id (no real team data in DB)
  - Sector model: uppercase driver codes, full team names

2026 Driver Roster (Source of truth: frontend/src/data/f1-data.ts):
  McLaren:       NOR, PIA      | Red Bull:      VER, HAD
  Ferrari:       LEC, HAM      | Mercedes:      RUS, ANT
  Williams:      ALB, SAI      | Racing Bulls:  LAW, LIN
  Aston Martin:  ALO, STR      | Haas:          OCO, BEA
  Audi:          HUL, BOR      | Alpine:        GAS, COL
  Cadillac:      BOT, PER
"""


# =====================================================================
#  2026 DRIVER ROSTER (22 drivers)
# =====================================================================

# All 22 drivers on the 2026 grid, with their team (backend key)
ROSTER_2026 = [
    ("NOR", "mclaren"),
    ("PIA", "mclaren"),
    ("VER", "red_bull"),
    ("HAD", "red_bull"),
    ("LEC", "ferrari"),
    ("HAM", "ferrari"),
    ("RUS", "mercedes"),
    ("ANT", "mercedes"),
    ("ALB", "williams"),
    ("SAI", "williams"),
    ("LAW", "rb"),
    ("LIN", "rb"),
    ("ALO", "aston_martin"),
    ("STR", "aston_martin"),
    ("OCO", "haas"),
    ("BEA", "haas"),
    ("HUL", "audi"),
    ("BOR", "audi"),
    ("GAS", "alpine"),
    ("COL", "alpine"),
    ("BOT", "cadillac"),
    ("PER", "cadillac"),
]


# =====================================================================
#  SECTOR MODEL MAPPING (race_pace_v1.pkl)
#  - Uses uppercase driver codes ("VER", "NOR")
#  - Uses full team names ("Red Bull Racing", "McLaren")
# =====================================================================

# Drivers present in sector model training data (Supabase has 31 driver_ids)
# The sector model was trained on historical data with these driver codes.
_SECTOR_DRIVERS_IN_TRAINING = {
    "ver", "nor", "lec", "ham", "rus", "pia", "alb", "sai",
    "alo", "str", "gas", "oco", "hul", "per", "bot",
    "tsu", "ric", "mag", "vet", "zho", "lat", "sar",
    "msc", "dev", "doo", "law", "bea", "bor", "col",
    "had", "ant",
}

# Only LIN (Lindblad) is NOT in training data among 2026 drivers
_PROXY_SECTOR_DRIVERS = {
    "lin": "SAR",    # Lindblad (rookie) -> Sargeant (similar rookie profile)
}

# Historical team names in the sector model training data
# Maps all possible team ID formats to what the ML encoder expects
_TEAM_TO_ML_SECTOR = {
    # Backend IDs (from qualifying_service.py)
    "red_bull":       "Red Bull Racing",
    "mclaren":        "McLaren",
    "ferrari":        "Ferrari",
    "mercedes":       "Mercedes",
    "aston_martin":   "Aston Martin",
    "alpine":         "Alpine",
    "williams":       "Williams",
    "haas":           "Haas F1 Team",
    # New 2026 teams -> proxy to historical equivalents
    "rb":             "AlphaTauri",       # Racing Bulls was AlphaTauri
    "audi":           "Alfa Romeo",       # Audi took over Sauber/Alfa Romeo
    "cadillac":       "Williams",         # New team, use Williams as proxy
    # Schema display names (from qualifying.py / simulation.py defaults)
    "red bull racing": "Red Bull Racing",
    "racing bulls":    "AlphaTauri",
    "aston martin":    "Aston Martin",
    "haas f1 team":    "Haas F1 Team",
    "alfa romeo":      "Alfa Romeo",
    "alphatauri":      "AlphaTauri",
}


# =====================================================================
#  BASELINE MODEL MAPPING (baseline_pace_model.pkl)
#  - Uses lowercase driver codes ("ver", "nor")
#  - Team = driver_id (quirk: Supabase has no team column, v2 set Team=Driver)
# =====================================================================

_BASELINE_DRIVERS_IN_TRAINING = {
    "ver", "nor", "lec", "ham", "rus", "pia", "alb", "sai",
    "alo", "str", "gas", "oco", "hul", "per", "bot",
    "tsu", "ric", "mag", "vet", "zho", "lat", "sar",
    "msc", "dev", "doo", "law", "bea", "bor", "col",
    "had", "ant",
}

_PROXY_BASELINE_DRIVERS = {
    "lin": "sar",    # Lindblad -> Sargeant
}


# =====================================================================
#  FRONTEND <-> BACKEND TEAM ID CONVERSION
# =====================================================================

_FRONTEND_TO_BACKEND_TEAM = {
    "red-bull":       "red_bull",
    "racing-bulls":   "rb",
    "aston-martin":   "aston_martin",
    "mclaren":        "mclaren",
    "ferrari":        "ferrari",
    "mercedes":       "mercedes",
    "williams":       "williams",
    "alpine":         "alpine",
    "haas":           "haas",
    "audi":           "audi",
    "cadillac":       "cadillac",
}

_BACKEND_TO_FRONTEND_TEAM = {v: k for k, v in _FRONTEND_TO_BACKEND_TEAM.items()}


# =====================================================================
#  PUBLIC API
# =====================================================================

def to_ml_driver_sector(backend_id: str) -> str:
    """
    Convert backend driver ID -> sector model driver code (uppercase).
    Falls back to proxy for drivers not in training data.
    """
    bid = backend_id.lower()
    if bid in _SECTOR_DRIVERS_IN_TRAINING:
        return bid.upper()
    if bid in _PROXY_SECTOR_DRIVERS:
        return _PROXY_SECTOR_DRIVERS[bid]
    # Unknown driver - return uppercase as best effort
    return bid.upper()


def to_ml_team_sector(team_id: str) -> str:
    """
    Convert any team identifier -> sector model team name.
    Accepts backend IDs ("red_bull", "rb"), schema names ("Racing Bulls"),
    or display names ("Red Bull Racing").
    """
    tid = team_id.lower().strip()
    if tid in _TEAM_TO_ML_SECTOR:
        return _TEAM_TO_ML_SECTOR[tid]
    # Try with underscores replaced by spaces
    tid_spaces = tid.replace("_", " ")
    if tid_spaces in _TEAM_TO_ML_SECTOR:
        return _TEAM_TO_ML_SECTOR[tid_spaces]
    # Unknown team - title case as best effort
    return tid.replace("_", " ").title()


def to_ml_driver_baseline(backend_id: str) -> str:
    """
    Convert backend driver ID -> baseline model driver code (lowercase).
    Falls back to proxy for drivers not in training data.
    """
    bid = backend_id.lower()
    if bid in _BASELINE_DRIVERS_IN_TRAINING:
        return bid
    if bid in _PROXY_BASELINE_DRIVERS:
        return _PROXY_BASELINE_DRIVERS[bid]
    return bid


def to_ml_team_baseline(backend_team_id: str) -> str:
    """
    Baseline model's 'Team' encoder is mislabeled - it uses driver codes,
    not team names (because Supabase has no team column, v2 set Team=Driver).
    Just pass through lowercase.
    """
    return backend_team_id.lower()


def frontend_team_to_backend(frontend_team_id: str) -> str:
    """Convert frontend team ID (hyphens) to backend team ID (underscores)."""
    return _FRONTEND_TO_BACKEND_TEAM.get(frontend_team_id, frontend_team_id)


def backend_team_to_frontend(backend_team_id: str) -> str:
    """Convert backend team ID (underscores) to frontend team ID (hyphens)."""
    return _BACKEND_TO_FRONTEND_TEAM.get(backend_team_id, backend_team_id)
