<script lang="ts" module>
	export const NOTICE_KEY = 'necros:notice:v1';
</script>

<script lang="ts">
	import { issuesUrl, socials } from '#lib/site.ts';

	const githubMark = socials[0].path;

	function close() {
		try {
			localStorage.setItem(NOTICE_KEY, 'closed');
		} catch {
			// Storage can be blocked; the bar still closes for this page view.
		}
		document.documentElement.dataset.notice = 'closed';
		document.querySelector<HTMLElement>('.wordmark')?.focus();
	}
</script>

<aside class="notice" aria-label="Site notice">
	<div class="in">
		<p class="msg">
			<span class="long">Found a problem with NecrOS? Tell us which machine and browser you used.</span>
			<span class="short">Found a problem?</span>
		</p>
		<a class="action" href="{issuesUrl}/new" target="_blank" rel="noopener">
			<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
				<path d={githubMark} fill="currentColor" />
			</svg>
			Open an issue<span class="sr"> on GitHub (opens in a new tab)</span>
		</a>
		<button class="close" type="button" aria-label="Close notice" onclick={close}>
			<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
				<path
					d="M4 4 L12 12 M12 4 L4 12"
					fill="none"
					stroke="currentColor"
					stroke-width="1.7"
					stroke-linecap="round"
				/>
			</svg>
		</button>
	</div>
</aside>

<style>
	.notice {
		position: relative;
		background: var(--text);
		color: var(--paper);
	}

	:global(html[data-notice='closed']) .notice {
		display: none;
	}

	.in {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px 12px;
		max-width: 960px;
		min-height: 44px;
		margin: 0 auto;
		padding: 0 48px;
	}

	.msg {
		font-size: 13px;
		line-height: 1.4;
	}

	.short {
		display: none;
	}

	.action {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		flex: none;
		min-height: 28px;
		padding: 0 10px;
		border: 1px solid var(--paper);
		border-radius: var(--r-control);
		color: var(--paper);
		font-size: 13px;
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
		transition:
			background-color var(--fast) var(--ease),
			color var(--fast) var(--ease);
	}

	.action::before {
		content: '';
		position: absolute;
		inset: -8px 0;
	}

	.action:hover {
		background: var(--paper);
		color: var(--text);
	}

	.action:active {
		background: var(--surface);
		color: var(--text);
	}

	.close {
		position: absolute;
		top: 0;
		right: 0;
		display: inline-grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border: 0;
		border-radius: var(--r-control);
		background: transparent;
		color: var(--paper);
		transition: background-color var(--fast) var(--ease);
	}

	.close:hover {
		background: rgb(251 248 241 / 0.12);
	}

	.close:active {
		background: rgb(251 248 241 / 0.2);
	}

	.action:focus-visible,
	.close:focus-visible {
		outline-color: var(--paper);
	}

	@media (max-width: 560px) {
		.in {
			justify-content: flex-start;
			gap: 4px 12px;
			padding: 0 48px 0 16px;
		}

		.long {
			display: none;
		}

		.short {
			display: inline;
		}
	}
</style>
