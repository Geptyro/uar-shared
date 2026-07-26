export declare const READY_DURATION_MS: number;
export declare function activeReady<T extends { until: string }>(players: T[], now: number): T[];
export declare function minutesLeft(until: string, now: number): number;
export declare function readyLevel(minutes: number): 'high' | 'mid' | 'low';
