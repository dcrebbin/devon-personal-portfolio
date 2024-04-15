import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import react from "@astrojs/react";
import astroI18next from "astro-i18next";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  output: "server",
  adapter: vercel({
    includeFiles: ["./public/locales/en/translation.json", "./public/locales/hi/translation.json", "./public/locales/zh/translation.json"],
    webAnalytics: {
      enabled: true,
    },
  }),
  integrations: [tailwind(), react(), mdx(), astroI18next()],
});
