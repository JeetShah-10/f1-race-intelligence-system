import React from 'react';
import { motion } from 'framer-motion';

export const PowerSection: React.FC = () => {
    return (
        <section className="relative w-full py-32 bg-[#0A0A0A] overflow-hidden">

            <div className="max-w-[1600px] mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

                {/* Content Side */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-3 py-1 mb-6 rounded border border-orange-500/30 bg-orange-500/5 text-orange-500 text-xs font-mono tracking-widest"
                    >
                        NEW POWER UNIT
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-stats text-white mb-8"
                    >
                        50% ELECTRIC <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">100% POWER</span>
                    </motion.h2>

                    <div className="space-y-8 max-w-xl">
                        <p className="text-gray-400 text-lg font-light leading-relaxed">
                            The 2026 Power Unit marks the biggest engine regulation shift in history. With the expensive MGU-H removed, the electrical power output has tripled, creating a perfect 50/50 split between internal combustion and electric energy.
                        </p>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="border-l-2 border-orange-500/50 pl-6">
                                <div className="text-3xl font-stats text-white mb-1">350 kW</div>
                                <div className="text-xs font-mono text-gray-500 tracking-widest">MGU-K POWER</div>
                            </div>
                            <div className="border-l-2 border-white/20 pl-6">
                                <div className="text-3xl font-stats text-white mb-1">1000+ HP</div>
                                <div className="text-xs font-mono text-gray-500 tracking-widest">TOTAL OUTPUT</div>
                            </div>
                        </div>

                        <div className="p-6 bg-[#111] rounded-2xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" /></svg>
                            </div>
                            <h4 className="text-white font-bold mb-2">Manual Override Mode</h4>
                            <p className="text-sm text-gray-400">
                                Drivers can deploy extra electrical power up to 355kph to attack the car ahead, replacing the old DRS system with a tactical energy boost.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Visual Side */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    <img
                        src="/assets/season2026/power-flow.png"
                        alt="2026 Power Unit Flow"
                        className="w-full h-auto object-contain drop-shadow-[0_0_80px_rgba(255,165,0,0.3)]"
                    />

                    {/* Animated Overlay Glows - positioned based on approximate diagram locations */}
                    <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-orange-500/20 blur-[60px] animate-pulse" />
                    <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-blue-500/10 blur-[60px] animate-pulse delay-700" />
                </motion.div>

            </div>
        </section>
    );
};
