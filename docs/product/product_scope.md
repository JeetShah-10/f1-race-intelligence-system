# Product Scope — F1 Intelligence Platform (2026+ Era)

## 1. Scope Overview

This document defines what the MVP will include, what it will explicitly not include, and what will be deferred to later phases.

The MVP is centered around simulating and predicting Formula 1 race outcomes for the 2026+ regulation era using a hybrid ML + projection model and cinematic desktop-first UX.

---

## 2. In-Scope (MVP)

The MVP includes:

### 2.1 Simulation Modes
- Predict real 2026 race outcomes
- Simulate sandbox scenarios (track + weather + tire mode)

### 2.2 Sessions Supported
- Race simulation
- Qualifying inferred or projected for grid

### 2.3 Output Detail Level (R2)
- podium
- full classification
- gap deltas
- tire/pit summaries

### 2.4 Hybrid Prediction Model (δ)
- ML ranking engine for order
- projection model for constructor/driver performance
- 2026 lineup + FIA regulation assumptions

### 2.5 User Roles (UA2)
- Registered user (base)
- Premium user (advanced features)
- Admin (data/config control)

### 2.6 Authentication
- mandatory sign-in to run simulations

### 2.7 UI/UX Scope
- simulation configuration UI
- cinematic output display (desktop-focused)
- result comparison view (basic)
- scenario saving (limited for base users)

### 2.8 Data & Updates (U2)
- ingest 2026 race weekend updates
- constructors + lineups + sprint circuits
- known FIA calendar changes

### 2.9 Deployment Scope
- desktop web application
- cloud-hosted backend + ML service

---

## 3. Out of Scope (MVP)

The MVP will **not** include:

### 3.1 Historical Season Simulation
- pre‑2026 race results
- previous era performance models

### 3.2 Physics-Based FIA Event Simulation
- per-lap overtakes
- SC/VSC events
- DNFs / collisions
- mechanical failures
- brake lockups
- aggressive vs conservative driving

These belong to Phase‑2 or Phase‑3.

### 3.3 Real-Time Live Mode
- ingesting live timing feeds
- strategy recommendation during live F1 races

### 3.4 Transfer Editor / Custom Rosters
- lineup editing
- team transfers
- season creation tools

### 3.5 Mobile UX
- responsive or mobile-first layouts

### 3.6 B2B / API Distribution
- no external simulation API
- no analytics data export contracts

---

## 4. Deferred to Future Phases

Planned expansions include:

### Phase‑2: Semi-Real Simulation
- SC/VSC stochastics
- tire wear models
- sprint weekend structure
- weather evolution
- strategy branching
- telemetry overlays
- multi-run Monte Carlo
- constructor development curves

### Phase‑3: Full Motorsport Simulation
- weekend timelines (FP1/FP2/FP3/Quali)
- overtaking + ERS + racecraft modeling
- penalties & FIA rulesets
- driver aggression profiles
- DNF mechanics
- reliability curves
- replay visualization

### Phase‑4: Live Analysis
- real race predictive overlays
- strategy advisor mode
- esports integrations

---

## 5. Non-Functional Scope

The MVP will also target:

- high perceived quality
- cinematic UX
- desktop performance
- explainability (why did prediction happen)
- simulation repeatability with variation

---

## 6. Stakeholders

Primary stakeholders:

- F1 fans (2026+ era)
- simulation/engineering enthusiasts
- ML/data enthusiasts
- esports content creators
- competitive predictors
- premium subscribers
- admins & maintainers

---

## 7. Success Criteria (MVP)

Success is measured by:

- ability to simulate race outcomes without errors
- results perceived as credible and interesting
- UX perceived as premium, cinematic, and “F1‑vibed”
- users returning to run multiple simulations
- users upgrading for premium depth

---

## 8. Anti-Goals (What We Will Not Do)

The platform is **not** intended to be:

- a driving game
- a gambling tool
- a live odds bookmaker
- a fantasy league
- a general-purpose ML toolbox
- a telemetry replay software clone

---

## 9. Short Summary

MVP scope is:
> run 2026 F1 race simulations via hybrid ML with cinematic UI and save/compare scenarios behind authentication with premium depth reserved for advanced users.