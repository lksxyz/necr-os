## Inspiration

I wanted a way to try old operating systems without installing them on my machine. Turns out, finding and running them isn't that simple. You need the right disk image, emulator settings, BIOS, and sometimes a guide from 2005 buried somewhere on the internet.

Most people probably give up before they even get to see a command prompt.

So I built **NecrOS**. Pick a machine, hit Boot, and it starts right in your browser. That's it.

## What It Does

NecrOS is a collection of old operating systems you can run in a browser tab. No installation, no virtual machine setup, no messing around with disk images yourself.

Each OS has its own page that takes up the whole window. Hit **Boot**, and v86 downloads the disk image and starts the machine.

The catalog has 20 machines, from FreeGEM (1985) to Linux 6.8 (2024), just to see how far we've come. In between are PC-MOS/386, MS-DOS 4, Oberon, FreeDOS, NewOS, Sanos, JX (an OS written in Java), Plan 9, Linux 2.6, KolibriOS, Mobius, HelenOS and MikeOS. There are also five programs that each fit in a single 512-byte boot sector: bootOS, bootBASIC, bootRogue, sectorforth and SectorLISP.

Adding another machine is pretty simple: add an entry to `os.ts` and provide its disk image.

Once a machine is running, you can:

- Boot, restart, send Ctrl+Alt+Del, and go fullscreen.
- Click the screen to capture your mouse. Press Esc to release it.
- Switch between the graphical screen and serial console, or show both side by side. Linux 6.8 runs its shell on the serial port, and NewOS, JX, Plan 9 and HelenOS write their boot logs there.
- Save a machine's state in your browser and pick up where you left off, even after closing the tab.
- Switch between Sharp, CRT, and Green Phosphor screen effects.
- Enable synthesized drive noise when the disk is being read. There's also a disk activity light and a speed indicator in MIPS.
- Get online using Linux 2.6 and Linux 6.8. This works through a small Wisp relay running on Cloudflare Workers, which opens real TCP connections. Mail ports and private networks are blocked to prevent abuse.

For larger disks, I split the images into smaller parts. FreeGEM's 200 MB disk doesn't need to be downloaded all at once. The emulator only fetches the 256 KB parts it actually reads, so booting takes seconds instead of minutes.

### The Look: A Mourning Archive

I wanted NecrOS to feel a little spooky, but not like a Halloween website. No ghosts, skulls, or purple-green colors.

Each machine is presented like a Victorian memorial card. Black borders, a double line under the name, an italic description, and a "Born" field showing its release year.

There's deliberately no death date. I don't want to invent one just to complete the design.

The color is amber, partly because of candlelight and partly because old CRT monitors have that nostalgic glow.

There's only one animation: a quick flicker when a machine boots, like an old tube monitor warming up. Reduced motion users just get the static version.

I also tried to keep the writing from getting in the way. The archive itself has some personality ("The oldest grave in the archive", "This grave is empty."), but buttons, errors, and status messages are straightforward. You shouldn't have to figure out a joke just to restart a machine.

## How We Built It

The project uses:

- **SvelteKit + Svelte 5** for the frontend. Everything is statically prerendered, so there's no application backend.
- **v86** to emulate the machines in WebAssembly.
- **xterm.js** for the serial console.
- **IndexedDB** to save machine states, and localStorage for screen preferences.
- **Vitest + fast-check** for property tests on the catalog data in `os.ts`.
- **Cloudflare Workers** for hosting and the Wisp networking relay.
- **Alchemy** to deploy both workers from one file.

I built the whole thing using **Kiro CLI**. The `.kiro/` directory in the repository contains the actual configuration, skills, hooks, agent, MCP setup and specs I used along the way.

Here's how I used the different Kiro features:

| Feature | How I Used It |
|---|---|
| Kiro CLI | Pretty much everything happened in Kiro CLI chats, from the first SvelteKit page to deployment. I stayed in the terminal while Kiro wrote code, ran `pnpm check`, `pnpm test` and `pnpm build`, committed, pushed, and deployed. |
| Steering | `product.md` and `tech.md` load all the time. `design.md` only loads when working on files under `apps/web/src`, and it references `DESIGN.md`. One important rule was that all OS information must come from `os.ts`. This kept Kiro from making up release years or licenses. |
| Skills | I used [antislop](https://github.com/miqdadbadjuber/anti-slop) for UI changes and kept the skills in `.kiro/skills/`. The first UI version looked like generic AI-generated stuff, which I didn't like. The design document and skills helped keep things consistent. |
| MCP | `.kiro/settings/mcp.json` registers the antislop contrast checker as an MCP server, so color pairs get checked against WCAG instead of eyeballed. |
| Hooks | I set up four hooks: run svelte-check after file changes, run the catalog property tests when `os.ts` changes, block em dashes, and prevent the wrong deployment command from running. The deploy guard is my favorite. `pnpm deploy` waits for an approval prompt that Kiro's shell can't answer, so it just hangs. The hook catches this and tells Kiro to use `pnpm exec alchemy deploy --yes` instead. It even caught a README mention of the command once, so I had to make the check smarter. |
| Custom Agent | `.kiro/agents/necros.json` loads the project steering, `DESIGN.md`, and skills. Its shell access is limited to checking, building, and read-only git commands, and destructive commands like `rm -rf` and force pushes are denied. Running `kiro-cli chat --agent necros` gives me an agent that already knows the project rules. |
| Spec | `.kiro/specs/mourning-archive/` contains the EARS requirements, design, and tasks for the redesign. I started with the visual direction in `DESIGN.md`, then had Kiro turn it into a spec and work through the tasks. Antislop checks are recorded in `delivery-gate.md`. |

I didn't use powers. Didn't really need them for this project.

## Challenges We Ran Into

- **Making the machines feel real.** Getting sound, graphics, and networking to work meant dealing with emulation and browser APIs. It wasn't just a matter of putting an emulator inside a web page.
- **OS licenses.** Being on v86's demo page doesn't make an image safe to redistribute, so Windows, BeOS and QNX stayed out. For every machine I read the actual license file, and that's how House (an OS written in Haskell) got dropped: its GUI toolkit is "for academic use only". Where upstream publishes the same image, I compared hashes, and PC-MOS/386, HelenOS, bootOS, bootBASIC and bootRogue match byte for byte. The licenses page lists every machine with a source link, including the source for the GPL ones.
- **Checking that each machine actually boots.** Before adding a machine, I booted it headless in Node with the same v86 settings as the site, then read the screen and serial output to confirm the hint matches what shows up first. That caught JX crashing with 64 MB of memory, so it now gets 128 MB.

## Accomplishments That We're Proud Of

- Getting machines from decades ago to boot in a normal browser tab. Seeing a 1985 GEM desktop, Plan 9, and a LISP in 512 bytes running next to Linux 6.8 from 2024 is still pretty wild.
- Getting Linux machines online through my own Cloudflare relay worker.
- Saving machine states so you can close the tab and come back later without starting over.
- Getting the mourning archive design to work without sacrificing contrast, keyboard navigation, or reduced motion support.
- Actually using the `.kiro` setup throughout development. The steering, skills, hooks, agent, and spec weren't just files added for the submission.

## What We Learned

- A proper design document makes a big difference. Telling AI to "make it clean" usually gets you something generic. Giving it actual design decisions and reasons works much better.
- Hooks are useful for repetitive things you don't want to keep checking manually.
- Keep facts in one place. In this project, `os.ts` is the source of truth for machine information.
- "Open source" on a project page is a claim. The license file and a matching hash are the proof.
- Browser emulation is surprisingly capable. I didn't expect WebAssembly to handle this as well as it does.

## What's Next for NecrOS

- Add more operating systems to the catalog, as long as their licenses allow it.
- Experiment with simulating the look and feel of old PCs and laptops.
