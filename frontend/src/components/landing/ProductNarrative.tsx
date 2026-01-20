import { motion } from 'framer-motion';

export function ProductNarrative() {
    return (
        <section className="relative w-full py-32 bg-asphalt text-white overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 pointer-events-none" />

            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center relative z-10">

                {/* Text Content - Aligned Left */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-[2px] bg-alpine-blue" />
                        <span className="text-alpine-blue font-bold tracking-widest text-xs uppercase font-square">The Core Engine</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-bold tracking-tighter font-square leading-none">
                        HYBRID <span className="text-transparent bg-clip-text bg-gradient-to-r from-silver-arrow to-white">SIMULATION</span><br />
                        <span className="text-white/20">ARCHITECTURE</span>
                    </h2>

                    <p className="text-silver-arrow text-lg leading-relaxed font-modern font-light border-l-2 border-white/10 pl-6">
                        F1 Race Intelligence isn't just a dashboard. It's a <strong className="text-white">predictive strategy engine</strong> that combines historical outcome data with real-time FIA 2026 physics modeling.
                        Experience the race not as a spectator, but as a strategist.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                        <div className="bg-white/5 p-6 rounded-lg border border-white/5 hover:border-alpine-blue/30 transition-colors">
                            <h4 className="text-white font-bold text-lg mb-2 font-square tracking-wide">FIA 2026 COMPLIENT</h4>
                            <p className="text-sm text-silver-arrow/70 font-modern">Full regulation physics including active aero and localized weather.</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-lg border border-white/5 hover:border-alpine-blue/30 transition-colors">
                            <h4 className="text-white font-bold text-lg mb-2 font-square tracking-wide">LIVE OVERRIDES</h4>
                            <p className="text-sm text-silver-arrow/70 font-modern">Inject safety cars, red flags, or sudden rain to test strategy resilience.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Visual Content - Studio Render Placeholder */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="relative"
                >
                    {/* Glass Panel Container */}
                    <div className="aspect-[4/3] rounded-sm bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-1 relative overflow-hidden group">
                        {/* Inner Frame */}
                        <div className="w-full h-full bg-black/60 relative z-10 overflow-hidden flex items-center justify-center">

                            {/* Abstract Data Overlay */}
                            <div className="absolute top-4 left-4 flex flex-col gap-1">
                                <div className="w-20 h-1 bg-alpine-blue" />
                                <span className="text-[10px] font-mono text-alpine-blue">M.CHASSIS.V26</span>
                            </div>

                            <span className="text-silver-arrow/20 font-square tracking-[1em] uppercase text-xs z-20 absolute bottom-10 animate-pulse">Scanning Geometry</span>

                            {/* Semantic Image Placeholder */}
                            <div className="w-3/4 h-3/4 bg-white/5 rounded-full blur-[80px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:bg-alpine-blue/20 transition-colors duration-700" />
                            <span className="font-square text-2xl font-bold tracking-tighter text-white z-30 uppercase">[ Studio Car Asset ]</span>

                        </div>

                        {/* Animated Border Glow */}
                        <div className="absolute inset-0 border border-alpine-blue/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-105" />
                    </div>

                    {/* Decorative Technical Lines */}
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r border-b border-alpine-blue/30" />
                    <div className="absolute -top-6 -left-6 w-20 h-20 border-l border-t border-white/10" />
                </motion.div>
            </div>
        </section>
    );
}
