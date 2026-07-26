<script>
	/**
	 * Lobby/game groups for a hover pop: heading per group, member rows
	 * with portraits, "+N more" for players not running the companion app.
	 * `href(member)` returns a profile link or null for plain text.
	 */
	import anonPortrait from '../assets/anon-portrait.svg';

	let { groups = [], gameClock = false, href = () => null } = $props();
</script>

{#each groups as g (g.key)}
	<div class="grp">
		<div class="grp-head">
			{g.uar ? 'UAR ' : ''}{g.status === 'ingame' ? 'game' : 'lobby'} · {g.players}
			player{g.players === 1 ? '' : 's'}{#if gameClock && g.displayTime}&nbsp;· {Math.floor(
					g.displayTime / 60
				)} min{/if}
		</div>
		{#each g.members as m (m.battletag)}
			<div class="row">
				<img class="portrait" src={m.avatar ?? anonPortrait} alt="" />
				{#if href(m)}
					<a class="tag-link" href={href(m)}>{m.battletag}</a>
				{:else}
					<span class="tag-link">{m.battletag}</span>
				{/if}
			</div>
		{/each}
		{#if g.players > g.members.length}
			<div class="grp-more">+{g.players - g.members.length} more (not on UAR Tray)</div>
		{/if}
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
	.grp-more {
		font-size: 11.5px;
		color: var(--ink-3);
		padding: 2px 8px 4px;
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
	a.tag-link:hover {
		color: var(--accent);
	}
</style>
