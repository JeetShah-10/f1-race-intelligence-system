import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const tiers = [
    {
        id: 'free',
        name: 'Rookie',
        price: 'Free',
        audience: 'Fans & Weekend Strategists',
        features: [
            'Live Race Predictions',
            'Basic Telemetry (Speed/RPM)',
            'Driver Comparison (2 Drivers)',
            'Limited Simulation Runs (5/week)',
        ],
        cta: 'Join the Grid',
        href: '/signup',
        color: 'text-white',
        borderColor: 'border-white/10',
        image: '/assets/drivers/max-verstappen-3.png',
        imageAlt: 'Max Verstappen',
        driverStyle: 'left-[-35%] top-[-45%] scale-110 opacity-60',
        isPremium: false
    },
    {
        id: 'premium',
        name: 'Team Principal',
        price: '$19/mo',
        audience: 'Pro Analysts & Sim Racers',
        features: [
            'Unlimited Simulations',
            'Full Telemetry (Throttle, Brake, Gear)',
            'Pit Window Optimization AI',
            'Tire Degradation Models',
            'Historical Data Archive (2018-2025)'
        ],
        cta: 'Go Premium',
        href: '/pricing',
        color: 'text-f1-red',
        borderColor: 'border-f1-red/50',
        image: '/assets/drivers/fernando-alonso-2.png',
        imageAlt: 'Fernando Alonso',
        driverStyle: 'right-[-50%] top-[-45%] scale-120 opacity-80',
        isPremium: true
    }
];

export const TierSection: React.FC = () => {
    return (
        <section className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/assets/textures/carbon-forged.png')] opacity-[0.05] pointer-events-none mix-blend-overlay" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-bold font-racing text-white mb-6 tracking-tighter">
                        CHOOSE YOUR <span className="text-f1-red">COCKPIT</span>
                    </h2>
                    <p className="text-white/60 max-w-2xl mx-auto text-lg font-light">
                        From grandstand viewing to pit wall command. Select the level of intelligence you need.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    {tiers.map((tier, idx) => (
                        <motion.div
                            key={tier.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2, duration: 0.6 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 z-0 pointer-events-none overflow-visible">
                                <motion.img
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                    src={tier.image}
                                    alt={tier.imageAlt}
                                    className={`absolute w-full h-[140%] object-contain transition-transform duration-700 ease-out group-hover:scale-[1.05] ${tier.driverStyle}`}
                                    style={{
                                        maskImage: 'linear-gradient(to bottom, black 40%, transparent 95%)',
                                        WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 95%)'
                                    }}
                                />
                            </div>

                            <div className={`relative z-10 h-full flex flex-col p-8 md:p-10 rounded-3xl bg-[#0F0F0F]/80 backdrop-blur-xl border ${tier.borderColor} transition-all duration-500 group-hover:bg-[#0F0F0F]/90 ${tier.isPremium ? 'shadow-[0_0_40px_rgba(225,6,0,0.15)] group-hover:shadow-[0_0_60px_rgba(225,6,0,0.3)]' : 'shadow-2xl'}`}>

                                <div className="mb-8">
                                    <div className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold mb-4 border ${tier.isPremium ? 'bg-f1-red text-white border-f1-red' : 'bg-white/5 text-white/60 border-white/10'}`}>
                                        {tier.name}
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-4xl md:text-5xl font-stats font-bold text-white tracking-tight">
                                            {tier.price}
                                        </h3>
                                        <span className="text-white/40 text-sm font-medium uppercase tracking-wider">{tier.isPremium && '/ month'}</span>
                                    </div>
                                    <p className="text-white/50 text-sm mt-3 font-medium border-l-2 border-white/10 pl-3">
                                        {tier.audience}
                                    </p>
                                </div>

                                <ul className="space-y-4 mb-10 flex-grow">
                                    {tier.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-white/80 text-sm md:text-base group-hover:text-white transition-colors">
                                            <Check className={`w-5 h-5 ${tier.color} flex-shrink-0 mt-0.5`} />
                                            <span className="leading-snug">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to={tier.href}
                                    className={`relative overflow-hidden w-full py-5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group/btn ${tier.isPremium ? 'bg-f1-red text-white hover:bg-f1-red/90 shadow-lg hover:shadow-f1-red/40' : 'bg-white text-black hover:bg-gray-200'}`}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {tier.cta} <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                    </span>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
