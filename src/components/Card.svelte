<script>
	let { children, ...rest } = $props();
</script>

<div class="card" {...rest}>{@render children?.()}</div>
