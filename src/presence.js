/**
 * SC2 presence grouping — mirrors the website's $lib/presence.ts (they
 * unify when the site adopts uar-shared). Groups heartbeat entries into
 * lobbies/games: by lobbyId when known, else by the in-game roster
 * name-set, else each entry stands alone. Game groups that turn out to be
 * the same game are then folded together (see `mergeSameGame`).
 *
 * Lobbies are the exception: they all collapse into one group, because
 * nothing observable distinguishes two open lobbies (see `groupPresence`).
 */

/**
 * @param {Array<{battletag: string, status: 'lobby'|'ingame', uar: boolean,
 *   players?: number, displayTime?: number, roster?: string[],
 *   lobbyId?: number | null, selfName?: string}>} entries
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
	return mergeSameGame([...groups.values()]).sort((a, b) => b.players - a.players);
}

/** @param {Map<string, any>} groups @param {string} key @param {any} e */
function add(groups, key, e) {
	let g = groups.get(key);
	if (!g) {
		g = { key, status: e.status, uar: e.uar, members: [], players: 0 };
		groups.set(key, g);
	}
	push(g, e);
}

/** Folds one entry into a group, keeping the aggregates right. @param {any} g @param {any} e */
function push(g, e) {
	g.members.push(e);
	g.uar = g.uar || e.uar;
	if (e.status === 'ingame') g.status = 'ingame';
	g.players = Math.max(g.players, e.players ?? 0, e.roster?.length ?? 0, g.members.length);
	if (e.displayTime !== undefined) {
		g.displayTime = Math.max(g.displayTime ?? 0, e.displayTime);
	}
}

/**
 * Folds game groups that are demonstrably the same game back together.
 *
 * The keys above split one running game in two whenever its members do not
 * all report a lobbyId — and they don't: the id comes from SC2's
 * battlelobby temp file, which some installs never find (unknown Wine
 * prefix, the unverified macOS path, companion started after the file was
 * gone). The id-holders keyed on `id:`, everyone else on `roster:`, and the
 * two never met, so the chip counted one game twice.
 *
 * The rosters settle it: every member of a game reports the same in-game
 * roster, and nobody is in two games at once, so a shared name means one
 * game. Matching on any shared name rather than the whole set is deliberate
 * — rosters drift by a leaver or a hiccuped `/game` poll, and demanding
 * equality is exactly what once made one lobby show up as several.
 *
 * Two DIFFERENT lobby ids are hard evidence of two games and never merge,
 * whatever the rosters say. The residual risk is two concurrent games
 * sharing a display name (SC2 names are not unique) and neither carrying an
 * id — they would show as one; rare, and it under-counts rather than
 * inventing a game.
 *
 * @param {any[]} groups
 */
function mergeSameGame(groups) {
	/** @type {any[]} */
	const out = [];
	for (const g of groups) {
		const host = g.status === 'ingame' ? out.find((h) => sameGame(h, g)) : undefined;
		if (!host) {
			out.push(g);
			continue;
		}
		// the id is the better identity — let it name the merged group
		if (lobbyIdOf(host) == null && lobbyIdOf(g) != null) host.key = g.key;
		for (const m of g.members) push(host, m);
	}
	return out;
}

/** @param {any} a @param {any} b */
function sameGame(a, b) {
	if (a.status !== 'ingame' || b.status !== 'ingame') return false;
	if (lobbyIdOf(a) != null && lobbyIdOf(b) != null) return false;
	const names = namesOf(a);
	return [...namesOf(b)].some((n) => names.has(n));
}

/** The group's lobby id, or null when no member reported one. @param {any} g */
function lobbyIdOf(g) {
	for (const m of g.members) if (m.lobbyId != null) return m.lobbyId;
	return null;
}

/** Every in-game name the group can be recognised by. @param {any} g */
function namesOf(g) {
	/** @type {Set<string>} */
	const names = new Set();
	for (const m of g.members) {
		for (const n of m.roster ?? []) names.add(n);
		if (m.selfName) names.add(m.selfName);
	}
	return names;
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
