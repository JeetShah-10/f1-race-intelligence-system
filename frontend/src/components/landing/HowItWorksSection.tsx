import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Database, Sliders, Trophy, ArrowRight } from 'lucide-react';

const steps = [
    {
        id: "01",
        title: "Data Ingestion",
        subtitle: "Real-Time Telemetry",
        description: "Ingest live timing, tire degradation, and weather data directly from the track into our analytics engine.",
        icon: Database,
        color: "text-blue-400",
        delay: 0,
        image: "/assets/ui/f1_telemetry_ui.png",
        imageAlt: "F1 Telemetry Interface",
        driverImage: "/assets/drivers/lando-norris-3.png",
        driverAlt: "Lando Norris",
        driverStyle: "left-[-85%] top-[-35%]"
    },
    {
        id: "02",
        title: "Strategy Config",
        subtitle: "Define Variables",
        description: "Input tire compounds, pit windows, and fuel loads. Configure safety car probabilities and rival team strategies.",
        icon: Sliders,
        color: "text-purple-400",
        delay: 0.2,
        image: "/assets/ui/f1_strategy_ui.png",
        imageAlt: "Strategy Configuration UI",
    },
    {
        id: "03",
        title: "Race Simulation",
        subtitle: "Predict Outcomes",
        description: "Run thousands of Monte Carlo simulations to generate winning probability curves and optimal pit lap targets.",
        icon: Trophy,
        color: "text-f1-red",
        delay: 0.4,
        image: "/assets/ui/f1_simulation_ui.png",
        imageAlt: "Simulation Results Graph",
        driverImage: "/assets/drivers/carlos-sainz-2.png",
        driverAlt: "Carlos Sainz",
        driverStyle: "left-[15%] top-[-30%]"
    }
];

export const HowItWorksSection: React.FC = () => {
    return (
        <section className="relative py-20 bg-[#080808] overflow-hidden">
            <div
                className="absolute inset-0 opacity-20 mix-blend-overlay"
                style={{
                    backgroundImage: "url('/assets/backgrounds/pit-lane-dark.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-bold font-racing text-white mb-6 tracking-tighter"
                    >
                        HOW THE <span className="text-f1-red">INTELLIGENCE MODEL</span> WORKS
                    </motion.h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg md:text-xl font-light">
                        A high-fidelity simulation engine that transforms raw telemetry into championship-winning strategies.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-blue-500/0 via-white/20 to-f1-red/0" />

                    {steps.map((step) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: step.delay }}
                            className="relative"
                        >
                            <div className="relative group min-h-[420px] flex flex-col justify-center">

                                {step.driverImage && (
                                    <div className={`absolute w-[160%] h-[120%] z-0 pointer-events-none ${step.driverStyle || 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'}`}>
                                        <img
                                            src={step.driverImage}
                                            alt={step.driverAlt}
                                            className="w-full h-full object-contain opacity-100 transition-all duration-700 ease-out"
                                            style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
                                        />
                                    </div>
                                )}

                                <div className="relative z-10 w-full bg-[#0F0F0F]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl group-hover:border-white/20 transition-all duration-500">

                                    <div className="absolute top-0 right-0 p-6 flex justify-end">
                                        <div className="w-16 h-16 rounded-xl bg-[#0a0a0a]/50 border border-white/10 flex items-center justify-center font-stats text-2xl font-bold text-white shadow-lg">
                                            <span className={step.color}>{step.id}</span>
                                        </div>
                                    </div>

                                    <div className="p-6 pt-10">
                                        <div className="w-full mb-6 rounded-xl overflow-hidden border border-white/10 aspect-video bg-black/40 shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                                            <img
                                                src={step.image}
                                                alt={step.imageAlt}
                                                loading="lazy"
                                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>

                                        <div className="text-center relative">
                                            <h3 className="text-xl font-bold text-white mb-2 font-racing tracking-wide uppercase flex items-center justify-center gap-2">
                                                <step.icon className={`w-4 h-4 ${step.color}`} />
                                                {step.title}
                                            </h3>
                                            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 font-mono">
                                                {step.subtitle}
                                            </div>
                                            <p className="text-gray-400 leading-relaxed text-sm font-medium">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-f1-red to-transparent group-hover:w-full transition-all duration-700 opacity-0 group-hover:opacity-100" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center relative z-10"
                >
                    <Link
                        to="/simulate"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-f1-red hover:bg-f1-red/90 text-white font-bold rounded-full transition-all shadow-[0_0_30px_rgba(225,6,0,0.3)] hover:shadow-[0_0_50px_rgba(225,6,0,0.5)]"
                    >
                        START YOUR FIRST SIMULATION
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};
