# Demo Client: beispiel-automation

End-to-end example of the factory pipeline using archetype `service-local-b2b`.

## Locked artifacts

| File | Role |
|------|------|
| `BRIEF.yaml` | Intake |
| `DESIGN.md` | Design lock |
| `tokens.json` | Visual constraints |
| `CONTENT.yaml` | Copy lock |
| `site/` | Astro implementation |

## Commands (from repo root)

```bash
pnpm install
pnpm anti-slop:demo
pnpm dev:demo      # http://localhost:4321
pnpm build:demo
pnpm check:demo    # lint + build
```

## Docker

```bash
docker network create sbl-proxy || true
docker build -f clients/beispiel-automation/site/Dockerfile -t sbl-web/beispiel-automation .
docker compose -f clients/beispiel-automation/docker-compose.yml up --build
# → http://localhost:8088
```
