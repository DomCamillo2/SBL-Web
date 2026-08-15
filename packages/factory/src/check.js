import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { run as runAntiSlop } from "../../anti-slop/src/lint.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

async function loadSchema(name) {
  const raw = await fs.readFile(path.join(ROOT, "docs/schemas", name), "utf8");
  return JSON.parse(raw);
}

export async function checkClient(slug, { strict = false } = {}) {
  if (!slug) throw new Error("slug required");
  const dir = path.join(ROOT, "clients", slug);

  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);

  const brief = parseYaml(await fs.readFile(path.join(dir, "BRIEF.yaml"), "utf8"));
  const content = parseYaml(await fs.readFile(path.join(dir, "CONTENT.yaml"), "utf8"));
  const tokens = JSON.parse(await fs.readFile(path.join(dir, "tokens.json"), "utf8"));

  const briefSchema = await loadSchema("brief.schema.json");
  const contentSchema = await loadSchema("content.schema.json");
  const tokensSchema = await loadSchema("design-tokens.schema.json");

  const validateBrief = ajv.compile(briefSchema);
  const validateContent = ajv.compile(contentSchema);
  const validateTokens = ajv.compile(tokensSchema);

  let schemaErrors = 0;
  const report = (label, ok, validate) => {
    if (ok) {
      console.log(`OK   schema ${label}`);
      return;
    }
    schemaErrors += 1;
    console.log(`FAIL schema ${label}`);
    for (const err of validate.errors ?? []) {
      console.log(`     - ${err.instancePath || "/"} ${err.message}`);
    }
  };

  report("BRIEF.yaml", validateBrief(brief), validateBrief);
  report("CONTENT.yaml", validateContent(content), validateContent);
  report("tokens.json", validateTokens(tokens), validateTokens);

  if (content.draft === true) {
    console.log("WARN content still marked draft: true — remove after review");
    if (strict) schemaErrors += 1;
  }

  if (strict) {
    if (!brief.locks?.design_locked_at) {
      console.log("FAIL strict: design_locked_at missing");
      schemaErrors += 1;
    }
    if (!brief.locks?.content_locked_at) {
      console.log("FAIL strict: content_locked_at missing");
      schemaErrors += 1;
    }
    if (brief.legal?.client_approved_texts !== true) {
      console.log("FAIL strict: legal.client_approved_texts must be true");
      schemaErrors += 1;
    }
  }

  const anti = await runAntiSlop(dir);
  for (const issue of anti.issues) {
    console.log(
      `${issue.severity.toUpperCase().padEnd(5)} ${issue.id}  ${issue.message}`,
    );
  }
  console.log(
    `anti-slop: ${anti.errors} error(s), ${anti.warnings} warning(s) — score ${anti.score}/100`,
  );

  const failed = schemaErrors > 0 || anti.errors > 0 || (strict && anti.warnings > 0);
  if (failed) {
    throw new Error(`check failed for ${slug}`);
  }
  console.log(`PASS factory check ${slug}`);
}
