import { motion } from 'framer-motion';
import { useSimulationStore } from '../../store/useSimulationStore';
import { getCircuitById } from '../../data/simulationMockData';

export function GridFormation() {
    const { gridOrder, startRace, selectedCircuitId, backToCircuits } = useSimulationStore();
    const circuit = selectedCircuitId ? getCircuitById(selectedCircuitId) : null;

    if (!gridOrder.length) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#0a0a0f' }}>

            {/* Header */}
            <motion.div
                className="shrink-0 flex items-center justify-between px-6 py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <button
                    onClick={backToCircuits}
                    className="text-white/40 hover:text-white/80 text-sm tracking-wider transition-colors"
                >
                    &larr; BACK
                </button>
                <div className="text-center">
                    <div className="text-[10px] text-white/30 tracking-[0.3em] font-medium">STARTING GRID</div>
                    <div className="text-lg font-black text-white tracking-tight">
                        {circuit?.name || 'Grand Prix'}
                    </div>
                </div>
                <div className="text-white/20 text-xs tracking-widest">2026</div>
            </motion.div>

            {/* Grid body */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6">
                <div className="max-w-3xl mx-auto">

                    {/* Grid rows - F1 style staggered two-column */}
                    {gridOrder.map((driver, idx) => {
                        const isOdd = idx % 2 === 0; // P1 left, P2 right, P3 left...
                        const row = Math.floor(idx / 2);

                        return (
                            <motion.div
                                key={driver.driverCode}
                                className="flex items-center gap-3 mb-1"
                                style={{
                                    justifyContent: isOdd ? 'flex-start' : 'flex-end',
                                    paddingLeft: isOdd ? '0' : '40%',
                                    paddingRight: isOdd ? '40%' : '0',
                                }}
                                initial={{ opacity: 0, x: isOdd ? -60 : 60 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    delay: 0.3 + row * 0.12,
                                    duration: 0.5,
                                    ease: [0.25, 0.46, 0.45, 0.94],
                                }}
                            >
                                <GridCard driver={driver} isOdd={isOdd} />
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom CTA */}
            <motion.div
                className="shrink-0 px-6 py-5 flex justify-center"
                style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(10,10,15,0.95) 100%)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0 }}
            >
                <motion.button
                    onClick={startRace}
                    className="px-12 py-4 rounded-lg text-white font-black text-lg tracking-wider uppercase"
                    style={{
                        background: 'linear-gradient(135deg, #00E676 0%, #00C853 100%)',
                        boxShadow: '0 0 40px rgba(0,230,118,0.25), 0 4px 20px rgba(0,0,0,0.5)',
                        color: '#000',
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <span className="flex items-center gap-3">
                        LIGHTS OUT - START RACE
                    </span>
                </motion.button>
            </motion.div>
        </div>
    );
}

function GridCard({
    driver,
    isOdd,
}: {
    driver: { position: number; driverCode: string; driverName: string; driverNumber: number; teamColor: string; teamName: string; qualifyingTime: string; driverPhoto?: string };
    isOdd: boolean;
}) {
    const isPole = driver.position === 1;
    const isTop3 = driver.position <= 3;

    return (
        <div
            className="flex items-center gap-3 w-full rounded-lg overflow-hidden relative"
            style={{
                background: isPole
                    ? 'linear-gradient(135deg, rgba(160,32,240,0.12) 0%, rgba(10,10,15,0.95) 100%)'
                    : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isPole ? 'rgba(160,32,240,0.3)' : 'rgba(255,255,255,0.06)'}`,
                flexDirection: isOdd ? 'row' : 'row-reverse',
                padding: '8px',
            }}
        >
            {/* Position number */}
            <div className="shrink-0 w-10 text-center">
                <span
                    className="text-2xl font-black"
                    style={{
                        color: isPole ? '#A020F0' : isTop3 ? '#fff' : 'rgba(255,255,255,0.35)',
                        fontFamily: '"Raceline Demo", sans-serif',
                    }}
                >
                    {driver.position}
                </span>
            </div>

            {/* Team color bar */}
            <div className="shrink-0 w-[3px] h-12 rounded-full" style={{ background: driver.teamColor }} />

            {/* Driver photo */}
            <div className="shrink-0 w-12 h-12 rounded overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                {driver.driverPhoto && (
                    <img
                        src={driver.driverPhoto}
                        alt={driver.driverName}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0" style={{ textAlign: isOdd ? 'left' : 'right' }}>
                <div className="flex items-baseline gap-2" style={{ justifyContent: isOdd ? 'flex-start' : 'flex-end' }}>
                    <span className="text-base font-black text-white tracking-wide">{driver.driverCode}</span>
                    <span className="text-xs text-white/20 font-medium">#{driver.driverNumber}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5" style={{ justifyContent: isOdd ? 'flex-start' : 'flex-end' }}>
                    <span className="text-[10px] text-white/30 tracking-wider">{driver.teamName}</span>
                </div>
            </div>

            {/* Qualifying time */}
            <div className="shrink-0 text-right">
                <div className="text-xs font-mono" style={{ color: isPole ? '#A020F0' : 'rgba(255,255,255,0.5)' }}>
                    {driver.qualifyingTime}
                </div>
            </div>
        </div>
    );
}
