const SPIN_HZ = 90;
const CLICK_GAP_MS = 30;

export class DriveSound {
	private ctx: AudioContext | null = null;
	private master: GainNode | null = null;
	private spinGain: GainNode | null = null;
	private spinOsc: OscillatorNode[] = [];
	private noise: AudioBuffer | null = null;
	private lastClick = 0;
	private level = 0;

	private ensure() {
		if (this.ctx) {
			if (this.ctx.state === 'suspended') void this.ctx.resume();
			return this.ctx;
		}
		const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
		if (!Ctor) return null;
		const ctx = new Ctor();
		const master = ctx.createGain();
		master.gain.value = this.level;
		const compressor = ctx.createDynamicsCompressor();
		master.connect(compressor).connect(ctx.destination);

		const length = Math.floor(ctx.sampleRate * 0.02);
		const noise = ctx.createBuffer(1, length, ctx.sampleRate);
		const data = noise.getChannelData(0);
		for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;

		this.ctx = ctx;
		this.master = master;
		this.noise = noise;
		return ctx;
	}

	prime() {
		this.ensure();
	}

	spinUp() {
		const ctx = this.ensure();
		if (!ctx || !this.master || this.spinGain) return;
		const t = ctx.currentTime;
		const gain = ctx.createGain();
		gain.gain.setValueAtTime(0, t);
		gain.gain.linearRampToValueAtTime(0.05, t + 1.5);
		gain.connect(this.master);

		const partials: [number, number][] = [
			[1, 0.6],
			[2, 0.25],
			[3, 0.1]
		];
		this.spinOsc = partials.map(([mult, amp]) => {
			const osc = ctx.createOscillator();
			osc.frequency.setValueAtTime(SPIN_HZ * mult * 0.2, t);
			osc.frequency.exponentialRampToValueAtTime(SPIN_HZ * mult, t + 1.5);
			const g = ctx.createGain();
			g.gain.value = amp;
			osc.connect(g).connect(gain);
			osc.start(t);
			return osc;
		});
		this.spinGain = gain;
	}

	activity() {
		const ctx = this.ctx;
		if (!ctx || !this.master || !this.noise || this.level === 0) return;
		const now = performance.now();
		if (now - this.lastClick < CLICK_GAP_MS) return;
		this.lastClick = now;

		const t = ctx.currentTime;
		const src = ctx.createBufferSource();
		src.buffer = this.noise;
		src.playbackRate.value = 0.8 + Math.random() * 0.4;
		const band = ctx.createBiquadFilter();
		band.type = 'bandpass';
		band.frequency.value = 1800 + Math.random() * 1400;
		band.Q.value = 1.2;
		const env = ctx.createGain();
		env.gain.setValueAtTime(0.6, t);
		env.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
		src.connect(band).connect(env).connect(this.master);
		src.start(t);
		src.stop(t + 0.03);

		if (Math.random() < 0.25) {
			const thunk = ctx.createOscillator();
			thunk.frequency.value = 60 + Math.random() * 30;
			const g = ctx.createGain();
			g.gain.setValueAtTime(0.3, t);
			g.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
			thunk.connect(g).connect(this.master);
			thunk.start(t);
			thunk.stop(t + 0.04);
		}
	}

	setLevel(level: number) {
		this.level = Math.min(Math.max(level, 0), 1);
		if (this.ctx && this.master) this.master.gain.setTargetAtTime(this.level, this.ctx.currentTime, 0.05);
	}

	destroy() {
		for (const osc of this.spinOsc) osc.stop();
		this.spinOsc = [];
		this.spinGain = null;
		void this.ctx?.close();
		this.ctx = null;
		this.master = null;
	}
}
