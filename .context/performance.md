# F1 Race Intelligence - 60 FPS Performance Guide

## Core Principle
Every animation, transition, and UI update must complete within 16.67ms to maintain a fluid 60 FPS experience on consumer devices.

---

## Animation Rules (GPU vs. CPU)

### ⚡ GPU-Accelerated Properties (Always Use)
- `transform` (translates, scales, rotations)
- `opacity`
- `filter` (blurs, brightness adjustments)

### ⚠️ CPU-Heavy Properties (Never Animate Directly)
- `width` / `height` (triggers layout reflows)
- `top` / `left` / `right` / `bottom` (use `translate` instead)
- `margin` / `padding` / `border-radius`

---

## React Component Optimization
- **Memoization:** Wrap compute-intensive or nested UI components in `React.memo()`.
- **Reference Stability:** Memoize expensive calculations with `useMemo()` and callback handlers with `useCallback()` to prevent unnecessary child re-renders.
- **List Virtualization:** For long telemetry lists or large datasets, use virtualization patterns (such as `react-window`) to only render visible items.

---

## Asset Loading Guidelines

### 1. Images & Background Videos
- **Image Formats:** Serve images in WebP format with `loading="lazy"` for below-fold content. Define dimensions explicitly to prevent Cumulative Layout Shift (CLS).
- **Video Optimization:** Preload metadata only (`preload="metadata"`). Set static placeholder posters and declare `playsInline muted loop` to ensure autoplay compatibility.

### 2. 3D Elements (Three.js / React Three Fiber)
- **Model Formats:** Use GLTF models compressed with Draco compression.
- **Instancing:** Render repeated track details or cars using `instancedMesh` to reduce draw calls.
- **Memory Hygiene:** Dispose of unused geometries, materials, and textures on component unmount to prevent GPU memory leaks.

---

## Bundle size Targets

- **Initial Javascript Bundle:** < 200KB. Route-based code-splitting is mandatory.
- **Initial CSS Stylesheet:** < 50KB. Purge unused styles.
- **Asset Overhead:** < 2MB total assets. Compress designs and scale images appropriately.

---

## Diagnostic & Audit Commands
- **Bundle Analysis:** Run build analyzer plugins (`npm run build -- --report`) to detect heavy node modules.
- **Scrolling Performance:** Use DevTools Performance Panel to record scroll frames and identify paint bottlenecks.
- **Lighthouse Audits:** Generate local performance profiles using `npx lighthouse` to evaluate LCP, FID, and CLS scores.
