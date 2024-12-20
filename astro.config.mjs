// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  prefetch: true,
  site: "https://lel.nekoweb.org",
  vite: {
    plugins: [
      Icons({
        compiler: "astro",
      }),
    ],
  },
  integrations: [
    mdx(),
    sitemap({
      xslURL: "/sitemap.xsl",
    }),
  ],
  experimental: {
    svg: true,
  },
});
