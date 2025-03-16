// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  site: "https://lel.nekoweb.org",
  server: { host: true },
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
  // image: {
  //   remotePatterns: [{ pathname: "/**" }],
  // },
  experimental: {
    // svg: true,
    contentIntellisense: true,
    clientPrerender: true,
  },
});
