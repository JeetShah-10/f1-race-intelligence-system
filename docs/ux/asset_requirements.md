# F1 Intelligence Platform - Asset Requirements & Animation Design

## Reference Video Analysis
**Video:** "How I vibecode Beautiful $10,000 AI Websites (AntiGravity)" by Jack Roberts
**Style:** Premium SaaS "Vibe" aesthetic - dark themes, glassmorphism, neon accents, cinematic scroll animations

---

## Assets You Should Add

### 1. 🎥 Hero Videos (Critical)

| Asset | Format | Resolution | Duration | Source |
|-------|--------|------------|----------|--------|
| **F1 Car Hero Loop** | WebM + MP4 | 4K 60fps | 5-8s | Official F1 footage or generated |
| **Pit Stop Sequence** | WebM | 1080p 60fps | 3-5s | F1TV clips |
| **Race Start Grid** | WebM | 4K 30fps | 5-10s | F1TV/YouTube |
| **Onboard Camera** | WebM | 1080p 60fps | 5-8s | F1TV driver onboards |
| **Night Race** (Singapore/Vegas) | WebM | 4K | 8-10s | Perfect for dark theme |

### 2. 🏎️ 3D Models (Essential)

| Asset | Format | Size Limit | Usage |
|-------|--------|------------|-------|
| **2024/2025 F1 Car** | GLB/GLTF | <5MB | Hero section, interactive |
| **Steering Wheel** | GLB | <2MB | Telemetry page |
| **Pit Crew Set** | GLB | <3MB | Strategy page |
| **Tire/Compound Models** | GLB | <1MB each | Tyre strategy widget |

**Source Options:**
- Sketchfab (many free F1 models)
- TurboSquid
- CGTrader
- Blender Market

### 3. 🖼️ High-Resolution Images

| Category | Assets Needed | Format |
|----------|---------------|--------|
| **Circuits** (missing) | Madrid, Las Vegas night, Japanese GP | WebP 4K |
| **Team Liveries 2026** | All 11 teams, transparent PNG | WebP |
| **Driver Portraits** | All 22 drivers, consistent style | WebP, 500x600 |
| **Helmets** | All drivers, detailed close-up | PNG transparent |
| **Tyre Compounds** | Soft, Medium, Hard, Intermediate, Wet | SVG icons |

### 4. 🎨 UI Assets

| Asset | Description |
|-------|-------------|
| **Neon Icons** | Engine, Aero, Tyre, Strategy, Pit, Weather |
| **Team Color Swatches** | All 11 team brand colors |
| **Circuit Track SVGs** | All 24 circuits as vector paths |
| **Timing Tower Graphics** | P1-P20 position badges |
| **Sector Indicators** | S1, S2, S3 colored indicators |

### 5. 🎵 Audio (Optional Enhancement)

| Asset | Usage |
|-------|-------|
| F1 engine sound loop | Hero background (muted by default) |
| Radio chatter samples | Simulation dramatic moments |
| Pit stop sounds | Strategy visualization |

---

## Animation Design for Landing Page

Based on the AntiGravity style, here's what would suit F1 Intelligence:

### Hero Section - "The Grid"
```
┌─────────────────────────────────────────────────────────────┐
│  ╭────────────────────────────────────────────────────────╮ │
│  │     [3D F1 Car - Floating + Mouse-Reactive]            │ │
│  │                                                         │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │ │
│  │  │ 📊 324 km/h │  │ ⏱️ 1:19.4  │  │ 🔥 +0.234  │     │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │ │
│  │       ↑ Floating glassmorphic stat cards                │ │
│  ╰────────────────────────────────────────────────────────╯ │
│                                                              │
│        F1 RACE INTELLIGENCE                                  │
│        ─────────────────────                                 │
│        AI-Powered Predictions | Live Simulation              │
│                                                              │
│        [Enter the Grid] ← Glowing CTA button                 │
└─────────────────────────────────────────────────────────────┘
```

### Key Animations

| Element | Animation | Framer Motion |
|---------|-----------|---------------|
| **3D Car** | Floating Y + rotation on hover | `useMotionValue`, `useTransform` |
| **Stat Cards** | Staggered fade-in + slide-up | `stagger: 0.1` variants |
| **Background** | Speed lines / particle flow | Canvas or CSS `@keyframes` |
| **CTA Button** | Pulse glow + scale on hover | `whileHover: { scale: 1.05 }` |
| **Scroll Arrow** | Bounce animation | `animate: { y: [0, 10, 0] }` |

### Telemetry Section - "The Data Stream"
```
On scroll into view:
1. Telemetry line charts "draw" themselves left-to-right
2. Driver cards slide in from sides
3. Numbers count up to final values
4. Glow effects pulse on data points
```

### Race Simulation Section - "The Broadcast"
```
┌─────────────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║  LIVE SIMULATION                         LAP 45/52   ║  │
│  ╠═══════════════════════════════════════════════════════╣  │
│  ║                                                       ║  │
│  ║   VER  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■  +0.0s      ║  │
│  ║   NOR  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■    +2.4s      ║  │
│  ║   LEC  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■      +5.8s      ║  │
│  ║   HAM  ■■■■■■■■■■■■■■■■■■■■■■■■■■        +8.2s      ║  │
│  ║                                                       ║  │
│  ╚═══════════════════════════════════════════════════════╝  │
│                                                              │
│    Gap bars animate live as race progresses                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Color Palette (F1 + Premium Vibe)

```css
:root {
  /* Backgrounds */
  --bg-primary: #0B0D10;      /* Near black */
  --bg-secondary: #141820;     /* Dark gray-blue */
  --bg-glass: rgba(255,255,255,0.05);
  
  /* Accents */
  --f1-red: #E10600;
  --neon-cyan: #00D2BE;        /* Teal accent */
  --neon-purple: #8B5CF6;      /* Purple glow */
  --gold: #FFD700;             /* Winner/highlight */
  
  /* Team Colors (for branding) */
  --ferrari: #DC0000;
  --redbull: #0600EF;
  --mercedes: #00D2BE;
  --mclaren: #FF8700;
}
```

---

## Implementation Priority

### Phase 1 (This Week)
1. [ ] Get 2-3 premium F1 videos (you can provide copyrighted)
2. [ ] Download 3D F1 car model from Sketchfab
3. [ ] Create neon icon set (Engine, Aero, Tyre)
4. [ ] Build floating animation for hero

### Phase 2 (Next Week)
1. [ ] Implement telemetry "draw" animation
2. [ ] Add race gap bar animation
3. [ ] Mouse-reactive 3D car movement
4. [ ] Scroll-triggered section reveals

---

## Quick Asset Sources

| Type | Free | Premium |
|------|------|---------|
| 3D Models | Sketchfab, Free3D | TurboSquid, CGTrader |
| Videos | F1 YouTube clips | F1TV subscription |
| Images | Unsplash "motorsport" | Getty Images F1 |
| Icons | Lucide, Heroicons | Custom via Figma |
| Fonts | Google Fonts | Licensed F1 font family |
