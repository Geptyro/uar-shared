/**
 * Minimum shape the grouping needs. Deliberately no index signature —
 * that would force every consumer type to declare one; structural typing
 * already lets richer entries (with avatars, toons…) satisfy this.
 */
export interface PresenceGroupEntry {
	battletag: string;
	status: 'lobby' | 'ingame';
	uar: boolean;
	players?: number;
	displayTime?: number;
	roster?: string[];
	lobbyId?: number | null;
	selfName?: string;
}

export interface PresenceGroup<T extends PresenceGroupEntry = PresenceGroupEntry> {
	key: string;
	status: 'lobby' | 'ingame';
	uar: boolean;
	members: T[];
	players: number;
	displayTime?: number;
}

export declare function groupPresence<T extends PresenceGroupEntry>(
	entries: T[]
): PresenceGroup<T>[];

export declare function splitPresence<T extends PresenceGroupEntry>(
	entries: T[]
): { lobbies: PresenceGroup<T>[]; games: PresenceGroup<T>[] };
