<script lang="ts">
	import '@fontsource-variable/gelasio';
	import '@fontsource-variable/gelasio/wght-italic.css';
	import '@fontsource/dm-mono/400.css';
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
