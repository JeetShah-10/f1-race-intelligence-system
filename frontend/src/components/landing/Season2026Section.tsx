import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, TrendingUp, Flag } from 'lucide-react';

const TeamRevealCard = ({ name, country, car, drivers, themeColor, accentColor, delay, driverGap = "gap-12 md:gap-32", panelMode = "wide", logo }: any) => {

    const getPanelPosition = (index: number) => {
        if (panelMode === 'tight') {
            return index === 0 ? '-left-1 md:-left-4' : '-right-1 md:-right-4';
        }
        return index === 0 ? '-left-12 md:-left-32' : '-right-12 md:-right-32';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.8 }}
            className="relative rounded-[2rem] overflow-hidden h-[700px] border border-white/10 group bg-[#050505] flex flex-col"
        >
            <div className={`absolute inset-0 bg-gradient-to-b ${themeColor} opacity-10 group-hover:opacity-20 transition-opacity duration-1000`} />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
            <div className={`absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t ${themeColor} opacity-10 blur-[100px]`} />

            <div className="absolute top-0 inset-x-0 p-8 flex justify-between items-start z-50 pointer-events-none">
                <div className="flex flex-col items-start gap-4">
                    {logo && (
                        <div className="h-12 w-auto mb-2 opacity-90">
                            <img src={logo} alt={`${name} Logo`} className="h-full w-auto object-contain" />
                        </div>
                    )}

                    <div>
                        <h3 className="text-6xl font-racing text-white italic leading-none mb-2 tracking-tighter drop-shadow-xl">{name}</h3>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-sm border-l-2 ${accentColor} bg-white/5 backdrop-blur-sm`}>
                            <Flag className="w-3 h-3 text-white/70" />
                            <span className="text-xs font-bold font-stats uppercase tracking-[0.2em] text-white/90">{country}</span>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex flex-col items-end gap-1 opacity-30">
                    <div className="h-1 w-24 bg-white/50" />
                    <div className="h-1 w-12 bg-white/30" />
                </div>
            </div>

            <div className="absolute inset-0 flex flex-col justify-end pb-0 overflow-hidden">
                <div className={`absolute inset-x-0 bottom-[100px] md:bottom-[80px] flex items-end justify-center z-10 h-full pointer-events-none`}>
                    <div className={`flex items-end ${driverGap} w-full justify-center px-8 transition-all duration-500`}>
                        {drivers.map((driver: any, i: number) => (
                            <motion.div
                                key={i}
                                className="relative flex flex-col items-center group/driver"
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: delay + 0.3 + (i * 0.1), duration: 0.8 }}
                            >
                                <div className={`absolute top-[25%] ${getPanelPosition(i)} flex flex-col items-center bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-lg z-20 shadow-2xl skew-x-[-5deg]`}>
                                    <div className={`text-5xl md:text-6xl font-body font-black italic text-white mb-1 ${i === 0 ? 'text-right' : 'text-left'} skew-x-[5deg] tracking-tighter`}>
                                        {driver.number}
                                    </div>
                                    <div className="h-0.5 w-8 bg-white/40 mb-2 skew-x-[5deg]" />
                                    <div className="text-[10px] font-stats text-white/70 tracking-widest uppercase text-center leading-tight skew-x-[5deg]">
                                        {driver.firstName}<br />
                                        <span className="text-white font-bold text-sm tracking-normal">{driver.lastName}</span>
                                    </div>
                                </div>

                                <img
                                    src={driver.image}
                                    alt={driver.lastName}
                                    className="h-[380px] md:h-[480px] w-auto object-contain object-bottom transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                                    style={{
                                        transform: `scale(${driver.scale || 1})`,
                                        filter: 'drop-shadow(0 0 30px rgba(0,0,0,0.3))'
                                    }}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="relative z-30 -mb-12 md:-mb-20 flex justify-center">
                    <motion.img
                        src={car}
                        alt={`${name} Livery`}
                        className="w-[115%] md:w-[95%] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)]"
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ delay: delay + 0.5, duration: 1, type: "spring", bounce: 0.2 }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

const DriverMoveCard = ({ fromTeam, toTeam, driverName, image, type, color, delay, brightness = 1 }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.6 }}
        className="relative overflow-hidden rounded-[2rem] bg-[#0F0F0F] border border-white/10 group hover:border-white/30 transition-all flex flex-col md:flex-row h-auto md:h-[240px]"
    >
        <div className={`absolute left-0 top-0 bottom-0 w-2 ${color} z-30`} />

        <div className="flex-1 p-6 md:p-10 relative z-20 flex flex-col justify-center pl-10">
            <div className="flex items-center gap-3 mb-2">
                {type === 'promotion' ? <TrendingUp className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} /> : <Zap className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />}
                <span className={`text-xs font-bold font-stats uppercase tracking-[0.2em] ${color.replace('bg-', 'text-')}`}>Official News</span>
            </div>

            <h4 className="text-3xl md:text-5xl font-racing text-white italic mb-2 leading-none">{driverName}</h4>

            <div className="flex items-center gap-4 text-sm font-stats text-white/50">
                <span className="line-through">{fromTeam}</span>
                <ArrowRight className="w-4 h-4 text-white" />
                <span className="text-white font-bold tracking-wider">{toTeam}</span>
            </div>
        </div>

        <div className="w-full md:w-64 h-64 md:h-full relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r from-[#0F0F0F] via-transparent to-transparent z-10 hidden md:block`} />
            <div className={`absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent z-10 block md:hidden`} />

            <img
                src={image}
                alt={driverName}
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                style={{ filter: `brightness(${brightness}) grayscale(10%)`, WebkitFilter: `brightness(${brightness}) grayscale(10%)` }}
            />
        </div>
    </motion.div>
);

export const Season2026Section: React.FC = () => {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/assets/textures/carbon-forged.png')] opacity-20 pointer-events-none" />

            <div className="max-w-[95rem] mx-auto px-4 relative z-10">

                <div className="text-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 font-bold font-stats uppercase tracking-widest text-xs mb-6 backdrop-blur-md"
                    >
                        <span className="w-2 h-2 rounded-full bg-f1-red animate-pulse" /> Season Preview
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-[8rem] font-body font-black italic text-white leading-none tracking-tighter"
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">2026</span> GRID
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-32">
                    <TeamRevealCard
                        name="AUDI F1"
                        country="Germany"
                        logo="/assets/logos/audi-logo.png"
                        car="/assets/cars/audi-sideshot.png"
                        accentColor="border-l-4 border-l-red-600"
                        themeColor="from-gray-900 to-black"
                        delay={0.2}
                        driverGap="gap-1 md:gap-4"
                        panelMode="tight"
                        drivers={[
                            { firstName: "Nico", lastName: "Hulkenberg", image: "/assets/drivers/nico-hulkenberg-3.png", scale: 1.1, number: "27" },
                            { firstName: "Gabriel", lastName: "Bortoleto", image: "/assets/drivers/bortoleto-4.png", scale: 1.08, number: "5" }
                        ]}
                    />

                    <TeamRevealCard
                        name="CADILLAC"
                        country="USA"
                        logo="/assets/logos/cadillac-logo.png"
                        car="/assets/cars/cadillac-sideshot.png"
                        accentColor="border-l-4 border-l-yellow-400"
                        themeColor="from-yellow-950 to-black"
                        delay={0.4}
                        driverGap="gap-16 md:gap-32"
                        panelMode="wide"
                        drivers={[
                            { firstName: "Sergio", lastName: "Perez", image: "/assets/drivers/sergio-perez-removebg-preview.png", scale: 0.85, number: "11" },
                            { firstName: "Valtteri", lastName: "Bottas", image: "/assets/drivers/valettri-bottas-removebg-preview.png", scale: 0.85, number: "77" }
                        ]}
                    />
                </div>

                <div className="max-w-7xl mx-auto mb-32">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 border-b border-white/10 pb-6 gap-4">
                        <div>
                            <div className="text-f1-red uppercase tracking-[0.2em] font-bold font-stats text-sm mb-2">Driver Market</div>
                            <h3 className="text-4xl md:text-5xl font-racing text-white italic">Confirmed Moves</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DriverMoveCard
                            title="The Promotion"
                            driverName="Isack Hadjar"
                            fromTeam="Racing Bulls"
                            toTeam="Red Bull Racing"
                            image="/assets/drivers/isack-hadjar.png"
                            type="promotion"
                            color="bg-blue-700"
                            delay={0.2}
                            brightness={1.2}
                        />
                        <DriverMoveCard
                            title="The New Gen"
                            driverName="Arvid Lindblad"
                            fromTeam="F3 / Academy"
                            toTeam="Racing Bulls"
                            image="/assets/drivers/arvid-lindblad.png"
                            type="recruit"
                            color="bg-indigo-600"
                            delay={0.3}
                            brightness={1.1}
                        />
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="relative rounded-[2rem] bg-[#1a0505] overflow-hidden text-center py-20 px-6 group cursor-pointer border border-white/5"
                >
                    <div className="absolute inset-0 bg-[url('/assets/backgrounds/bg-image-2.png')] opacity-20 mix-blend-screen group-hover:scale-105 transition-transform duration-1000 grayscale" />

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <h2 className="text-5xl md:text-[6rem] font-body font-black italic text-white mb-10 drop-shadow-2xl leading-none tracking-tighter">
                            SIMULATE <span className="text-f1-red">2026</span>
                        </h2>

                        <div className="flex justify-center">
                            <Link to="/signup">
                                <button className="bg-white text-black px-12 py-5 rounded-full font-racing text-xl uppercase tracking-widest hover:bg-f1-red hover:text-white transition-all shadow-xl flex items-center gap-4">
                                    Start Season <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};
