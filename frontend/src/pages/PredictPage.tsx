import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDashboardStore, selectMeta } from '../store';

// Circuit data for selection with images
const CIRCUITS = [
    { id: 'monaco', name: 'Monaco GP', country: 'Monaco', type: 'Street', image: '/assets/circuits/monaco-circuit.png', mapImage: '/assets/circuits/monaco-map.png' },
    { id: 'spa', name: 'Belgian GP', country: 'Belgium', type: 'Power', image: '/assets/circuits/spa-circuit.jpeg', mapImage: '/assets/circuits/spa-map.png' },
    { id: 'monza', name: 'Italian GP', country: 'Italy', type: 'Power', image: '/assets/circuits/monza-circuit.jpeg', mapImage: '/assets/circuits/monza-map.png' },
    { id: 'silverstone', name: 'British GP', country: 'UK', type: 'Balanced', image: '/assets/circuits/silverstone-circuit.jpeg', mapImage: '/assets/circuits/silverstone-map.png' },
    { id: 'suzuka', name: 'Japanese GP', country: 'Japan', type: 'Technical', image: '/assets/circuits/suzuka-circuit.jpeg', mapImage: '/assets/circuits/suzuka-map.png' },
    { id: 'singapore', name: 'Singapore GP', country: 'Singapore', type: 'Street', image: '/assets/circuits/singapore-circuit.jpg', mapImage: '/assets/circuits/singapore-map.png' },
];

// Mock prediction results with team colors
const MOCK_RESULTS = [
    { pos: 1, driver: 'VER', team: 'Red Bull Racing', gap: 'WINNER', tyre: 'M-H', stops: 1, color: '#3671C6', logo: '/assets/logos/redbull-logo.png' },
    { pos: 2, driver: 'NOR', team: 'McLaren', gap: '+4.2s', tyre: 'M-H', stops: 1, color: '#FF8700', logo: '/assets/logos/mclaren-logo.png' },
    { pos: 3, driver: 'LEC', team: 'Ferrari', gap: '+12.8s', tyre: 'S-M-H', stops: 2, color: '#DC0000', logo: '/assets/logos/ferrari-logo.png' },
    { pos: 4, driver: 'PIA', team: 'McLaren', gap: '+18.3s', tyre: 'M-H', stops: 1, color: '#FF8700', logo: '/assets/logos/mclaren-logo.png' },
    { pos: 5, driver: 'SAI', team: 'Ferrari', gap: '+22.1s', tyre: 'S-M-H', stops: 2, color: '#DC0000', logo: '/assets/logos/ferrari-logo.png' },
    { pos: 6, driver: 'HAM', team: 'Mercedes', gap: '+28.4s', tyre: 'M-H', stops: 1, color: '#00D2BE', logo: '/assets/logos/mercedes-logo.png' },
    { pos: 7, driver: 'RUS', team: 'Mercedes', gap: '+32.7s', tyre: 'M-H', stops: 1, color: '#00D2BE', logo: '/assets/logos/mercedes-logo.png' },
    { pos: 8, driver: 'ALO', team: 'Aston Martin', gap: '+41.2s', tyre: 'M-H', stops: 1, color: '#006F62', logo: '/assets/logos/aston-martin.png' },
];

type Step = 'circuit' | 'weather' | 'running' | 'results';

export function PredictPage() {
    const [step, setStep] = useState<Step>('circuit');
    const [selectedCircuit, setSelectedCircuit] = useState<typeof CIRCUITS[0] | null>(null);
    const [weather, setWeather] = useState(20);
    const meta = useDashboardStore(selectMeta);

    const handleCircuitSelect = (circuit: typeof CIRCUITS[0]) => {
        setSelectedCircuit(circuit);
        setStep('weather');
    };

    const handleRunPrediction = () => {
        setStep('running');
        setTimeout(() => setStep('results'), 2500);
    };

    const getWeatherLabel = () => {
        if (weather < 20) return 'Dry';
        if (weather < 40) return 'Partly Cloudy';
        if (weather < 60) return 'Cloudy';
        if (weather < 80) return 'Light Rain';
        return 'Wet';
    };

    const getWeatherIcon = () => {
        if (weather < 40) return '☀️';
        if (weather < 70) return '⛅';
        return '🌧️';
    };

    return (
        <div className="min-h-screen bg-[#0B0D10] text-white relative overflow-hidden">
            {/* Dynamic Background */}
            {selectedCircuit && (
                <>
                    <div
                        className="absolute inset-0 z-0 opacity-15 transition-opacity duration-700"
                        style={{
                            backgroundImage: `url(${selectedCircuit.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(3px)',
                        }}
                    />
                    <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0B0D10]/70 via-[#0B0D10]/85 to-[#0B0D10]" />
                </>
            )}

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0B0D10]/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#CF2C28] to-[#8B0000] flex items-center justify-center rounded">
                                <span className="text-white font-bold text-sm" style={{ fontFamily: 'NeoSpeed, sans-serif' }}>A</span>
                            </div>
                            <span className="font-bold text-xl" style={{ fontFamily: 'NeoSpeed, sans-serif' }}>APEX</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-1">
                            <Link to="/simulate" className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded">Simulate</Link>
                            <Link to="/predict" className="px-4 py-2 text-sm text-white bg-white/10 rounded">Predict</Link>
                            <Link to="/analyze" className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded">Analyze</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/40">
                        <span className="hidden sm:inline">{meta.modelVersion}</span>
                        <span className="w-2 h-2 bg-[#00D2BE] rounded-full animate-pulse" />
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-24 pb-16 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Step: Circuit Selection */}
                    {step === 'circuit' && (
                        <div className="animate-fade-in">
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00D2BE]/10 border border-[#00D2BE]/30 rounded-full text-xs text-[#00D2BE] mb-4">
                                    Step 1 of 2
                                </div>
                                <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'Raceburst, NeoSpeed, sans-serif' }}>Select Circuit</h1>
                                <p className="text-white/50 max-w-md mx-auto">Choose a circuit for AI-powered race prediction</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {CIRCUITS.map((circuit) => (
                                    <button
                                        key={circuit.id}
                                        onClick={() => handleCircuitSelect(circuit)}
                                        className="group relative overflow-hidden rounded-2xl text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#CF2C28]/10"
                                    >
                                        {/* Circuit Image Background */}
                                        <div
                                            className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                                            style={{
                                                backgroundImage: `url(${circuit.image})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/70 to-transparent" />

                                        {/* Content */}
                                        <div className="relative p-6 min-h-[200px] flex flex-col justify-end">
                                            {/* Circuit Map */}
                                            <img
                                                src={circuit.mapImage}
                                                alt={circuit.name}
                                                className="absolute top-4 right-4 w-16 h-16 object-contain opacity-40 group-hover:opacity-70 transition-opacity"
                                            />
                                            <div className="text-xl font-bold mb-1 group-hover:text-[#CF2C28] transition-colors" style={{ fontFamily: 'NeoSpeed, sans-serif' }}>
                                                {circuit.name}
                                            </div>
                                            <div className="text-white/50 text-sm mb-3">{circuit.country}</div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1 bg-white/10 text-xs rounded-full backdrop-blur-sm border border-white/10">
                                                    {circuit.type}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step: Weather Configuration */}
                    {step === 'weather' && selectedCircuit && (
                        <div className="animate-fade-in">
                            <button
                                onClick={() => setStep('circuit')}
                                className="flex items-center gap-2 text-white/50 text-sm mb-6 hover:text-white transition-colors"
                            >
                                <span>←</span>
                                <span>Back to Circuit</span>
                            </button>

                            <div className="text-center mb-10">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00D2BE]/10 border border-[#00D2BE]/30 rounded-full text-xs text-[#00D2BE] mb-4">
                                    Step 2 of 2
                                </div>
                                <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'Raceburst, NeoSpeed, sans-serif' }}>Configure Weather</h1>
                                <p className="text-white/50">{selectedCircuit.name} · {selectedCircuit.country}</p>
                            </div>

                            <div className="max-w-lg mx-auto">
                                <div className="glass-card rounded-2xl p-8 border border-white/10">
                                    {/* Weather Display */}
                                    <div className="text-center mb-10">
                                        <div className="text-8xl mb-4 animate-pulse">{getWeatherIcon()}</div>
                                        <div className="text-3xl font-bold mb-2" style={{ fontFamily: 'NeoSpeed, sans-serif' }}>{getWeatherLabel()}</div>
                                        <div className="text-white/40 text-sm">Track conditions</div>
                                    </div>

                                    {/* Slider */}
                                    <div className="mb-10">
                                        <div className="relative">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={weather}
                                                onChange={(e) => setWeather(Number(e.target.value))}
                                                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer"
                                                style={{
                                                    background: `linear-gradient(to right, #FFD700 0%, #87CEEB 50%, #0066CC ${weather}%, rgba(255,255,255,0.1) ${weather}%)`,
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-white/40 mt-3">
                                            <span>☀️ Dry</span>
                                            <span>⛅ Mixed</span>
                                            <span>🌧️ Wet</span>
                                        </div>
                                    </div>

                                    {/* Run Button */}
                                    <button
                                        onClick={handleRunPrediction}
                                        className="w-full py-5 bg-gradient-to-r from-[#CF2C28] to-[#FF6B6B] text-white font-bold uppercase tracking-wider rounded-xl hover:shadow-lg hover:shadow-[#CF2C28]/30 transition-all duration-300 hover:scale-[1.02]"
                                        style={{ fontFamily: 'NeoSpeed, sans-serif' }}
                                    >
                                        Run Prediction
                                    </button>
                                </div>

                                {/* Circuit Preview */}
                                <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/40">
                                    <img src={selectedCircuit.mapImage} alt="" className="w-12 h-12 object-contain opacity-50" />
                                    <span>{selectedCircuit.type} Circuit</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step: Running */}
                    {step === 'running' && selectedCircuit && (
                        <div className="animate-fade-in text-center py-20">
                            {/* Spinning Circuit */}
                            <div className="relative w-32 h-32 mx-auto mb-10">
                                <div className="absolute inset-0 border-4 border-[#CF2C28] border-t-transparent rounded-full animate-spin" />
                                <img
                                    src={selectedCircuit.mapImage}
                                    alt=""
                                    className="absolute inset-4 object-contain opacity-50"
                                />
                            </div>
                            <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Raceburst, NeoSpeed, sans-serif' }}>Running Prediction</h2>
                            <p className="text-white/50 mb-6">AI model analyzing {selectedCircuit.name} race scenarios</p>
                            <div className="flex items-center justify-center gap-2 text-sm text-[#00D2BE]">
                                <span className="w-2 h-2 bg-[#00D2BE] rounded-full animate-pulse" />
                                Processing lap data, tyre strategies, weather impact...
                            </div>
                        </div>
                    )}

                    {/* Step: Results */}
                    {step === 'results' && selectedCircuit && (
                        <div className="animate-fade-in">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <img src={selectedCircuit.mapImage} alt="" className="w-8 h-8 object-contain opacity-60" />
                                        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Raceburst, NeoSpeed, sans-serif' }}>
                                            Prediction Results
                                        </h1>
                                    </div>
                                    <p className="text-white/50 flex items-center gap-2">
                                        <span>{selectedCircuit.name}</span>
                                        <span className="text-white/30">·</span>
                                        <span>{getWeatherLabel()}</span>
                                        <span className="text-white/30">·</span>
                                        <span className="text-[#00D2BE]">94.8% confidence</span>
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => { setStep('circuit'); setSelectedCircuit(null); }}
                                        className="px-5 py-2.5 border border-white/20 rounded-lg text-sm hover:bg-white/5 transition-colors"
                                    >
                                        New Prediction
                                    </button>
                                    <Link
                                        to="/analyze"
                                        className="px-5 py-2.5 bg-gradient-to-r from-[#0090FF] to-[#0050AA] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#0090FF]/20 transition-all"
                                    >
                                        Analyze Data
                                    </Link>
                                </div>
                            </div>

                            {/* Classification Table */}
                            <div className="glass-card rounded-2xl overflow-hidden border border-white/10 mb-8">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-xs text-white/40 uppercase tracking-wider border-b border-white/10 bg-white/5">
                                            <th className="px-6 py-4 w-16">Pos</th>
                                            <th className="px-6 py-4">Driver</th>
                                            <th className="px-6 py-4 hidden sm:table-cell">Team</th>
                                            <th className="px-6 py-4">Gap</th>
                                            <th className="px-6 py-4 hidden md:table-cell">Strategy</th>
                                            <th className="px-6 py-4 w-20 hidden md:table-cell">Stops</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {MOCK_RESULTS.map((row, i) => (
                                            <tr
                                                key={row.pos}
                                                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                                style={{
                                                    animationDelay: `${i * 50}ms`,
                                                }}
                                            >
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-mono font-bold ${row.pos === 1 ? 'bg-[#FFD700]/20 text-[#FFD700]' :
                                                            row.pos === 2 ? 'bg-[#C0C0C0]/20 text-[#C0C0C0]' :
                                                                row.pos === 3 ? 'bg-[#CD7F32]/20 text-[#CD7F32]' :
                                                                    'bg-white/5 text-white/60'
                                                        }`}>
                                                        {row.pos}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-1.5 h-8 rounded-full" style={{ background: row.color }} />
                                                        <span className="font-bold text-lg" style={{ fontFamily: 'NeoSpeed, sans-serif' }}>
                                                            {row.driver}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-white/60 hidden sm:table-cell">{row.team}</td>
                                                <td className="px-6 py-4 font-mono text-lg" style={{ color: row.pos === 1 ? '#00D2BE' : 'inherit' }}>
                                                    {row.gap}
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell">
                                                    <div className="flex gap-1">
                                                        {row.tyre.split('-').map((t, i) => (
                                                            <span
                                                                key={i}
                                                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${t === 'S' ? 'bg-[#FF3333] text-white' :
                                                                        t === 'M' ? 'bg-[#FFD700] text-black' :
                                                                            'bg-white text-black'
                                                                    }`}
                                                            >
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center hidden md:table-cell">{row.stops}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Insight Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="glass-card rounded-xl p-5 border border-white/10 hover:border-[#FF8700]/30 transition-colors">
                                    <div className="text-white/40 text-xs uppercase tracking-wider mb-2">SC Probability</div>
                                    <div className="text-3xl font-mono font-bold text-[#FF8700]">34%</div>
                                    <div className="text-white/30 text-xs mt-1">Medium risk</div>
                                </div>
                                <div className="glass-card rounded-xl p-5 border border-white/10 hover:border-[#00D2BE]/30 transition-colors">
                                    <div className="text-white/40 text-xs uppercase tracking-wider mb-2">Undercut Window</div>
                                    <div className="text-3xl font-mono font-bold text-[#00D2BE]">L18-22</div>
                                    <div className="text-white/30 text-xs mt-1">Optimal pit gap</div>
                                </div>
                                <div className="glass-card rounded-xl p-5 border border-white/10 hover:border-[#0090FF]/30 transition-colors">
                                    <div className="text-white/40 text-xs uppercase tracking-wider mb-2">Overcut Viability</div>
                                    <div className="text-3xl font-mono font-bold text-[#0090FF]">Weak</div>
                                    <div className="text-white/30 text-xs mt-1">Not recommended</div>
                                </div>
                                <div className="glass-card rounded-xl p-5 border border-white/10 hover:border-white/30 transition-colors">
                                    <div className="text-white/40 text-xs uppercase tracking-wider mb-2">Model Confidence</div>
                                    <div className="text-3xl font-mono font-bold text-white">94.8%</div>
                                    <div className="text-white/30 text-xs mt-1">High reliability</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
