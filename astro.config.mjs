// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  site: "https://lel.nekoweb.org",
  output: "static",
  server: { host: true },

  integrations: [mdx(), sitemap({ xslURL: "/sitemap.xsl" })],

  vite: {
    build: {
      target: "esnext",
      minify: "esbuild",
      cssCodeSplit: true,
      assetsInlineLimit: 0,
    },
    optimizeDeps: {
      include: [],
    },
    esbuild: {
      treeShaking: true,
      drop: ["console", "debugger"],
    },
    plugins: [Icons({ compiler: "astro" })],
  },

  experimental: {
    contentIntellisense: true,
    clientPrerender: true,
    // svg: true,
  },
});
