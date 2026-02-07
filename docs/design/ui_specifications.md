# F1 Intelligence Platform - UI Specifications

## 1. Grid & Layout System

### The "Bento" Philosophy
We move away from traditional "rows" to a **Bento Grid** layout. Everything is a module, a piece of the car logic fitting into a chassis.
*   **Desktop**: 12-column grid.
*   **Cards**: Spanning 4, 6, or 8 columns.
*   **Gap**: standard `gap-6` or `gap-8`.

### Zoning
1.  **HUD Layer** (Top): Fixed, glassmorphic Header.
2.  **Content Layer** (Middle): The scrolling track.
3.  **Background Layer** (Bottom): Fixed textures (`noise`, `fluid-neon`, `dark-poly`).

---

## 2. Component Guidelines

### A. Buttons (`<Button />`)
*   **Primary (Initiate)**:
    *   **Shape**: Skewed `-12deg`.
    *   **Fill**: `bg-white` text `black` (High Vis) OR `bg-f1-red` text `white`.
    *   **Hover**: Neon Glow Shadow `shadow-[0_0_40px_rgba(...)]`.
    *   **Tech Detail**: Corner brackets (border accents) on hover.

### B. Cards (`<FeatureCard />`, `<TeamCard />`)
*   **Base**: `bg-white/[0.02]` or `bg-f1-carbon`.
*   **Border**: `border-white/10` (Inactive) -> `border-neon-cyan/50` (Active/Hover).
*   **Effect**: "Scanline" gradient wipe on hover.
*   **Interaction**: `translate-y-[-5px]` lift on hover (Aerodynamic lift).

### C. Data Inputs
*   **Style**: "Terminal" style.
*   **Background**: `bg-black/50`.
*   **Font**: `Orbitron`.
*   **Focus**: Sharp `neon-cyan` border.

---

## 3. Motion & Interaction

### Global Animation Tokens (Tailwind)
*   `.animate-float-slow`: 8s ease-in-out Y-axis float (Holograms).
*   `.animate-glitch`: 1s linear random X/Y shift (System Errors/Alerts).
*   `.animate-scanline`: 8s linear gradient wipe top-to-bottom.

### Page Transitions
*   **Entrance**: `opacity-0 y-20` -> `opacity-100 y-0`.
*   **Stagger**: 0.1s delay per grid item.

### Parallax
*   **Hero**: Mouse-driven parallax.
    *   Text: Moves *against* mouse.
    *   Holograms: Move *with* mouse (Depth perception).

---

## 4. Accessibility Specs (Dark Mode Primary)

*   **Contrast**: Text MUST use `text-white` (100%) or `text-gray-400` (60%). Avoid `gray-600` on black.
*   **Focus**: Visible `ring-2 ring-neon-cyan` on keyboard focus.
*   **Reduced Motion**: All `animate-` classes must respect `prefers-reduced-motion`.
*   **Images**: All 3D renders must have descriptive `alt` text ("Ferrari 2026 Car side profile").
