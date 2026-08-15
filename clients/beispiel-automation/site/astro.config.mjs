import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteDir = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(siteDir, "..");
const archetypeRoot = path.resolve(siteDir, "../../../archetypes/service-local-b2b");
const uiRoot = path.resolve(siteDir, "../../../packages/ui");

process.env.SBL_CLIENT_ROOT = clientRoot;

export default defineConfig({
  site: "https://example.com",
  output: "static",
  compressHTML: true,
  integrations: [sitemap()],
  vite: {
    resolve: {
      alias: {
        "@sbl-web/archetype-service-local-b2b/styles.css": path.join(
          archetypeRoot,
          "src/styles/archetype.css",
        ),
        "@sbl-web/archetype-service-local-b2b/lib": path.join(archetypeRoot, "src/lib"),
        "@sbl-web/archetype-service-local-b2b/components": path.join(
          archetypeRoot,
          "src/components",
        ),
        "@sbl-web/archetype-service-local-b2b/routes": path.join(
          archetypeRoot,
          "src/routes",
        ),
        "@sbl-web/ui/css": path.join(uiRoot, "src/css"),
        "@sbl-web/ui/js": path.join(uiRoot, "src/js"),
        "@sbl-web/ui/components": path.join(uiRoot, "src/components"),
        "@sbl-web/ui/assets": path.join(uiRoot, "src/assets"),
      },
    },
    server: {
      fs: {
        allow: [clientRoot, archetypeRoot, uiRoot, path.resolve(siteDir, "../../..")],
      },
    },
  },
});
