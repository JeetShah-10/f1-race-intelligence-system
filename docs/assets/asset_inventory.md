# F1 Intelligence Platform - Asset Inventory

> **Last Updated:** January 22, 2026  
> **Purpose:** Comprehensive inventory of F1 assets for the landing page and platform UI

---

## 📊 Current Asset Status

### Already Available in Project

| Category | Count | Location |
|----------|-------|----------|
| 2D Car Images | 27 | `frontend/public/assets/cars/` |
| Circuit Images | 55 | `frontend/public/assets/circuits/` |
| Team Logos | 27 | `frontend/public/assets/logos/` |
| 3D Models | 2 | `3D-model-and-references/` |
| Fonts | 9 | `frontend/public/assets/fonts/` |

---

## 🎮 3D Models
 
 ### ⭐ TOP PRIORITY - Recommended Downloads
 
 | Asset | Type | Source URL | License | Size | Notes |
 |-------|------|------------|---------|------|-------|
 | **Low Poly-F1** | GLB/OBJ | [Sketchfab](https://sketchfab.com/3d-models/low-poly-f1-0ac02bfa81f64549be15acaa78f36f29) | CC Attribution | ~5MB | ✅ **BEST OPTION** - Low poly, optimized, 974 downloads |
 
 ### ⚠️ Existing Models (CRITICAL: Optimization Required)
 
 found in `frontend/public/models/`:
 
 | Model | Current Size | Target | Status | Action Required |
 |-------|-------------|--------|--------|-----------------|
 | `gulf_mclaren_f1_2022_car.glb` | **67.7 MB** | <5MB | 🔴 Critical | Needs aggressive Draco compression + texture resizing |
 | `oracle_red_bull_...rb19_2023.glb` | **54.5 MB** | <5MB | 🔴 Critical | Reduce poly count + compress textures |
 | `mclaren.glb` | **37.0 MB** | <5MB | 🔴 Critical | Draco compression |
 | `C44.glb` | **28.9 MB** | <5MB | 🔴 Critical | Draco compression |
 | `f1_2022_generic.glb` | **13.2 MB** | <5MB | 🟡 High | Standard compression |
 
 ### Optimization Strategy
 1. **Texture Resizing**: All textures must be max 1K (1024x1024) or 2K for hero car.
 2. **Draco Compression**: Apply Level 7-10 compression.
 3. **Mesh Decimation**: Reduce polygon count for non-hero parts.
 
 ### Tools to Use
 ```bash
 # 1. Install standard gltf-pipeline
 npm install -g gltf-pipeline
 
 # 2. Run compression on a model
 gltf-pipeline -i input_model.glb -o output_model.glb --draco.compressionLevel=10
 ```

---

## 🏎️ Circuit Images

### Current Coverage (55 images)
All 2025 F1 calendar circuits covered with:
- High-resolution aerial/circuit photos
- Track layout maps (PNG with transparency)

### ⭐ Dark Theme Recommendations

| Circuit | Best for Dark Theme | Notes |
|---------|---------------------|-------|
| Las Vegas | ✅ Night race, neon lights | 3.3MB high-res available |
| Singapore | ✅ Night race | Dark urban backdrop |
| Monaco | ✅ Twilight shots available | Monte Carlo at dusk |
| Bahrain | ✅ Night race | Desert night aesthetics |
| Abu Dhabi | ✅ Sunset/night | Yas Marina twilight |

### Additional Circuit Sources

| Source | URL | License | Notes |
|--------|-----|---------|-------|
| F1 Fansite Wallpapers | [f1-fansite.com](https://www.f1-fansite.com/f1-wallpaper/) | Editorial | High-quality race photos |
| Bing Wallpapers | [bwallpaperhd.com](https://www.bwallpaperhd.com/monaco-gp.html) | Bing/Getty | 4K wallpapers |
| Wallpapers.com | [wallpapers.com](https://wallpapers.com/wallpapers/monaco-grand-prix-desktop-4k-25l261vocd9dag64.html) | Free | Monaco GP 4K |

---

## 🪖 Driver Helmets

### ⭐ Transparent PNG Sources

| Source | URL | Quality | License |
|--------|-----|---------|---------|
| **CityPNG** | [citypng.com/sports](https://www.citypng.com/photo/0b29a967/lewis-hamilton-official-f1-helmet) | 2000x2000 | Free with attribution |
| **UniqRenders** | [uniqrenders.com](https://uniqrenders.com/athletes/motorsport/) | High-res PNG | Free |
| Overtake.gg | [overtake.gg](https://overtake.gg/downloads/lando-norris-2024-helmet-acsprh-v2-f1-lid-series.67689) | High-res | For sim racing mods |

### Available Helmets (CityPNG)
- Lewis Hamilton (2000x2000, 2.2MB)
- Charles Leclerc (2000x2000, 1.3MB)
- Carlos Sainz Jr (2000x2000, 1.9MB)
- Ayrton Senna (2000x2000, 1.5MB)

---

## 🏁 Team Logos

### Current Status: ✅ Complete
All 11 constructor teams have logos in `frontend/public/assets/logos/`:

| Team | Regular | Small | Status |
|------|---------|-------|--------|
| Alpine | ✅ | ✅ | Complete |
| Aston Martin | ✅ | ✅ | Complete |
| Audi | ✅ | - | Needs small version |
| Cadillac | ✅ | ✅ | Complete |
| Ferrari | ✅ | ✅ | Complete |
| Haas | ✅ | ✅ | Complete |
| McLaren | ✅ | ✅ | Complete |
| Mercedes | ✅ | ✅ | Complete |
| Racing Bulls | ✅ | ✅ | Complete |
| Red Bull | ✅ | - | Needs small version |
| Williams | ✅ | ✅ | Complete |

### Additional Logo Sources

| Source | URL | Format | Notes |
|--------|-----|--------|-------|
| Graphic News | [graphicnews.com](https://www.graphicnews.com/en/pages/46493/f1-team-logos-2025) | AI, PDF, JPG, PNG | Official 2025 logos package |
| F1 Official | [formula1.com](https://www.formula1.com/en/teams) | PNG | Official team pages |

---

## 🔤 Typography / Fonts

### ⭐ Recommended Fonts (All Free)

| Font | Style | Source | Usage |
|------|-------|--------|-------|
| **Orbitron** | Futuristic, Tech | [Google Fonts](https://fonts.google.com/specimen/Orbitron) | Headlines, hero text |
| **Titillium Web** | Clean, Technical | [Google Fonts](https://fonts.google.com/specimen/Titillium+Web) | Body text |
| **Inter** | Modern Sans | [Google Fonts](https://fonts.google.com/specimen/Inter) | UI elements |
| **Outfit** | Geometric | [Google Fonts](https://fonts.google.com/specimen/Outfit) | Stats, numbers |

### F1-Style Fonts (Fan-Made)

| Font | Source | License | Notes |
|------|--------|---------|-------|
| F1 Reg, F1 Turbo, F1 Torque | [imjustcreative.com](https://imjustcreative.com/download-f1-fonts-formula-1-fonts/2025/05/16) | Free (fan-made) | Inspired by official F1 branding |
| Formula1 Display | [onlinewebfonts.com](https://www.onlinewebfonts.com/download/7a45cffcf1eee0797d566deb425ebaa9) | Free | Regular weight |

### Installation (Google Fonts)
```html
<!-- Add to index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 🎨 Icons

### ⭐ Recommended Icon Libraries

| Library | URL | Icons | License | Installation |
|---------|-----|-------|---------|--------------|
| **Lucide** | [lucide.dev](https://lucide.dev/icons/) | 1,500+ | MIT | `npm install lucide-react` |
| **Heroicons** | [heroicons.com](https://heroicons.com/) | 316 | MIT | `npm install @heroicons/react` |
| React Icons | [react-icons.github.io](https://react-icons.github.io/react-icons/) | 40,000+ | MIT | `npm install react-icons` |

### Racing/Telemetry Icons (Lucide)

| Icon | Name | Use Case |
|------|------|----------|
| ⏱️ | `gauge` | Speedometer, telemetry |
| 🏎️ | `car` | Vehicle indicators |
| 📊 | `chart-line` | Performance graphs |
| ⚡ | `zap` | Speed/power |
| 🔧 | `wrench` | Strategy/settings |
| 🏁 | `flag` | Race start/finish |
| ⏲️ | `timer` | Lap times |
| 📍 | `map-pin` | Track position |

---

## 🎬 Video Assets

### Current Status
Located in `frontend/public/assets/videos/` (3 files)

### Recommended Sources

| Type | Source | Notes |
|------|--------|-------|
| F1 Onboard | YouTube (F1 Official) | For background ambiance |
| Race Highlights | F1 TV | Licensed content |
| Stock Racing | Pexels/Pixabay | Free for commercial use |

---

## ⚡ Priority Download List

### Immediate Actions (Top 5)

| # | Asset | Action | Priority |
|---|-------|--------|----------|
| 1 | **Low Poly F1 Model** | Download from Sketchfab | 🔴 Critical |
| 2 | **Orbitron Font** | Add Google Fonts link | 🔴 Critical |
| 3 | **Lucide Icons** | `npm install lucide-react` | 🟡 High |
| 4 | **Driver Helmets** | Download from CityPNG | 🟡 High |
| 5 | **Compress Existing GLBs** | Use gltf-pipeline or Draco | 🟠 Medium |

### 3D Model Optimization Commands
```bash
# Install gltf-pipeline globally
npm install -g gltf-pipeline

# Compress existing McLaren model
gltf-pipeline -i mclaren_mp45_2k.glb -o mclaren_optimized.glb --draco.compressionLevel=10

# Target: <5MB for smooth 60fps performance
```

---

## 📋 License Summary

| License Type | Assets | Commercial Use |
|--------------|--------|----------------|
| CC Attribution | Most Sketchfab models | ✅ Yes (with credit) |
| CC BY-NC-ND | Some premium models | ❌ No commercial |
| MIT | Lucide, Heroicons | ✅ Yes |
| Google Fonts | All listed fonts | ✅ Yes |
| Editorial | Race photos | ⚠️ Check per-image |

---

## 🔗 Quick Links

- **Sketchfab F1 Search:** https://sketchfab.com/tags/formula1
- **CGTrader F1:** https://www.cgtrader.com/3d-models/f1
- **Free3D Formula 1:** https://free3d.com/3d-models/formula-1
- **Google Fonts:** https://fonts.google.com/
- **Lucide Icons:** https://lucide.dev/icons/
- **Heroicons:** https://heroicons.com/

---

*Document maintained for F1 Intelligence Platform development*
