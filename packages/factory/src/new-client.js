import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const THIN_PAGES = {
  "index.astro": `---
import HomePage from "@sbl-web/archetype-service-local-b2b/routes/HomePage.astro";
---
<HomePage />
`,
  "vorgehen.astro": `---
import MethodPage from "@sbl-web/archetype-service-local-b2b/routes/MethodPage.astro";
---
<MethodPage />
`,
  "kontakt.astro": `---
import ContactPage from "@sbl-web/archetype-service-local-b2b/routes/ContactPage.astro";
---
<ContactPage />
`,
  "danke.astro": `---
import ThanksPage from "@sbl-web/archetype-service-local-b2b/routes/ThanksPage.astro";
---
<ThanksPage />
`,
  "404.astro": `---
import NotFoundPage from "@sbl-web/archetype-service-local-b2b/routes/NotFoundPage.astro";
---
<NotFoundPage />
`,
  "impressum.astro": `---
import ImpressumPage from "@sbl-web/archetype-service-local-b2b/routes/ImpressumPage.astro";
---
<ImpressumPage />
`,
  "datenschutz.astro": `---
import PrivacyPage from "@sbl-web/archetype-service-local-b2b/routes/PrivacyPage.astro";
---
<PrivacyPage />
`,
};

export async function newClient(slug, { domain } = {}) {
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("slug required (kebab-case), e.g. baeckerei-mueller");
  }

  const target = path.join(ROOT, "clients", slug);
  try {
    await fs.access(target);
    throw new Error(`Client already exists: ${target}`);
  } catch (e) {
    if (e.code !== "ENOENT" && e.message?.includes("already exists")) throw e;
    if (e.code !== "ENOENT") {
      /* continue if ENOENT */
    }
  }

  const siteUrl = domain
    ? domain.startsWith("http")
      ? domain
      : `https://${domain}`
    : `https://${slug}.example.com`;
  const host = siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  await fs.mkdir(path.join(target, "site/src/pages"), { recursive: true });
  await fs.mkdir(path.join(target, "site/public"), { recursive: true });
  await fs.mkdir(path.join(target, "assets"), { recursive: true });
  await fs.mkdir(path.join(target, "mockups"), { recursive: true });

  // BRIEF from example with slug rewrite
  let brief = await fs.readFile(
    path.join(ROOT, "templates/client-brief/BRIEF.example.yaml"),
    "utf8",
  );
  brief = brief
    .replaceAll("beispiel-automation-tuebingen", slug)
    .replaceAll("beispiel-automation", slug)
    .replaceAll("example.com", host)
    .replaceAll("https://example.com", siteUrl);
  // ensure site_url line
  if (!/^hosting:[\s\S]*site_url:/m.test(brief)) {
    brief = brief.replace(
      /hosting:\n/,
      `hosting:\n  site_url: ${siteUrl}\n`,
    );
  }
  // New clients start legal flags false until filled — don't copy null locks from example
  brief = brief.replace(/\nlocks:[\s\S]*$/m, `
locks: {}
`);
  await fs.writeFile(path.join(target, "BRIEF.yaml"), brief);

  await fs.copyFile(
    path.join(ROOT, "templates/client-brief/DESIGN.template.md"),
    path.join(target, "DESIGN.md"),
  );
  let tokens = await fs.readFile(
    path.join(ROOT, "templates/client-brief/tokens.example.json"),
    "utf8",
  );
  tokens = tokens.replaceAll("beispiel-automation-tuebingen", slug).replaceAll(
    "beispiel-automation",
    slug,
  );
  await fs.writeFile(path.join(target, "tokens.json"), tokens);

  // Placeholder CONTENT — run draft next
  await fs.writeFile(
    path.join(target, "CONTENT.yaml"),
    `# Run: pnpm factory draft ${slug}\nslug: ${slug}\nlocale: de-DE\npages: []\n`,
  );

  await fs.writeFile(
    path.join(target, "site/package.json"),
    JSON.stringify(
      {
        name: `@sbl-web/${slug}`,
        version: "0.1.0",
        private: true,
        type: "module",
        scripts: {
          dev: "astro dev --host 0.0.0.0 --port 4321",
          build: "astro build",
          preview: "astro preview --host 0.0.0.0 --port 4321",
        },
        dependencies: {
          "@astrojs/sitemap": "^3.3.1",
          "@sbl-web/archetype-service-local-b2b": "workspace:*",
          "@sbl-web/ui": "workspace:*",
          astro: "^5.13.2",
        },
      },
      null,
      2,
    ) + "\n",
  );

  await fs.writeFile(
    path.join(target, "site/astro.config.mjs"),
    `import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteDir = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(siteDir, "..");
const archetypeRoot = path.resolve(siteDir, "../../../archetypes/service-local-b2b");
const uiRoot = path.resolve(siteDir, "../../../packages/ui");

process.env.SBL_CLIENT_ROOT = clientRoot;

export default defineConfig({
  site: "${siteUrl}",
  output: "static",
  compressHTML: true,
  integrations: [sitemap()],
  vite: {
    resolve: {
      alias: {
        "@sbl-web/archetype-service-local-b2b/styles.css": path.join(archetypeRoot, "src/styles/archetype.css"),
        "@sbl-web/archetype-service-local-b2b/lib": path.join(archetypeRoot, "src/lib"),
        "@sbl-web/archetype-service-local-b2b/components": path.join(archetypeRoot, "src/components"),
        "@sbl-web/archetype-service-local-b2b/routes": path.join(archetypeRoot, "src/routes"),
        "@sbl-web/ui/css": path.join(uiRoot, "src/css"),
        "@sbl-web/ui/js": path.join(uiRoot, "src/js"),
        "@sbl-web/ui/components": path.join(uiRoot, "src/components"),
        "@sbl-web/ui/assets": path.join(uiRoot, "src/assets"),
      },
    },
    server: {
      fs: { allow: [clientRoot, archetypeRoot, uiRoot, path.resolve(siteDir, "../../..")] },
    },
  },
});
`,
  );

  await fs.writeFile(
    path.join(target, "site/tsconfig.json"),
    JSON.stringify(
      {
        extends: "astro/tsconfigs/strict",
        include: [".astro/types.d.ts", "**/*"],
        exclude: ["dist"],
      },
      null,
      2,
    ) + "\n",
  );
  await fs.writeFile(
    path.join(target, "site/src/env.d.ts"),
    '/// <reference types="astro/client" />\n',
  );

  for (const [name, body] of Object.entries(THIN_PAGES)) {
    await fs.writeFile(path.join(target, "site/src/pages", name), body);
  }

  await fs.writeFile(
    path.join(target, "site/public/robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap-index.xml\n`,
  );

  // reuse demo OG placeholder
  try {
    await fs.copyFile(
      path.join(ROOT, "clients/beispiel-automation/site/public/og-default.svg"),
      path.join(target, "site/public/og-default.svg"),
    );
  } catch {
    /* optional */
  }

  let compose = await fs.readFile(
    path.join(ROOT, "infra/docker-sketch/client.docker-compose.yml"),
    "utf8",
  );
  compose = compose.replaceAll("SLUG", slug).replaceAll("DOMAIN", host);
  await fs.writeFile(path.join(target, "docker-compose.yml"), compose);

  await fs.writeFile(
    path.join(target, "README.md"),
    `# Client: ${slug}

\`\`\`bash
# 1) BRIEF.yaml ausfüllen (Pflichtfragen-Katalog / LEGAL-INTAKE / INTAKE-QUESTIONS)
#    → docs/research/pflichtfragen-katalog.md
# 2) Content-Entwurf:
pnpm factory draft ${slug}
# 3) CONTENT + tokens prüfen, Locks setzen
# 4) Check + Dev:
pnpm factory check ${slug}
pnpm install
pnpm --filter @sbl-web/${slug} dev
\`\`\`
`,
  );

  console.log(`Created clients/${slug}`);
  console.log(`Next: edit BRIEF.yaml → pnpm factory draft ${slug} → pnpm factory check ${slug}`);
}
