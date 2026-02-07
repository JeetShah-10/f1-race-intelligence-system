# F1 Intelligence Platform - Brand Guidelines

## 1. Visual Identity Philosophy: "The Night Race"
The visual identity of the F1 Intelligence Platform is built on the concept of **"The Night Race"**. It captures the high-stakes atmosphere of a Formula 1 Grand Prix under floodlights—high contrast, vibrant neons, sharp reflections, and deep shadows. It is not just a tool; it is a cockpit.

**Keywords**: *Cinematic, Precision, Speed, Neon, Forged Carbon, Holographic.*

---

## 2. Color Palette: "Neon Night"

### Primary Colors
| Color Name | Hex Code | Utility Class | Usage |
| :--- | :--- | :--- | :--- |
| **Obsidian** | `#0A0A0A` | `bg-f1-dark` | Main background. Deep, pure black to minimize OLED power and maximize contrast. |
| **F1 Red** | `#E10600` | `text-f1-red` | Primary Action, Alerts, "Race Mode". The color of passion and danger. |
| **Neon Cyan** | `#00F0FF` | `text-neon-cyan` | Data, Telemetry, Intelligence. Represents the "Electric" aspect of hybrid power. |

### Secondary Colors
| Color Name | Hex Code | Utility Class | Usage |
| :--- | :--- | :--- | :--- |
| **Sector Purple** | `#BC13FE` | `text-neon-purple` | Sector 3/Fastest Lap. Used for advanced analytics and special features. |
| **Soft Yellow** | `#FFE600` | `text-neon-yellow` | Tire degradation, warnings, "Soft Tire" compound indicator. |
| **Carbon Base** | `#151515` | `bg-f1-carbon` | Card backgrounds, lighter than Obsidian to create depth. |

### Gradients
-   **Hero Glow**: `from-f1-dark via-f1-red/20 to-transparent`
-   **Neon Streak**: `from-neon-cyan via-white to-neon-purple`

---

## 3. Typography

### Display Font: **Racing Sans One**
*   **Usage**: Hero Headlines, Giant Watermarks, Section Titles.
*   **Characteristics**: Wide, aggressive, slanted. "Fast even when standing still."
*   **Token**: `font-racing`

### Data Font: **Orbitron**
*   **Usage**: Telemetry numbers, countdowns, technical specs.
*   **Characteristics**: Monospace-feel, sci-fi, geometric.
*   **Token**: `font-stats`

### Body Font: **Inter**
*   **Usage**: Paragraphs, UI Labels, Explanations.
*   **Characteristics**: Clean, highly legible, neutral to let the display fonts shine.
*   **Token**: `font-body`

---

## 4. Materials & Textures

### Forged Carbon
*   **Asset**: `/assets/textures/carbon-forged.png`
*   **Usage**: Headers, Card Backgrounds, Important UI Containers.
*   **Feeling**: Exclusive, expensive, high-performance material.

### Film Grain (Noise)
*   **Asset**: `/assets/textures/noise-overlay.png`
*   **Implementation**: Global CSS overlay at 5% opacity (`mix-blend-overlay`).
*   **Reason**: Adds a "Cinematic/Print" fidelity that prevents the UI from looking flat.

### Glassmorphism (Aerodynamic Glass)
*   **Class**: `bg-white/5 backdrop-blur-md border-white/10`
*   **Usage**: Floating UI elements (Holograms), Modals, HUDs.

---

## 5. Imagery & Assets

### Hero Visuals
*   **Composition**: Asymmetrical "Poster Style".
*   **Elements**: High-fidelity 3D car renders, floating parallax holograms, fluid neon backgrounds.

### Iconography
*   **Library**: `Lucide React`
*   **Style**: Thin stroke (1.5px), sharp edges.
*   **Color**: Often enclosed in a colored glass container matching the section theme.
