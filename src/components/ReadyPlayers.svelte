<script>
	/**
	 * Rows of currently-flagged players (portrait · battletag · minutes
	 * left) — the content of the website's hover dropdown, reusable inline.
	 * `href(player)` returns a profile link or null for plain text.
	 */
	import anonPortrait from '../assets/anon-portrait.svg';
	import { minutesLeft } from '../ready.js';

	/** `statusOf(battletag)`: 'lobby' | 'ingame' | undefined — renders the
	 * presence badge next to the name in the presence colors. */
	let { players = [], now = Date.now(), href = () => null, statusOf } = $props();
</script>

{#each players as p (p.battletag)}
	<div class="row">
		<img class="portrait" src={p.avatar ?? anonPortrait} alt="" />
		{#if href(p)}
			<a class="tag-link" href={href(p)}>{p.battletag}</a>
		{:else}
			<span class="tag-link">{p.battletag}</span>
		{/if}
		{#if statusOf?.(p.battletag) === 'lobby'}
			<span class="mini-tag">in lobby</span>
		{:else if statusOf?.(p.battletag) === 'ingame'}
			<span class="mini-tag game">in game</span>
		{/if}
		<span class="left">{minutesLeft(p.until, now)} min</span>
	</div>
{/each}

<style>
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
	.left {
		font: 500 11px/1 var(--mono);
		font-variant-numeric: tabular-nums;
		color: var(--ink-3);
	}
	.mini-tag {
		font: 550 9.5px/1 var(--mono);
		letter-spacing: 0.04em;
		padding: 2.5px 7px;
		border-radius: 99px;
		color: var(--on-accent);
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
