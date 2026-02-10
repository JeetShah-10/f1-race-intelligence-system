/**
 * F1 Intelligence Platform - 2026 Teams Data
 * Complete team information for the 2026 season
 */

export interface Team2026 {
    id: string;
    name: string;
    shortName: string;
    color: string;
    secondaryColor: string;
    engineSupplier: string;
    principal: string;
    headquarters: string;
    drivers: [string, string]; // Driver codes
    logoUrl?: string;
}

export const TEAMS_2026_DATA: Team2026[] = [
    {
        id: 'red-bull',
        name: 'Oracle Red Bull Racing',
        shortName: 'Red Bull Racing',
        color: '#3671C6',
        secondaryColor: '#1E3F5A',
        engineSupplier: 'Red Bull Powertrains',
        principal: 'Christian Horner',
        headquarters: 'Milton Keynes, UK',
        drivers: ['VER', 'HAD'],
    },
    {
        id: 'ferrari',
        name: 'Scuderia Ferrari HP',
        shortName: 'Ferrari',
        color: '#E8002D',
        secondaryColor: '#FF3B30',
        engineSupplier: 'Ferrari',
        principal: 'Frédéric Vasseur',
        headquarters: 'Maranello, Italy',
        drivers: ['LEC', 'HAM'],
    },
    {
        id: 'mclaren',
        name: 'McLaren Formula 1 Team',
        shortName: 'McLaren',
        color: '#FF8000',
        secondaryColor: '#47C7FC',
        engineSupplier: 'Mercedes',
        principal: 'Andrea Stella',
        headquarters: 'Woking, UK',
        drivers: ['NOR', 'PIA'],
    },
    {
        id: 'mercedes',
        name: 'Mercedes-AMG PETRONAS F1 Team',
        shortName: 'Mercedes',
        color: '#27F4D2',
        secondaryColor: '#00A19C',
        engineSupplier: 'Mercedes',
        principal: 'Toto Wolff',
        headquarters: 'Brackley, UK',
        drivers: ['RUS', 'ANT'],
    },
    {
        id: 'aston-martin',
        name: 'Aston Martin Aramco F1 Team',
        shortName: 'Aston Martin',
        color: '#229971',
        secondaryColor: '#2D826D',
        engineSupplier: 'Honda RBPT',
        principal: 'Mike Krack',
        headquarters: 'Silverstone, UK',
        drivers: ['ALO', 'STR'],
    },
    {
        id: 'alpine',
        name: 'BWT Alpine F1 Team',
        shortName: 'Alpine',
        color: '#0093CC',
        secondaryColor: '#FF87BC',
        engineSupplier: 'Renault',
        principal: 'Oliver Oakes',
        headquarters: 'Enstone, UK',
        drivers: ['GAS', 'COL'],
    },
    {
        id: 'williams',
        name: 'Williams Racing',
        shortName: 'Williams',
        color: '#64C4FF',
        secondaryColor: '#041E42',
        engineSupplier: 'Mercedes',
        principal: 'James Vowles',
        headquarters: 'Grove, UK',
        drivers: ['SAI', 'ALB'],
    },
    {
        id: 'racing-bulls',
        name: 'Visa Cash App Racing Bulls',
        shortName: 'Racing Bulls',
        color: '#6692FF',
        secondaryColor: '#1E3264',
        engineSupplier: 'Red Bull Powertrains',
        principal: 'Laurent Mekies',
        headquarters: 'Faenza, Italy',
        drivers: ['LAW', 'LIN'],
    },
    {
        id: 'audi',
        name: 'Audi Formula 1 Team',
        shortName: 'Audi',
        color: '#000000',
        secondaryColor: '#BB0A1E',
        engineSupplier: 'Audi',
        principal: 'Jonathan Wheatley',
        headquarters: 'Hinwil, Switzerland',
        drivers: ['HUL', 'BOR'],
    },
    {
        id: 'haas',
        name: 'MoneyGram Haas F1 Team',
        shortName: 'Haas',
        color: '#B6BABD',
        secondaryColor: '#ED1C24',
        engineSupplier: 'Ferrari',
        principal: 'Ayao Komatsu',
        headquarters: 'Kannapolis, USA',
        drivers: ['OCO', 'BEA'],
    },
    {
        id: 'cadillac',
        name: 'Cadillac F1 Team',
        shortName: 'Cadillac',
        color: '#1E3264',
        secondaryColor: '#D4AF37',
        engineSupplier: 'Ferrari',
        principal: 'TBA',
        headquarters: 'USA',
        drivers: ['PER', 'BOT'],
    },
];

/** Get team by ID */
export function getTeamById(id: string): Team2026 | undefined {
    return TEAMS_2026_DATA.find((t) => t.id === id);
}

/** Get team by short name */
export function getTeamByName(name: string): Team2026 | undefined {
    return TEAMS_2026_DATA.find(
        (t) => t.shortName === name || t.name === name
    );
}

/** Get all team short names */
export function getTeamNames(): string[] {
    return TEAMS_2026_DATA.map((t) => t.shortName);
}

/** Get team color by name */
export function getTeamColor(name: string): string {
    const team = getTeamByName(name);
    return team?.color || '#666666';
}
