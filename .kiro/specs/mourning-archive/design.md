# Design: mourning archive

The visual and voice rules live in `DESIGN.md` (identity motif, typography, motion, keeper lines). This document covers how they map onto the code.

## Overview

The change touches presentation only. No data, routes, or emulator behavior change. `os.ts` keeps its fields; the label renames how it presents `year`, it does not change the data.

## Components and files

| File | Change |
|---|---|
| `apps/web/src/lib/CollectionLabel.svelte` | Mourning edge (3px `text` border), cross-ruled divider under the name, epitaph in Georgia italic, `Year` field renamed `Born` |
| `apps/web/src/routes/+layout.svelte` | Import `@fontsource-variable/gelasio/wght-italic.css` next to the upright face |
| `apps/web/src/routes/(site)/+page.svelte` | Keeper lines: intro, featured line, timeline heading, empty state |
| `apps/web/src/routes/(site)/os/+page.svelte` | Keeper catalog intro and empty state |
| `apps/web/src/routes/(site)/+layout.svelte` | Keeper footer credit |
| `apps/web/src/routes/+error.svelte` | 404 heading and body from the keeper lines; other errors stay literal |
| `apps/web/src/lib/Emulator.svelte` | Overlay keeper line above the label before boot; boot flicker keyframes on `.screen.live` |
| `DESIGN.md` | Already updated; it is the source of truth for copy and tokens |

## Boot flicker

`.screen.live` currently runs `transition: opacity var(--boot)`. Replace the transition with a one-shot keyframe animation:

```css
@keyframes wake {
	0% { opacity: 0; }
	45% { opacity: 0.85; }
	65% { opacity: 0.55; }
	100% { opacity: 1; }
}

.screen.live {
	animation: wake var(--boot) var(--ease) 1 both;
}
```

The global `prefers-reduced-motion` rule in `app.css` already forces `animation-duration: 0ms`, which lands on the final keyframe (`both` fill mode), so reduced motion gets full opacity at once. One dip in 400ms is a single flash, below the WCAG 2.3.1 limit of three per second.

## Mourning edge sizing

A 3px border adds 2px per side compared with the current 1px `line` border. Reduce the label padding by 2px on each side so labels keep their size and the catalog grid does not reflow.

## Accessibility

- The divider is decorative: a pseudo-element, so screen readers skip it.
- `Born` is still the `<dt>` for the year, so the field reads as "Born, 1979".
- Keeper lines are plain text in existing headings and paragraphs; no ARIA changes.

## Testing

- `pnpm check` and `pnpm build`.
- The Kiro hooks in `.kiro/hooks/` run `check` on each save and block em dashes before the agent finishes.
- Manual check by the owner in a browser at 375px, 768px, and 1280px, with reduced motion on and off.
