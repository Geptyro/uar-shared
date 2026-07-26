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

	let { groups = [], gameClock = false, href = () => null } = $props();

	/** roster entries, each resolved to its reporting member when there is one */
	function rows(g) {
		const byName = new Map(
			g.members.filter((m) => m.selfName).map((m) => [m.selfName, m])
		);
		const roster = g.members.find((m) => m.roster?.length)?.roster ?? [];
		if (roster.length === 0) {
			// no roster reported (e.g. a lobby we could not read) — show what we have
			return g.members.map((m) => ({ name: m.battletag, member: m }));
		}
		const rows = roster.map((name) => ({ name, member: byName.get(name) ?? null }));
		// reporters whose own entry we could not match still deserve a row
		for (const m of g.members) {
			if (!m.selfName || !roster.includes(m.selfName)) {
				if (!rows.some((r) => r.member === m)) rows.push({ name: m.battletag, member: m });
			}
		}
		return rows;
	}
</script>

{#each groups as g (g.key)}
	<div class="grp">
		<div class="grp-head">
			{g.uar ? 'UAR ' : ''}{g.status === 'ingame' ? 'game' : 'lobby'} · {g.players}
			player{g.players === 1 ? '' : 's'}{#if gameClock && g.displayTime}&nbsp;· {Math.floor(
					g.displayTime / 60
				)} min{/if}
		</div>
		{#each rows(g) as row (row.name)}
			<div class="row" class:known={row.member}>
				<img class="portrait" src={row.member?.avatar ?? anonPortrait} alt="" />
				{#if row.member && href(row.member)}
					<a class="tag-link" href={href(row.member)}>{row.member.battletag}</a>
				{:else if row.member}
					<span class="tag-link">{row.member.battletag}</span>
				{:else}
					<span class="tag-link plain">{row.name}</span>
				{/if}
			</div>
		{/each}
	</div>
{/each}

<style>
	.grp + .grp {
		border-top: 1px solid var(--border);
		margin-top: 4px;
		padding-top: 4px;
	}
	.grp-head {
		font-family: var(--mono);
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-3);
		padding: 4px 8px 2px;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 4px 8px;
		border-radius: var(--r-sm);
	}
	.row:hover {
		background: var(--surface-2);
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
		color: var(--ink);
		text-decoration: none;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	/* players who aren't signed in on the site: name only, quieter */
	.tag-link.plain {
		font-weight: 450;
		color: var(--ink-2);
	}
	a.tag-link:hover {
		color: var(--accent);
	}
</style>
