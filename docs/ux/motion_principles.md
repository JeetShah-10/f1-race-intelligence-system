# Motion Principles

Defines the conceptual motion framework for the F1 Race Intelligence System. Motion is used to convey **velocity**, **precision**, and **data clarity**, without compromising simulation readability.

The system uses a "**Hybrid Performance**" approach:
> Porsche UI polish + FOM broadcast semantics + GT7 UI fluidity

---

## 1. Motion Purpose

Motion must serve one or more of the following purposes:

- **State Change**
- **Data Change**
- **Context Shift**
- **Focus Transfer**
- **Narrative / Reveal**
- **Feedback / Confirmation**

Motion must never be purely decorative.

---

## 2. Motion Personality

The personality of motion is defined by three adjectives:

1. **Precise** (technical, intentional)
2. **Confident** (smooth, controlled, not shy)
3. **Fast** (reflecting motorsport timing)

Avoid:
- chaotic easing
- exaggerated bounces
- novelty animations
- gaming UI randomness

---

## 3. Hierarchy of Motion

Priority guide:

Information Clarity > Cinematic Flair > Brand Expression
During simulation or race playback:
> **clarity always wins**

During hero scenes or marketing reveal:
> **brand expression can push further**

---

## 4. Motion Scale

The system uses three motion scales:

| Scale | Usage |
|---|---|
| Micro | UI feedback (hover, click, toggle) |
| Meso | Panel transitions, timeline shifts |
| Macro | Hero scene, screen context shifts |

Example associations:

- **Micro** → <100ms
- **Meso** → 150–300ms
- **Macro** → 300–2000ms

---

## 5. Easing Curves

The default easing curve:

cubic-bezier(0.17, 0.84, 0.44, 1)


Reason:
- fast start
- elastic but controlled resolution
- premium physicality

Alternative curves:

**For data clarity**
cubic-bezier(0.4, 0.0, 0.2, 1)

**For cinematic hero**
cubic-bezier(0.16, 1, 0.3, 1)
---

## 6. Velocity & Physics

The system aims to evoke motorsport physics without simulating it literally.

Implied physics include:
- inertia
- acceleration
- overshoot (minimal)
- friction
- suspension damping (micro)

No:
- cartoon bounces
- unrealistic slosh
- liquid / rubber elasticity

---

## 7. Data Integrity Rules

Motion must **never conceal data**.

Therefore:
- no distracting overlays during sector updates
- no delayed lap time reveals
- no overlong transitions around overtakes

Race data changes at race speed.

---

## 8. Temporal Rhythm

Motorsport has rhythm:

- bursts (start sequences, battles, pit stops)
- monotony (cruising laps, tire management)
- spikes (DNF, safety car, yellow flag)

UI motion aligns to this rhythm:

Example:
- pit stop markers appear sharply
- SC introduces a soft slowdown layer
- DNFs remove drivers with dignified snap shrink

---

## 9. Mode Transitions

The system defines four major context modes:

| Mode | Description |
|---|---|
| Hero | cinematic onboarding & marketing |
| Analysis | technical, paused states |
| Simulation | real‑time playback |
| Results | summary & comparison |

Each mode uses a different motion language:

- **Hero:** cinematic, elastic, premium
- **Analysis:** minimal, stabilized, crisp
- **Simulation:** real‑time, reactive
- **Results:** structured, tabular, composed

---

## 10. Motion Restraint

Restraint rules:

- no flashing badge spam
- no GIF‑style infinite looping
- no UI jitter
- no impatient hover animations

Premium systems express luxury through restraint.

Examples:
- Porsche PCM
- AMG MBUX
- GT7 menus
- F1 TV Pro overlays

---

## 11. Accessibility & Performance

Must support:

- **60fps target**
- reduced motion mode (optional)
- GPU‑aware transitions

If reducing motion:
- animation curves flatten
- hero sequences skip
- UI remains fully functional

---

End of Document
