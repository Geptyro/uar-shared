export interface PresenceGroupEntry {
	battletag: string;
	status: 'lobby' | 'ingame';
	uar: boolean;
	players?: number;
	displayTime?: number;
	roster?: string[];
	lobbyId?: number | null;
	[key: string]: unknown;
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
