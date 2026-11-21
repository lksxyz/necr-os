# NecrOS

A catalog of old operating systems that boot in a browser tab. Each machine runs in [v86](https://github.com/copy/v86), an x86 emulator compiled to WebAssembly.

Static SvelteKit site (prerendered, no API) in a pnpm monorepo, deployed to Cloudflare with Alchemy v2. Design direction lives in [`DESIGN.md`](DESIGN.md).

```
apps/web          SvelteKit app (adapter-static, one HTML file per route)
apps/web/static   v86 build files and the disk images in images/
apps/relay        Wisp relay Worker that gives networked machines real TCP connections
alchemy.run.ts    Cloudflare deployment: the static site and the relay Worker
```

## Routes

- `/` home page: the featured machine and a timeline of the catalog
- `/os` catalog: every machine, oldest first
- `/os/:slug` machine page: fills the window with no page scroll. `?boot=1` boots on load
- `/about`

## Commands

```sh
pnpm install
pnpm dev            # local dev server
pnpm build          # static output in apps/web/build
pnpm check          # svelte-check
pnpm alchemy profile edit --add Cloudflare   # one-time login
pnpm deploy         # build and deploy to Cloudflare
pnpm destroy
```

## Adding a machine

1. Put the disk image in `apps/web/static/images/`. Large hard disk images can be split into parts so a machine downloads only what it reads; set `partSize` on the `hda` entry.
2. Add an entry to `osList` in `apps/web/src/lib/os.ts` with its year, maker, license, note, first-step hint, and boot config. Every value shown on its label comes from this entry.

The catalog, the home timeline, and the prerendered `/os/:slug` page pick it up from there.

## Networking

Machines with `network: true` (Linux 2.6, Linux 6.8) can open real TCP connections through the relay Worker. After deploying, set these in `apps/web/.env`:

```sh
VITE_NET_RELAY=wss://<relay worker host>   # the relay URL from alchemy deploy, with wss://
VITE_CORS_PROXY=<optional CORS proxy URL>
```

Add the deployed site origin to `ALLOWED_ORIGINS` in `apps/relay/worker.ts`. Without `VITE_NET_RELAY`, v86 falls back to its fetch-based network, which only handles HTTP.

## Kiroween 2026

Submitted to the Resurrection category: dead operating systems, booted again in a modern browser.

Kiro usage lives in [`.kiro/`](.kiro): steering files for the product rules, the tech stack, and the design direction, which point Kiro at `DESIGN.md` and the antislop skills for every UI change.

## Pre-existing work and third-party code

Built during the Kiroween 2026 submission period. The following existed before and is used under its own license:

- The project started from a SvelteKit + Alchemy static-site starter template (monorepo layout, `alchemy.run.ts`, build config).
- [v86](https://github.com/copy/v86) (BSD-2-Clause): the emulator package and the runtime files in `apps/web/static/v86/` (`v86.wasm`, SeaBIOS, VGA BIOS). License copy in `apps/web/static/v86/LICENSE`.
- Disk images in `apps/web/static/images/` come from the v86 project's image collection. Each machine's license is listed on its label and in `apps/web/src/lib/os.ts`.
- Libraries: xterm.js (MIT) for the serial console, Lucide (ISC) for control icons, Gelasio and DM Mono (SIL OFL 1.1) via Fontsource.

## License

The NecrOS source is MIT licensed, see [`LICENSE`](LICENSE). Third-party files keep their own licenses listed above.
