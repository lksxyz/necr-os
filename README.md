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
- `/help`, `/about`, `/privacy`, `/terms`, `/licenses`

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
2. Add an entry to `osList` in `apps/web/src/lib/os.ts` with its year, maker, license, source URL, note, first-step hint, and boot config. Every value shown on its label comes from this entry.

The catalog, the home timeline, and the prerendered `/os/:slug` page pick it up from there.

## Deployment

Live site: https://necros.kuncen.workers.dev

`pnpm deploy` asks for approval in a terminal. In a non-interactive shell, run `pnpm exec alchemy deploy --yes`. It deploys two Workers: `necros` (the static site) and `necros-relay`.

## Networking

Machines with `network: true` (Linux 2.6, Linux 6.8) can open real TCP connections through the `necros-relay` Worker.

- The relay address is set once in `alchemy.run.ts` (`NET_RELAY`) and passed to the site build as `VITE_NET_RELAY`.
- The relay only accepts connections from origins listed in `ALLOWED_ORIGINS` in `apps/relay/worker.ts`.
- For `pnpm dev`, put `VITE_NET_RELAY=wss://necros-relay.kuncen.workers.dev` in `apps/web/.env`. `localhost:5173` is already allowed.
- Optional: `VITE_CORS_PROXY` sets a CORS proxy for v86's fetch-based network.

Without `VITE_NET_RELAY`, v86 falls back to its fetch-based network, which only handles HTTP.

## Kiroween 2026

Submitted to the Resurrection category: dead operating systems, booted again in a modern browser.

### How Kiro is used

Everything Kiro used to build NecrOS is committed in [`.kiro/`](.kiro):

| Path | What it does |
|---|---|
| `.kiro/steering/product.md`, `tech.md` | Always loaded. The product rules (machine facts only from `os.ts`, the no-scroll machine page) and the stack (Svelte 5 runes, `#lib/*.ts` imports, deploy command, no lint) |
| `.kiro/steering/design.md` | Loaded only when a file under `apps/web/src` is in play. Pulls in `DESIGN.md` with a file reference and requires the antislop skills |
| `.kiro/skills/` | The [antislop](https://github.com/miqdadbadjuber/anti-slop) skills (MIT), vendored so anyone who clones the repo gets the same UI rules and contrast checker |
| `.kiro/hooks/check-on-save.json` | After the agent saves a file in `apps/web/src`, runs svelte-check so errors show up on the edit that caused them |
| `.kiro/hooks/no-em-dash.json` | When the agent tries to finish, scans the source and docs and sends it back if an em dash slipped in |
| `.kiro/hooks/deploy-guard.json` | Blocks the plain pnpm deploy script, which hangs on an approval prompt in an agent shell, and points the agent to `pnpm exec alchemy deploy --yes` |
| `.kiro/agents/necros.json` | A custom agent for Kiro CLI with the steering, `DESIGN.md`, and skills preloaded, and shell permissions limited to check, build, and read-only git |
| `.kiro/specs/mourning-archive/` | Requirements (EARS), design, and tasks for the spooky redesign described in `DESIGN.md` |

Run the agent with `kiro-cli chat --agent necros`.

## Pre-existing work and third-party code

Built during the Kiroween 2026 submission period. The following existed before and is used under its own license:

- The project started from a SvelteKit + Alchemy static-site starter template (monorepo layout, `alchemy.run.ts`, build config).
- [v86](https://github.com/copy/v86) (BSD-2-Clause): the emulator package and the runtime files in `apps/web/static/v86/` (`v86.wasm`, SeaBIOS, VGA BIOS). License copy in `apps/web/static/v86/LICENSE`.
- Disk images in `apps/web/static/images/` come from the v86 project's image collection. Each machine's license is listed on its label and in `apps/web/src/lib/os.ts`.
- Libraries: xterm.js (MIT) for the serial console, Lucide (ISC) for control icons, Gelasio and DM Mono (SIL OFL 1.1) via Fontsource.

## License

The NecrOS source is MIT licensed, see [`LICENSE`](LICENSE). Third-party files keep their own licenses listed above.
