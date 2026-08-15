# Intake-Fragen — Launch-Checklist (20 Punkte)

> Master-Katalog (P0–P3, ein Fragebogen → Factory):  
> [`docs/research/pflichtfragen-katalog.md`](../../docs/research/pflichtfragen-katalog.md)  
> **Ausfüll-PDF (CI):** [`brand/exports/SBL-Web-Kundenfragebogen.pdf`](../../brand/exports/SBL-Web-Kundenfragebogen.pdf)  
> Dieses Dokument ist die **Launch-Detailtiefe** (Checkliste #1–20), keine zweite Wahrheitsquelle.

Diese Fragen gehören in jedes Kundengespräch **vor** Design Lock.  
Antworten landen in `BRIEF.yaml` → Abschnitt `launch` (+ `contact` / `assets` / `legal`).

| # | Aspekt | Frage an den Kunden | Pipeline-Gate |
|---|--------|---------------------|---------------|
| 1 | Custom 404 | Brauchen wir eine markenspezifische 404 (Ton, CTA zurück zur Startseite)? | Seite `404` muss existieren |
| 2 | CTA above the fold | Was ist die **eine** Primärhandlung im Hero? (Anrufen / Formular / Termin) | Hero enthält genau einen Primär-CTA |
| 3 | Internal links | Welche 3–5 Seiten sollen sich gegenseitig verlinken? | Nav + kontextuelle Links + Footer |
| 4 | Thank-you page | Wohin nach Formular-Absendung? Text / Tracking-Event? | Seite `/danke` + Form action |
| 5 | Breadcrumbs | Unterseiten mit Pfad-Navigation? (ja bei ≥3 Ebenen / Leistungsseiten) | Breadcrumbs auf Innen-Seiten |
| 6 | Case studies | Habt ihr 1–3 echte Beispiele (anonymisiert ok)? Sonst weglassen. | Nur echte Cases — nie erfinden |
| 7 | 5 FAQs | Die 5 häufigsten Einwände/Fragen aus Verkaufsgesprächen? | FAQ-Sektion mit ≥5 Einträgen |
| 8 | Response time promise | In welcher Zeit meldet ihr euch verbindlich? (z. B. 24 h Werktag) | Promise sichtbar bei Kontakt/CTA |
| 9 | Sticky mobile CTA | Primär-CTA auf Mobile dauerhaft sichtbar? Label + Ziel? | Sticky bar nur Mobile, ein CTA |
| 10 | robots.txt | Indexierung erlauben? Staging blocken? | `robots.txt` + Staging noindex |
| 11 | Unique page titles | Seitentitel-Muster? (Leistung + Ort + Marke) | Jede Seite eigener `<title>` |
| 12 | Meta descriptions | Kurztexte pro Seite (max. ~155 Zeichen)? | `meta_description` pro Seite |
| 13 | Social share image | Habt ihr ein OG-Bild (1200×630) oder Logo auf Markenfläche? | `og:image` gesetzt |
| 14 | Maps + directions | Adresse + Google-Maps-Link / Einbettung? | Kontakt mit Karte/Link + Schema address |
| 15 | Real reviews | Echte Bewertungen (Google/ProvenExpert) mit Erlaubnis? | Nur echte Reviews; sonst Sektion aus |
| 16 | Alt text on images | Wer liefert Bildbeschreibungen? (Barrierefreiheit + SEO) | Jedes `<img>` hat sinnvolles `alt` |
| 17 | Local schema | Branche für LocalBusiness/ProfessionalService? | JSON-LD LocalBusiness |
| 18 | Privacy Policy | Datenschutztext fertig / wer liefert ihn? | `/datenschutz` verlinkt |
| 19 | Analytics | Google Analytics / Plausible / gar nicht (Privacy-first)? | Nur mit Einwilligung/Config |
| 20 | Team photo | Echtes Team-/Arbeitsfoto vorhanden? Sonst ehrliche Alternative | Kein Stock-Team; Asset oder Skip |

## Pflicht vs. optional

**Launch-Blocker (ohne Go-Live):** 1, 2, 4, 10–12, 16–18  
**Stark empfohlen:** 3, 5, 7–9, 13–14, 19  
**Nur mit echtem Material:** 6, 15, 20  

## Mapping in BRIEF.yaml

Siehe `launch:` in `docs/schemas/brief.schema.json` und Beispiel in `templates/client-brief/BRIEF.example.yaml`.
