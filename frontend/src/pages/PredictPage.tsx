import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Gauge, RotateCcw, Zap, Flag } from 'lucide-react';
import { CarbonFiber, NoiseOverlay } from '../components/ui/Textures';
import CircuitCalendarGrid from '../components/predict/CircuitCalendarGrid';
import PredictionLoadingAnimation from '../components/predict/PredictionLoadingAnimation';
import PredictionPodium from '../components/predict/PredictionPodium';
import PredictionClassification from '../components/predict/PredictionClassification';
import PredictionInsightsPanel from '../components/predict/PredictionInsightsPanel';
import { generatePrediction, getCountryFlag } from '../data/predictionMockData';
import type { Circuit2026 } from '../data/f1-data';
import type { PredictionState, PredictionResult } from '../types/prediction';
import '../styles/predict.css';

const WEATHER_ICONS: Record<string, string> = {
    SUNNY: '☀️',
    CLOUDY: '⛅',
    LIGHT_RAIN: '🌧️',
    HEAVY_RAIN: '⛈️',
};

const pageTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
};

export function PredictPage() {
    const [state, setState] = useState<PredictionState>('CALENDAR');
    const [selectedCircuit, setSelectedCircuit] = useState<Circuit2026 | null>(null);
    const [result, setResult] = useState<PredictionResult | null>(null);

    const handleSelectCircuit = useCallback((circuit: Circuit2026) => {
        setSelectedCircuit(circuit);
        setState('LOADING');
    }, []);

    const handleLoadingComplete = useCallback(() => {
        if (selectedCircuit) {
            const prediction = generatePrediction(selectedCircuit.id);
            setResult(prediction);
            setState('RESULTS');
        }
    }, [selectedCircuit]);

    const handleBackToCalendar = useCallback(() => {
        setState('CALENDAR');
        setSelectedCircuit(null);
        setResult(null);
    }, []);

    const handleNewPrediction = useCallback(() => {
        if (selectedCircuit) {
            setState('LOADING');
        }
    }, [selectedCircuit]);

    return (
        <div className="relative min-h-screen bg-[#0a0a0a] overflow-x-hidden">
            {/* Base textures */}
            <CarbonFiber opacity={0.08} />
            <NoiseOverlay opacity={0.03} />

            {/* Content */}
            <AnimatePresence mode="wait">
                {state === 'CALENDAR' && (
                    <motion.div
                        key="calendar"
                        {...pageTransition}
                        className="relative z-10 py-6 sm:py-8"
                    >
                        <CircuitCalendarGrid onSelectCircuit={handleSelectCircuit} />
                    </motion.div>
                )}

                {state === 'LOADING' && selectedCircuit && (
                    <PredictionLoadingAnimation
                        key="loading"
                        circuit={selectedCircuit}
                        onComplete={handleLoadingComplete}
                    />
                )}

                {state === 'RESULTS' && selectedCircuit && result && (
                    <motion.div
                        key="results"
                        {...pageTransition}
                        className="relative z-10 pb-12"
                    >
                        {/* Background texture */}
                        <div
                            className="fixed inset-0 opacity-[0.04] pointer-events-none z-0"
                            style={{
                                backgroundImage: `url('/assets/textures/Screenshot 2026-02-11 190041.png')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />

                        {/* Top bar */}
                        <div className="sticky top-0 z-20 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06]">
                            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                                <button
                                    onClick={handleBackToCalendar}
                                    className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                                    <span className="text-xs font-mono tracking-wider uppercase">Back to Calendar</span>
                                </button>

                                <div className="flex items-center gap-3">
                                    {/* Weather badge */}
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">
                                        <span className="text-sm">{WEATHER_ICONS[result.weather]}</span>
                                        <span className="text-[10px] font-mono text-white/40">{result.temperature}°C</span>
                                    </div>

                                    {/* Re-run */}
                                    <button
                                        onClick={handleNewPrediction}
                                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                        <span className="text-[10px] font-mono tracking-wider uppercase">Re-run</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Circuit info strip */}
                        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 pb-2">
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="h-[2px] w-6 bg-[#E8002D]" />
                                        <span className="text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase">
                                            Race Prediction
                                        </span>
                                    </div>
                                    <h1
                                        className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white tracking-tight"
                                        style={{ fontFamily: '"NeoSpeed", sans-serif' }}
                                    >
                                        {selectedCircuit.name}
                                    </h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        <MapPin className="w-3 h-3 text-white/25" />
                                        <span className="text-xs text-white/35">
                                            {getCountryFlag(selectedCircuit.countryCode)} {selectedCircuit.location}, {selectedCircuit.country}
                                        </span>
                                    </div>
                                </div>

                                {/* Circuit stats pills */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {[
                                        { icon: Flag, label: `${selectedCircuit.laps} laps` },
                                        { icon: Gauge, label: `${selectedCircuit.lapDistance}km` },
                                        { icon: Zap, label: `Round ${selectedCircuit.round}` },
                                    ].map(({ icon: Icon, label }) => (
                                        <div
                                            key={label}
                                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]"
                                        >
                                            <Icon className="w-3 h-3 text-white/25" />
                                            <span className="text-[10px] font-mono text-white/35">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Results layout — Bento grid */}
                        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                            {/* Row 1: Podium + Insights */}
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 sm:gap-6 mb-4 sm:mb-6">
                                {/* Podium */}
                                <div className="prediction-glass rounded-2xl p-4 sm:p-6 overflow-hidden">
                                    <PredictionPodium drivers={result.classification.slice(0, 3)} />
                                </div>

                                {/* Insights */}
                                <div className="prediction-glass rounded-2xl p-4 sm:p-6 overflow-hidden predict-scroll overflow-y-auto max-h-[500px]">
                                    <PredictionInsightsPanel insights={result.insights} />
                                </div>
                            </div>

                            {/* Row 2: Full classification */}
                            <div className="prediction-glass rounded-2xl p-4 sm:p-6 overflow-hidden">
                                <PredictionClassification drivers={result.classification} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
