<script>
	/**
	 * Top-bar hover dropdown: renders the `trigger` snippet (a chip) and a
	 * card that appears under it on hover/focus — the website's pop
	 * pattern, shared so the tray behaves identically.
	 */
	/** `disabled`: render the trigger alone (nothing to drop down). */
	let { heading, trigger, children, disabled = false } = $props();
</script>

<div class="hover-wrap">
	{@render trigger?.()}
	{#if !disabled}
		<div class="pop">
			<div class="pop-card">
				{#if heading}<div class="pop-head">{heading}</div>{/if}
				{@render children?.()}
			</div>
		</div>
	{/if}
</div>

<style>
	.hover-wrap {
		position: relative;
		display: flex;
		align-items: center;
	}
	/* transparent padding keeps hover alive over the gap */
	.pop {
		display: none;
		position: absolute;
		top: 100%;
		right: 0;
		padding-top: 8px;
		z-index: 40;
	}
	.hover-wrap:hover .pop,
	.hover-wrap:focus-within .pop {
		display: block;
	}
	.pop-card {
		min-width: 240px;
		background: var(--surface);
		color: var(--ink);
		border: 1px solid var(--border);
		border-radius: var(--r);
		box-shadow: var(--shadow-2);
		padding: 6px;
	}
	.pop-head {
		font-family: var(--mono);
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-3);
		padding: 5px 8px 7px;
		border-bottom: 1px solid var(--border);
		margin-bottom: 4px;
	}
</style>
