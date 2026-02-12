# F1 Assets Structure

Place your F1 assets in these folders:

## Folder Structure

```
frontend/public/assets/
├── cars/           # F1 car images (PNG/JPG)
│   ├── ferrari.png
│   ├── redbull.png
│   ├── mclaren.png
│   └── ...
│
├── circuits/       # Circuit images/maps
│   ├── las-vegas.png
│   ├── silverstone.png
│   ├── monaco.png
│   └── ...
│
├── drivers/        # Driver photos/helmets
│   ├── verstappen.png
│   ├── hamilton.png
│   ├── leclerc.png
│   └── ...
│
├── videos/         # Short F1 clips (MP4/WebM)
│   ├── race-start.mp4
│   ├── pit-stop.mp4
│   ├── overtake.mp4
│   └── ...
│
└── logos/          # Team/sponsor logos
    ├── f1-logo.svg
    ├── pirelli.svg
    └── ...
```

## Naming Convention
- Use lowercase with hyphens: `las-vegas.png`
- Keep files optimized for web (< 500KB for images)
- Videos: 720p or 1080p, < 10MB

## Usage in Code
Assets are accessible at: `/assets/[folder]/[filename]`

Example:
```tsx
<img src="/assets/cars/ferrari.png" alt="Ferrari" />
<video src="/assets/videos/race-start.mp4" />
```
