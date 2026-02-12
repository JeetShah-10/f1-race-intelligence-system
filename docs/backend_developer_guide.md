# Backend Developer Guide: F1 Race Intelligence System

> **Last Updated**: 2026-02-11  
> **Stack**: Python 3.11+ · FastAPI · LightGBM · FastF1 · Supabase (PostgreSQL) · Pydantic  
> **Frontend Stack** (for context): React 18 · TypeScript · Zustand · Vite  
> **Supabase Project**: `jmllcxhzdusnhjxysilf` (Region: ap-south-1)

---

## Table of Contents

1. [Project Overview & Current State](#1-project-overview--current-state)
2. [Architecture Overview](#2-architecture-overview)
3. [⚠️ Immediate Blockers — Merge Conflicts](#3-️-immediate-blockers--merge-conflicts)
4. [Directory Structure](#4-directory-structure)
5. [Live Supabase Database Audit](#5-live-supabase-database-audit)
6. [Data Acquisition & FastF1 Integration](#6-data-acquisition--fastf1-integration)
7. [Machine Learning Pipeline](#7-machine-learning-pipeline)
8. [The Simulation Engine](#8-the-simulation-engine)
9. [Qualifying Service](#9-qualifying-service)
10. [Strategy Engine](#10-strategy-engine)
11. [API Specifications & Frontend Contracts](#11-api-specifications--frontend-contracts)
12. [2026 Season Configuration](#12-2026-season-configuration)
13. [Frontend Integration Map](#13-frontend-integration-map)
14. [Security & RLS Policies](#14-security--rls-policies)
15. [Testing Plan](#15-testing-plan)
16. [Phased Task Plan](#16-phased-task-plan)

---

## 1. Project Overview & Current State

The F1 Race Intelligence System is a full-stack application that simulates realistic F1 race weekends using ML-derived pace models trained on historical FastF1 data. The frontend is **fully built** with a rich simulation page (qualifying → grid → race playback) but is currently powered by **mock data only**. The backend developer's mission is to make the backend fully operational so the frontend can switch from mock data to real API calls.

### What Exists (Verified via Live Audit)

| Layer | Status | Evidence |
|-------|--------|----------|
| Frontend Simulation Page | ✅ Complete | 10 components, Zustand store, full state machine |
| Frontend Dashboard | ✅ Complete | Driver/Constructor standings, calendar, insights — all mock |
| Supabase DB — Schema | ✅ Deployed | 12 tables created with RLS |
| Supabase DB — `drivers` table | ⚠️ Partial | 25 rows (has 3 duplicates, needs cleanup) |
| Supabase DB — `standings` table | ⚠️ Seeded | 22 rows, all 2026 drivers, 0 points |
| Supabase DB — All other tables | ❌ Empty | 0 rows in: circuits, teams, seasons, races, race_results, lap_times, telemetry, simulation_results, driver_results, lap_data |
| Backend FastAPI App | ⚠️ Broken | **2 files have git merge conflicts** |
| Race Engine | ⚠️ Functional | Core loop works, needs ML integration |
| ML Models | ⚠️ Scaffolded | PaceModel class exists, `.pkl` files may not |
| FastF1 Data Ingestion | ❌ Not started | No ETL pipeline, no training data |
| Git Branches | ℹ️ 3 branches | `main`, `frontend-core` (current), `backend-core` (remote) |

### What Needs to Happen (Priority Order)

1. **Resolve merge conflicts** in `simulate.py` and `prediction_service.py`
2. **Clean up** duplicate drivers in Supabase
3. **Populate empty tables**: circuits, teams, seasons, races (reference data)
4. **Build FastF1 ETL pipeline** to ingest 2022–2025 race data
5. **Train ML models** (pace + degradation) on ingested data
6. **Wire the Race Engine** to consume real ML predictions
7. **Build Qualifying API** matching frontend's expected contracts
8. **Build Dashboard APIs** for standings, calendar, insights
9. **Persist simulation results** to Supabase
10. **Fix security warnings** (RLS, vector extension)

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React/TypeScript)              │
│  SimulatePage.tsx → useSimulationStore (Zustand)             │
│  DashboardGrid  → useDashboardStore (Zustand)               │
│  Currently: 100% mock data                                   │
│  Target: API calls to backend                                │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP (REST) / WebSocket
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI)                         │
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │ API Layer   │  │ Services     │  │ ML Layer          │   │
│  │ /api/*      │→ │ Prediction   │→ │ PaceModel (LGBM)  │   │
│  │             │  │ Qualifying   │  │ DegradationModel  │   │
│  │             │  │ Strategy     │  │                   │   │
│  │             │  │ SeasonConfig │  │                   │   │
│  └─────────────┘  └──────┬───────┘  └───────────────────┘   │
│                          │                                    │
│               ┌──────────▼──────────┐                        │
│               │ Simulation Engine   │                        │
│               │ RaceEngine class    │                        │
│               │ EventManager        │                        │
│               └──────────┬──────────┘                        │
│                          │                                    │
│               ┌──────────▼──────────┐                        │
│               │ Supabase Client     │                        │
│               │ (supabase-py)       │                        │
│               └─────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. ⚠️ Immediate Blockers — Merge Conflicts

**Two files have unresolved git merge conflicts. These MUST be resolved before any other work.**

### File 1: `backend/app/api/simulate.py` (conflict at line 1)

The entire file is wrapped in a merge conflict. Two versions exist:
- **HEAD version**: Uses `BackgroundTasks`, async DB saving, improved error handling, maps engine output to `SimulationResult` schema
- **5875195 version**: Simpler sync version

**Resolution**: Keep the HEAD version (async + background tasks). It is the production-ready version.

### File 2: `backend/app/services/prediction_service.py` (conflict at line 57)

The conflict is in `get_simulation_handoff()` around the `predict_baseline_pace` call:
- **HEAD version**: Passes `track_temp`, `air_temp`, `session_type`
- **5875195 version**: Passes `lap_number=1`

**Resolution**: Merge both — keep all parameters:

```python
baseline_lap_time = self.pace_model.predict_baseline_pace(
    driver=driver.driver,
    compound=driver.compound,
    tyre_life=driver.tyre_life,
    team=driver.team,
    speed_st=request.speed_st or 0,
    speed_fl=request.speed_fl or 0,
    lap_number=1,
    track_temp=request.track_temp,
    air_temp=request.air_temp,
    session_type=request.session_type
)
```

---

## 4. Directory Structure

```
backend/
├── app/
│   ├── api/                    # FastAPI route handlers
│   │   ├── simulate.py         # POST /api/simulate/ ⚠️ MERGE CONFLICT
│   │   ├── predict.py          # POST /api/predict/
│   │   ├── strategy.py         # POST /api/strategy/
│   │   ├── sessions.py         # GET  /api/sessions/
│   │   ├── standings.py        # GET  /api/standings/
│   │   ├── drivers.py          # GET  /api/drivers/
│   │   ├── circuits.py         # GET  /api/circuits/
│   │   ├── telemetry.py        # GET  /api/telemetry/
│   │   └── websockets.py       # WS   /ws/simulation/
│   │
│   ├── config/
│   │   └── 2026_season.json    # 11 teams, 22 drivers (complete 2026 grid)
│   │
│   ├── ml/
│   │   └── pace_model.py       # PaceModel: LightGBM + linear degradation
│   │
│   ├── models/                 # Serialized .pkl model files
│   │
│   ├── schemas/
│   │   ├── simulation.py       # SimulationRequest, SimulationResult, LapData
│   │   └── ml_simulation_handoff.py  # MLHandoff contract
│   │
│   ├── services/
│   │   ├── prediction_service.py    # ⚠️ MERGE CONFLICT
│   │   ├── qualifying_service.py    # Tier-based grid prediction
│   │   ├── strategy_service.py      # Tyre strategy & undercut
│   │   └── season_config_service.py # 2026_season.json loader
│   │
│   ├── simulation/
│   │   └── race_engine.py      # RaceEngine, EventManager, LapSnapshot
│   │
│   └── main.py                 # FastAPI entry point
│
├── db/
│   ├── schema.sql              # simulation_results, driver_results, lap_data
│   └── historical_schema.sql   # seasons, circuits, drivers, teams, races
│
├── requirements.txt            # fastapi, uvicorn, scikit-learn, pandas, etc.
└── scripts/
    └── test_import.py
```

**Missing from requirements.txt** (needs adding):
```
fastf1
supabase
python-dotenv
pydantic
httpx
websockets
```

---

## 5. Live Supabase Database Audit

### Connection Details

| Property | Value |
|----------|-------|
| **Project ID** | `jmllcxhzdusnhjxysilf` |
| **API URL** | `https://jmllcxhzdusnhjxysilf.supabase.co` |
| **Region** | ap-south-1 (Mumbai) |
| **Status** | ACTIVE_HEALTHY |
| **Postgres** | v17.6 |

### Table Inventory (12 tables)

| Table | Rows | RLS | Status |
|-------|------|-----|--------|
| `drivers` | **25** | ✅ Read-only | ⚠️ Has 3 duplicate entries |
| `standings` | **22** | ✅ Read-only | ✅ All 2026 drivers, 0 points |
| `circuits` | **0** | ✅ Read-only | ❌ Needs seeding |
| `teams` | **0** | ✅ Read-only | ❌ Needs seeding |
| `seasons` | **0** | ✅ Read-only | ❌ Needs seeding |
| `races` | **0** | ✅ Read-only | ❌ Needs seeding |
| `race_results` | **0** | ✅ Read-only | ❌ Empty |
| `lap_times` | **0** | ✅ Read-only | ❌ Empty |
| `telemetry` | **0** | ✅ Read-only | ❌ Empty |
| `simulation_results` | **0** | ✅ Read + Auth Insert | ❌ Empty |
| `driver_results` | **0** | ✅ Read + Auth Insert | ❌ Empty |
| `lap_data` | **0** | ✅ Read + Auth Insert | ❌ Empty |

### 🐛 `drivers` Table — Duplicate Entries

The `drivers` table has 25 rows but should have 22. These duplicates need cleanup:

| Duplicate 1 | Duplicate 2 | Keep |
|-------------|-------------|------|
| `alex_albon` (forename: "Alex") | `alexander_albon` (forename: "Alexander") | `alex_albon` |
| `andrea_kimi_antonelli` (forename: "Andrea Kimi") | `kimi_antonelli` (forename: "Kimi") | `andrea_kimi_antonelli` |
| `yuki_tsunoda` | — (Not on 2026 grid) | DELETE |

**Note**: The `standings` table has a FK `driver_id → drivers.driver_id`. The standings correctly reference the proper driver_ids, so these orphan driver records can be safely deleted.

### `standings` Table — Confirmed 2026 Grid (22 Drivers)

The confirmed 2026 F1 grid (source: [formula1.com](https://www.formula1.com/en/latest/article/who-are-the-2026-formula-1-drivers.3mVj9UTWK7Puz2QuScnzuz)):

| Driver | Team | Notes |
|--------|------|-------|
| Lando Norris (#1) | McLaren | 2025 World Champion |
| Oscar Piastri (#81) | McLaren | — |
| Max Verstappen (#3) | Red Bull Racing | 4x WDC |
| Isack Hadjar (#6) | Red Bull Racing | Promoted from Racing Bulls |
| Charles Leclerc (#16) | Ferrari | — |
| Lewis Hamilton (#44) | Ferrari | 105 wins, 7x WDC |
| George Russell (#63) | Mercedes | — |
| Andrea Kimi Antonelli (#12) | Mercedes | Sophomore season |
| Alex Albon (#23) | Williams | — |
| Carlos Sainz (#55) | Williams | — |
| Liam Lawson (#30) | Racing Bulls | Demoted from Red Bull after 2 races in 2025 |
| Arvid Lindblad (#—) | Racing Bulls | ROOKIE — only new face on 2026 grid |
| Fernando Alonso (#14) | Aston Martin | 23rd F1 season |
| Lance Stroll (#18) | Aston Martin | 10th F1 season |
| Esteban Ocon (#31) | Haas | — |
| Oliver Bearman (#87) | Haas | Sophomore season |
| Nico Hulkenberg (#27) | Audi | First podium at Silverstone 2025 |
| Gabriel Bortoleto (#5) | Audi | Sophomore season |
| Pierre Gasly (#10) | Alpine | — |
| Franco Colapinto (#43) | Alpine | Replaced Jack Doohan from Round 7 of 2025 |
| Valtteri Bottas (#77) | Cadillac | Returns from Mercedes reserve role |
| Sergio Perez (#11) | Cadillac | Returns after leaving Red Bull end of 2024 |

**⚠️ Supabase `standings` table needs cleanup**: The DB still has `yuki_tsunoda` and `jack_doohan`. These must be replaced with `arvid_lindblad` and `franco_colapinto`. Tsunoda moved to Red Bull test/reserve driver. Doohan was replaced by Colapinto at Alpine during the 2025 season. Also, `isack_hadjar` should be moved from `RB` to `red_bull`, and `liam_lawson` from `red_bull` to `rb` (Racing Bulls).

### Tables That Need Seeding

```sql
-- CIRCUITS (24 for 2026 season — Imola dropped, Madrid added)
INSERT INTO public.circuits (circuit_id, name, location, country) VALUES
('albert_park', 'Albert Park Circuit', 'Melbourne', 'Australia'),
('shanghai', 'Shanghai International Circuit', 'Shanghai', 'China'),
('suzuka', 'Suzuka International Racing Course', 'Suzuka', 'Japan'),
('sakhir', 'Bahrain International Circuit', 'Sakhir', 'Bahrain'),
('jeddah', 'Jeddah Corniche Circuit', 'Jeddah', 'Saudi Arabia'),
('miami', 'Miami International Autodrome', 'Miami', 'United States'),
('montreal', 'Circuit Gilles Villeneuve', 'Montreal', 'Canada'),
('monaco', 'Circuit de Monaco', 'Monte Carlo', 'Monaco'),
('catalunya', 'Circuit de Barcelona-Catalunya', 'Barcelona', 'Spain'),
('red_bull_ring', 'Red Bull Ring', 'Spielberg', 'Austria'),
('silverstone', 'Silverstone Circuit', 'Silverstone', 'United Kingdom'),
('spa', 'Circuit de Spa-Francorchamps', 'Stavelot', 'Belgium'),
('hungaroring', 'Hungaroring', 'Budapest', 'Hungary'),
('zandvoort', 'Circuit Zandvoort', 'Zandvoort', 'Netherlands'),
('monza', 'Autodromo Nazionale Monza', 'Monza', 'Italy'),
('ifema_madrid', 'IFEMA Madrid Circuit', 'Madrid', 'Spain'),
('baku', 'Baku City Circuit', 'Baku', 'Azerbaijan'),
('marina_bay', 'Marina Bay Street Circuit', 'Singapore', 'Singapore'),
('cota', 'Circuit of The Americas', 'Austin', 'United States'),
('mexico_city', 'Autodromo Hermanos Rodriguez', 'Mexico City', 'Mexico'),
('interlagos', 'Autodromo Jose Carlos Pace', 'Sao Paulo', 'Brazil'),
('las_vegas', 'Las Vegas Strip Circuit', 'Las Vegas', 'United States'),
('lusail', 'Lusail International Circuit', 'Lusail', 'Qatar'),
('yas_marina', 'Yas Marina Circuit', 'Abu Dhabi', 'United Arab Emirates');

-- TEAMS (11 for 2026 — Audi replaces Kick Sauber, Cadillac joins as 11th team)
INSERT INTO public.teams (team_id, name, nationality) VALUES
('mclaren', 'McLaren F1 Team', 'British'),
('red_bull', 'Oracle Red Bull Racing', 'Austrian'),
('ferrari', 'Scuderia Ferrari HP', 'Italian'),
('mercedes', 'Mercedes-AMG PETRONAS F1 Team', 'German'),
('aston_martin', 'Aston Martin Aramco F1 Team', 'British'),
('alpine', 'BWT Alpine F1 Team', 'French'),
('williams', 'Williams Racing', 'British'),
('rb', 'Visa Cash App Racing Bulls', 'Italian'),
('audi', 'Audi F1 Team', 'Swiss-German'),
('haas', 'MoneyGram Haas F1 Team', 'American'),
('cadillac', 'Cadillac F1 Team', 'American');

-- SEASONS
INSERT INTO public.seasons (year) VALUES (2022), (2023), (2024), (2025), (2026);
```

### Tables That Will Be Populated by ETL

| Table | Source | Volume (est.) |
|-------|--------|---------------|
| `races` | FastF1 schedule API | ~100 rows (4 seasons × 24 races) |
| `race_results` | FastF1 session results | ~2,000 rows |
| `lap_times` | FastF1 lap data | ~72,000 rows |
| `telemetry` | FastF1 telemetry (optional) | ~millions (defer this) |

### Tables That Will Be Populated by Simulation

| Table | Source | Notes |
|-------|--------|-------|
| `simulation_results` | POST /api/simulate/ | One row per simulation run |
| `driver_results` | POST /api/simulate/ | 22 rows per simulation |
| `lap_data` | POST /api/simulate/ | ~1,300 rows per simulation (22 × ~60 laps) |

---

## 6. Data Acquisition & FastF1 Integration

### Why FastF1?

FastF1 provides free access to official FIA timing data. We need this to train ML models on **real** F1 lap times, tyre degradation curves, and sector times.

### ETL Pipeline (TO BUILD)

```python
# scripts/ingest_fastf1.py

import fastf1
import pandas as pd
from supabase import create_client
import os

fastf1.Cache.enable_cache('./cache')

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

SEASONS = [2022, 2023, 2024, 2025]

def ingest_season(year: int):
    schedule = fastf1.get_event_schedule(year)
    
    for _, event in schedule.iterrows():
        round_num = event['RoundNumber']
        if round_num == 0:  # Skip pre-season
            continue
            
        try:
            session = fastf1.get_session(year, round_num, 'R')
            session.load(laps=True, telemetry=False, weather=True)
            
            # Insert race record
            circuit_id = event['EventName'].lower().replace(' ', '_')
            race_id = f"{year}_{round_num}_{circuit_id}"
            
            supabase.table("races").upsert({
                "race_id": race_id,
                "year": year,
                "round": round_num,
                "circuit_id": circuit_id,
                "name": event['EventName'],
                "date": str(event['EventDate']),
            }).execute()
            
            # Process laps
            laps = session.laps
            clean_laps = laps[
                (laps['LapTime'].notna()) &
                (laps['LapTime'].dt.total_seconds() > 60) &
                (laps['LapTime'].dt.total_seconds() < 180)
            ].copy()
            
            for _, lap in clean_laps.iterrows():
                supabase.table("lap_times").upsert({
                    "race_id": race_id,
                    "driver_id": lap['Driver'].lower(),
                    "lap_number": int(lap['LapNumber']),
                    "lap_time_millis": int(lap['LapTime'].total_seconds() * 1000),
                    "sector_1_millis": int(lap['Sector1Time'].total_seconds() * 1000) if pd.notna(lap['Sector1Time']) else None,
                    "sector_2_millis": int(lap['Sector2Time'].total_seconds() * 1000) if pd.notna(lap['Sector2Time']) else None,
                    "sector_3_millis": int(lap['Sector3Time'].total_seconds() * 1000) if pd.notna(lap['Sector3Time']) else None,
                    "compound": lap.get('Compound', 'UNKNOWN'),
                    "tyre_life": int(lap.get('TyreLife', 0)),
                }).execute()
            
            print(f"✅ {year} R{round_num}: {len(clean_laps)} laps ingested")
            
        except Exception as e:
            print(f"❌ {year} R{round_num}: {e}")
            continue

if __name__ == "__main__":
    for year in SEASONS:
        print(f"\n=== Ingesting {year} ===")
        ingest_season(year)
```

### New Table Needed: `fastf1_training_data`

The existing `lap_times` table stores milliseconds but the ML pipeline needs float seconds with additional features. We need a dedicated training data table:

```sql
CREATE TABLE IF NOT EXISTS public.fastf1_training_data (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    year INTEGER NOT NULL,
    round INTEGER NOT NULL,
    circuit_id TEXT NOT NULL,
    driver TEXT NOT NULL,           -- 3-letter code (VER, NOR)
    team TEXT NOT NULL,
    lap_number INTEGER NOT NULL,
    lap_time_seconds FLOAT NOT NULL,
    compound TEXT NOT NULL,
    tyre_life INTEGER NOT NULL,
    fresh_tyre BOOLEAN DEFAULT TRUE,
    speed_st FLOAT,
    speed_fl FLOAT,
    sector1_time FLOAT,
    sector2_time FLOAT,
    sector3_time FLOAT,
    fuel_adjusted BOOLEAN DEFAULT FALSE,
    
    UNIQUE(year, round, driver, lap_number)
);

ALTER TABLE public.fastf1_training_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Training data read only" ON public.fastf1_training_data FOR SELECT USING (true);
```

---

## 7. Machine Learning Pipeline

### 7.1 Two-Model Ensemble

| Model | Algorithm | Purpose | Target |
|-------|-----------|---------|--------|
| **Pace Model** | LightGBM Regressor | Predict baseline lap time | `lap_time_seconds` |
| **Degradation Model** | Linear Regression | Predict tyre wear slope | `seconds_lost_per_lap` |

### 7.2 Existing PaceModel Class

**File**: `backend/app/ml/pace_model.py`

```python
# Features used by the model
self.features = ['Compound', 'TyreLife', 'Driver', 'Team', 'SpeedST', 'SpeedFL', 'LapNumber']

# Categorical features are Label Encoded
self.label_encoders = {}  # For Compound, Driver, Team

# Training
model.train_baseline_model(df)   # → saves pace_model_lgbm.pkl
model.fit_degradation_model(df)  # → saves degradation_models.pkl

# Prediction
baseline = model.predict_baseline_pace(
    driver="VER", compound="SOFT", tyre_life=0,
    team="red_bull", speed_st=320.5, speed_fl=245.0, lap_number=1
)  # Returns: ~91.5 seconds

slope = model.get_degradation_slope(driver="VER", compound="SOFT")
# Returns: 0.08 s/lap
```

### 7.3 The Archetype System (Critical for 2026)

Since 2026 has new drivers and teams with no historical data, the `2026_season.json` defines **archetypes** — existing drivers/teams whose data serves as proxy:

```json
{ "id": "had", "archetype": "perez" }        // Hadjar → use Perez's data
{ "id": "cadillac", "archetype": "alpine" }   // Cadillac → use Alpine's data
```

**When predicting for a 2026 entity:**
1. Look up `archetype` from `SeasonConfigService`
2. Use archetype's historical data for baseline prediction  
3. Apply `performance_modifiers` on top (e.g., `raw_pace: +0.1s`)

### 7.4 Training Script (TO BUILD)

```python
# scripts/train_models.py
from app.ml.pace_model import PaceModel

def train():
    df = load_from_supabase("fastf1_training_data")  # or lap_times
    
    # Clean
    df = df[df['lap_time_seconds'].between(60, 150)]
    
    model = PaceModel()
    model.train_baseline_model(df)
    model.fit_degradation_model(df)
    
    print(f"✅ Trained on {len(df)} laps")

if __name__ == "__main__":
    train()
```

---

## 8. The Simulation Engine

**File**: `backend/app/simulation/race_engine.py` (339 lines)

### Core Loop

```
For each lap (1 → total_laps):
    1. Process events (SC, VSC, RED FLAG)
    2. For each running driver:
       lap_time = base_pace + (degradation × tyre_age) + fuel_penalty + noise
       Check for crash/DNF
       Update driver state
    3. Sort by total_time → update positions
    4. Record LapSnapshot
```

### Key Data Structures

**MLHandoff** — Contract between ML and Engine:
```python
class MLHandoff(BaseModel):
    driver_id: str
    baseline_lap_time: float      # e.g., 91.5s
    tyre_degradation_slope: float # e.g., 0.08 s/lap
    pace_variance: float          # 0.2s std dev
    mistake_probability: float    # 1%
    dnf_probability: float        # 0.1%
```

**Lap Time Formula:**
```
lap_time = baseline_pace
         + (degradation_slope × tyre_age)  
         + (fuel_penalty × remaining_fuel_ratio)
         + random_noise(std=pace_variance)
         + SC_OVERRIDE (if active)
```

---

## 9. Qualifying Service

**File**: `backend/app/services/qualifying_service.py`

### Current: Tier-based (no ML)
Uses hardcoded team tiers + random variance. Not connected to ML models.

### Target: ML-powered
Should use `PaceModel` with archetype resolution to predict qualifying times.

### Frontend Expected Response Shape

```typescript
interface QualifyingResult {
    position: number;
    driverId: string;
    driverName: string;
    team: string;
    teamColor: string;
    q1Time: number | null;
    q2Time: number | null;
    q3Time: number | null;
    eliminated: 'Q1' | 'Q2' | null;
    gap: string;  // "+0.XXXs" or "LEADER"
}
```

---

## 10. Strategy Engine

**File**: `backend/app/services/strategy_service.py`

| Method | Purpose |
|--------|---------|
| `calculate_tyre_life()` | Expected laps for compound + temp |
| `predict_tyre_pace()` | Wear penalty + cliff model |
| `analyze_undercut()` | Undercut viability assessment |

```python
# Tyre life at 30°C
soft: 15 laps | medium: 25 laps | hard: 40 laps
```

---

## 11. API Specifications & Frontend Contracts

### 11.1 Simulation Endpoint (EXISTS — needs merge conflict fix)

```
POST /api/simulate/
```

**Request** (`SimulationRequest`):
```json
{
    "circuit_id": "monaco",
    "year": 2026,
    "session_type": "R",
    "lap_count": 78,
    "track_temp": 35.0,
    "air_temp": 28.0,
    "drivers": [
        {
            "driver": "VER",
            "team": "red_bull",
            "grid_position": 1,
            "compound": "SOFT",
            "tyre_life": 0,
            "avg_lap_time": null,
            "std_lap_time": null,
            "num_laps": 78,
            "finished": 1
        }
    ],
    "events": [{ "type": "SC", "start_lap": 15, "duration": 3 }]
}
```

**Response** (`SimulationResult`):
```json
{
    "circuit_id": "monaco",
    "status": "completed",
    "total_laps": 78,
    "results": [{
        "driver_id": "VER",
        "team": "red_bull",
        "final_position": 1,
        "total_time": 6432.5,
        "gap_to_leader": 0.0,
        "status": "Finished",
        "lap_data": [{
            "lap_number": 1,
            "lap_time": 82.3,
            "position": 1,
            "gap_to_front": 0.0,
            "tyre_life": 1,
            "compound": "SOFT"
        }]
    }]
}
```

### 11.2 Qualifying Endpoint (TO BUILD)

```
POST /api/qualifying/
```

### 11.3 Dashboard Endpoints (TO BUILD)

| Endpoint | Store Property | Mock → API |
|----------|---------------|------------|
| `GET /api/standings/drivers` | `standings` | Replace `mockDrivers` |
| `GET /api/standings/constructors` | `constructors` | Replace `mockConstructors` |
| `GET /api/calendar/2026` | `calendar` | Replace `mockCalendar` |
| `GET /api/circuits/{id}` | Circuit details | Replace mock circuit data |
| `GET /api/insights/{circuit}` | `insights` | Replace `mockInsights` |
| `GET /api/momentum/drivers` | `momentum` | Replace `mockMomentum` |

---

## 12. 2026 Season Configuration

**File**: `backend/app/config/2026_season.json`

### Teams (11 total)

| Team | ID | Archetype | Lap Time Bias | Reliability |
|------|----|-----------|---------------|-------------|
| McLaren | mclaren | mclaren | -0.25s (fastest) | 95% |
| Mercedes | mercedes | mercedes | -0.15s | 92% |
| Red Bull Racing | red_bull | red_bull | -0.05s | 90% |
| Ferrari | ferrari | ferrari | +0.05s | 88% |
| Williams | williams | williams | +0.05s | 90% |
| Aston Martin | aston_martin | aston_martin | +0.10s | 85% |
| Racing Bulls | rb | rb | +0.15s | 88% |
| Haas | haas | haas | +0.20s | 85% |
| Audi | audi | audi | +0.30s | 82% |
| Alpine | alpine | alpine | +0.35s | 80% |
| Cadillac | cadillac | cadillac | +0.40s (slowest) | 80% |

### ✅ Complete 2026 Driver Lineup (22 drivers)

All 22 drivers are now in `2026_season.json`. Verified against [formula1.com official 2026 driver list](https://www.formula1.com/en/latest/article/who-are-the-2026-formula-1-drivers.3mVj9UTWK7Puz2QuScnzuz):

| Driver | Code | Team | Archetype | Notes |
|--------|------|------|-----------|-------|
| Lando Norris | NOR | mclaren | norris | 2025 WDC |
| Oscar Piastri | PIA | mclaren | piastri | — |
| Max Verstappen | VER | red_bull | verstappen | 4x WDC |
| Isack Hadjar | HAD | red_bull | hadjar | Promoted from Racing Bulls |
| Charles Leclerc | LEC | ferrari | leclerc | — |
| Lewis Hamilton | HAM | ferrari | hamilton | 7x WDC |
| George Russell | RUS | mercedes | russell | — |
| Kimi Antonelli | ANT | mercedes | piastri | Sophomore |
| Alex Albon | ALB | williams | albon | — |
| Carlos Sainz | SAI | williams | sainz | — |
| Liam Lawson | LAW | rb | lawson | Demoted from Red Bull |
| Arvid Lindblad | LIN | rb | lindblad | ROOKIE |
| Fernando Alonso | ALO | aston_martin | alonso | 23rd season |
| Lance Stroll | STR | aston_martin | stroll | — |
| Esteban Ocon | OCO | haas | ocon | — |
| Oliver Bearman | BEA | haas | bearman | Sophomore |
| Nico Hulkenberg | HUL | audi | hulkenberg | — |
| Gabriel Bortoleto | BOR | audi | bortoleto | Sophomore |
| Pierre Gasly | GAS | alpine | gasly | — |
| Franco Colapinto | COL | alpine | colapinto | Replaced Doohan in 2025 |
| Valtteri Bottas | BOT | cadillac | bottas | Returns from reserve |
| Sergio Perez | PER | cadillac | perez | Returns from hiatus |

> **NOT on 2026 grid**: Yuki Tsunoda (Red Bull test/reserve), Jack Doohan (replaced by Colapinto mid-2025), Alex Palou (IndyCar)

---

## 13. Frontend Integration Map (Updated Feb 2026)

### Architecture Overview

The frontend has a **3-layer data architecture**:

```
+---------------------------------------------------------------------+
|  LAYER 1: Static Reference Data (PERMANENT)                         |
|  File: frontend/src/data/f1-data.ts                                 |
|  Content: 22 drivers, 11 teams, 24 circuits                        |
|  Purpose: Image paths, colors, metadata, team IDs                   |
|  Backend MUST use the same entity IDs as this file                  |
|  (e.g., 'max-verstappen', 'red-bull', 'monza')                    |
+---------------------------------------------------------------------+
         ^ Components combine image paths from here...
         |
+---------------------------------------------------------------------+
|  LAYER 2: Runtime Data (CURRENTLY MOCKS -> REPLACE WITH API)        |
|  Sources: mocks/*.ts + Zustand stores (hardcoded defaults)          |
|  Content: Standings, points, lap times, telemetry, predictions      |
|  Purpose: Dynamic data that changes race-by-race                    |
|  This is what YOUR API endpoints will replace                       |
+---------------------------------------------------------------------+
         ^ ...with dynamic data from here
         |
+---------------------------------------------------------------------+
|  LAYER 3: Zustand Stores (PERMANENT - become API consumers)         |
|  Files: frontend/src/store/*.ts                                     |
|  Purpose: State management - call API, cache results, update UI     |
|  Currently initialized with hardcoded defaults                      |
|  Add fetch() calls inside store actions to hit your endpoints       |
+---------------------------------------------------------------------+
```

### Critical: Entity ID Alignment

Your backend database MUST use these IDs to match `f1-data.ts`:

| Entity | Backend ID | Frontend ID (f1-data.ts) | Used For |
|--------|-----------|------------------------|----------|
| Verstappen | `max_verstappen` (DB) | `max-verstappen` (frontend) | Cross-referencing |
| Red Bull | `red_bull` (DB) | `red-bull` (frontend) | Team lookup |
| Monza | `monza` (DB) | `monza` (frontend) | Circuit lookup |

> **Convention**: Backend uses `snake_case`, frontend uses `kebab-case`. The frontend stores will normalize this. Just ensure the base words match (e.g., `red_bull` <-> `red-bull`).

### Store -> API Endpoint Mapping

| Zustand Store | Default Data Source | Backend Endpoint | What It Returns |
|--------------|-------------------|-----------------|-----------------|
| `useDriverStore` | 8 hardcoded drivers | `GET /api/standings/drivers` | 22 drivers: points, positions, gaps |
| `useDriverStore` | 6 hardcoded momentum | `GET /api/momentum/drivers` | All drivers: form, pace, trend |
| `useCircuitStore` | 3 hardcoded circuits | `GET /api/circuits/` | All 24 circuits with metadata |
| `useCircuitStore` | 1 hardcoded next race | `GET /api/calendar/next` | Next race details + countdown |
| `useCircuitStore` | 6 hardcoded insights | `GET /api/insights/{circuit}` | Model predictions per circuit |
| `useDashboardStore` | 22 inline drivers | `GET /api/standings/drivers` | Championship standings |
| `useDashboardStore` | 11 inline constructors | `GET /api/standings/constructors` | Constructor standings |
| `useDashboardStore` | 24-race calendar | `GET /api/calendar/2026` | Full season calendar |
| `useSimulationStore` | `simulationMockData.ts` | `POST /api/qualifying/` | Qualifying results (22 drivers) |
| `useSimulationStore` | `simulationMockData.ts` | `POST /api/simulate/` | Full race simulation data |
| `useRaceStore` | Empty (ready) | WebSocket `/ws/simulation/` | Real-time race telemetry |

### Mock Files -> API Replacement Map

| Mock File | Lines | What It Contains | Backend Replaces With |
|-----------|-------|-----------------|----------------------|
| `mocks/drivers.ts` | 297 | 22 drivers (code, team, color) | `GET /api/drivers/` |
| `mocks/circuits.ts` | 452 | 16 circuits (detailed metadata) | `GET /api/circuits/` |
| `mocks/standings.ts` | 378 | Sample championship standings | `GET /api/standings/drivers` + `/constructors` |
| `mocks/factory.ts` | 404 | Random telemetry generator | FastF1 real data via API |
| `data/simulationMockData.ts` | ~600 | Qualifying + race mock data | `POST /api/qualifying/` + `/api/simulate/` |

### `f1-data.ts` - What It Provides (PERMANENT)

This file is **NOT replaced by the backend**. Components use it for:

```typescript
import { getDriverByCode, getTeamById, MISC_ASSETS } from '../data/f1-data';

// Get driver portrait image
const driver = getDriverByCode('VER');
// -> driver.images.portrait = '/assets/drivers/max-verstappen.webp'

// Get team logo
const team = getTeamById('red-bull');
// -> team.logoUrl = '/assets/logos/redbull-logo.webp'
// -> team.car2026Url = '/assets/cars/redbull-26.webp'
```

**Exports**: `DRIVERS_2026`, `TEAMS_2026`, `CIRCUITS_2026`, `TEXTURES`, `MISC_ASSETS` + 12 helper functions.

### Simulation Flow (Backend Must Support)

```
1. User selects Circuit -> GET /api/circuits/{id} (lap count, etc.)
2. Weekend Intro -> No API call (uses f1-data.ts circuit images)
3. Qualifying -> POST /api/qualifying/ -> returns QualifyingResult[]
4. Grid Formation -> Frontend derives from qualifying
5. Race Simulation -> POST /api/simulate/ -> returns SimulationResult
6. Race Playback -> Frontend animates pre-computed data
   OR stream via WS /ws/simulation/
7. Race Results -> Shows final standings from response
```

### How to Wire an Endpoint (Example)

When your `GET /api/standings/drivers` is ready, update `useDriverStore.ts`:

```typescript
// In useDriverStore.ts - add a fetchStandings action:
fetchStandings: async () => {
    set({ isLoading: true });
    const res = await fetch('/api/standings/drivers');
    const data = await res.json();
    set({ standings: data, isLoading: false });
},
```

The component then combines API data with `f1-data.ts` images:

```typescript
// In a component:
const standings = useDriverStore((s) => s.standings);
const enriched = standings.map(d => ({
    ...d,
    image: getDriverByCode(d.code)?.images.cutout,
    teamLogo: getTeamLogo(getDriverByCode(d.code)?.teamId || ''),
}));
```

### Data Flow After FastF1 Integration

```
FastF1 API -> ETL Pipeline -> Supabase DB -> FastAPI -> Zustand Stores -> UI
                                                            ^
                                           f1-data.ts images/colors merge here
```

**FastF1 provides**: Lap times, sector times, telemetry (speed/throttle/brake), tyre data, weather, race results, qualifying times - all HISTORICAL and REAL.

**ML models add**: Predictions, win probabilities, strategy recommendations, momentum scores - computed FROM FastF1 data.

**f1-data.ts provides**: Images, colors, logos, static metadata - this NEVER comes from the API.


## 14. Security & RLS Policies

### Current RLS Policy Audit

| Table | SELECT | INSERT | Issues |
|-------|--------|--------|--------|
| `circuits` | ✅ Public | ❌ None | Read-only ✅ |
| `drivers` | ✅ Public | ❌ None | Read-only ✅ |
| `teams` | ✅ Public | ❌ None | Read-only ✅ |
| `standings` | ✅ Public | ❌ None | Read-only ✅ |
| `simulation_results` | ✅ Public | ⚠️ Authenticated=true | **Overly permissive** |
| `driver_results` | ✅ Public | ⚠️ Authenticated=true | **Overly permissive** |
| `lap_data` | ✅ Public | ⚠️ Authenticated=true | **Overly permissive** |

### Security Warnings (from Supabase Advisor)

1. **vector extension in public schema** — Move to separate schema
2. **3 overly permissive INSERT policies** — Simulation tables allow any authenticated user to INSERT
3. **Leaked password protection disabled** — Enable in Auth settings

### Recommendation

For the backend service to INSERT simulation results, use the **service_role key** (bypasses RLS) instead of allowing authenticated INSERT. Then tighten the INSERT policies to `false` or `auth.role() = 'service_role'`.

---

## 15. Testing Plan

### Unit Tests
```python
# Race Engine
test_determinism()           # Same seed → identical results
test_all_drivers_finish()    # 0% DNF → 22 finishers
test_safety_car()            # SC clamps lap times
test_unique_positions()      # No shared positions

# ML Models  
test_model_loads()           # .pkl files load
test_prediction_range()      # Lap times between 60-150s
test_degradation_positive()  # Slope >= 0

# Qualifying
test_22_drivers()            # All drivers in results
test_q1_elimination()        # Bottom 5 eliminated in Q1
```

### Integration Tests
```python
test_simulate_endpoint()     # POST returns 200 + valid schema
test_qualifying_endpoint()   # Returns 22 drivers with times
test_supabase_save()         # Results persist to DB
```

---

## 16. Phased Task Plan

### Phase 0: Fix Blockers (Day 1)
- [ ] Resolve merge conflicts in `simulate.py` and `prediction_service.py`
- [ ] Clean stale/duplicate drivers in Supabase:
  - `DELETE FROM drivers WHERE driver_id IN ('alexander_albon', 'kimi_antonelli', 'yuki_tsunoda', 'jack_doohan')`
  - Replace `yuki_tsunoda` → `arvid_lindblad`, `jack_doohan` → `franco_colapinto` in `standings` table
  - Move `isack_hadjar` from team `RB` to `Red Bull Racing`, `liam_lawson` from `Red Bull` to `Racing Bulls`
- [ ] Verify all 22 drivers in `2026_season.json` (✅ already complete)
- [ ] Add missing packages to `requirements.txt` (fastf1, supabase, python-dotenv, pydantic, httpx, websockets)
- [ ] Create `.env` with Supabase credentials
- [ ] Verify `uvicorn app.main:app --reload` starts

### Phase 1: Seed Reference Data (Day 2)
- [ ] Run circuit INSERT SQL (24 circuits — includes Madrid, excludes Imola)
- [ ] Run team INSERT SQL (11 teams — includes Cadillac and Audi)
- [ ] Run season INSERT SQL (2022-2026)
- [ ] Align driver data between Supabase `standings` table and frontend mock

### Phase 2: FastF1 ETL Pipeline (Days 3-5)
- [ ] Create `scripts/ingest_fastf1.py`
- [ ] Create `fastf1_training_data` table in Supabase
- [ ] Ingest 2022-2025 race data (~72,000 lap rows)
- [ ] Ingest race results into `race_results` table
- [ ] Verify data quality in Supabase dashboard

### Phase 3: ML Training (Days 5-7)
- [ ] Create `scripts/train_models.py`
- [ ] Train LightGBM pace model
- [ ] Train degradation models (per driver-compound)
- [ ] Implement archetype resolution for rookies
- [ ] Save models to `backend/app/models/`
- [ ] Validate predictions (realistic lap time range)

### Phase 4: Engine + API Integration (Days 7-9)
- [ ] Wire `PredictionService.get_simulation_handoff()` to use trained models
- [ ] Implement `DatabaseService` for Supabase persistence
- [ ] Fix `tyre_life` placeholder in `simulate.py`
- [ ] Test full loop: API → ML → Engine → DB → Response
- [ ] Verify determinism (same seed = same result)

### Phase 5: Qualifying + Dashboard APIs (Days 9-11)
- [ ] Build `POST /api/qualifying/` with ML predictions
- [ ] Build `GET /api/standings/drivers` (read from Supabase)
- [ ] Build `GET /api/standings/constructors`
- [ ] Build `GET /api/calendar/2026`
- [ ] Build `GET /api/circuits/{id}` with lap counts
- [ ] Ensure all responses match frontend TypeScript interfaces

### Phase 6: Testing + Polish (Days 11-14)
- [ ] Write unit tests for RaceEngine, PaceModel, QualifyingService
- [ ] Write integration tests for all API endpoints
- [ ] Fix 3 security warnings (RLS policies, vector extension, password protection)
- [ ] Performance: simulation < 5s for 60 laps
- [ ] Update README and API docs

---

## Environment Setup

```env
# backend/.env
SUPABASE_URL=https://jmllcxhzdusnhjxysilf.supabase.co
SUPABASE_SERVICE_KEY=<service_role_key>
SUPABASE_ANON_KEY=<anon_key>
FASTF1_CACHE_DIR=./cache
MODEL_DIR=./app/models
```

## Running the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
