# SBL-Web

Website-Factory für KMU und lokale Unternehmen: strukturierte Pipeline statt Vibe Coding, Anti-AI-Slop-Gates, Docker-Hosting.

## Start here

**Deep Research & Architektur:** [docs/research/kmu-website-pipeline.md](docs/research/kmu-website-pipeline.md)

| Artefakt | Pfad |
|----------|------|
| Pipeline-Research | `docs/research/kmu-website-pipeline.md` |
| Anti-Slop Lint Spec | `docs/research/anti-slop-lint-spec.md` |
| Brief Schema | `docs/schemas/brief.schema.json` |
| Content Schema | `docs/schemas/content.schema.json` |
| Tokens Schema | `docs/schemas/design-tokens.schema.json` |
| Brief-Beispiel | `templates/client-brief/BRIEF.example.yaml` |
| DESIGN.md Template | `templates/client-brief/DESIGN.template.md` |
| MSB-Referenz-Mapping | `examples/msb-ai-reference/STRUCTURE.md` |
| Docker-Skizze | `infra/docker-sketch/` |
| Agent-Regeln | `AGENTS.md` |

## Kurz: Factory vs. Vibe Coding

```
Vibe Coding:  Prompt → fertige Seite → sieht aus wie jede AI-Site
Factory:      Brief → Design Lock → Content Lock → Build → QA → Docker
```

## Nächster Implementierungs-Schritt

1. Archetyp `service-local-b2b` (Astro) scaffolden  
2. `anti-slop` Script gegen Tokens/Content  
3. Traefik auf dem Server mit `infra/docker-sketch`  
