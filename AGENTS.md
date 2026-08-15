# Agent Rules — SBL-Web Website Factory

You help build KMU/local business websites inside this factory. You do **not** vibe-code finished sites from a single prompt.

## Source of truth (in order)

1. `clients/<slug>/BRIEF.yaml`
2. `clients/<slug>/DESIGN.md` + `tokens.json`
3. `clients/<slug>/CONTENT.yaml`
4. Archetype templates under `archetypes/`
5. This file

If locks are missing (`design.lock` / content lock fields), **stop and ask for lock** — do not invent brand or claims.

## Never do

- Ship Inter / Roboto / Arial / Poppins / Open Sans as primary fonts
- Use blue→purple / indigo gradients as brand identity (accent hue 200–290 forbidden for primary)
- Put stats, schedules, promo chips, or floating badges in the hero
- Use cards in the hero
- Use inset rounded hero media as the default
- Fade-up every section on scroll
- Invent testimonials, logos, certifications, prices, or legal text
- Fill with Lorem / placeholder phone numbers

## Always do

- One composition in the first viewport: brand, one headline, one support sentence, one CTA group, one dominant visual
- One job per section
- Prefer real photography / place / product context
- Prefer `@sbl-web/ui` primitives (`DefinitionList`, `AsymmetricSplit`, `Reveal`) over equal icon-card grids
- Collect the 20 launch intake answers into `BRIEF.yaml` → `launch` (see `templates/client-brief/INTAKE-QUESTIONS.md`)
- Collect legal/branch intake into `BRIEF.yaml` → `legal` + `regulated_profession` (see `templates/client-brief/LEGAL-INTAKE.md`)
- Never invent Impressum data, medical claims, or reviews; never cite repealed TMG as current law
- Keep German copy concrete and local (city, region, real offer)
- Respect `prefers-reduced-motion`
- Style `::selection` and `:focus-visible`
- Link Impressum + Datenschutz
- Keep third-party MIT notices in `packages/ui/NOTICE.md` when adapting more code

## Launch blockers before go-live

404, hero CTA, thank-you page, robots.txt, unique titles, meta descriptions, alt text, local schema, privacy page — see `docs/research/launch-checklist.md`.

## Build sequence

1. Validate brief against `docs/schemas/brief.schema.json`
2. Confirm design + content locks
3. Scaffold from archetype
4. Implement against tokens only
5. Run anti-slop checks (`docs/research/anti-slop-lint-spec.md`)
6. Produce static build for Docker/nginx

## Reference

- Pipeline research: `docs/research/kmu-website-pipeline.md`
- MSB structural reference: `examples/msb-ai-reference/STRUCTURE.md`
