import { motion, type Variants } from 'framer-motion'

export function HeroOverlay() {
    // Motion sequence based on 'animation_directives.md'
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.5
            }
        }
    }

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 10 } // "F1 Spring" feel
        }
    }

    return (
        <motion.main
            className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-12 pointer-events-none"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Header / Top Bar */}
            <motion.header variants={itemVariants} className="flex justify-between items-start">
                <div className="glass-panel px-6 py-3 pointer-events-auto">
                    <h1 className="font-square text-3xl md:text-5xl font-bold tracking-widest uppercase italic text-white">
                        F1 <span className="text-ferrari-red">INTEL</span>
                    </h1>
                    <p className="font-modern text-xs md:text-sm text-silver-arrow tracking-widest mt-1 uppercase">
                        Scuderia Telemetry System v2.6
                    </p>
                </div>

                <div className="glass-panel px-4 py-2 flex items-center gap-4 hidden md:flex">
                    <div className="flex flex-col items-end">
                        <span className="font-modern text-[10px] text-white/50 uppercase tracking-wider">Session</span>
                        <span className="font-square text-lg text-sector-green font-bold leading-none">FP3 LIVE</span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex flex-col items-end">
                        <span className="font-modern text-[10px] text-white/50 uppercase tracking-wider">Track Temp</span>
                        <span className="font-square text-lg text-white font-bold leading-none">32°C</span>
                    </div>
                </div>
            </motion.header>

            {/* Main Content / Center - often empty to show car, or side aligned */}
            <div className="flex-1" />

            {/* Bottom Control / Info Bar */}
            <motion.footer variants={itemVariants} className="flex flex-col md:flex-row justify-between items-end gap-6">

                {/* Telemetry Stats Card */}
                <div className="glass-panel p-6 w-full md:w-80 pointer-events-auto backdrop-blur-2xl">
                    <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                        <span className="font-modern text-xs text-turbine-blue uppercase tracking-widest">Active Analysis</span>
                        <span className="font-square text-xs text-silver-arrow bg-white/5 px-2 py-0.5 rounded">MCL-38</span>
                    </div>

                    <div className="space-y-4 font-square">
                        <div className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded transition-colors">
                            <span className="text-white/60">Aero Efficiency</span>
                            <span className="text-white font-bold tabular-nums">98.2%</span>
                        </div>
                        <div className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded transition-colors">
                            <span className="text-white/60">Tire Deg</span>
                            <span className="text-tire-c3 font-bold tabular-nums">LOW</span>
                        </div>
                        <div className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded transition-colors">
                            <span className="text-white/60">ERS Deploy</span>
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-status-ers w-3/4 animate-pulse" />
                                </div>
                                <span className="text-status-ers font-bold text-xs">75%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="pointer-events-auto">
                    <button className="bg-ferrari-red hover:bg-red-600 text-white font-square font-bold text-lg px-12 py-4 roundedclip shadow-lg shadow-ferrari-red/20 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest flex items-center gap-3 group">
                        <span>Initialize SIM</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                </div>
            </motion.footer>
        </motion.main>
    )
}
