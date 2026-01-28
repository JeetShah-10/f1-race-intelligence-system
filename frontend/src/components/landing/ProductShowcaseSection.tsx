import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, BarChart3, ArrowRight } from 'lucide-react';

const blocks = [
    {
        id: 'predict',
        icon: Sparkles,
        subtitle: 'Predict',
        title: 'See the race before lights out',
        description: 'AI-driven outcome predictions for every round. Lap-time estimates, podium odds, and strategy windows—all in one place.',
        href: '/predict',
        image: '/assets/ui/f1_predict_ui.png',
        imageAlt: 'Predict dashboard',
    },
    {
        id: 'simulate',
        icon: Zap,
        subtitle: 'Simulate',
        title: 'Run sandbox race scenarios',
        description: 'Set track, weather, tyres, and grid. Run thousands of simulations and compare strategies side by side.',
        href: '/simulate',
        image: '/assets/ui/f1_simulate_ui.png',
        imageAlt: 'Simulation view',
    },
    {
        id: 'analyze',
        icon: BarChart3,
        subtitle: 'Analyze',
        title: 'Driver and constructor intelligence',
        description: 'Compare drivers and teams across sectors, lap times, and telemetry. Build the insight set that matters.',
        href: '/analyze',
        image: '/assets/ui/f1_analyze_ui.png',
        imageAlt: 'Analysis view',
    },
];

export const ProductShowcaseSection: React.FC = () => {
    return (
        <section className="py-24 md:py-32 relative bg-black/20">
            <div className="max-w-6xl mx-auto px-4">
                {blocks.map((block, idx) => (
                    <motion.div
                        key={block.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6 }}
                        className={`flex flex-col gap-10 md:gap-16 mb-24 last:mb-0 ${idx % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} md:items-center`}
                    >
                        <div className="flex-1">
                            <block.icon className="w-10 h-10 text-f1-red mb-4" />
                            <p className="text-f1-red font-stats text-sm uppercase tracking-widest mb-2">{block.subtitle}</p>
                            <h2 className="text-3xl md:text-4xl font-stats font-bold text-white mb-4">{block.title}</h2>
                            <p className="text-white/70 max-w-xl mb-6">{block.description}</p>
                            <Link
                                to={block.href}
                                className="inline-flex items-center gap-2 text-f1-red font-stats text-sm uppercase tracking-wider hover:text-white transition-colors"
                            >
                                Learn more <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="flex-1">
                            <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black/40">
                                <img
                                    src={block.image}
                                    alt={block.imageAlt}
                                    loading="lazy"
                                    className="w-full h-full object-cover opacity-90"
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
