import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Zap, Weight, Wind, Gauge } from 'lucide-react';

const stats = [
    { icon: Weight, label: 'LIGHTER', value: '-30', unit: 'KG', color: 'from-cyan-500 to-blue-500', desc: 'Weight reduction' },
    { icon: Zap, label: 'ELECTRIC', value: '50', unit: '%', color: 'from-orange-500 to-yellow-500', desc: 'Power from MGU' },
    { icon: Wind, label: 'ACTIVE AERO', value: 'Z/X', unit: 'MODE', color: 'from-green-500 to-emerald-500', desc: 'Driver control' },
    { icon: Gauge, label: 'TOP SPEED', value: '355', unit: 'KPH', color: 'from-red-500 to-rose-500', desc: 'In X-Mode' },
];

export const Season2026Hero: React.FC = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const yText = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section
            ref={ref}
            className="relative min-h-screen w-full overflow-hidden bg-[#030303]"
        >
            {/* Background */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: "url('/assets/season2026/tech-bg.png')" }}
                />
                <div className="absolute inset-0 bg-[url('/assets/season2026/carbon-fibre.jpeg')] opacity-[0.02] mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030303]/70 to-[#030303]" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-6 min-h-screen flex flex-col justify-center py-24">

                {/* Title Section */}
                <motion.div
                    style={{ y: yText, opacity }}
                    className="text-center mb-16"
                >
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block px-4 py-1.5 bg-f1-red text-white text-[10px] font-bold tracking-[0.3em] uppercase rounded mb-6"
                    >
                        FIA 2026 REGULATIONS
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-8xl sm:text-9xl md:text-[12rem] font-stats text-white leading-[0.85] mb-4"
                    >
                        2026
                    </motion.h1>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-racing text-white/80 mb-6"
                    >
                        THE NEW ERA
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed"
                    >
                        The most significant regulation change in Formula 1 history.
                        Lighter cars, revolutionary power units, and driver-controlled aerodynamics.
                    </motion.p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                            <stat.icon className="w-5 h-5 text-gray-500 mx-auto mb-3" />
                            <div className="text-3xl font-stats text-white mb-1">
                                {stat.value}<span className="text-base text-gray-400 ml-1">{stat.unit}</span>
                            </div>
                            <div className="text-[10px] font-mono text-gray-500 tracking-widest">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-col items-center gap-2 text-gray-500 mt-16"
                >
                    <span className="text-[10px] font-mono tracking-widest">SCROLL TO EXPLORE</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <ChevronDown className="w-5 h-5" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
