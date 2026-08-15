# Anti-Slop Lint Spec (MVP)

Ziel: Automatische Checks, bevor eine Client-Site nach Staging darf.

## Rules (v0)

| ID | Check | Severity |
|----|-------|----------|
| AS001 | Fonts: keine Inter/Roboto/Arial/Poppins/Open Sans als Primary | error |
| AS002 | Accent hue nicht in 200–290 | error |
| AS003 | Kein `from-*-600 to-purple` / blue-purple gradient als Hero-Identität | error |
| AS004 | Hero enthält keine Stat-Strip / Badge-Cluster / Feature-Cards | error |
| AS005 | Banlist-Phrasen in Content.yaml | error |
| AS006 | Platzhalter: Lorem, Firma XY, 0000, your@email | error |
| AS007 | `prefers-reduced-motion` vorhanden | warn |
| AS008 | `::selection` definiert | warn |
| AS009 | Impressum + Datenschutz verlinkt | error |
| AS010 | Mehr als eine CTA-Hierarchie im Hero | warn |

## Implementation sketch

```bash
# später: packages/anti-slop
pnpm anti-slop ./clients/<slug>
```

Eingaben:

- `tokens.json` (Hue, Fonts)
- `CONTENT.yaml` (Banlist, Platzhalter)
- gebautes HTML/CSS (Gradient-/Class-Heuristiken)

Exit code ≠ 0 blockiert Deploy-Script.
