/**
 * F1 Intelligence Platform - Mock Data Index
 * Central export for all mock data and factories
 */

// Types
export * from '../types/f1';

// Driver data
export {
    DRIVERS_2025,
    getDriverByCode,
    getDriversByTeam,
    TEAMS_2025,
    TEAM_COLORS,
} from './drivers';

// Circuit data
export {
    CIRCUITS_2025,
    getCircuitById,
    getCircuitsByCountry,
    getCountries,
    toSimpleCircuit,
} from './circuits';

// Standings data
export {
    DRIVER_STANDINGS_2025,
    CONSTRUCTOR_STANDINGS_2025,
    getDriverStanding,
    getConstructorStanding,
    getTopDrivers,
    getTopConstructors,
    getPointsGapToLeader,
} from './standings';

// Factory functions
export {
    mockFactory,
    generateLap,
    generateDetailedLap,
    generateStint,
    generateRaceData,
    generateTelemetry,
    generateWeatherData,
    generateQualifyingResults,
} from './factory';
