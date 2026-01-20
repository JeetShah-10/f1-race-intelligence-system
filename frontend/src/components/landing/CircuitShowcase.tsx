import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FEATURED_CIRCUITS = [
    { name: 'Bahrain', country: 'BHR', lapTime: '1:32.789', image: '/assets/circuits/bahrain-grand-prix-circuit.jpg' },
    { name: 'Monaco', country: 'MON', lapTime: '1:25.342', image: '/assets/circuits/monaco-circuit.png' },
    { name: 'Suzuka', country: 'JPN', lapTime: '1:22.456', image: '/assets/circuits/suzuka-circuit.jpeg' },
    { name: 'Silverstone', country: 'GBR', lapTime: '1:18.654', image: '/assets/circuits/silverstone-circuit.jpeg' },
    { name: 'Monza', country: 'ITA', lapTime: '1:27.890', image: '/assets/circuits/monza-circuit.jpeg' },
    { name: 'Spa', country: 'BEL', lapTime: '1:30.123', image: '/assets/circuits/spa-circuit.jpeg' },
];

export function CircuitShowcase() {
    return (
        <section className="relative w-full py-24 overflow-hidden" style={{ backgroundColor: '#0B0D10' }}>
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#CF2C28]/5 blur-[200px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <div className="flex gap-1 mb-6">
                        <div className="w-8 h-1 bg-[#CF2C28]" />
                        <div className="w-5 h-1 bg-[#CF2C28]/60" />
                        <div className="w-3 h-1 bg-[#CF2C28]/30" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                        TRACK-SPECIFIC <span className="text-white/30">OPTIMIZATION</span>
                    </h2>
                    <p className="text-white/40 max-w-xl">
                        Optimized predictions for every circuit on the F1 calendar. Setup recommendations, sector analysis, and strategy insights.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {FEATURED_CIRCUITS.map((circuit, i) => (
                        <motion.div
                            key={circuit.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative overflow-hidden cursor-pointer"
                        >
                            <div className="aspect-[4/5] relative">
                                <img
                                    src={circuit.image}
                                    alt={circuit.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-white font-bold text-sm uppercase tracking-wider">
                                            {circuit.name}
                                        </span>
                                        <span className="text-white/40 text-xs font-mono">{circuit.country}</span>
                                    </div>
                                    <div className="text-white/50 font-mono text-lg">
                                        {circuit.lapTime}
                                    </div>
                                </div>

                                <div className="absolute top-0 left-0 w-full h-1 bg-[#CF2C28] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex justify-center mt-12"
                >
                    <Link
                        to="/dashboard"
                        className="group flex items-center gap-3 px-6 py-3 border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all"
                    >
                        <span className="text-sm uppercase tracking-wider">View all 22 circuits</span>
                        <div className="w-4 h-px bg-current group-hover:w-6 transition-all" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
