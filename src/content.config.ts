import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    desc: z.string(),
    date: z.date(),
  }),
});
const archive = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/archive",
  }),
  schema: z.object({
    title: z.string(),
    desc: z.string(),
    date: z.date(),
  }),
});

export const collections = { blog, archive };
