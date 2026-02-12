# F1 Intelligence Platform - Agent Dispatch Guide

## Execution Order

```
PHASE 1: RESEARCH (Run ALL at once - independent)
├── Agent 1: Competitor Analyst    ────┐
├── Agent 2: Asset Finder          ────┼── Run simultaneously
├── Agent 3: Branding Agent        ────┤
└── Agent 4: Mock Data Agent       ────┘
           │
           ▼ Wait for all to complete
           
PHASE 2: DESIGN (Run after Phase 1)
├── Agent 5: UI/UX Agent           ────┐
└── Agent 6: Planning Agent        ────┴── Run simultaneously
           │
           ▼ Wait for all to complete
           
PHASE 3: BUILD (Sequential within, but testing parallel)
├── Agent 7: Component Agent      ──── Run first
│       └── Agent 8: Testing Agent ──── Run parallel with each component
│
└── Agent 9: Performance Agent    ──── Run after components done
```

---

## Master Context (Copy this to ALL agents)

```
PROJECT: F1 Race Intelligence System
REPO: c:\Users\shahj\Dev\Personal\F1-Intelligence-Model

TECH STACK:
- Frontend: React 18, TypeScript, Vite, Tailwind CSS
- Animations: Framer Motion, Three.js/@react-three/fiber
- Backend: Python Flask, FastAPI, FastF1
- State: Zustand

DESIGN VISION (APPROVED):
- Theme: Void black (#000000) with elevated surfaces (#111112)
- Accent: F1 Red (#E10600), Neon Orange (#FF8700)
- Style: Cinematic scroll journey, NOT traditional sections
- Typography: Ultra-large bold headlines, staggered word reveals
- Target: 60fps animations, Apple-level scroll polish

HERO COPY (APPROVED):
"RACE INTELLIGENCE REDEFINED"

SCROLL JOURNEY (5 Acts):
1. THE GRID (0%) - 3D car in void, minimal UI
2. THE REVEAL (20%) - Word-by-word text fade-in
3. THE PROOF (40%) - Stats count up (24 Circuits, 20+ Drivers, 2026 Season)
4. THE INTELLIGENCE (60%) - Horizontal scroll cards (PREDICT · SIMULATE · ANALYZE)
5. THE BROADCAST (80%) - Live timing tower animation
6. THE GRID CALL (100%) - "Lights Out" CTA

FEATURES (FREE):
- Race Outcome Predictor, Championship Simulator
- Driver vs Driver, Constructor vs Constructor
- Live Standings, Race Week Hub

FEATURES (PREMIUM):
- Lap Time Predictor, Strategy Optimizer
- Sandbox Mode, Historic Data Viewer
- Safety Car Probability

KEY DIRECTORIES:
- Frontend: frontend/src/
- Components: frontend/src/components/
- 3D Assets: 3D-model-and-references/
- Public: frontend/public/assets/
- Docs: docs/
- Design Vision: docs/design/landing_page_vision.md

REFERENCE INSPIRATIONS:
- Lando Norris (landonorris.com) - Awwwards SOTD 8.18/10
- Apple Vision Pro - Scroll text reveals
- F1 TV Broadcast - Timing tower patterns

3D MODELS AVAILABLE:
- mclaren_mp45_2k.glb (37MB - needs optimization)
- Meshy_AI_Neon_Velocity.glb (15MB)
```

---

## PHASE 1 AGENTS (Run All Simultaneously)

### Agent 1: Competitor Analyst
**Run First: YES (Phase 1)**
**Dependencies: None**

```
ROLE: Competitor Analyst for F1 Intelligence Platform

MASTER CONTEXT:
[PASTE MASTER CONTEXT HERE]

YOUR TASK:
Research F1 analytics competitors and document their features, UI patterns, and gaps we can exploit.

COMPETITORS TO ANALYZE:
1. F1TV (f1tv.formula1.com)
2. TracingInsights (tracinginsights.com)
3. F1Dash (f1-dash.com)
4. OpenF1 API (openf1.org)
5. Pitwall (pitwall.app)

MCP SERVERS TO USE:
- firecrawl: Use firecrawl_scrape to get each competitor's homepage
- exa: Use web_search_exa for additional market research

FOR EACH COMPETITOR, DOCUMENT:
1. Core features list
2. UI patterns (timing tower style, chart types, colors)
3. Pricing model
4. What they do better than us
5. Gaps we can exploit

OUTPUT:
Create a file at: docs/research/competitor_analysis_v2.md
Include a summary table and detailed notes per competitor.

WHEN DONE:
Report findings and key differentiators we should focus on.
```

---

### Agent 2: Asset Finder
**Run First: YES (Phase 1)**
**Dependencies: None**

```
ROLE: Asset Finder for F1 Intelligence Platform

MASTER CONTEXT:
[PASTE MASTER CONTEXT HERE]

YOUR TASK:
Find and document high-quality F1 assets (3D models, images, fonts, icons).

ASSETS NEEDED:
1. 3D F1 car models (.glb format, <5MB optimized)
2. Circuit track images (4K, dark theme compatible)
3. Driver helmet renders (transparent PNG)
4. Team logos (all 11 constructor teams)
5. F1-style fonts (free alternatives)
6. Telemetry/racing icons

MCP SERVERS TO USE:
- exa: Search for "F1 car 3D model GLB free download"
- firecrawl: Scrape Sketchfab.com for F1 models

SOURCES TO CHECK:
- Sketchfab (3D models)
- TurboSquid (3D models)
- Unsplash/Pexels (photos)
- Google Fonts (fonts like Orbitron, Titillium Web)
- Lucide/Heroicons (icons)

OUTPUT FORMAT:
Create a file at: docs/assets/asset_inventory.md

| Asset | Type | Source URL | License | Size | Download Instructions |
|-------|------|------------|---------|------|----------------------|

NOTES:
- Prioritize assets with commercial-friendly licenses
- For 3D models, prefer ones already optimized/low-poly
- Night race and Monaco images work best with our dark theme

WHEN DONE:
Report top 5 assets found that we should download immediately.
```

---

### Agent 3: Branding Agent
**Run First: YES (Phase 1)**
**Dependencies: None**

```
ROLE: Branding Agent for F1 Intelligence Platform

MASTER CONTEXT:
[PASTE MASTER CONTEXT HERE]

YOUR TASK:
Define the complete brand identity and design tokens for the platform.

BRAND VALUES:
- Precision (F1 engineering accuracy)
- Speed (performance-first design)
- Intelligence (AI/ML powered insights)
- Premium (high-end SaaS aesthetic)

DELIVERABLES:

1. COLOR PALETTE
- Primary backgrounds (void, primary, secondary)
- Glass effects (blur, opacity, border colors)
- Accent colors (F1 red, supporting colors)
- Status colors (fastest lap purple, personal best green)
- Team color reference table (all 11 teams)

2. TYPOGRAPHY SCALE
- Display font (headlines) - suggest specific Google Font
- Body font (paragraphs) - suggest specific Google Font
- Mono font (timing data) - suggest specific Google Font
- Size scale (xs, sm, base, lg, xl, 2xl, etc.)

3. SPACING & SIZING
- Base unit (8px grid)
- Component spacing guidelines
- Responsive breakpoints

4. GLASS EFFECT PARAMETERS
- Background blur amount
- Background opacity
- Border opacity
- Border radius values

5. MOTION DESIGN
- Easing functions (spring configs)
- Duration guidelines (micro, normal, page)
- Stagger amounts for lists

OUTPUT:
Create a file at: docs/design/brand_guidelines.md
Include CSS custom properties that can be copy-pasted into index.css

WHEN DONE:
Provide the complete CSS :root variables block.
```

---

### Agent 4: Mock Data Agent
**Run First: YES (Phase 1)**
**Dependencies: None**

```
ROLE: Mock Data Agent for F1 Intelligence Platform

MASTER CONTEXT:
[PASTE MASTER CONTEXT HERE]

YOUR TASK:
Create TypeScript interfaces and mock data matching FastF1 structure.

MCP SERVERS TO USE:
- context7: Query fastf1 documentation for data structures
- f1-intelligence-docs: Check existing project patterns

DATA STRUCTURES NEEDED:

1. DRIVER DATA
interface Driver {
  code: string;        // "VER", "HAM"
  firstName: string;
  lastName: string;
  number: number;
  team: string;
  teamColor: string;   // hex color
  nationality: string;
  headshotUrl?: string;
}

2. CIRCUIT DATA
interface Circuit {
  id: string;
  name: string;
  country: string;
  length: number;      // km
  turns: number;
  lapRecord: string;
  lapRecordHolder: string;
}

3. LAP DATA
interface Lap {
  lapNumber: number;
  driver: string;
  lapTime: number;     // milliseconds
  sector1: number;
  sector2: number;
  sector3: number;
  compound: 'SOFT' | 'MEDIUM' | 'HARD' | 'INTER' | 'WET';
  tyreLife: number;
  position: number;
  gap: number;
}

4. STANDINGS DATA
interface DriverStanding {
  position: number;
  driver: string;
  team: string;
  points: number;
  wins: number;
}

FILES TO CREATE:
- frontend/src/types/f1.ts (all interfaces)
- frontend/src/mocks/drivers.ts (2025 grid, all 20 drivers)
- frontend/src/mocks/circuits.ts (all 24 circuits)
- frontend/src/mocks/standings.ts (sample standings)
- frontend/src/mocks/factory.ts (functions to generate random lap data)

WHEN DONE:
Report the file paths created and confirm TypeScript compiles without errors.
```

---

## PHASE 2 AGENTS (Run After Phase 1 Complete)

> **IMPORTANT:** Phase 1 has created essential foundation files. Phase 2 agents MUST read these first.

### 📁 Phase 1 Output Files (Use These!)

| File | Created By | Use For |
|------|------------|---------|
| `docs/research/competitor_analysis_v2.md` | Competitor Analyst | UI patterns, feature gaps |
| `docs/assets/asset_inventory.md` | Asset Finder | 3D models, fonts, icons |
| `docs/design/brand_guidelines.md` | Branding Agent | Colors, typography, animations, CSS variables |
| `docs/design/landing_page_vision.md` | (Pre-existing) | Scroll journey design |
| `frontend/src/types/f1.ts` | Mock Data Agent | TypeScript interfaces |
| `frontend/src/mocks/*.ts` | Mock Data Agent | Driver/circuit/standings data |

---

### Agent 5: UI/UX Agent
**Run: After Phase 1**
**Dependencies: Branding Agent, Asset Finder, Competitor Analyst outputs**

```
ROLE: UI/UX Agent for F1 Intelligence Platform

MASTER CONTEXT:
[PASTE MASTER CONTEXT HERE]

═══════════════════════════════════════════════════════════════════════
CRITICAL: READ THESE FILES FIRST (Phase 1 Outputs)
═══════════════════════════════════════════════════════════════════════

1. docs/design/brand_guidelines.md
   - Contains ALL CSS variables, colors, typography, motion configs
   - Has Framer Motion spring presets ready to use
   - Copy the :root CSS block into your specs

2. docs/design/landing_page_vision.md
   - Contains the 5-act scroll journey design
   - Hero copy: "RACE INTELLIGENCE REDEFINED"
   - Section breakdown with ASCII mockups

3. docs/assets/asset_inventory.md
   - Lists available 3D models (use f1_2022_generic.glb - smallest at 13MB)
   - Font recommendations (Orbitron, Rajdhani, Inter, JetBrains Mono)
   - Icon library (Lucide React installed)

4. docs/research/competitor_analysis_v2.md
   - UI patterns from F1TV, TracingInsights
   - Timing tower design patterns
   - Features to differentiate from competitors

═══════════════════════════════════════════════════════════════════════
MCP SERVERS & SKILLS TO USE
═══════════════════════════════════════════════════════════════════════

- context7: REQUIRED
  1. First call: resolve-library-id for "framer-motion"
  2. Then query-docs: "useScroll useTransform scroll animations"
  3. First call: resolve-library-id for "react-three-fiber"
  4. Then query-docs: "Canvas camera controls lighting setup"

- firecrawl: OPTIONAL
  - If you need more inspiration, scrape landonorris.com for patterns

═══════════════════════════════════════════════════════════════════════
YOUR TASK
═══════════════════════════════════════════════════════════════════════

Create detailed UI specifications for the 5-act scroll journey components.

COMPONENTS TO SPECIFY (Match the landing_page_vision.md):

1. THE GRID (0% scroll) - Hero Section
   - 3D car placement (centered, floating in void)
   - Mouse-reactive rotation (use brand_guidelines.md spring configs)
   - Minimal text: "APEX" logo only
   - "Scroll to ignite" indicator with subtle animation

2. THE REVEAL (20% scroll) - Text Reveal
   - word-by-word fade-in: "RACE INTELLIGENCE REDEFINED"
   - Use clamp(3rem, 15vw, 10rem) for text size
   - Stagger: 150ms per word (from brand_guidelines.md)

3. THE PROOF (40% scroll) - Stats Section
   - 3 stat cards: "24 CIRCUITS", "20+ DRIVERS", "2026 SEASON"
   - CountUp animation from 0 to final value
   - Glass card styling from brand_guidelines.md

4. THE INTELLIGENCE (60% scroll) - Horizontal Cards
   - 3 feature cards: PREDICT · SIMULATE · ANALYZE
   - Sticky section with horizontal scroll on vertical scroll
   - Card scale animation on enter

5. THE BROADCAST (80% scroll) - Timing Tower
   - Live simulation preview styled like F1 TV
   - Animated position bars
   - Use team colors from brand_guidelines.md

6. THE GRID CALL (100% scroll) - CTA
   - "LIGHTS OUT AND AWAY WE GO"
   - Glowing CTA button with F1 red (#E10600)
   - Pulse animation

FOR EACH COMPONENT INCLUDE:
- Exact dimensions (desktop/tablet/mobile)
- CSS properties (reference brand_guidelines.md variables)
- Framer Motion animation config (use springs from brand_guidelines.md)
- Accessibility notes (ARIA labels, keyboard navigation)

OUTPUT:
Create: docs/design/ui_specifications.md

WHEN DONE:
Report the key scroll trigger points and animation timings.
```

---

### Agent 6: Planning Agent  
**Run: After Phase 1**
**Dependencies: Mock Data Agent types, Brand Guidelines**

```
ROLE: Planning Agent for F1 Intelligence Platform

MASTER CONTEXT:
[PASTE MASTER CONTEXT HERE]

═══════════════════════════════════════════════════════════════════════
CRITICAL: READ THESE FILES FIRST (Phase 1 Outputs)
═══════════════════════════════════════════════════════════════════════

1. frontend/src/types/f1.ts
   - Contains ALL TypeScript interfaces
   - Driver, Circuit, Lap, TelemetryPoint, etc.
   - Utility functions: formatLapTime, formatGap

2. frontend/src/mocks/drivers.ts
   - 2025 driver grid (20 drivers)
   - Team colors, driver codes
   - Helper: getDriverByCode(), getDriversByTeam()

3. frontend/src/mocks/circuits.ts
   - All 24 circuits with lap records
   
4. frontend/src/mocks/factory.ts
   - Data generators: generateLap(), generateTelemetry()
   - Use these for simulation previews

5. docs/design/brand_guidelines.md
   - Animation configs (springs, durations, stagger)
   - Will need shared animation variants

6. docs/design/landing_page_vision.md
   - Component structure for 5-act scroll journey

═══════════════════════════════════════════════════════════════════════
MCP SERVERS & SKILLS TO USE
═══════════════════════════════════════════════════════════════════════

- context7: REQUIRED
  1. resolve-library-id for "react-three-fiber" 
  2. query-docs: "Canvas Suspense loading 3D models useGLTF"
  3. resolve-library-id for "framer-motion"
  4. query-docs: "useScroll useTransform sticky scroll animations"
  5. resolve-library-id for "zustand"
  6. query-docs: "create store TypeScript"

- f1-intelligence-docs: OPTIONAL
  - Check existing project patterns if needed

═══════════════════════════════════════════════════════════════════════
YOUR TASK
═══════════════════════════════════════════════════════════════════════

Create the component architecture for the landing page rebuild.

COMPONENT TREE (Match landing_page_vision.md 5-act structure):

```
LandingPage
├── ScrollProgress (Framer Motion useScroll provider)
│
├── Act 1: TheGrid (0% scroll)
│   ├── F1Scene (R3F Canvas)
│   │   ├── HeroF1Car (useGLTF for f1_2022_generic.glb)
│   │   ├── SceneLighting (3-point setup)
│   │   └── CameraController (mouse-reactive)
│   └── ScrollIndicator
│
├── Act 2: TheReveal (20% scroll)
│   └── ScrollTextReveal
│       └── AnimatedWord (x4 words)
│
├── Act 3: TheProof (40% scroll)
│   ├── StatCard (x3)
│   └── CountUpNumber
│
├── Act 4: TheIntelligence (60% scroll) 
│   └── HorizontalScrollCards
│       ├── FeatureCard ("Predict")
│       ├── FeatureCard ("Simulate")  
│       └── FeatureCard ("Analyze")
│
├── Act 5: TheBroadcast (80% scroll)
│   └── LiveTimingTower
│       ├── TimingRow (x5 drivers)
│       └── GapBar
│
└── Act 6: TheGridCall (100% scroll)
    ├── LightsOutText
    └── GlowCTA
```

FILE STRUCTURE TO CREATE:

```
frontend/src/
├── components/
│   ├── landing/
│   │   ├── LandingPage.tsx
│   │   ├── TheGrid.tsx
│   │   ├── TheReveal.tsx
│   │   ├── TheProof.tsx
│   │   ├── TheIntelligence.tsx
│   │   ├── TheBroadcast.tsx
│   │   └── TheGridCall.tsx
│   ├── 3d/
│   │   ├── F1Scene.tsx
│   │   ├── HeroF1Car.tsx
│   │   ├── SceneLighting.tsx
│   │   └── CameraController.tsx
│   ├── ui/
│   │   ├── GlassCard.tsx
│   │   ├── GlowButton.tsx
│   │   ├── CountUpNumber.tsx
│   │   └── ScrollTextReveal.tsx
│   └── timing/
│       ├── LiveTimingTower.tsx
│       ├── TimingRow.tsx
│       └── GapBar.tsx
├── lib/
│   ├── animations.ts (shared Framer Motion variants)
│   └── springs.ts (from brand_guidelines.md)
├── hooks/
│   ├── useMousePosition.ts
│   └── useScrollProgress.ts
└── stores/
    └── landingStore.ts (Zustand for scroll state)
```

FOR EACH COMPONENT DEFINE:
1. Props interface (use types from f1.ts where applicable)
2. State requirements
3. Animation variant to use (from animations.ts)
4. Dependencies (other components, hooks)

SHARED ANIMATION VARIANTS (animations.ts):
- fadeIn, fadeInUp, fadeInScale
- staggerContainer, staggerChildren
- scrollReveal (opacity tied to scroll)
- countUp (for numbers)

HOOKS TO CREATE:
1. useMousePosition - Returns normalized {x, y} for 3D interaction
2. useScrollProgress - Wraps Framer Motion useScroll for easier use
3. useSectionInView - Intersection observer for triggering animations

OUTPUT:
Create: docs/planning/component_architecture.md

Include:
- Full component tree diagram
- File paths for each component
- Props interfaces
- Build order (dependencies first)
- Animation variant assignments

WHEN DONE:
Report the exact build order for Phase 3 Component Agent.
```

---

## PHASE 3 AGENTS (Run After Phase 2 Complete)

> **IMPORTANT:** Phase 2 has provided the BLUEPRINT. You are the BUILDERS. Do not deviate from the architecture without good reason.

### 📁 Phase 2 Output Files (Use These!)

| File | Created By | Use For |
|------|------------|---------|
| `docs/planning/component_architecture.md` | Planning Agent | **The Bible.** Follow file structure & build order EXACTLY. |
| `docs/design/ui_specifications.md` | UI/UX Agent | **The Look.** CSS variables, Framer Motion configs, 6-Act structure. |
| `docs/design/brand_guidelines.md` | Branding Agent | Color tokens, fonts (already in tailwind.css). |
| `frontend/src/types/f1.ts` | Phase 1 | TypeScript interfaces for data. |

---

### Agent 7: Component Agent
**Run: After Phase 2**
**Dependencies: Architecture & UI Specs**

```
ROLE: Component Agent for F1 Intelligence Platform

MASTER CONTEXT:
[PASTE MASTER CONTEXT HERE]

═══════════════════════════════════════════════════════════════════════
CRITICAL: READ THESE FILES FIRST
═══════════════════════════════════════════════════════════════════════

1. docs/planning/component_architecture.md
   - This contains the EXACT BUILD ORDER (Phases 3A - 3F)
   - Do not skip the "Foundation" phase (springs/animations/stores)
   - Follow the folder structure: components/landing, components/3d, etc.

2. docs/design/ui_specifications.md
   - Contains the CSS for the "6-Act Scroll Journey"
   - Use the specific Framer Motion variants defined here

═══════════════════════════════════════════════════════════════════════
MCP SERVERS & SKILLS TO USE
═══════════════════════════════════════════════════════════════════════

- context7: REQUIRED
  1. resolve-library-id for "framer-motion" -> query-docs: "AnimatePresence useScroll variants"
  2. resolve-library-id for "react-three-fiber" -> query-docs: "Canvas useFrame"
  3. resolve-library-id for "zustand" -> query-docs: "create store"

- view_code_item: Use this to check "frontend/src/types/f1.ts" when you need interface details.

═══════════════════════════════════════════════════════════════════════
YOUR TASK: EXECUTE THE BUILD PLAN
═══════════════════════════════════════════════════════════════════════

Follow the "Build Order" table in component_architecture.md EXACTLY.

PHASE 3A: FOUNDATION (Must be first!)
1. lib/springs.ts & lib/animations.ts (Copy from specs)
2. stores/landingStore.ts (Zustand state)
3. hooks/useMousePosition.ts & hooks/useScrollProgress.ts

PHASE 3B: UI PRIMITIVES
4. GlassCard.tsx, GlowButton.tsx, CountUpNumber.tsx, ScrollTextReveal.tsx

PHASE 3C: 3D SCENE (React Three Fiber)
5. F1Scene.tsx and children (HeroF1Car, etc.)
   - IMPORTANT: functional components only, handle Suspense properly.

PHASE 3D & 3E: TIMING TOWER & ACT SECTIONS
6. Build components for Acts 1-6 (TheGrid -> TheGridCall)

PHASE 3F: PAGE ASSEMBLY
7. LandingPage.tsx (The orchestrator)

RULES:
- **TypeScript Strictness:** No `any`. Use interfaces from `f1.ts`.
- **Motion:** Use shared variants from `animations.ts`.
- **Styling:** Use Tailwind utility classes + CSS variables from `ui_specifications.md`.
- **Validation:** After each file, run a quick syntax check if possible.

OUTPUT:
Create all component files.

WHEN DONE:
Confirm all files exist and `npm run build` passes.
```

---

### Agent 8: Testing Agent
**Run: Parallel with Component Agent**
**Dependencies: Component Agent's work**

```
ROLE: Testing Agent for F1 Intelligence Platform

MASTER CONTEXT:
[PASTE MASTER CONTEXT HERE]

═══════════════════════════════════════════════════════════════════════
CRITICAL: READ THESE FILES FIRST
═══════════════════════════════════════════════════════════════════════

1. docs/design/ui_specifications.md
   - You are testing against these specs.
   - Verify: Does The Grid (Act 1) look like the layout?
   - Verify: Does the text reveal happen at 20% scroll?

2. docs/planning/component_architecture.md
   - Verify the component tree structure matches.

═══════════════════════════════════════════════════════════════════════
MCP SERVERS & SKILLS TO USE
═══════════════════════════════════════════════════════════════════════

- browser_subagent: REQUIRED
  - Use this to visually verify the localhost:5173 page
  - Take screenshots of each "Act" (0%, 20%, 40%, etc.)
  - Check Console for React hydration errors

═══════════════════════════════════════════════════════════════════════
YOUR TASK: CONTINUOUS VERIFICATION
═══════════════════════════════════════════════════════════════════════

Monitor the Component Agent's progress. As they finish a section, test it.

TESTING CHECKLIST (The 6 Acts):

1. ACT 1: THE GRID
   - [ ] 3D Car loads? (Check network tab for .glb 404s)
   - [ ] Mouse movement rotates car?
   - [ ] No WebGL context loss?

2. ACT 2: THE REVEAL
   - [ ] "RACE INTELLIGENCE REDEFINED" reveals word-by-word?
   - [ ] Sticky positioning works?

3. ACT 3: THE PROOF
   - [ ] Stats count up from 0?
   - [ ] Glass card blur effect renders?

4. ACT 4: THE INTELLIGENCE
   - [ ] Horizontal scroll triggers correctly on vertical scroll?
   - [ ] Cards snap/scale correctly?

5. ACT 5: THE BROADCAST
   - [ ] Timing tower shows 5 drivers?
   - [ ] Team colors match brand guidelines (Red Bull blue, Ferrari red)?

6. ACT 6: THE GRID CALL
   - [ ] CTA button pulses?

HOW TO TEST:
1. Wait for `LandingPage.tsx` to be assembled.
2. `npm run dev` in background.
3. Use `browser_subagent` to scroll through the full journey.
4. Check FPS performance (is it choppy?).

OUTPUT:
Create: docs/testing/phase3_verification_report.md
Include screenshots of every section.

WHEN DONE:
Pass/Fail status for the entire landing page.
```

---

### Agent 9: Performance Optimizer
**Run: After All Components Built & Verified**
**Dependencies: Verified Landing Page**

```
ROLE: Performance Optimizer for F1 Intelligence Platform

MASTER CONTEXT:
[PASTE MASTER CONTEXT HERE]

═══════════════════════════════════════════════════════════════════════
YOUR TASK: 60FPS TUNING
═══════════════════════════════════════════════════════════════════════

1. 3D OPTIMIZATION
   - Check if `useGLTF` is preloading correctly
   - Implement `dpr={[1, 2]}` in Canvas to cap pixel ratio
   - Reduce polygon count logic (if we didn't use the low-poly model)

2. BUNDLE SIZE
   - Run `npm run build` and analyze `dist/index.html` chunks
   - Check if large libraries (Three.js) are code-split

3. REACT PERFORMANCE
   - Identify re-renders in `useScroll` listeners
   - Wrap 3D components in `React.memo` where static

OUTPUT:
Create optimization report at: docs/testing/performance_report.md
```

---

## Quick Reference: What to Run When

| Order | Agent | Can Run With | Wait For |
|-------|-------|--------------|----------|
| 1 | Competitor Analyst | 2, 3, 4 | Nothing |
| 1 | Asset Finder | 1, 3, 4 | Nothing |
| 1 | Branding Agent | 1, 2, 4 | Nothing |
| 1 | Mock Data Agent | 1, 2, 3 | Nothing |
| 2 | UI/UX Agent | 6 | Phase 1 done |
| 2 | Planning Agent | 5 | Phase 1 done |
| 3 | Component Agent | 8 | Phase 2 done |
| 3 | Testing Agent | 7 | Each component |
| 4 | Performance Agent | - | Phase 3 done |

---

## How to Launch Agents

1. **Open new agent instance** (Ctrl+Shift+P → "New Chat")
2. **Copy the MASTER CONTEXT** first
3. **Paste the specific agent prompt**
4. **Let it run**
5. **Check output file when done**

For Phase 1: Open 4 new agent chats simultaneously
For Phase 2: Open 2 new agent chats after Phase 1 completes
For Phase 3: Open Component Agent first, then Testing Agent to run alongside
