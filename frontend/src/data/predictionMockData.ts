import { DRIVERS_2026 as F1_DRIVERS, TEAMS_2026, CIRCUITS_2026 as F1_CIRCUITS } from './f1-data';
import type { TireCompound } from '../types/simulation';
import type {
    PredictionDriver,
    PredictionResult,
    PredictionInsight,
    TyreStint,
    WeatherCondition,
} from '../types/prediction';

function seededRandom(seed: number): () => number {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

const COUNTRY_FLAGS: Record<string, string> = {
    AU: '🇦🇺', CN: '🇨🇳', JP: '🇯🇵', BH: '🇧🇭', SA: '🇸🇦', US: '🇺🇸',
    CA: '🇨🇦', MC: '🇲🇨', ES: '🇪🇸', AT: '🇦🇹', GB: '🇬🇧', BE: '🇧🇪',
    HU: '🇭🇺', NL: '🇳🇱', IT: '🇮🇹', AZ: '🇦🇿', SG: '🇸🇬', MX: '🇲🇽',
    BR: '🇧🇷', QA: '🇶🇦', AE: '🇦🇪',
};

export function getCountryFlag(countryCode: string): string {
    return COUNTRY_FLAGS[countryCode] || '';
}

interface DriverSeed {
    code: string;
    name: string;
    number: number;
    teamId: string;
    photo: string;
    cutout: string;
    basePace: number;
    racecraft: number;
}

const DRIVER_SEEDS: DriverSeed[] = F1_DRIVERS.map(d => {
    const paceMap: Record<string, number> = {
        VER: 0.0, NOR: 0.03, LEC: 0.05, HAM: 0.08, PIA: 0.10,
        RUS: 0.12, SAI: 0.18, ALO: 0.20, ANT: 0.25, ALB: 0.28,
        GAS: 0.30, LAW: 0.32, HAD: 0.35, OCO: 0.35, HUL: 0.38,
        STR: 0.40, BEA: 0.40, LIN: 0.42, COL: 0.45, BOR: 0.48,
        PER: 0.50, BOT: 0.52,
    };
    const craftMap: Record<string, number> = {
        VER: 0.95, HAM: 0.92, ALO: 0.90, LEC: 0.88, NOR: 0.87,
        RUS: 0.85, SAI: 0.84, PIA: 0.82, GAS: 0.78, ALB: 0.76,
        HUL: 0.74, LAW: 0.72, OCO: 0.72, ANT: 0.70, PER: 0.70,
        BEA: 0.66, BOT: 0.65, BOR: 0.64, COL: 0.62, HAD: 0.60,
        LIN: 0.58, STR: 0.55,
    };
    return {
        code: d.code,
        name: d.name,
        number: d.number,
        teamId: d.teamId,
        photo: d.images.portrait,
        cutout: d.images.cutout,
        basePace: paceMap[d.code] ?? 0.5,
        racecraft: craftMap[d.code] ?? 0.6,
    };
});

function getTeam(teamId: string) {
    const t = TEAMS_2026.find(t => t.id === teamId);
    return { name: t?.shortName || teamId, color: t?.color || '#666' };
}

const STRATEGIES: TireCompound[][] = [
    ['SOFT', 'MEDIUM', 'HARD'],
    ['MEDIUM', 'HARD', 'SOFT'],
    ['SOFT', 'HARD', 'MEDIUM'],
    ['MEDIUM', 'HARD'],
    ['SOFT', 'MEDIUM'],
    ['HARD', 'MEDIUM', 'SOFT'],
];

function generateTyreStrategy(rand: () => number, totalLaps: number): TyreStint[] {
    const strat = STRATEGIES[Math.floor(rand() * STRATEGIES.length)];
    const stints = strat.length;
    const baseLaps = Math.floor(totalLaps / stints);
    return strat.map((compound, i) => ({
        compound,
        laps: i === stints - 1 ? totalLaps - baseLaps * (stints - 1) : baseLaps + Math.floor(rand() * 4 - 2),
    }));
}

function formatGap(gap: number): string {
    if (gap <= 0) return 'LEADER';
    return `+${gap.toFixed(3)}`;
}

export function generatePrediction(circuitId: string): PredictionResult {
    const circuit = F1_CIRCUITS.find(c => c.id === circuitId) || F1_CIRCUITS[0];
    const seed = circuitId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const rand = seededRandom(seed);

    const sorted = [...DRIVER_SEEDS].sort((a, b) => {
        const paceA = a.basePace + (rand() - 0.5) * 0.3;
        const paceB = b.basePace + (rand() - 0.5) * 0.3;
        const craftBonus = (a.racecraft - b.racecraft) * 0.1 * (rand() - 0.3);
        return (paceA - craftBonus) - (paceB + craftBonus);
    });

    const fastestLapIndex = Math.floor(rand() * 5);
    let cumulativeGap = 0;

    const classification: PredictionDriver[] = sorted.slice(0, 20).map((driver, i) => {
        const team = getTeam(driver.teamId);
        const gap = i === 0 ? 0 : cumulativeGap + 1.5 + rand() * 8;
        cumulativeGap = gap;
        const isDNF = i >= 17 && rand() > 0.7;

        return {
            position: i + 1,
            driverCode: driver.code,
            driverName: driver.name,
            driverNumber: driver.number,
            teamId: driver.teamId,
            teamName: team.name,
            teamColor: team.color,
            driverPhoto: driver.photo,
            driverCutout: driver.cutout,
            gap: isDNF ? 'DNF' : formatGap(gap),
            pitStops: isDNF ? 0 : (generateTyreStrategy(rand, circuit.laps).length - 1) + 1,
            fastestLap: i === fastestLapIndex && !isDNF,
            tyreStrategy: generateTyreStrategy(rand, circuit.laps),
            status: isDNF ? 'DNF' : 'FINISHED',
        };
    });

    const weatherOptions: WeatherCondition[] = ['SUNNY', 'SUNNY', 'SUNNY', 'CLOUDY', 'CLOUDY', 'LIGHT_RAIN'];
    const weather = weatherOptions[Math.floor(rand() * weatherOptions.length)];
    const temps: Record<WeatherCondition, [number, number]> = {
        SUNNY: [28, 38], CLOUDY: [22, 30], LIGHT_RAIN: [18, 25], HEAVY_RAIN: [15, 22],
    };
    const [minT, maxT] = temps[weather];
    const temperature = Math.round(minT + rand() * (maxT - minT));

    const battleA = classification[3 + Math.floor(rand() * 3)];
    const battleB = classification[4 + Math.floor(rand() * 3)];

    const insights: PredictionInsight[] = [
        {
            type: 'confidence',
            label: 'Model Confidence',
            value: `${Math.round(78 + rand() * 19)}%`,
            numericValue: Math.round(78 + rand() * 19),
            icon: 'Brain',
            color: '#A020F0',
        },
        {
            type: 'safety_car',
            label: 'Safety Car Probability',
            value: `${Math.round(20 + rand() * 55)}%`,
            numericValue: Math.round(20 + rand() * 55),
            icon: 'ShieldAlert',
            color: '#FF9800',
        },
        {
            type: 'undercut',
            label: 'Undercut Window',
            value: `Lap ${Math.round(10 + rand() * 8)}-${Math.round(20 + rand() * 8)}`,
            numericValue: 0,
            icon: 'Timer',
            color: '#00E676',
        },
        {
            type: 'battle',
            label: 'Key Battle',
            value: `${battleA.driverCode} vs ${battleB.driverCode}`,
            numericValue: 0,
            icon: 'Swords',
            color: '#FF4444',
            primaryDriver: battleA.driverCode,
            primaryTeamColor: battleA.teamColor,
            secondaryDriver: battleB.driverCode,
            secondaryTeamColor: battleB.teamColor,
        },
        {
            type: 'drs',
            label: 'DRS Effectiveness',
            value: `${Math.round(2 + rand() * 3)}/5`,
            numericValue: Math.round(2 + rand() * 3),
            icon: 'Gauge',
            color: '#64C4FF',
        },
        {
            type: 'weather',
            label: 'Weather Impact',
            value: weather === 'SUNNY' ? 'Low' : weather === 'CLOUDY' ? 'Medium' : 'High',
            numericValue: weather === 'SUNNY' ? 1 : weather === 'CLOUDY' ? 2 : 3,
            icon: weather === 'SUNNY' ? 'Sun' : weather === 'CLOUDY' ? 'Cloud' : 'CloudRain',
            color: weather === 'SUNNY' ? '#FFC906' : weather === 'CLOUDY' ? '#B6BABD' : '#0064E0',
        },
    ];

    return {
        circuitId,
        classification,
        insights,
        weather,
        temperature,
        confidence: insights[0].numericValue,
        timestamp: Date.now(),
    };
}

export { F1_CIRCUITS as PREDICTION_CIRCUITS };
export { TEAMS_2026 as PREDICTION_TEAMS };
