# Backend Architecture — F1 Race Intelligence System

## 1. Purpose
Defines the backend subsystem responsible for:

- Data orchestration
- ML runtime coordination
- Simulation runtime execution
- Frontend communication
- File-based artifact contracts

---

## 2. Responsibilities

Backend must:

✔ expose API routes  
✔ expose WebSocket feeds  
✔ manage async simulation calls  
✔ validate request payloads  
✔ serve ML model outputs  
✔ serve cleaned datasets  
✔ never perform UI rendering

---

## 3. Internal Modules (Hybrid Model)

backend/
├─ api/
├─ services/
├─ adapters/
├─ artifacts/
├─ ws/
├─ ml_runtime_adapter.py
├─ sim_runtime_adapter.py
└─ config.py

Module responsibilities:

| Module | Purpose |
|---|---|
| api/ | REST endpoints |
| ws/ | WebSocket streaming |
| services/ | orchestration logic |
| adapters/ | wraps ML + Sim processes |
| artifacts/ | storage for datasets & results |

---

## 4. Backend Flow Diagram

(Client)
Frontend UI
│ (REST Request)
▼
Backend FastAPI
│
├───> ML Runtime (Python subprocess)
│
└───> Simulation Runtime (Python subprocess)
│
▼
Artifact Store
---

## 5. Runtime Abstraction Layer

Backend treats ML + Sim as:

runtime.compute(request) -> response
Benefits:

✔ replaceable  
✔ testable  
✔ parallelizable  

---

## 6. Communication Contracts

Backend supports:

### REST (Pull Mode)

Used for:

- race results
- datasets
- model outputs

### WebSockets (Push Mode)

Used for:

- telemetry streams
- delta traces
- strategy recommendations
- simulation progress

---

## 7. Technology Stack

| Concern | Choice |
|---|---|
| API | FastAPI |
| WS | FastAPI WebSockets |
| Serialization | JSON + Parquet |
| DataFrames | Pandas |
| ML | Python/FastF1 |
| Simulation | Python |
| Storage | local (MVP) |

---

## 8. Orchestration Examples

### A. Stint Degradation Call

Frontend → /ml/degradation → Backend → ML Runtime → returns curve
### B. Race Simulation Call

Frontend → /sim/run → Backend → Simulation → returns distribution
---

## 9. Artifact Interface

Artifacts stored as:

.parquet (preferred)
.feather (optional)
.csv (debug only)
Files categorized as:

- raw/
- cleaned/
- features/
- outputs/

---

## 10. Backend is NOT Responsible For

✘ rendering charts  
✘ UI decisions  
✘ model training  
✘ user login  
✘ database migrations

These belong to other subsystems.
