/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Neon Night Palette (Concept: Saudi GP Night)
                "f1-red": "#E10600",
                "f1-dark": "#0A0A0A", // Obsidian
                "f1-carbon": "#151515", // Forged Base
                "neon-cyan": "#00F0FF", // Petronas/Tech
                "neon-purple": "#bc13fe", // Sector 3
                "neon-yellow": "#FFE600", // Soft Tire
            },
            fontFamily: {
                "racing": ['"Racing Sans One"', "cursive"],
                "stats": ['"Orbitron"', "monospace"], // Tech/Data font
                "mono": ['"Orbitron"', "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"], // Override mono to use Orbitron
                "body": ['"Inter"', "sans-serif"], // Clean readability
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
