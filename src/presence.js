/**
 * SC2 presence grouping — mirrors the website's $lib/presence.ts (they
 * unify when the site adopts uar-shared). Groups heartbeat entries into
 * lobbies/games: by lobbyId when known, else by the in-game roster
 * name-set, else each entry stands alone.
 *
 * Lobbies are the exception: they all collapse into one group, because
 * nothing observable distinguishes two open lobbies (see `groupPresence`).
 */

/**
 * @param {Array<{battletag: string, status: 'lobby'|'ingame', uar: boolean,
 *   players?: number, displayTime?: number, roster?: string[],
 *   lobbyId?: number | null}>} entries
 */
export function groupPresence(entries) {
	const groups = new Map();
	for (const e of entries) {
		// One lobby at a time. Nothing local tells two lobbies apart while
		// they are open: SC2 writes replay.server.battlelobby — the only
		// carrier of a lobby id — at game start, not when the lobby forms
		// (measured; see the companion's docs/sc2-detection.md). Matching on
		// the roster instead made one lobby appear as several, because each
		// member sees a slightly different set as people join and leave.
		const key =
			e.status === 'lobby'
				? 'lobby'
				: e.lobbyId != null
					? `id:${e.lobbyId}`
					: e.roster && e.roster.length > 0
						? `roster:${e.status}:${[...e.roster].sort().join('\n')}`
						: `solo:${e.battletag}`;
		add(groups, key, e);
	}
	return [...groups.values()].sort((a, b) => b.players - a.players);
}

/** @param {Map<string, any>} groups @param {string} key @param {any} e */
function add(groups, key, e) {
	let g = groups.get(key);
	if (!g) {
		g = { key, status: e.status, uar: e.uar, members: [], players: 0 };
		groups.set(key, g);
	}
	g.members.push(e);
	g.uar = g.uar || e.uar;
	if (e.status === 'ingame') g.status = 'ingame';
	g.players = Math.max(g.players, e.players ?? 0, e.roster?.length ?? 0, g.members.length);
	if (e.displayTime !== undefined) {
		g.displayTime = Math.max(g.displayTime ?? 0, e.displayTime);
	}
}

/**
 * Groups entries and splits them into lobbies and games — the exact shape
 * the top-bar chips consume. Deliberately no UAR filter: a signed-in
 * player's lobby on a UAR site is worth showing even before the map is
 * confirmed, since the battlelobby file that confirms it is not always
 * readable while the lobby is open.
 * @param {Parameters<typeof groupPresence>[0]} entries
 */
export function splitPresence(entries) {
	const groups = groupPresence(entries);
	return {
		lobbies: groups.filter((g) => g.status === 'lobby'),
		games: groups.filter((g) => g.status === 'ingame')
	};
}
