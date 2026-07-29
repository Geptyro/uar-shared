<script>
	/**
	 * The complete top-bar presence cluster: lobby + game chips with their
	 * hover rosters. One composition for the website and the tray.
	 */
	import { HoverPop } from 'sveltekit-commons';
	import PresenceChip from './PresenceChip.svelte';
	import PresenceGroups from './PresenceGroups.svelte';

	let {
		lobbies = [],
		games = [],
		href = () => null,
		known = {},
		toonHref,
		onchipclick,
		/** icon + count only — for narrow top bars, see PresenceChip */
		compact = false
	} = $props();
</script>

<div class="presence-chips" class:compact>
	<HoverPop disabled={lobbies.length === 0} heading={`Open lobbies · ${lobbies.length}`}>
		{#snippet trigger()}
			<PresenceChip kind="lobby" count={lobbies.length} onclick={onchipclick} {compact} />
		{/snippet}
		{#if lobbies.length > 0}<PresenceGroups groups={lobbies} {href} {known} {toonHref} />{/if}
	</HoverPop>
	<HoverPop disabled={games.length === 0} heading={`Games running · ${games.length}`}>
		{#snippet trigger()}
			<PresenceChip kind="game" count={games.length} onclick={onchipclick} {compact} />
		{/snippet}
		{#if games.length > 0}<PresenceGroups groups={games} gameClock {href} {known} {toonHref} />{/if}
	</HoverPop>
</div>

<style>
	.presence-chips {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.presence-chips.compact {
		gap: 6px;
	}
</style>
