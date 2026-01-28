/**
 * F1 Intelligence Platform - 2025 Standings Mock Data
 * Sample championship standings for UI development
 */

import type { DriverStanding, ConstructorStanding } from '../types/f1';

/**
 * Sample Driver Championship Standings (2025 Season - Mid-Season)
 * Based on realistic point distributions
 */
export const DRIVER_STANDINGS_2025: DriverStanding[] = [
    {
        position: 1,
        driver: 'VER',
        driverName: 'Max Verstappen',
        team: 'Red Bull Racing',
        points: 255,
        wins: 7,
        podiums: 10,
        poles: 6,
        fastestLaps: 4,
        lastRacePoints: 25,
    },
    {
        position: 2,
        driver: 'NOR',
        driverName: 'Lando Norris',
        team: 'McLaren',
        points: 203,
        wins: 3,
        podiums: 9,
        poles: 3,
        fastestLaps: 2,
        lastRacePoints: 18,
    },
    {
        position: 3,
        driver: 'LEC',
        driverName: 'Charles Leclerc',
        team: 'Ferrari',
        points: 188,
        wins: 2,
        podiums: 7,
        poles: 4,
        fastestLaps: 2,
        lastRacePoints: 15,
    },
    {
        position: 4,
        driver: 'HAM',
        driverName: 'Lewis Hamilton',
        team: 'Ferrari',
        points: 175,
        wins: 2,
        podiums: 6,
        poles: 1,
        fastestLaps: 3,
        lastRacePoints: 12,
    },
    {
        position: 5,
        driver: 'PIA',
        driverName: 'Oscar Piastri',
        team: 'McLaren',
        points: 162,
        wins: 2,
        podiums: 5,
        poles: 1,
        fastestLaps: 1,
        lastRacePoints: 10,
    },
    {
        position: 6,
        driver: 'RUS',
        driverName: 'George Russell',
        team: 'Mercedes',
        points: 145,
        wins: 1,
        podiums: 5,
        poles: 2,
        fastestLaps: 1,
        lastRacePoints: 8,
    },
    {
        position: 7,
        driver: 'SAI',
        driverName: 'Carlos Sainz',
        team: 'Williams',
        points: 108,
        wins: 0,
        podiums: 3,
        poles: 0,
        fastestLaps: 1,
        lastRacePoints: 6,
    },
    {
        position: 8,
        driver: 'ALO',
        driverName: 'Fernando Alonso',
        team: 'Aston Martin',
        points: 95,
        wins: 0,
        podiums: 2,
        poles: 0,
        fastestLaps: 0,
        lastRacePoints: 4,
    },
    {
        position: 9,
        driver: 'LAW',
        driverName: 'Liam Lawson',
        team: 'Red Bull Racing',
        points: 82,
        wins: 0,
        podiums: 2,
        poles: 0,
        fastestLaps: 0,
        lastRacePoints: 2,
    },
    {
        position: 10,
        driver: 'ANT',
        driverName: 'Kimi Antonelli',
        team: 'Mercedes',
        points: 68,
        wins: 0,
        podiums: 1,
        poles: 0,
        fastestLaps: 0,
        lastRacePoints: 1,
    },
    {
        position: 11,
        driver: 'GAS',
        driverName: 'Pierre Gasly',
        team: 'Alpine',
        points: 48,
        wins: 0,
        podiums: 0,
        poles: 0,
        fastestLaps: 0,
        lastRacePoints: 0,
    },
    {
        position: 12,
        driver: 'STR',
        driverName: 'Lance Stroll',
        team: 'Aston Martin',
        points: 42,
        wins: 0,
        podiums: 0,
        poles: 0,
        fastestLaps: 0,
        lastRacePoints: 0,
    },
    {
        position: 13,
        driver: 'ALB',
        driverName: 'Alex Albon',
        team: 'Williams',
        points: 36,
        wins: 0,
        podiums: 0,
        poles: 0,
        fastestLaps: 0,
        lastRacePoints: 0,
    },
    {
        position: 14,
        driver: 'TSU',
        driverName: 'Yuki Tsunoda',
        team: 'RB',
        points: 28,
        wins: 0,
        podiums: 0,
        poles: 0,
        fastestLaps: 0,
        lastRacePoints: 0,
    },
    {
        position: 15,
        driver: 'HUL',
        driverName: 'Nico Hulkenberg',
        team: 'Kick Sauber',
        points: 22,
        wins: 0,
        podiums: 0,
        poles: 0,
        fastestLaps: 0,
        lastRacePoints: 0,
    },
    {
        position: 16,
        driver: 'OCO',
        driverName: 'Esteban Ocon',
        team: 'Haas',
        points: 16,
        wins: 0,
        podiums: 0,
        poles: 0,
        fastestLaps: 0,
        lastRacePoints: 0,
    },
    {
        position: 17,
        driver: 'DOO',
        driverName: 'Jack Doohan',
        team: 'Alpine',
        points: 12,
        wins: 0,
        podiums: 0,
        poles: 0,
        fastestLaps: 0,
        lastRacePoints: 0,
    },
    {
        position: 18,
        driver: 'HAD',
        driverName: 'Isack Hadjar',
        team: 'RB',
        points: 8,
        wins: 0,
        podiums: 0,
        poles: 0,
        fastestLaps: 0,
        lastRacePoints: 0,
    },
    {
        position: 19,
        driver: 'BEA',
        driverName: 'Oliver Bearman',
        team: 'Haas',
        points: 6,
        wins: 0,
        podiums: 0,
        poles: 0,
        fastestLaps: 0,
        lastRacePoints: 0,
    },
    {
        position: 20,
        driver: 'BOR',
        driverName: 'Gabriel Bortoleto',
        team: 'Kick Sauber',
        points: 4,
        wins: 0,
        podiums: 0,
        poles: 0,
        fastestLaps: 0,
        lastRacePoints: 0,
    },
];

/**
 * Sample Constructor Championship Standings (2025 Season - Mid-Season)
 */
export const CONSTRUCTOR_STANDINGS_2025: ConstructorStanding[] = [
    {
        position: 1,
        team: 'McLaren',
        shortName: 'MCL',
        teamColor: '#FF8000',
        points: 365,
        wins: 5,
        drivers: ['NOR', 'PIA'],
    },
    {
        position: 2,
        team: 'Ferrari',
        shortName: 'FER',
        teamColor: '#E8002D',
        points: 363,
        wins: 4,
        drivers: ['LEC', 'HAM'],
    },
    {
        position: 3,
        team: 'Red Bull Racing',
        shortName: 'RBR',
        teamColor: '#3671C6',
        points: 337,
        wins: 7,
        drivers: ['VER', 'LAW'],
    },
    {
        position: 4,
        team: 'Mercedes',
        shortName: 'MER',
        teamColor: '#27F4D2',
        points: 213,
        wins: 1,
        drivers: ['RUS', 'ANT'],
    },
    {
        position: 5,
        team: 'Williams',
        shortName: 'WIL',
        teamColor: '#64C4FF',
        points: 144,
        wins: 0,
        drivers: ['SAI', 'ALB'],
    },
    {
        position: 6,
        team: 'Aston Martin',
        shortName: 'AMR',
        teamColor: '#229971',
        points: 137,
        wins: 0,
        drivers: ['ALO', 'STR'],
    },
    {
        position: 7,
        team: 'Alpine',
        shortName: 'ALP',
        teamColor: '#0093CC',
        points: 60,
        wins: 0,
        drivers: ['GAS', 'DOO'],
    },
    {
        position: 8,
        team: 'RB',
        shortName: 'RB',
        teamColor: '#6692FF',
        points: 36,
        wins: 0,
        drivers: ['TSU', 'HAD'],
    },
    {
        position: 9,
        team: 'Kick Sauber',
        shortName: 'KSA',
        teamColor: '#52E252',
        points: 26,
        wins: 0,
        drivers: ['HUL', 'BOR'],
    },
    {
        position: 10,
        team: 'Haas',
        shortName: 'HAA',
        teamColor: '#B6BABD',
        points: 22,
        wins: 0,
        drivers: ['OCO', 'BEA'],
    },
];

/** Get driver standing by code */
export function getDriverStanding(code: string): DriverStanding | undefined {
    return DRIVER_STANDINGS_2025.find((s) => s.driver === code);
}

/** Get constructor standing by team name */
export function getConstructorStanding(team: string): ConstructorStanding | undefined {
    return CONSTRUCTOR_STANDINGS_2025.find((s) => s.team === team);
}

/** Get top N drivers */
export function getTopDrivers(n: number): DriverStanding[] {
    return DRIVER_STANDINGS_2025.slice(0, n);
}

/** Get top N constructors */
export function getTopConstructors(n: number): ConstructorStanding[] {
    return CONSTRUCTOR_STANDINGS_2025.slice(0, n);
}

/** Calculate points gap to leader */
export function getPointsGapToLeader(code: string): number {
    const standing = getDriverStanding(code);
    if (!standing) return 0;
    const leader = DRIVER_STANDINGS_2025[0];
    return leader.points - standing.points;
}
