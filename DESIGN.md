---
version: 1
name: NecrOS
description: "A warm archive of old operating systems that still boot, one browser tab per machine."
dial: ENERGY 2 / RHYTHM 2 / MOTION 1
theme: light only

colors:
  paper: "#fbf8f1"
  surface: "#f3eee2"
  line: "#e4dccb"
  control-border: "#8f846f"
  text: "#2a2520"
  muted: "#6b6255"
  amber: "#ffb000"
  amber-hover: "#ffc233"
  amber-ink: "#8a5a00"
  stage: "#111111"
  stage-text: "#a3a3a3"

typography:
  serif:
    fontFamily: "Georgia, 'Gelasio Variable', 'Times New Roman', serif"
    use: "headings, the wordmark, machine names"
    source: "Georgia from the system; Gelasio (OFL-1.1, metric-compatible with Georgia) is self-hosted as the fallback"
  sans:
    fontFamily: "Verdana, 'DejaVu Sans', 'Bitstream Vera Sans', Tahoma, Geneva, sans-serif"
    use: "body text, labels, controls"
    source: "system fonts only, nothing downloaded"
  mono:
    fontFamily: "DM Mono, ui-monospace, monospace"
    use: "numbers inside collection labels, and the serial console"
  display: { family: serif, size: 48px, weight: 700, lineHeight: 1.05, letterSpacing: 0 }
  title: { family: serif, size: 24px, weight: 700, lineHeight: 1.15, letterSpacing: 0 }
  body: { size: 16px, weight: 400, lineHeight: 1.5, letterSpacing: 0 }
  small: { size: 14px, weight: 400, lineHeight: 1.45, letterSpacing: 0 }
  label-field: { size: 13px, weight: 500, lineHeight: 1.4, letterSpacing: 0 }
  label-number: { family: mono, size: 13px, weight: 400, lineHeight: 1.4 }

spacing:
  base: 4px
  scale: [4, 8, 12, 16, 24, 32, 48, 72]

radius:
  screen: 2px
  badge: 4px
  control: 6px
  label: 8px

shadows: none

motion:
  fast: 120ms
  base: 200ms
  boot: 400ms
  easing: "cubic-bezier(0.2, 0, 0, 1)"

breakpoints: [560px, 900px]
---

# NecrOS design direction

Reading this as: a catalog of runnable old operating systems for hackathon judges and retro-computing fans, in a Victorian mourning-archive style built on early-2000s CSS layouts, dial ENERGY 2 / RHYTHM 2 / MOTION 1.

Era reference: 2001 to 2005, the early CSS corporate web, with the CSS Zen Garden as the touchstone. The site takes that era's shapes (a centered fixed-width column, Georgia headings over Verdana text, dotted rules inside content) and keeps modern accessibility: 16px body text, AA contrast, visible focus, and keyboard support.

NecrOS is a mourning archive that lets you wake the dead. Every machine in it is a dead technology: its makers stopped shipping it, and most of its users moved on. The site treats each one the way a Victorian family treated the departed: a black-edged memorial card, a name and dates, a one-line epitaph, and a candle. Then the visitor does what no mourner could, and brings it back.

The spookiness is ceremonial, not cartoon. It comes from three things that each do a job:

1. Mourning stationery: black-edged cards and a cross-ruled heading, the real visual language of 19th-century grief, which marks every machine as dead before it boots.
2. Candlelight: the amber accent becomes the candle flame. It already marks the action that brings a machine back and the light that says it is alive.
3. A two-register voice: headings, empty states, and page intros speak as the keeper of the archive; controls, errors, and data stay literal so nobody has to decode a pun to use the site.

There are no ghosts, skulls, bats, cobwebs, dripping fonts, purple-and-green Halloween colors, or fog. Those are decoration with no job, and they would turn a working catalog into a costume.

One owner requirement is fixed and not up for redesign: the site is light mode only. There is no dark theme and no theme toggle. The emulator screen stays black because it is a monitor, not a theme.

The owner first chose Open Runde, dropped it for looking too round, and then chose the early CSS era, which brings Georgia and Verdana. For Kiroween 2026 the owner then asked for a spooky design; the mourning archive is that direction. It replaces the earlier rule that the theme lived only in the home headline.

## Decisions and why

Each line is the reason for one major decision (R-31).

- Mourning archive tone: the product is a collection of dead technologies brought back, so the interface borrows from how people have always marked the dead, and the boot becomes the moment of return. This fits the Kiroween Resurrection category without inventing anything about the machines.
- Black-edged labels: Victorian mourning cards and envelopes carried a black border, and its width signalled how recent the loss was. Giving every label a black edge is one gesture that reads as "this is dead" at a glance, and it costs no new color.
- No ghosts or Halloween palette: a skull or a purple glow would say "Halloween template", not "archive". The theme has to survive a judge asking what each element is for.
- Warm paper background: catalog cards and old manuals were printed on cream stock, and warm paper keeps the amber accent from looking like a tech-brand color.
- Amber accent, read as candlelight: amber phosphor was the color of many CRT monitors, and amber is also the color of a candle flame. The same accent ties the frame of the site to the screens inside it and acts as the vigil light beside each machine.
- Early CSS era: most machines in the catalog date from 1979 to 2004, so the site looks like it was built by a curator when the last of them shipped. Linux 6.8 (2024) is the one modern machine, kept as a reference point.
- Georgia for headings, Verdana for text: they were the default pairing of careful 2000s web design, and both were drawn for screen legibility. Verdana's large x-height keeps labels readable at small sizes.
- DM Mono for label numbers: years and sizes stay even in a monospaced face.
- Small, soft radii: printed labels have slightly eased corners, and large radii would turn them into app bubbles.
- No shadows: labels are printed cards lying on a table, so nothing floats. Elevation is expressed with a border and a surface tint.
- ENERGY 2: the home page needs one strong moment for judges, and the rest stays calm like a gallery.
- RHYTHM 2: catalog rows share one label format on purpose, with the home page breaking the pattern once for the featured machine.
- MOTION 1: hover and state changes only, plus the single boot moment, because powering on a machine is the one event worth animating. The boot moment gets one flicker, like a tube warming up, because it is the resurrection itself.
- Lucide icons on machine controls: every control on the machine page already has a text label, and the icon only helps the eye find it in a dense toolbar. Each glyph names its action (save, keyboard, monitor, hard drive), so relevance is literal. Icons never appear on the catalog, the home page, or labels.
- GitHub and X marks in the footer: the owner asked for social links with icons. The marks are the services' own logos, so they name the destination; each link also carries an `aria-label`. The GitHub mark also sits on the notice bar's issue button, because that button opens GitHub. These and the notice bar's close icon are the only icons outside the machine page.
- No dot on the notice bar: the owner's reference had a colored dot before the message, but a dot reads as a live status light, and the notice has no live state to show.
- Notice bar above the header: the owner wants visitors to report problems. It is a static line of text, not a moving marquee, because MOTION 1 allows no loops.

## Color

| Token | Hex | Use |
|---|---|---|
| paper | `#fbf8f1` | Page background |
| surface | `#f3eee2` | Collection label fill, pressed controls, selected option |
| line | `#e4dccb` | Dividers and label borders only. Never behind text, never as a control border |
| control-border | `#8f846f` | Borders of inputs, selects, and outline buttons |
| text | `#2a2520` | Body text, headings, focus ring |
| muted | `#6b6255` | Label field names, secondary text, hints |
| amber | `#ffb000` | Fill only: the Boot button, the download progress bar, the Running state mark, the Disk busy light, the selected layout tab underline, the serial console cursor. Always carries `text` on top when it holds text |
| amber-hover | `#ffc233` | Hover fill for amber buttons |
| amber-ink | `#8a5a00` | Amber-colored text and state markers on paper, such as the year in a label heading or "Running" in the header |
| stage | `#111111` | Emulator stage and serial console background |
| stage-text | `#a3a3a3` | Text on the stage before boot, and the empty serial console message |

The serial console also uses `#e8e8e8` for its output text and `amber-ink` for selected text. These live inside the terminal, like the screen effects, so they are not part of the site palette.

Rules:

- The active palette is paper, text, and amber. Everything else is a tint or shade of those three.
- Amber appears at the moments that matter: the action that powers a machine on, the progress of that boot, and the marks that say the machine is running or reading its disk. It is not used on links, icons, dividers, or decoration.
- Every amber mark sits next to a word that says the same thing ("Running", "Disk busy"), so the color is never the only signal.
- Amber on paper is 1.73:1, so amber never carries meaning on paper. Use `amber-ink` for amber text.
- Links are `text` with an underline. Hover thickens the underline.

## Typography

- Georgia (Gelasio as fallback) for headings, the wordmark, and machine names, at weight 700.
- Georgia italic, weight 400, for epitaphs on labels and for keeper lines under headings. Italic serif is how inscriptions and memorial cards set their verses, and it separates the keeper voice from literal text without a new color.
- Verdana for body text, labels, and controls. Verdana has only regular and bold, so weights 500 and above render bold.
- No negative letter-spacing. Early CSS type was set at its default spacing.
- DM Mono only for numbers inside collection labels (year, download size) and inside the serial console.
- Sentence case everywhere: headings, buttons, labels, menu items. No all-caps labels and no wide letter-spacing.
- Body text is 16px. Nothing interactive is smaller than 14px.

## Identity motif: the memorial label

Every machine has one label, styled as a mourning card. The label and the label is the thing a visitor learns to recognize. It appears in the catalog, as the featured machine on the home page, on the machine page before boot (holding the Boot button, then the download progress, then any error), and in compressed form in the header while the machine runs: name, Type badge, and year.

Format, top to bottom:

1. Name, Georgia 700.
2. The epitaph: the one-sentence note from `os.ts`, in Georgia italic, `muted`. It is still the real description of the machine, set in the voice of an inscription.
3. Field rows, one field per row, field name in `muted` Verdana, value in `text`:
   - Year (DM Mono)
   - Type (CLI or Desktop)
   - Made by
   - License
   - Download (DM Mono for the number). Disks loaded in parts read `146 MB disk`, with `Only the parts it reads are downloaded.` on a second line in `muted`.

Rules:

- Every value comes from `os.ts`. Nothing on a label is invented. A field with no data is left out, not filled with a placeholder.
- The label is a `surface` card with the `label` radius and a mourning edge: a 3px `text` border on all four sides, the black border of Victorian mourning stationery. When a label links to a machine, hover turns its fill `paper` (the edge stays black) and pressing it turns the fill `line`. The name sits above a short cross-ruled divider (a 1px `text` rule, 32px wide, with a 1px gap and a second rule below it), the double rule used on memorial cards. Field rows are separated by 1px dotted `control-border` rules, the era's divider.
- The epitaph is 16px Georgia italic, the `body` size, so the italic stays readable.
- The Year field is labelled `Born`, because the year in `os.ts` is the release year. There is no death date: `os.ts` does not record when each system stopped being maintained, and the label never invents one.
- The candle: on the machine page before boot, the Boot button is the label's only lit element. Nothing else on the label uses amber.
- The Type value is the only badge on the site. CLI is `amber` text on `text` fill; Desktop is `text` on `amber` fill. Both are 8.28:1.

## Layout

- Content sits in one centered column, at most 960px wide, the fixed-width shape of early CSS sites.
- The site header and footer have no divider lines. Whitespace separates them from the content.
- Every site page (not the machine page) starts with a full-width notice bar, 44px tall, with `text` fill and `paper` text at 14px (the `small` size; nothing interactive goes below it). It holds three parts:
  1. The message. Desktop: `Found a problem with NecrOS? Tell us which machine and browser you used.` Below 560px: `Found a problem?`
  2. The action: an outline button with a `paper` border, the 16px GitHub mark, and `Open an issue`. It opens a new issue on GitHub in a new tab. Hover fills it `paper` with `text` label. The visible box is 28px tall; its hit area spans the full 44px of the bar.
  3. A 44px close button with an X icon and the accessible name `Close notice`, pinned to the right edge.
- Closing the notice stores `necros:notice:v1` in local storage, and an inline script in `app.html` hides the bar before first paint on later visits, so the page never jumps. Changing the notice text means bumping the key version.
- The header nav holds Catalog, Help, and About. The footer holds the credit line, the GitHub and X links, and a second nav: About, Help, Privacy, Terms, Licenses.
- Text pages (About, Help, Privacy, Terms, Licenses) use one prose column, at most 64ch wide, with Georgia `title` section headings. Privacy and Terms show their last-updated date in `muted` under the heading.
- The licenses page lists machines and libraries in tables with dotted row rules, the same divider as the label. Below 560px each row stacks, and each value is prefixed with its column name in `muted`.
- The home page has one focal point: a featured machine shown with its full label and its Boot action, under the line `The oldest grave in the archive`. The owner picks the featured machine; until then it is the oldest machine in the catalog. Its Boot button links to `/os/{slug}?boot=1`, which opens the machine page and boots it right away.
- Below the featured machine, a timeline lists every machine by year. It is one row on desktop, four columns below 900px, and a vertical list below 560px.
- The catalog is a grid of labels sorted by year, oldest first: two columns on desktop, one below 900px. Labels share one size so the rows read like a row of headstones, and years read as a timeline. The page heading stays `Catalog` (it is navigation); the intro under it carries the theme.
- The machine page fills the window with no page scroll. It has four rows:
  1. Header: the back link, the compressed label, the running controls (Send Ctrl+Alt+Del, Fullscreen, Restart), and the state.
  2. Sub-bar, only while running: layout tabs, activity meters (MIPS and the Disk light), saved-state controls, screen effect, drive noise, sound, and volume.
  3. Stage: the screen, the serial console, or both side by side, chosen by the layout tabs.
  4. Hint line, only while running: the machine's first-step hint, or the mouse-capture message.
- Below 560px: Send Ctrl+Alt+Del, Fullscreen, Drive noise, the activity meters, the header state, and the header year are hidden. Restart, the layout tabs, saved state, screen effect, and sound stay. In the split layout the console moves below the screen.
- Touch targets are at least 44px tall.

## Components

Buttons

- Primary: `amber` fill, `text` label, `control` radius. Used only for Boot.
- Quiet: transparent, `muted` label that turns `text` on hover, `surface` fill when pressed. Used for machine controls. A toggled quiet button keeps the `surface` fill and `text` label; a selected layout tab adds a 3px `amber` underline.
- Outline: `control-border` border, `text` label. Used for secondary actions such as Try again.
- Disabled controls use 50% opacity and `cursor: not-allowed`.
- Machine controls carry a 16px Lucide icon before the label, 18px on the Boot and Try again buttons. The icon is `aria-hidden`. The only icon-only control is Delete saved state, which has an `aria-label`.

Activity meters

- MIPS: the emulator's speed, a DM Mono number followed by `MIPS`, in `muted`.
- Disk light: an 8px square with the `badge` radius and the word `Disk`. Idle, it is `paper` with a `control-border` edge. While the disk is read, it fills `amber` and the word changes to `Disk busy` in `text`. Shown only for machines with a hard disk, CD, or filesystem.

Download progress

- A 6px bar on `line`, filled with `amber`, with the progress sentence below it in `muted`. The bar is a `progressbar` with its value; the sentence is a `status`.

Saved state

- `Save state`, `Load state`, and an icon-only Delete button, followed by one status line in `muted`. States are stored in the browser (IndexedDB), one per machine.
- Load state is disabled until a state exists. Delete appears only when a state exists.

Preferences

- The chosen screen effect is remembered in the browser and applies to every machine.

Form controls

- Select and range inputs use the `control-border` border and the `control` radius.
- The screen effect select drops the browser's native arrow for a 16px chevron in `muted`, which turns `text` on hover with the border. It is 44px tall, with the visible label `Screen effect` in `muted` to its left. Below 900px the label is visually hidden but stays the accessible name.
- The volume slider uses `amber-ink` as its accent color.

Focus

- 2px solid `text` outline with a 2px offset on every focusable element. The outline is never removed. On the notice bar the outline is `paper`.

Emulator stage

- `stage` background with 16px padding around the screen. The screen corners use the `screen` radius.
- Screen effects: Sharp (default), CRT, and Green phosphor. The phosphor effect uses the green of a P1 monochrome monitor. It lives inside the emulated screen, so it sits outside the site palette.

Serial console

- `stage` background, DM Mono 13px, `#e8e8e8` text, amber cursor, `amber-ink` selection.
- The pane header (`Serial console` and `Clear console`) sits on `paper`, separated from the screen by a 1px `line` rule.

## Motion

- Hover and pressed states: color transitions at `fast`.
- State changes in the header: `base`.
- The boot moment: when a machine starts running, the screen fades in from black over `boot` with one flicker, like a tube warming: opacity 0, then 0.85, a dip to 0.55, then 1. That is one flash, under the WCAG limit of three per second. The state mark changes to Running. Nothing else on the page moves.
- The download progress bar grows at `base`, linear, because it tracks a real quantity.
- No loops, no scroll animation, no floating elements.
- Under `prefers-reduced-motion: reduce`, all transitions are instant, including the boot fade and its flicker.

## Voice and UX writing

The writer is the keeper of the archive: plain, exact, a little solemn, and fond of the dead machines. The copy explains what a thing is and what to do next, in the fewest words that stay clear. It never sells.

Two registers

| Register | Where | Voice |
|---|---|---|
| Keeper | Page intros, section headings on the home page, empty states, the 404 page, the boot overlay line, the footer credit | Speaks of the machines as the departed and of booting as waking them. One theme phrase per block, never stacked. |
| Literal | Buttons, controls, navigation, field names, errors, progress, hints, legal pages, help steps | Plain words from the terminology table. No theme words at all. |

A visitor must be able to use every control without understanding a single theme line.

Principles

- Name the machine. "Boot FreeDOS" beats "Start".
- Lead with the action, then the object. Buttons are a verb plus a noun when there is room.
- Say what happened and what to do next. Every error and empty state ends with the next step.
- Use real numbers from the data, with units. "1.4 MB", never "small".
- Present tense, active voice, second person when addressing the visitor.
- Sentence case. No exclamation marks. No emoji.
- Theme lines belong to the keeper register only. Controls, errors, and data never carry them.

Terminology (use one word per concept)

| Use | Instead of | Meaning |
|---|---|---|
| machine | VM, instance, emulator | One catalog entry the visitor can run |
| boot | launch, start, spin up | Power on a machine |
| restart | reboot, reset | Power cycle a running machine |
| catalog | library, gallery | The list of machines |
| label | card, tile | The memorial label motif |
| serial console | log, terminal, TTY | The panel that shows serial port output |
| screen effect | filter, shader | Sharp, CRT, Green phosphor |
| drive noise | disk sound, HDD sound | The synthesized drive sound |
| saved state | snapshot, save file | A machine's memory and disks, stored in the browser so it can resume later |

Machine states (header)

| State | Copy |
|---|---|
| Idle | Powered off |
| Loading | Booting |
| Running | Running |
| Error | Stopped |

The states stay literal because they are status, read at a glance and announced to screen readers.

Keeper lines (the full set; add new ones here before using them)

| Where | Copy |
|---|---|
| Home headline | `Dead operating systems, switched back on.` |
| Home intro | `NecrOS keeps the operating systems the world buried. Pick one, and it wakes in this tab, with its own screen, sound and serial console.` |
| Home featured line | `The oldest grave in the archive` |
| Home timeline heading | `Laid to rest, {first year} to {last year}` |
| Catalog intro | `{n} machines rest here, oldest first. Each one wakes in its own page.` |
| Machine page overlay, above the label before boot | `{machine name} is resting. Boot it to bring it back.` Shown only while powered off, in `stage-text` on `stage` (7.49:1), centered. |
| 404 heading | `This grave is empty.` with body `The address may have a typo, or the machine was moved. The catalog lists every machine that rests here.` |
| Footer credit | `NecrOS, kept by Fahmi Lukis.` |
| Empty catalog | `The archive is empty. Add a machine to src/lib/os.ts and it rests here.` |

Patterns

- Boot button: `Boot {machine name}`. The download size is not repeated on the button; the label's Download field above it already shows it.
- Download progress: `Downloading kolibri.img: 0.4 of 1.4 MB`. When the total is unknown: `Downloading kolibri.img`.
- Download error: `Could not download {file}. Check your connection, then try again.` Button: `Try again`.
- Start error: `{machine name} stopped while starting: {reason}.` Button: `Try again`.
- Empty serial console: `Nothing here yet. {machine name} has not written to its serial port. Click here to type into it.`
- Mouse captured: `Mouse captured. Press Esc to release it.`
- Hints are one sentence that tells the visitor the first thing to do: `Log in as guest. No password needed.`
- Control labels: `Restart`, `Send Ctrl+Alt+Del`, `Fullscreen`, `Clear console`. Toggles keep one label and show their state with `aria-pressed` and a pressed fill: `Mute sound`, `Drive noise`.
- Layout tabs: `Screen`, `Screen and console`, `Console`.
- Saved state messages: `Saving state`, `Saved (12 MB).`, `Loading saved state`, `Loaded saved state.`, `Deleting saved state`, `Deleted saved state.`, `Not enough browser storage for this state.` Failures: `Could not save the state. Try again.`, `Could not load the saved state. Try again.`, `Could not delete the saved state. Try again.` When idle, the line shows when the state was saved: `Saved {local date and time}`.
- Disk light: `Disk`, and `Disk busy` while reading.
- Empty catalog: see the keeper lines.
- Catalog count: see the catalog intro in the keeper lines.
- Notice bar: `Found a problem with NecrOS? Tell us which machine and browser you used.` (`Found a problem?` on phones), action `Open an issue`, close button `Close notice`.
- Social links: `Fahmi Lukis on GitHub`, `Fahmi Lukis on X` (accessible names and tooltips).

Words and patterns to avoid

- Marketing vocabulary: seamless, powerful, revolutionary, next-generation, unlock, experience (as a verb).
- Cartoon horror and puns anywhere: haunted, spooky, boo, spoopy, "from beyond", "ghost in the machine", "it's alive". The keeper is solemn, not jokey.
- Theme words in the literal register: no "Raise FreeDOS" on the Boot button, no "Resurrecting..." in place of a progress sentence.
- Vague results: "Something went wrong", "No data", "Loading..." with no subject.
- Em dashes. Use a period, comma, colon, or parentheses.

## Accessibility

Contrast ratios, computed from the tokens above:

| Pair | Ratio | WCAG |
|---|---|---|
| text on paper | 14.31:1 | AAA |
| text on surface | 13.11:1 | AAA |
| muted on paper | 5.65:1 | AA |
| muted on surface | 5.18:1 | AA |
| amber-ink on paper | 5.59:1 | AA |
| amber-ink on surface | 5.12:1 | AA |
| text on amber | 8.28:1 | AAA |
| text on amber-hover | 9.41:1 | AAA |
| stage-text on stage | 7.49:1 | AAA |
| console text (`#e8e8e8`) on stage | 15.41:1 | AAA |
| control-border on paper | 3.47:1 | Passes 3:1 for UI components |
| paper on text (notice bar) | 14.31:1 | AAA |
| mourning edge (`text`) on paper | 14.31:1 | Decorative, but well above 3:1 |
| amber on paper | 1.73:1 | Never used for text or meaning |
| line on paper | 1.29:1 | Decorative dividers only |

Requirements

- Every control is reachable and operable by keyboard, with the focus ring above.
- Every control has an accessible name. Icon-only controls carry an `aria-label`.
- State is never shown by color alone. Running uses the word and the amber mark together.
- Machine state, download progress, saved-state results, and the hint line are announced through `role="status"`. Boot errors use `role="alert"`.
- Below 560px the header state is hidden; the stage itself shows the label and Boot button while powered off, so the visitor still sees the state.
- `prefers-reduced-motion` turns off every transition.
- The page allows zoom. No `maximum-scale` or `user-scalable=no`.
