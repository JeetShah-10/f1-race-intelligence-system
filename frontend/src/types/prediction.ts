import type { TireCompound } from './simulation';

export type PredictionState = 'CALENDAR' | 'LOADING' | 'RESULTS';

export type WeatherCondition = 'SUNNY' | 'CLOUDY' | 'LIGHT_RAIN' | 'HEAVY_RAIN';

export type InsightType =
    | 'safety_car'
    | 'undercut'
    | 'battle'
    | 'drs'
    | 'weather'
    | 'confidence';

export interface TyreStint {
    compound: TireCompound;
    laps: number;
}

export interface PredictionDriver {
    position: number;
    driverCode: string;
    driverName: string;
    driverNumber: number;
    teamId: string;
    teamName: string;
    teamColor: string;
    driverPhoto: string;
    driverCutout: string;
    gap: string;
    pitStops: number;
    fastestLap: boolean;
    tyreStrategy: TyreStint[];
    status: 'FINISHED' | 'DNF' | 'DSQ';
}

export interface PredictionInsight {
    type: InsightType;
    label: string;
    value: string;
    numericValue: number;
    icon: string;
    color: string;
    secondaryDriver?: string;
    secondaryTeamColor?: string;
    primaryDriver?: string;
    primaryTeamColor?: string;
}

export interface PredictionResult {
    circuitId: string;
    classification: PredictionDriver[];
    insights: PredictionInsight[];
    weather: WeatherCondition;
    temperature: number;
    confidence: number;
    timestamp: number;
}
