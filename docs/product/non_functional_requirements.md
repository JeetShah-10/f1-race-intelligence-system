# Non-Functional Requirements

## 1. Performance

- The system shall return initial simulation results within **≤ 8 seconds** for real-race predictions under normal load.
- The system shall support staged compute where initial estimates may be returned faster, followed by deeper refinements.
- Frontend interactions shall update UI within **≤ 200ms** for non-compute interactions.
- GPU-backed inference shall be used for ML workloads hosted in cloud environments (AWS/GCP/Azure).

## 2. Scalability

- The system shall scale horizontally to support concurrent simulation requests.
- Simulation workloads for Premium users shall be isolated to prevent resource starvation for Registered users.
- Batch or season-level analytics shall be offloaded to background compute when necessary.

## 3. Reliability & Availability

- The system shall target **99.5% uptime** for core simulation and prediction APIs.
- Scenario storage shall be durably persisted and retrievable across season updates.
- Model artifacts shall be versioned and backward-compatible for previously saved scenarios.

## 4. Usability

- UI shall prioritize fast perceived responsiveness and interactive feedback for simulation requests.
- Visualization outputs shall be understandable by motorsport enthusiasts without requiring technical ML knowledge.
- Premium features shall guide users toward deeper insights without degrading the base experience.

## 5. Accuracy & Domain Fidelity

- Prediction outputs shall incorporate motorsport domain constraints including qualifying order, tire rules, safety considerations, and constructor-driver assignments.
- ML components shall expose uncertainty or confidence information when applicable.
- Season data updates shall preserve domain correctness and regulatory changes.

## 6. Maintainability

- Codebase shall follow modular structure separating frontend, backend, ML models, and data pipelines.
- ML models shall be updateable without breaking existing API contracts.
- Data pipelines shall allow incremental ingestion of future season data.

## 7. Security

- Authentication and session management shall prevent unauthorized execution of simulation workloads.
- Premium features shall enforce billing validation through secure mechanisms.
- Model training data sources shall be validated against tampering and corruption.

## 8. Portability

- ML inference workloads shall be deployable on cloud GPU infrastructure.
- Backend APIs shall remain cloud‑provider agnostic where feasible.

## 9. Compliance

- The system shall not provide gambling odds or enable regulated betting behavior.
- The system shall not violate motorsport rights, licensing constraints, or data distribution agreements.

## 10. Resource Constraints

- GPU resources shall be allocated preferentially for Premium workloads.
- Heavy simulations (multi-scenario or season projection) may be executed asynchronously.
- Caching strategies shall reduce redundant computation for popular circuits or sessions.

## 11. Observability

- System shall expose logs, metrics, and traces for simulation execution paths.
- Model inference failures shall degrade gracefully with meaningful fallback responses.
- Performance telemetry shall be collected to improve latency and throughput over time.