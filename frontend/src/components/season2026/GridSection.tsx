import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// 2026 F1 Driver Lineups (Source: formula1.com, January 2026)
const teams = [
    { name: "FERRARI", car: "/assets/cars/ferrari-26.png", color: "#FF0000", driver1: "Lewis Hamilton", driver2: "Charles Leclerc" },
    { name: "RED BULL", car: "/assets/cars/redbull-26.png", color: "#1E41FF", driver1: "Max Verstappen", driver2: "Isack Hadjar" },
    { name: "McLAREN", car: "/assets/cars/mclaren-26.png", color: "#FF8000", driver1: "Lando Norris", driver2: "Oscar Piastri" },
    { name: "MERCEDES", car: "/assets/season2026/mercedes-2026.png", color: "#00A19B", driver1: "George Russell", driver2: "Kimi Antonelli" },
    { name: "ASTON MARTIN", car: "/assets/cars/aston-martin-26.png", color: "#006F62", driver1: "Fernando Alonso", driver2: "Lance Stroll" },
    { name: "ALPINE", car: "/assets/cars/alpine-26.png", color: "#0090FF", driver1: "Pierre Gasly", driver2: "Franco Colapinto" },
    { name: "WILLIAMS", car: "/assets/cars/williams-26.png", color: "#005AFF", driver1: "Carlos Sainz", driver2: "Alex Albon" },
    { name: "RACING BULLS", car: "/assets/cars/racingbulls-26.png", color: "#1B3D8E", driver1: "Liam Lawson", driver2: "Arvid Lindblad" },
    { name: "HAAS", car: "/assets/cars/haas-26.png", color: "#B6BABD", driver1: "Esteban Ocon", driver2: "Oliver Bearman" },
    { name: "AUDI", car: "/assets/cars/audi-26.png", color: "#FF0000", driver1: "Nico Hulkenberg", driver2: "Gabriel Bortoleto", isNew: true },
    { name: "CADILLAC", car: "/assets/cars/cadillac-sideshot.png", color: "#FFB300", driver1: "Sergio Perez", driver2: "Valtteri Bottas", isNew: true },
];

export const GridSection: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const totalTeams = teams.length;

    const goTo = useCallback((direction: 'prev' | 'next') => {
        setActiveIndex(prev => {
            if (direction === 'next') {
                return (prev + 1) % totalTeams;
            } else {
                return (prev - 1 + totalTeams) % totalTeams;
            }
        });
    }, [totalTeams]);

    // Handle card click - move only ONE step towards the clicked card
    const handleCardClick = useCallback((clickedIndex: number) => {
        if (clickedIndex === activeIndex) return; // Already active, do nothing

        // Calculate the shortest path direction
        const diff = clickedIndex - activeIndex;
        const normalizedDiff = ((diff + Math.floor(totalTeams / 2)) % totalTeams) - Math.floor(totalTeams / 2);

        // Move one step in the direction of the clicked card
        if (normalizedDiff > 0) {
            goTo('next');
        } else {
            goTo('prev');
        }
    }, [activeIndex, totalTeams, goTo]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') goTo('prev');
            if (e.key === 'ArrowRight') goTo('next');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goTo]);

    const getCardStyle = (index: number) => {
        const diff = index - activeIndex;
        // Normalize to circular distance (-5 to +5 for 11 items)
        let normalizedDiff = diff;
        if (diff > totalTeams / 2) normalizedDiff = diff - totalTeams;
        if (diff < -totalTeams / 2) normalizedDiff = diff + totalTeams;

        // Determine visibility and position
        const isActive = normalizedDiff === 0;
        const isAdjacent = Math.abs(normalizedDiff) === 1;
        const isVisible = Math.abs(normalizedDiff) <= 2;

        if (!isVisible) {
            return {
                opacity: 0,
                scale: 0.5,
                x: normalizedDiff > 0 ? 800 : -800,
                zIndex: 0,
                rotateY: normalizedDiff * 30,
                filter: 'blur(8px)',
            };
        }

        return {
            opacity: isActive ? 1 : isAdjacent ? 0.7 : 0.4,
            scale: isActive ? 1 : isAdjacent ? 0.85 : 0.7,
            x: normalizedDiff * 340,
            zIndex: isActive ? 10 : isAdjacent ? 5 : 1,
            rotateY: normalizedDiff * -20,
            filter: isActive ? 'blur(0px)' : isAdjacent ? 'blur(1px)' : 'blur(3px)',
        };
    };

    const activeTeam = teams[activeIndex];

    return (
        <section className="relative w-full py-32 bg-[#030303] overflow-hidden">

            {/* Background Glow */}
            <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(ellipse at center, ${activeTeam.color}40 0%, transparent 70%)`
                }}
            />

            <div className="relative z-10 max-w-[1800px] mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-8xl font-racing text-white mb-4"
                    >
                        THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-f1-red to-orange-500">GRID</span>
                    </motion.h2>
                    <p className="text-gray-400 font-stats text-sm tracking-widest">
                        11 TEAMS · 22 DRIVERS · 1 CHAMPION
                    </p>
                </div>

                {/* 3D Carousel */}
                <div className="relative h-[500px] flex items-center justify-center" style={{ perspective: '1200px' }}>

                    {/* Navigation Arrows */}
                    <button
                        onClick={() => goTo('prev')}
                        className="absolute left-4 md:left-16 z-20 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all hover:scale-110"
                        aria-label="Previous team"
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>

                    <button
                        onClick={() => goTo('next')}
                        className="absolute right-4 md:right-16 z-20 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all hover:scale-110"
                        aria-label="Next team"
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>

                    {/* Cards Container */}
                    <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                        {teams.map((team, index) => {
                            const style = getCardStyle(index);
                            const isActive = index === activeIndex;

                            return (
                                <motion.div
                                    key={team.name}
                                    animate={style}
                                    transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                                    onClick={() => handleCardClick(index)}
                                    className={`absolute w-[280px] md:w-[400px] ${isActive ? 'cursor-default' : 'cursor-pointer'}`}
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    <div
                                        className={`relative bg-[#0A0A0A] rounded-3xl border overflow-hidden transition-all duration-300 ${isActive ? 'border-white/30 shadow-2xl' : 'border-white/10'
                                            }`}
                                        style={{
                                            boxShadow: isActive ? `0 0 60px ${team.color}30` : 'none'
                                        }}
                                    >
                                        {/* New Entry Badge */}
                                        {team.isNew && (
                                            <div className="absolute top-4 right-4 bg-f1-red px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider z-10">
                                                NEW ENTRY
                                            </div>
                                        )}

                                        {/* Team Color Bar */}
                                        <div
                                            className="absolute top-0 left-0 w-1 h-full"
                                            style={{ backgroundColor: team.color }}
                                        />

                                        {/* Content */}
                                        <div className="p-6 md:p-8">
                                            <h3 className="text-2xl md:text-3xl font-racing text-white mb-2">{team.name}</h3>

                                            {/* Car */}
                                            <div className="relative h-[120px] md:h-[180px] my-4">
                                                <img
                                                    src={team.car}
                                                    alt={`${team.name} 2026`}
                                                    className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                                                />
                                            </div>

                                            {/* Drivers */}
                                            <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                                <div className="text-sm">
                                                    <div className="text-gray-500 text-xs font-mono mb-1">DRIVER 1</div>
                                                    <div className="text-white font-medium">{team.driver1}</div>
                                                </div>
                                                <div className="text-sm text-right">
                                                    <div className="text-gray-500 text-xs font-mono mb-1">DRIVER 2</div>
                                                    <div className="text-white font-medium">{team.driver2}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-8">
                    {teams.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Go to team ${index + 1}`}
                            className={`w-2 h-2 rounded-full transition-all ${index === activeIndex
                                ? 'bg-white w-6'
                                : 'bg-white/30 hover:bg-white/50'
                                }`}
                        />
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 flex flex-col items-center text-center"
                >
                    <h3 className="text-3xl md:text-4xl font-racing text-white mb-8">READY TO RACE?</h3>

                    <Link to="/signup">
                        <button className="group relative px-12 py-6 bg-f1-red text-white font-bold text-xl skew-x-[-10deg] hover:bg-red-600 transition-all hover:shadow-[0_0_50px_rgba(225,6,0,0.4)]">
                            <div className="skew-x-[10deg] flex items-center gap-3">
                                ENTER THE PADDOCK <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    </Link>
                </motion.div>

            </div>
        </section>
    );
};
