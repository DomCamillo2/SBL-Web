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
