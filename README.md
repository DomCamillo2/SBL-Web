# SBL-Web

Website-Factory für KMU und lokale Unternehmen: strukturierte Pipeline statt Vibe Coding, Anti-AI-Slop-Gates, Docker-Hosting.

## Quick start (Demo)

```bash
pnpm install
pnpm factory check beispiel-automation
pnpm dev:demo
```

## Neue Site (wenig Handarbeit)

```bash
pnpm factory new meine-firma --domain=meine-firma.de
# BRIEF.yaml + LEGAL-/Launch-Fragen ausfüllen
pnpm factory draft meine-firma
# CONTENT prüfen, tokens/DESIGN locken
pnpm factory check meine-firma
pnpm install
pnpm --filter @sbl-web/meine-firma dev
```

Audit: [`docs/research/pipeline-audit.md`](docs/research/pipeline-audit.md)

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
| Legal DE (Branchen) | `docs/research/legal-de-branchen.md` |
| Legal-Intake | `templates/client-brief/LEGAL-INTAKE.md` |
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
