/**
 * F1 Intelligence Platform - Mock Data Factory
 * Functions to generate realistic random lap and telemetry data
 */

import type { Lap, LapDetailed, TyreCompound, TelemetryPoint, CarTelemetry, WeatherData } from '../types/f1';
import { DRIVERS_2025 } from './drivers';

// ============================================================================
// RANDOM UTILITIES
// ============================================================================

/** Generate random number in range */
function randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/** Generate random integer in range (inclusive) */
function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Add gaussian noise to a value */
function gaussianNoise(mean: number, stdDev: number): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/** Pick random item from array */
function randomChoice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================================================
// LAP DATA GENERATION
// ============================================================================

interface LapGeneratorOptions {
    /** Base lap time in milliseconds */
    baseLapTime: number;
    /** Variation in milliseconds */
    variation?: number;
    /** Tyre compound */
    compound?: TyreCompound;
    /** Tyre age in laps */
    tyreLife?: number;
    /** Whether to include detailed data */
    detailed?: boolean;
}

/**
 * Generate a single lap with realistic sector times
 */
export function generateLap(
    lapNumber: number,
    driverCode: string,
    position: number,
    gap: number,
    options: LapGeneratorOptions
): Lap {
    const {
        baseLapTime,
        variation = 500,
        compound = 'MEDIUM',
        tyreLife = 1,
    } = options;

    // Add random variation to base time
    const lapVariation = gaussianNoise(0, variation);

    // Tyre degradation effect (0.05s per lap on avg)
    const tyreDeg = tyreLife * 50;

    // Calculate total lap time
    const lapTime = Math.round(baseLapTime + lapVariation + tyreDeg);

    // Split into sectors (roughly 33% each with variation)
    const s1Ratio = randomInRange(0.30, 0.36);
    const s2Ratio = randomInRange(0.30, 0.36);
    // s3Ratio is implicit (remainder after s1 + s2)

    const sector1 = Math.round(lapTime * s1Ratio);
    const sector2 = Math.round(lapTime * s2Ratio);
    const sector3 = lapTime - sector1 - sector2;

    return {
        lapNumber,
        driver: driverCode,
        lapTime,
        sector1,
        sector2,
        sector3,
        compound,
        tyreLife,
        position,
        gap,
        isPersonalBest: Math.random() < 0.1,
        freshTyre: tyreLife <= 3,
    };
}

/**
 * Generate detailed lap with speed trap data
 */
export function generateDetailedLap(
    lapNumber: number,
    driverCode: string,
    position: number,
    gap: number,
    options: LapGeneratorOptions
): LapDetailed {
    const baseLap = generateLap(lapNumber, driverCode, position, gap, options);

    return {
        ...baseLap,
        speedI1: randomInt(280, 320),
        speedI2: randomInt(270, 310),
        speedFL: randomInt(290, 340),
        speedST: randomInt(300, 350),
        deleted: false,
        isAccurate: true,
    };
}

/**
 * Generate a full race stint of laps
 */
export function generateStint(
    driverCode: string,
    startLap: number,
    endLap: number,
    startPosition: number,
    baseLapTime: number,
    compound: TyreCompound
): Lap[] {
    const laps: Lap[] = [];
    let currentPosition = startPosition;
    let cumulativeGap = 0;

    for (let lap = startLap; lap <= endLap; lap++) {
        const tyreLife = lap - startLap + 1;

        // Slight position changes
        if (Math.random() < 0.05 && currentPosition > 1) {
            currentPosition--;
        } else if (Math.random() < 0.03 && currentPosition < 20) {
            currentPosition++;
        }

        // Gap increases over time
        cumulativeGap += randomInRange(-0.2, 0.5);
        if (cumulativeGap < 0) cumulativeGap = 0;

        laps.push(generateLap(lap, driverCode, currentPosition, cumulativeGap, {
            baseLapTime,
            compound,
            tyreLife,
        }));
    }

    return laps;
}

/**
 * Generate race data for all drivers
 */
export function generateRaceData(
    totalLaps: number,
    baseLapTime: number
): Map<string, Lap[]> {
    const raceData = new Map<string, Lap[]>();

    DRIVERS_2025.forEach((driver, index) => {
        const driverLaps: Lap[] = [];
        let currentLap = 1;
        const position = index + 1;

        // First stint (usually MEDIUM or HARD)
        const firstCompound: TyreCompound = Math.random() > 0.5 ? 'MEDIUM' : 'HARD';
        const firstStintLength = randomInt(15, 25);

        driverLaps.push(...generateStint(
            driver.code,
            currentLap,
            Math.min(currentLap + firstStintLength - 1, totalLaps),
            position,
            baseLapTime + index * 100, // Slower for lower positions
            firstCompound
        ));
        currentLap += firstStintLength;

        // Second stint
        if (currentLap <= totalLaps) {
            const secondCompound: TyreCompound = firstCompound === 'MEDIUM' ? 'HARD' : 'MEDIUM';
            const secondStintLength = randomInt(20, 30);

            driverLaps.push(...generateStint(
                driver.code,
                currentLap,
                Math.min(currentLap + secondStintLength - 1, totalLaps),
                position,
                baseLapTime + index * 100,
                secondCompound
            ));
            currentLap += secondStintLength;
        }

        // Third stint (if needed)
        if (currentLap <= totalLaps) {
            driverLaps.push(...generateStint(
                driver.code,
                currentLap,
                totalLaps,
                position,
                baseLapTime + index * 100,
                'SOFT'
            ));
        }

        raceData.set(driver.code, driverLaps);
    });

    return raceData;
}

// ============================================================================
// TELEMETRY GENERATION
// ============================================================================

/**
 * Generate telemetry points for a lap
 */
export function generateTelemetry(
    driverCode: string,
    lapNumber: number,
    trackLength: number = 5500
): CarTelemetry {
    const points: TelemetryPoint[] = [];
    const numPoints = Math.floor(trackLength / 10); // Point every 10m

    for (let i = 0; i < numPoints; i++) {
        const distance = i * 10;
        const progress = distance / trackLength;

        // Simulate varying speed around track
        const baseSpeed = 200 + 100 * Math.sin(progress * Math.PI * 8);
        const speed = Math.max(80, Math.min(350, gaussianNoise(baseSpeed, 10)));

        // Throttle/Brake inversely related
        const isCorner = speed < 180;
        const throttle = isCorner ? randomInt(0, 50) : randomInt(80, 100);
        const brake = isCorner ? randomInt(20, 100) : 0;

        // Gear based on speed
        const gear = Math.min(8, Math.max(1, Math.floor(speed / 45) + 1));

        // RPM based on gear and speed
        const rpm = Math.min(15000, 8000 + (speed / gear) * 50);

        // DRS only in designated zones (simulate 2 zones)
        const drs = (progress > 0.2 && progress < 0.3) || (progress > 0.7 && progress < 0.8);

        points.push({
            distance,
            speed: Math.round(speed),
            throttle,
            brake,
            gear,
            rpm: Math.round(rpm),
            drs,
            ers: randomInt(0, 100),
        });
    }

    return {
        driver: driverCode,
        lap: lapNumber,
        points,
    };
}

// ============================================================================
// WEATHER GENERATION
// ============================================================================

/**
 * Generate weather data for a session
 */
export function generateWeatherData(
    durationMinutes: number,
    condition: 'dry' | 'mixed' | 'wet' = 'dry'
): WeatherData[] {
    const data: WeatherData[] = [];
    const interval = 5; // Every 5 minutes

    let baseAirTemp = condition === 'wet' ? 18 : 25;
    let baseTrackTemp = condition === 'wet' ? 22 : 45;
    let humidity = condition === 'wet' ? 85 : 40;

    for (let minute = 0; minute <= durationMinutes; minute += interval) {
        const time = new Date(Date.now() + minute * 60000).toISOString();

        // Gradual changes
        baseAirTemp += gaussianNoise(0, 0.5);
        baseTrackTemp += gaussianNoise(0, 1);
        humidity += gaussianNoise(0, 2);
        humidity = Math.max(30, Math.min(100, humidity));

        const rainfall = condition === 'wet' || (condition === 'mixed' && Math.random() < 0.3);

        data.push({
            time,
            airTemp: Math.round(baseAirTemp * 10) / 10,
            trackTemp: Math.round(baseTrackTemp * 10) / 10,
            humidity: Math.round(humidity),
            windSpeed: randomInt(5, 25),
            windDirection: randomInt(0, 360),
            rainfall,
            pressure: randomInt(1010, 1025),
        });
    }

    return data;
}

// ============================================================================
// QUALIFYING SIMULATION
// ============================================================================

interface QualifyingResult {
    position: number;
    driver: string;
    q1Time: number | null;
    q2Time: number | null;
    q3Time: number | null;
    bestTime: number;
}

/**
 * Generate qualifying session results
 */
export function generateQualifyingResults(baseLapTime: number): QualifyingResult[] {
    const results: QualifyingResult[] = [];

    // Performance order (randomized but weighted by team strength)
    const orderedDrivers = [...DRIVERS_2025].sort(() => Math.random() - 0.5);

    orderedDrivers.forEach((driver, index) => {
        // Add performance variance based on "form"
        const performanceBase = index * 80 + randomInt(-200, 200);

        // Q1 - all drivers
        const q1Time = baseLapTime + performanceBase + randomInt(0, 300);

        // Q2 - top 15
        const q2Time = index < 15
            ? baseLapTime + performanceBase + randomInt(-100, 200)
            : null;

        // Q3 - top 10
        const q3Time = index < 10
            ? baseLapTime + performanceBase + randomInt(-200, 100)
            : null;

        const bestTime = q3Time ?? q2Time ?? q1Time;

        results.push({
            position: 0, // Will be set after sorting
            driver: driver.code,
            q1Time,
            q2Time,
            q3Time,
            bestTime,
        });
    });

    // Sort by best time and assign positions
    results.sort((a, b) => a.bestTime - b.bestTime);
    results.forEach((r, i) => r.position = i + 1);

    return results;
}

// ============================================================================
// EXPORTS
// ============================================================================

export const mockFactory = {
    generateLap,
    generateDetailedLap,
    generateStint,
    generateRaceData,
    generateTelemetry,
    generateWeatherData,
    generateQualifyingResults,
    randomInRange,
    randomInt,
    randomChoice,
};

export default mockFactory;
