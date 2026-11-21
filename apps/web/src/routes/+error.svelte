<script lang="ts">
	import { page } from '$app/state';

	const notFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{notFound ? 'Not found' : 'Error'} | NecrOS</title>
</svelte:head>

<main class="error">
	<p class="code mono">{page.status}</p>
	<h1>{notFound ? 'This machine is not in the catalog.' : 'This page stopped while loading.'}</h1>
	<p class="msg">
		{notFound
			? 'Check the address, or pick a machine from the catalog.'
			: `${(page.error?.message ?? 'The page could not load').replace(/\.$/, '')}. Reload the page to try again.`}
	</p>
	<a class="btn btn-outline" href="/os">Open the catalog</a>
</main>

<style>
	.error {
		display: grid;
		justify-items: start;
		align-content: center;
		gap: 16px;
		min-height: 100dvh;
		max-width: 960px;
		margin: 0 auto;
		padding: 40px 20px;
	}

	.code {
		color: var(--amber-ink);
		font-size: 15px;
	}

	h1 {
		font-size: clamp(2rem, 5vw, 3.25rem);
		font-weight: 700;
		max-width: 18ch;
	}

	.msg {
		color: var(--muted);
		font-size: 17px;
		margin-bottom: 8px;
	}
</style>
