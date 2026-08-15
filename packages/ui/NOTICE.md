# Third-party notices — @sbl-web/ui

This package contains original SBL-Web code plus adapted excerpts from MIT-licensed
anti-slop projects. Full license texts live in `third_party/`.

## Included / adapted

| Source | SPDX | What we use | Notes |
|--------|------|-------------|-------|
| [JasonColapietro/anti-slop-templates](https://github.com/JasonColapietro/anti-slop-templates) | MIT | `reveal.js`, reveal CSS pattern, panel interaction ideas | Retokened to `--sbl-*` / `--motion-*`; no Folio cream/terracotta skin copied |
| [Cuuper22/anti-slop-design](https://github.com/Cuuper22/anti-slop-design) | MIT | fluid type/space scales, motion tokens, SVG textures | Foundations only |
| [Nutlope/hallmark](https://github.com/Nutlope/hallmark) | MIT | Microinteraction timing/easing recipes (docs + CSS interactions) | Principles adapted; not a full skill dump |
| [FReptar0/design-guard](https://github.com/FReptar0/design-guard) | MIT | Gradient lint idea (fed into `@sbl-web/anti-slop`) | Rule concept, not the full CLI |

## Intentionally NOT vendored

| Source | Why |
|--------|-----|
| Sailop | Proprietary product / SaaS |
| `codypearce/anti-ai-ui-framework` | Joke hostile UX — useless for KMU sites |
| Open Design brand systems (Linear/Stripe/…) | Apache-2.0 code OK, but **brand token clones** risk trademark issues — use as reference only |
| GSAP | Commercial use free under proprietary “No Charge” license, **not MIT**; optional later via npm, not vendored here |
| Editorial Folio skin from anti-slop-templates | Warm cream + terracotta + serif cluster we explicitly avoid |

## Recommended optional npm deps (MIT, not vendored)

- [`motion`](https://www.npmjs.com/package/motion) — MIT
- [`animejs`](https://www.npmjs.com/package/animejs) — MIT

Keep default sites CSS + IntersectionObserver only (zero dep).
