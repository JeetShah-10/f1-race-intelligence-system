# System Architecture Overview

This document provides a high‑level blueprint for the F1 Race Intelligence System.

It is designed for:
- engineers (backend + frontend)
- multi‑agent code execution (Claude + Antigravity)
- contributors
- product leadership

---

## 1. System Goals

The system must:

1. simulate F1 race behavior
2. learn performance patterns (ML)
3. visualize race progression
4. stream simulation events
5. enable replay & analysis
6. allow parallel backend + frontend development

---

## 2. Core Subsystems

The system consists of 6 major components:

1. **Input Layer**
2. **ML Intelligence Layer**
3. **Simulation Engine**
4. **Event Stream Layer**
5. **Visualization & UI Layer**
6. **Data & Persistence Layer**

---

### 2.1 Input Layer

Collects user inputs such as:

- circuit
- weather
- season
- driver selection
- simulation mode

---

### 2.2 ML Intelligence Layer

Predicts baseline performance (not final race behavior).

Outputs include:

- baseline pace
- qualifying performance
- predicted delta bands
- strategy hints (future)

---

### 2.3 Simulation Engine (Deterministic)

Converts ML baselines → race behavior via:

- overtakes
- pit stops
- DNFs
- tire wear
- safety car
- gaps
- sector performance

This engine is **not ML**.

---

### 2.4 Event Stream Layer (WS)

Produces:

(A) **Events**  
(B) **Lap Snapshots**

For consumption by visualization layer.

---

### 2.5 Visualization & UI Layer

Responsible for:

- timing tower
- sector timing
- deltas
- HUD overlays
- replay
- results
- analytics

UI is cinematic & motorsport accurate.

---

### 2.6 Data & Persistence

Stores:

- model weights
- results
- inputs
- replay data
- comparison runs

---

## 3. Transport & Protocols

- `REST` for initiation & configuration
- `WebSocket` for streaming simulation data

---

## 4. Execution Modes

- realtime
- accelerated
- instant

---

## 5. Build Strategy

Parallel development between backend & frontend with API contracts ensuring non-blocking progress.

---

End of Document
