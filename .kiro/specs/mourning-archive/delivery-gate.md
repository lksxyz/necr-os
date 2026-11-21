# antislop Delivery Gate: mourning archive

Run on 21 November 2026 against the changes in `tasks.md`. Evidence comes from `pnpm check`, `pnpm build`, the contrast script in `.kiro/skills/antislop-human/`, and source inspection. The owner's AGENTS.md rules out browser verification by the agent, so every click-through item below is checked in code and needs the owner's browser pass.

## Hard Gate

- R-02 PASS: the `no-em-dash` hook script finds no em dash in `apps/web/src`, `apps/relay`, `README.md`, `DESIGN.md`, `.kiro/steering`, or `.kiro/specs`.
- R-03 PASS by code: the label keeps its outer size (3px edge, padding cut by 2px per side), so the catalog grid does not reflow. No new fixed widths. Owner to confirm at 375px.
- R-17, R-18, R-36, R-38 PASS: no numbers, people, or claims added. `Born` shows the release year from `os.ts`; no death date is invented.
- R-23 PASS: no logo, avatar, or image added.
- R-24, R-26 PASS: no new links or controls. The 404 page keeps its working `/os` link.
- R-25 PASS: `muted` on paper 5.65:1 and on surface 5.18:1 (keeper lines, epitaph); `stage-text` on stage 7.49:1 (resting line); `paper` on `text` 14.31:1 (notice bar).
- R-27 PASS: empty catalog states on home and catalog use the keeper line and still name the file to edit.
- R-32, R-39 PASS: no focus styles removed. Notice bar text back to 14px, the minimum for interactive text in DESIGN.md.
- R-34 PASS: light mode only, no toggle.
- R-35 PARTIAL: build and check pass; the owner's browser click-through is still needed.
- R-37 PASS: direction is DESIGN.md, the mourning archive section.
- R-39 motion PASS: the boot flicker plays once and the global `prefers-reduced-motion` rule sets its duration to 0ms, landing on full opacity.

## Purpose-Gate

- R-01 PASS: no gradient or glow. No new color; the edge uses `text`.
- R-06 PASS: Georgia italic has a written reason in DESIGN.md (inscription voice) and stays at 16px.
- R-19 PASS: one animation, the boot, which DESIGN.md names as the only event worth animating. One flash, under the WCAG limit of three per second.

## Liveliness

- Dials ENERGY 2 / RHYTHM 2 / MOTION 1, unchanged and consistent: one new motion, at boot only.
- Identity motif: the memorial label (black edge, cross-rule, italic epitaph), repeated on every machine.
- One accent: amber stays on the Boot button, progress, and running marks.

## Craftsmanship and Quality Locks

- C-1 PASS: every change traces to a line in DESIGN.md.
- R-16 PASS: no marketing words. Theme words appear only in the keeper slots listed in DESIGN.md; a grep of buttons, states, hints, help, and legal pages finds none.
- R-20 PASS: swapping the name would still leave a black-edged memorial catalog, which is specific to this product's story.

Result: no FAIL. One PARTIAL (R-35) waits on the owner's browser check.
