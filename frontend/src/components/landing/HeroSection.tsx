import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Play } from 'lucide-react';

export const HeroSection: React.FC = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const yVisuals = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
    const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 20; 
        const y = (clientY / innerHeight - 0.5) * 20; 
        mouseX.set(x);
        mouseY.set(y);
    };

    return (
        <section
            ref={ref}
            onMouseMove={handleMouseMove}
            className="relative min-h-screen w-full overflow-hidden bg-f1-dark flex items-center pt-20 lg:pt-0"
        >
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen scale-105"
                    style={{ backgroundImage: "url('/assets/backgrounds/bg-image-1.png')" }}
                />
                <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[url('/assets/textures/carbon-forged.png')] bg-repeat" />
                <div className="absolute inset-0 bg-gradient-to-t from-f1-dark via-f1-dark/40 to-black/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-f1-dark via-transparent to-f1-dark/20" />
            </div>



            <div className="max-w-[1600px] mx-auto px-6 w-full relative z-10 h-full flex flex-col justify-center pl-[5vw]">
                <div className="grid lg:grid-cols-12 gap-8 items-center h-full">
                    <motion.div
                        style={{ y: yText }}
                        className="lg:col-span-6 flex flex-col justify-center relative z-20"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="px-2 py-1 bg-f1-red text-white text-[10px] font-bold tracking-widest uppercase rounded-sm shadow-[0_0_15px_rgba(255,30,30,0.4)]">
                                NEXT GP
                            </div>
                            <div className="h-4 w-[1px] bg-white/20" />
                            <div className="text-sm font-stats tracking-[0.2em] text-white/80 uppercase">
                                AUSTRALIAN GRAND PRIX
                            </div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-racing text-white leading-[0.85] mb-8 tracking-tighter drop-shadow-2xl">
                            <span className="block">RACE</span>
                            <span className="block">INTELLIGENCE</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-f1-red via-red-500 to-red-600">
                                REDEFINED
                            </span>
                        </h1>

                        <p className="text-lg md:text-2xl text-gray-300 max-w-xl mb-12 leading-relaxed font-light border-l-2 border-f1-red/50 pl-6 ml-1">
                            The ultimate <strong className="text-white">Neural Telemetry Engine</strong>.
                            Outsmart the grid with AI-powered race simulations and real-time predictive strategy.
                        </p>

                        <div className="flex flex-wrap gap-6">
                            <Link to="/signup">
                                <button className="group relative px-10 py-5 bg-white text-black font-bold text-lg skew-x-[-12deg] transition-all hover:bg-cyan-400 hover:shadow-[0_0_50px_rgba(0,255,255,0.5)] active:scale-95">
                                    <div className="skew-x-[12deg] flex items-center gap-2 tracking-wider">
                                        LAUNCH CONSOLE <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </button>
                            </Link>

                            <Link to="/signup">
                                <button className="group px-10 py-5 bg-white/5 border border-white/10 text-white font-stats text-sm uppercase tracking-widest hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-md">
                                    <div className="flex items-center gap-3">
                                        <Play className="w-4 h-4 fill-white/80" />
                                        LIVE TIMING
                                    </div>
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                    <div className="lg:col-span-6 relative h-full w-full flex items-end justify-center lg:justify-end">
                        <motion.div style={{ y: yVisuals }} className="relative w-full h-full flex items-end justify-center lg:justify-end pb-0 lg:pb-10">
                            <div className="absolute bottom-[-15vh] right-0 lg:right-[5%] z-30 w-auto h-[80vh] lg:h-[90vh] flex items-end justify-center pointer-events-none">
                                <motion.div
                                    className="relative h-full w-auto -mr-40 z-10" 
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 1, delay: 0.1 }}
                                >
                                    <img
                                        src="/assets/drivers/lewis-hamilton-2.png"
                                        alt="Lewis Hamilton"
                                        className="h-full w-auto object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,1)] drop-shadow-[0_0_50px_rgba(0,0,0,0.8)] filter brightness-[1.1] contrast-[1.15]"
                                        style={{
                                            maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                                            WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                                        }}
                                    />
                                </motion.div>
                                <motion.div
                                    className="relative h-full w-auto z-0"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                >
                                    <img
                                        src="/assets/drivers/charles-leclerc-2.png"
                                        alt="Charles Leclerc"
                                        className="h-full w-auto object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,1)] drop-shadow-[0_0_50px_rgba(0,0,0,0.8)] filter brightness-[1.1] contrast-[1.15]"
                                        style={{
                                            maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                                            WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                                        }}
                                    />
                                </motion.div>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent mix-blend-overlay opacity-30 pointer-events-none" />
                            </div>
                            <motion.div
                                className="relative z-0 w-[160%] lg:w-[150%] mr-[10%] lg:mr-[20%] mb-[0vh] transform scale-125 lg:scale-[1.8]"
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                            >
                                <img
                                    src="/assets/cars/ferrari-26.png"
                                    alt="Ferrari 2026"
                                    className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] opacity-90 grayscale-[20%]"
                                />
                            </motion.div>

                        </motion.div>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-f1-dark via-f1-dark/80 to-transparent z-10 pointer-events-none" />
        </section>
    );
};
