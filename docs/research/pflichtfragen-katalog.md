# Pflichtfragen-Katalog — Deep Research

> Katalog für den **einen Fragebogen**, aus dem die Factory Website + Docker erzeugt.  
> Stand Research: 2026-08-15 · Quellen: Agentur-Discovery-Praxis, DE-Recht (DDG/TDDDG/BFSG), Local-SEO-Intake, SBL Launch/Legal Gates.  
> **Kein Rechtsrat.**

Maschinenlesbar: [`pflichtfragen.catalog.yaml`](./pflichtfragen.catalog.yaml)  
Schema für Form-UI: [`../schemas/questionnaire.schema.json`](../schemas/questionnaire.schema.json)

---

## 1. Forschungsfazit

Agentur-Discovery (u. a. YourWebTeam 85er-Scoping, Ybug 32er-Fragebogen, DE-Briefing-Vorlagen) und Local-Business-Intake konvergieren auf **dieselben Kernblöcke**:

1. **Wer / NAP** — Name, Adresse, Telefon konsistent  
2. **Wozu** — ein Primärziel + messbarer Erfolg  
3. **Für wen** — Zielgruppe + Einwände  
4. **Was** — Leistungen + Beweis  
5. **Handlung** — ein CTA above the fold  
6. **Inhalt & Rechte** — wer liefert Texte/Bilder, Freigaben  
7. **Technik** — Domain, Formular, Analytics  
8. **Recht (DE)** — Impressum/Datenschutz/Branche  

Für „nur Fragebogen → Docker“ gilt:

| Stufe | Bedeutung | Ohne Antwort |
|-------|-----------|--------------|
| **P0 Muss** | Generation/Deploy blockiert | `factory draft` / `ship` stoppt |
| **P1 Soll** | Qualität/Conversion/SEO | Defaults + Warnung |
| **P2 Branch** | Nur bei Archetyp/Branche | Conditional required vor Ship |
| **P3 Nice** | Später / Relaunch | Optional |

**Zählung im Katalog:** 23× P0 · 15× P1 · 18× P2 (conditional) · 6× P3.  
Empfehlung aus Research: **~23 Pflichtfelder + Branchengates** für KMU-Marketingseiten — nicht 85. Lange Listen gehören in Follow-up-Calls, nicht in den Generator-Fragebogen.

Verwandte Intake-Docs (Detailfragen, keine zweite Wahrheit):

- Launch-20 → [`INTAKE-QUESTIONS.md`](../../templates/client-brief/INTAKE-QUESTIONS.md)  
- Legal → [`LEGAL-INTAKE.md`](../../templates/client-brief/LEGAL-INTAKE.md)  
- **Ausfüll-PDF (CI):** [`SBL-Web-Kundenfragebogen.pdf`](../../brand/exports/SBL-Web-Kundenfragebogen.pdf)  
- Master = dieser Katalog + YAML

---

## 2. P0 — Absolute Pflicht (Generator-Blocker)

Ohne diese Felder keine Site / kein Docker-Ship.

### 2.1 Identität & NAP (Local SEO + Impressum)

| ID | Frage | BRIEF-Pfad | Warum Pflicht |
|----|-------|------------|---------------|
| Q01 | Firmenname (Marke, wie auf der Site) | `business.name` | Brand, Titles, Schema |
| Q02 | Rechtlicher Name (falls anders) | `business.legal_name` | Impressum DDG |
| Q03 | Rechtsform | `legal.legal_form` | Impressum |
| Q04 | Vertretungsberechtigte Person | `legal.owner` | Impressum |
| Q05 | Ladungsfähige Straße + Hausnr. | `contact.address` | DDG — kein Postfach |
| Q06 | PLZ + Ort | `business.city` + Adresse | NAP, Schema |
| Q07 | Region / Einzugsgebiet | `business.region` | Lokaler Claim |
| Q08 | Telefon (mit Vorwahl) | `contact.phone` | NAP, CTA, Schema |
| Q09 | E-Mail | `contact.email` | Impressum, Formulare |
| Q10 | Branche (Freitext + Kategorie) | `business.industry` + `archetype` | Tokens, Legal-Zweig |

### 2.2 Ziel & Conversion

| ID | Frage | BRIEF-Pfad | Warum |
|----|-------|------------|-------|
| Q11 | **Eine** Primärhandlung | `goal.primary` | Hero-CTA, Sticky CTA |
| Q12 | CTA-Label (Kundenwortlaut) | `contact.cta_label` | Copy + Buttons |
| Q13 | USP in **einem** Satz (selbst formuliert) | `usp` | Hero — AI darf kürzen, nicht erfinden |
| Q14 | Antwortzeit-Versprechen | `contact.response_time_promise` | Trust + Launch-Gate |

### 2.3 Angebot (Minimum)

| ID | Frage | BRIEF-Pfad | Warum |
|----|-------|------------|-------|
| Q15 | 3–6 Leistungen (Titel + 1 Satz) | `services[]` | Topics/Examples-Draft |
| Q16 | Primäre Zielgruppe (1–2 Sätze) | `audience.primary` | Ton, FAQ |
| Q17 | 3–5 typische Einwände/Fragen | `audience.objections[]` | FAQ-Draft (≥5) |

### 2.4 Domain & Ship

| ID | Frage | BRIEF-Pfad | Warum |
|----|-------|------------|-------|
| Q18 | Produktionsdomain / Wunschdomain | `hosting.production_domain` + `site_url` | OG, Schema, Traefik, robots |
| Q19 | Formular-Ziel (URL Endpoint) **oder** „erst Staging ohne Versand“ | `hosting.form_endpoint` | Echtes Formular vs. Demo |
| Q20 | Impressum-Daten vollständig? (Checkbox) | `legal.impressum_ready` | Legal-Gate |
| Q21 | Datenschutz freigegeben / wer liefert Text? | `legal.privacy_ready` + Hinweis | Legal-Gate |

### 2.5 Assets (Minimum)

| ID | Frage / Upload | BRIEF-Pfad | Warum |
|----|----------------|------------|-------|
| Q22 | Logo-Datei | `assets.logo` | Brand |
| Q23 | Mind. 1 Foto **oder** explizit „kein Foto, atmosphärischer Default“ | `assets.photos[]` / `missing` | Anti-Stock-Policy |

---

## 3. P1 — Soll (Defaults möglich, Warnung wenn leer)

| ID | Frage | Default wenn leer | BRIEF |
|----|-------|-------------------|-------|
| Q30 | Öffnungszeiten | „nach Vereinbarung“ | `contact.hours` |
| Q31 | Google-Maps-Link | aus Adresse generieren | `contact.maps_url` |
| Q32 | Tagline (kurz) | aus USP kürzen | `business.tagline` |
| Q33 | Sekundäres Ziel | keines | `goal.secondary` |
| Q34 | Erfolgsmetric | „Anfragen/Monat“ | `goal.success_metric` |
| Q35 | 3 Referenzen „so / nicht so“ (URLs) | Archetyp-Default | `positioning.*` |
| Q36 | Akzentfarbe oder „Factory wählt“ | Hue außerhalb 200–290 | `tokens` via Draft |
| Q37 | Analytics | `none` | `launch.analytics` |
| Q38 | Sticky Mobile CTA ja/nein | ja | `launch.sticky_mobile_cta` |
| Q39 | OG-Bild Upload | aus Logo generieren | `assets.og_image` |
| Q40 | Register + USt-Id | weglassen wenn keine | `legal.registry`, `vat_id` |
| Q41 | >10 MA → VSBG-Teilnahme | Standard-Nichtteilnahme-Text | `legal.vsbg_*` |
| Q42 | Social/GBP-Links | keine | optional `sameAs` später |
| Q43 | Servicegebiet (Städte/PLZ) | = Region | Content/SEO |
| Q44 | Sprachen | nur DE | hosting/content |

---

## 4. P2 — Branchen-bedingt (Conditional Required)

### 4.1 Handwerk (`handwerk-local`)

| ID | Frage |
|----|-------|
| H01 | Eingetragenes / zulassungspflichtiges Handwerk? |
| H02 | Gesundheitshandwerk? → Berufsbezeichnung, Staat, HWK, HwO-Link |
| H03 | Spezielle Aufsicht (Schornsteinfeger, Büchsenmacher, …)? |

### 4.2 Gastro (`gastro-local`)

| ID | Frage |
|----|-------|
| G01 | Zuständige Erlaubnisbehörde |
| G02 | Online-Speisekarte / Allergene? |
| G03 | Online-Reservierung/Bestellung (Vertragsabschluss)? → BFSG/Widerruf |

### 4.3 Praxis / Heilberufe (`praxis-local`)

| ID | Frage |
|----|-------|
| M01 | Berufsbezeichnung + Approbationsstaat |
| M02 | Ärztekammer (Name, Adresse, URL) |
| M03 | KV falls zutreffend |
| M04 | Links Berufsordnung |
| M05 | HWG-Freigabe Werbetexte (Checkbox + Freigeber) |
| M06 | Online-Termin mit Gesundheitsdaten? |

### 4.4 Retail / Shop (`retail-local`)

| ID | Frage |
|----|-------|
| R01 | B2C Fernabsatz? → AGB/Widerruf vorhanden? |
| R02 | Preise inkl. USt anzeigen? |
| R03 | BFSG / Kleinstunternehmen-Ausnahme dokumentieren |
| R04 | Zahlung/Versand kurz |

### 4.5 Erlaubnispflichtig / Kammer

| ID | Frage |
|----|-------|
| L01 | Erlaubnisnorm + Aufsichtsbehörde |
| L02 | Kammer + Berufsrecht-Links |

---

## 5. P3 — Nice / später (nicht Generator-Blocker)

- Blog / Ratgeber geplant?  
- Mehrstandorte?  
- CRM-Integration (HubSpot, …)?  
- Buchungstool (Calendly, …)?  
- Wartungsvertrag?  
- Budget/Timeline (für Agentur-Scope, nicht für Generator)  
- Entscheider + Abnahmeweg (Prozess)  
- Cases/Reviews (nur mit Freigabe)  
- Teamfoto  

---

## 6. Mapping: Fragebogen → Factory

```
Questionnaire (P0+P1+P2)
        │
        ▼
   BRIEF.yaml  (+ Uploads → assets/)
        │
        ├─► tokens draft (Farbe/Fonts aus Stimmung + Guards)
        ├─► CONTENT draft (USP→Hero, Services→Topics, Einwände→FAQ)
        ├─► Legal pages (Impressum-Felder, Privacy-Slots)
        └─► launch defaults (404, robots, sticky, schema)
        │
        ▼
 factory check → build → docker compose up
```

**AI darf nicht erfinden:** USP-Claims, Preise, Garantien, Reviews, Team, medizinische Aussagen, fehlende Impressumsdaten.

---

## 7. Empfohlene Fragebogen-UX (Research → Praxis)

1. **Kurzform zuerst** (~12 Felder): `Q01, Q05–Q09, Q11–Q13, Q15, Q18, Q22`  
2. **Dann Conditional:** Branche öffnet P2-Block  
3. **Dann Legal-Block** (`Q03/Q04/Q20/Q21` oder Upload fertiger Texte)  
4. **Uploads parallel** (Logo / Foto oder Skip `Q23`)  
5. Absenden = `BRIEF` schreiben + `factory draft` + optional `ship`  
6. P1-Felder mit Defaults auffüllen (Warnung, kein Blocker)

Zeitaufwand Ziel: **15–25 Minuten** für KMU-Inhaber.

---

## 8. Quellen (Auswahl)

- Agency discovery questionnaires (YourWebTeam, Ybug, Lightspeed, Playcode, Symaxx)  
- DE Briefing-Leitfäden (PAKU, IHP Media, Klicklounge)  
- DDG Impressum / DSGVO / TDDDG / BFSG (IHK, Kammern — siehe `legal-de-branchen.md`)  
- Local SEO / location page intake (NAP, CTA, FAQ, schema, reviews)  
- SBL intern: Launch 20, Legal-Intake, BRIEF schema  

---

## 9. Nächster Bau-Schritt

1. Form-UI an `questionnaire.schema.json` + Katalog-YAML  
2. Submit → `clients/<slug>/BRIEF.yaml` + Assets  
3. `factory ship <slug>` = check + build + docker up  
4. Optional: `factory check` gegen `factory_draft_requires` / `factory_ship_requires`  
