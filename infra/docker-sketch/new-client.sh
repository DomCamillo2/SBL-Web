#!/usr/bin/env bash
# Sketch only — wire paths/registry before production use.
set -euo pipefail

SLUG="${1:-}"
DOMAIN="${2:-}"

if [[ -z "$SLUG" || -z "$DOMAIN" ]]; then
  echo "Usage: $0 <slug> <domain>"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLIENT_DIR="${ROOT}/../clients/${SLUG}"
SKETCH="$(cd "$(dirname "$0")" && pwd)"

mkdir -p "${CLIENT_DIR}"
sed -e "s/SLUG/${SLUG}/g" -e "s/DOMAIN/${DOMAIN}/g" \
  "${SKETCH}/client.docker-compose.yml" > "${CLIENT_DIR}/docker-compose.yml"

echo "Wrote ${CLIENT_DIR}/docker-compose.yml"
echo "Next: build image, ensure network sbl-proxy exists, then:"
echo "  docker compose -f ${CLIENT_DIR}/docker-compose.yml up -d"
