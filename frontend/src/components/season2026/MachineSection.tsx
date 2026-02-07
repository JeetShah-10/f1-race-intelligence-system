import React from 'react';
import { motion } from 'framer-motion';

export const MachineSection: React.FC = () => {
    return (
        <section className="relative w-full py-32 bg-[#0A0A0A] overflow-hidden">

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="mb-20 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-racing text-white mb-6"
                    >
                        THE <span className="text-f1-red">MACHINE</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto"
                    >
                        Lighter, smaller, and more agile. The 2026 regulations prioritize racability with significant reductions in weight and dimensions.
                    </motion.p>
                </div>

                {/* Comparison Grid */}
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* 2025 Spec Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-white/5 rounded-3xl transform skew-y-2 group-hover:bg-white/10 transition-colors duration-500" />
                        <div className="relative p-8 md:p-12 border border-white/10 rounded-3xl bg-[#0F0F0F]">
                            <div className="absolute top-6 right-6 px-3 py-1 bg-white/10 rounded text-xs font-mono text-white/50">CURRENT ERA</div>
                            <h3 className="text-3xl font-stats text-white/40 mb-2">2025 SPEC</h3>

                            <img
                                src="/assets/season2026/mercedes-2025.png"
                                alt="2025 F1 Car"
                                className="w-full h-auto object-contain my-8 opacity-60 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                            />

                            <div className="space-y-4 font-stats text-sm">
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-500">MIN WEIGHT</span>
                                    <span className="text-white">798 KG</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-500">MAX WIDTH</span>
                                    <span className="text-white">2000 MM</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-500">MAX WHEELBASE</span>
                                    <span className="text-white">3600 MM</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 2026 Spec Card - Highlighted */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-f1-red/10 rounded-3xl transform -skew-y-2 group-hover:bg-f1-red/20 transition-colors duration-500 box-shadow-[0_0_50px_rgba(225,6,0,0.2)]" />
                        <div className="relative p-8 md:p-12 border border-f1-red/30 rounded-3xl bg-[#120505] shadow-[0_0_30px_rgba(225,6,0,0.1)]">
                            <div className="absolute top-6 right-6 px-3 py-1 bg-f1-red text-white rounded text-xs font-bold font-mono shadow-[0_0_10px_#e10600]">FUTURE ERA</div>
                            <h3 className="text-3xl font-stats text-white mb-2">2026 SPEC</h3>

                            <img
                                src="/assets/season2026/mercedes-2026.png"
                                alt="2026 F1 Car"
                                className="w-full h-auto object-contain my-8"
                            />

                            <div className="space-y-4 font-stats text-sm">
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-400">MIN WEIGHT</span>
                                    <span className="text-f1-red font-bold">768 KG <span className="text-xs ml-2 text-f1-red/50">(-30 KG)</span></span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-400">MAX WIDTH</span>
                                    <span className="text-f1-red font-bold">1900 MM <span className="text-xs ml-2 text-f1-red/50">(-100 MM)</span></span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-gray-400">MAX WHEELBASE</span>
                                    <span className="text-f1-red font-bold">3400 MM <span className="text-xs ml-2 text-f1-red/50">(-200 MM)</span></span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};
