# Product Requirements — F1 Intelligence Platform (2026+ Era)

## 1. Purpose

This document defines functional, feature, and behavioral requirements for the MVP of the F1 Intelligence Platform targeting the FIA 2026 regulation era.

---

## 2. Functional Requirements (FR)

### **FR‑1: Authentication**
- FR‑1.1: Users MUST authenticate to run any simulation
- FR‑1.2: System MUST support mandatory registration (UA2)
- FR‑1.3: OAuth/social login OPTIONAL (Phase‑2)

### **FR‑2: Simulation Modes**
System MUST support two simulation modes:

- FR‑2.1: **Real Prediction Mode**
  - Select upcoming 2026 GP
  - Auto-populate weather + weekend format where available

- FR‑2.2: **Sandbox Simulation Mode**
  - User selects:
    - track
    - weather
    - tire strategy mode
  - Season defaults to 2026 unless extended later

### **FR‑3: Data Model — 2026 Season**
System MUST use:
- real 2026 driver lineups
- real constructors
- real sprint circuits (2026)
- FIA calendar updates (U2)
- regulation-adjusted performance projections

### **FR‑4: Hybrid Prediction Engine**
Engine MUST implement hybrid (δ):

- FR‑4.1: ML ranking model for classification
- FR‑4.2: projection model for regulation impacts
- FR‑4.3: inferred qualifying grid
- FR‑4.4: weather + tire adjustments
- FR‑4.5: driver + constructor profile weighting

### **FR‑5: Output Display**
MVP output MUST include at minimum (R2):

- FR‑5.1: podium
- FR‑5.2: full classification (P1–P20)
- FR‑5.3: time gaps/intervals
- FR‑5.4: tire usage & pit summary
- FR‑5.5: explanatory notes (brief)

### **FR‑6: Scenario Saving**
- FR‑6.1: Registered users MUST be able to save scenarios
- FR‑6.2: Save quotas enforced for base users
- FR‑6.3: Unlimited saves for premium users

### **FR‑7: Scenario Comparison**
- FR‑7.1: System MUST allow comparing multiple simulations
- FR‑7.2: Comparison metrics include:
  - classification changes
  - gap differentials
  - podium shuffle

### **FR‑8: Telemetry Influence**
- FR‑8.1: Telemetry MUST influence simulation (T2)
- FR‑8.2: Telemetry sourcing via FastF1
- FR‑8.3: Telemetry display OPTIONAL (Phase‑2)

### **FR‑9: Admin Panel**
Admins MUST be able to:

- FR‑9.1: update constructor performance curves
- FR‑9.2: update sprint circuits
- FR‑9.3: update driver profiles
- FR‑9.4: update FIA calendar
- FR‑9.5: push regulatory adjustments

### **FR‑10: Update Model**
System MUST ingest new 2026 weekend data (U2):
- quali data
- race outcomes
- reliability trends
- driver performance deltas

---

## 3. Non‑Functional Requirements (software) (NFR)

**NFR‑1:** Desktop-first experience  
**NFR‑2:** Cinematic UX at high perceived performance  
**NFR‑3:** Explainable predictions (not black box)  
**NFR‑4:** Consistent simulation results with controlled variation  
**NFR‑5:** Cloud deployed backend + ML  
**NFR‑6:** Secure account management  
**NFR‑7:** Data integrity on season updates  
**NFR‑8:** Latency tolerances: simulation < 3s MVP  
**NFR‑9:** Reliability for multi-run scenarios  
**NFR‑10:** Zero tolerance for “nonsense outputs” (credibility risk)  

---

## 4. Business Requirements (BR)

**BR‑1:** Mandatory registration (UA2)  
**BR‑2:** Premium upgrade path (P2)  
**BR‑3:** Free tier MUST be valuable enough to retain users  
**BR‑4:** Premium tier MUST justify revenue (analytics depth)  
**BR‑5:** Season updates MUST drive re-engagement  
**BR‑6:** High demo value for investors + media  
**BR‑7:** Product MUST not be perceived as gambling platform  
**BR‑8:** Product MUST not require licensing from FOM for MVP  

---

## 5. Data Requirements (DR)

**DR‑1:** Use FastF1 for telemetry + session data  
**DR‑2:** Use projection models for 2026 regulation impacts  
**DR‑3:** Use FIA calendar + sprint specifications  
**DR‑4:** Use driver performance histories  
**DR‑5:** Use constructor development profiles  
**DR‑6:** Data updates MUST not break stored scenarios  
**DR‑7:** Predictive engine MUST support season evolution  
**DR‑8:** Weather info MUST be configurable in sandbox  

---

## 6. UX Requirements (XR)

**XR‑1:** Desktop cinematic layout  
**XR‑2:** Motorsport-inspired visual language  
**XR‑3:** Clear storytelling through race outputs  
**XR‑4:** Crisp, premium, high-speed motion  
**XR‑5:** No clutter or spreadsheet aesthetic  
**XR‑6:** Interactive comparison flows  
**XR‑7:** Tiered access gating for premium  

---

## 7. Simulation Requirements (SR)

MVP MUST simulate:

- SR‑1: Qualifying-inferred grid
- SR‑2: Race classification
- SR‑3: Gap deltas
- SR‑4: Tire/strategy impact
- SR‑5: Weather impact
- SR‑6: Driver vs constructor performance weighting
- SR‑7: Telemetry-based pace inference

Simulation MUST NOT simulate (MVP):

- SR‑X1: SC/VSC logic
- SR‑X2: DNFs / collisions
- SR‑X3: ERS deployment
- SR‑X4: overtaking physics
- SR‑X5: FIA penalties
- SR‑X6: full weekend (FP1/FP2/FP3)
- SR‑X7: multi-season progression

---

## 8. Constraints

- Desktop only for MVP
- No external API distribution
- 2026 season lock
- FIA real data updates required
- Telemetry limited by FastF1 availability
- No driving simulation required

---

## 9. Success Metrics (KPIs)

Primary KPIs:

- K1: simulation run completion rate
- K2: simulation repeat rate (sessions/user)
- K3: scenario save rate
- K4: scenario comparison usage
- K5: premium conversion rate (later milestone)
- K6: monthly active users (MAU)
- K7: retention (D7/D30)

Secondary:

- shareability & content creation (organic growth)

---

## 10. Out-of-Scope Requirements

The MVP will NOT include:

- mobile deployment
- multiplayer simulation
- team management
- driver transfer markets
- esports tournament model
- betting or odds calculation
- gambling compliance
- advertising integration

---

## 11. Requirement Summary (Short Form)

MVP = authenticated race outcome simulation for 2026 season using hybrid ML + projection model with cinematic desktop UX, scenario saving, comparison, and premium upgrade path.