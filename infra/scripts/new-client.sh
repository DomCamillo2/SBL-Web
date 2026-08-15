#!/usr/bin/env bash
# Thin wrapper — prefer: pnpm factory new <slug>
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
exec node "${ROOT}/packages/factory/src/cli.js" new "$@"
