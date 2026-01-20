# Data Pipeline — F1 Race Intelligence System

## 1. Purpose
Defines the flow of motorsport timing, telemetry, and strategy data through the system.

---

## 2. Pipeline Overview (ASCII)

Raw F1 Timing + Telemetry (FastF1)
│
▼
Data Cleaning Layer (Dev)
│
▼
Feature Engineering (Dev)
│
▼
ML Runtime (Pace + Deg + Quali)
│
▼
Simulation Engine (Strategy/Monte Carlo)
│
(Events + Snapshots)
│
▼
Backend Transport (REST + WS)
│
▼
UI + Analytics (Jeet)


---

## 3. Data Sources

System consumes:

### 3.1 FastF1 Components

✔ Laps (timing)  
✔ Telemetry (CarData + PositionData)  
✔ Weather  
✔ Race Control messages  
✔ Ergast/Jolpica historical results  

---

## 4. Cleaning Stage (Backend)

Cleaning includes:

- removing inaccurate laps (`IsAccurate == False`)
- filtering SC/VSC periods via `TrackStatus`
- normalizing session metadata
- handling tyre compounds
- aligning lap → sector → telemetry timestamps

Output format: `.parquet`

---

## 5. Feature Engineering Stage (ML)

Features extracted include:

### Pace Features

- Sector1Time
- Sector2Time
- Sector3Time
- LapTime
- SpeedTrap
- DRS usage
- Tyre Compound

### Stint Features

- TyreLife
- FreshTyre
- StintNumber
- PitIn/PitOut

### Driver/Car Embeddings

- Driver
- Team

---

## 6. ML Output Artifacts

ML models generate:

- baseline pace curves
- tyre degradation curves
- quali performance vectors
- pit window predictions
- probabilistic overtakes

Artifacts stored under:

/artifacts/ml/
---

## 7. Simulation Stage

Simulation consumes ML artifacts to generate:

✔ lap events  
✔ pit events  
✔ tyre transitions  
✔ SC/VSC events (stochastic)  
✔ finishing time distributions  

Output stored under:

/artifacts/sim/
---

## 8. Backend Transport Stage

Two modes:

| Mode | Purpose |
|---|---|
| REST | control & snapshots |
| WS | streaming events |

---

## 9. UI/Analytics Stage (Frontend)

Visualization includes:

- telemetry overlays
- delta graphs
- stint timelines
- tyre degradation curves
- finishing probability plots × N Monte Carlo runs

---

## 10. Persistence Stage

Data stored for:

✔ replay  
✔ regression testing  
✔ comparison  
✔ faculty review  
✔ product demos

Formats:

- `.parquet` (preferred)
- `.feather` (fast IO)
- `.json` (WS payloads)
- `.csv` (debug only)
