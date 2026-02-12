/**
 * F1 Intelligence Platform — Unified 2026 Season Data
 *
 * Single source of truth for all F1 entity data:
 *   - 22 drivers with local asset paths
 *   - 11 teams with logos, cars, and metadata
 *   - 24 circuits with photos, maps, and metadata
 *   - Texture and miscellaneous asset paths
 *
 * All image paths are relative to /assets/ (served from public/assets/).
 */

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface Driver2026 {
    id: string;
    code: string;
    name: string;
    firstName: string;
    lastName: string;
    number: number;
    teamId: string;
    country: string;
    countryCode: string;
    images: {
        portrait: string;
        cutout: string;
        alternate: string;
    };
}

export interface Team2026 {
    id: string;
    name: string;
    shortName: string;
    color: string;
    secondaryColor: string;
    engineSupplier: string;
    principal: string;
    headquarters: string;
    drivers: [string, string];
    logoUrl: string;
    logoSmallUrl: string;
    carImageUrl: string;
    car2026Url: string;
}

export interface Circuit2026 {
    id: string;
    name: string;
    location: string;
    country: string;
    countryCode: string;
    round: number;
    laps: number;
    lapDistance: number;
    images: {
        photo: string;
        map: string;
    };
}

export interface TextureAsset {
    id: string;
    name: string;
    path: string;
}

// ─────────────────────────────────────────────
// ASSET PATH HELPERS
// ─────────────────────────────────────────────

const d = (file: string) => `/assets/drivers/${file}`;
const l = (file: string) => `/assets/logos/${file}`;
const c = (file: string) => `/assets/cars/${file}`;
const ci = (file: string) => `/assets/circuits/${file}`;

// ─────────────────────────────────────────────
// DRIVERS (22 — Confirmed 2026 Grid)
// ─────────────────────────────────────────────

export const DRIVERS_2026: Driver2026[] = [
    // ── McLaren ──
    {
        id: 'lando-norris',
        code: 'NOR',
        name: 'Lando Norris',
        firstName: 'Lando',
        lastName: 'Norris',
        number: 1,
        teamId: 'mclaren',
        country: 'United Kingdom',
        countryCode: 'GB',
        images: {
            portrait: d('lando-norris.webp'),
            cutout: d('lando-norris-removebg-preview.webp'),
            alternate: d('lando-norris-2.webp'),
        },
    },
    {
        id: 'oscar-piastri',
        code: 'PIA',
        name: 'Oscar Piastri',
        firstName: 'Oscar',
        lastName: 'Piastri',
        number: 81,
        teamId: 'mclaren',
        country: 'Australia',
        countryCode: 'AU',
        images: {
            portrait: d('oscar-piastri.webp'),
            cutout: d('oscar-piastri-removebg-preview.webp'),
            alternate: d('oscar-piastri-2.webp'),
        },
    },

    // ── Red Bull Racing ──
    {
        id: 'max-verstappen',
        code: 'VER',
        name: 'Max Verstappen',
        firstName: 'Max',
        lastName: 'Verstappen',
        number: 3,
        teamId: 'red-bull',
        country: 'Netherlands',
        countryCode: 'NL',
        images: {
            portrait: d('max-verstappen.webp'),
            cutout: d('max-verstappen-removebg-preview.webp'),
            alternate: d('max-verstappen-2.webp'),
        },
    },
    {
        id: 'isack-hadjar',
        code: 'HAD',
        name: 'Isack Hadjar',
        firstName: 'Isack',
        lastName: 'Hadjar',
        number: 6,
        teamId: 'red-bull',
        country: 'France',
        countryCode: 'FR',
        images: {
            portrait: d('isack-hadjar.webp'),
            cutout: d('isack-hadjar-removebg-preview.webp'),
            alternate: d('isack-hadjar-2.webp'),
        },
    },

    // ── Ferrari ──
    {
        id: 'charles-leclerc',
        code: 'LEC',
        name: 'Charles Leclerc',
        firstName: 'Charles',
        lastName: 'Leclerc',
        number: 16,
        teamId: 'ferrari',
        country: 'Monaco',
        countryCode: 'MC',
        images: {
            portrait: d('charles-leclerc.webp'),
            cutout: d('charles-leclerc-removebg-preview.webp'),
            alternate: d('charles-leclerc-2.webp'),
        },
    },
    {
        id: 'lewis-hamilton',
        code: 'HAM',
        name: 'Lewis Hamilton',
        firstName: 'Lewis',
        lastName: 'Hamilton',
        number: 44,
        teamId: 'ferrari',
        country: 'United Kingdom',
        countryCode: 'GB',
        images: {
            portrait: d('lewis-hamilton.webp'),
            cutout: d('lewis-hamilton-removebg-preview.webp'),
            alternate: d('lewis-hamilton-2.webp'),
        },
    },

    // ── Mercedes ──
    {
        id: 'george-russell',
        code: 'RUS',
        name: 'George Russell',
        firstName: 'George',
        lastName: 'Russell',
        number: 63,
        teamId: 'mercedes',
        country: 'United Kingdom',
        countryCode: 'GB',
        images: {
            portrait: d('george-russell.webp'),
            cutout: d('george-russell-removebg-preview.webp'),
            alternate: d('george-russell-2.webp'),
        },
    },
    {
        id: 'kimi-antonelli',
        code: 'ANT',
        name: 'Kimi Antonelli',
        firstName: 'Kimi',
        lastName: 'Antonelli',
        number: 12,
        teamId: 'mercedes',
        country: 'Italy',
        countryCode: 'IT',
        images: {
            portrait: d('kimi-antonelli.webp'),
            cutout: d('kimi-antonelli-removebg-preview.webp'),
            alternate: d('kimi-antonelli-2.webp'),
        },
    },

    // ── Williams ──
    {
        id: 'alex-albon',
        code: 'ALB',
        name: 'Alex Albon',
        firstName: 'Alex',
        lastName: 'Albon',
        number: 23,
        teamId: 'williams',
        country: 'Thailand',
        countryCode: 'TH',
        images: {
            portrait: d('alex-albon.webp'),
            cutout: d('alex-albon-removebg-preview.webp'),
            alternate: d('alex-albon-2.webp'),
        },
    },
    {
        id: 'carlos-sainz',
        code: 'SAI',
        name: 'Carlos Sainz',
        firstName: 'Carlos',
        lastName: 'Sainz',
        number: 55,
        teamId: 'williams',
        country: 'Spain',
        countryCode: 'ES',
        images: {
            portrait: d('carlos-sainz.webp'),
            cutout: d('carlos-sainz-removebg-preview.webp'),
            alternate: d('carlos-sainz-2.webp'),
        },
    },

    // ── Racing Bulls ──
    {
        id: 'liam-lawson',
        code: 'LAW',
        name: 'Liam Lawson',
        firstName: 'Liam',
        lastName: 'Lawson',
        number: 30,
        teamId: 'racing-bulls',
        country: 'New Zealand',
        countryCode: 'NZ',
        images: {
            portrait: d('liam-lawson.webp'),
            cutout: d('liam-lawson-removebg-preview.webp'),
            alternate: d('liam-lawson-2.webp'),
        },
    },
    {
        id: 'arvid-lindblad',
        code: 'LIN',
        name: 'Arvid Lindblad',
        firstName: 'Arvid',
        lastName: 'Lindblad',
        number: 27,
        teamId: 'racing-bulls',
        country: 'United Kingdom',
        countryCode: 'GB',
        images: {
            portrait: d('arvid-lindblad.webp'),
            cutout: d('arvid-lindblad-removebg-preview.webp'),
            alternate: d('arvid-lindblad-2.webp'),
        },
    },

    // ── Aston Martin ──
    {
        id: 'fernando-alonso',
        code: 'ALO',
        name: 'Fernando Alonso',
        firstName: 'Fernando',
        lastName: 'Alonso',
        number: 14,
        teamId: 'aston-martin',
        country: 'Spain',
        countryCode: 'ES',
        images: {
            portrait: d('fernando-alonso.webp'),
            cutout: d('fernando-alonso-removebg-preview.webp'),
            alternate: d('fernando-alonso-2.webp'),
        },
    },
    {
        id: 'lance-stroll',
        code: 'STR',
        name: 'Lance Stroll',
        firstName: 'Lance',
        lastName: 'Stroll',
        number: 18,
        teamId: 'aston-martin',
        country: 'Canada',
        countryCode: 'CA',
        images: {
            portrait: d('lance-stroll.webp'),
            cutout: d('lance-stroll-removebg-preview.webp'),
            alternate: d('lance-stroll.webp'),
        },
    },

    // ── Haas ──
    {
        id: 'esteban-ocon',
        code: 'OCO',
        name: 'Esteban Ocon',
        firstName: 'Esteban',
        lastName: 'Ocon',
        number: 31,
        teamId: 'haas',
        country: 'France',
        countryCode: 'FR',
        images: {
            portrait: d('ocon.webp'),
            cutout: d('ocon-removebg-preview.webp'),
            alternate: d('ocon-2.webp'),
        },
    },
    {
        id: 'oliver-bearman',
        code: 'BEA',
        name: 'Oliver Bearman',
        firstName: 'Oliver',
        lastName: 'Bearman',
        number: 87,
        teamId: 'haas',
        country: 'United Kingdom',
        countryCode: 'GB',
        images: {
            portrait: d('oliver-bearman.webp'),
            cutout: d('oliver-bearman-removebg-preview.webp'),
            alternate: d('oliver-bearman-2.webp'),
        },
    },

    // ── Audi ──
    {
        id: 'nico-hulkenberg',
        code: 'HUL',
        name: 'Nico Hulkenberg',
        firstName: 'Nico',
        lastName: 'Hulkenberg',
        number: 27,
        teamId: 'audi',
        country: 'Germany',
        countryCode: 'DE',
        images: {
            portrait: d('nico-hulkenberg.webp'),
            cutout: d('nico-hulkenberg-removebg-preview.webp'),
            alternate: d('nico-hulkenberg-2.webp'),
        },
    },
    {
        id: 'gabriel-bortoleto',
        code: 'BOR',
        name: 'Gabriel Bortoleto',
        firstName: 'Gabriel',
        lastName: 'Bortoleto',
        number: 5,
        teamId: 'audi',
        country: 'Brazil',
        countryCode: 'BR',
        images: {
            portrait: d('bortoleto.webp'),
            cutout: d('bortoleto-removebg-preview.webp'),
            alternate: d('bortoleto-2.webp'),
        },
    },

    // ── Alpine ──
    {
        id: 'pierre-gasly',
        code: 'GAS',
        name: 'Pierre Gasly',
        firstName: 'Pierre',
        lastName: 'Gasly',
        number: 10,
        teamId: 'alpine',
        country: 'France',
        countryCode: 'FR',
        images: {
            portrait: d('pierre-gasly.webp'),
            cutout: d('pierre-gasly-removebg-preview.webp'),
            alternate: d('pierre-gasly-2.webp'),
        },
    },
    {
        id: 'franco-colapinto',
        code: 'COL',
        name: 'Franco Colapinto',
        firstName: 'Franco',
        lastName: 'Colapinto',
        number: 43,
        teamId: 'alpine',
        country: 'Argentina',
        countryCode: 'AR',
        images: {
            portrait: d('colapinto.webp'),
            cutout: d('colapinto-removebg-preview.webp'),
            alternate: d('colapinto-2.webp'),
        },
    },

    // ── Cadillac ──
    {
        id: 'valtteri-bottas',
        code: 'BOT',
        name: 'Valtteri Bottas',
        firstName: 'Valtteri',
        lastName: 'Bottas',
        number: 77,
        teamId: 'cadillac',
        country: 'Finland',
        countryCode: 'FI',
        images: {
            portrait: d('valettri-bottas.webp'),
            cutout: d('valettri-bottas-removebg-preview.webp'),
            alternate: d('valettri-bottas-2.webp'),
        },
    },
    {
        id: 'sergio-perez',
        code: 'PER',
        name: 'Sergio Perez',
        firstName: 'Sergio',
        lastName: 'Perez',
        number: 11,
        teamId: 'cadillac',
        country: 'Mexico',
        countryCode: 'MX',
        images: {
            portrait: d('sergio-perez.webp'),
            cutout: d('sergio-perez-removebg-preview.webp'),
            alternate: d('sergio-perez-2.webp'),
        },
    },
];

// ─────────────────────────────────────────────
// TEAMS (11 — Confirmed 2026 Grid)
// ─────────────────────────────────────────────

export const TEAMS_2026: Team2026[] = [
    {
        id: 'mclaren',
        name: 'McLaren F1 Team',
        shortName: 'McLaren',
        color: '#FF8000',
        secondaryColor: '#47C7FC',
        engineSupplier: 'Mercedes',
        principal: 'Andrea Stella',
        headquarters: 'Woking, UK',
        drivers: ['NOR', 'PIA'],
        logoUrl: l('mclaren-logo.webp'),
        logoSmallUrl: l('mclaren-logo-small.webp'),
        carImageUrl: c('mclaren.webp'),
        car2026Url: c('mclaren-26.webp'),
    },
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
        logoUrl: l('redbull-logo.webp'),
        logoSmallUrl: l('redbull-logo-small.png'),
        carImageUrl: c('red-bull.webp'),
        car2026Url: c('redbull-26.webp'),
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
        logoUrl: l('ferrari-logo.webp'),
        logoSmallUrl: l('ferrari-logo-small.webp'),
        carImageUrl: c('ferrari.webp'),
        car2026Url: c('ferrari-26.webp'),
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
        logoUrl: l('mercedes-logo.webp'),
        logoSmallUrl: l('mercedes-logo-small.webp'),
        carImageUrl: c('mercedes.webp'),
        car2026Url: c('mercedes-26.webp'),
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
        logoUrl: l('aston-martin.webp'),
        logoSmallUrl: l('aston-martin-small.webp'),
        carImageUrl: c('aston-martin.webp'),
        car2026Url: c('aston-martin-26.png'),
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
        logoUrl: l('alpine-logo.webp'),
        logoSmallUrl: l('alpine-logo-small.webp'),
        carImageUrl: c('alpine-26.webp'),
        car2026Url: c('alpine-26.webp'),
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
        drivers: ['ALB', 'SAI'],
        logoUrl: l('williams-logo.webp'),
        logoSmallUrl: l('williams-logo-small.png'),
        carImageUrl: c('williams.webp'),
        car2026Url: c('williams-26.png'),
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
        logoUrl: l('racingbulls-logo.webp'),
        logoSmallUrl: l('racingbulls-logo-small.webp'),
        carImageUrl: c('racing-bulls.webp'),
        car2026Url: c('racingbulls-26.webp'),
    },
    {
        id: 'audi',
        name: 'Audi F1 Team',
        shortName: 'Audi',
        color: '#000000',
        secondaryColor: '#BB0A1E',
        engineSupplier: 'Audi',
        principal: 'Jonathan Wheatley',
        headquarters: 'Hinwil, Switzerland',
        drivers: ['HUL', 'BOR'],
        logoUrl: l('audi-logo.webp'),
        logoSmallUrl: l('audi-logo-small.png'),
        carImageUrl: c('audi.webp'),
        car2026Url: c('audi-26.webp'),
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
        logoUrl: l('haas-logo.webp'),
        logoSmallUrl: l('haas-logo-small.webp'),
        carImageUrl: c('haas.webp'),
        car2026Url: c('haas-26.webp'),
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
        logoUrl: l('cadillac-logo.webp'),
        logoSmallUrl: l('cadillac-logo-small.webp'),
        carImageUrl: c('cadillac.webp'),
        car2026Url: c('cadillac-26.webp'),
    },
];

// ─────────────────────────────────────────────
// CIRCUITS (24 — 2026 Calendar)
// ─────────────────────────────────────────────

export const CIRCUITS_2026: Circuit2026[] = [
    {
        id: 'albert-park',
        name: 'Australian Grand Prix',
        location: 'Melbourne',
        country: 'Australia',
        countryCode: 'AU',
        round: 1,
        laps: 58,
        lapDistance: 5.278,
        images: {
            photo: ci('australian-grand-prix-circuit.jpeg'),
            map: ci('australian-grand-prix-map.webp'),
        },
    },
    {
        id: 'shanghai',
        name: 'Chinese Grand Prix',
        location: 'Shanghai',
        country: 'China',
        countryCode: 'CN',
        round: 2,
        laps: 56,
        lapDistance: 5.451,
        images: {
            photo: ci('shanghai-grand-prix-circuit.webp'),
            map: ci('shanghai-grand-prix-map.png'),
        },
    },
    {
        id: 'suzuka',
        name: 'Japanese Grand Prix',
        location: 'Suzuka',
        country: 'Japan',
        countryCode: 'JP',
        round: 3,
        laps: 53,
        lapDistance: 5.807,
        images: {
            photo: ci('suzuka-circuit.webp'),
            map: ci('suzuka-map.webp'),
        },
    },
    {
        id: 'sakhir',
        name: 'Bahrain Grand Prix',
        location: 'Sakhir',
        country: 'Bahrain',
        countryCode: 'BH',
        round: 4,
        laps: 57,
        lapDistance: 5.412,
        images: {
            photo: ci('bahrain-grand-prix-circuit.webp'),
            map: ci('bahrain-grand-prix-map.png'),
        },
    },
    {
        id: 'jeddah',
        name: 'Saudi Arabian Grand Prix',
        location: 'Jeddah',
        country: 'Saudi Arabia',
        countryCode: 'SA',
        round: 5,
        laps: 50,
        lapDistance: 6.174,
        images: {
            photo: ci('saudi-arabia-grand-prix-circuit.webp'),
            map: ci('saudi-arabia-grand-prix-map.webp'),
        },
    },
    {
        id: 'miami',
        name: 'Miami Grand Prix',
        location: 'Miami',
        country: 'United States',
        countryCode: 'US',
        round: 6,
        laps: 57,
        lapDistance: 5.412,
        images: {
            photo: ci('miami-grand-prix-circuit.webp'),
            map: ci('miami-grand-prix-map.webp'),
        },
    },
    {
        id: 'montreal',
        name: 'Canadian Grand Prix',
        location: 'Montreal',
        country: 'Canada',
        countryCode: 'CA',
        round: 7,
        laps: 70,
        lapDistance: 4.361,
        images: {
            photo: ci('canadian-grand-prix-circuit.webp'),
            map: ci('canadian-grand-prix-map.png'),
        },
    },
    {
        id: 'monaco',
        name: 'Monaco Grand Prix',
        location: 'Monte Carlo',
        country: 'Monaco',
        countryCode: 'MC',
        round: 8,
        laps: 78,
        lapDistance: 3.337,
        images: {
            photo: ci('monaco-circuit.webp'),
            map: ci('monaco-map.png'),
        },
    },
    {
        id: 'catalunya',
        name: 'Spanish Grand Prix',
        location: 'Barcelona',
        country: 'Spain',
        countryCode: 'ES',
        round: 9,
        laps: 66,
        lapDistance: 4.675,
        images: {
            photo: ci('barcelona-circuit.webp'),
            map: ci('barcelona-map.webp'),
        },
    },
    {
        id: 'red-bull-ring',
        name: 'Austrian Grand Prix',
        location: 'Spielberg',
        country: 'Austria',
        countryCode: 'AT',
        round: 10,
        laps: 71,
        lapDistance: 4.318,
        images: {
            photo: ci('austrian-grand-prix-circuit.webp'),
            map: ci('austrian-grand-prix-map.png'),
        },
    },
    {
        id: 'silverstone',
        name: 'British Grand Prix',
        location: 'Silverstone',
        country: 'United Kingdom',
        countryCode: 'GB',
        round: 11,
        laps: 52,
        lapDistance: 5.891,
        images: {
            photo: ci('silverstone-circuit.webp'),
            map: ci('silverstone-map.webp'),
        },
    },
    {
        id: 'spa',
        name: 'Belgian Grand Prix',
        location: 'Stavelot',
        country: 'Belgium',
        countryCode: 'BE',
        round: 12,
        laps: 44,
        lapDistance: 7.004,
        images: {
            photo: ci('spa-circuit.webp'),
            map: ci('spa-map.webp'),
        },
    },
    {
        id: 'hungaroring',
        name: 'Hungarian Grand Prix',
        location: 'Budapest',
        country: 'Hungary',
        countryCode: 'HU',
        round: 13,
        laps: 70,
        lapDistance: 4.381,
        images: {
            photo: ci('hungarian-grand-prix-circuit.webp'),
            map: ci('hungarian-grand-prix-map.webp'),
        },
    },
    {
        id: 'zandvoort',
        name: 'Dutch Grand Prix',
        location: 'Zandvoort',
        country: 'Netherlands',
        countryCode: 'NL',
        round: 14,
        laps: 72,
        lapDistance: 4.259,
        images: {
            photo: ci('zandvoort-circuit.webp'),
            map: ci('zandvoort-map.png'),
        },
    },
    {
        id: 'monza',
        name: 'Italian Grand Prix',
        location: 'Monza',
        country: 'Italy',
        countryCode: 'IT',
        round: 15,
        laps: 53,
        lapDistance: 5.793,
        images: {
            photo: ci('monza-circuit.webp'),
            map: ci('monza-map.webp'),
        },
    },
    {
        id: 'ifema-madrid',
        name: 'Madrid Grand Prix',
        location: 'Madrid',
        country: 'Spain',
        countryCode: 'ES',
        round: 16,
        laps: 66,
        lapDistance: 5.418,
        images: {
            photo: ci('madrid-grand-prix-circuit.webp'),
            map: ci('madrid-grand-prix-map.png'),
        },
    },
    {
        id: 'baku',
        name: 'Azerbaijan Grand Prix',
        location: 'Baku',
        country: 'Azerbaijan',
        countryCode: 'AZ',
        round: 17,
        laps: 51,
        lapDistance: 6.003,
        images: {
            photo: ci('baku-circuit.webp'),
            map: ci('baku-map.webp'),
        },
    },
    {
        id: 'marina-bay',
        name: 'Singapore Grand Prix',
        location: 'Singapore',
        country: 'Singapore',
        countryCode: 'SG',
        round: 18,
        laps: 62,
        lapDistance: 4.940,
        images: {
            photo: ci('singapore-circuit.webp'),
            map: ci('singapore-map.webp'),
        },
    },
    {
        id: 'cota',
        name: 'United States Grand Prix',
        location: 'Austin',
        country: 'United States',
        countryCode: 'US',
        round: 19,
        laps: 56,
        lapDistance: 5.513,
        images: {
            photo: ci('austin-circuit.webp'),
            map: ci('austin-map.webp'),
        },
    },
    {
        id: 'mexico-city',
        name: 'Mexico City Grand Prix',
        location: 'Mexico City',
        country: 'Mexico',
        countryCode: 'MX',
        round: 20,
        laps: 71,
        lapDistance: 4.304,
        images: {
            photo: ci('mexico-grand-prix-circuit.webp'),
            map: ci('mexico-grand-prix-map.webp'),
        },
    },
    {
        id: 'interlagos',
        name: 'São Paulo Grand Prix',
        location: 'São Paulo',
        country: 'Brazil',
        countryCode: 'BR',
        round: 21,
        laps: 71,
        lapDistance: 4.309,
        images: {
            photo: ci('sao-paulo-grand-prix-circuit.webp'),
            map: ci('sao-paulo-grand-prix-map.png'),
        },
    },
    {
        id: 'las-vegas',
        name: 'Las Vegas Grand Prix',
        location: 'Las Vegas',
        country: 'United States',
        countryCode: 'US',
        round: 22,
        laps: 50,
        lapDistance: 6.201,
        images: {
            photo: ci('las-vegas-grand-prix-circuit.webp'),
            map: ci('las-vegas-grand-prix-map.webp'),
        },
    },
    {
        id: 'lusail',
        name: 'Qatar Grand Prix',
        location: 'Lusail',
        country: 'Qatar',
        countryCode: 'QA',
        round: 23,
        laps: 57,
        lapDistance: 5.419,
        images: {
            photo: ci('qatar-grand-prix-circuit.webp'),
            map: ci('qatar-grand-prix-map.png'),
        },
    },
    {
        id: 'yas-marina',
        name: 'Abu Dhabi Grand Prix',
        location: 'Abu Dhabi',
        country: 'United Arab Emirates',
        countryCode: 'AE',
        round: 24,
        laps: 58,
        lapDistance: 5.281,
        images: {
            photo: ci('abu-dhabi-grand-prix-circuit.webp'),
            map: ci('abu-dhabi-grand-prix-map.png'),
        },
    },
];

// ─────────────────────────────────────────────
// TEXTURES & MISCELLANEOUS ASSETS
// ─────────────────────────────────────────────

export const TEXTURES = {
    carbonForged: '/assets/textures/carbon-forged.png',
    steeringWheelDisplay: '/assets/textures/steering-wheel-display.png',
} as const;

export const MISC_ASSETS = {
    f1Logo: l('f1-logo.webp'),
    fiaLogo: l('fia-logo.png'),
    fiaStamp: l('fia-official-stamp.png'),
    apexLogo: l('apex-primary.png'),
    assistantLogo: l('assistant-logo.webp'),
    homeIcon: l('home-logo.webp'),
    calendarIcon: l('calender-logo.webp'),
    driverIcon: l('driver-logo.webp'),
    helmetsIcon: l('helmets-logo.webp'),
    steeringIcon: l('steering-logo.webp'),
    heroes: {
        f1Action: '/assets/heroes/f1-action.webp',
        f1HeroDark: '/assets/heroes/f1-hero-dark.webp',
        f1HeroMonaco: '/assets/heroes/f1-hero-monaco.webp',
        pitLaneNight: '/assets/heroes/pit-lane-night.webp',
        steeringWheel: '/assets/heroes/steering-wheel.webp',
    },
    videos: {
        pitCrew: '/assets/videos/f1-pit-crew-uhd.mp4',
        raceDayVlog: '/assets/videos/f1-race-day-vlog-uhd.mp4',
        raceTrack: '/assets/videos/f1-race-track-uhd.mp4',
    },
    season2026: {
        car2026: '/assets/season2026/2026-car.png',
        carLiveryVideo: '/assets/season2026/F_Car_Livery_Video_Generation.mp4',
        conceptAero: '/assets/cars/concept-2026-aero.png',
        conceptHero: '/assets/cars/concept-2026-hero.png',
        conceptPower: '/assets/cars/concept-2026-power.png',
    },
} as const;

// ─────────────────────────────────────────────
// BACKWARD COMPAT: Re-export as TEAMS_2026_DATA
// ─────────────────────────────────────────────

/** @deprecated Use TEAMS_2026 instead */
export const TEAMS_2026_DATA = TEAMS_2026;

// ─────────────────────────────────────────────
// LOOKUP HELPERS
// ─────────────────────────────────────────────

/** Get a driver by their 3-letter code (e.g. 'VER') */
export function getDriverByCode(code: string): Driver2026 | undefined {
    return DRIVERS_2026.find((d) => d.code === code);
}

/** Get a driver by their ID (e.g. 'max-verstappen') */
export function getDriverById(id: string): Driver2026 | undefined {
    return DRIVERS_2026.find((d) => d.id === id);
}

/** Get all drivers for a team (by team ID) */
export function getDriversByTeam(teamId: string): Driver2026[] {
    return DRIVERS_2026.filter((d) => d.teamId === teamId);
}

/** Get a team by ID (e.g. 'red-bull') */
export function getTeamById(id: string): Team2026 | undefined {
    return TEAMS_2026.find((t) => t.id === id);
}

/** Get a team by short name (e.g. 'McLaren') */
export function getTeamByName(name: string): Team2026 | undefined {
    return TEAMS_2026.find(
        (t) => t.shortName === name || t.name === name
    );
}

/** Get all team short names */
export function getTeamNames(): string[] {
    return TEAMS_2026.map((t) => t.shortName);
}

/** Get team color by name or ID */
export function getTeamColor(nameOrId: string): string {
    const team =
        TEAMS_2026.find((t) => t.id === nameOrId) ||
        TEAMS_2026.find(
            (t) => t.shortName === nameOrId || t.name === nameOrId
        );
    return team?.color || '#666666';
}

/** Get a circuit by ID (e.g. 'monza') */
export function getCircuitById(id: string): Circuit2026 | undefined {
    return CIRCUITS_2026.find((c) => c.id === id);
}

/** Get circuit by round number */
export function getCircuitByRound(round: number): Circuit2026 | undefined {
    return CIRCUITS_2026.find((c) => c.round === round);
}

/** Get driver portrait image path by code */
export function getDriverImage(code: string): string {
    const driver = getDriverByCode(code);
    return driver?.images.portrait || '/assets/drivers/default.webp';
}

/** Get driver cutout (transparent bg) image path by code */
export function getDriverCutout(code: string): string {
    const driver = getDriverByCode(code);
    return driver?.images.cutout || '/assets/drivers/default.webp';
}

/** Get team logo path by team ID */
export function getTeamLogo(teamId: string): string {
    const team = getTeamById(teamId);
    return team?.logoUrl || '/assets/logos/f1-logo.webp';
}

/** Get team 2026 car livery path by team ID */
export function getTeamCar2026(teamId: string): string {
    const team = getTeamById(teamId);
    return team?.car2026Url || '/assets/cars/concept-2026-hero.png';
}
