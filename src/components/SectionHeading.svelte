<script>
	let { children, ...rest } = $props();
</script>

<h2 class="section" {...rest}>{@render children?.()}</h2>
