# Visual Language

Defines the visual identity of the F1 Race Intelligence System.

The system blends three visual pillars:

1. **Heritage (Motorsport Authenticity)**
2. **Tech (Engineering Precision)**
3. **Modern UI (High‑polish Hybrid Performance)**

---

## 1. Color Architecture

The palette is divided into three semantic layers:

### (A) Heritage — Brand & Emotional Layer

Used for hero scenes, marketing surfaces, and premium states.

| Name | Color | Usage |
|---|---|---|
| Ferrari Rosso | #CF2C28 | performance / highlight |
| Alpine Blue | #004BFF | technical identity |
| Silver Arrow | #9FA4A8 | metallic accents |
| Carbon Black | #0B0D10 | base background |
| Asphalt Charcoal | #15171C | panels / surfaces |

Associations:
- racing legacy
- premium motorsport
- mechanical identity

---

### (B) Tech — UI Surface / Engineering Layer

Used for the simulation interface, data surfaces, panels, and dashboards.

| Name | Color | Usage |
|---|---|---|
| Turbine Blue | #1A9FFF | actionable info |
| Signal Orange | #FF6A00 | warnings / events |
| Industrial Amber | #FFAE00 | attention / pit strategy |
| Neutral Gray | #2C323C | UI panels |
| Steel Gray | #3B424F | framing |

Associations:
- precision
- engineering
- tool‑grade UI

---

### (C) Motorsport Semantics — Telemetry Layer

Used for genuine motorsport semantics during qualifying & race.

| Meaning | Color | Usage |
|---|---|---|
| Sector Best | #A020F0 | purple |
| Personal Best | #00E676 | green |
| Caution | #F9E300 | yellow |
| Failure / DNF | #E32636 | red |
| ERS / Deploy | #008CFF | blue |
| Neutral | #FFFFFF | white |

These colors are **not brand colors** — they are **racing rules**.

---

## 2. Tire & Weather System

FIA tire color standard is preserved:

| Compound | Color | Label |
|---|---|---|
| C1 | #F2F2F2 | Hard |
| C2 | #E2DD47 | Medium |
| C3 | #F74141 | Soft |
| Intermediate | #1EB53A | Inter |
| Wet | #0064E0 | Wet |

Weather:
- Dry
- Light Rain
- Wet

No fine‑grain meteorological sliders in Phase‑1.

---

## 3. Typography

Primary:
- **Square Sans** (Eurostile / Agency style)
Usage: HUD, timing tower, broadcast UI

Secondary:
- **Modern Sans** (Inter / Roboto)
Usage: panels, tables, description text

Rules:
- Timing ≠ Body text
- Tabular numerals for alignment
- Monospace hints for lap/sector formatting

---

## 4. Motion Language

Motion communicates:
- velocity
- accuracy
- decision flow

Characteristics:
- clean directional transitions
- elastic acceleration curves
- no chaotic motion noise

Easing:
cubic-bezier(0.17, 0.84, 0.44, 1)

---

## 5. Lighting & Surface Treatments

Uses hybrid 3D/2D rendering:

- gloss + metal reflections (hero only)
- HDRI environment maps
- minimal bloom
- filmic contrast
- layered transparency in UI

Applied with restraint — not “RGB gaming”.

---

## 6. Spatial Layering

The UI is structured in layers:

Foreground → HUD / Telemetry  
Midground → Data Panels / Controls  
Background → 3D Scene / Track / Car

This preserves visual clarity during complex motion.

---

End of Document
