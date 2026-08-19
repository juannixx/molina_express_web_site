import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// PUBLIC_SITE_URL/PUBLIC_BASE_PATH permitem o preview em GitHub Pages
// (https://juannixx.github.io/molina_express_web_site). Sem as envs, build normal.
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? "https://mexpress.uk.com",
  base: process.env.PUBLIC_BASE_PATH ?? "/",
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
