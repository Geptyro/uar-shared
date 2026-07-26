/**
 * "Ready to play" pure helpers — shared by the website's top-bar widget and
 * companion apps. Dependency-free.
 */

/** How long a flag lasts before it silently expires. */
export const READY_DURATION_MS = 60 * 60 * 1000;

/**
 * Players whose flag has not expired yet.
 * @template {{ until: string }} T
 * @param {T[]} players
 * @param {number} now
 * @returns {T[]}
 */
export function activeReady(players, now) {
	return players.filter((p) => Date.parse(p.until) > now);
}

/**
 * Whole minutes left on a flag, for display; at least 1 while active.
 * @param {string} until
 * @param {number} now
 */
export function minutesLeft(until, now) {
	return Math.max(1, Math.ceil((Date.parse(until) - now) / 60_000));
}

/**
 * Urgency bucket for the flag button's color: green / gold / red.
 * @param {number} minutes
 * @returns {'high' | 'mid' | 'low'}
 */
export function readyLevel(minutes) {
	if (minutes <= 10) return 'low';
	if (minutes <= 30) return 'mid';
	return 'high';
}
