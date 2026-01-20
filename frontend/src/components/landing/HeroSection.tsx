import { motion, useScroll as useFramerScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const HERITAGE = {
    ferrariRosso: '#CF2C28',
    carbonBlack: '#0B0D10',
    silverArrow: '#9FA4A8',
};

const PREMIUM_EASING = [0.17, 0.84, 0.44, 1] as const;

export function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useFramerScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });

    const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-[100vh]"
            style={{ backgroundColor: 'transparent' }}
        >
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(90deg, rgba(11,13,16,0.9) 0%, rgba(11,13,16,0.6) 40%, transparent 70%)'
                }}
            />

            <div
                className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
                style={{
                    background: 'linear-gradient(to top, rgba(11,13,16,1) 0%, transparent 100%)'
                }}
            />

            <motion.div
                style={{ opacity: contentOpacity, y: contentY }}
                className="relative z-10 h-full flex items-center"
            >
                <div className="container mx-auto px-8 md:px-16 lg:px-24">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5, ease: PREMIUM_EASING }}
                            className="flex gap-1.5 mb-8"
                        >
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.6, delay: 0.6, ease: PREMIUM_EASING }}
                                className="w-16 h-1.5 origin-left"
                                style={{ backgroundColor: HERITAGE.ferrariRosso }}
                            />
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.6, delay: 0.7, ease: PREMIUM_EASING }}
                                className="w-10 h-1.5 origin-left"
                                style={{ backgroundColor: `${HERITAGE.ferrariRosso}99` }}
                            />
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.6, delay: 0.8, ease: PREMIUM_EASING }}
                                className="w-6 h-1.5 origin-left"
                                style={{ backgroundColor: `${HERITAGE.ferrariRosso}50` }}
                            />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 60 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.8, ease: PREMIUM_EASING }}
                            className="mb-6"
                        >
                            <span className="block font-bold text-6xl md:text-7xl lg:text-8xl tracking-tighter text-white leading-[0.9]">
                                APEX
                            </span>
                            <span
                                className="block font-light text-xl md:text-2xl tracking-[0.4em] mt-3"
                                style={{ color: HERITAGE.silverArrow }}
                            >
                                INTELLIGENCE
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            transition={{ duration: 1, delay: 1.2, ease: PREMIUM_EASING }}
                            className="text-base md:text-lg tracking-[0.15em] uppercase mb-10"
                            style={{ color: HERITAGE.silverArrow }}
                        >
                            Predictive Motorsport Simulation
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.5, ease: PREMIUM_EASING }}
                            className="flex gap-4"
                        >
                            <Link
                                to="/login"
                                className="group relative px-6 py-3 md:px-8 md:py-4 text-white text-sm md:text-base font-bold uppercase tracking-wider overflow-hidden transition-all duration-300 hover:brightness-110"
                                style={{ backgroundColor: HERITAGE.ferrariRosso }}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Enter Simulation
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                            </Link>
                            <button
                                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                                className="px-6 py-3 md:px-8 md:py-4 border text-sm md:text-base font-bold uppercase tracking-wider transition-all duration-300 hover:bg-white/5"
                                style={{
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    color: HERITAGE.silverArrow
                                }}
                            >
                                Watch Demo
                            </button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center"
                >
                    <span
                        className="text-[10px] tracking-[0.3em] uppercase mb-2"
                        style={{ color: `${HERITAGE.silverArrow}80` }}
                    >
                        Scroll
                    </span>
                    <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                        <rect
                            x="1" y="1" width="14" height="22" rx="7"
                            stroke={HERITAGE.silverArrow}
                            strokeWidth="1"
                            strokeOpacity="0.3"
                        />
                        <motion.circle
                            cx="8"
                            cy="8"
                            r="2"
                            fill={HERITAGE.silverArrow}
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </svg>
                </motion.div>
            </motion.div>
        </section>
    );
}
