import {
  absoluteUrl,
  buildLocalBusinessSchema,
  googleFontsHref,
  loadBrief,
  loadContent,
  loadTokens,
  tokensToCssVars,
} from "./content.js";

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
      fontsHref: googleFontsHref(tokens),
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
      navLinks: options.navLinks ?? [
        { href: "/#faq", label: "FAQ" },
        { href: "/vorgehen", label: "Vorgehen" },
        { href: "/kontakt", label: "Kontakt" },
      ],
    },
  };
}

export function pageTitle(content, page) {
  return `${page.title}${content.seo_defaults.title_suffix}`;
}
