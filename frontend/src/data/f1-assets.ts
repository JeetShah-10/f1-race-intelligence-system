/**
 * F1 Driver Assets Configuration
 * Official F1.com driver images for the 2026 season
 */

export interface Driver {
    name: string;
    team: string;
    number: number;
    country: string;
    imageUrl: string;
}

export interface Circuit {
    name: string;
    location: string;
    imageUrl: string;
}

export interface Team {
    name: string;
    color: string;
    logoUrl?: string;
}

// Top drivers with their official image URLs from Formula1.com
export const DRIVERS: Record<string, Driver> = {
    max_verstappen: {
        name: "Max Verstappen",
        team: "Red Bull Racing",
        number: 1,
        country: "Netherlands",
        imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png"
    },
    lewis_hamilton: {
        name: "Lewis Hamilton",
        team: "Ferrari",
        number: 44,
        country: "United Kingdom",
        imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png"
    },
    charles_leclerc: {
        name: "Charles Leclerc",
        team: "Ferrari",
        number: 16,
        country: "Monaco",
        imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png"
    },
    lando_norris: {
        name: "Lando Norris",
        team: "McLaren",
        number: 4,
        country: "United Kingdom",
        imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png"
    },
    oscar_piastri: {
        name: "Oscar Piastri",
        team: "McLaren",
        number: 81,
        country: "Australia",
        imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png"
    },
    george_russell: {
        name: "George Russell",
        team: "Mercedes",
        number: 63,
        country: "United Kingdom",
        imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png"
    },
    fernando_alonso: {
        name: "Fernando Alonso",
        team: "Aston Martin",
        number: 14,
        country: "Spain",
        imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png"
    },
    carlos_sainz: {
        name: "Carlos Sainz",
        team: "Williams",
        number: 55,
        country: "Spain",
        imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png"
    }
};

// Circuit track map images (Wikipedia Commons - free to use)
export const CIRCUITS: Record<string, Circuit> = {
    monaco: {
        name: "Circuit de Monaco",
        location: "Monte Carlo",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Monte_Carlo_Formula_1_track_map.svg/800px-Monte_Carlo_Formula_1_track_map.svg.png"
    },
    spa: {
        name: "Circuit de Spa-Francorchamps",
        location: "Belgium",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Spa-Francorchamps_of_Belgium.svg/800px-Spa-Francorchamps_of_Belgium.svg.png"
    },
    silverstone: {
        name: "Silverstone Circuit",
        location: "United Kingdom",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Silverstone_Circuit_2020.svg/800px-Silverstone_Circuit_2020.svg.png"
    },
    suzuka: {
        name: "Suzuka International Racing Course",
        location: "Japan",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Suzuka_circuit_map--2005.svg/800px-Suzuka_circuit_map--2005.svg.png"
    },
    monza: {
        name: "Autodromo Nazionale di Monza",
        location: "Italy",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Monza_track_map.svg/800px-Monza_track_map.svg.png"
    }
};

// Team colors and info
export const TEAMS: Record<string, Team> = {
    red_bull: { name: "Red Bull Racing", color: "#3671C6" },
    ferrari: { name: "Scuderia Ferrari", color: "#E8002D" },
    mercedes: { name: "Mercedes-AMG Petronas", color: "#27F4D2" },
    mclaren: { name: "McLaren F1 Team", color: "#FF8000" },
    aston_martin: { name: "Aston Martin Aramco", color: "#229971" },
    alpine: { name: "BWT Alpine F1 Team", color: "#FF87BC" },
    williams: { name: "Williams Racing", color: "#64C4FF" },
    haas: { name: "MoneyGram Haas F1 Team", color: "#B6BABD" },
    audi: { name: "Audi Formula 1 Team", color: "#FF0000" },
    rb: { name: "Visa Cash App RB", color: "#6692FF" }
};

// Helper to get drivers sorted by number
export const getDriversSortedByNumber = () =>
    Object.values(DRIVERS).sort((a, b) => a.number - b.number);

// Helper to get top drivers for display
export const getTopDrivers = (count = 4) =>
    Object.values(DRIVERS).slice(0, count);
