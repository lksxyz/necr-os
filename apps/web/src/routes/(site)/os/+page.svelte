<script lang="ts">
	import CollectionLabel from '#lib/CollectionLabel.svelte';
	import { osList } from '#lib/os.ts';

	const byYear = [...osList].sort((a, b) => a.year - b.year);
</script>

<svelte:head>
	<title>Catalog | NecrOS</title>
	<meta name="description" content="Every machine in the NecrOS catalog, oldest first." />
</svelte:head>

<header class="head">
	<h1>Catalog</h1>
	<p class="keeper">
		{byYear.length}
		{byYear.length === 1 ? 'machine rests' : 'machines rest'} here, oldest first. Each one wakes in its own
		page.
	</p>
</header>

{#if byYear.length === 0}
	<div class="empty" role="status">
		<p>The archive is empty.</p>
		<p>Add a machine to <code class="mono">src/lib/os.ts</code> and it rests here.</p>
	</div>
{:else}
	<ol class="grid">
		{#each byYear as os (os.slug)}
			<li>
				<CollectionLabel {os} href="/os/{os.slug}" heading="h2" />
			</li>
		{/each}
	</ol>
{/if}

<style>
	.head {
		display: grid;
		gap: 12px;
		margin-bottom: 40px;
	}

	h1 {
		font-size: clamp(2.25rem, 5vw, 3.25rem);
		font-weight: 700;
	}

	.head p {
		color: var(--muted);
		font-size: 17px;
	}

	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 20px;
	}

	.grid li {
		display: grid;
	}

	.empty {
		display: grid;
		gap: 8px;
		padding: 32px;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--r-label);
	}

	.empty p:first-child {
		font-size: 19px;
		font-weight: 600;
	}

	.empty p + p {
		color: var(--muted);
	}

	code {
		font-size: 0.9em;
	}

	@media (max-width: 900px) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
