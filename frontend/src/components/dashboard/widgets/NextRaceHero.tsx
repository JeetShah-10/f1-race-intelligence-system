import React from 'react';
import { motion } from 'framer-motion';
import { useDashboardStore, selectNextRace } from '../../../store/useDashboardStore';
import { CountUpNumber } from '../../ui/CountUpNumber';
import { Link } from 'react-router-dom';

export const NextRaceHero: React.FC = () => {
    const nextRace = useDashboardStore(selectNextRace);

    if (!nextRace) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-full min-h-[280px] rounded-2xl overflow-hidden group"
        >

            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${nextRace.image || '/assets/circuits/default.webp'})` }}
            />


            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />


            {nextRace.mapImage && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[70%] h-[70%] opacity-20 pointer-events-none mix-blend-screen overflow-hidden">
                    <motion.img
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        src={nextRace.mapImage}
                        alt="Track Map"
                        className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent w-full h-[20%] animate-scanline pointer-events-none" />
                </div>
            )}


            <div className="relative h-full p-6 flex flex-col justify-end">

                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-[#E10600]/90 text-white text-xs font-semibold uppercase tracking-wider">
                        Next Race
                    </span>
                </div>


                <div className="absolute top-4 right-4 flex items-center gap-3">
                    <div className="text-center">
                        <CountUpNumber
                            target={nextRace.countdown?.days || 0}
                            className="text-2xl font-bold font-mono text-white"
                            duration={1500}
                        />
                        <span className="text-white/50 text-xs block">Days</span>
                    </div>
                    <span className="text-white/30 text-2xl font-mono">:</span>
                    <div className="text-center">
                        <CountUpNumber
                            target={nextRace.countdown?.hours || 0}
                            className="text-2xl font-bold font-mono text-white"
                            duration={1500}
                        />
                        <span className="text-white/50 text-xs block">Hrs</span>
                    </div>
                    <span className="text-white/30 text-2xl font-mono">:</span>
                    <div className="text-center">
                        <CountUpNumber
                            target={nextRace.countdown?.minutes || 0}
                            className="text-2xl font-bold font-mono text-white"
                            duration={1500}
                        />
                        <span className="text-white/50 text-xs block">Min</span>
                    </div>
                </div>


                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white font-racing">
                        {nextRace.name}
                    </h2>
                    <p className="text-white/60">
                        {nextRace.circuit} • {nextRace.country}
                    </p>
                </div>


                <div className="flex items-center gap-4 mt-4">
                    {nextRace.weather && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10">
                            <span className="text-white/80 text-sm">{nextRace.weather}</span>
                        </div>
                    )}
                    {nextRace.trackCharacteristics && (
                        <>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10">
                                <span className="text-white/50 text-xs">Downforce:</span>
                                <span className="text-white/80 text-sm font-mono">{nextRace.trackCharacteristics.downforce}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10">
                                <span className="text-white/50 text-xs">Overtaking:</span>
                                <span className="text-white/80 text-sm font-mono">{nextRace.trackCharacteristics.overtaking}</span>
                            </div>
                        </>
                    )}
                </div>


                <Link
                    to="/simulate"
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#E10600] hover:bg-[#FF1801] text-white font-semibold text-sm transition-colors w-fit"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5,3 19,12 5,21" />
                    </svg>
                    Simulate This Race
                </Link>
            </div>
        </motion.div>
    );
};

export default NextRaceHero;
