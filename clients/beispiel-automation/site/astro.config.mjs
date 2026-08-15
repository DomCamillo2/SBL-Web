import { defineConfig } from "astro/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteDir = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(siteDir, "..");
const archetypeRoot = path.resolve(siteDir, "../../../archetypes/service-local-b2b");

process.env.SBL_CLIENT_ROOT = clientRoot;

export default defineConfig({
  output: "static",
  compressHTML: true,
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
      },
    },
    server: {
      fs: {
        allow: [clientRoot, archetypeRoot, path.resolve(siteDir, "../../..")],
      },
    },
  },
});
