# User Journeys

This document outlines key user journeys for the F1 Intelligence Simulation product, focusing on how different user types navigate from initial awareness to simulation execution and results interpretation.

---

## 1. Guest → Viewer Journey

**Actor:** Guest (unauthenticated)

**Goal:** Understand the product and explore simulations without running them.

**Flow:**

1. Arrives at landing hero
2. Scrolls → cinematic 3D to 2D transition
3. Reads product reveal content
4. Views qualifying/race demo videos
5. Inspects results and HUD overlays
6. Encounters upgrade CTA
7. Chooses:
   - Sign Up
   - Continue viewing demos
   - Exit

**Success State:**
User signs up or gains product comprehension.

**Failure State:**
User bounces before value realization.

---

## 2. Registered → Simulation Journey

**Actor:** Registered User

**Goal:** Run authentic qualifying → race simulations with real motorsport logic.

**Flow:**

1. Logs in
2. Enters SIMULATE mode
3. Selects circuit + weather
4. Starts Qualifying Simulation
5. Quali generates grid
6. Proceeds to Race Simulation
7. Race outputs results
8. Views HUD analytics
9. Reruns with different circuit/weather (optional)
10. Encounters upgrade CTA (sandbox/compare locked)

**Success State:**
Simulation runs + user learns outcome.

---

## 3. Premium → Sandbox Journey

**Actor:** Premium User

**Goal:** Configure realistic scenarios and analyze outcomes.

**Flow:**

1. Logs in
2. Enters SANDBOX mode
3. Selects:
   - circuit
   - weather
   - tire rules
4. Runs Qualifying
5. Runs Race
6. Views results
7. Saves scenario
8. Compares scenarios (optional)
9. Exports (future)
10. Shares (future)

**Success State:**
Scenario stored + compared.

---

## 4. Premium → Compare Journey

**Actor:** Premium User

**Goal:** Compare two or more stored scenarios.

**Flow:**

1. Enters COMPARE mode
2. Selects scenarios
3. System loads:
   - finishing positions
   - deltas
   - pit data
   - DNFs
4. System renders overlays
5. User toggles:
   - tire view
   - pace
   - stint charts
   - gaps
   - safety car events
6. User interprets performance differences

---

## 5. Billing Journey

**Actor:** Registered or Premium

**Goal:** Upgrade, downgrade, or manage account.

**Flow:**

1. Enters PROFILE or BILLING mode
2. Reviews plan
3. Enters payment flow
4. Confirmation
5. Returns to app

---

## 6. Admin Journey (Future)

**Actor:** Admin

**Goal:** Manage data pipelines, season updates, models.

**Flow (Future):**

1. Login
2. Deploy models
3. Manage season data
4. Adjust ingestion settings
5. Monitor errors

