# F1 Intelligence — Component Architecture

> **Version:** 1.0  
> **Created:** January 2026  
> **Purpose:** Blueprint for Phase 3 Component Implementation

---

## Component Tree

```
LandingPage
├── ScrollProgress (Framer Motion provider)
│
├── Act 1: TheGrid (0% scroll) ─────────────────────────────
│   ├── F1Scene (R3F Canvas)
│   │   ├── HeroF1Car (useGLTF for f1_2022_generic.glb)
│   │   ├── SceneLighting (3-point setup)
│   │   └── CameraController (mouse-reactive)
│   └── ScrollIndicator
│
├── Act 2: TheReveal (20% scroll) ──────────────────────────
│   └── ScrollTextReveal
│       └── AnimatedWord[] (4 words)
│
├── Act 3: TheProof (40% scroll) ───────────────────────────
│   └── StatCard[] (x3)
│       └── CountUpNumber
│
├── Act 4: TheIntelligence (60% scroll) ────────────────────
│   └── HorizontalScrollCards
│       └── FeatureCard[] (PREDICT · SIMULATE · ANALYZE)
│
├── Act 5: TheBroadcast (80% scroll) ───────────────────────
│   └── LiveTimingTower
│       ├── TimingRow[] (x5 drivers)
│       └── GapBar
│
└── Act 6: TheGridCall (100% scroll) ───────────────────────
    ├── LightsOutText
    └── GlowCTA
```

---

## File Structure

```
frontend/src/
├── components/
│   ├── landing/
│   │   ├── LandingPage.tsx       # Main page orchestrator
│   │   ├── TheGrid.tsx           # Act 1 - Hero 3D scene
│   │   ├── TheReveal.tsx         # Act 2 - Text reveals
│   │   ├── TheProof.tsx          # Act 3 - Stats counter
│   │   ├── TheIntelligence.tsx   # Act 4 - Horizontal scroll
│   │   ├── TheBroadcast.tsx      # Act 5 - Live timing
│   │   └── TheGridCall.tsx       # Act 6 - CTA section
│   │
│   ├── 3d/
│   │   ├── F1Scene.tsx           # R3F Canvas wrapper
│   │   ├── HeroF1Car.tsx         # GLTF model loader
│   │   ├── SceneLighting.tsx     # 3-point lighting
│   │   └── CameraController.tsx  # Mouse-reactive camera
│   │
│   ├── ui/
│   │   ├── GlassCard.tsx         # Reusable glass panel
│   │   ├── GlowButton.tsx        # F1 red glow CTA
│   │   ├── CountUpNumber.tsx     # Animated number counter
│   │   └── ScrollTextReveal.tsx  # Word-by-word reveal
│   │
│   └── timing/
│       ├── LiveTimingTower.tsx   # Timing board container
│       ├── TimingRow.tsx         # Single driver row
│       └── GapBar.tsx            # Gap visualization
│
├── lib/
│   ├── animations.ts             # Framer Motion variants
│   └── springs.ts                # Spring configurations
│
├── hooks/
│   ├── useMousePosition.ts       # Normalized mouse coords
│   ├── useScrollProgress.ts      # useScroll wrapper
│   └── useSectionInView.ts       # Intersection observer
│
└── stores/
    └── landingStore.ts           # Zustand scroll state
```

---

## Props Interfaces

### Landing Components

```typescript
// LandingPage.tsx
interface LandingPageProps {
  // No external props - self-contained
}

// TheGrid.tsx
interface TheGridProps {
  scrollProgress: MotionValue<number>;
}

// TheReveal.tsx
interface TheRevealProps {
  scrollProgress: MotionValue<number>;
  words: string[]; // ["RACE", "INTELLIGENCE", "REDEFINED"]
}

// TheProof.tsx
interface TheProofProps {
  scrollProgress: MotionValue<number>;
  stats: StatItem[];
}

interface StatItem {
  value: number;
  label: string;
  suffix?: string;
}

// TheIntelligence.tsx
interface TheIntelligenceProps {
  scrollProgress: MotionValue<number>;
  features: FeatureItem[];
}

interface FeatureItem {
  icon: '🔮' | '⚡' | '📊';
  title: string;
  description: string;
  linkTo: string;
}

// TheBroadcast.tsx
interface TheBroadcastProps {
  scrollProgress: MotionValue<number>;
}

// TheGridCall.tsx
interface TheGridCallProps {
  scrollProgress: MotionValue<number>;
}
```

### 3D Components

```typescript
// F1Scene.tsx
interface F1SceneProps {
  scrollProgress: MotionValue<number>;
  className?: string;
}

// HeroF1Car.tsx
interface HeroF1CarProps {
  scrollProgress: MotionValue<number>;
  mousePosition: { x: number; y: number };
}

// SceneLighting.tsx
interface SceneLightingProps {
  // No props - fixed 3-point setup
}

// CameraController.tsx
interface CameraControllerProps {
  mousePosition: { x: number; y: number };
  scrollProgress: MotionValue<number>;
}
```

### UI Components

```typescript
// GlassCard.tsx
interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'standard' | 'premium' | 'hud';
  className?: string;
}

// GlowButton.tsx
interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary';
}

// CountUpNumber.tsx
interface CountUpNumberProps {
  target: number;
  duration?: number;
  suffix?: string;
  triggerOnView?: boolean;
}

// ScrollTextReveal.tsx
interface ScrollTextRevealProps {
  words: string[];
  scrollProgress: MotionValue<number>;
  staggerDelay?: number;
}
```

### Timing Components

```typescript
// LiveTimingTower.tsx - uses types from f1.ts
import type { Driver } from '@/types/f1';

interface LiveTimingTowerProps {
  drivers: TimingDriverData[];
  isAnimating?: boolean;
}

interface TimingDriverData {
  position: number;
  driver: Driver;
  gap: number;
  interval?: number;
}

// TimingRow.tsx
interface TimingRowProps {
  position: number;
  driver: Driver;
  gap: number;
  isLeader?: boolean;
  animationDelay?: number;
}

// GapBar.tsx
interface GapBarProps {
  gap: number;
  maxGap: number;
  teamColor: string;
}
```

---

## Shared Hooks

### useMousePosition.ts

```typescript
interface MousePosition {
  x: number; // -1 to 1 (normalized)
  y: number; // -1 to 1 (normalized)
}

function useMousePosition(): MousePosition;
```

**Dependencies:** None  
**Used by:** `CameraController`, `HeroF1Car`

---

### useScrollProgress.ts

```typescript
interface ScrollProgressReturn {
  scrollProgress: MotionValue<number>;
  scrollY: MotionValue<number>;
  isInSection: (start: number, end: number) => boolean;
}

function useScrollProgress(
  containerRef?: RefObject<HTMLElement>
): ScrollProgressReturn;
```

**Dependencies:** `framer-motion` (useScroll, useTransform)  
**Used by:** `LandingPage`

---

### useSectionInView.ts

```typescript
interface SectionInViewOptions {
  threshold?: number;
  once?: boolean;
}

function useSectionInView(
  options?: SectionInViewOptions
): [RefObject<HTMLElement>, boolean];
```

**Dependencies:** `framer-motion` (useInView)  
**Used by:** `TheProof`, `TheBroadcast`

---

## Zustand Store

### landingStore.ts

```typescript
import { create } from 'zustand';

interface LandingState {
  // Current scroll section (0-5)
  currentSection: number;
  setCurrentSection: (section: number) => void;

  // 3D car loading state
  isCarLoaded: boolean;
  setCarLoaded: (loaded: boolean) => void;

  // Animation triggers
  hasAnimatedProof: boolean;
  markProofAnimated: () => void;

  hasAnimatedBroadcast: boolean;
  markBroadcastAnimated: () => void;

  // User interaction
  hasScrolled: boolean;
  markScrolled: () => void;
}

export const useLandingStore = create<LandingState>()((set) => ({
  currentSection: 0,
  setCurrentSection: (section) => set({ currentSection: section }),

  isCarLoaded: false,
  setCarLoaded: (loaded) => set({ isCarLoaded: loaded }),

  hasAnimatedProof: false,
  markProofAnimated: () => set({ hasAnimatedProof: true }),

  hasAnimatedBroadcast: false,
  markBroadcastAnimated: () => set({ hasAnimatedBroadcast: true }),

  hasScrolled: false,
  markScrolled: () => set({ hasScrolled: true }),
}));
```

---

## Animation Variants

### animations.ts

```typescript
import { Variants, Transition } from 'framer-motion';
import { springs } from './springs';

// ═══════════════════════════════════════════════════════════════════
// FADE VARIANTS
// ═══════════════════════════════════════════════════════════════════

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: springs.smooth },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: springs.gentle },
};

// ═══════════════════════════════════════════════════════════════════
// STAGGER CONTAINERS
// ═══════════════════════════════════════════════════════════════════

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerDramatic: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// SCROLL REVEAL (for word-by-word text)
// ═══════════════════════════════════════════════════════════════════

export const scrollWord: Variants = {
  hidden: { opacity: 0.2, y: 20 },
  visible: { opacity: 1, y: 0, transition: springs.gentle },
};

// ═══════════════════════════════════════════════════════════════════
// CARD VARIANTS
// ═══════════════════════════════════════════════════════════════════

export const cardHover: Variants = {
  idle: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: springs.snappy },
};

export const glassCard: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: springs.smooth },
};

// ═══════════════════════════════════════════════════════════════════
// TIMING TOWER VARIANTS
// ═══════════════════════════════════════════════════════════════════

export const timingRow: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, ...springs.smooth },
  }),
};

export const gapBar: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.8, ease: [0.17, 0.84, 0.44, 1] } },
};

// ═══════════════════════════════════════════════════════════════════
// CTA GLOW
// ═══════════════════════════════════════════════════════════════════

export const glowPulse: Variants = {
  idle: { boxShadow: '0 0 20px rgba(225, 6, 0, 0.3)' },
  pulse: {
    boxShadow: [
      '0 0 20px rgba(225, 6, 0, 0.3)',
      '0 0 40px rgba(225, 6, 0, 0.6)',
      '0 0 20px rgba(225, 6, 0, 0.3)',
    ],
    transition: { duration: 2, repeat: Infinity },
  },
};
```

---

### springs.ts

```typescript
// From brand_guidelines.md - Framer Motion spring configs

export const springs = {
  // Snappy — Buttons, interactions
  snappy: { type: 'spring', stiffness: 400, damping: 30 },

  // Smooth — Cards, panels
  smooth: { type: 'spring', stiffness: 300, damping: 30 },

  // Gentle — Reveals, hero elements
  gentle: { type: 'spring', stiffness: 200, damping: 25 },

  // Bouncy — Playful accents
  bouncy: { type: 'spring', stiffness: 500, damping: 15 },

  // Slow — Cinematic reveals
  slow: { type: 'spring', stiffness: 100, damping: 20 },

  // 3D Car — Smooth following
  car3d: { type: 'spring', stiffness: 50, damping: 15, mass: 0.5 },
} as const;

// Duration transitions (CSS easing equiv)
export const durations = {
  quick: { duration: 0.15, ease: [0.17, 0.84, 0.44, 1] },
  normal: { duration: 0.2, ease: [0.17, 0.84, 0.44, 1] },
  moderate: { duration: 0.3, ease: [0.17, 0.84, 0.44, 1] },
  slow: { duration: 0.4, ease: [0.17, 0.84, 0.44, 1] },
  reveal: { duration: 0.8, ease: [0.17, 0.84, 0.44, 1] },
  cinematic: { duration: 1.0, ease: [0.65, 0, 0.35, 1] },
} as const;
```

---

## Build Order

> [!IMPORTANT]
> Build in this order to ensure dependencies are available before dependents.

### Phase 3A: Foundation (Build First)

| Order | File | Dependencies | Why First |
|-------|------|--------------|-----------|
| 1 | `lib/springs.ts` | None | Animation timing constants |
| 2 | `lib/animations.ts` | `springs.ts` | Shared animation variants |
| 3 | `stores/landingStore.ts` | None | Global state management |
| 4 | `hooks/useMousePosition.ts` | None | 3D interaction prep |
| 5 | `hooks/useScrollProgress.ts` | `framer-motion` | Scroll coordination |
| 6 | `hooks/useSectionInView.ts` | `framer-motion` | Trigger animations |

---

### Phase 3B: UI Primitives

| Order | File | Dependencies | Notes |
|-------|------|--------------|-------|
| 7 | `ui/GlassCard.tsx` | None | Reused by all cards |
| 8 | `ui/GlowButton.tsx` | `animations.ts` | CTA component |
| 9 | `ui/CountUpNumber.tsx` | `useSectionInView` | Animated stats |
| 10 | `ui/ScrollTextReveal.tsx` | `animations.ts` | Word-by-word reveal |

---

### Phase 3C: 3D Scene

| Order | File | Dependencies | Notes |
|-------|------|--------------|-------|
| 11 | `3d/SceneLighting.tsx` | `@react-three/fiber` | 3-point light setup |
| 12 | `3d/CameraController.tsx` | `useMousePosition` | Interactive camera |
| 13 | `3d/HeroF1Car.tsx` | `@react-three/drei` (useGLTF) | Car model loader |
| 14 | `3d/F1Scene.tsx` | All 3D components | Canvas wrapper |

---

### Phase 3D: Timing Tower

| Order | File | Dependencies | Notes |
|-------|------|--------------|-------|
| 15 | `timing/GapBar.tsx` | `animations.ts` | Gap visualization |
| 16 | `timing/TimingRow.tsx` | `GapBar`, `f1.ts` types | Single row |
| 17 | `timing/LiveTimingTower.tsx` | `TimingRow`, mock drivers | Full tower |

---

### Phase 3E: Act Sections

| Order | File | Dependencies | Notes |
|-------|------|--------------|-------|
| 18 | `landing/TheGrid.tsx` | `F1Scene`, `ScrollIndicator` | Act 1 |
| 19 | `landing/TheReveal.tsx` | `ScrollTextReveal` | Act 2 |
| 20 | `landing/TheProof.tsx` | `CountUpNumber`, `GlassCard` | Act 3 |
| 21 | `landing/TheIntelligence.tsx` | `GlassCard`, horizontal scroll | Act 4 |
| 22 | `landing/TheBroadcast.tsx` | `LiveTimingTower` | Act 5 |
| 23 | `landing/TheGridCall.tsx` | `GlowButton` | Act 6 |

---

### Phase 3F: Page Assembly

| Order | File | Dependencies | Notes |
|-------|------|--------------|-------|
| 24 | `landing/LandingPage.tsx` | All Act components | Final assembly |

---

## Animation Variant Assignments

| Component | Variant(s) | Trigger |
|-----------|-----------|---------|
| `TheReveal` words | `scrollWord` | Scroll position 10-30% |
| `TheProof` stats | `fadeInUp` | `useSectionInView` |
| `CountUpNumber` | (Imperative) | `useSectionInView` |
| `TheIntelligence` cards | `glassCard`, `cardHover` | Scroll position 40-60% |
| `TimingRow` | `timingRow` | Staggered on mount |
| `GapBar` | `gapBar` | After row enters |
| `GlowButton` | `glowPulse` | Always pulsing |
| `HeroF1Car` | (R3F animation) | Scroll + mouse |

---

## Scroll Position Mapping

| Section | Scroll Range | Trigger |
|---------|--------------|---------|
| Act 1: TheGrid | 0% - 20% | Immediate |
| Act 2: TheReveal | 10% - 35% | useTransform opacity |
| Act 3: TheProof | 30% - 50% | useSectionInView |
| Act 4: TheIntelligence | 45% - 70% | Sticky + horizontal |
| Act 5: TheBroadcast | 65% - 85% | useSectionInView |
| Act 6: TheGridCall | 80% - 100% | fadeIn on enter |

---

## External Dependencies

| Package | Version | Usage |
|---------|---------|-------|
| `framer-motion` | ^11.x | All animations, scroll |
| `@react-three/fiber` | ^8.x | 3D scene |
| `@react-three/drei` | ^9.x | useGLTF, helpers |
| `three` | ^0.160.x | 3D primitives |
| `zustand` | ^5.x | State management |

---

## Data Sources

| Component | Data Source | Type |
|-----------|-------------|------|
| `HeroF1Car` | `/assets/3d/f1_2022_generic.glb` | GLTF |
| `LiveTimingTower` | `mocks/drivers.ts` | Driver[] |
| `TheProof` | Hardcoded stats | StatItem[] |
| `TheIntelligence` | Hardcoded features | FeatureItem[] |

---

## Summary for Phase 3 Agent

1. **Start with** `lib/springs.ts` and `lib/animations.ts`
2. **Then** create Zustand store and hooks
3. **Then** build UI primitives (`GlassCard`, `GlowButton`, etc.)
4. **Then** 3D scene components (R3F Canvas last)
5. **Then** timing tower components
6. **Then** act sections (TheGrid → TheGridCall)
7. **Finally** assemble `LandingPage.tsx`

> [!TIP]
> Use types from `frontend/src/types/f1.ts` for all driver/circuit data.

---

## Verification Plan

### Automated

```bash
# TypeScript compilation check
cd frontend && npm run build
```

### Manual Browser Testing

1. Open landing page in browser
2. Verify smooth scroll (60fps)
3. Test word-by-word reveal at 20% scroll
4. Verify stats count up animation
5. Test horizontal scroll functionality
6. Verify timing tower animation
7. Click CTA button - should navigate correctly
