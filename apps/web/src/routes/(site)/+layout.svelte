<script lang="ts">
	import { page } from '$app/state';
	import NoticeBar from '#lib/NoticeBar.svelte';
	import { operator, socials } from '#lib/site.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const links = [
		{ href: '/os', label: 'Catalog' },
		{ href: '/help', label: 'Help' },
		{ href: '/about', label: 'About' }
	];

	const footerLinks = [
		{ href: '/about', label: 'About' },
		{ href: '/help', label: 'Help' },
		{ href: '/privacy', label: 'Privacy' },
		{ href: '/terms', label: 'Terms' },
		{ href: '/licenses', label: 'Licenses' }
	];

	const isCurrent = (href: string) => page.url.pathname.startsWith(href);
</script>

<NoticeBar />

<header class="bar">
	<a class="wordmark" href="/">NecrOS</a>
	<nav aria-label="Main">
		{#each links as link (link.href)}
			<a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>
				{link.label}
			</a>
		{/each}
	</nav>
</header>

<main>
	{@render children()}
</main>

<footer class="foot">
	<div class="foot-top">
		<p>NecrOS, a personal project by {operator}. Emulation by <a href="https://github.com/copy/v86">v86</a>.</p>
		<ul class="socials">
			{#each socials as social (social.href)}
				<li>
					<a href={social.href} aria-label={social.label} title={social.label}>
						<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
							<path d={social.path} fill="currentColor" />
						</svg>
					</a>
				</li>
			{/each}
		</ul>
	</div>
	<nav aria-label="Site">
		{#each footerLinks as link (link.href)}
			<a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>{link.label}</a>
		{/each}
	</nav>
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
		display: grid;
		gap: 8px;
		padding-block: 24px 32px;
		color: var(--muted);
		font-size: 14px;
	}

	.foot-top {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 8px 24px;
	}

	.foot-top a {
		color: var(--text);
	}

	.foot nav {
		flex-wrap: wrap;
		margin-left: -12px;
	}

	.foot nav a {
		font-size: 14px;
	}

	.socials {
		display: flex;
		gap: 4px;
		margin: 0 -12px 0 0;
		padding: 0;
		list-style: none;
	}

	.socials a {
		display: inline-grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border-radius: var(--r-control);
		color: var(--muted);
		transition: color var(--fast) var(--ease);
	}

	.socials a:hover {
		color: var(--text);
	}

	.socials a:active {
		background: var(--surface);
	}

	@media (max-width: 560px) {
		.bar {
			height: 56px;
		}

		nav a {
			padding: 0 10px;
		}

		.foot nav {
			margin-left: -10px;
		}

		main {
			padding-block: 32px 64px;
		}
	}
</style>
