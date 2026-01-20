import { motion } from 'framer-motion';
import { useState } from 'react';

// Simplified SVG Path for a generic track loop (resembling Monza/Spa hybrid)
const trackPath = "M 100 300 L 200 300 C 250 300 300 250 300 200 L 300 100 C 300 50 350 0 400 0 L 600 0 C 650 0 700 50 700 100 L 700 400 C 700 450 650 500 600 500 L 200 500 C 150 500 100 450 100 400 Z";

export function TrackVisualization() {
    const [activeSector, setActiveSector] = useState<number | null>(null);

    const sectors = [
        { id: 1, name: "SECTOR 1", color: "text-sector-purple", desc: "High speed trap speed required. DRS Zone 1 Analysis." },
        { id: 2, name: "SECTOR 2", color: "text-sector-green", desc: "Technical cornering complex. High downforce requirement." },
        { id: 3, name: "SECTOR 3", color: "text-sector-yellow", desc: "Pit entry delta and final straight acceleration." },
    ];

    return (
        <section className="relative w-full py-24 md:py-40 bg-asphalt overflow-hidden flex flex-col items-center justify-center">

            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-alpine-blue/5 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

                {/* Track Graphic - Responsive Container */}
                <div className="md:col-span-7 flex justify-center relative order-2 md:order-1">
                    <div className="w-full max-w-lg aspect-square relative">
                        <svg className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" viewBox="0 0 800 600">
                            <defs>
                                <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3B424F" />
                                    <stop offset="100%" stopColor="#2C323C" />
                                </linearGradient>
                            </defs>

                            {/* Base Track */}
                            <motion.path
                                d={trackPath}
                                fill="none"
                                stroke="url(#trackGradient)"
                                strokeWidth="20"
                                strokeLinecap="round"
                            />

                            {/* Highlight S1 */}
                            <motion.path
                                d="M 100 300 L 200 300 C 250 300 300 250 300 200 L 300 100" // Segment approx
                                fill="none"
                                stroke={activeSector === 1 ? "#A020F0" : "transparent"}
                                strokeWidth="6"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: activeSector === 1 ? 1 : 0 }}
                                transition={{ duration: 0.5 }}
                            />

                            {/* Highlight S2 */}
                            <motion.path
                                d="M 300 100 C 300 50 350 0 400 0 L 600 0 C 650 0 700 50 700 100 L 700 400" // Segment approx
                                fill="none"
                                stroke={activeSector === 2 ? "#00E676" : "transparent"}
                                strokeWidth="6"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: activeSector === 2 ? 1 : 0 }}
                                transition={{ duration: 0.5 }}
                            />

                            {/* Highlight S3 */}
                            <motion.path
                                d="M 700 400 C 700 450 650 500 600 500 L 200 500 C 150 500 100 450 100 400 Z" // Segment approx
                                fill="none"
                                stroke={activeSector === 3 ? "#F9E300" : "transparent"}
                                strokeWidth="6"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: activeSector === 3 ? 1 : 0 }}
                                transition={{ duration: 0.5 }}
                            />

                            {/* Interactive Hotspots */}
                            <circle cx="200" cy="300" r="20" className="cursor-pointer fill-silver-arrow/20 hover:fill-sector-purple transition-colors" onMouseEnter={() => setActiveSector(1)} />
                            <circle cx="600" cy="100" r="20" className="cursor-pointer fill-silver-arrow/20 hover:fill-sector-green transition-colors" onMouseEnter={() => setActiveSector(2)} />
                            <circle cx="400" cy="500" r="20" className="cursor-pointer fill-silver-arrow/20 hover:fill-sector-yellow transition-colors" onMouseEnter={() => setActiveSector(3)} />
                        </svg>

                        {/* Live Dot Animation */}
                        <div className="absolute top-0 right-0 p-3 bg-carbon-black/60 backdrop-blur rounded border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-ferrari-red rounded-full animate-pulse shadow-[0_0_10px_#CF2C28]" />
                                <span className="text-[10px] font-square tracking-widest text-silver-arrow uppercase">Telemetry Live</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Panel */}
                <div className="md:col-span-5">
                    <h2 className="text-3xl font-bold text-white mb-6 font-square">TRACK DOMINANCE</h2>
                    <div className="space-y-4">
                        {sectors.map((s) => (
                            <motion.div
                                key={s.id}
                                className={`p-4 rounded-lg border transition-all duration-300 ${activeSector === s.id ? 'bg-white/5 border-alpine-blue' : 'border-transparent hover:bg-white/5'}`}
                                onMouseEnter={() => setActiveSector(s.id)}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`font-bold font-square ${activeSector === s.id ? s.color : 'text-white'}`}>{s.name}</span>
                                    {activeSector === s.id && <span className="text-xs text-silver-arrow uppercase tracking-widest">Active</span>}
                                </div>
                                <p className="text-sm text-silver-arrow/60 font-modern">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/10">
                        <div className="flex justify-between items-end">
                            <div>
                                <div className="text-xs text-silver-arrow uppercase tracking-widest mb-1">Track Temp</div>
                                <div className="text-2xl font-mono text-white">42°C</div>
                            </div>
                            <div>
                                <div className="text-xs text-silver-arrow uppercase tracking-widest mb-1">Air Temp</div>
                                <div className="text-2xl font-mono text-white">28°C</div>
                            </div>
                            <div>
                                <div className="text-xs text-silver-arrow uppercase tracking-widest mb-1">Humidity</div>
                                <div className="text-2xl font-mono text-white">62%</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
