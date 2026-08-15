# Anti-Slop Repos — Commercial License Matrix

Research date: 2026-08-15  
Goal: frameworks/patterns we can **commercially use** and optionally **vendor** into SBL-Web for motion, panels, and anti-card layouts.

## Verdict (short)

| Use in commercial KMU sites? | Projects |
|------------------------------|----------|
| **Yes — MIT, good to vendor** | `anti-slop-templates`, `anti-slop-design` (Cuuper22), `hallmark`, `design-guard`, `miqdadbadjuber/anti-slop`, `tasteskill`, `mbeato/anti-slop-design` |
| **Yes — Apache-2.0** | `nexu-io/open-design` (code OK; avoid cloning trademarked brand systems wholesale) |
| **Yes commercial, not OSS MIT** | GSAP (Webflow “No Charge” license — fine for client sites, don’t vendor as if MIT) |
| **Avoid for this factory** | Sailop (proprietary), `anti-ai-ui-framework` (hostile joke UI), brand-token clones marketed as “Linear/Stripe design system” |

## What we vendored into `@sbl-web/ui`

See [`packages/ui/NOTICE.md`](../../packages/ui/NOTICE.md).

- Motion / fluid type / fluid space tokens ← Cuuper22/anti-slop-design  
- Reveal JS + CSS ← JasonColapietro/anti-slop-templates  
- Panel / definition-list / asymmetric split primitives ← adapted from templates + Hallmark recipes  
- SVG grain/grid textures ← anti-slop-design  
- Interaction timing recipes ← Hallmark  

## Repo dossier

### Ready to copy (MIT)

1. **[JasonColapietro/anti-slop-templates](https://github.com/JasonColapietro/anti-slop-templates)** — MIT  
   Self-contained HTML/CSS. Best pieces: `shared/reveal.js`, `[data-reveal]`, panel hover, token files.  
   Caution: Editorial “Folio” skin is cream/terracotta/serif — we skip that skin, keep mechanics.

2. **[Cuuper22/anti-slop-design](https://github.com/Cuuper22/anti-slop-design)** — MIT  
   Domain tokens, Utopia fluid scales, motion tokens, SVG textures, template families. Ideal foundation CSS.

3. **[Nutlope/hallmark](https://github.com/Nutlope/hallmark)** — MIT  
   Skill + excellent microinteraction / anti-pattern references. Use as craft rules + CSS recipes, not as a runtime.

4. **[FReptar0/design-guard](https://github.com/FReptar0/design-guard)** (aka stitch-forge) — MIT  
   Anti-slop lint rules (gradients, fonts, etc.). We mirror ideas in `@sbl-web/anti-slop`; optional full CLI later via npm.

5. **[miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop)** — MIT  
   Agent skills / design rules. Good AGENTS.md fuel.

6. **[tasteskill/tasteskill](https://github.com/tasteskill/tasteskill)** — MIT  
   Taste/direction skills (minimalist, brutalist, …). No heavy CSS kit; use for design direction prompts.

7. **[mbeato/anti-slop-design](https://github.com/mbeato/anti-slop-design)** — MIT  
   Variant-generation skill with scoring. Process tooling, not UI kit.

### Apache-2.0

8. **[nexu-io/open-design](https://github.com/nexu-io/open-design)** — Apache-2.0  
   Huge design-system catalog + anti-slop machinery. Commercially usable.  
   **Do not** drop “inspired by Stripe/Linear” token packs into client sites as if they were your brand — trademark/confusion risk. Use schema (`DESIGN.md`) and craft rules.

### Optional animation libraries (not vendored)

| Lib | License | Factory recommendation |
|-----|---------|------------------------|
| **Motion** (`motion`) | MIT | Preferred if you need JS animation beyond IO reveals |
| **Anime.js** | MIT | Good timeline alternative |
| **GSAP** | Proprietary free commercial | OK on client sites; don’t treat as FOSS; avoid if you build a competing visual animation builder |
| **Framer Motion** | MIT | Heavier; React-centric — skip for Astro static default |

## What NOT to use

- **Sailop** — paid anti-slop SaaS; don’t copy proprietary scoring engine.  
- **anti-ai-ui-framework** — intentionally hostile dark patterns.  
- **Unlicensed / no LICENSE file repos** — treat as “all rights reserved”; do not vendor.  
- **Default shadcn + Inter + purple** stacks without retokening — legal but aesthetic slop.

## How to use in SBL-Web

```astro
import "@sbl-web/ui/css/ui.css";
import Reveal from "@sbl-web/ui/components/Reveal.astro";
import DefinitionList from "@sbl-web/ui/components/DefinitionList.astro";
import Panel from "@sbl-web/ui/components/Panel.astro";
```

Script (once per layout):

```html
<script src="@sbl-web/ui/js/reveal.js"></script>
```

Rules of thumb (Hallmark-aligned):

- Max **2–3** motion primitives per page  
- Prefer **definition lists / asymmetric splits** over 3 equal cards  
- Never fade-up every section  
- Always honor `prefers-reduced-motion`
