import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

/**
 * Resolve client root: directory that contains CONTENT.yaml / tokens.json.
 * Prefer SBL_CLIENT_ROOT, else walk up from site cwd.
 */
export function resolveClientRoot(from = process.cwd()) {
  if (process.env.SBL_CLIENT_ROOT) {
    return path.resolve(process.env.SBL_CLIENT_ROOT);
  }
  let dir = path.resolve(from);
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(dir, "CONTENT.yaml")) && fs.existsSync(path.join(dir, "tokens.json"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(
    "Could not find client root (CONTENT.yaml + tokens.json). Set SBL_CLIENT_ROOT.",
  );
}

export function loadTokens(clientRoot = resolveClientRoot()) {
  const file = path.join(clientRoot, "tokens.json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function loadContent(clientRoot = resolveClientRoot()) {
  const file = path.join(clientRoot, "CONTENT.yaml");
  return parseYaml(fs.readFileSync(file, "utf8"));
}

export function loadBrief(clientRoot = resolveClientRoot()) {
  const file = path.join(clientRoot, "BRIEF.yaml");
  if (!fs.existsSync(file)) return null;
  return parseYaml(fs.readFileSync(file, "utf8"));
}

export function getPage(content, id) {
  const page = content.pages?.find((p) => p.id === id);
  if (!page) throw new Error(`Page not found in CONTENT.yaml: ${id}`);
  return page;
}

export function tokensToCssVars(tokens) {
  const c = tokens.color ?? {};
  const t = tokens.typography ?? {};
  return {
    "--sbl-bg": c.background,
    "--sbl-fg": c.foreground,
    "--sbl-accent": c.accent,
    "--sbl-muted": c.muted ?? c.foreground,
    "--sbl-surface": c.surface ?? c.background,
    "--sbl-selection": c.selection ?? c.accent,
    "--sbl-font-display": `"${t.display}", Georgia, serif`,
    "--sbl-font-body": `"${t.body}", "Segoe UI", sans-serif`,
    "--sbl-font-mono": `"${t.mono ?? "ui-monospace"}", monospace`,
  };
}

export function googleFontsHref(tokens) {
  const display = tokens.typography?.display;
  const body = tokens.typography?.body;
  const mono = tokens.typography?.mono;
  const families = [display, body, mono].filter(Boolean);
  const q = families
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@400;500;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${q}&display=swap`;
}

export function buildLocalBusinessSchema(brief, content) {
  if (!brief) return null;
  const launch = brief.launch ?? {};
  if (launch.local_schema === false) return null;

  const siteUrl = brief.hosting?.site_url || brief.hosting?.production_domain;
  const url = siteUrl
    ? siteUrl.startsWith("http")
      ? siteUrl
      : `https://${siteUrl}`
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": launch.schema_type || "ProfessionalService",
    name: brief.business?.name || content?.seo_defaults?.site_name,
    description: content?.seo_defaults?.default_description,
    url,
    email: brief.contact?.email,
    telephone: brief.contact?.phone,
    image: brief.assets?.og_image || brief.assets?.team_photo || brief.assets?.logo,
    address: brief.contact?.address
      ? {
          "@type": "PostalAddress",
          streetAddress: brief.contact.address,
          addressLocality: brief.business?.city,
          addressRegion: brief.business?.region,
          addressCountry: "DE",
        }
      : undefined,
    areaServed: brief.business?.region,
    openingHours: brief.contact?.hours,
    hasMap: brief.contact?.maps_url,
  };
}

export function absoluteUrl(brief, path = "/") {
  const base = brief?.hosting?.site_url || brief?.hosting?.production_domain;
  if (!base) return path;
  const origin = base.startsWith("http") ? base.replace(/\/$/, "") : `https://${base.replace(/\/$/, "")}`;
  if (!path || path === "/") return `${origin}/`;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
