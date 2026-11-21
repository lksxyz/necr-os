<script lang="ts">
	import type { Snippet } from 'svelte';
	import { formatMB, imageBytes, kindLabel, loadsInParts, type RetroOS } from '#lib/os.ts';

	let {
		os,
		href,
		heading = 'h2',
		footer
	}: {
		os: RetroOS;
		href?: string;
		heading?: 'h1' | 'h2' | 'h3';
		footer?: Snippet;
	} = $props();

	const size = $derived(formatMB(imageBytes(os)));
	const parts = $derived(loadsInParts(os));
</script>

<article class="label" class:linked={Boolean(href)}>
	<svelte:element this={heading} class="name">
		{#if href}
			<a {href}>{os.name}</a>
		{:else}
			{os.name}
		{/if}
	</svelte:element>
	<p class="note">{os.note}</p>
	<dl>
		<div>
			<dt>Year</dt>
			<dd class="mono">{os.year}</dd>
		</div>
		<div>
			<dt>Type</dt>
			<dd><span class="badge badge-{os.kind}">{kindLabel[os.kind]}</span></dd>
		</div>
		<div>
			<dt>Made by</dt>
			<dd>{os.maker}</dd>
		</div>
		<div>
			<dt>License</dt>
			<dd>{os.license}</dd>
		</div>
		<div>
			<dt>Download</dt>
			<dd>
				<span class="mono">{size}</span> MB{#if parts}
					disk<span class="aside">Only the parts it reads are downloaded.</span>{/if}
			</dd>
		</div>
	</dl>
	{#if footer}
		<div class="footer">{@render footer()}</div>
	{/if}
</article>

<style>
	.label {
		position: relative;
		display: grid;
		align-content: start;
		gap: 12px;
		padding: 20px 20px 16px;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--r-label);
		color: var(--text);
		text-align: left;
	}

	.label.linked {
		transition: border-color var(--fast) var(--ease);
	}

	.label.linked:hover {
		border-color: var(--control-border);
	}

	.label.linked:has(a:active) {
		background: var(--line);
	}

	.name {
		font-size: 22px;
		font-weight: 700;
		line-height: 1.2;
	}

	.name a {
		text-decoration: none;
	}

	.name a::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: var(--r-label);
	}

	.label.linked:hover .name a {
		text-decoration: underline;
		text-decoration-thickness: 2px;
	}

	.name a:focus-visible {
		outline: none;
	}

	.name a:focus-visible::after {
		outline: 2px solid var(--text);
		outline-offset: 2px;
	}

	.note {
		color: var(--muted);
		font-size: 15px;
		line-height: 1.45;
	}

	dl {
		display: grid;
		margin: 4px 0 0;
		border-top: 1px dotted var(--control-border);
	}

	dl div {
		display: grid;
		grid-template-columns: 88px minmax(0, 1fr);
		gap: 12px;
		align-items: baseline;
		padding: 7px 0;
		border-bottom: 1px dotted var(--control-border);
	}

	dt {
		color: var(--muted);
		font-size: 13px;
		font-weight: 500;
	}

	dd {
		margin: 0;
		font-size: 14px;
		line-height: 1.4;
		overflow-wrap: anywhere;
	}

	dd.mono,
	dd .mono {
		font-size: 13px;
	}

	.aside {
		display: block;
		color: var(--muted);
		font-size: 13px;
	}

	.footer {
		display: grid;
		gap: 8px;
		padding-top: 4px;
	}
</style>
