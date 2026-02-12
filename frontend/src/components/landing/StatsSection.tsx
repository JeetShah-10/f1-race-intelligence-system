import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CountUpNumber } from '../ui/CountUpNumber';

const stats = [
    { label: 'Circuits', value: 24, suffix: '', color: 'text-white' },
    { label: 'Drivers in our data', value: 20, suffix: '+', color: 'text-f1-red' },
    { label: 'Season', value: 2026, suffix: '', color: 'text-white' },
    { label: 'Simulations run', value: null as number | null, display: '10k+', color: 'text-white' },
];

export const StatsSection: React.FC = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section ref={ref} className="py-24 border-y border-white/5 relative bg-black/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
                    {stats.map((stat, i) => (
                        <div key={stat.label} className="py-4 md:py-0 px-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                className={`text-4xl md:text-5xl font-stats font-bold ${stat.color} mb-2`}
                            >
                                {stat.value != null ? (
                                    <CountUpNumber
                                        target={stat.value}
                                        duration={1800}
                                        suffix={stat.suffix}
                                        triggerOnView
                                        className={stat.color}
                                    />
                                ) : (
                                    stat.display
                                )}
                            </motion.div>
                            <div className="text-sm text-white/40 uppercase tracking-widest font-medium font-stats">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
