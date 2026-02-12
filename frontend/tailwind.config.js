/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "f1-red": "#E10600",
                "f1-dark": "#0A0A0A",
                "f1-carbon": "#151515",
                "neon-cyan": "#00F0FF",
                "neon-purple": "#bc13fe",
                "neon-yellow": "#FFE600",
                "flag-green": "#00E676",
                "flag-yellow": "#FFC107",
                "flag-red": "#FF1744",
                "flag-sc": "#FF9800",
                "tyre-soft": "#FF3333",
                "tyre-medium": "#FFC906",
                "tyre-hard": "#FFFFFF",
                "tyre-inter": "#1EB53A",
                "tyre-wet": "#0064E0",
                "sector-purple": "#A020F0",
                "sector-green": "#00E676",
                "sector-yellow": "#F9E300",
                "sim-bg": "#0B0D10",
                "sim-panel": "#111318",
                "sim-border": "rgba(255,255,255,0.08)",
            },
            fontFamily: {
                "racing": ['"Racing Sans One"', "cursive"],
                "stats": ['"Orbitron"', "monospace"],
                "timing": ['"Rajdhani"', "sans-serif"],
                "ui": ['"Outfit"', "sans-serif"],
                "mono": ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
                "body": ['"Inter"', "sans-serif"],
            },
            backgroundImage: {
                "carbon-forged": "url('/assets/textures/carbon-forged.png')",
                "noise": "url('/assets/textures/noise-overlay.png')",
                "hero-fluid": "url('/assets/backgrounds/bg-image-1.png')", // User provided
                "tech-poly": "url('/assets/backgrounds/bg-image-2.png')", // User provided
            },
            animation: {
                "float-slow": "float 8s ease-in-out infinite",
                "float-mid": "float 5s ease-in-out infinite",
                "glitch": "glitch 1s linear infinite",
                "scanline": "scanline 8s linear infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                glitch: {
                    "0%": { transform: "translate(0)" },
                    "20%": { transform: "translate(-2px, 2px)" },
                    "40%": { transform: "translate(-2px, -2px)" },
                    "60%": { transform: "translate(2px, 2px)" },
                    "80%": { transform: "translate(2px, -2px)" },
                    "100%": { transform: "translate(0)" },
                },
                scanline: {
                    "0%": { transform: "translateY(-100%)" },
                    "100%": { transform: "translateY(100%)" },
                }
            }
        },
    },
    plugins: [],
}
