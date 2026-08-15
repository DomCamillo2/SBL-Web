# SBL-Web — Corporate Identity

Marke der Website-Factory (dieses Repo).  
**Nicht** für Kunden-Sites kopieren — Kunden bekommen eigene Tokens aus dem Brief.

## Essenz

| | |
|--|--|
| **Name** | SBL-Web |
| **Kurz** | SBL |
| **Tagline** | Website-Factory für KMU — strukturiert, nicht vibecoded. |
| **Idee** | Werkbank statt Prompt-Casino: Brief → Lock → Build → Docker |

## Logo

| Datei | Verwendung |
|-------|------------|
| [`logo/sbl-mark.svg`](./logo/sbl-mark.svg) | **Kanonische** Primärmarke |
| [`logo/sbl-mark.png`](./logo/sbl-mark.png) | Raster-Export der Marke |
| [`logo/sbl-avatar.png`](./logo/sbl-avatar.png) | 400×400 für GitHub |
| [`logo/sbl-wordmark.svg`](./logo/sbl-wordmark.svg) | Header, README |
| [`logo/sbl-wordmark.png`](./logo/sbl-wordmark.png) | Social / Docs |
| [`logo/sbl-lockup.svg`](./logo/sbl-lockup.svg) | Marke + Tagline |
| [`logo/favicon.svg`](./logo/favicon.svg) | Favicon (dunkle Kachel) |
| [`logo/sbl-mark-on-dark.svg`](./logo/sbl-mark-on-dark.svg) | Marke auf dunklem Grund |
| [`logo/reference/`](./logo/reference/) | Frühe Konzept-Raster (nicht kanonisch) |

**Markenzeichen:** Drei präzise Balken („Fertigungslinie“) — der untere rechte Abschnitt in Kupfer signalisiert den fertigen Schnitt / Ship.

### Regeln

- Freiraum: mind. ¼ der Markenhöhe um das Logo
- Nicht drehen, nicht mit Glow/Schatten versehen, nicht in Karten „einbetten“ als Deko
- Auf hellem Grund: Tinte `#141816` + Akzent `#C45C26`
- Auf dunklem Grund: Paper `#F3F5F2` + gleicher Kupfer-Akzent
- Wordmark nicht auseinanderziehen; SVG bevorzugen

## Farbe

Maschinenlesbar: [`tokens.json`](./tokens.json)

| Token | Hex | Rolle |
|-------|-----|-------|
| `ink` | `#141816` | Text, Marke |
| `paper` | `#F3F5F2` | Flächen |
| `accent` | `#C45C26` | CTA, Ship-Signal |
| `line` | `#C8CFC6` | Linien |

**Verboten als Primary:** Blau→Lila / Indigo (Hue 200–290), generisches Purple-SaaS, Cream+Terracotta-Klischee als Gesamtskin.

## Typografie

- **UI / Docs:** IBM Plex Sans  
- **Code:** IBM Plex Mono  
- **Nicht:** Inter, Roboto, Arial, Poppins, Open Sans, Montserrat  

## Stimme

Klar, handwerklich, präzise. Keine leeren KI-Phrasen („innovativ“, „ganzheitlich“, „AI-powered“).

## Kundenfragebogen (PDF)

Druck-/Ausfüllversion des Pflichtfragen-Katalogs in Factory-CI:

- Datei: [`exports/SBL-Web-Kundenfragebogen.pdf`](./exports/SBL-Web-Kundenfragebogen.pdf)
- Generator: `python3 scripts/generate-fragebogen-pdf.py` (liest `docs/research/pflichtfragen.catalog.yaml`)

## GitHub

1. Repo-Avatar: `brand/logo/sbl-avatar.png` (in GitHub → Settings → General → oder Org-Avatar manuell setzen)  
2. README zeigt Wordmark oben  
3. Social Preview optional: `brand/exports/github-social.svg`

## Kunden-Sites

Kunden-CI entsteht aus `BRIEF` + `tokens.json` des Clients — **nicht** aus dieser Factory-CI.
