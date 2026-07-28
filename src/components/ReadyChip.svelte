<script>
	/**
	 * The "ready to play" top-bar chip.
	 *
	 * The colour carries two different messages, and they are kept apart on
	 * purpose. Green → gold → red is a *countdown*: it only ever describes your
	 * own flag running out, so it belongs to the flagged chip alone. Amber is an
	 * *invitation*: other players are waiting and you are not one of them.
	 *
	 * That second one used to be shown to signed-out visitors only, which had it
	 * backwards — a signed-in player is precisely the one who can act on it.
	 * Anyone who is not currently flagged now gets it.
	 *
	 *  - flagged:              countdown, green → gold → red
	 *  - not flagged, waiting: amber invitation pill (signed in or not)
	 *  - not flagged, nobody:  plain "Ready to play now?" (signed in) / hidden
	 *
	 * Purely presentational — data and transport are the consumer's job.
	 */
	let {
		signedIn = false,
		/** minutes left on own flag, or null when not flagged */
		minutes = null,
		/** 'high' | 'mid' | 'low' — see readyLevel() */
		level = 'high',
		/** number of players currently flagged */
		count = 0,
		busy = false,
		/** flagging is blocked (player is in a lobby/game) */
		locked = false,
		/** 'lobby' | 'ingame' — colors the locked chip like the presence chips */
		lockedStatus = 'lobby',
		lockedLabel,
		/** toggle own flag: called with true (flag/restart) or false (withdraw) */
		ontoggle,
		/** guest click — omit and set guestHref to render a link instead */
		onguest,
		guestHref,
		/**
		 * Narrow top bars: the flag and the count, nothing else. The countdown
		 * goes too — the chip already shifts green → gold → red as the hour
		 * runs out, and the exact minutes stay in the tooltip and the pop.
		 */
		compact = false
	} = $props();

	const flagged = $derived(signedIn && minutes !== null);
</script>

{#snippet flag()}
	<svg
		viewBox="0 0 24 24"
		width="13"
		height="13"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
		<line x1="4" y1="22" x2="4" y2="15" />
	</svg>
{/snippet}

{#if flagged}
	<!-- flagged: the chip is a group — toggle area + inline restart segment -->
	<div class="ready-btn on" class:mid={level === 'mid'} class:low={level === 'low'} class:compact>
		<button
			class="seg main"
			onclick={() => ontoggle?.(false)}
			disabled={busy}
			title={`Ready for ${minutes} more min — click to withdraw`}
		>
			{@render flag()}
			{#if !compact}Ready · {minutes} min{/if}
			{#if count > 0}<span class="count">{count}</span>{/if}
		</button>
		<button
			class="seg re"
			onclick={() => ontoggle?.(true)}
			disabled={busy}
			aria-label="Restart your ready hour"
			title="Restart your ready hour"
		>
			<svg
				viewBox="0 0 24 24"
				width="12"
				height="12"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<polyline points="23 4 23 10 17 10" />
				<path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
			</svg>
		</button>
	</div>
{:else if signedIn && locked}
	<!-- accounted for: the chip takes the presence color of where you are -->
	<span
		class="ready-btn locked"
		class:ingame={lockedStatus === 'ingame'}
		class:compact
		title="No need for the ready flag — you're already {lockedStatus === 'ingame'
			? 'in a game'
			: 'in a lobby'}"
	>
		{@render flag()}
		{#if !compact}{lockedLabel ??
				(lockedStatus === 'ingame' ? 'Already in a game' : 'Already in a lobby')}{/if}
		{#if count > 0}<span class="count">{count}</span>{/if}
	</span>
{:else if signedIn}
	<button
		class="ready-btn plain"
		class:attn={count > 0}
		class:compact
		onclick={() => ontoggle?.(true)}
		disabled={busy}
		title={count > 0
			? `${count} ${count === 1 ? 'player is' : 'players are'} ready to play — flag yourself to join them`
			: 'Flag yourself as ready to play for the next hour'}
	>
		{@render flag()}
		{#if !compact}Ready to play now?{/if}
		{#if count > 0}<span class="count">{count}</span>{/if}
	</button>
{:else if count > 0}
	{#if guestHref}
		<a
			class="ready-btn plain attn"
			class:compact
			href={guestHref}
			title="Sign in with Battle.net to flag yourself too"
		>
			{@render flag()}
			{#if !compact}Ready to play now{/if}
			<span class="count">{count}</span>
		</a>
	{:else}
		<button
			class="ready-btn plain attn"
			class:compact
			onclick={() => onguest?.()}
			title="Sign in with Battle.net to flag yourself too"
		>
			{@render flag()}
			{#if !compact}Ready to play now{/if}
			<span class="count">{count}</span>
		</button>
	{/if}
{/if}

<style>
	.ready-btn {
		display: flex;
		align-items: stretch;
		height: 30px;
		background: var(--sidebar-2);
		color: var(--sidebar-ink);
		border: 1px solid var(--sidebar-line);
		border-radius: 99px;
		font: 500 12px/1 var(--mono);
		font-variant-numeric: tabular-nums;
		text-decoration: none;
		white-space: nowrap;
		transition: all 120ms ease;
	}
	.ready-btn.plain {
		align-items: center;
		gap: 7px;
		padding: 0 14px;
		cursor: pointer;
	}
	/* icon (+ countdown, + count) only — tighter, like the presence chips */
	.ready-btn.plain.compact,
	.ready-btn.locked.compact {
		gap: 6px;
		padding: 0 11px;
	}
	.ready-btn.compact .seg.main {
		gap: 6px;
		padding: 0 22px 0 11px;
	}
	.ready-btn.plain:hover {
		color: var(--accent-hover);
		border-color: var(--accent);
	}
	.ready-btn.plain:disabled {
		opacity: 0.6;
		cursor: default;
	}
	/* players are waiting and you have not joined them — amber invitation,
	   deliberately not the accent green, which already means "your own flag is
	   healthy" and would make the two states indistinguishable at a glance */
	.ready-btn.attn {
		background: var(--item);
		color: var(--on-accent);
		border-color: var(--item);
	}
	.ready-btn.attn:hover {
		color: var(--on-accent);
		border-color: var(--item);
		filter: brightness(1.08);
	}
	.ready-btn.on {
		--chip-bg: var(--accent);
		background: var(--chip-bg);
		color: var(--on-accent);
		border-color: var(--chip-bg);
	}
	.ready-btn.on.mid {
		--chip-bg: var(--item);
	}
	.ready-btn.on.low {
		--chip-bg: var(--hostile);
	}
	/* locked = already in a lobby (teal) / game (violet), like the
	   presence chips; not interactive */
	.ready-btn.locked {
		align-items: center;
		gap: 7px;
		padding: 0 14px;
		background: var(--lobby, #2e7f74);
		color: var(--on-accent);
		border-color: var(--lobby, #2e7f74);
		cursor: default;
	}
	.ready-btn.locked.ingame {
		background: var(--game, #67589f);
		border-color: var(--game, #67589f);
	}
	@media (prefers-color-scheme: dark) {
		.ready-btn.locked {
			background: var(--lobby, #7bc8ba);
			border-color: var(--lobby, #7bc8ba);
		}
		.ready-btn.locked.ingame {
			background: var(--game, #a99ad8);
			border-color: var(--game, #a99ad8);
		}
	}
	/* segments inside the flagged chip: toggle area + restart */
	.seg {
		display: flex;
		align-items: center;
		gap: 7px;
		background: none;
		border: none;
		color: inherit;
		font: inherit;
		cursor: pointer;
		transition:
			background 120ms ease,
			opacity 120ms ease;
	}
	.seg.main {
		/* extra right padding runs under the overlapping circle, so the hover
		   tint's straight edge hides behind it and is cut by the curve */
		padding: 0 24px 0 14px;
		border-radius: 99px 0 0 99px;
	}
	.seg.main:hover {
		background: color-mix(in srgb, currentColor 14%, transparent);
	}
	/* restart = the chip's circular right end-cap: fixed 30px to match the
	   chip height, negative margins overlap it onto the chip border (right)
	   and the main segment (left) */
	.seg.re {
		align-self: stretch;
		flex: none;
		width: 30px;
		padding: 0;
		justify-content: center;
		position: relative;
		margin: -1px -1px -1px -15px;
		background: color-mix(in srgb, var(--on-accent) 18%, var(--chip-bg));
		border: 1px solid color-mix(in srgb, currentColor 40%, transparent);
		border-radius: 50%;
	}
	.seg.re svg {
		opacity: 0.85;
	}
	.seg.re:hover {
		background: color-mix(in srgb, var(--on-accent) 30%, var(--chip-bg));
	}
	.seg.re:hover svg {
		opacity: 1;
	}
	.seg:disabled {
		opacity: 0.6;
		cursor: default;
	}
	.count {
		display: grid;
		place-items: center;
		min-width: 17px;
		height: 17px;
		padding: 0 4px;
		border-radius: 99px;
		background: color-mix(in srgb, currentColor 18%, transparent);
		font-size: 10.5px;
		font-variant-numeric: tabular-nums;
	}
</style>
