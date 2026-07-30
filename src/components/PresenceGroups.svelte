<script>
	/**
	 * Lobby/game groups for a hover pop. Lists EVERY player in the game —
	 * the roster comes from the SC2 client, so it covers people who don't
	 * run the companion app; those who do are shown with their portrait and
	 * a link to their profile (matched through the `selfName` each reporter
	 * sends: which roster entry is them).
	 * `href(member)` returns a profile link or null for plain text.
	 */
	import anonPortrait from '../assets/anon-portrait.svg';
	import { bareName } from '../presence.js';

	/**
	 * `known`: in-game name → { toon, avatar } for players the site knows
	 * but who aren't reporting themselves (they never installed the app).
	 */
	let { groups = [], gameClock = false, href = () => null, known = {}, toonHref } = $props();

	/** A reporter with no roster line of their own: profile name, else the tag. */
	const nameOf = (m) => m.name ?? m.battletag;

	/**
	 * Roster entries, each resolved to its reporting member when there is
	 * one. Two ways to tie a reporter to their roster line: the selfName
	 * they send, or — for older app versions, or when the lobby file could
	 * not be read — the toon the site resolved for that in-game name.
	 *
	 * Both sides go through `bareName`: a lobby roster read straight from
	 * the battlelobby file carries the character code ("Name#451") that
	 * selfName and the site's directory never do, and matching the two raw
	 * placed nobody — every reporter fell through to the battletag row.
	 */
	function rows(g) {
		const bySelf = new Map(
			g.members.filter((m) => m.selfName).map((m) => [bareName(m.selfName), m])
		);
		const roster = g.members.find((m) => m.roster?.length)?.roster ?? [];
		if (roster.length === 0) {
			// no roster reported (e.g. a lobby we could not read) — show what we have
			return g.members.map((m, i) => ({ key: `m${i}`, name: nameOf(m), member: m }));
		}
		const claimed = new Set();
		const out = roster.map((entry, i) => {
			const name = bareName(entry);
			let member = bySelf.get(name) ?? null;
			if (!member) {
				const toon = known[name]?.toon;
				if (toon) member = g.members.find((m) => m.toon && m.toon === toon) ?? null;
			}
			if (member) claimed.add(member);
			return { key: `r${i}`, name, member };
		});
		// a reporter we could not place is still in this game — list them
		for (const [i, m] of g.members.entries()) {
			if (!claimed.has(m)) out.push({ key: `m${i}`, name: nameOf(m), member: m });
		}
		return out;
	}
</script>

<div class="groups" class:multi={groups.length > 1}>
		{#each groups as g (g.key)}
			<div class="grp">
			<div class="grp-head">
				{g.uar ? 'UAR ' : ''}{g.status === 'ingame' ? 'game' : 'lobby'} · {g.players}
				player{g.players === 1 ? '' : 's'}{#if gameClock && g.displayTime}&nbsp;· {Math.floor(
						g.displayTime / 60
					)} min{/if}
			</div>
			<!-- keyed by position, not name: SC2 profile names are not unique,
			     and dropping the character code makes a clash likelier still -->
			{#each rows(g) as row (row.key)}
				{@const site = row.member ? null : known[row.name]}
				{@const link = row.member ? href(row.member) : site && toonHref?.(site.toon)}
				<div class="row">
					<img
						class="portrait"
						src={row.member?.avatar ?? site?.avatar ?? anonPortrait}
						alt=""
					/>
					<!-- always the in-game name: that is who you see in the lobby.
					     The account battletag rides along as the tooltip. -->
					{#if link}
						<a class="tag-link" href={link} title={row.member?.battletag}>{row.name}</a>
					{:else}
						<span class="tag-link" class:plain={!row.member} title={row.member?.battletag}>
							{row.name}
						</span>
					{/if}
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.groups {
		display: flex;
		flex-direction: column;
	}
	/* several lobbies/games: columns, so a 12-player game stays readable */
	.groups.multi {
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0;
		max-width: 80vw;
	}
	.groups.multi .grp {
		min-width: 200px;
		max-width: 240px;
	}
	.groups:not(.multi) .grp + .grp {
		border-top: 1px solid var(--border);
		margin-top: 4px;
		padding-top: 4px;
	}
	.groups.multi .grp + .grp {
		border-left: 1px solid var(--border);
		padding-left: 6px;
		margin-left: 6px;
	}
	.grp-head {
		font-family: var(--font-mono);
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-faint);
		padding: 4px 8px 2px;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 4px 8px;
		border-radius: var(--radius-2);
	}
	.row:hover {
		background: var(--surface-raised);
	}
	.portrait {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		object-fit: cover;
		border: 1px solid var(--border);
		flex-shrink: 0;
	}
	.tag-link {
		flex: 1;
		font-size: 12.5px;
		font-weight: 550;
		color: var(--text);
		text-decoration: none;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	/* players who aren't signed in on the site: name only, quieter */
	.tag-link.plain {
		font-weight: 450;
		color: var(--text-dim);
	}
	a.tag-link:hover {
		color: var(--accent);
	}
</style>
