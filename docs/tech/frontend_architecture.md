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
