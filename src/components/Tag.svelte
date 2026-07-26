<script>
	/** kind: undefined | 'mos' | 'hostile' | 'item' | 'accent' */
	let { kind, children, ...rest } = $props();
</script>

<span class="tag {kind ? `t-${kind}` : ''}" {...rest}>{@render children?.()}</span>
