import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const modes = {
    Z: {
        name: 'Z-MODE',
        label: 'DOWNFORCE',
        description: 'Wing angled for maximum grip through corners and braking zones.',
        color: '#E10600',
        stats: { drag: '100%', grip: '100%', speed: '310' },
    },
    X: {
        name: 'X-MODE',
        label: 'SPEED',
        description: 'Flap opens flat, reducing drag by 55% for straight-line speed up to 355 KPH.',
        color: '#00F0FF',
        stats: { drag: '45%', grip: '55%', speed: '355' },
    }
};

export const AeroSection: React.FC = () => {
    const [activeMode, setActiveMode] = useState<'Z' | 'X'>('Z');
    const mode = modes[activeMode];

    return (
        <section className="relative w-full py-20 bg-[#030303] overflow-hidden">

            <div className="max-w-6xl mx-auto px-6">

                {/* Header - Compact */}
                <div className="text-center mb-10">
                    <span className="text-[10px] font-mono text-gray-500 tracking-[0.3em]">
                        DRIVER-CONTROLLED
                    </span>
                    <h2 className="text-4xl md:text-5xl font-racing text-white mt-2">
                        ACTIVE <span className="text-neon-cyan">AERO</span>
                    </h2>
                </div>

                {/* Main Content - Side by Side */}
                <div className="grid lg:grid-cols-2 gap-8 items-center">

                    {/* Left: Animated Wing Visual */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10">
                            {/* Animated WebP */}
                            <img
                                src="/assets/season2026/car-wing.webp"
                                alt="F1 2026 Active Rear Wing Animation"
                                className="w-full h-auto"
                            />

                            {/* Mode Indicator Overlay */}
                            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                <motion.div
                                    animate={{ backgroundColor: mode.color }}
                                    className="w-2 h-2 rounded-full"
                                />
                                <span className="text-xs font-mono text-white/70">
                                    {mode.name}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Controls & Info */}
                    <div className="space-y-6">

                        {/* Mode Selector */}
                        <div className="flex gap-3">
                            {(['Z', 'X'] as const).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setActiveMode(m)}
                                    className={`flex-1 py-4 px-5 rounded-xl border-2 transition-all duration-300 ${activeMode === m
                                            ? 'border-opacity-100'
                                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                                        }`}
                                    style={{
                                        borderColor: activeMode === m ? modes[m].color : undefined,
                                        backgroundColor: activeMode === m ? `${modes[m].color}10` : undefined,
                                    }}
                                >
                                    <div className="text-left">
                                        <div className="text-lg font-stats text-white">{modes[m].name}</div>
                                        <div className="text-xs text-gray-500">{modes[m].label}</div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                                <div className="text-[10px] font-mono text-gray-500 mb-1">DRAG</div>
                                <motion.div
                                    key={`drag-${activeMode}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-xl font-stats text-white"
                                >
                                    {mode.stats.drag}
                                </motion.div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                                <div className="text-[10px] font-mono text-gray-500 mb-1">GRIP</div>
                                <motion.div
                                    key={`grip-${activeMode}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-xl font-stats text-white"
                                >
                                    {mode.stats.grip}
                                </motion.div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                                <div className="text-[10px] font-mono text-gray-500 mb-1">TOP SPEED</div>
                                <motion.div
                                    key={`speed-${activeMode}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-xl font-stats"
                                    style={{ color: mode.color }}
                                >
                                    {mode.stats.speed}<span className="text-sm text-gray-500 ml-1">KPH</span>
                                </motion.div>
                            </div>
                        </div>

                        {/* Description */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeMode}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white/5 rounded-xl p-5 border border-white/5"
                            >
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {mode.description}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Key Difference Note */}
                        <p className="text-xs text-gray-600 text-center">
                            <span className="text-f1-red">NEW:</span> Unlike DRS, drivers can activate this anywhere on circuit.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
