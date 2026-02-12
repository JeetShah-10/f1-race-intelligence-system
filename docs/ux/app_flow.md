# Application Flow Specification

This document defines the top‑level user experience flow of the F1 Intelligence Simulation product.  
It focuses on how users enter, navigate, and interact with the system from the first page onward.

---

## 1. Entry State

All users begin in **Guest Mode**.

**Primary Objective:**  
Communicate the product’s intelligence, cinematic quality, and simulation capabilities before asking for conversion.

---

## 2. Hero Surface — “Composite 3D Performance HUD”

This is the landing experience and is **locked** as the primary attention surface.

### Layer Composition

The hero uses a three-layer composite:

1. **Car Layer (Identity)**  
   - rotating F1 model  
   - aero highlight sweeps  
   - tire material highlights  
   - brake glow (conditional)  

2. **Circuit Layer (Context)**  
   - track outline extrusion  
   - sector coloring  
   - pitlane highlight  
   - camera orbital motion  

3. **Telemetry HUD Layer (Data)**  
   - speed arc  
   - RPM + gear indicator  
   - tire compound + temps (visual)  
   - throttle/brake sliders  
   - delta comparison bar  
   - ERS deploy indicator  

### Animation Timeline
0–1s fade from black + ambient hum
1–4s 3D car rotation + lighting reveal
4–6s circuit draws + sector extrusion
6–8s HUD overlays animate in
8–9s UI panels slide in
9–10s dashboard takeover state

Duration target: **10 seconds**  
Pacing: **Cinematic, premium, not rushed**

---

## 3. Scroll Transition

Upon scroll, the 3D hero transitions into a **2D+3D hybrid documentation surface**:

- camera pulls back  
- HUD flattens into panels  
- telemetry transitions to informational cards  
- 3D remains interactive in background or suspended  

---

## 4. Product Reveal Surface

Below the hero, the product is introduced through short sections:

- what the Intelligence System does  
- what the Simulation achieves  
- why it is motorsport‑native  
- highlights of realism and internal modeling  

Media format used:

- high FPS videos  
- HUD overlays  
- short callouts  
- track + car motion shots  

**No racing news, no calendars, no FIA media content.**

---

## 5. Conversion Decision Point

At the end of the product reveal, the user chooses between:

- **Explore Simulations (Viewer)**
- **Sign Up (Registered)**
- **Upgrade (Premium)**

Guest users can explore results but **cannot run simulations**.

---

## 6. Mode System

Once inside the application, the UX follows a **mode‑based architecture**:

VIEW (Guest/Registered/Premium)
SIMULATE (Registered/Premium)
COMPARE (Premium)
PROJECT (future scope)
PROFILE (Registered/Premium)
BILLING (Registered/Premium)


Modes are switched via top‑level navigation.

---

## 7. Simulation Pipeline (Phase‑1 Locked)

Phase‑1 simulation always follows:

Qualifying Simulation
→ Grid
→ Race Simulation
→ Results HUD


No season simulation, no sprint configuration, no fantasy editing.

---

## 8. Qualifying Simulation Flow

Qualifying UX style = **Hybrid** leaning toward **Broadcast realism**

### Broadcast Layer Includes:

- timing tower  
- sector mini‑map  
- purple/green/yellow sectors  
- tire compound icons  
- weather strip  
- driver cards  

### Analytical Layer Includes:

- delta overlays  
- sector gap bars  
- predicted pace markers  
- track evolution indicators  

User cannot modify driver behavior, aggression, or internal pacing.

**Output:** Grid Order

---

## 9. Race Simulation Flow

Takes Grid as input.

Internally resolves:

- tire deltas  
- mechanical reliability  
- pit windows  
- DNF probability  
- safety car events  
- track evolution  
- driver aggression (latent)  
- stint modeling  

User sees:

- tower positions  
- gap deltas  
- overtakes  
- tire status  
- race timeline  

---

## 10. Results Surface

After race completes, user sees:

- finishing order  
- gaps  
- tire details  
- pit stops  
- DNFs  
- safety car events  
- stint progression chart  

Guest users can only view.

Registered users can:

- run again (different races)

Premium users can additionally:

- save scenario  
- compare  
- export (future scope)

---

## 11. Module Access by User Type

| Module | Guest | Registered | Premium |
|---|---:|---:|---:|
| Hero & Product Reveal | ✔ | ✔ | ✔ |
| View Stored Scenarios | ✔ (limited) | ✔ | ✔ |
| Run Race Simulation | ✘ | ✔ | ✔ |
| Run Qualifying Simulation | ✘ | ✔ | ✔ |
| Sandbox Configuration | ✘ | ✘ | ✔ |
| Comparison Mode | ✘ | ✘ | ✔ |
| Save Scenario | ✘ | ✘ | ✔ |
| Export / Share | ✘ | ✘ | future |
| Season Projection | ✘ | ✘ | future |
| Billing & Subscription | ✘ | ✔ | ✔ |

---

## 12. Sandbox (Phase‑1 Definition)

Sandbox allows configuration of **valid motorsport parameters** only.

### User‑configurable:

- circuit selection  
- weather category (dry/light rain/wet)  
- tire compound rules  
- qualifying → race chain  

### System‑derived (not exposed):

- track temp  
- aggression  
- mechanical reliability  
- safety car probability  
- pit windows  
- DNF probability  
- stint lengths  
- track evolution  
- sprint outcome (future ingestion)  

---

## 13. No Fantasy Mechanics

Explicitly not supported:

- lineup swaps  
- constructor swaps  
- stamina sliders  
- aggression sliders  
- regulation editors  
- setup tuning  
- calendar editing  

These break the intelligence/system identity of the product.

---

## 14. Future Extensions (Not Phase‑1)

Future ingestion scope includes:

- FP1–FP3 pace modeling  
- Sprint simulation  
- Season evolution analysis  
- Constructor form curves  
- Reliability curves  
- Data ingestion from 202x seasons  
- Confidence distributions  

---

## 15. Visual & Performance Characteristics

The product targets:

- high FPS UX  
- hybrid 3D composition  
- simplified PBR  
- HDRI lighting  
- medium‑poly assets  
- minimal blocking loads  

Avoids:

- ray tracing  
- ray marching  
- ultra‑high poly meshes  
- heavy SSR  

---

## 16. Summary Statement

Final user experience intention:

> **Cinematic motorsport UX combined with a race intelligence simulation engine, not a stats portal, not a fantasy sandbox, not a game.**

---