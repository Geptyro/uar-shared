<script>
	/** Labelled switch. Bind `checked`; label via prop or children. */
	let { checked = $bindable(false), label, children, ...rest } = $props();
</script>

<label class="toggle-row">
	<input type="checkbox" class="switch" bind:checked {...rest} />
	<span>{#if children}{@render children()}{:else}{label}{/if}</span>
</label>

<style>
	.toggle-row {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 5px 0;
		cursor: pointer;
		font-size: 13.5px;
	}
</style>
