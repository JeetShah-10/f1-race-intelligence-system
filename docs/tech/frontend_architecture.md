<<<<<<< HEAD
# Frontend Architecture — F1 Race Intelligence System

## 1. Purpose
Defines the UI/UX layer responsible for visualizing:

- race simulations
- telemetry traces
- delta comparisons
- stint + tyre analytics
- strategy recommendations
- replay and HUD overlays

Frontend acts as the **human intelligence interface** over the ML/Simulation system.

---

## 2. Responsibilities

Frontend must:

✔ render analytics and simulation outputs  
✔ display real-time or accelerated simulations  
✔ present telemetry in motorsport-friendly formats  
✔ enable replay, comparison, and configuration  
✔ request ML/Sim computations from backend  
✔ never run ML models itself (backend only)

---

## 3. Major UI Subsystems

The UI contains 6 key focus areas:

| Subsystem | Function |
|---|---|
| Control Panel | Configure simulation/inputs |
| Timing Tower | Display gaps & positions |
| Telemetry Viewer | Speed/Throttle/DRS/Delta traces |
| Strategy Dashboard | Tyre / pit window analytics |
| Circuit Map | Spatial position visualization |
| Results View | Final classification & stats |

These map to real-world F1 strategy rooms.

---

## 4. UI Component Diagram (ASCII)

┌──────────────────────────────────────────┐
│ Frontend UI │
├──────────────────────────────────────────┤
│ Controls │ Visualization Layer │
│───────────────│──────────────────────────│
│ Driver Select │ Timing Tower │
│ Track Select │ Circuit Map │
│ Weather │ Telemetry Traces │
│ Mode │ Delta Viewer │
│ Start/Stop │ Strategy Dashboard │
│ Replay │ Results/Stats │
└───────────────┴──────────────────────────┘
---

## 5. Communication With Backend

Frontend communicates via:

### REST (pull mode)
- fetch datasets
- fetch model outputs
- fetch replay data

### WebSocket (push mode)
- stream simulation events
- stream lap snapshots
- stream deltas
- stream tyre state changes

Frontend → REST → Backend (configure/start)
Backend → WS → Frontend (stream data)
---

## 6. Data Visualization Models

Telemetry UI uses well-established motorsport patterns:

### Support visualizations:

✔ delta trace  
✔ throttle/brake overlays  
✔ speed vs distance  
✔ stint compound chart  
✔ degradation curve  
✔ pit window visualization  
✔ tyre crossover analysis  
✔ probabilistic finishing positions  

---

## 7. Execution Modes UX

Backend supports 3 execution modes:

| Mode | Behavior |
|---|---|
| Real‑Time | matches race speed |
| Accelerated | 2–1000x faster |
| Instant | compute → show → replay |

Frontend supports:

- start
- pause
- replay
- compare

---

## 8. Frontend Tech Stack

| Concern | Choice |
|---|---|
| Framework | React + Vite |
| Charts | ECharts or D3 or Recharts |
| State | Zustand or Redux |
| Transport | REST + WebSocket |
| Build | Vite |
| Deployment | Web (MVP: local) |

---

## 9. Frontend is NOT Responsible For

✘ ML training  
✘ Simulation compute  
✘ Race logic  
✘ Telemetry parsing  
✘ Strategy math

Frontend only **visualizes outputs** and **orchestrates requests**.

=======
# Frontend Architecture

## 1. Technology Stack

### Core Framework
*   **React 18**: Component-based UI library.
*   **Vite**: Next-gen build tool (Fast HMR).
*   **TypeScript**: Strict type safety for data models (Telemetry, Drivers).

### Styling & Design System
*   **Tailwind CSS**: Utility-first styling.
*   **Custom Config**: `tailwind.config.js` extended with "Neon Night" palette and custom animations (`scanline`, `glitch`).
*   **CSS Modules**: Used sparingly for complex animations.
*   **Global Effects**: Film Grain (Noise) implemented via `index.css` pseudo-elements.

### Animation & Interaction
*   **Framer Motion**:
    *   **Parallax**: Mouse-driven depth in Hero section.
    *   **Scroll Reveal**: `useInView` triggers for Bento Grid items.
    *   **Layout Transitions**: `AnimatePresence` for mobile menu and page loads.

### Icons & Assets
*   **Lucide React**: Vector icons (sharp, technical feel).
*   **LazyImage**: Custom component for optimized image loading with blur-up effect.
*   **Asset Pipeline**: All static assets hosted in `public/assets/` (structured by `textures`, `backgrounds`, `cars`).

---

## 2. Directory Structure

```
src/
├── components/
│   ├── landing/       # Landing page specific (Hero, Features, Stats)
│   ├── layout/        # Global layout (Header, Footer)
│   ├── ui/            # Reusable primitives (LazyImage, Button)
│   └── loading/       # Loading screens/skeletons
├── pages/             # Route views (Landing, Drivers, Technology)
├── router.tsx         # Route definitions and Lazy Loading
├── index.css          # Global styles (Tailwind + Noise)
└── App.tsx            # Root provider wrapper
```

---

## 3. Key Architectural Decisions

### A. Lazy Loading Strategy
All major pages (`DriversPage`, `TechnologyPage`) are code-split using `React.lazy` and `Suspense`. This ensures the initial bundle size remains small even as we add heavy visual assets to sub-pages.

### B. "Heavy" Asset Handling
Large textures (Noise, Carbon) and Car Renders are loaded natively by the browser from `public/`. We use a custom `LazyImage` wrapper to handle the loading state gracefully, preventing "pop-in" of heavy graphics.

### C. Design Token Centralization
All colors, fonts, and animation curves are defined *once* in `tailwind.config.js`. No magic values in components. This allows for global theming updates (e.g., swapping "Neon Cyan" for "Ferrari Yellow" for a special edition) in a single file.
>>>>>>> 2c436438b203d70c19f4e9029ac974df401817b5
