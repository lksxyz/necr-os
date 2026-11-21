<script lang="ts">
	import { osList } from '#lib/os.ts';
	import { repoUrl } from '#lib/site.ts';

	const byYear = [...osList].sort((a, b) => a.year - b.year);

	const software = [
		{ name: 'v86', use: 'The x86 emulator, with SeaBIOS and the VGA BIOS', license: 'BSD-2-Clause', href: 'https://github.com/copy/v86' },
		{ name: 'v86 images', use: 'The collection the disk images come from', license: 'Per image, see above', href: 'https://github.com/copy/images' },
		{ name: 'xterm.js', use: 'The serial console', license: 'MIT', href: 'https://github.com/xtermjs/xterm.js' },
		{ name: 'Lucide', use: 'Icons on the machine controls', license: 'ISC', href: 'https://lucide.dev/' },
		{ name: 'Gelasio', use: 'Heading font when Georgia is missing', license: 'SIL OFL 1.1', href: 'https://fontsource.org/fonts/gelasio' },
		{ name: 'DM Mono', use: 'Numbers on labels and the serial console', license: 'SIL OFL 1.1', href: 'https://fontsource.org/fonts/dm-mono' }
	];

	const host = (url: string) => new URL(url).hostname.replace(/^www\./, '');
</script>

<svelte:head>
	<title>Licenses | NecrOS</title>
	<meta name="description" content="The license and source of every machine and library in NecrOS." />
</svelte:head>

<article class="prose">
	<h1>Licenses</h1>
	<p>
		Every machine and library in NecrOS keeps its own license. The source of each one is linked
		below. The code of this site is MIT licensed and lives on <a href={repoUrl}>GitHub</a>.
	</p>
</article>

<section aria-labelledby="machines-title">
	<h2 id="machines-title">Machines</h2>
	{#if byYear.length === 0}
		<p class="empty">The catalog is empty, so there are no machine licenses to list.</p>
	{:else}
		<div class="scroll">
			<table>
				<thead>
					<tr>
						<th scope="col">Machine</th>
						<th scope="col">Made by</th>
						<th scope="col">License</th>
						<th scope="col">Source</th>
					</tr>
				</thead>
				<tbody>
					{#each byYear as os (os.slug)}
						<tr>
							<th scope="row">
								<a href="/os/{os.slug}">{os.name}</a> <span class="mono">{os.year}</span>
							</th>
							<td data-label="Made by">{os.maker}</td>
							<td data-label="License">{os.license}</td>
							<td data-label="Source"><a href={os.source}>{host(os.source)}</a></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>

<section aria-labelledby="software-title">
	<h2 id="software-title">Software used by the site</h2>
	<div class="scroll">
		<table>
			<thead>
				<tr>
					<th scope="col">Name</th>
					<th scope="col">Used for</th>
					<th scope="col">License</th>
				</tr>
			</thead>
			<tbody>
				{#each software as item (item.name)}
					<tr>
						<th scope="row"><a href={item.href}>{item.name}</a></th>
						<td data-label="Used for">{item.use}</td>
						<td data-label="License">{item.license}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<style>
	section {
		margin-top: 48px;
	}

	h2 {
		font-size: 24px;
		margin-bottom: 16px;
	}

	.scroll {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14px;
		line-height: 1.45;
	}

	th,
	td {
		padding: 10px 16px 10px 0;
		border-bottom: 1px dotted var(--control-border);
		text-align: left;
		vertical-align: baseline;
	}

	thead th {
		color: var(--muted);
		font-size: 13px;
		font-weight: 500;
		border-bottom: 1px solid var(--control-border);
	}

	tbody th {
		font-family: var(--font-serif);
		font-size: 16px;
		font-weight: 700;
		white-space: nowrap;
	}

	tbody th .mono {
		margin-left: 4px;
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: 400;
	}

	.empty {
		color: var(--muted);
	}

	@media (max-width: 560px) {
		table,
		thead,
		tbody,
		tr,
		th,
		td {
			display: block;
		}

		thead {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
		}

		tr {
			padding: 12px 0;
			border-bottom: 1px dotted var(--control-border);
		}

		th,
		td {
			padding: 2px 0;
			border: 0;
		}

		tbody th {
			white-space: normal;
			margin-bottom: 4px;
		}

		td::before {
			content: attr(data-label) ': ';
			color: var(--muted);
			font-size: 13px;
		}

		td a {
			display: inline-flex;
			align-items: center;
			min-height: 44px;
		}
	}
</style>
