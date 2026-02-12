import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart3, Zap, Microscope, Trophy, ArrowRight } from 'lucide-react';

const features = [
    {
        title: 'Predict',
        description: 'AI-driven race outcome predictions. Podium odds, lap-time estimates, and strategy windows for every round.',
        icon: BarChart3,
        href: '/predict',
        accent: 'text-neon-cyan',
        border: 'border-neon-cyan/20',
    },
    {
        title: 'Simulate',
        description: 'Run sandbox scenarios: set track, weather, tyres, and grid. Compare strategies across thousands of simulations.',
        icon: Zap,
        href: '/simulate',
        accent: 'text-f1-red',
        border: 'border-f1-red/20',
    },
    {
        title: 'Analyze',
        description: 'Compare drivers and constructors across sectors, lap times, and telemetry. Build the insight set that matters.',
        icon: Microscope,
        href: '/analyze',
        accent: 'text-neon-yellow',
        border: 'border-neon-yellow/20',
    },
    {
        title: 'Standings',
        description: 'Season and round standings, driver and constructor points. Your mission control for the 2026 grid.',
        icon: Trophy,
        href: '/dashboard',
        accent: 'text-white',
        border: 'border-white/10',
    },
];

export const FeaturesSection: React.FC = () => {
    return (
        <section className="py-32 relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="mb-20 flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-1 bg-f1-red rounded-full" />
                            <span className="text-f1-red text-xs tracking-[0.2em] font-stats uppercase">Capabilities</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-racing text-white">
                            PREDICT · <span className="text-outline">SIMULATE</span> · ANALYZE
                        </h2>
                    </div>
                    <p className="text-gray-400 max-w-md text-right mt-6 md:mt-0 font-light">
                        Race intelligence for fans and strategists. Every circuit, every driver, one platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <FeatureCard key={feature.title} feature={feature} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({ feature, index }: { feature: (typeof features)[0]; index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative group rounded-3xl overflow-hidden bg-white/[0.02] border ${feature.border} backdrop-blur-sm hover:translate-y-[-5px] transition-transform duration-300`}
        >
            <div className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl bg-white/5 backdrop-blur-md ${feature.accent}`}>
                        <feature.icon className="w-8 h-8" />
                    </div>
                    <Link
                        to={feature.href}
                        className="text-white/20 group-hover:text-white transition-colors"
                        aria-label={`Learn more about ${feature.title}`}
                    >
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
                <h3 className="text-2xl font-bold font-stats text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 group-hover:text-white/80 transition-colors text-sm flex-1">{feature.description}</p>
                <Link
                    to={feature.href}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-stats uppercase tracking-wider text-white/60 group-hover:text-f1-red transition-colors"
                >
                    Learn more <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </motion.div>
    );
};
