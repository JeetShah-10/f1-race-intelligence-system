# Architecture Overview — F1 Race Intelligence System

## 1. Purpose
This document describes the system-level architecture for the F1 Race Intelligence Platform.  
The platform enables:

- Race analysis (post‑event)
- Strategy simulation (pre‑event & in‑event)
- ML‑driven performance modeling
- Telemetry visualization
- Real-time exploration of driver/stint/tyre behaviors

The architecture follows a **Hybrid Modular Model**:

- UI/UX operated independently (Jeet)
- Simulation & ML operated independently (Dev)
- Backend orchestrates communication
- Shared data artifacts unify the pipeline

---

## 2. High‑Level System Diagram (ASCII)

         ┌────────────────────────────┐
         │       Frontend UI          │
         │  (React / Vite / ECharts)  │
         └──────────────┬─────────────┘
                        │  WebSocket + REST
                        ▼
         ┌────────────────────────────┐
         │     Backend API Layer      │
         │       (FastAPI + WS)       │
         └─────────┬────────┬─────────┘
                   │        │
     ┌─────────────┘        └──────────────┐
     ▼                                     ▼
┌──────────────────────┐ ┌────────────────────────┐
│ ML Runtime Engine │ │ Simulation/Strategy │
│ (Python + FastF1 ML)│ │ Runtime (Python) │
└──────────────────────┘ └────────────────────────┘
│ │
└──────────┬────────┘
▼
┌────────────────────────────┐
│ Data Layer / Artifacts │
│ (Parquet / Feather / CSV) │
└────────────────────────────┘
---

## 3. Core Subsystems

| Subsystem | Owner | Purpose |
|---|---|---|
| Frontend UI | Jeet | Visualization + Analyst Tools |
| Backend API | Shared | Routing, Orchestration, Data Contracts |
| ML Runtime | Dev | Pace Modeling, Tyre Deg, Classification |
| Simulation Runtime | Dev | Strategy Monte Carlo, Race Scenarios |
| Data Layer | Shared | Exchange between ML ↔ Sim ↔ Frontend |

---

## 4. Architectural Principles

1. **Decoupled Intelligence Layer**
   ML & Simulation operate independently from UI.

2. **Artifact‑Based Handoffs**
   Data exchanged via `.parquet`/`.feather` files ensures reproducibility.

3. **Real‑Time Compatible**
   WebSockets support streaming deltas, telemetry, stints, predictions.

4. **Frontends Never Execute ML**
   UI consumes ML results — does not compute them.

5. **Stateless Backend**
   Backend delegates heavy physics/ML to runtimes.

---

## 5. Deployment View

Current MVP target deployment:

- **Colab / Local** → ML + Sim
- **Local machine** → UI + Backend

Future scalable deployment:

- ML → GPU optimized
- Simulation → Multithreaded cluster
- UI → Web deployed
- Backend → Cloud API

---

## 6. Supported Use Cases

| Use Case | Flow |
|---|---|
| Stint Analysis | Data → ML → Visualization |
| Undercut Strategy | ML → Sim → UI |
| Degradation Forecast | Telemetry → ML |
| Quali vs Race Comparison | Data → UI |
| Race Simulation | ML → Sim → Monte Carlo → UI |

---

## 7. Non‑Goals (Important)

The system **does not** attempt to:

- Control hardware (real cars)
- Perform CFD/aero simulations
- Replace full FIA race models

The system **does** mimic professional strategy rooms.

---

## 8. MVP Scope

MVP will include:

- Pace model (per stint)
- Degradation curves
- Pit window simulation
- Delta traces
- Tyre strategy recommendations
- Circuit/driver analytics dashboard

---

## 9. Future Scope

Future enhancements may add:

- Safety car probability models
- Weather impact adjustments
- Tyre thermal state modeling
- Fuel consumption modeling
- Real‑time telemetry streaming
- Driver style embeddings
