import { motion } from 'framer-motion';

const FEATURES = [
    {
        title: 'Predictive Simulation',
        subtitle: 'Monte Carlo Engine',
        description: 'Run millions of race scenarios in real-time. Analyze tire degradation curves, fuel consumption patterns, and safety car probability windows.',
        metrics: [
            { label: 'Scenarios/sec', value: '10M+' },
            { label: 'Accuracy', value: '99.2%' },
        ],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        title: 'Strategy Optimization',
        subtitle: 'Pit Wall Intelligence',
        description: 'Calculate optimal pit windows, undercut deltas, and compound choices. Factor in track position, tire cliff predictions, and weather transitions.',
        metrics: [
            { label: 'Latency', value: '<50ms' },
            { label: 'Variables', value: '2,400+' },
        ],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d="M9 17H7A5 5 0 017 7h2M15 7h2a5 5 0 010 10h-2M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        title: 'Telemetry Analysis',
        subtitle: 'Real-Time Data Streams',
        description: 'Process high-frequency sensor data from 300+ channels. Visualize brake bias, ERS deployment, and steering angle with sub-millisecond resolution.',
        metrics: [
            { label: 'Channels', value: '300+' },
            { label: 'Frequency', value: '1kHz' },
        ],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        title: 'Race Intelligence',
        subtitle: 'AI-Powered Insights',
        description: 'Machine learning models trained on 1000+ historical races. Predict overtaking probability, tire performance cliffs, and strategic pivots.',
        metrics: [
            { label: 'Historical Races', value: '1000+' },
            { label: 'Model Accuracy', value: '94.8%' },
        ],
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    },
];

export function ProductFeatures() {
    return (
        <section className="relative w-full py-24 overflow-hidden" style={{ backgroundColor: '#0B0D10' }}>
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#E10600]/5 blur-[150px] rounded-full" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#E10600]/5 blur-[150px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <div className="flex gap-1 mb-6 justify-center">
                        <div className="w-8 h-1 bg-[#E10600]" />
                        <div className="w-5 h-1 bg-[#E10600]/60" />
                        <div className="w-3 h-1 bg-[#E10600]/30" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                        PLATFORM <span className="text-white/30">CAPABILITIES</span>
                    </h2>
                    <p className="text-white/40 max-w-xl mx-auto">
                        Professional-grade motorsport intelligence built for teams, analysts, and strategists.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {FEATURES.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative"
                        >
                            <div className="relative p-8 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-sm overflow-hidden transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20">
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#E10600] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                                <div className="flex items-start gap-4 mb-6">
                                    <div className="p-3 bg-white/5 text-[#E10600] group-hover:bg-[#E10600]/10 transition-colors">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white tracking-tight">
                                            {feature.title}
                                        </h3>
                                        <span className="text-xs text-white/40 uppercase tracking-wider">
                                            {feature.subtitle}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-white/50 text-sm leading-relaxed mb-6">
                                    {feature.description}
                                </p>

                                <div className="flex gap-8 pt-4 border-t border-white/5">
                                    {feature.metrics.map((metric) => (
                                        <div key={metric.label}>
                                            <div className="text-white font-mono text-2xl font-bold">
                                                {metric.value}
                                            </div>
                                            <div className="text-white/30 text-[10px] uppercase tracking-wider">
                                                {metric.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-white/10 group-hover:border-[#E10600]/50 transition-colors" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
