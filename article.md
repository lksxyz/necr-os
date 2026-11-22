A 1985 GEM desktop, a multi-user DOS, Plan 9, a LISP in 512 bytes, and a roguelike that fits in a boot sector. All of them boot in a browser tab, on a page that takes one click.

That is [NecrOS](https://necros.kuncen.workers.dev): a catalog of twenty operating systems running on [v86](https://github.com/copy/v86), an x86 emulator compiled to WebAssembly. The site is static SvelteKit, deployed to Cloudflare, and the whole thing was built in [Kiro](https://kiro.dev) for Kiroween 2026.

This post covers what the project is, how the emulator part works, how I picked machines that are safe to redistribute, and how the Kiro setup (steering, skills, hooks, a custom agent, and a spec) turned "make it look spooky" into something shippable.

**Try it:** https://necros.kuncen.workers.dev
**Source:** https://github.com/lksxyz/necr-os

## What NecrOS is

Twenty machines, oldest first:

- FreeGEM (1985), the GEM desktop on FreeDOS
- PC-MOS/386 (1987), a multi-user DOS
- MS-DOS 4 (1988), built from the source Microsoft published in 2024
- Oberon (1990), where any text on screen is a command
- FreeDOS (1998)
- NewOS (2001), the kernel Haiku forked
- Sanos (2001), a server kernel that runs Windows PE programs
- JX (2002), an operating system written in Java
- Plan 9 (2002), the Bell Labs successor to Unix
- Linux 2.6 (2003)
- KolibriOS (2004), a desktop in assembly on one floppy
- Mobius (2004)
- HelenOS (2006), a multiserver microkernel
- MikeOS (2007), a 16-bit teaching OS with its own BASIC
- bootOS, bootBASIC and bootRogue (2019), each in a 512-byte boot sector
- sectorforth (2020) and SectorLISP (2021), a Forth and a LISP in 512 bytes
- Linux 6.8 (2024), kept as a reference point for how far things have come

Every machine has a page that fills the window with no page scroll. Hit Boot and the tab downloads a disk image and starts the machine. A toolbar adds restart, Ctrl+Alt+Del, fullscreen, a serial console, screen effects (Sharp, CRT, green phosphor), a MIPS counter, synthesized drive noise, and save/restore of machine state in IndexedDB.

The serial console is not decoration. Linux 6.8 runs its shell there, and NewOS, JX, Plan 9 and HelenOS write their boot logs to it.

The stack is a pnpm monorepo:

```plaintext
apps/web          SvelteKit app (adapter-static, prerendered)
apps/relay        Wisp relay Worker for networked machines
alchemy.run.ts    Deploys both Workers
```

No application backend. The only server code is the relay.

## The catalog is one TypeScript file

The rule I set early: every fact about a machine comes from `apps/web/src/lib/os.ts`. No facts hardcoded in templates. The catalog page, the home timeline, the licenses page, and the prerendered `/os/:slug` pages all read the same array.

```ts
{
  slug: 'freedos',
  name: 'FreeDOS',
  kind: 'cli',
  year: 1998,
  maker: 'FreeDOS Project',
  license: 'GPL',
  source: 'https://www.freedos.org/',
  note: 'Open-source DOS that runs MS-DOS programs. Ships with vim and a few games.',
  hint: 'Pick a language at the menu, or press Esc to reach the A:\> prompt.',
  engine: 'v86',
  boot: {
    fda: { url: `${IMAGES}freedos722.img`, size: 737280 },
    memoryMB: 32
  }
}
```

That single source of truth matters more when an agent writes the UI. "Never invent years, makers, licenses, sizes, or statistics" is a steering rule, and it works because there is exactly one place to look. fast-check property tests guard the file: unique URL-safe slugs, plausible years, https source links, positive image sizes, and no em dashes in any text field.

## Choosing machines that are safe to ship

v86's demo page lists more than a hundred entries, including Windows 95, BeOS and QNX. Being hosted there does not make an image redistributable. Copying a disk image onto your own site makes you the distributor, and the license inside the image is what counts.

So every machine went through the same checks before it went into `os.ts`:

- **An open license or an explicit release.** MS-DOS 4 is MIT since 2024, PC-MOS/386 GPLv3 since 2017, Plan 9 MIT since 2021. Windows, BeOS and the QNX demo stayed out.
- **The license file, not a summary of it.** House, an operating system written in Haskell, looked fine until its `LICENSE` file described the GUI toolkit as "freeware for academic use only". It is not in the catalog.
- **The image itself.** Where upstream publishes the same file, I compared hashes. PC-MOS/386, HelenOS, bootOS, bootBASIC and bootRogue match byte for byte. The MS-DOS 4 floppy holds files dated May 2024, so it was built from Microsoft's MIT source, not copied from a 1988 retail disk.
- **GPL source.** Each GPL machine links to its source on its label and on the licenses page.
- **Size.** Under 25 MB where possible, which is also Cloudflare's per-file limit for static assets. HelenOS lands at 24.6 MiB.

Then each new image was booted headless in Node with the same v86 settings the site uses, reading the VGA text planes and the serial port to confirm the machine reaches the state its hint describes. That caught a real bug: JX panics with 64 MB of memory and boots with 128 MB.

## Making a 200 MB machine feel instant

FreeGEM's disk is 209,715,200 bytes. Downloading that before the desktop appears would kill the demo.

v86 supports split hard disks: `partSize` in `os.ts` cuts the disk into independently fetched chunks. FreeGEM uses 256 KB parts, so the emulator downloads only the regions the system actually reads. The label says so: `200 MB disk`, with `Only the parts it reads are downloaded.` underneath. Everything else is small enough to load whole, down to the 512-byte boot sectors.

Two of the Linux machines have networking. The guest's TCP/IP stack runs in the browser, and `apps/relay/worker.ts` is a Wisp v1 relay that opens the outbound TCP sockets the guest asks for. It limits each connection to 16 streams, blocks ports 25, 465, and 587, and refuses private addresses and `.local` hosts. The relay URL is baked into the static build at deploy time, and the relay checks the `Origin` header against an allowlist.

## The look: a Victorian mourning archive

The brief was "spooky" for the Kiroween Resurrection category. The obvious read is Halloween: purple, green, ghosts, drips. That reads as a template, not a product.

Instead I wrote [`DESIGN.md`](https://github.com/lksxyz/necr-os/blob/main/DESIGN.md), a 361-line design direction with tokens, typography, motion, voice rules, and the reason behind each decision. The theme became a mourning archive:

- Each machine is a memorial card: 3px black edge, a cross-ruled divider under the name, an italic epitaph, and a `Born` field.
- No death date. The data has no such date, and inventing one to finish the design would be a lie.
- Amber is the only accent. It reads as candlelight and as amber phosphor at the same time.
- One animation: a single flicker when a machine starts, like a tube warming up. `prefers-reduced-motion` lands on full opacity with no animation.
- Two registers of voice. Page intros and empty states speak as the archive keeper ("The oldest grave in the archive", "This grave is empty."). Buttons, errors, status, and legal pages stay literal, because nobody should have to decode a joke to restart a machine.

Era-wise the site borrows from early CSS design around 2001 to 2005: Georgia headings, Verdana body text, a centered column, dotted rules. Modern accessibility underneath: 16px body text, AA contrast, visible focus, keyboard support, light mode only.

## How Kiro was set up

Everything Kiro used is committed in `.kiro/`, so a clone reproduces the same environment.

| Kiro feature | What it does here |
|---|---|
| Steering | `product.md` and `tech.md` always load. `design.md` loads only when a file under `apps/web/src` is in play, and it pulls in `DESIGN.md` |
| Skills | The antislop skills, vendored so the UI rules and contrast checker travel with the repo |
| Hooks | Type-check on save, run the catalog property tests when `os.ts` changes, block em dashes before finishing, block a deploy command that hangs |
| Custom agent | `kiro-cli chat --agent necros` starts with the steering, the design doc, and the skills preloaded; shell access is limited to check, build, and read-only git, with destructive commands denied |
| Spec | `.kiro/specs/mourning-archive/` holds requirements, design, tasks, and a delivery gate for the redesign |

### Steering: rules the agent cannot forget

Steering is the highest-leverage part. `tech.md` is short and absolute:

```md
- `apps/web` is SvelteKit 3 with Svelte 5 runes, `adapter-static`, every route prerendered. No backend or API.
- Import local modules through the `#lib/*` alias with the file extension, for example `#lib/os.ts`.
- Validate with `pnpm check`, `pnpm test` and `pnpm build`. Do not run lint.
```

`product.md` holds the two fixed requirements: the machine page fills exactly 100vw by 100dvh with no scroll, and every machine fact comes from `os.ts`.

`design.md` is a file-matched steering doc, so it only loads when UI files are open:

```md
---
inclusion: fileMatch
fileMatchPattern: "apps/web/src/**"
---
```

It points at `DESIGN.md` with a file reference and requires the antislop skills for UI work. That is how "keeper lines come only from the table in DESIGN.md" and "no em dashes in UI text" stay true across dozens of edits.

### Hooks: the three that earned their place

Hooks are where Kiro stops being a chat window and starts behaving like a build system.

**Type-check on save.** After the agent saves any `.svelte`, `.ts`, or `.css` file under `apps/web/src`, run svelte-check. Type and template errors surface on the edit that caused them, not thirty edits later.

```json
{
  "version": "v1",
  "hooks": [
    {
      "name": "Type-check the web app after edits",
      "trigger": "PostFileSave",
      "matcher": "apps/web/src/.*\\.(svelte|ts|css)$",
      "action": { "type": "command", "command": "pnpm --filter @hackathon/web check" },
      "timeout": 180
    }
  ]
}
```

A sibling hook does the same for data: saving `os.ts` runs the property tests, so a bad slug or image size fails on the edit that introduced it.

**Block em dashes before finishing.** `DESIGN.md` and the antislop rules ban the em dash in UI text and docs. On the `Stop` trigger, a small script scans the source and docs, and if it finds one, sends the agent back with the file and line list. This is a copy rule enforced by a machine instead of by my memory.

**Guard the deploy command.** `pnpm deploy` waits for an approval prompt that a non-interactive agent shell cannot answer, so it hangs. Passing `--yes` through pnpm does not reach Alchemy either. A `PreToolUse` hook on shell calls inspects the command and blocks a real `pnpm deploy` invocation, then tells the agent to run `pnpm exec alchemy deploy --yes`.

The matcher matters: the script only fires when `pnpm deploy` is an actual invocation (start of the command, or after `;`, `&&`, `||`, `|`, or a newline). A commit message or README line that merely mentions the command is left alone. A naive substring matcher would block the docs edit that quotes the command, and that kind of false positive is how people end up turning hooks off.

### Spec-driven redesign

The spooky redesign started as a design document, then became a spec in `.kiro/specs/mourning-archive/`:

- `requirements.md` in EARS style
- `design.md` mapping each requirement to a file and a change
- `tasks.md` as a checklist, each task pointing back at its requirement
- `delivery-gate.md` recording the antislop gate result

A sample requirement:

> **WHEN** a machine enters the Running state, **THE SYSTEM SHALL** fade the screen in over the `boot` duration (400ms) through opacity 0, 0.85, 0.55, and 1.
>
> **WHILE** `prefers-reduced-motion: reduce` is set, **THE SYSTEM SHALL** show the screen at full opacity with no fade and no flicker.

Written that precisely, the acceptance criteria are testable by reading code. The tasks file is just as concrete:

```md
- [x] 3. Apply the keeper voice
  - [x] 3.1 Home page: intro, featured line, timeline heading, empty state
    - _Requirements: 2.1, 2.4_
  - [x] 3.2 Catalog page: intro and empty state
    - _Requirements: 2.1, 2.4_
```

The commit history follows the tasks: `task 3.1`, `task 3.2`, and so on. On a project with more than 80 commits, nearly all from one day, that trace is the difference between a reviewable history and a pile of vibes.

The design spec also caught things I would have missed. The new 3px border is 2px thicker per side than the old 1px border, so the spec says to cut the label padding by 2px per side, otherwise the catalog grid reflows. The divider is a pseudo-element so screen readers skip it. `Born` stays the `<dt>` for the year, so it reads as "Born, 1985".

### Skills: fixing generic AI design

The first UI pass looked like generic AI output. The fix was not a better prompt, it was a written direction plus a checklist. The [antislop](https://github.com/miqdadbadjuber/anti-slop) skills are vendored in `.kiro/skills/` (MIT), and the design work runs through them: contrast checks, motion limits, no gradients or glows, no invented numbers, every element has a job.

The delivery gate result for the redesign is in the repo: no FAIL, one PARTIAL waiting on my own browser check at 375px, 768px, and 1280px. That is a better review artifact than "looks good to me".

## Deployment

[Alchemy](https://alchemy.run) v2 deploys both Workers from one file. The static site is built with `VITE_NET_RELAY` injected, then uploaded as Worker static assets. The relay is deployed separately.

```sh
pnpm install
pnpm dev          # local
pnpm check        # svelte-check
pnpm test         # property tests for os.ts
pnpm build        # static output
pnpm exec alchemy deploy --yes
```

No lint step, on purpose. The steering file says so, and the hooks run the checks that actually catch breakage.

## What I learned

**A design document beats "make it clean".** "Clean" produces the average of everything. A document with decisions and reasons produces consistency, and it gives the agent something to be wrong against.

**Hooks are worth it for checks you would repeat by hand.** Type-check on save and the em dash gate removed two whole classes of cleanup.

**Keep facts in one place.** `os.ts` is the contract between the data, the pages, the labels, and the agent.

**Read the license file, then hash the image.** "Open source" on a project page is a claim. The license text and a byte-for-byte match with upstream are evidence.

**Write requirements the code can satisfy literally.** EARS phrasing forces you to name the state, the trigger, and the observable result. Vague requirements produce vague UI.

**Enforce copy rules mechanically.** A style rule that only lives in a prompt decays. A hook that blocks the Stop event does not.

**WebAssembly emulation is further along than I expected.** A 1985 desktop, Plan 9, and a 2024 Linux kernel in the same tab, with save and restore, on a static site.

## Try a machine

The live site is https://necros.kuncen.workers.dev. Start with bootBASIC: type `print 2+2` and press Enter, in a language that fits in 512 bytes. Then open SectorLISP and type `(CONS (QUOTE A) (QUOTE B))`. Finish with Linux 6.8 and run `udhcpc -i eth0`, `wget`, or `ip a` to see a 2024 kernel use real TCP through the relay.

## Credits

NecrOS is MIT licensed. The emulator is [v86](https://github.com/copy/v86) (BSD-2-Clause). Disk images are unmodified copies from v86's image collection, and each machine's license is shown on its label and on the licenses page with a source link. The project started from a SvelteKit and Alchemy static-site starter. Fonts: Gelasio and DM Mono (SIL OFL 1.1). Icons: Lucide (ISC). The antislop skills are MIT.

Built for Kiroween 2026, Resurrection category.
