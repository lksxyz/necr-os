# NecrOS

NecrOS is a catalog of old operating systems that boot in a browser tab. Each machine runs in [v86](https://github.com/copy/v86), an x86 emulator compiled to WebAssembly, with its own screen, sound, saved states and serial console.

Live site: https://necros.kuncen.workers.dev

The site is static SvelteKit: every route is prerendered and there is no API. It lives in a pnpm monorepo and deploys to Cloudflare with Alchemy v2. The design direction is in [`DESIGN.md`](DESIGN.md).

## The catalog

| Machine | Year | License | Download |
|---|---|---|---|
| FreeGEM | 1985 | GPL | 200 MB disk, loaded in parts |
| PC-MOS/386 | 1987 | GPLv3 | 1.4 MB |
| MS-DOS 4 | 1988 | MIT | 1.4 MB |
| Oberon | 1990 | BSD-style | 24 MB |
| FreeDOS | 1998 | GPL | 0.7 MB |
| NewOS | 2001 | BSD-style | 1.4 MB |
| Sanos | 2001 | BSD-style, GPL network drivers | 1.4 MB |
| JX | 2002 | GPLv2 | 1.4 MB |
| Plan 9 | 2002 | MIT | 15 MB |
| Linux 2.6 | 2003 | GPL | 6.2 MB |
| KolibriOS | 2004 | GPL | 1.4 MB |
| Mobius | 2004 | MIT | 1.4 MB |
| HelenOS | 2006 | BSD-3-Clause, GPL boot loader | 25 MB |
| MikeOS | 2007 | BSD-style, some programs GPLv3 | 3.2 MB |
| bootOS | 2019 | BSD-2-Clause | 360 KB |
| bootBASIC | 2019 | BSD-2-Clause | 512 bytes |
| bootRogue | 2019 | BSD-2-Clause | 512 bytes |
| sectorforth | 2020 | MIT | 512 bytes |
| SectorLISP | 2021 | ISC | 512 bytes |
| Linux 6.8 | 2024 | GPL | 9.6 MB |

[`apps/web/src/lib/os.ts`](apps/web/src/lib/os.ts) is the source of truth. Every year, maker, license and size on the site comes from there, and this table is a copy of it.

## Layout

```
apps/web          SvelteKit app (adapter-static, one HTML file per route)
apps/web/static   v86 runtime files in v86/, disk images in images/
apps/relay        Wisp relay Worker that gives networked machines real TCP connections
alchemy.run.ts    Cloudflare deployment: the static site and the relay Worker
```

## Routes

- `/`: the featured machine (the oldest in the catalog) and a timeline by year
- `/os`: the catalog, oldest first
- `/os/:slug`: the machine page. It fills the window with no page scroll, and `?boot=1` boots the machine on load
- `/help`, `/about`, `/privacy`, `/terms`, `/licenses`

## Commands

```sh
pnpm install
pnpm dev            # local dev server
pnpm check          # svelte-check
pnpm test           # vitest, with fast-check property tests for os.ts
pnpm build          # static output in apps/web/build
pnpm alchemy profile edit --add Cloudflare   # one-time login
pnpm deploy         # build and deploy to Cloudflare
pnpm destroy
```

## Adding a machine

1. Check the license. The image must be redistributable: an open-source license, or a release that its rights holder made free to share. Abandonware does not qualify.
2. Put the disk image in `apps/web/static/images/`. Cloudflare serves files up to 25 MiB. Larger hard disk images must be split into parts, with `partSize` set on the `hda` entry, so the machine downloads only what it reads.
3. Add an entry to `osList` in `apps/web/src/lib/os.ts`: year, maker, license, source URL, note, first-step hint and boot config. For a GPL machine, the source URL must lead to its source code.
4. Boot it locally and confirm the hint matches what the machine shows first.

The catalog, the home timeline, the licenses page and the prerendered `/os/:slug` page pick it up from there.

## Deployment

`pnpm deploy` asks for approval in a terminal. In a non-interactive shell, run `pnpm exec alchemy deploy --yes`. It deploys two Workers: `necros` (the static site, served as Worker static assets) and `necros-relay`.

## Networking

Machines with `network: true` (Linux 2.6, Linux 6.8) can open real TCP connections through the `necros-relay` Worker.

- The relay address is set once in `alchemy.run.ts` (`NET_RELAY`) and passed to the site build as `VITE_NET_RELAY`.
- The relay only accepts connections from origins listed in `ALLOWED_ORIGINS` in `apps/relay/worker.ts`.
- For `pnpm dev`, put `VITE_NET_RELAY=wisps://necros-relay.kuncen.workers.dev` in `apps/web/.env`. `localhost:5173` is already allowed. The `wisps://` scheme selects v86's Wisp backend; `wss://` selects its wsproxy backend, which speaks a different protocol.
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
- Disk images in `apps/web/static/images/` are unmodified copies from the v86 image collection. Where upstream publishes the same file, the copy was checked against it: PC-MOS/386, HelenOS, bootOS, bootBASIC and bootRogue match byte for byte. The MS-DOS 4 image holds files built in 2024 from Microsoft's MIT-licensed source. Each machine's license is in `os.ts` and on `/licenses`, and GPL machines link to their source.
- Libraries: xterm.js (MIT) for the serial console, Lucide (ISC) for control icons, Gelasio and DM Mono (SIL OFL 1.1) via Fontsource.

## License

The NecrOS source is MIT licensed, see [`LICENSE`](LICENSE). Third-party files keep their own licenses listed above.
