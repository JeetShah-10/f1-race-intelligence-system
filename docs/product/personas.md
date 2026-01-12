# Personas — F1 Intelligence Platform (2026+ Era)

## 1. Purpose

This document identifies the primary and secondary user personas for the platform, their motivations, behaviors, needs, and how they interact with the simulation experience.

The personas drive UX, onboarding, feature gating, and premium upgrade strategy.

---

## 2. Persona Overview (MVP)

The platform primarily attracts users at the intersection of:

- motorsport fandom
- data curiosity
- strategy/simulation interest

The three priority personas for MVP are:

1. The Analyst Fan
2. The Strategy Enthusiast
3. The Esports/Content Creator

Secondary personas will be relevant in later phases.

---

## 3. Persona Profiles

### **Persona A — The Analyst Fan**
**Motivation:**
Wants to understand *why* races happen the way they do — not just watch them.

**Goals:**
- explore race predictions
- interpret drivers vs constructors
- understand effects of weather/tires
- compare simulation scenarios

**Behaviors:**
- consumes F1 media beyond highlights (tech analysis, telemetry breakdowns)
- may not be a data scientist, but is curious about data

**Needs:**
- credibility
- explainability
- trustworthy simulation
- visually digestible analytics

**Triggers for Premium:**
- telemetry overlays
- multi-scenario comparisons
- strategy branches
- deeper analytics

---

### **Persona B — The Strategy Enthusiast**
**Motivation:**
Wants to play tactician and test “what-if” conditions.

**Goals:**
- configure scenarios
- adjust weather/tire/track variables
- validate hypotheses about race outcomes

**Behaviors:**
- interacts with simulation games
- discusses strategy on Discord/Reddit
- engages in predictive debates

**Needs:**
- configurable sandbox mode
- realistic constraints (2026 regs, sprint circuits)
- trustworthy data-driven outputs

**Triggers for Premium:**
- unlimited simulation runs
- multi-lap or stochastic scenarios
- scenario saving and exporting

---

### **Persona C — The Esports/Content Creator**
**Motivation:**
Needs compelling, shareable content for audiences.

**Goals:**
- create speculative prediction videos
- compare drivers/constructors
- simulate future championship outcomes
- produce visually engaging assets

**Behaviors:**
- active on YouTube/TikTok/Twitter
- uses simulation as storytelling tool

**Needs:**
- cinematic UI
- visually rich result screens
- export options
- credible predictions (avoid ridicule)

**Triggers for Premium:**
- export tools
- telemetry visuals
- strategy/replication utilities
- no run limit throttling

---

## 4. Secondary Personas (Future Phases)

### **Persona D — The Esports Team Analyst**
Not for MVP.
Would use simulation for:
- strategic preparation
- scenario planning
- comparative analytics

### **Persona E — The Data Scientist**
Would tap into ML models and/or APIs for:
- tuning
- experimentation
- custom evaluation

### **Persona F — The Motorsports Engineer**
Would care about:
- FIA rule modeling
- driver performance curves
- tire degradation modeling
- reliability curves

These personas inform future API, research, and B2B pathways.

---

## 5. Anti-Personas (Not Target Audience)

To prevent product drift, identify who we are NOT building for:

- **Gamers** looking for driving simulation → this is not Codemasters F1
- **Gambling/Bettors** → platform refuses to position as betting tool
- **Casual fans** who only watch highlights → low conversion likelihood
- **Spreadsheet purists** who prefer CSV over UI → not design focus for MVP

---

## 6. Persona-to-Feature Mapping

| Requirement Domain | A (Analyst) | B (Strategy) | C (Creator) |
|---|---|---|---|
| Hybrid simulation | ✔ | ✔ | ✔ |
| Sandbox mode | △ | ✔ | △ |
| Telemetry influence | ✔ | ✔ | ✔ |
| Cinematic results | △ | △ | ✔ |
| Save scenarios | ✔ | ✔ | ✔ |
| Compare scenarios | ✔ | ✔ | △ |
| Export/share | △ | △ | ✔ |
| FIA updates | ✔ | ✔ | △ |
| Premium tier | high | high | very high |

△ = useful, but not core driver

---

## 7. Persona Lifecycle (Retention Path)

Personas tend to pass through a lifecycle:

ONBOARD → EXPLORE → MASTER → SHARE → PAY → ADVOCATE

Creators accelerate network effects.

---

## 8. Persona Alignment with Business Model

| Business Vector | Impact |
|---|---|
| Premium conversion | Analysts & Strategists lead |
| Viral growth | Creators lead |
| Retention | Analysts lead |
| Feature expansion | Strategists lead |
| Credibility | Analysts & Engineers |
| Future B2B | Analysts & Engineers |

---

## 9. Summary

The MVP is designed for users who:
- like F1
- like intelligence models
- like simulation
- like experimentation

The platform must balance:
> cinematic storytelling + analytical credibility + simulation agency