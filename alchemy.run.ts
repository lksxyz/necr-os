import * as Alchemy from "alchemy";
import * as Cloudflare from "@alchemy.run/cloudflare";
import * as Effect from "effect/Effect";

// Public address of the relay Worker below, baked into the site at build time.
const NET_RELAY = "wisps://necros-relay.kuncen.workers.dev";

export default Alchemy.Stack(
  "Hackathon",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    // Builds the SvelteKit app (adapter-static) and serves apps/web/build
    // as Worker static assets. No Worker code is uploaded.
    const web = yield* Cloudflare.Website.StaticSite("Web", {
      name: "necros",
      command: `env VITE_NET_RELAY=${NET_RELAY} pnpm --filter @hackathon/web build`,
      outdir: "apps/web/build",
      memo: {
        include: ["apps/web/**", "pnpm-lock.yaml"],
      },
      dev: {
        command: "pnpm --filter @hackathon/web dev",
      },
      assets: {
        notFoundHandling: "404-page",
      },
    });

    // Wisp relay: lets the emulated OS open real TCP connections.
    // Its URL must match NET_RELAY above.
    const relay = yield* Cloudflare.Worker("Relay", {
      name: "necros-relay",
      main: "./apps/relay/worker.ts",
    });

    return { url: web.url, relay: relay.url };
  }),
);
