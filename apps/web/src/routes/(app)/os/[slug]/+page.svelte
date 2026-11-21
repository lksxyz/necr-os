<script lang="ts">
	import { onMount } from 'svelte';
	import Emulator from '#lib/Emulator.svelte';
	import SerialTerminal from '#lib/SerialTerminal.svelte';
	import { kindLabel } from '#lib/os.ts';
	import { screenEffects, type ScreenEffect } from '#lib/screenRenderer.ts';
	import type { PageProps } from './$types';
	import { saveState, loadState, stateInfo, deleteState, type SavedInfo } from '#lib/stateStore.ts';
	import { formatMB } from '#lib/os.ts';
	import Save from '@lucide/svelte/icons/save';
	import History from '@lucide/svelte/icons/history';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Keyboard from '@lucide/svelte/icons/keyboard';
	import Maximize from '@lucide/svelte/icons/maximize';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Monitor from '@lucide/svelte/icons/monitor';
	import Columns2 from '@lucide/svelte/icons/columns-2';
	import Terminal from '@lucide/svelte/icons/terminal';
	import HardDrive from '@lucide/svelte/icons/hard-drive';
	import Volume2 from '@lucide/svelte/icons/volume-2';
	import VolumeX from '@lucide/svelte/icons/volume-x';
	import Eraser from '@lucide/svelte/icons/eraser';

	let { data }: PageProps = $props();
	let os = $derived(data.os);
	let hasDrive = $derived(Boolean(os.boot.hda || os.boot.cdrom || os.boot.filesystem));

	let emu: Emulator | undefined = $state();
	let term: SerialTerminal | undefined = $state();
	let phase = $state<'idle' | 'loading' | 'running' | 'error'>('idle');
	let detail = $state('');
	let consoleEmpty = $state(true);
	let volume = $state(1);
	let muted = $state(false);
	let driveNoise = $state(true);
	let screenEffect = $state<ScreenEffect>('sharp');
	let effectsAvailable = $state(true);
	let mips = $state(0);
	let diskActive = $state(false);
	let mouseLocked = $state(false);

	const EFFECT_KEY = 'necros:effect';

	onMount(() => {
		void refreshSaved();
		const saved = localStorage.getItem(EFFECT_KEY);
		if (screenEffects.some((e) => e.id === saved)) screenEffect = saved as ScreenEffect;
		if (new URLSearchParams(location.search).get('boot') === '1') emu?.start();
	});

	function chooseEffect(value: string) {
		if (!screenEffects.some((e) => e.id === value)) return;
		screenEffect = value as ScreenEffect;
		localStorage.setItem(EFFECT_KEY, value);
	}

	$effect(() => {
		if (phase === 'loading') term?.clear();
	});

	type Mode = 'screen' | 'split' | 'console';
	const modes = [
		{ id: 'screen' as Mode, label: 'Screen', icon: Monitor },
		{ id: 'split' as Mode, label: 'Screen and console', icon: Columns2 },
		{ id: 'console' as Mode, label: 'Console', icon: Terminal }
	];
	let mode = $state<Mode>('screen');

	let saved = $state<SavedInfo | null>(null);
	let stateMsg = $state('');
	let busy = $state(false);

	async function refreshSaved() {
		try {
			saved = await stateInfo(os.slug);
		} catch {
			saved = null;
		}
	}

	async function withState(progress: string, failure: string, fn: () => Promise<void>) {
		if (busy) return;
		busy = true;
		stateMsg = progress;
		try {
			await fn();
		} catch (e) {
			const quota = e instanceof DOMException && e.name === 'QuotaExceededError';
			stateMsg = quota ? 'Not enough browser storage for this state.' : failure;
		} finally {
			busy = false;
			await refreshSaved();
		}
	}

	const doSave = () =>
		withState('Saving state', 'Could not save the state. Try again.', async () => {
			const buf = await emu?.snapshot();
			if (!buf) throw new Error('no state');
			await saveState(os.slug, buf);
			stateMsg = `Saved (${formatMB(buf.byteLength)} MB).`;
		});

	const doLoad = () =>
		withState('Loading saved state', 'Could not load the saved state. Try again.', async () => {
			const s = await loadState(os.slug);
			if (!s) throw new Error('none');
			await emu?.restoreSnapshot(s.buffer);
			stateMsg = 'Loaded saved state.';
		});

	const doDelete = () =>
		withState('Deleting saved state', 'Could not delete the saved state. Try again.', async () => {
			await deleteState(os.slug);
			stateMsg = 'Deleted saved state.';
		});
	let view = $derived<Mode>(phase === 'running' ? mode : 'screen');

	const stateText = $derived(
		phase === 'idle' ? 'Powered off' : phase === 'loading' ? 'Booting' : phase === 'running' ? 'Running' : 'Stopped'
	);

	function run(action: () => void) {
		action();
		(document.activeElement as HTMLElement | null)?.blur();
	}
</script>

<svelte:head>
	<title>{os.name} | NecrOS</title>
</svelte:head>

<div class="shell">
	<header class="bar">
		<a class="back" href="/os"><ArrowLeft size={18} aria-hidden="true" /> Catalog</a>
		<h1>
			{os.name}
			<span class="badge badge-{os.kind}">{kindLabel[os.kind]}</span>
			<span class="year mono">{os.year}</span>
		</h1>
		<div class="tools">
			{#if phase === 'running'}
				<button class="quiet hide-sm" type="button" onclick={() => run(() => emu?.sendCtrlAltDel())}>
					<Keyboard size={16} aria-hidden="true" />Send Ctrl+Alt+Del
				</button>
				{#if view !== 'console'}
					<button class="quiet hide-sm" type="button" onclick={() => run(() => emu?.fullscreen())}>
						<Maximize size={16} aria-hidden="true" />Fullscreen
					</button>
				{/if}
				<button class="quiet" type="button" onclick={() => run(() => emu?.restart())}><RotateCcw size={16} aria-hidden="true" />Restart</button>
			{/if}
			<p class="state" class:running={phase === 'running'} role="status">
				{#if phase === 'running'}<span class="mark" aria-hidden="true"></span>{/if}{stateText}
			</p>
		</div>
	</header>

	{#if phase === 'running'}
		<div class="subbar">
			<div class="modes" role="group" aria-label="Layout">
				{#each modes as m (m.id)}
					<button
						class="quiet"
						type="button"
						aria-pressed={mode === m.id}
						onclick={() => run(() => (mode = m.id))}
					>
						<m.icon size={16} aria-hidden="true" />{m.label}
					</button>
				{/each}
			</div>
			<div class="meters" aria-label="Activity">
				<span><span class="mono">{mips}</span> MIPS</span>
				{#if hasDrive}
					<span class="led" class:on={diskActive}>
						<span class="dot" aria-hidden="true"></span>Disk{diskActive ? ' busy' : ''}
					</span>
				{/if}
			</div>
			<div class="saves">
				<button class="quiet" type="button" disabled={busy} onclick={doSave}>
					<Save size={16} aria-hidden="true" />Save state
				</button>
				<button class="quiet" type="button" disabled={busy || !saved} onclick={doLoad}>
					<History size={16} aria-hidden="true" />Load state
				</button>
				{#if saved}
					<button class="quiet" type="button" disabled={busy} onclick={doDelete} aria-label="Delete saved state">
						<Trash2 size={16} aria-hidden="true" />
					</button>
				{/if}
				<span class="save-info" role="status">
					{stateMsg || (saved ? `Saved ${new Date(saved.savedAt).toLocaleString()}` : '')}
				</span>
			</div>
			<div class="sound">
				{#if effectsAvailable}
					<label class="effect">
						<span class="sr">Screen effect</span>
						<select value={screenEffect} onchange={(e) => chooseEffect(e.currentTarget.value)}>
							{#each screenEffects as fx (fx.id)}
								<option value={fx.id}>{fx.label}</option>
							{/each}
						</select>
					</label>
				{/if}
				{#if hasDrive}
					<button
						class="quiet hide-sm"
						type="button"
						aria-pressed={driveNoise}
						onclick={() => run(() => (driveNoise = !driveNoise))}
					>
						<HardDrive size={16} aria-hidden="true" />Drive noise
					</button>
				{/if}
				<button class="quiet" type="button" aria-pressed={muted} onclick={() => run(() => (muted = !muted))}>
					{#if muted}<VolumeX size={16} aria-hidden="true" />{:else}<Volume2 size={16} aria-hidden="true" />{/if}Mute sound
				</button>
				<label class="volume">
					<span class="sr">Volume</span>
					<input type="range" min="0" max="1" step="0.05" bind:value={volume} disabled={muted} />
				</label>
			</div>
		</div>
	{/if}

	<main class="stage {view}" aria-label="{os.name} screen and serial console">
		<div class="screen-pane">
			<Emulator
				{os}
				bind:this={emu}
				bind:phase
				bind:detail
				bind:effectsAvailable
				bind:mips
				bind:diskActive
				bind:mouseLocked
				{volume}
				{muted}
				{driveNoise}
				{screenEffect}
				onserial={(bytes) => term?.write(bytes)}
			/>
		</div>

		<section class="console-pane" aria-label="Serial console">
			<header>
				<h2>Serial console</h2>
				<button class="quiet" type="button" disabled={consoleEmpty} onclick={() => run(() => term?.clear())}>
					<Eraser size={16} aria-hidden="true" />Clear console
				</button>
			</header>
			<div class="console">
				<SerialTerminal bind:this={term} bind:empty={consoleEmpty} ondata={(d) => emu?.sendSerial(d)} />
				{#if consoleEmpty}
					<p class="empty">
						Nothing here yet. {os.name} has not written to its serial port. Click here to type into it.
					</p>
				{/if}
			</div>
		</section>
	</main>

	{#if phase === 'running'}
		<p class="hint" role="status">{mouseLocked ? 'Mouse captured. Press Esc to release it.' : os.hint}</p>
	{/if}
</div>

<style>
	.shell {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		height: 100dvh;
		display: grid;
		grid-template-rows: auto auto minmax(0, 1fr) auto;
		overflow: hidden;
		background: var(--stage);
	}

	.bar {
		grid-row: 1;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 16px;
		height: 52px;
		padding: 0 8px;
		background: var(--paper);
	}

	.back {
		justify-self: start;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 44px;
		padding: 0 12px;
		border-radius: var(--r-control);
		color: var(--muted);
		font-weight: 500;
		text-decoration: none;
		transition: color var(--fast) var(--ease);
	}

	.back:hover {
		color: var(--text);
	}

	.back:active {
		background: var(--surface);
	}

	h1 {
		display: flex;
		align-items: baseline;
		gap: 8px;
		min-width: 0;
		font-size: 17px;
		font-weight: 700;
		line-height: 1.2;
		white-space: nowrap;
		overflow: hidden;
	}

	h1 .badge {
		vertical-align: baseline;
	}

	h1 .year {
		color: var(--muted);
		font-size: 14px;
		font-weight: 400;
	}

	.tools {
		justify-self: end;
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.state {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 0 12px;
		color: var(--muted);
		font-size: 14px;
		font-weight: 600;
		white-space: nowrap;
	}

	.state.running {
		color: var(--amber-ink);
	}

	.mark {
		width: 10px;
		height: 10px;
		border-radius: var(--r-badge);
		background: var(--amber);
		box-shadow: inset 0 0 0 1px var(--amber-ink);
	}

	.saves {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.save-info {
		color: var(--muted);
		font-size: 13px;
	}

	.quiet {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 44px;
		padding: 0 12px;
		border: 0;
		border-radius: var(--r-control);
		background: transparent;
		color: var(--muted);
		font: inherit;
		font-size: 14px;
		font-weight: 500;
		white-space: nowrap;
		transition: color var(--fast) var(--ease);
	}

	.quiet:hover:not(:disabled) {
		color: var(--text);
	}

	.quiet:active:not(:disabled) {
		background: var(--surface);
	}

	.quiet:disabled {
		opacity: 0.5;
	}

	.quiet[aria-pressed='true'] {
		background: var(--surface);
		color: var(--text);
	}

	.modes .quiet[aria-pressed='true'] {
		box-shadow: inset 0 -3px 0 var(--amber);
	}

	.subbar {
		grid-row: 2;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 4px 8px;
		padding: 0 8px;
		background: var(--paper);
	}

	.modes,
	.meters,
	.sound {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.meters {
		gap: 16px;
		margin-right: auto;
		margin-left: 12px;
		color: var(--muted);
		font-size: 14px;
		white-space: nowrap;
	}

	.led {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.led .dot {
		width: 8px;
		height: 8px;
		border-radius: var(--r-badge);
		background: var(--paper);
		box-shadow: inset 0 0 0 1px var(--control-border);
	}

	.led.on {
		color: var(--text);
	}

	.led.on .dot {
		background: var(--amber);
		box-shadow: inset 0 0 0 1px var(--amber-ink);
	}

	.effect select {
		min-height: 44px;
		padding: 0 8px;
		border: 1px solid var(--control-border);
		border-radius: var(--r-control);
		background: var(--paper);
		color: var(--text);
		font: inherit;
		font-size: 14px;
	}

	.effect select:hover {
		border-color: var(--text);
	}

	.volume {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0 4px;
	}

	.volume input {
		width: 96px;
		accent-color: var(--amber-ink);
	}

	.volume input:disabled {
		opacity: 0.5;
	}

	.stage {
		grid-row: 3;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		overflow: hidden;
		min-height: 0;
	}

	.stage.split {
		grid-template-columns: minmax(0, 1fr) minmax(280px, 34%);
	}

	.screen-pane,
	.console-pane {
		display: grid;
		min-width: 0;
		min-height: 0;
	}

	.stage.screen .console-pane,
	.stage.console .screen-pane {
		display: none;
	}

	.console-pane {
		grid-template-rows: auto minmax(0, 1fr);
		background: var(--paper);
		border-left: 1px solid var(--line);
	}

	.stage.console .console-pane {
		border-left: 0;
	}

	.console-pane header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 8px 0 16px;
		border-bottom: 1px solid var(--line);
	}

	.console-pane h2 {
		font-size: 14px;
		font-weight: 600;
	}

	.console {
		position: relative;
		display: grid;
		min-height: 0;
		background: var(--stage);
	}

	.console .empty {
		position: absolute;
		inset: 0 0 auto 0;
		padding: 12px 16px;
		color: var(--stage-text);
		font-size: 14px;
		line-height: 1.5;
		pointer-events: none;
	}

	.hint {
		grid-row: 4;
		padding: 10px 16px;
		background: var(--paper);
		color: var(--muted);
		font-size: 14px;
	}

	@media (max-width: 560px) {
		.bar {
			grid-template-columns: auto minmax(0, 1fr) auto;
			gap: 4px;
		}

		.state,
		.hide-sm,
		.meters,
		h1 .year {
			display: none;
		}

		.stage.split {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: minmax(0, 3fr) minmax(0, 2fr);
		}

		.console-pane {
			border-left: 0;
			border-top: 1px solid var(--line);
		}

		.volume input {
			width: 64px;
		}
	}
</style>
