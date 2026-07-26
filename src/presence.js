/**
 * SC2 presence grouping — mirrors the website's $lib/presence.ts (they
 * unify when the site adopts uar-shared). Groups heartbeat entries into
 * lobbies/games: by lobbyId when known, else by the in-game roster
 * name-set, else each entry stands alone.
 *
 * Lobbies get one extra rule (see `groupPresence`): a reporter whose
 * battlelobby file did not parse must not appear as a second lobby.
 */

/**
 * @param {Array<{battletag: string, status: 'lobby'|'ingame', uar: boolean,
 *   players?: number, displayTime?: number, roster?: string[],
 *   lobbyId?: number | null}>} entries
 */
export function groupPresence(entries) {
	const groups = new Map();
	/** lobby entries whose battlelobby file gave us no id to group by */
	const idlessLobby = [];

	for (const e of entries) {
		// A lobby roster changes as people join and leave, so two reporters in
		// the same lobby rarely hold the identical set — matching on it splits
		// one lobby into several. Games are safe: the roster is fixed once the
		// game starts, and concurrent games are real.
		if (e.status === 'lobby' && e.lobbyId == null) {
			idlessLobby.push(e);
			continue;
		}
		const key =
			e.lobbyId != null
				? `id:${e.lobbyId}`
				: e.roster && e.roster.length > 0
					? `roster:${e.status}:${[...e.roster].sort().join('\n')}`
					: `solo:${e.battletag}`;
		add(groups, key, e);
	}

	if (idlessLobby.length > 0) {
		// One lobby forms at a time in practice, so an id-less reporter belongs
		// to the lobby we can see. Only when several identified lobbies are
		// live is that guess unsafe — then they stand as their own group.
		const known = [...groups.values()].filter((g) => g.status === 'lobby');
		const target = known.length === 1 ? known[0].key : 'lobby:unidentified';
		for (const e of idlessLobby) add(groups, target, e);
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
