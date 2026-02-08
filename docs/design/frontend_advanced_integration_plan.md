# Jeet's Frontend Advanced Integration Plan — F1 Intelligence Platform

> **Owner**: Jeet  
> **Focus**: Advanced Features (Driver vs Driver, Season Sim), Visualization, & Polishing  
> **Timeline**: Concurrent with Backend Week 2-3

---

## 🎯 Executive Summary

While Dev builds the advanced backend APIs, Jeet will build the rich visualization interfaces to consume them.
The focus is on "cinematic data storytelling" — moving beyond tables to interactive charts and comparisons.

**Key Features to Build:**
1. **Driver Comparison Lab** (`/analyze/driver`)
2. **Season Simulation Center** (`/analyze/season`)
3. **Telemetry Analysis Suite** (`/analyze/telemetry`)
4. **Interactive "What-If" Scenario Builder**

---

## Phase 1: Comparison & Statistics (Week 1)

### Task 1.1: Driver Comparison Page (`/analyze/driver`)
**Goal**: Head-to-head analysis of any two drivers.

**Components:**
1. **DriverSelector**: Dual dropdown/search with driver photos.
2. **RadarChart** (Recharts): Comparing attributes (Pace, Consistency, Experience, Aggression, Wet Weather).
3. **StatsGrid**: Head-to-head matrix (Wins, Podiums, DNFs).

**API Integration:**
```typescript
// services/compare.ts
export const compareService = {
  getDriverHeadToHead: async (driver1: string, driver2: string) => {
    return api.post('/api/compare/drivers', { driver1, driver2 })
  }
}
```

**UI Layout:**
- **Left/Right Columns**: Large driver portraits with team colors.
- **Center**: Overlaid Radar Chart & "VS" badge.
- **Bottom**: Tabs for "Career", "2026 Projected", "Telemetry".

### Task 1.2: Interactive Charts
**Library**: `recharts` (standard) or `nivo` (premium). Using `recharts` for now.

**New Components (`src/components/charts/`):**
- `PerformanceRadar.tsx`: For driver attributes.
- `LapTimeDistribution.tsx`: Violin or Box plot of lap times.
- `PaceEvolution.tsx`: Line chart showing lap times over race distance.

---

## Phase 2: Season Simulation (Week 2)

### Task 2.1: Season Control Center (`/analyze/season`)
**Goal**: Simulate a full 2026 championship.

**Process Flow:**
1. **Setup**: "Quick Sim" vs "Deep Sim" (configure weather variance, reliability luck).
2. **Progress**: Visual progress bar iterating through 24 races (using `async/await` loop with slight delays for effect).
3. **Live Standings**: An animated table that re-sorts itself after every "race" completion.

**API Integration:**
```typescript
// services/season.ts
export const seasonService = {
  simulateSeason: async (config: SeasonConfig) => {
    // Note: Backend might return stream or full result.
    // For MVP, likely full result, frontend animates the "reveal".
    return api.post('/api/season/simulate', config)
  }
}
```

**Visuals:**
- **ChampionshipGraph**: Bump chart (like a ribbon chart) showing position changes over 24 rounds.
- **ConstructorView**: Stacked area chart of points.

---

## Phase 3: Telemetry & Deep Dive (Week 3)

### Task 3.1: Telemetry Analysis (`/analyze/telemetry`)
**Goal**: Professional-grade telemetry traces (Speed, Throttle, Brake).

**UI Components:**
- **LapSelector**: Choose Session -> Driver -> Lap.
- **TraceViewer**: Multi-line chart (Speed/RPM/Gear) synchronized on X-axis (Distance).
- **MapOverlay**: Track map highlighting the specific segment being viewed.

**FastF1 Data Integration:**
- Backend provides JSON sector streams.
- Frontend renders high-freq SVG/Canvas charts.

---

## Integration Guide: Linking to Backend

### 1. Unified Types
Create `src/types/f1_advanced.ts` to match Dev's new Pydantic models.

```typescript
export interface DriverComparisonResult {
  driver1: DriverProfile
  driver2: DriverProfile
  headToHead: {
    qualiScore: number
    raceScore: number
    overtakes: number
  }
  radarData: { attribute: string; d1: number; d2: number }[]
}

export interface SeasonSimResult {
  standings: DriverStanding[]
  raceResults: RaceResult[]
  history: RoundHistory[]
}
```

### 2. Mocking until Ready
Since backend is building in parallel, Create `src/services/mock/advanced.ts`:
- Returns static `DriverComparisonResult` JSON.
- Allows Jeet to build the **Radar Chart** and **Animations** immediately without waiting for Dev.

---

## Jeet's Task Checklist

### Week 1: Comparison Engine
- [ ] Create `components/charts/RadarChart.tsx`
- [ ] Create `pages/analyze/DriverCheckPage.tsx`
- [ ] Implement `MetricCard` for head-to-head stats
- [ ] Add animations (Framer Motion) for bar filling

### Week 2: Season Sim
- [ ] Create `pages/analyze/SeasonSimPage.tsx`
- [ ] Build "Race Logic" visualizer (simple text log styling like terminal)
- [ ] Implement `BumpChart` for championship standings
- [ ] Add "Export Scenario" button

### Week 3: Telemetry
- [ ] Create `pages/analyze/TelemetryPage.tsx`
- [ ] Integrate high-performance line charts (consider `chart.js` if Recharts is slow for 10k points)
- [ ] Sync chart hover with track map position (advanced)

---

## Design System Extensions needed
- **Colors**: Need distinct colors for all 11 teams (Audi, Cadillac added).
- **Typography**: Monospace font for telemetry numbers (`JetBrains Mono` or similar).
- **Gradients**: "Heatmap" gradients for tyre degradation visuals.
