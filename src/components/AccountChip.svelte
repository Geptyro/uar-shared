<script>
	/**
	 * The signed-in account chip — MOS-blue pill with the portrait as its
	 * circular left end-cap and an optional cog end-cap on the right,
	 * exactly as in the website's top bar. Main area and cog each accept a
	 * href or a click handler.
	 */
	import anonPortrait from '../assets/anon-portrait.svg';

	let {
		battletag,
		avatar = null,
		href,
		onclick,
		title,
		cogHref,
		oncog,
		cogTitle = 'Account settings',
		/**
		 * Portrait and cog only, no battletag — for narrow top bars, matching
		 * the website's own chip below 700px. The name is a whole line of mono
		 * text and by far the widest thing in the pill; it moves into the
		 * tooltip rather than disappearing outright.
		 */
		compact = false
	} = $props();

	const tip = $derived(compact && battletag ? [battletag, title].filter(Boolean).join(' · ') : title);
</script>

{#snippet main()}
	<img class="acct-avatar" src={avatar ?? anonPortrait} alt="" />
	{#if !compact}<span class="acct-tag">{battletag}</span>{/if}
{/snippet}

{#snippet cogIcon()}
	<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"
		stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		<circle cx="12" cy="12" r="3" />
		<path
			d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
		/>
	</svg>
{/snippet}

<div class="acct-chip">
	{#if href}
		<a class="acct-main" class:compact {href} title={tip}>{@render main()}</a>
	{:else}
		<button class="acct-main" class:compact {onclick} title={tip}>{@render main()}</button>
	{/if}
	{#if cogHref}
		<a class="acct-cog" href={cogHref} title={cogTitle} aria-label={cogTitle}>{@render cogIcon()}</a>
	{:else if oncog}
		<button class="acct-cog" onclick={oncog} title={cogTitle} aria-label={cogTitle}>
			{@render cogIcon()}
		</button>
	{/if}
</div>

<style>
	/* logged-in chip in MOS blue so it stands out of the dark topbar;
	   30px tall like the ready chip so the whole row lines up */
	.acct-chip {
		display: flex;
		align-items: stretch;
		height: 30px;
		background: var(--mos);
		border: 1px solid var(--mos);
		border-radius: 99px;
	}
	.acct-main {
		display: flex;
		align-items: center;
		gap: 7px;
		color: var(--accent-contrast);
		/* left 0: the portrait end-cap sits on the chip edge;
		   right padding runs under the overlapping cog circle */
		padding: 0 24px 0 0;
		border-radius: 99px 0 0 99px;
		font: 500 12px/1 var(--font-mono);
		text-decoration: none;
		white-space: nowrap;
		background: none;
		border: none;
		cursor: pointer;
		transition: all 120ms ease;
	}
	/* no name to sit between them: the pill collapses to portrait + cog, and
	   the right padding only has to clear the cog's overlap */
	.acct-main.compact {
		gap: 0;
		padding-right: 15px;
	}
	.acct-main:hover {
		background: color-mix(in srgb, currentColor 12%, transparent);
	}
	/* portrait = full-height circular LEFT end-cap, mirroring the cog */
	.acct-avatar {
		width: 30px;
		height: 30px;
		flex: none;
		margin: -1px 0 -1px -1px;
		border-radius: 50%;
		object-fit: cover;
		border: 1px solid color-mix(in srgb, currentColor 40%, transparent);
	}
	/* cog = darker circular end-cap overlapping the chip, like the ready chip */
	.acct-cog {
		display: flex;
		align-items: center;
		justify-content: center;
		align-self: stretch;
		flex: none;
		width: 30px;
		position: relative;
		margin: -1px -1px -1px -15px;
		background: color-mix(in srgb, var(--accent-contrast) 18%, var(--mos));
		color: var(--accent-contrast);
		border: 1px solid color-mix(in srgb, currentColor 40%, transparent);
		border-radius: 50%;
		cursor: pointer;
		transition: all 120ms ease;
	}
	.acct-cog:hover {
		background: color-mix(in srgb, var(--accent-contrast) 30%, var(--mos));
	}
</style>
