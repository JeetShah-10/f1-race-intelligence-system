import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDashboardStore, selectNextRace } from '../../store';

function LiveCountdown({ countdown }: { countdown: { days: number; hours: number; minutes: number } }) {
    const [time, setTime] = useState({
        days: countdown.days,
        hours: countdown.hours,
        mins: countdown.minutes,
        secs: 0
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prev) => {
                let { days, hours, mins, secs } = prev;
                secs--;
                if (secs < 0) { secs = 59; mins--; }
                if (mins < 0) { mins = 59; hours--; }
                if (hours < 0) { hours = 23; days--; }
                return { days, hours, mins, secs };
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-3 font-mono font-light">
            <div className="text-center">
                <div className="text-2xl font-bold text-white">{time.days}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider">Days</div>
            </div>
            <span className="text-white/30">:</span>
            <div className="text-center">
                <div className="text-2xl font-bold text-white">{String(time.hours).padStart(2, '0')}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider">Hrs</div>
            </div>
            <span className="text-white/30">:</span>
            <div className="text-center">
                <div className="text-2xl font-bold text-white">{String(time.mins).padStart(2, '0')}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider">Min</div>
            </div>
            <span className="text-white/30">:</span>
            <div className="text-center">
                <motion.div
                    className="text-2xl font-bold text-[#CF2C28]"
                    animate={{ opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                >
                    {String(time.secs).padStart(2, '0')}
                </motion.div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider">Sec</div>
            </div>
        </div>
    );
}

export function NextRaceHero() {
    const nextRace = useDashboardStore(selectNextRace);

    const characteristics = [
        nextRace.trackCharacteristics.downforce + ' Downforce',
        nextRace.trackCharacteristics.overtaking + ' Overtaking',
        nextRace.trackCharacteristics.tyreWear + ' Tyre Wear',
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 relative overflow-hidden border border-white/10 min-h-[360px]"
        >
            <img
                src={nextRace.image}
                alt={nextRace.name}
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D10] via-[#0B0D10]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-transparent to-transparent" />

            <div className="relative z-10 h-full p-6 md:p-8 flex flex-col justify-between">
                <div>
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block px-2 py-1 bg-[#CF2C28] text-white text-[10px] font-bold uppercase tracking-wider"
                    >
                        Next Race
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl md:text-5xl font-bold text-white mt-3 tracking-tight uppercase"
                        style={{ fontFamily: 'Raceburst, Rajdhani, sans-serif' }}
                    >
                        {nextRace.name}
                    </motion.h2>
                    <p className="text-white/50 mt-1 text-sm md:text-base">
                        {nextRace.circuit}, {nextRace.country} • {nextRace.weather}
                    </p>

                    <div className="flex flex-wrap gap-2 my-4">
                        {characteristics.map((char: string, i: number) => (
                            <motion.span
                                key={char}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white/70 text-xs border border-white/10"
                            >
                                {char}
                            </motion.span>
                        ))}
                    </div>
                </div>

                <div className="my-4">
                    <LiveCountdown countdown={nextRace.countdown} />
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 bg-[#CF2C28] text-white font-bold uppercase tracking-wider text-sm"
                    >
                        Predict Now
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 border border-white/20 text-white/70 font-medium text-sm hover:bg-white/5 transition-all"
                    >
                        Circuit Intel
                    </motion.button>
                    <div className="ml-auto text-right hidden md:block">
                        <div className="text-[10px] text-white/40 uppercase">Model Confidence</div>
                        <div className="text-lg font-mono text-[#00D2BE]">{(nextRace.modelConfidence * 100).toFixed(0)}%</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
