import { useDashboardStore, selectNextRace } from '../../store';

const WEATHER_ICONS: Record<string, React.FC<{ className?: string }>> = {
    'Sunny': ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="5" />
            <g stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </g>
        </svg>
    ),
    'Cloudy': ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
        </svg>
    ),
    'Rain': ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 13v8M8 13v8M12 15v8" />
            <path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25" />
        </svg>
    ),
};

export function WeatherWidget() {
    const nextRace = useDashboardStore(selectNextRace);

    // Parse weather string (e.g., "Sunny 24°C")
    const weatherParts = nextRace.weather.split(' ');
    const condition = weatherParts[0] || 'Sunny';
    const temperature = weatherParts[1] || '';

    const WeatherIcon = WEATHER_ICONS[condition] || WEATHER_ICONS['Sunny'];

    return (
        <div className="glass-card p-4 gpu-accelerated hover-lift">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center text-[#FFD700]">
                    <WeatherIcon className="w-10 h-10" />
                </div>
                <div className="flex-1">
                    <div className="text-white font-medium">{condition}</div>
                    <div className="text-2xl font-mono font-light text-white">{temperature}</div>
                </div>
                <div className="text-right">
                    <div className="text-white/40 text-[10px] uppercase tracking-wider">Track Temp</div>
                    <div className="text-lg font-mono text-[#FF8700]">42°C</div>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-4">
                <div>
                    <div className="text-white/40 text-[10px] uppercase">Rain Chance</div>
                    <div className="text-white text-sm font-mono">12%</div>
                </div>
                <div>
                    <div className="text-white/40 text-[10px] uppercase">Wind</div>
                    <div className="text-white text-sm font-mono">8 km/h</div>
                </div>
            </div>
        </div>
    );
}
