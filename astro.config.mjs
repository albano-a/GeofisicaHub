import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";

import preact from "@astrojs/preact";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://geofisicahub.me/",
  integrations: [preact(), partytown({
    config: {
      forward: ["dataLayer.push"],
    },
  }), mdx()],
});