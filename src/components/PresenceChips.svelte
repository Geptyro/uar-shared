<script>
	/**
	 * The complete top-bar presence cluster: lobby + game chips with their
	 * hover rosters. One composition for the website and the tray.
	 */
	import HoverPop from './HoverPop.svelte';
	import PresenceChip from './PresenceChip.svelte';
	import PresenceGroups from './PresenceGroups.svelte';

	let { lobbies = [], games = [], href = () => null, onchipclick } = $props();
</script>

<div class="presence-chips">
	<HoverPop disabled={lobbies.length === 0} heading={`Open lobbies · ${lobbies.length}`}>
		{#snippet trigger()}
			<PresenceChip kind="lobby" count={lobbies.length} onclick={onchipclick} />
		{/snippet}
		{#if lobbies.length > 0}<PresenceGroups groups={lobbies} {href} />{/if}
	</HoverPop>
	<HoverPop disabled={games.length === 0} heading={`Games running · ${games.length}`}>
		{#snippet trigger()}
			<PresenceChip kind="game" count={games.length} onclick={onchipclick} />
		{/snippet}
		{#if games.length > 0}<PresenceGroups groups={games} gameClock {href} />{/if}
	</HoverPop>
</div>

<style>
	.presence-chips {
		display: flex;
		align-items: center;
		gap: 8px;
	}
</style>
