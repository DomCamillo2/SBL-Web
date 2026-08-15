# SBL-Web

Website-Factory für KMU und lokale Unternehmen: strukturierte Pipeline statt Vibe Coding, Anti-AI-Slop-Gates, Docker-Hosting.

## Quick start (Demo)

```bash
pnpm install
pnpm anti-slop:demo   # score 0 = clean
pnpm dev:demo         # http://localhost:4321
pnpm build:demo
```

Demo-Client: [`clients/beispiel-automation`](clients/beispiel-automation) — Archetyp `service-local-b2b`, content-driven (BRIEF → tokens → CONTENT → Astro).

## Anti-slop UI kit (vendored MIT)

Commercially usable primitives (reveal, panels, definition lists, motion tokens): [`packages/ui`](packages/ui)  
License matrix: [`docs/research/anti-slop-vendors.md`](docs/research/anti-slop-vendors.md)

## Pipeline

```
Brief → Design Lock → Content Lock → Constrained Build → Anti-Slop QA → Docker Ship
```

Deep Research: [docs/research/kmu-website-pipeline.md](docs/research/kmu-website-pipeline.md)

| Artefakt | Pfad |
|----------|------|
| Pipeline-Research | `docs/research/kmu-website-pipeline.md` |
| Anti-Slop CLI | `packages/anti-slop` (`pnpm anti-slop:demo`) |
| Launch-Fragen (20) | `templates/client-brief/INTAKE-QUESTIONS.md` |
| Launch-Gate | `docs/research/launch-checklist.md` |
| Archetyp service-local-b2b | `archetypes/service-local-b2b` |
| Demo-Client | `clients/beispiel-automation` |
| Brief/Content/Token Schemas | `docs/schemas/` |
| Docker/Traefik Skizze | `infra/docker-sketch/` |
| Neuer Client | `infra/scripts/new-client.sh <slug>` |
| Agent-Regeln | `AGENTS.md` |

## Neuen Client anlegen

```bash
./infra/scripts/new-client.sh meine-firma
# BRIEF / DESIGN / tokens / CONTENT ausfüllen und locken
pnpm install
node packages/anti-slop/src/cli.js clients/meine-firma
pnpm --filter @sbl-web/meine-firma dev
```

## Docker (auf dem Server)

```bash
docker network create sbl-proxy
# Traefik edge: infra/docker-sketch/traefik.docker-compose.yml
docker build -f clients/beispiel-automation/site/Dockerfile -t sbl-web/beispiel-automation .
docker compose -f clients/beispiel-automation/docker-compose.yml up -d
```
