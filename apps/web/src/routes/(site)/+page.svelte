<script lang="ts">
	import CollectionLabel from '#lib/CollectionLabel.svelte';
	import { osList } from '#lib/os.ts';

	const byYear = [...osList].sort((a, b) => a.year - b.year);
	const featured = byYear[0];
	const first = byYear[0];
	const last = byYear[byYear.length - 1];
</script>

<svelte:head>
	<title>NecrOS: old operating systems that still boot</title>
	<meta
		name="description"
		content="A catalog of old operating systems, command-line and desktop, that boot in a browser tab."
	/>
</svelte:head>

<section class="hero" aria-labelledby="hero-title">
	<div class="intro">
		<h1 id="hero-title">Dead operating systems, switched back on.</h1>
		<p class="keeper">
			NecrOS keeps the operating systems the world buried. Pick one, and it wakes in this tab, with
			its own screen, sound and serial console.
		</p>
		{#if byYear.length > 0}
			<a class="all" href="/os">Browse all {byYear.length} machines</a>
		{/if}
	</div>

	{#if featured}
		<div class="plinth">
			<p class="kicker keeper">The oldest grave in the archive</p>
			<CollectionLabel os={featured} heading="h2">
				{#snippet footer()}
					<a class="btn btn-primary" href="/os/{featured.slug}?boot=1">Boot {featured.name}</a>
				{/snippet}
			</CollectionLabel>
		</div>
	{/if}
</section>

{#if byYear.length > 0}
	<section class="timeline" aria-labelledby="timeline-title">
		<h2 id="timeline-title">
			Laid to rest, <span class="mono">{first.year}</span> to <span class="mono">{last.year}</span>
		</h2>
		<ol>
			{#each byYear as os (os.slug)}
				<li>
					<a href="/os/{os.slug}">
						<span class="year mono">{os.year}</span>
						<span class="name">{os.name}</span>
					</a>
				</li>
			{/each}
		</ol>
	</section>
{:else}
	<section class="empty" role="status">
		<p>The archive is empty. Add a machine to <code class="mono">src/lib/os.ts</code> and it rests here.</p>
	</section>
{/if}

<style>
	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
		gap: 40px 72px;
		align-items: center;
		padding-block: 24px 96px;
	}

	.intro {
		display: grid;
		gap: 24px;
		justify-items: start;
	}

	h1 {
		font-size: clamp(2.5rem, 6vw, 4.25rem);
		font-weight: 700;
		line-height: 1.02;
		max-width: 12ch;
	}

	.intro p {
		max-width: 40ch;
		color: var(--muted);
		font-size: 18px;
		line-height: 1.5;
	}

	.all {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		font-weight: 600;
	}

	.plinth {
		display: grid;
		gap: 12px;
	}

	.kicker {
		color: var(--muted);
		font-size: 16px;
	}

	.timeline {
		padding-block: 24px 24px;
	}

	h2 {
		font-size: 20px;
		margin-bottom: 28px;
	}

	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
		row-gap: 20px;
	}

	li {
		border-top: 2px solid var(--text);
	}

	ol a {
		position: relative;
		display: grid;
		gap: 6px;
		min-height: 44px;
		padding: 18px 12px 12px 0;
		text-decoration: none;
	}

	ol a::before {
		content: '';
		position: absolute;
		top: -2px;
		left: 0;
		width: 2px;
		height: 12px;
		background: var(--text);
		transition: height var(--fast) var(--ease);
	}

	ol a:hover::before {
		height: 18px;
	}

	.year {
		font-size: 24px;
		line-height: 1;
	}

	.name {
		color: var(--muted);
		font-size: 15px;
		font-weight: 500;
		transition: color var(--fast) var(--ease);
	}

	ol a:hover .name {
		color: var(--text);
		text-decoration: underline;
		text-decoration-thickness: 2px;
	}

	ol a:active .name {
		color: var(--amber-ink);
	}

	.empty {
		padding: 32px;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--r-label);
	}

	code {
		font-size: 0.9em;
	}

	@media (max-width: 900px) {
		.hero {
			grid-template-columns: minmax(0, 1fr);
			padding-block: 8px 64px;
		}
	}

	@media (max-width: 560px) {
		ol {
			grid-template-columns: minmax(0, 1fr);
			row-gap: 0;
		}

		li {
			border-top: 0;
			border-left: 2px solid var(--text);
		}

		ol a {
			grid-template-columns: 64px minmax(0, 1fr);
			align-items: baseline;
			padding: 12px 0 12px 16px;
		}

		ol a::before {
			display: none;
		}

		.year {
			font-size: 18px;
		}
	}
</style>
