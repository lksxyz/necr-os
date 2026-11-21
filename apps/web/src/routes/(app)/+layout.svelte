<script lang="ts">
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<style>
		html,
		body {
			height: 100%;
			overflow: hidden;
			overscroll-behavior: none;
		}
	</style>
</svelte:head>

{@render children()}
