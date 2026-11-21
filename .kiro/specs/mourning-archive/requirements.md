# Requirements: mourning archive

## Introduction

NecrOS is entered in the Kiroween 2026 Resurrection category. The owner asked for a spooky design. DESIGN.md now defines it as a Victorian mourning archive: black-edged memorial labels, candlelight amber, a one-flicker boot, and a two-register voice (keeper and literal). This spec covers implementing that direction in `apps/web` without breaking the fixed requirements: light mode only, the machine page fills 100vw by 100dvh with no scroll, and every machine fact comes from `apps/web/src/lib/os.ts`.

## Requirement 1: memorial label

**User story:** As a visitor, I want each machine to look like a memorial card, so that I can tell at a glance that these are dead systems waiting to be woken.

### Acceptance criteria

1. THE SYSTEM SHALL render every label with a 3px `text` border on all four sides and the `label` radius.
2. THE SYSTEM SHALL render a cross-ruled divider (two 1px `text` rules, 32px wide, 1px apart) between the machine name and the epitaph.
3. THE SYSTEM SHALL render the note from `os.ts` as the epitaph in Georgia italic, weight 400, `muted`.
4. THE SYSTEM SHALL label the year field `Born` and SHALL NOT render any death date.
5. WHEN a label is shown on the machine page before boot, THE SYSTEM SHALL render the Boot button as the only amber element on the label.

## Requirement 2: keeper voice

**User story:** As a visitor, I want the archive to speak in a solemn voice in its intros, so that the theme is clear without getting in the way of the controls.

### Acceptance criteria

1. THE SYSTEM SHALL use exactly the keeper lines listed in DESIGN.md for the home intro, featured line, timeline heading, catalog intro, machine overlay line, 404 page, footer credit, and empty catalog.
2. THE SYSTEM SHALL keep every button, control, navigation item, field name, error, progress sentence, hint, help step, and legal page in the literal register, with no theme words.
3. THE SYSTEM SHALL keep the machine states as `Powered off`, `Booting`, `Running`, and `Stopped`.
4. WHEN the catalog in `os.ts` is empty, THE SYSTEM SHALL show the keeper empty-catalog line on the home page and the catalog page.
5. WHEN a visitor opens an address that does not exist, THE SYSTEM SHALL show the `This grave is empty.` 404 page with a link to the catalog.

## Requirement 3: the boot flicker

**User story:** As a visitor, I want the moment a machine wakes to feel like a tube warming up, so that the resurrection has one memorable beat.

### Acceptance criteria

1. WHEN a machine enters the Running state, THE SYSTEM SHALL fade the screen in over the `boot` duration (400ms) through opacity 0, 0.85, 0.55, and 1.
2. THE SYSTEM SHALL play the flicker once per boot and SHALL NOT loop it.
3. WHILE `prefers-reduced-motion: reduce` is set, THE SYSTEM SHALL show the screen at full opacity with no fade and no flicker.
4. THE SYSTEM SHALL NOT animate any other element on the page during the boot moment.

## Requirement 4: nothing else breaks

**User story:** As the owner, I want the redesign to keep every existing guarantee, so that the submission stays accessible and working.

### Acceptance criteria

1. THE SYSTEM SHALL keep the site in light mode only, with no theme toggle.
2. THE SYSTEM SHALL keep the machine page at 100vw by 100dvh with no page scroll at every width.
3. THE SYSTEM SHALL keep every text pair at WCAG AA contrast or better, using only the tokens in DESIGN.md.
4. THE SYSTEM SHALL self-host Gelasio italic as the fallback for Georgia italic.
5. WHEN the change is complete, THE SYSTEM SHALL pass `pnpm check` and `pnpm build`, and the antislop Delivery Gate SHALL report no FAIL.
