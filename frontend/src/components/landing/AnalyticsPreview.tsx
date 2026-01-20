import { motion } from 'framer-motion';

const telemetryData = Array.from({ length: 40 }, (_, i) => ({
    x: i,
    throttle: Math.min(100, Math.max(0, 50 + Math.sin(i * 0.2) * 40 + Math.random() * 10)),
    brake: Math.max(0, Math.sin(i * 0.2 + Math.PI) * 80 + Math.random() * 5),
    speed: 200 + Math.sin(i * 0.1) * 100
}));

export function AnalyticsPreview() {
    return (
        <section className="relative w-full py-32 bg-carbon-black overflow-hidden border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-12 items-end mb-16">
                    <div className="flex-1">
                        <h3 className="text-ferrari-red font-bold tracking-[0.2em] uppercase mb-4 text-xs font-square">Telemetry Analysis</h3>
                        <h2 className="text-4xl text-white font-bold font-square tracking-tight max-w-xl">
                            DECISIONS IN <span className="text-electric-blue">MILLISECONDS</span>
                        </h2>
                    </div>
                    <p className="flex-1 text-silver-arrow/60 font-modern text-lg border-l border-white/10 pl-6">
                        Our simulation engine processes 5GB of localized telemetry per lap, comparing driver inputs against the theoretical optimal lap in real-time.
                    </p>
                </div>

                {/* Telemetry Surface */}
                <div className="w-full bg-asphalt/40 border border-white/10 rounded-lg p-1 backdrop-blur-sm relative group">
                    {/* Toolbar Mockup */}
                    <div className="h-10 border-b border-white/5 flex items-center px-4 gap-4">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-ferrari-red/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-asphalt border border-white/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-asphalt border border-white/20" />
                        </div>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <span className="text-[10px] text-silver-arrow/50 font-mono tracking-widest uppercase">LEC_LAP_24_HK.telem</span>
                    </div>

                    {/* Charts Container */}
                    <div className="p-6 relative opacity-80 group-hover:opacity-100 transition-opacity duration-500">

                        {/* Grid Background */}
                        <div className="absolute inset-6 pointer-events-none">
                            <svg className="w-full h-full opacity-10">
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                                </pattern>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                            </svg>
                        </div>

                        {/* Chart 1: Speed */}
                        <div className="h-32 mb-8 relative border-b border-white/5">
                            <span className="absolute top-0 left-0 text-[10px] text-silver-arrow/50 font-mono">VELOCITY [KPH]</span>
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 40 100">
                                <motion.path
                                    d={`M ${telemetryData.map(d => `${d.x},${300 - d.speed}`).join(' L ')}`}
                                    fill="none"
                                    stroke="#00E676"
                                    strokeWidth="0.5"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    transition={{ duration: 2, ease: "linear" }}
                                />
                                {/* Fill Gradient */}
                                <path d={`M 0,100 L ${telemetryData.map(d => `${d.x},${300 - d.speed}`).join(' L ')} L 40,100 Z`} fill="url(#speed-gradient)" opacity="0.1" />
                                <defs>
                                    <linearGradient id="speed-gradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#00E676" />
                                        <stop offset="100%" stopColor="transparent" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        {/* Chart 2: Inputs (Throttle/Brake) */}
                        <div className="h-32 relative">
                            <span className="absolute top-0 left-0 text-[10px] text-silver-arrow/50 font-mono">INPUTS [%]</span>
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 40 100">
                                {/* Throttle */}
                                <motion.path
                                    d={`M ${telemetryData.map(d => `${d.x},${100 - d.throttle}`).join(' L ')}`}
                                    fill="none"
                                    stroke="#38BDF8"
                                    strokeWidth="0.5"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    transition={{ duration: 2, ease: "linear" }}
                                />
                                {/* Brake */}
                                <motion.path
                                    d={`M ${telemetryData.map(d => `${d.x},${100 - d.brake}`).join(' L ')}`}
                                    fill="none"
                                    stroke="#EF4444"
                                    strokeWidth="0.5"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    transition={{ duration: 2, ease: "linear", delay: 0.2 }}
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
