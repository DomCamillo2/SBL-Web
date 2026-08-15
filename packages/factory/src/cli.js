#!/usr/bin/env node
import { newClient } from "./new-client.js";
import { draftContent } from "./draft-content.js";
import { checkClient } from "./check.js";

const [cmd, ...args] = process.argv.slice(2);

const help = `SBL Factory — minimal hand-work client pipeline

Usage:
  pnpm factory new <slug> [--domain example.com]
  pnpm factory draft <slug> [--force]
  pnpm factory check <slug> [--strict]

Flow:
  new → fill BRIEF → draft → review CONTENT/tokens → check → build/deploy
`;

if (!cmd || cmd === "-h" || cmd === "--help") {
  console.log(help);
  process.exit(0);
}

try {
  if (cmd === "new") {
    const slug = args.find((a) => !a.startsWith("--"));
    const domainFlag = args.find((a) => a.startsWith("--domain="));
    const domain = domainFlag ? domainFlag.split("=")[1] : undefined;
    await newClient(slug, { domain });
  } else if (cmd === "draft") {
    const slug = args.find((a) => !a.startsWith("--"));
    await draftContent(slug, { force: args.includes("--force") });
  } else if (cmd === "check") {
    const slug = args.find((a) => !a.startsWith("--"));
    await checkClient(slug, { strict: args.includes("--strict") });
  } else {
    console.error(`Unknown command: ${cmd}`);
    console.log(help);
    process.exit(2);
  }
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
