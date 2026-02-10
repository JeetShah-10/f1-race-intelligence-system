/**
 * F1 Intelligence Platform - 2026 Driver Grid Mock Data
 * Complete driver roster with team colors and metadata
 * Updated for 2026 season with Hamilton at Ferrari, Audi, and Cadillac
 */

import type { Driver } from '../types/f1';

export const DRIVERS_2026: Driver[] = [
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
        code: 'HAD',
        firstName: 'Isack',
        lastName: 'Hadjar',
        number: 6,
        team: 'Red Bull Racing',
        teamColor: '#3671C6',
        nationality: 'FRA',
        fullName: 'Isack Hadjar',
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
        code: 'COL',
        firstName: 'Franco',
        lastName: 'Colapinto',
        number: 43,
        team: 'Alpine',
        teamColor: '#0093CC',
        nationality: 'ARG',
        fullName: 'Franco Colapinto',
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

    // Racing Bulls
    {
        code: 'LAW',
        firstName: 'Liam',
        lastName: 'Lawson',
        number: 30,
        team: 'Racing Bulls',
        teamColor: '#6692FF',
        nationality: 'NZL',
        fullName: 'Liam Lawson',
    },
    {
        code: 'LIN',
        firstName: 'Arvid',
        lastName: 'Lindblad',
        number: 41,
        team: 'Racing Bulls',
        teamColor: '#6692FF',
        nationality: 'GBR',
        fullName: 'Arvid Lindblad',
    },

    // Audi (formerly Sauber)
    {
        code: 'HUL',
        firstName: 'Nico',
        lastName: 'Hulkenberg',
        number: 27,
        team: 'Audi',
        teamColor: '#000000',
        nationality: 'GER',
        fullName: 'Nico Hulkenberg',
    },
    {
        code: 'BOR',
        firstName: 'Gabriel',
        lastName: 'Bortoleto',
        number: 5,
        team: 'Audi',
        teamColor: '#000000',
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

    // Cadillac (new 11th team)
    {
        code: 'PER',
        firstName: 'Sergio',
        lastName: 'Perez',
        number: 11,
        team: 'Cadillac',
        teamColor: '#1E3264',
        nationality: 'MEX',
        fullName: 'Sergio Perez',
    },
    {
        code: 'BOT',
        firstName: 'Valtteri',
        lastName: 'Bottas',
        number: 77,
        team: 'Cadillac',
        teamColor: '#1E3264',
        nationality: 'FIN',
        fullName: 'Valtteri Bottas',
    },
];

/** Get driver by code */
export function getDriverByCode(code: string): Driver | undefined {
    return DRIVERS_2026.find((d) => d.code === code);
}

/** Get all drivers for a team */
export function getDriversByTeam(team: string): Driver[] {
    return DRIVERS_2026.filter((d) => d.team === team);
}

/** All team names for 2026 */
export const TEAMS_2026 = [
    'Red Bull Racing',
    'Ferrari',
    'McLaren',
    'Mercedes',
    'Aston Martin',
    'Alpine',
    'Williams',
    'Racing Bulls',
    'Audi',
    'Haas',
    'Cadillac',
] as const;

/** Team color map for 2026 */
export const TEAM_COLORS_2026: Record<string, string> = {
    'Red Bull Racing': '#3671C6',
    'Ferrari': '#E8002D',
    'McLaren': '#FF8000',
    'Mercedes': '#27F4D2',
    'Aston Martin': '#229971',
    'Alpine': '#0093CC',
    'Williams': '#64C4FF',
    'Racing Bulls': '#6692FF',
    'Audi': '#000000',
    'Haas': '#B6BABD',
    'Cadillac': '#1E3264',
};

// Legacy export for backwards compatibility
export const DRIVERS_2025 = DRIVERS_2026;
export const TEAMS_2025 = TEAMS_2026;
export const TEAM_COLORS = TEAM_COLORS_2026;
