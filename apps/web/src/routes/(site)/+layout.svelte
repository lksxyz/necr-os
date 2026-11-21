<script lang="ts">
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const links = [
		{ href: '/os', label: 'Catalog' },
		{ href: '/about', label: 'About' }
	];
</script>

<header class="bar">
	<a class="wordmark" href="/">NecrOS</a>
	<nav aria-label="Main">
		{#each links as link (link.href)}
			<a href={link.href} aria-current={page.url.pathname.startsWith(link.href) ? 'page' : undefined}>
				{link.label}
			</a>
		{/each}
	</nav>
</header>

<main>
	{@render children()}
</main>

<footer class="foot">
	<p>NecrOS, a personal project.</p>
	<p>Emulation by <a href="https://github.com/copy/v86">v86</a>.</p>
</footer>

<style>
	.bar,
	main,
	.foot {
		width: 100%;
		max-width: 960px;
		margin: 0 auto;
		padding-inline: 20px;
	}

	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 64px;
	}

	.wordmark {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		font-family: var(--font-serif);
		font-size: 22px;
		font-weight: 700;
		text-decoration: none;
	}

	nav {
		display: flex;
		gap: 4px;
	}

	nav a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0 12px;
		color: var(--muted);
		font-weight: 500;
		text-decoration: none;
		border-radius: var(--r-control);
		transition: color var(--fast) var(--ease);
	}

	nav a:hover {
		color: var(--text);
	}

	nav a:active {
		background: var(--surface);
	}

	nav a[aria-current='page'] {
		color: var(--text);
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 6px;
	}

	main {
		padding-block: 48px 96px;
	}

	.foot {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 8px 24px;
		padding-block: 24px 32px;
		color: var(--muted);
		font-size: 14px;
	}

	.foot a {
		color: var(--text);
	}

	@media (max-width: 560px) {
		.bar {
			height: 56px;
		}

		nav a {
			padding: 0 10px;
		}

		main {
			padding-block: 32px 64px;
		}
	}
</style>
