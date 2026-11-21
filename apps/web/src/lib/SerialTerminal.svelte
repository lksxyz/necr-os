<script lang="ts">
	import '@xterm/xterm/css/xterm.css';
	import { onMount } from 'svelte';
	import type { Terminal } from '@xterm/xterm';
	import type { FitAddon } from '@xterm/addon-fit';

	let {
		ondata,
		empty = $bindable(true)
	}: {
		ondata: (data: string) => void;
		empty?: boolean;
	} = $props();

	let host: HTMLElement | undefined = $state();
	let term: Terminal | undefined;
	let fitter: FitAddon | undefined;
	let queue: Uint8Array[] = [];

	function refit() {
		if (fitter && host && host.clientWidth > 0 && host.clientHeight > 0) fitter.fit();
	}

	onMount(() => {
		let disposed = false;
		let observer: ResizeObserver | undefined;

		void (async () => {
			const [{ Terminal }, { FitAddon }] = await Promise.all([
				import('@xterm/xterm'),
				import('@xterm/addon-fit')
			]);
			if (disposed || !host) return;
			const css = getComputedStyle(host);
			const font = css.getPropertyValue('--font-mono').trim() || 'monospace';
			term = new Terminal({
				fontFamily: font,
				fontSize: 13,
				cursorBlink: true,
				scrollback: 5000,
				theme: {
					background: '#111111',
					foreground: '#e8e8e8',
					cursor: '#ffb000',
					cursorAccent: '#111111',
					selectionBackground: '#8a5a00'
				}
			});
			fitter = new FitAddon();
			term.loadAddon(fitter);
			term.open(host);
			term.onData((data) => ondata(data));
			for (const bytes of queue) term.write(bytes);
			queue = [];
			refit();
			void document.fonts?.ready.then(() => {
				if (!term) return;
				term.options.fontFamily = font;
				refit();
			});
			observer = new ResizeObserver(refit);
			observer.observe(host);
		})();

		return () => {
			disposed = true;
			observer?.disconnect();
			term?.dispose();
			term = undefined;
			fitter = undefined;
		};
	});

	export function write(bytes: Uint8Array) {
		empty = false;
		if (term) term.write(bytes);
		else queue.push(bytes);
	}

	export function clear() {
		queue = [];
		term?.reset();
		empty = true;
	}
</script>

<div class="term" bind:this={host}></div>

<style>
	.term {
		min-width: 0;
		min-height: 0;
		padding: 8px 0 0 12px;
		background: #111111;
	}

	.term :global(.xterm) {
		height: 100%;
	}
</style>
