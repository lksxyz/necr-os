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
	/** Set to false to boot with no network card, for systems that wait on DHCP. */
	networkCard?: boolean;
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
		hint: 'Log in as root, no password. Then run udhcpc -i eth0 and wget an http:// URL; https fails.',
		engine: 'v86',
		boot: {
			bzimage: { url: `${IMAGES}buildroot-linux68.bin`, size: 10068480 },
			cmdline: 'tsc=reliable mitigations=off random.trust_cpu=on',
			memoryMB: 128,
			filesystem: true,
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
		slug: 'pcmos386',
		name: 'PC-MOS/386',
		kind: 'cli',
		year: 1987,
		maker: 'The Software Link',
		license: 'GPLv3',
		source: 'https://github.com/roelandjansen/pcmos386v501',
		note: 'A multi-user DOS that let several terminals share one 386. This is version 5.01, opened under the GPL in 2017.',
		hint: 'Press Enter to keep the date and time, then type dir.',
		engine: 'v86',
		boot: {
			fda: { url: `${IMAGES}pcmos386-501.img`, size: 1474560 },
			memoryMB: 64
		}
	},
	{
		slug: 'newos',
		name: 'NewOS',
		kind: 'cli',
		year: 2001,
		maker: 'Travis Geiselbrecht',
		license: 'BSD-style',
		source: 'https://newos.org/',
		note: 'A kernel written by a former Be engineer, which the Haiku project forked to build its own kernel.',
		hint: 'At the shell prompt, type ls /boot/bin, then try fortune. The kernel log runs in the serial console.',
		engine: 'v86',
		boot: {
			fda: { url: `${IMAGES}newos.img`, size: 1474560 },
			memoryMB: 64
		}
	},
	{
		slug: 'sanos',
		name: 'Sanos',
		kind: 'cli',
		year: 2001,
		maker: 'Michael Ringgaard',
		license: 'BSD-style, GPL network drivers',
		source: 'https://github.com/ringgaard/sanos',
		note: 'A small kernel for server appliances that loads Windows PE programs and can run the Sun Java VM.',
		hint: 'At the /$ prompt, type ls /bin to list the programs.',
		engine: 'v86',
		boot: {
			hda: { url: `${IMAGES}sanos.img`, size: 1474560 },
			memoryMB: 128,
			networkCard: false
		}
	},
	{
		slug: 'jx',
		name: 'JX',
		kind: 'desktop',
		year: 2002,
		maker: 'University of Erlangen-Nuremberg',
		license: 'GPLv2',
		source: 'https://sourceforge.net/projects/jxos/',
		note: 'An operating system written in Java, where type-safe code takes the place of hardware memory protection.',
		hint: 'Wait for the window manager to open its windows, then click the screen to capture the mouse.',
		engine: 'v86',
		boot: {
			fda: { url: `${IMAGES}jx-demo.img`, size: 1474560 },
			memoryMB: 128
		}
	},
	{
		slug: 'plan9',
		name: 'Plan 9',
		kind: 'cli',
		year: 2002,
		maker: 'Bell Labs, patched by the 9legacy project',
		license: 'MIT',
		source: 'https://9legacy.org/',
		note: 'The Bell Labs successor to Unix, where every resource, even the network, is a file. This is the Fourth Edition with 9legacy patches.',
		hint: 'At the startup menu, type 4 and press Enter to reach the rc shell.',
		engine: 'v86',
		boot: {
			hda: { url: `${IMAGES}9legacy.img`, size: 16000000 },
			memoryMB: 512
		}
	},
	{
		slug: 'mobius',
		name: 'Mobius',
		kind: 'desktop',
		year: 2004,
		maker: 'Tim Robinson',
		license: 'MIT',
		source: 'https://sourceforge.net/projects/mobius/',
		note: 'Release 5 of a hobby operating system for the 386, which boots from one floppy into a graphical screen.',
		hint: 'Wait for the graphical screen, then click it to capture the mouse.',
		engine: 'v86',
		boot: {
			fda: { url: `${IMAGES}mobius-release5.img`, size: 1474560 },
			memoryMB: 64
		}
	},
	{
		slug: 'helenos',
		name: 'HelenOS',
		kind: 'desktop',
		year: 2006,
		maker: 'HelenOS developers, started at Charles University in Prague',
		license: 'BSD-3-Clause, GPL boot loader',
		source: 'https://www.helenos.org/',
		note: 'A microkernel system where drivers and file systems run as separate programs. This is release 0.14.1.',
		hint: 'Wait for the desktop, then click the screen to capture the mouse.',
		engine: 'v86',
		boot: {
			cdrom: { url: `${IMAGES}helenos-0.14.1-ia32.iso`, size: 25792512 },
			memoryMB: 256
		}
	},
	{
		slug: 'mikeos',
		name: 'MikeOS',
		kind: 'cli',
		year: 2007,
		maker: 'Mike Saunders and the MikeOS developers',
		license: 'BSD-style, some programs GPLv3',
		source: 'https://mikeos.sourceforge.net/',
		note: 'A 16-bit teaching operating system written in assembly, with its own BASIC interpreter. This is version 4.7.0.',
		hint: 'Press Enter at the first dialog to open the program menu.',
		engine: 'v86',
		boot: {
			cdrom: { url: `${IMAGES}mikeos-4.7.0.iso`, size: 3311616 },
			memoryMB: 64
		}
	},
	{
		slug: 'bootos',
		name: 'bootOS',
		kind: 'cli',
		year: 2019,
		maker: 'Oscar Toledo G.',
		license: 'BSD-2-Clause',
		source: 'https://github.com/nanochess/bootOS',
		note: 'An operating system in one 512-byte boot sector that can load, run and save programs.',
		hint: 'At the $ prompt, type dir, then type a program name such as fbird to run it.',
		engine: 'v86',
		boot: {
			fda: { url: `${IMAGES}bootos-all.img`, size: 368640 },
			memoryMB: 32
		}
	},
	{
		slug: 'bootbasic',
		name: 'bootBASIC',
		kind: 'cli',
		year: 2019,
		maker: 'Oscar Toledo G.',
		license: 'BSD-2-Clause',
		source: 'https://github.com/nanochess/bootBASIC',
		note: 'An integer BASIC interpreter that fits in one 512-byte boot sector.',
		hint: 'Type print 2+2 and press Enter. Statements must be in lowercase.',
		engine: 'v86',
		boot: {
			fda: { url: `${IMAGES}bootbasic.img`, size: 512 },
			memoryMB: 32
		}
	},
	{
		slug: 'bootrogue',
		name: 'bootRogue',
		kind: 'cli',
		year: 2019,
		maker: 'Oscar Toledo G.',
		license: 'BSD-2-Clause',
		source: 'https://github.com/nanochess/bootRogue',
		note: 'A roguelike game in 510 bytes, with monsters, traps and the Amulet of Yendor 26 levels down.',
		hint: 'Move with the arrow keys, and walk into a monster to fight it.',
		engine: 'v86',
		boot: {
			fda: { url: `${IMAGES}bootrogue.img`, size: 512 },
			memoryMB: 32
		}
	},
	{
		slug: 'sectorforth',
		name: 'sectorforth',
		kind: 'cli',
		year: 2020,
		maker: 'Cesar Blum',
		license: 'MIT',
		source: 'https://github.com/cesarblum/sectorforth',
		note: 'A Forth in one 512-byte boot sector, with eight primitives and no built-in numbers.',
		hint: 'Type key emit and press Enter, then press any letter to see it printed.',
		engine: 'v86',
		boot: {
			fda: { url: `${IMAGES}sectorforth.img`, size: 512 },
			memoryMB: 32
		}
	},
	{
		slug: 'sectorlisp',
		name: 'SectorLISP',
		kind: 'cli',
		year: 2021,
		maker: 'Justine Tunney and contributors',
		license: 'ISC',
		source: 'https://github.com/jart/sectorlisp',
		note: "A LISP in one 512-byte boot sector, able to run John McCarthy's meta-circular evaluator.",
		hint: 'Type (CONS (QUOTE A) (QUOTE B)) in capitals and press Enter.',
		engine: 'v86',
		boot: {
			fda: { url: `${IMAGES}sectorlisp-friendly.bin`, size: 512 },
			memoryMB: 32
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
