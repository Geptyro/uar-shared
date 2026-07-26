<script>
	/** variant: 'solid' (accent) | 'ghost' | 'danger' */
	let { variant = 'solid', children, ...rest } = $props();
</script>

<button
	class="btn"
	class:ghost={variant === 'ghost'}
	class:danger={variant === 'danger'}
	{...rest}
>
	{@render children?.()}
</button>
