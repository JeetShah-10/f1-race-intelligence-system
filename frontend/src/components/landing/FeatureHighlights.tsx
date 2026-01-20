import { motion } from 'framer-motion';

const features = [
    {
        title: "PREDICTIVE SIMULATION",
        description: "Run Monte Carlo simulations on race outcomes based on real-time tire degradation and weather data.",
        icon: (
            <svg className="w-6 h-6 text-turbine-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        color: "group-hover:text-turbine-blue",
        border: "group-hover:border-turbine-blue/50"
    },
    {
        title: "LIVE TELEMETRY",
        description: "Visualize throttle, brake, and ERS deployment with distinct motorsport semantics and sub-second latency.",
        icon: (
            <svg className="w-6 h-6 text-sector-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        color: "group-hover:text-sector-purple",
        border: "group-hover:border-sector-purple/50"
    },
    {
        title: "STRATEGY OVERRIDES",
        description: "Take the pit wall seat. Adjust stopping laps, compounds, and aggression levels to alter the race history.",
        icon: (
            <svg className="w-6 h-6 text-industrial-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        ),
        color: "group-hover:text-industrial-amber",
        border: "group-hover:border-industrial-amber/50"
    }
];

export function FeatureHighlights() {
    return (
        <section className="relative w-full py-40 bg-carbon-black flex justify-center">
            <div className="container mx-auto px-6">
                <div className="mb-20 flex flex-col items-center text-center">
                    <h3 className="text-ferrari-red font-bold tracking-[0.2em] uppercase mb-4 text-xs font-square">Platform Modules</h3>
                    <h2 className="text-5xl text-white font-bold font-square tracking-tight">ENGINEERED FOR <span className="text-silver-arrow">PRECISION</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.6 }}
                            className={`p-8 bg-gradient-to-br from-asphalt to-black/80 border border-white/5 rounded-none hover:bg-asphalt hover:border-white/20 transition-all duration-500 group cursor-default relative overflow-hidden flex flex-col items-start`}
                        >
                            {/* Colored Top Bar */}
                            <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out`} />

                            <div className={`mb-8 p-4 bg-white/5 rounded-full ring-1 ring-white/10 ${feature.color} transition-colors duration-300`}>
                                {feature.icon}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4 font-square tracking-wide uppercase group-hover:translate-x-1 transition-transform duration-300">{feature.title}</h3>
                            <p className="text-silver-arrow/60 font-modern text-sm leading-7 group-hover:text-silver-arrow transition-colors duration-300">
                                {feature.description}
                            </p>

                            {/* Corner Accents */}
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/10 group-hover:border-white/40 transition-colors" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
