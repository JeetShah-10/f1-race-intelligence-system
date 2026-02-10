import { useSimulationStore } from '../../store/useSimulationStore';

export function RaceControl() {
    const { isRunning, startSimulation, stopSimulation, connect, disconnect, isConnected } = useSimulationStore();

    const handleConnect = () => {
        if (isConnected) {
            disconnect();
        } else {
            connect('ws://localhost:8000/ws/simulate');
        }
    };

    const handleStart = () => {
        // Mock Config
        const config = {
            circuit_id: "monaco",
            year: 2024,
            lap_count: 5,
            drivers: [
                { driver: "VER", team: "Red Bull", grid_position: 1, compound: "SOFT", tyre_life: 0 },
                { driver: "HAM", team: "Mercedes", grid_position: 2, compound: "MEDIUM", tyre_life: 0 },
                { driver: "NOR", team: "McLaren", grid_position: 3, compound: "SOFT", tyre_life: 0 }
            ],
            events: []
        };
        startSimulation(config);
    };

    return (
        <div className="w-full bg-black/40 backdrop-blur-md border-t border-white/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-xs uppercase tracking-widest text-white/40">
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={handleConnect}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs uppercase tracking-widest rounded border border-white/10 transition-colors"
                >
                    {isConnected ? 'Disconnect' : 'Connect Server'}
                </button>

                <button
                    onClick={handleStart}
                    disabled={!isConnected || isRunning}
                    className="px-6 py-2 bg-[#CF2C28] hover:bg-[#B02522] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs uppercase tracking-widest font-bold rounded flex items-center gap-2 transition-colors"
                >
                    {isRunning ? 'Running...' : 'Start Race'}
                </button>

                {isRunning && (
                    <button
                        onClick={stopSimulation}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-widest font-bold rounded transition-colors"
                    >
                        Stop
                    </button>
                )}
            </div>
        </div>
    );
}
