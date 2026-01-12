# 3D Scene Composition

Defines how 3D assets, cameras, and HUD overlays are arranged.

---

## 1. Scene Layers

Three major layers:

1. **Identity Layer**
   - F1 car model
   - tires + brake discs
   - aero highlights

2. **Context Layer**
   - track geometry
   - sector extrusions
   - pitlane markup

3. **Telemetry Layer**
   - HUD overlays
   - data readouts
   - rpm arcs
   - throttle/brake sliders

---

## 2. Camera

Primary camera moves:

- orbit
- dolly in/out
- pan
- tilt

Hero uses slow orbital camera + HDRI reflections.

---

## 3. Materials

Car uses simplified PBR:

- metalness
- roughness
- clear highlight
- no ray tracing
- no volumetrics
- HDRI-lit

---

## 4. Performance Constraints

Target:
- 60fps desktop
- 30fps mobile
- GPU batching
- LOD switching
- async loading
