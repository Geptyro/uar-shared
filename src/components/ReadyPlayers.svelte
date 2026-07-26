<script>
	/**
	 * Rows of currently-flagged players (portrait · battletag · minutes
	 * left) — the content of the website's hover dropdown, reusable inline.
	 * `href(player)` returns a profile link or null for plain text.
	 */
	import anonPortrait from '../assets/anon-portrait.svg';
	import { minutesLeft } from '../ready.js';

	let { players = [], now = Date.now(), href = () => null } = $props();
</script>

{#each players as p (p.battletag)}
	<div class="row">
		<img class="portrait" src={p.avatar ?? anonPortrait} alt="" />
		{#if href(p)}
			<a class="tag-link" href={href(p)}>{p.battletag}</a>
		{:else}
			<span class="tag-link">{p.battletag}</span>
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
</style>
