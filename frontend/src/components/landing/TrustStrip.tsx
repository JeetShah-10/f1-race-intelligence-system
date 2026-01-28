import React from 'react';
import { motion } from 'framer-motion';

const TEAM_LOGOS = [
    { src: '/assets/logos/ferrari-logo-small.png', alt: 'Ferrari', name: 'Ferrari' },
    { src: '/assets/logos/redbull-logo-small.png', alt: 'Red Bull', name: 'Red Bull' },
    { src: '/assets/logos/mercedes-logo-small.png', alt: 'Mercedes', name: 'Mercedes' },
    { src: '/assets/logos/mclaren-logo-small.png', alt: 'McLaren', name: 'McLaren' },
    { src: '/assets/logos/aston-martin-small.png', alt: 'Aston Martin', name: 'Aston Martin' },
    { src: '/assets/logos/alpine-logo-small.png', alt: 'Alpine', name: 'Alpine' },
    { src: '/assets/logos/williams-logo-2.png', alt: 'Williams', name: 'Williams' },
    { src: '/assets/logos/haas-logo-small.png', alt: 'Haas', name: 'Haas' },
    { src: '/assets/logos/racingbulls-logo-small.png', alt: 'Racing Bulls', name: 'Racing Bulls' },
    { src: '/assets/logos/audi-logo.png', alt: 'Audi', name: 'Audi' },
    { src: '/assets/logos/cadillac-logo-small.webp', alt: 'Cadillac', name: 'Cadillac' },
].map((l) => ({ ...l, fallback: l.src }));

export const TrustStrip: React.FC = () => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="py-12 border-y border-white/10 relative z-20 overflow-hidden"
        >
            <div className="absolute inset-0 bg-black/60 pointer-events-none" />

            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('/assets/textures/carbon-forged.png')] bg-repeat pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">

                <div className="text-center md:text-left md:w-auto shrink-0 border-b md:border-b-0 md:border-r border-white/10 padding-b-6 md:pb-0 md:pr-12">
                    <p className="text-white/40 font-mono text-xs uppercase tracking-[0.3em] mb-2">Data Coverage</p>
                    <div className="text-3xl font-black text-white tracking-tight">
                        <span className="text-f1-red">100%</span> 2026 GRID
                    </div>
                </div>

                <div className="flex-1 flex flex-wrap items-center justify-center md:justify-end gap-x-16 gap-y-12">
                    {TEAM_LOGOS.map((logo) => {
                        const isLargeLogo = logo.name === 'Red Bull' || logo.name === 'Aston Martin';
                        return (
                            <div
                                key={logo.name}
                                className="group relative flex items-center justify-center p-2 transition-all duration-300"
                            >
                                <div className="absolute -inset-4 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />

                                <img
                                    src={logo.src}
                                    alt={logo.alt}
                                    loading="lazy"
                                    className={`${isLargeLogo ? 'h-16 md:h-20' : 'h-12 md:h-16'} w-auto object-contain transition-all duration-300 filter hover:scale-110`}
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        if (target.src !== logo.fallback) {
                                            target.src = logo.fallback;
                                        }
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.section>
    );
};
