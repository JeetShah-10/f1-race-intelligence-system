import { motion } from 'framer-motion';
import { useSimulationStore } from '../../store/useSimulationStore';
import { getCircuitById, CIRCUITS_2026 } from '../../data/simulationMockData';
import { getCircuitImage } from './CircuitPaths';

export function WeekendIntro() {
    const { selectedCircuitId, startQualifying, backToCircuits } = useSimulationStore();
    const circuit = selectedCircuitId ? getCircuitById(selectedCircuitId) : null;

    if (!circuit) return null;

    const round = CIRCUITS_2026.findIndex(c => c.id === circuit.id) + 1;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ background: '#0a0a0f' }}>

            {/* Circuit photo background */}
            <div className="absolute inset-0">
                <img
                    src={getCircuitImage(circuit.id)?.photo || `/assets/circuits/${circuit.id}-circuit.webp`}
                    alt=""
                    className="w-full h-full object-cover opacity-[0.25]"
                    style={{ filter: 'blur(1px) saturate(0.5)' }}
                />
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, rgba(10,10,15,0.6) 0%, rgba(10,10,15,0.95) 100%)' }} />
            </div>

            {/* Top bar */}
            <motion.div
                className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-20"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <button
                    onClick={backToCircuits}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    BACK
                </button>
                <div className="text-white/30 text-xs tracking-[0.3em] font-medium">
                    F1 INTELLIGENCE • 2026
                </div>
            </motion.div>

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-8">

                {/* Round badge */}
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
                        style={{ background: 'rgba(225,6,0,0.12)', border: '1px solid rgba(225,6,0,0.25)' }}>
                        <span className="text-[#E10600] text-xs font-bold tracking-[0.2em]">
                            ROUND {round.toString().padStart(2, '0')}
                        </span>
                    </div>
                </motion.div>

                {/* Circuit Name */}
                <motion.h1
                    className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white mb-2"
                    style={{ fontFamily: '"Raceline Demo", "Arial Black", sans-serif' }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    {circuit.name.replace('Grand Prix', '').trim()}
                </motion.h1>

                {/* Grand Prix subtitle */}
                <motion.div
                    className="text-lg text-white/40 tracking-[0.25em] uppercase font-medium mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    GRAND PRIX
                </motion.div>

                {/* Circuit map image */}
                <motion.div
                    className="mb-10 w-72 h-48 relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                >
                    <img
                        src={getCircuitImage(circuit.id)?.map || `/assets/circuits/${circuit.id}-map.png`}
                        alt={`${circuit.name} layout`}
                        className="w-full h-full object-contain drop-shadow-lg"
                        style={{ filter: 'brightness(1.2) contrast(1.1)' }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    {/* Subtle glow behind map */}
                    <div className="absolute inset-0 -z-10 blur-2xl opacity-20"
                        style={{ background: 'radial-gradient(circle, #E10600, transparent 70%)' }} />
                </motion.div>

                {/* Circuit Stats */}
                <motion.div
                    className="grid grid-cols-4 gap-8 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                >
                    <StatBox label="LAPS" value={circuit.laps.toString()} />
                    <StatBox label="LENGTH" value={`${circuit.length.toFixed(1)}km`} />
                    <StatBox label="TURNS" value={circuit.turns.toString()} />
                    <StatBox label="DRS ZONES" value={circuit.drsZones.toString()} />
                </motion.div>

                {/* CTA Button */}
                <motion.button
                    onClick={startQualifying}
                    className="group relative px-10 py-4 rounded-lg text-white font-bold text-lg tracking-wider uppercase overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #E10600 0%, #B80000 100%)',
                        boxShadow: '0 0 40px rgba(225,6,0,0.3), 0 4px 20px rgba(0,0,0,0.5)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    {/* Shimmer effect */}
                    <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                        }}
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                    />
                    <span className="relative z-10 flex items-center gap-3">
                        SIMULATE QUALIFYING
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </span>
                </motion.button>

                {/* Country flag */}
                <motion.div
                    className="mt-6 text-white/20 text-sm tracking-widest"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                >
                    {circuit.country.toUpperCase()}
                </motion.div>
            </div>

            {/* Corner decorations */}
            <div className="absolute bottom-0 left-0 w-48 h-48 opacity-[0.04]"
                style={{ background: 'radial-gradient(circle at bottom left, #E10600, transparent)' }} />
            <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.04]"
                style={{ background: 'radial-gradient(circle at top right, #E10600, transparent)' }} />
        </div>
    );
}

function StatBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="text-center">
            <div className="text-2xl md:text-3xl font-black text-white mb-1">{value}</div>
            <div className="text-[10px] text-white/30 tracking-[0.2em] font-medium">{label}</div>
        </div>
    );
}
