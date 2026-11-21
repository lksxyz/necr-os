<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { RetroOS } from '#lib/os.ts';
	import CollectionLabel from '#lib/CollectionLabel.svelte';
	import Play from '@lucide/svelte/icons/play';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import { DriveSound } from '#lib/driveSound.ts';
	import { createScreenRenderer, type ScreenEffect, type ScreenRenderer } from '#lib/screenRenderer.ts';

	type Phase = 'idle' | 'loading' | 'running' | 'error';

	let {
		os,
		phase = $bindable('idle'),
		detail = $bindable(''),
		volume = 1,
		muted = false,
		screenEffect = 'sharp',
		driveNoise = true,
		effectsAvailable = $bindable(true),
		mips = $bindable(0),
		diskActive = $bindable(false),
		mouseLocked = $bindable(false),
		onserial
	}: {
		os: RetroOS;
		phase?: Phase;
		detail?: string;
		volume?: number;
		muted?: boolean;
		screenEffect?: ScreenEffect;
		driveNoise?: boolean;
		effectsAvailable?: boolean;
		mips?: number;
		diskActive?: boolean;
		mouseLocked?: boolean;
		onserial?: (bytes: Uint8Array) => void;
	} = $props();

	type WithBus = { bus: { send(name: string, data: unknown): void } };
	type WithSpeaker = { speaker_adapter?: { audio_context?: AudioContext } };

	const DISK_LIT_MS = 120;
	const SCREEN_PAD = 16;
	const hasDrive = $derived(Boolean(os.boot.hda || os.boot.cdrom || os.boot.filesystem));

	let stage: HTMLElement | undefined = $state();
	let container: HTMLElement | undefined = $state();
	let emulator: import('v86').V86 | undefined;
	let source: HTMLCanvasElement | undefined;
	let renderer: ScreenRenderer | undefined;
	let drive: DriveSound | undefined;
	let observer: ResizeObserver | undefined;
	let loop = 0;
	let sourceW = 0;
	let sourceH = 0;
	let lastDisk = -Infinity;
	let lastCount = 0;
	let lastCountAt = 0;
	let pending: number[] = [];
	let guestMouse = false;
	let absoluteMouse = false;
	let glOn = $state(false);
	let progress = $state(0);

	const mb = (n: number) => (n / 1048576).toFixed(1);

	function applyVolume() {
		if (!emulator || phase !== 'running') return;
		const level = muted ? 0 : Math.min(Math.max(volume, 0), 1);
		const db = level === 0 ? -100 : 20 * Math.log10(level);
		(emulator as unknown as WithBus).bus.send('mixer-volume', [0, 2, db]);
	}

	$effect(() => {
		void volume;
		void muted;
		void phase;
		applyVolume();
	});

	$effect(() => {
		const level = muted || !driveNoise ? 0 : Math.min(Math.max(volume, 0), 1) * 0.6;
		drive?.setLevel(level);
		if (phase === 'running' && level > 0 && hasDrive) drive?.spinUp();
	});

	function layout() {
		if (!stage || !container || !source) return;
		const sw = source.width;
		const sh = source.height;
		const width = stage.clientWidth - SCREEN_PAD * 2;
		const height = stage.clientHeight - SCREEN_PAD * 2;
		if (!sw || !sh || width <= 0 || height <= 0) return;
		const s = Math.min(width / sw, height / sh);
		const w = Math.floor(sw * s);
		const h = Math.floor(sh * s);
		container.style.width = `${w}px`;
		container.style.height = `${h}px`;
		renderer?.resize(w, h);
	}

	function flushSerial() {
		if (!pending.length) return;
		const bytes = Uint8Array.from(pending);
		pending = [];
		onserial?.(bytes);
	}

	function meters(now: number) {
		const lit = now - lastDisk < DISK_LIT_MS;
		if (lit !== diskActive) diskActive = lit;
		if (!emulator || now - lastCountAt < 1000) return;
		const count = emulator.get_instruction_counter();
		if (lastCountAt) {
			const delta = (count - lastCount + 2 ** 32) % 2 ** 32;
			mips = Math.round(delta / ((now - lastCountAt) * 1000));
		}
		lastCount = count;
		lastCountAt = now;
	}

	function tick(now: number) {
		loop = requestAnimationFrame(tick);
		flushSerial();
		meters(now);
		if (!source) return;
		if (source.width !== sourceW || source.height !== sourceH) {
			sourceW = source.width;
			sourceH = source.height;
			layout();
		}
		if (renderer && stage && stage.clientWidth > 0) renderer.draw(source, screenEffect);
	}

	function wakeAudio() {
		const ctx = (emulator as unknown as WithSpeaker | undefined)?.speaker_adapter?.audio_context;
		if (ctx?.state === 'suspended') void ctx.resume();
		drive?.prime();
	}

	function captureMouse() {
		if (!stage || phase !== 'running' || !guestMouse || absoluteMouse) return;
		if (document.pointerLockElement === stage) return;
		const target = stage;
		void (async () => {
			try {
				await target.requestPointerLock({ unadjustedMovement: true } as PointerLockOptions);
			} catch {
				try {
					await target.requestPointerLock();
				} catch {
				}
			}
		})();
	}

	function onLockChange() {
		mouseLocked = Boolean(stage) && document.pointerLockElement === stage;
	}

	function onDisk() {
		lastDisk = performance.now();
		drive?.activity();
	}

	const NET_RELAY = import.meta.env.VITE_NET_RELAY as string | undefined;
	const CORS_PROXY = import.meta.env.VITE_CORS_PROXY as string | undefined;

	async function boot() {
		if (!container || phase === 'loading' || phase === 'running') return;
		phase = 'loading';
		detail = 'Loading the emulator';
		progress = 0;
		pending = [];
		drive = new DriveSound();
		drive.prime();
		try {
			const { V86 } = await import('v86');
			const b = os.boot;
			emulator = new V86({
				wasm_path: '/v86/v86.wasm',
				screen: { container, use_graphical_text: true },
				bios: { url: '/v86/seabios.bin' },
				vga_bios: { url: '/v86/vgabios.bin' },
				memory_size: b.memoryMB * 1024 * 1024,
				vga_memory_size: 8 * 1024 * 1024,
				fda: b.fda,
				hda: b.hda
					? b.hda.partSize
						? { url: b.hda.url, size: b.hda.size, async: true, use_parts: true, fixed_chunk_size: b.hda.partSize }
						: { ...b.hda, async: false }
					: undefined,
				cdrom: b.cdrom ? { ...b.cdrom, async: false } : undefined,
				bzimage: b.bzimage ? { ...b.bzimage, async: false } : undefined,
				cmdline: b.cmdline,
				filesystem: b.filesystem ? {} : undefined,
				net_device: b.network ? { type: 'ne2k', relay_url: NET_RELAY ?? 'fetch', cors_proxy: CORS_PROXY } : undefined,
				autostart: true
			});

			emulator.add_listener('download-progress', (e) => {
				const name = e.file_name.split('/').pop() ?? e.file_name;
				if (e.lengthComputable && e.total > 0) {
					progress = e.loaded / e.total;
					detail = `Downloading ${name}: ${mb(e.loaded)} of ${mb(e.total)} MB`;
				} else {
					detail = `Downloading ${name}`;
				}
			});
			emulator.add_listener('download-error', (e) => {
				phase = 'error';
				detail = `Could not download ${e.file_name.split('/').pop() ?? e.file_name}. Check your connection, then try again.`;
			});
			emulator.add_listener('emulator-started', () => {
				if (phase !== 'error') {
					phase = 'running';
					detail = 'Running';
				}
			});
			emulator.add_listener('serial0-output-byte', (byte) => {
				pending.push(byte);
			});
			emulator.add_listener('mouse-enable', (on) => {
				guestMouse = on;
			});
			emulator.add_listener('vmware-absolute-mouse', (on) => {
				absoluteMouse = on;
				if (on && document.pointerLockElement === stage) document.exitPointerLock();
			});
			emulator.add_listener('ide-read-end', onDisk);
			emulator.add_listener('ide-write-end', onDisk);
			emulator.add_listener('9p-read-end', onDisk);
			emulator.add_listener('9p-write-end', onDisk);

			source = container.querySelector('canvas') ?? undefined;
			renderer =
				createScreenRenderer(() => {
					renderer = undefined;
					effectsAvailable = false;
					glOn = false;
				}) ?? undefined;
			effectsAvailable = Boolean(renderer);
			if (renderer) {
				container.append(renderer.canvas);
				glOn = true;
			}

			observer = new ResizeObserver(layout);
			if (stage) observer.observe(stage);
			sourceW = 0;
			sourceH = 0;
			lastCountAt = 0;
			loop = requestAnimationFrame(tick);
			window.addEventListener('pointerdown', wakeAudio, true);
			window.addEventListener('keydown', wakeAudio, true);
			document.addEventListener('pointerlockchange', onLockChange);
		} catch (err) {
			phase = 'error';
			const reason = err instanceof Error ? err.message.replace(/\.$/, '') : 'the emulator did not load';
			detail = `${os.name} stopped while starting: ${reason}.`;
		}
	}

	async function teardown() {
		if (typeof window !== 'undefined') {
			window.removeEventListener('pointerdown', wakeAudio, true);
			window.removeEventListener('keydown', wakeAudio, true);
			document.removeEventListener('pointerlockchange', onLockChange);
			if (stage && document.pointerLockElement === stage) document.exitPointerLock();
		}
		observer?.disconnect();
		observer = undefined;
		if (loop) cancelAnimationFrame(loop);
		loop = 0;
		renderer?.destroy();
		renderer = undefined;
		drive?.destroy();
		drive = undefined;
		source = undefined;
		pending = [];
		mips = 0;
		diskActive = false;
		mouseLocked = false;
		guestMouse = false;
		absoluteMouse = false;
		glOn = false;
		if (container) {
			container.style.width = '';
			container.style.height = '';
		}
		const e = emulator;
		emulator = undefined;
		try {
			await e?.destroy();
		} catch {
		}
	}

	export async function restart() {
		await teardown();
		phase = 'idle';
		detail = '';
		if (container) container.replaceChildren(document.createElement('div'), document.createElement('canvas'));
		await boot();
	}

	export function start() {
		void boot();
	}

	export function fullscreen() {
		void stage?.requestFullscreen?.();
	}

	export function sendCtrlAltDel() {
		emulator?.keyboard_send_scancodes([0x1d, 0x38, 0x53, 0xd3, 0xb8, 0x9d]);
	}

	export async function snapshot(): Promise<ArrayBuffer | undefined> {
		return emulator?.save_state();
	}

	export async function restoreSnapshot(buffer: ArrayBuffer) {
		await emulator?.restore_state(buffer);
	}

	export function sendSerial(data: string) {
		emulator?.serial0_send(data);
	}

	onDestroy(() => {
		void teardown();
	});
</script>

<div class="stage" bind:this={stage} onpointerdown={captureMouse} role="presentation">
	<div class="screen" class:live={phase === 'running'} class:gl={glOn} bind:this={container}>
		<div></div>
		<canvas></canvas>
	</div>

	{#if phase !== 'running'}
		<div class="overlay">
			<div class="plinth">
				{#if phase === 'idle'}
					<p class="resting keeper">{os.name} is resting. Boot it to bring it back.</p>
				{/if}
				<CollectionLabel {os} heading="h2">
					{#snippet footer()}
						{#if phase === 'idle'}
							<button class="btn btn-primary" type="button" onclick={boot}><Play size={18} aria-hidden="true" />Boot {os.name}</button>
						{:else if phase === 'loading'}
							<div
								class="meter"
								role="progressbar"
								aria-label="Download progress"
								aria-valuemin="0"
								aria-valuemax="100"
								aria-valuenow={Math.round(progress * 100)}
							>
								<span style:width="{progress * 100}%"></span>
							</div>
							<p class="progress" role="status">{detail}</p>
						{:else if phase === 'error'}
							<p class="fail" role="alert">{detail}</p>
							<button class="btn btn-outline" type="button" onclick={restart}><RotateCcw size={18} aria-hidden="true" />Try again</button>
						{/if}
					{/snippet}
				</CollectionLabel>
			</div>
		</div>
	{/if}
</div>

<style>
	.stage {
		position: relative;
		padding: 16px;
		display: grid;
		place-items: center;
		overflow: hidden;
		min-height: 0;
		background: var(--stage);
	}

	.screen {
		position: relative;
		visibility: hidden;
		opacity: 0;
		line-height: 0;
		border-radius: var(--r-screen);
		overflow: hidden;
	}

	.screen.live {
		visibility: visible;
		opacity: 1;
		animation: wake var(--boot) var(--ease) 1 both;
	}

	@keyframes wake {
		0% {
			opacity: 0;
		}
		45% {
			opacity: 0.85;
		}
		65% {
			opacity: 0.55;
		}
		100% {
			opacity: 1;
		}
	}

	.screen > :global(div) {
		display: none !important;
	}

	.screen > :global(canvas) {
		display: block !important;
		width: 100% !important;
		height: 100% !important;
		image-rendering: pixelated;
	}

	.screen.gl > :global(canvas:first-of-type) {
		display: none !important;
	}

	.screen > :global(canvas.gl-out) {
		position: absolute;
		inset: 0;
		image-rendering: auto;
	}

	.overlay {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		padding: 24px;
		overflow: auto;
		background: var(--stage);
	}

	.plinth {
		display: grid;
		gap: 12px;
		width: min(420px, 100%);
	}

	.resting {
		color: var(--stage-text);
		font-size: 16px;
		text-align: center;
	}

	.meter {
		height: 6px;
		background: var(--line);
		border-radius: var(--r-badge);
		overflow: hidden;
	}

	.meter span {
		display: block;
		height: 100%;
		background: var(--amber);
		transition: width var(--base) linear;
	}

	.progress {
		color: var(--muted);
		font-size: 14px;
		overflow-wrap: anywhere;
	}

	.fail {
		color: var(--text);
		font-size: 14px;
		font-weight: 500;
	}
</style>
