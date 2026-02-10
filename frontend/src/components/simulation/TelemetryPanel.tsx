import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useSimulationStore } from '../../store/useSimulationStore';

export function TelemetryPanel() {
    const { telemetryHistory } = useSimulationStore();

    // We need to transform history into Recharts format:
    // [ { lap: 1, VER: 82.1, HAM: 82.4 }, { lap: 2, VER: 81.9, HAM: 82.0 } ]

    const data = [];
    const drivers = Object.keys(telemetryHistory);

    // Find max laps
    let maxLaps = 0;
    drivers.forEach(d => {
        if (telemetryHistory[d].length > maxLaps) maxLaps = telemetryHistory[d].length;
    });

    for (let i = 0; i < maxLaps; i++) {
        const point: any = { lap: i + 1 };
        drivers.forEach(d => {
            if (telemetryHistory[d][i]) {
                point[d] = telemetryHistory[d][i].time;
            }
        });
        data.push(point);
    }

    // Filter to top 3 drivers for clarity? Or just all?
    // Let's just show top 5 for performance/clutter
    const top5Drivers = drivers.slice(0, 5);
    const colors = ['#3671C6', '#2AB4A9', '#EF1A2D', '#FF8700', '#FFFFFF'];

    return (
        <div className="w-full h-full bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-4 flex flex-col">
            <h3 className="text-xs uppercase tracking-widest text-white/60 mb-4 font-bold">Live Pace Telemetry</h3>

            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis
                            dataKey="lap"
                            stroke="#ffffff40"
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#ffffff40"
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0B0D10', borderColor: '#ffffff20', borderRadius: '8px' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        {top5Drivers.map((driver, index) => (
                            <Line
                                key={driver}
                                type="monotone"
                                dataKey={driver}
                                stroke={colors[index % colors.length]}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
