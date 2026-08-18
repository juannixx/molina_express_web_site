import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const page = z.object({ title: z.string(), description: z.string() });

export const collections = {
  cities: defineCollection({ loader: glob({ pattern: "**/*.md", base: "./src/content/cities" }), schema: page }),
  sectors: defineCollection({ loader: glob({ pattern: "**/*.md", base: "./src/content/sectors" }), schema: page }),
  services: defineCollection({ loader: glob({ pattern: "**/*.md", base: "./src/content/services" }), schema: page }),
};
