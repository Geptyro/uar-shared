<script>
	/** Pressable pill — `pressed` renders the accent-filled state. */
	let { pressed = false, children, ...rest } = $props();
</script>

<button class="chip" aria-pressed={pressed} {...rest}>{@render children?.()}</button>
