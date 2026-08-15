import {
  absoluteUrl,
  buildLocalBusinessSchema,
  loadBrief,
  loadContent,
  loadTokens,
  tokensToCssVars,
} from "./content.js";

function navFromBrief(brief, content) {
  const pages = brief?.pages ?? content?.pages ?? [];
  const links = [];
  for (const p of pages) {
    if (p.id === "home" || p.path === "/") continue;
    if (p.id === "thanks" || p.path === "/danke") continue;
    const href = p.path || `/${p.id}`;
    const label = p.title || p.id;
    if (href && label) links.push({ href, label });
  }
  if (!links.some((l) => l.href.includes("kontakt"))) {
    links.push({ href: "/kontakt", label: "Kontakt" });
  }
  // Prefer FAQ anchor on home when present
  const home = content?.pages?.find((p) => p.id === "home");
  if (home?.sections?.some((s) => s.id === "faq")) {
    links.unshift({ href: "/#faq", label: "FAQ" });
  }
  return links.slice(0, 5);
}

export function createPageShell(options = {}) {
  const content = loadContent();
  const tokens = loadTokens();
  const brief = loadBrief();
  const brand = content.seo_defaults.site_name;
  const launch = brief?.launch ?? {};
  const path = options.path ?? "/";

  const ogPath = brief?.assets?.og_image || "/og-default.svg";
  const ogImage = ogPath.startsWith("http")
    ? ogPath
    : absoluteUrl(brief, ogPath);

  return {
    content,
    tokens,
    brief,
    brand,
    launch,
    layout: {
      brand,
      cssVars: tokensToCssVars(tokens),
      email: brief?.contact?.email,
      phone: brief?.contact?.phone,
      canonicalUrl: absoluteUrl(brief, path),
      ogImage,
      jsonLd: options.includeSchema === false ? null : buildLocalBusinessSchema(brief, content),
      stickyCta:
        launch.sticky_mobile_cta === false
          ? null
          : {
              label: brief?.contact?.cta_label || "Kontakt",
              href: "/kontakt",
            },
      analytics: brief?.launch?.analytics,
      navLinks: options.navLinks ?? navFromBrief(brief, content),
    },
  };
}

export function pageTitle(content, page) {
  return `${page.title}${content.seo_defaults.title_suffix}`;
}
