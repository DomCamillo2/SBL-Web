#!/usr/bin/env node
import { run } from "./lint.js";

const target = process.argv.slice(2).find((arg) => arg !== "--");
if (!target) {
  console.error("Usage: anti-slop <client-dir>");
  console.error("Example: anti-slop ./clients/beispiel-automation");
  process.exit(2);
}

const result = await run(target);
for (const issue of result.issues) {
  const tag = issue.severity.toUpperCase().padEnd(5);
  console.log(`${tag} ${issue.id}  ${issue.message}`);
  if (issue.file) console.log(`      └─ ${issue.file}`);
}

console.log("");
console.log(
  `anti-slop: ${result.errors} error(s), ${result.warnings} warning(s) — score ${result.score}/100 (lower is better)`,
);

if (result.errors > 0) process.exit(1);
