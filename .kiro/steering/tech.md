---
inclusion: always
---

# Tech

- pnpm monorepo with two apps: `apps/web` and `apps/relay`.
- `apps/web` is SvelteKit 3 with Svelte 5 runes, `adapter-static`, every route prerendered. No backend or API.
- Import local modules through the `#lib/*` alias with the file extension, for example `#lib/os.ts`.
- `apps/relay/worker.ts` is a Cloudflare Worker that relays guest TCP (Wisp v1) for machines with `network: true`.
- Deploy with Alchemy v2 (`alchemy.run.ts`): `pnpm deploy`.
- Validate with `pnpm check` and `pnpm build`. Do not run lint.
