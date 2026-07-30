<script>
	/**
	 * Rows of currently-flagged players (portrait · SC2 profile name) — the
	 * content of the website's hover dropdown, reusable inline. `href(player)`
	 * returns a profile link or null for plain text.
	 *
	 * The name is the one the lobby shows, same as the presence rows; the
	 * account battletag rides along as the tooltip. Accounts whose profile
	 * name the site could not resolve fall back to the battletag.
	 *
	 * No per-player countdown: someone else's flag lapsing in twelve minutes
	 * says nothing a reader can act on, and it invites being misread as "leaving
	 * in twelve minutes". Your own remaining hour still shows on your chip,
	 * where it pairs with the restart button.
	 */
	import anonPortrait from '../assets/anon-portrait.svg';

	/** `statusOf(battletag)`: 'lobby' | 'ingame' | undefined — renders the
	 * presence badge next to the name in the presence colors. */
	let { players = [], href = () => null, statusOf } = $props();
</script>

{#each players as p (p.battletag)}
	<div class="row">
		<img class="portrait" src={p.avatar ?? anonPortrait} alt="" />
		{#if href(p)}
			<a class="tag-link" href={href(p)} title={p.battletag}>{p.name ?? p.battletag}</a>
		{:else}
			<span class="tag-link" title={p.battletag}>{p.name ?? p.battletag}</span>
		{/if}
		{#if statusOf?.(p.battletag) === 'lobby'}
			<span class="mini-tag">in lobby</span>
		{:else if statusOf?.(p.battletag) === 'ingame'}
			<span class="mini-tag game">in game</span>
		{/if}
	</div>
{/each}

<style>
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
	a.tag-link:hover {
		color: var(--accent);
	}
	.mini-tag {
		font: 550 9.5px/1 var(--font-mono);
		letter-spacing: 0.04em;
		padding: 2.5px 7px;
		border-radius: 99px;
		color: var(--accent-contrast);
		background: var(--lobby, #2e7f74);
		white-space: nowrap;
	}
	.mini-tag.game {
		background: var(--game, #67589f);
	}
	@media (prefers-color-scheme: dark) {
		.mini-tag {
			background: var(--lobby, #7bc8ba);
		}
		.mini-tag.game {
			background: var(--game, #a99ad8);
		}
	}
</style>
