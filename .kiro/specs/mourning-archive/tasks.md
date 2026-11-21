# Implementation plan: mourning archive

- [x] 1. Self-host Gelasio italic
  - Import `@fontsource-variable/gelasio/wght-italic.css` in `apps/web/src/routes/+layout.svelte`
  - _Requirements: 4.4_

- [x] 2. Turn the collection label into a memorial label
  - [x] 2.1 Replace the 1px `line` border with a 3px `text` border and cut padding by 2px per side
    - _Requirements: 1.1_
  - [x] 2.2 Add the cross-ruled divider under the name as a decorative pseudo-element
    - _Requirements: 1.2_
  - [x] 2.3 Set the note in Georgia italic, weight 400, `muted`
    - _Requirements: 1.3_
  - [x] 2.4 Rename the `Year` field to `Born`; render no death date
    - _Requirements: 1.4_
  - [x] 2.5 Confirm the Boot button is the only amber element on the pre-boot label
    - _Requirements: 1.5_

- [x] 3. Apply the keeper voice
  - [x] 3.1 Home page: intro, featured line, timeline heading, empty state
    - _Requirements: 2.1, 2.4_
  - [x] 3.2 Catalog page: intro and empty state
    - _Requirements: 2.1, 2.4_
  - [x] 3.3 Footer credit in the site layout
    - _Requirements: 2.1_
  - [x] 3.4 404 page heading and body; keep non-404 errors literal
    - _Requirements: 2.1, 2.5_
  - [x] 3.5 Machine page overlay line above the label before boot
    - _Requirements: 2.1_
  - [x] 3.6 Audit buttons, states, hints, help, and legal pages for theme words
    - _Requirements: 2.2, 2.3_

- [x] 4. Add the boot flicker
  - Replace the opacity transition on `.screen.live` in `Emulator.svelte` with the one-shot `wake` keyframes
  - Confirm reduced motion lands on full opacity with no animation
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 5. Verify
  - [x] 5.1 Run `pnpm check` and `pnpm build`
    - _Requirements: 4.5_
  - [x] 5.2 Check contrast of every new pair with the antislop contrast script
    - _Requirements: 4.3_
  - [x] 5.3 Run the antislop Delivery Gate and record it in `delivery-gate.md`
    - _Requirements: 4.1, 4.2, 4.5_
  - [ ] 5.4 Deploy with `pnpm exec alchemy deploy --yes`
    - _Requirements: 4.5_
