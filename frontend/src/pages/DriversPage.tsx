import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { LazyImage } from '../components/ui/LazyImage';

// Mock Data for 2026 Grid
const drivers = [
    { id: 1, name: "Charles Leclerc", team: "Ferrari", number: "16", image: "/assets/drivers/leclerc.png" },
    { id: 2, name: "Lewis Hamilton", team: "Ferrari", number: "44", image: "/assets/drivers/hamilton.png" },
    { id: 3, name: "Max Verstappen", team: "Red Bull", number: "1", image: "/assets/drivers/verstappen.png" },
    { id: 4, name: "Lando Norris", team: "McLaren", number: "4", image: "/assets/drivers/norris.png" },
    // Add more as needed
];

export const DriversPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-f1-dark text-white overflow-x-hidden selection:bg-f1-red selection:text-white">
            <Header />

            <main className="pt-32 pb-20 relative">
                {/* Background Noise */}
                <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] bg-[url('/assets/textures/noise-overlay.png')] mix-blend-overlay" />

                <div className="max-w-[1400px] mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16 border-b border-white/10 pb-8"
                    >
                        <h1 className="text-6xl md:text-9xl font-racing text-white mb-4">
                            Select <span className="text-transparent bg-clip-text bg-gradient-to-r from-f1-red to-neon-purple">Driver</span>
                        </h1>
                        <p className="text-xl text-gray-400 font-light max-w-2xl">
                            Analyze individual performance metrics, tire degradation profiles, and historical lap times.
                        </p>
                    </motion.div>

                    {/* Character Select Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {drivers.map((driver, index) => (
                            <motion.div
                                key={driver.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative h-[500px] rounded-2xl overflow-hidden bg-f1-carbon border border-white/10 hover:border-f1-red/50 transition-all duration-500 cursor-pointer"
                            >
                                {/* Driver Image (Fallback to gray silhouette if missing) */}
                                <div className="absolute inset-0 bg-gradient-to-t from-f1-dark via-transparent to-transparent z-10" />
                                <LazyImage
                                    src={driver.image}
                                    alt={driver.name}
                                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
                                />

                                {/* Info Overlay */}
                                <div className="absolute bottom-0 left-0 w-full p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="text-[100px] font-racing text-white/10 absolute -top-20 -right-4 transition-all duration-500 group-hover:text-f1-red/20 translate-x-10 group-hover:translate-x-0">
                                        {driver.number}
                                    </div>
                                    <div className="text-xs text-f1-red tracking-[0.3em] uppercase mb-1">{driver.team}</div>
                                    <h2 className="text-3xl font-racing text-white leading-none mb-4">{driver.name}</h2>

                                    {/* Stats (Hidden initially) */}
                                    <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Pace</span>
                                            <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
                                                <div className="w-[92%] h-full bg-neon-cyan" />
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Consistency</span>
                                            <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
                                                <div className="w-[88%] h-full bg-f1-red" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
