import fs from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";

const FORBIDDEN_FONTS = [
  "inter",
  "roboto",
  "arial",
  "poppins",
  "open sans",
  "system-ui",
];

const DEFAULT_BANLIST = [
  "unlock the power",
  "seamless",
  "cutting-edge",
  "next-level",
  "revolutionize",
  "ganzheitliche lösungen",
  "mit leidenschaft und innovation",
  "lorem ipsum",
  "firma xy",
  "your@email",
];

const PLACEHOLDER_RE =
  /\b(lorem ipsum|firma xy|your@email|0000|placeholder|tbd|todo:)\b/i;

async function readJson(file) {
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw);
}

async function readYaml(file) {
  const raw = await fs.readFile(file, "utf8");
  return parseYaml(raw);
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

function walkStrings(value, out = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => walkStrings(v, out));
  else if (value && typeof value === "object") {
    Object.values(value).forEach((v) => walkStrings(v, out));
  }
  return out;
}

function hueInForbiddenBand(hue) {
  return typeof hue === "number" && hue >= 200 && hue <= 290;
}

export async function run(clientDir) {
  const root = path.resolve(clientDir);
  const issues = [];

  const push = (severity, id, message, file) => {
    issues.push({ severity, id, message, file });
  };

  const tokensPath = path.join(root, "tokens.json");
  const contentPath = path.join(root, "CONTENT.yaml");
  const designPath = path.join(root, "DESIGN.md");
  const briefPath = path.join(root, "BRIEF.yaml");
  const siteSrc = path.join(root, "site", "src");

  if (!(await exists(tokensPath))) {
    push("error", "AS000", "tokens.json missing", tokensPath);
  } else {
    const tokens = await readJson(tokensPath);
    const display = String(tokens?.typography?.display ?? "").toLowerCase();
    const body = String(tokens?.typography?.body ?? "").toLowerCase();
    for (const font of [display, body]) {
      if (FORBIDDEN_FONTS.some((f) => font.includes(f))) {
        push(
          "error",
          "AS001",
          `Forbidden font family used: "${font}"`,
          tokensPath,
        );
      }
    }
    if (!display || !body) {
      push("error", "AS001", "typography.display and typography.body required", tokensPath);
    }

    const hue = tokens?.color?.accent_hue;
    if (hueInForbiddenBand(hue)) {
      push(
        "error",
        "AS002",
        `Accent hue ${hue} is inside AI-default band 200–290`,
        tokensPath,
      );
    }
    if (typeof hue !== "number") {
      push("error", "AS002", "color.accent_hue must be a number", tokensPath);
    }

    const anti = tokens?.anti_slop?.rules ?? [];
    if (!Array.isArray(anti) || anti.length < 3) {
      push(
        "warn",
        "AS010",
        "anti_slop.rules should list explicit constraints",
        tokensPath,
      );
    }
  }

  if (!(await exists(contentPath))) {
    push("error", "AS000", "CONTENT.yaml missing", contentPath);
  } else {
    const content = await readYaml(contentPath);
    const banlist = [
      ...DEFAULT_BANLIST,
      ...(content.forbidden_phrases ?? []).map((p) => String(p).toLowerCase()),
    ];
    const texts = walkStrings(content).join("\n");
    const lower = texts.toLowerCase();

    for (const phrase of new Set(banlist)) {
      if (phrase && lower.includes(phrase.toLowerCase())) {
        // allow the phrase if it only appears inside forbidden_phrases list itself
        const onlyInList = (content.forbidden_phrases ?? [])
          .map((p) => String(p).toLowerCase())
          .includes(phrase.toLowerCase());
        const occurrences = lower.split(phrase.toLowerCase()).length - 1;
        if (!onlyInList || occurrences > 1) {
          // If phrase is in page copy (not only banlist), flag it.
          const copyBlob = walkStrings({
            pages: content.pages,
            brand_voice_notes: content.brand_voice_notes,
            seo_defaults: content.seo_defaults,
          })
            .join("\n")
            .toLowerCase();
          if (copyBlob.includes(phrase.toLowerCase())) {
            push(
              "error",
              "AS005",
              `Banned phrase in content: "${phrase}"`,
              contentPath,
            );
          }
        }
      }
    }

    if (PLACEHOLDER_RE.test(texts)) {
      push("error", "AS006", "Placeholder copy detected in CONTENT.yaml", contentPath);
    }

    for (const page of content.pages ?? []) {
      for (const section of page.sections ?? []) {
        if (section.id === "hero") {
          const itemCount = section.items?.length ?? 0;
          if (itemCount >= 3) {
            push(
              "error",
              "AS004",
              "Hero must not contain feature-card item grids",
              contentPath,
            );
          }
        }
      }
    }
  }

  if (!(await exists(designPath))) {
    push("warn", "AS000", "DESIGN.md missing — design lock recommended", designPath);
  }
  if (!(await exists(briefPath))) {
    push("warn", "AS000", "BRIEF.yaml missing", briefPath);
  }

  // Scan site source + archetype package for common slop patterns
  const scanDirs = [];
  if (await exists(siteSrc)) scanDirs.push(siteSrc);

  let archetypeName = null;
  if (await exists(tokensPath)) {
    try {
      archetypeName = (await readJson(tokensPath)).archetype;
    } catch {
      /* ignore */
    }
  }
  if (archetypeName) {
    const archetypeSrc = path.resolve(root, "../../archetypes", archetypeName, "src");
    const archetypeSrcAlt = path.resolve(root, "../../../archetypes", archetypeName, "src");
    for (const candidate of [archetypeSrc, archetypeSrcAlt]) {
      if (await exists(candidate)) {
        scanDirs.push(candidate);
        break;
      }
    }
  }

  if (scanDirs.length > 0) {
    const files = (
      await Promise.all(
        scanDirs.map((dir) => collectFiles(dir, [".astro", ".css", ".ts", ".js", ".tsx"])),
      )
    ).flat();
    const blob = (
      await Promise.all(files.map((f) => fs.readFile(f, "utf8")))
    ).join("\n");
    const label = scanDirs.join(" + ");

    if (/from-(blue|indigo|violet|purple)-[0-9]+.*to-(purple|violet|indigo|fuchsia)/i.test(blob) ||
        /linear-gradient\([^)]*(#4f46e5|#6366f1|#8b5cf6|#3b82f6)[^)]*(#8b5cf6|#a855f7|#6366f1)/i.test(blob)) {
      push("error", "AS003", "Blue/purple AI-signature gradient detected in site source", label);
    }
    if (/font-family:\s*['\"]?Inter\b/i.test(blob) || /fonts\.google.*?family=Inter/i.test(blob)) {
      push("error", "AS001", "Inter font referenced in site source", label);
    }
    if (!/prefers-reduced-motion/i.test(blob)) {
      push("warn", "AS007", "prefers-reduced-motion not found in site/archetype source", label);
    }
    if (!/::selection/i.test(blob)) {
      push("warn", "AS008", "::selection style not found in site/archetype source", label);
    }
    if (!/impressum/i.test(blob) || !/datenschutz/i.test(blob)) {
      push("error", "AS009", "Impressum and Datenschutz links required", label);
    }

    const imgTags = blob.match(/<img\b[^>]*>/gi) ?? [];
    for (const tag of imgTags) {
      if (!/\balt\s*=/.test(tag)) {
        push("error", "LC15", `Image missing alt attribute: ${tag.slice(0, 80)}`, label);
      }
    }
  }

  // --- Launch checklist (20-point reel) ---
  let brief = null;
  let content = null;
  if (await exists(briefPath)) {
    try {
      brief = await readYaml(briefPath);
    } catch {
      push("error", "AS000", "BRIEF.yaml could not be parsed", briefPath);
    }
  }
  if (await exists(contentPath)) {
    try {
      content = await readYaml(contentPath);
    } catch {
      /* already handled above */
    }
  }

  const sitePages = path.join(root, "site", "src", "pages");
  const publicDir = path.join(root, "site", "public");
  const launch = brief?.launch ?? {};

  if (!(await exists(path.join(sitePages, "404.astro")))) {
    push("error", "LC01", "Custom 404 page missing (src/pages/404.astro)", sitePages);
  }

  const home = content?.pages?.find((p) => p.id === "home");
  const hero = home?.sections?.find((s) => s.id === "hero");
  if (!hero?.cta_label || !hero?.cta_href) {
    push("error", "LC02", "Hero CTA above the fold missing (cta_label/cta_href)", contentPath);
  }

  if (launch.thank_you_page !== false) {
    const thanks =
      (await exists(path.join(sitePages, "danke.astro"))) ||
      content?.pages?.some((p) => p.id === "thanks" || p.path === "/danke");
    if (!thanks) {
      push("error", "LC04", "Thank-you page missing (/danke)", sitePages);
    }
  }

  if (launch.breadcrumbs !== false && (await exists(sitePages))) {
    const pageFiles = await collectFiles(sitePages, [".astro"]);
    const pageBlob = (await Promise.all(pageFiles.map((f) => fs.readFile(f, "utf8")))).join(
      "\n",
    );
    if (!/Breadcrumbs/.test(pageBlob)) {
      push("warn", "LC05", "Breadcrumbs not used on site pages", sitePages);
    }
  }

  if (launch.faq_required !== false && content) {
    const faqSection = (content.pages ?? [])
      .flatMap((p) => p.sections ?? [])
      .find((s) => s.id === "faq");
    const min = launch.faq_min_items ?? 5;
    const count = faqSection?.items?.length ?? 0;
    if (count < min) {
      push("error", "LC06", `FAQ needs ≥ ${min} items (found ${count})`, contentPath);
    }
  }

  if (!brief?.contact?.response_time_promise) {
    push("error", "LC07", "Response-time promise missing in BRIEF contact", briefPath);
  }

  if (launch.sticky_mobile_cta !== false && (await exists(siteSrc))) {
    const files = await collectFiles(siteSrc, [".astro", ".js"]);
    const pageBlob = (await Promise.all(files.map((f) => fs.readFile(f, "utf8")))).join("\n");
    // Sticky comes from BaseLayout via pageShell — check archetype + site
    const arch = path.resolve(root, "../../archetypes/service-local-b2b/src");
    let all = pageBlob;
    if (await exists(arch)) {
      const aFiles = await collectFiles(arch, [".astro", ".js"]);
      all += (await Promise.all(aFiles.map((f) => fs.readFile(f, "utf8")))).join("\n");
    }
    if (!/StickyMobileCta|stickyCta/.test(all)) {
      push("error", "LC08", "Sticky mobile CTA not wired", siteSrc);
    }
  }

  if (launch.robots_txt !== false && !(await exists(path.join(publicDir, "robots.txt")))) {
    push("error", "LC09", "robots.txt missing in site/public", publicDir);
  }

  if (content?.pages?.length) {
    const titles = content.pages.map((p) => p.title?.trim()).filter(Boolean);
    const uniq = new Set(titles);
    if (uniq.size !== titles.length) {
      push("error", "LC10", "Page titles must be unique", contentPath);
    }
    for (const page of content.pages) {
      if (!page.meta_description || String(page.meta_description).trim().length < 40) {
        push(
          "error",
          "LC11",
          `meta_description missing/too short for page ${page.id}`,
          contentPath,
        );
      }
    }
  }

  if (launch.social_share_image !== false) {
    const og = brief?.assets?.og_image;
    if (!og) {
      push("error", "LC12", "Social share image (assets.og_image) missing", briefPath);
    } else if (og.startsWith("/") && !(await exists(path.join(publicDir, og.replace(/^\//, ""))))) {
      // allow remote URLs; local public paths must exist
      push("warn", "LC12", `og_image not found in public: ${og}`, publicDir);
    }
  }

  if (launch.maps_directions !== false) {
    if (!brief?.contact?.maps_url && !brief?.contact?.address) {
      push("error", "LC13", "Maps/directions need maps_url or address", briefPath);
    }
  }

  if (brief?.launch?.reviews?.enabled) {
    if (!brief.launch.reviews.permission_confirmed) {
      push(
        "error",
        "LC14",
        "Reviews enabled but permission_confirmed is false",
        briefPath,
      );
    }
  }

  if (launch.local_schema !== false) {
    const archLib = path.resolve(root, "../../archetypes/service-local-b2b/src/lib/content.js");
    const archLibAlt = path.resolve(root, "../../../archetypes/service-local-b2b/src/lib/content.js");
    let hasSchemaHelper = false;
    for (const candidate of [archLib, archLibAlt]) {
      if (await exists(candidate)) {
        const src = await fs.readFile(candidate, "utf8");
        if (/buildLocalBusinessSchema/.test(src)) hasSchemaHelper = true;
      }
    }
    if (!hasSchemaHelper) {
      push("warn", "LC16", "LocalBusiness schema helper not found in archetype", root);
    }
    if (!brief?.hosting?.site_url && !brief?.hosting?.production_domain) {
      push("warn", "LC16", "site_url/production_domain recommended for schema/OG", briefPath);
    }
  }

  if (launch.privacy_page !== false && brief?.legal?.privacy_ready !== true) {
    push("error", "LC17", "Privacy page must be ready (legal.privacy_ready)", briefPath);
  }

  if (brief?.launch?.analytics?.enabled && brief.launch.analytics.provider === "google") {
    if (brief.launch.analytics.consent_required !== false) {
      push(
        "warn",
        "LC18",
        "Google Analytics enabled — ensure consent banner before loading tags",
        briefPath,
      );
    }
  }

  if (brief?.launch?.team_photo?.available === true && !brief.launch.team_photo.path && !brief.assets?.team_photo) {
    push("error", "LC19", "Team photo marked available but path missing", briefPath);
  }
  if (brief?.launch?.team_photo?.available === false && !brief.launch.team_photo?.skip_reason) {
    push("warn", "LC19", "Team photo skipped without skip_reason", briefPath);
  }

  if (brief?.launch?.case_studies?.enabled && (brief.launch.case_studies.count_available ?? 0) < 1) {
    push(
      "warn",
      "LC20",
      "Case studies enabled but count_available is 0 — disable or add real cases",
      briefPath,
    );
  }

  const errors = issues.filter((i) => i.severity === "error").length;
  const warnings = issues.filter((i) => i.severity === "warn").length;
  const score = Math.min(100, errors * 18 + warnings * 6);

  return { issues, errors, warnings, score };
}

async function collectFiles(dir, exts, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await collectFiles(full, exts, out);
    else if (exts.includes(path.extname(entry.name))) out.push(full);
  }
  return out;
}
