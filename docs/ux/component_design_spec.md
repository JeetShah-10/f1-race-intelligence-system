# Component Design Specification

Defines the core components of the Simulation UI and how they behave.

---

## 1. Timing Tower

Purpose:
Display positional order and race deltas in a compact vertical form.

### Features
- real‑time position updates
- animated swaps on overtakes
- tire indicator (compound chip)
- team color stripe
- time delta (optional modes)
- highlight on personal best sector/lap
- user can expand driver for detail

### Expanded Driver View (Premium)
Shows:
- stint sequence
- tire age
- pit history
- pace confidence band
- aggression profile (internal)

---

## 2. Sector & Lap Panel

Displays qualifying performance in motorsport semantics.

Visualization rules:
- Sector times: S1 / S2 / S3
- Sector color:
  - purple (session best)
  - green (personal best)
  - yellow (no improvement)

Additional:
- lap completion bar
- predicted vs actual delta (future)

---

## 3. Delta Bar

Shows the time gap between two cars.

Modes:
- absolute (+2.384s)
- relative (-0.124s)
- predictive (future scope)

Animation:
- horizontal motion on gain/loss

---

## 4. Tire Component

Attributes:
- compound (C1/C2/C3/Inter/Wet)
- age (laps)
- stint color coding
- degradation ring (future)
- heat bloom (visual hint)

---

## 5. Event Markers

Supported event types:
- Overtake
- Pit Stop
- Safety Car
- Virtual SC
- DNF
- Yellow Flag

Displayed on timeline and tower highlights.

---

## 6. Track Mini‑Map

Shows driver positioning with:
- colored dots (team or tire)
- pit lane outline
- sector colors
- camera orbit cues (hero only)

---

## 7. Weather Strip

Indicates:
- session type
- weather state
- track evolution (internal)
- no granular sliders

---

## 8. Results Tables

Columns:
Driver | Team | Tire | Gaps | Pit | DNFs | Notes

Premium adds:
- confidence bands
- stint charts
- pace overlays

---

End of Document
