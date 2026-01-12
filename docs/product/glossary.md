# Glossary

**Analytics Engine** — Component that computes comparative and explanatory metrics from simulation or ML outputs.

**API** — Interface exposing backend functionality to frontend for simulation execution and data retrieval.

**Batch Simulation** — Execution of multiple simulations in sequence or in parallel for scenario comparison or season analysis.

**Backend** — Server-side services responsible for orchestration, simulation, ML inference, billing, and data access.

**Cache** — Mechanism for storing precomputed results to reduce latency for repeated simulations or data requests.

**Circuit Metadata** — Track-specific information including layout, length, overtaking difficulty, elevation, and weather patterns.

**Constructor** — F1 team entity responsible for car design and operations (e.g., chassis, power unit, pit crew performance).

**Driver Performance Model** — Component that estimates driver-specific behavior such as pace, consistency, aggression, and tire wear tendencies.

**Forecasting Model** — ML model responsible for predicting race finishing order or outcome distributions from feature inputs.

**Frontend** — User-facing interface enabling scenario configuration, visualization, and interaction with simulation results.

**Hybrid Simulation** — Approach combining ML predictions and deterministic motorsport constraints (e.g., grid order, tire rules, safety behavior).

**Inference** — Execution of trained ML model to produce predictions for a given set of race inputs.

**Intelligence Layer** — Internal subsystem containing ML, simulation logic, performance models, and feature transformations.

**Lap Telemetry** — Detailed lap data such as speed, throttle, braking, and timing used for feature extraction or validation.

**Model Artifact** — Serialized ML model exported for backend inference (e.g., `.pkl`, `.joblib`).

**Monte Carlo Simulation** — Stochastic approach running multiple variations of a scenario to estimate uncertainty or sensitivity (Phase‑2).

**Premium User** — Authenticated user with access to sandbox simulations, comparisons, and high-intensity compute workloads.

**Projection Layer** — Deterministic logic approximating race behavior using domain rules (tires, overtakes, degradation, track evolution).

**Real Race Simulation** — Prediction mode constrained to real F1 event data using actual season context.

**Registered User** — Authenticated user with access to real race simulation but without sandbox or batch capabilities.

**Sandbox Mode** — User-driven scenario builder enabling modification of track, weather, tires, and grid for hypothetical race simulations.

**Scenario** — Encoded configuration of a simulation including inputs, outputs, metadata, and model version.

**Scenario Comparison** — Analytical process contrasting two or more scenarios to highlight performance deltas.

**Season Data** — Structured information about drivers, constructors, calendar, sprint format, and regulations for a specific F1 year.

**Simulation Engine** — Deterministic component applying motorsport rules, strategy logic, and pacing estimates to generate race outputs.

**Strategy Model** — Component modeling tire selection, stint segmentation, pit cycles, and time-loss dynamics.

**Telemetry Integration** — Mechanism for ingesting or processing detailed data for feature extraction (Phase‑2).

**Uncertainty Estimate** — Confidence or variability measure associated with predicted race outcomes (Phase‑2).
