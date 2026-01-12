# Use Cases — Hybrid ML Formula One Race Prediction System

---

## 1. Actors

### 1.1 User Actors
- **RegisteredUser**
  - can run real race prediction
  - can view results
  - can save limited scenarios
  - can compare limited scenarios
  - cannot access sandbox simulation

- **PremiumUser**
  - inherits RegisteredUser capabilities
  - can run sandbox simulations
  - can perform season comparisons
  - can perform driver vs driver analytics
  - can perform constructor vs constructor analytics
  - can export scenario reports (Phase‑2)
  - unlimited saves, unlimited runs

- **Viewer**
  - unauthenticated, demo‑only
  - cannot run any simulation

- **Admin**
  - manages season data, performance parameters, regulatory data, models

### 1.2 System Actors
- **MLPredictionEngine**
- **SimulationEngine**
- **DriverPerformanceModel**
- **ConstructorPerformanceModel**
- **WeatherModel**
- **StrategyModel**
- **RegulationEngine**
- **TelemetryIntegrationLayer**
- **SeasonDataService**
- **ScenarioVersionService**
- **ScenarioStorageService**
- **AnalyticsEngine**
- **ExportService**
- **AuthService**
- **BillingService**
- **CacheService**

---

## 2. Core Simulation Use Cases

### UC-SIM-REAL-RACE — Real Grand Prix Prediction

**Primary Actor:** RegisteredUser, PremiumUser  
**Preconditions:** Authenticated, season data available  
**Trigger:** User selects real event and runs prediction

**Main Flow:**
1. User selects target Grand Prix
2. System loads event metadata (track, sprint format, schedule)
3. SeasonDataService provides driver + constructor performance context
4. MLPredictionEngine predicts qualifying/grid or imports if available
5. SimulationEngine integrates:
   - DriverPerformanceModel
   - ConstructorPerformanceModel
   - WeatherModel
   - StrategyModel
   - RegulationEngine
6. SimulationEngine generates predicted classification, gaps, stints
7. AnalyticsEngine computes explanatory metrics
8. System renders output

**Postconditions:**
- Results visible
- Scenario may be saved or compared

---

### UC-SIM-SANDBOX — Sandbox Scenario Simulation

**Primary Actor:** PremiumUser  
**Preconditions:** Authenticated, Premium subscription  
**Trigger:** User selects sandbox mode

**Main Flow:**
1. User selects track
2. User configures weather
3. User configures tire strategy mode
4. System validates scenario
5. SimulationEngine runs hybrid evaluation
6. AnalyticsEngine computes result context
7. System renders output

**Postconditions:**
- Scenario may be saved or compared
- Can be exported in Phase‑2

**Constraints:**
- Not accessible to RegisteredUser
- Sandbox can chain multiple scenarios for comparison

---

## 3. Scenario Storage & Comparison

### UC-SCENARIO-SAVE

**Actor:** RegisteredUser, PremiumUser  
**Preconditions:** Simulation completed  
**Trigger:** Save action invoked

**Main Flow:**
1. System captures:
   - input configuration
   - simulation outputs
   - metadata
   - model versions
2. ScenarioVersionService versions entry
3. ScenarioStorageService persists scenario

**Constraints:**
- RegisteredUser: limited save count
- PremiumUser: unlimited

---

### UC-SCENARIO-COMPARE

**Actor:** RegisteredUser, PremiumUser  
**Trigger:** Compare scenarios action  
**Comparison Dimensions:**
- classification differences
- gap deltas
- tire strategy efficacy
- weather effect
- predicted vs alternate scenario

**Premium Extensions:**
- batch comparison
- multi-scenario overlays
- exportable reports

---

## 4. Analytical Comparison Use Cases

### UC-ANALYTICS-DRV-VS-DRV — Driver vs Driver Analysis

**Actor:** PremiumUser  
**Scope:** Single Race + Season  
**Output:**
- pace deltas
- stint comparisons
- tire degradation curves
- consistency metrics
- narrative summary
- structured report (export Phase‑2)

---

### UC-ANALYTICS-CON-VS-CON — Constructor vs Constructor Analysis

**Actor:** PremiumUser  
**Scope:** Single Race + Season  
**Output:**
- performance evolution
- reliability vs pace
- pit stop performance
- competitive deltas
- structured reports

---

## 5. Account & Subscription Use Cases

### UC-AUTH-LOGIN
**Actor:** RegisteredUser  
**Trigger:** Login action  
**Service Actors:** AuthService

---

### UC-AUTH-REGISTER
**Actor:** Viewer → RegisteredUser  
**Trigger:** User signs up  
**Postcondition:** Access to real race simulation

---

### UC-BILLING-UPGRADE
**Actor:** RegisteredUser → PremiumUser  
**Trigger:** User triggers upgrade via paywall  
**Service Actors:** BillingService

---

## 6. Admin & Data Lifecycle Use Cases

### UC-ADMIN-SEASON-UPDATE
**Actor:** Admin  
**Functions:**
- update drivers/constructors
- update calendar & sprints
- update weather datasets
- update regulation parameters

---

### UC-ADMIN-PERFORMANCE-UPDATE
**Actor:** Admin  
**Functions:**
- update driver performance curves
- update constructor performance curves
- update strategy parameters

---

## 7. Background / System Use Cases (Non‑User)

### UC-SYS-MODEL-RETRAIN
**Actor:** MLPredictionEngine  
**Trigger:** dataset threshold or admin trigger  
**Outcome:** model updated

---

### UC-SYS-SEASON-INGEST
**Actor:** SeasonDataService  
**Trigger:** calendar update availability  
**Outcome:** new season data synchronized

---

### UC-SYS-TELEMETRY-INGEST (Phase‑2)
**Actor:** TelemetryIntegrationLayer  
**Outcome:** telemetry used for validation/learning

---

### UC-SYS-SCENARIO-VERSION
**Actor:** ScenarioVersionService  
**Purpose:** prevent invalidation after updates

---

### UC-SYS-CACHE-OPTIMIZE
**Actor:** CacheService  
**Goal:** reduce simulation latency <3s

---

### UC-SYS-BILLING-VALIDATE
**Actor:** BillingService  
**Goal:** enforce access rights

---

## 8. Out-of-Scope (Anti-Use Cases)

System will not:
- provide gambling/odds service
- simulate vehicle controls
- provide live telemetry broadcast
- implement fantasy team management (Phase‑3)
