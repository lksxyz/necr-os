export type OSKind = 'cli' | 'desktop';

export const kindLabel: Record<OSKind, string> = {
	cli: 'CLI',
	desktop: 'Desktop'
};

const IMAGES = '/images/';

export type BootConfig = {
	fda?: { url: string; size: number };
	cdrom?: { url: string; size: number };
	hda?: { url: string; size: number; partSize?: number };
	bzimage?: { url: string; size: number };
	cmdline?: string;
	memoryMB: number;
	filesystem?: boolean;
	network?: boolean;
};

export type RetroOS = {
	slug: string;
	name: string;
	kind: OSKind;
	year: number;
	maker: string;
	note: string;
	license: string;
	source: string;
	hint: string;
	engine: 'v86';
	boot: BootConfig;
};

export const osList: RetroOS[] = [
	{
		slug: 'unix-v7',
		name: 'Unix V7',
		kind: 'cli',
		year: 1979,
		maker: 'Bell Labs, ported to x86 by Robert Nordier',
		license: 'Caldera BSD-style',
		source: 'https://www.nordier.com/v7x86/',
		note: 'Seventh Edition Unix from Bell Labs, with the original Bourne shell, ed and cc.',
		hint: 'Log in as guest with no password. To become root, run su and enter password.',
		engine: 'v86',
		boot: {
			hda: { url: `${IMAGES}unix-v7x86-0.8a/.img`, size: 152764416, partSize: 262144 },
			memoryMB: 64
		}
	},
	{
		slug: 'freedos',
		name: 'FreeDOS',
		kind: 'cli',
		year: 1998,
		maker: 'FreeDOS Project',
		license: 'GPL',
		source: 'https://www.freedos.org/',
		note: 'Open-source DOS that runs MS-DOS programs. Ships with vim and a few games.',
		hint: 'Pick a language at the menu, or press Esc to reach the A:\\> prompt.',
		engine: 'v86',
		boot: {
			fda: { url: `${IMAGES}freedos722.img`, size: 737280 },
			memoryMB: 32
		}
	},
	{
		slug: 'msdos4',
		name: 'MS-DOS 4',
		kind: 'cli',
		year: 1988,
		maker: 'Microsoft',
		license: 'MIT (source)',
		source: 'https://github.com/microsoft/MS-DOS',
		note: 'The 1988 release of MS-DOS, whose source Microsoft published in 2024.',
		hint: 'Press Enter twice to skip the date and time, then type dir.',
		engine: 'v86',
		boot: {
			fda: { url: `${IMAGES}msdos4.img`, size: 1474560 },
			memoryMB: 128
		}
	},
	{
		slug: 'linux26',
		name: 'Linux 2.6',
		kind: 'cli',
		year: 2003,
		maker: 'Linux community',
		license: 'GPL',
		source: 'https://www.kernel.org/',
		note: 'A small Linux 2.6 system with a BusyBox shell, booted from a 6 MB CD.',
		hint: 'Wait for the shell prompt, then type ls or uname -a.',
		engine: 'v86',
		boot: {
			cdrom: { url: `${IMAGES}linux.iso`, size: 6547456 },
			memoryMB: 64,
			network: true
		}
	},
	{
		slug: 'linux68',
		name: 'Linux 6.8',
		kind: 'cli',
		year: 2024,
		maker: 'Linux community, Buildroot image from the v86 project',
		license: 'GPL',
		source: 'https://buildroot.org/',
		note: 'A current Linux kernel with a BusyBox shell and networking tools, in a 10 MB image.',
		hint: 'Log in as root with no password. Then try ip a, udhcpc -i eth0 and wget.',
		engine: 'v86',
		boot: {
			bzimage: { url: `${IMAGES}buildroot-linux68.bin`, size: 10068480 },
			cmdline: 'tsc=reliable mitigations=off random.trust_cpu=on',
			memoryMB: 128,
			network: true
		}
	},
	{
		slug: 'kolibrios',
		name: 'KolibriOS',
		kind: 'desktop',
		year: 2004,
		maker: 'KolibriOS team',
		license: 'GPL',
		source: 'https://kolibrios.org/',
		note: 'Written in assembly and small enough to boot from one floppy.',
		hint: 'Click the screen to capture the mouse, then open an app from the desktop.',
		engine: 'v86',
		boot: {
			fda: { url: `${IMAGES}kolibri.img`, size: 1474560 },
			memoryMB: 128
		}
	},
	{
		slug: 'freegem',
		name: 'FreeGEM',
		kind: 'desktop',
		year: 1985,
		maker: 'Digital Research, opened by Caldera, run on FreeDOS',
		license: 'GPL',
		source: 'https://www.seasip.info/Gem/',
		note: 'The GEM desktop from 1985, the windowed shell that ran on DOS before Windows caught on.',
		hint: 'If a boot menu appears, pick the GEM entry. Then click the screen to capture the mouse.',
		engine: 'v86',
		boot: {
			hda: { url: `${IMAGES}freegem/.bin`, size: 209715200, partSize: 262144 },
			memoryMB: 64
		}
	},
	{
		slug: 'oberon',
		name: 'Oberon',
		kind: 'desktop',
		year: 1990,
		maker: 'ETH Zurich',
		license: 'BSD-style',
		source: 'https://sourceforge.net/p/nativeoberon/wiki/Home/',
		note: 'Native Oberon from ETH Zurich, where any text on screen can be clicked to run as a command.',
		hint: 'Click the screen to capture the mouse, then middle-click any command to run it.',
		engine: 'v86',
		boot: {
			hda: { url: `${IMAGES}oberon.img`, size: 25165824 },
			memoryMB: 64
		}
	},
	{
		slug: 'xwoaf',
		name: 'xwoaf',
		kind: 'desktop',
		year: 2004,
		maker: 'Terry Loveall, rebuilt by the Puppy Linux community',
		license: 'GPL',
		source: 'https://oldforum.puppylinux.com/viewtopic.php?t=109062',
		note: 'X Window On A Floppy: a Linux desktop with windows and apps in about 2 MB.',
		hint: 'Wait for the desktop, then click the screen to capture the mouse.',
		engine: 'v86',
		boot: {
			cdrom: { url: `${IMAGES}xwoaf_rebuild4.iso`, size: 2205696 },
			memoryMB: 256
		}
	}
];

export const findOS = (slug: string) => osList.find((os) => os.slug === slug);

export const imageBytes = (os: RetroOS) =>
	[os.boot.fda, os.boot.cdrom, os.boot.hda, os.boot.bzimage].reduce((sum, img) => sum + (img?.size ?? 0), 0);

export const loadsInParts = (os: RetroOS) => Boolean(os.boot.hda?.partSize);

export function formatMB(bytes: number) {
	const mb = bytes / 1048576;
	return mb >= 10 ? String(Math.round(mb)) : mb.toFixed(1);
}
