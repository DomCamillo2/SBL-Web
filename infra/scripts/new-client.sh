#!/usr/bin/env bash
set -euo pipefail

SLUG="${1:-}"
if [[ -z "$SLUG" ]]; then
  echo "Usage: $0 <slug>"
  echo "Example: $0 baeckerei-mueller"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TARGET="${ROOT}/clients/${SLUG}"

if [[ -d "$TARGET" ]]; then
  echo "Client already exists: $TARGET"
  exit 1
fi

mkdir -p "${TARGET}/site/src/pages" "${TARGET}/assets" "${TARGET}/mockups"

cp "${ROOT}/templates/client-brief/BRIEF.example.yaml" "${TARGET}/BRIEF.yaml"
cp "${ROOT}/templates/client-brief/CONTENT.example.yaml" "${TARGET}/CONTENT.yaml"
cp "${ROOT}/templates/client-brief/DESIGN.template.md" "${TARGET}/DESIGN.md"
cp "${ROOT}/templates/client-brief/tokens.example.json" "${TARGET}/tokens.json"

# Seed site from demo
cp -R "${ROOT}/clients/beispiel-automation/site/." "${TARGET}/site/"
# Rewrite package name
node -e "
const fs=require('fs');
const p='${TARGET}/site/package.json';
const j=JSON.parse(fs.readFileSync(p,'utf8'));
j.name='@sbl-web/${SLUG}';
fs.writeFileSync(p, JSON.stringify(j,null,2)+'\n');
"

# Point SBL paths in astro config stay relative (parent = client root) — OK

# Compose from sketch
sed -e "s/SLUG/${SLUG}/g" -e "s/DOMAIN/${SLUG}.localhost/g" \
  "${ROOT}/infra/docker-sketch/client.docker-compose.yml" > "${TARGET}/docker-compose.yml"

# Fix brief/content slug placeholders lightly
sed -i "s/beispiel-automation-tuebingen/${SLUG}/g; s/beispiel-automation/${SLUG}/g" \
  "${TARGET}/BRIEF.yaml" "${TARGET}/CONTENT.yaml" "${TARGET}/tokens.json" 2>/dev/null || true

cat > "${TARGET}/README.md" <<EOF
# Client: ${SLUG}

1. Fill BRIEF.yaml, DESIGN.md, tokens.json, CONTENT.yaml
2. Lock design + content
3. From repo root: \`pnpm install && node packages/anti-slop/src/cli.js clients/${SLUG}\`
4. Dev: \`pnpm --filter @sbl-web/${SLUG} dev\`
5. Build: \`pnpm --filter @sbl-web/${SLUG} build\`
EOF

echo "Created ${TARGET}"
echo "Next: edit locked artifacts, then pnpm install && pnpm --filter @sbl-web/${SLUG} dev"
