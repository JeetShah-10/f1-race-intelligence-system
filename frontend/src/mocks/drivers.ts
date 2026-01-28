/**
 * F1 Intelligence Platform - 2025 Driver Grid Mock Data
 * Complete driver roster with team colors and metadata
 */

import type { Driver } from '../types/f1';

export const DRIVERS_2025: Driver[] = [
    // Red Bull Racing
    {
        code: 'VER',
        firstName: 'Max',
        lastName: 'Verstappen',
        number: 1,
        team: 'Red Bull Racing',
        teamColor: '#3671C6',
        nationality: 'NED',
        fullName: 'Max Verstappen',
    },
    {
        code: 'LAW',
        firstName: 'Liam',
        lastName: 'Lawson',
        number: 30,
        team: 'Red Bull Racing',
        teamColor: '#3671C6',
        nationality: 'NZL',
        fullName: 'Liam Lawson',
    },

    // Ferrari
    {
        code: 'LEC',
        firstName: 'Charles',
        lastName: 'Leclerc',
        number: 16,
        team: 'Ferrari',
        teamColor: '#E8002D',
        nationality: 'MON',
        fullName: 'Charles Leclerc',
    },
    {
        code: 'HAM',
        firstName: 'Lewis',
        lastName: 'Hamilton',
        number: 44,
        team: 'Ferrari',
        teamColor: '#E8002D',
        nationality: 'GBR',
        fullName: 'Lewis Hamilton',
    },

    // McLaren
    {
        code: 'NOR',
        firstName: 'Lando',
        lastName: 'Norris',
        number: 4,
        team: 'McLaren',
        teamColor: '#FF8000',
        nationality: 'GBR',
        fullName: 'Lando Norris',
    },
    {
        code: 'PIA',
        firstName: 'Oscar',
        lastName: 'Piastri',
        number: 81,
        team: 'McLaren',
        teamColor: '#FF8000',
        nationality: 'AUS',
        fullName: 'Oscar Piastri',
    },

    // Mercedes
    {
        code: 'RUS',
        firstName: 'George',
        lastName: 'Russell',
        number: 63,
        team: 'Mercedes',
        teamColor: '#27F4D2',
        nationality: 'GBR',
        fullName: 'George Russell',
    },
    {
        code: 'ANT',
        firstName: 'Kimi',
        lastName: 'Antonelli',
        number: 12,
        team: 'Mercedes',
        teamColor: '#27F4D2',
        nationality: 'ITA',
        fullName: 'Kimi Antonelli',
    },

    // Aston Martin
    {
        code: 'ALO',
        firstName: 'Fernando',
        lastName: 'Alonso',
        number: 14,
        team: 'Aston Martin',
        teamColor: '#229971',
        nationality: 'ESP',
        fullName: 'Fernando Alonso',
    },
    {
        code: 'STR',
        firstName: 'Lance',
        lastName: 'Stroll',
        number: 18,
        team: 'Aston Martin',
        teamColor: '#229971',
        nationality: 'CAN',
        fullName: 'Lance Stroll',
    },

    // Alpine
    {
        code: 'GAS',
        firstName: 'Pierre',
        lastName: 'Gasly',
        number: 10,
        team: 'Alpine',
        teamColor: '#0093CC',
        nationality: 'FRA',
        fullName: 'Pierre Gasly',
    },
    {
        code: 'DOO',
        firstName: 'Jack',
        lastName: 'Doohan',
        number: 7,
        team: 'Alpine',
        teamColor: '#0093CC',
        nationality: 'AUS',
        fullName: 'Jack Doohan',
    },

    // Williams
    {
        code: 'SAI',
        firstName: 'Carlos',
        lastName: 'Sainz',
        number: 55,
        team: 'Williams',
        teamColor: '#64C4FF',
        nationality: 'ESP',
        fullName: 'Carlos Sainz',
    },
    {
        code: 'ALB',
        firstName: 'Alex',
        lastName: 'Albon',
        number: 23,
        team: 'Williams',
        teamColor: '#64C4FF',
        nationality: 'THA',
        fullName: 'Alex Albon',
    },

    // RB (Visa Cash App RB)
    {
        code: 'TSU',
        firstName: 'Yuki',
        lastName: 'Tsunoda',
        number: 22,
        team: 'RB',
        teamColor: '#6692FF',
        nationality: 'JPN',
        fullName: 'Yuki Tsunoda',
    },
    {
        code: 'HAD',
        firstName: 'Isack',
        lastName: 'Hadjar',
        number: 6,
        team: 'RB',
        teamColor: '#6692FF',
        nationality: 'FRA',
        fullName: 'Isack Hadjar',
    },

    // Kick Sauber
    {
        code: 'HUL',
        firstName: 'Nico',
        lastName: 'Hulkenberg',
        number: 27,
        team: 'Kick Sauber',
        teamColor: '#52E252',
        nationality: 'GER',
        fullName: 'Nico Hulkenberg',
    },
    {
        code: 'BOR',
        firstName: 'Gabriel',
        lastName: 'Bortoleto',
        number: 5,
        team: 'Kick Sauber',
        teamColor: '#52E252',
        nationality: 'BRA',
        fullName: 'Gabriel Bortoleto',
    },

    // Haas
    {
        code: 'OCO',
        firstName: 'Esteban',
        lastName: 'Ocon',
        number: 31,
        team: 'Haas',
        teamColor: '#B6BABD',
        nationality: 'FRA',
        fullName: 'Esteban Ocon',
    },
    {
        code: 'BEA',
        firstName: 'Oliver',
        lastName: 'Bearman',
        number: 87,
        team: 'Haas',
        teamColor: '#B6BABD',
        nationality: 'GBR',
        fullName: 'Oliver Bearman',
    },
];

/** Get driver by code */
export function getDriverByCode(code: string): Driver | undefined {
    return DRIVERS_2025.find((d) => d.code === code);
}

/** Get all drivers for a team */
export function getDriversByTeam(team: string): Driver[] {
    return DRIVERS_2025.filter((d) => d.team === team);
}

/** All team names */
export const TEAMS_2025 = [
    'Red Bull Racing',
    'Ferrari',
    'McLaren',
    'Mercedes',
    'Aston Martin',
    'Alpine',
    'Williams',
    'RB',
    'Kick Sauber',
    'Haas',
] as const;

/** Team color map */
export const TEAM_COLORS: Record<string, string> = {
    'Red Bull Racing': '#3671C6',
    'Ferrari': '#E8002D',
    'McLaren': '#FF8000',
    'Mercedes': '#27F4D2',
    'Aston Martin': '#229971',
    'Alpine': '#0093CC',
    'Williams': '#64C4FF',
    'RB': '#6692FF',
    'Kick Sauber': '#52E252',
    'Haas': '#B6BABD',
};
