# Rechtliche Aspekte deutscher Branchen-Websites (Research)

> **Kein Rechtsrat.** Diese Übersicht dient der Factory-Pipeline (Intake, Checklisten, Gates).  
> Rechtsverbindliche Texte und Einzelfallfragen gehören zu Anwalt / Datenschutzbeauftragtem / Kammer.  
> Stand der Recherche: **2026-08-15**. Gesetze ändern sich — vor Go-Live Quellen prüfen.

## 1. Basispflichten (fast alle gewerblichen Sites)

| Thema | Rechtsrahmen (kurz) | Factory-Regel |
|-------|---------------------|---------------|
| **Impressum / Anbieterkennzeichnung** | Seit **14.05.2024**: **§ 5 DDG** (Digitale-Dienste-Gesetz) statt TMG | Impressum-Link max. 2 Klicks; **kein „§ 5 TMG“** mehr zitieren |
| **Datenschutzerklärung** | **DSGVO** Art. 12–14 + ggf. **TDDDG** | Eigene Seite `/datenschutz`, Footer-Link |
| **Cookies / Tracking / Device Access** | **§ 25 TDDDG** (+ DSGVO für personenbezogene Daten) | Analytics/Maps/Fonts von Drittservern → Einwilligung **vor** Laden; oder weglassen |
| **UWG / Abmahnrisiko** | Wettbewerbsrecht | Unvollständiges Impressum, irreführende Werbung, Fake-Reviews = Abmahnthema |
| **VSBG Streitbeilegung** | **§ 36 VSBG** (u. a. >10 Beschäftigte + Website/AGB) | Hinweis Teilnahme **oder** Nichtteilnahme; **keine OS-Plattform-Links mehr** (ab 20.07.2025 eingestellt) |
| **Barrierefreiheit** | **BFSG** ab **28.06.2025** | Vor allem bei **E-Commerce / Online-Vertragsabschluss B2C**; Kleinstunternehmen-Ausnahme prüfen |

### Impressum — Kernangaben (§ 5 DDG)

Immer (geschäftsmäßig, nicht rein privat):

1. Name / Firma (+ Rechtsform bei Gesellschaften)  
2. Vertretungsberechtigte (bei jur. Personen)  
3. **Ladungsfähige** Anschrift (Straße/Hausnr. — kein Postfach)  
4. Schnelle elektronische Kontaktaufnahme (E-Mail; Telefon üblich/erwartet)  
5. Register + Nummer (falls eingetragen)  
6. USt-IdNr. (falls vorhanden; **nicht** die Steuernummer)  
7. Ggf. Aufsichtsbehörde (zulassungspflichtige Tätigkeit)  
8. Ggf. Angaben reglementierter Beruf (§ 5 Abs. 1 Nr. 5)  
9. Ggf. Liquidationshinweis  

Quellen u. a.: IHK-Merkblätter DDG / Impressumspflichten 2025.

### Datenschutz & Tracking (praxisnah für KMU)

**Ohne Banner möglich**, wenn wirklich nur unbedingt erforderlich:

- Session / Formular-Spam-Schutz / Consent-Speicherung selbst  
- Kein Google Analytics, keine Marketing-Pixel, keine Social-Plugins  
- Externe Fonts/Maps/Videos vermeiden oder erst nach Consent laden  

**Factory-Default (empfohlen):** Privacy-first — selbst gehostete Fonts oder Systemfonts, kein GA, Maps nur als Link (nicht Embed), Formular über eigenen Endpoint.  
Plausible/Matomo/GA nur mit `launch.analytics` + Consent-Flow.

### BFSG (Barrierefreiheit)

- Gilt für bestimmte **Dienstleistungen im elektronischen Geschäftsverkehr** (Online-Shop, Online-Buchung, oft auch Vertragsabschluss-Flows B2C).  
- **Kleinstunternehmen** (<10 MA und ≤2 Mio. Umsatz/Bilanz) können von Dienstleistungs-Pflichten ausgenommen sein — **Einzelfall**.  
- Reine Visitenkarten-Sites ohne Online-Vertragsabschluss sind oft außerhalb — trotzdem A11y-Basics (Kontrast, Fokus, Alt) als Factory-Qualität.  
- Bei Betroffenheit: Erklärung zur Barrierefreiheit + WCAG/EN-301-549-Orientierung.

---

## 2. Branchenmatrix (Archetypen)

### A. Allgemeines lokales Gewerbe / B2B-Dienstleistung  
*(Archetyp `service-local-b2b`)*

| Pflicht / Risiko | Details |
|------------------|---------|
| Impressum DDG | Standard + HRB/USt falls vorhanden |
| Datenschutz | Formular: Zweck, Rechtsgrundlage, Speicherdauer, Empfänger |
| VSBG | Bei >10 MA Hinweis |
| Content | Keine irreführenden Garantien (UWG) |
| OS-Plattform | Entfernen |

### B. Handwerk (`handwerk-local`)

| Extra | Details |
|-------|---------|
| HWK | Oft Handwerkskammer-Mitgliedschaft; Gesundheitshandwerke: Berufsbezeichnung, Staat, HWK, HwO-Link |
| Aufsicht | Nur bei speziellen zulassungspflichtigen Handwerken (z. B. Bezirksschornsteinfeger, Büchsenmacher) Aufsicht nennen |
| Preise | Preisangabenverordnung bei Verbrauchern (Endpreise, USt) wenn Preise beworben werden |
| Reviews | Nur echte, freigegebene Bewertungen |

Quelle Orientierung: HWK-Praxisblätter Impressum Handwerk.

### C. Gastronomie / Hotel (`gastro-local`)

| Extra | Details |
|-------|---------|
| Aufsicht | Gaststättenerlaubnis → zuständige Kreisverwaltungsbehörde im Impressum |
| Allergene / Speisekarte | Kennzeichnungspflichten bei Online-Speisekarten (LMIV) — Content-Gate |
| Buchung online | Kann BFSG / Widerruf / AGB triggern |
| Alkohol / Glücksspiel-Werbung | Alters-/Werbebeschränkungen beachten |
| Fotos von Gästen | Einwilligung |

### D. Praxis / Heilberufe (`praxis-local`)

| Extra | Details |
|-------|---------|
| Impressum | Berufsbezeichnung, Approbationsstaat, **Ärztekammer**, ggf. **KV**, Links zu Berufsordnung / Kammergesetz |
| **HWG** | Keine Heilversprechen, keine unzulässigen Vorher-Nachher-Bilder, keine irreführende Wirkungsversprechen |
| Facharzt-/Schwerpunktangaben | Nur zulässige Bezeichnungen |
| Online-Termin | Datenschutz (Gesundheitsdaten = besondere Kategorien Art. 9 DSGVO) — erhöhte Sorgfalt |
| Bewertungen | Vorsichtig; keine gesteuerten Fake-Reviews |

Quellen: Ärztekammer-Merkblätter DDG; HWG-Praxisleitfäden.

### E. Retail / Shop (`retail-local`)

| Extra | Details |
|-------|---------|
| Fernabsatz | Widerrufsbelehrung, AGB, Versand/Zahlungsinfos |
| PAngV | Endpreise inkl. USt und Versandhinweise |
| BFSG | Online-Shop typischerweise betroffen (außer Kleinstunternehmen-Ausnahme) |
| Produktbilder | Rechteklarheit; keine irreführenden Claims |

### F. Makler / Finanz / erlaubnispflichtige Gewerbe

| Extra | Details |
|-------|---------|
| Aufsicht | § 34c / 34d / 34f GewO etc. → Aufsichtsbehörde + Erlaubnis im Impressum |
| Content | Strenge Werbe-/Informationspflichten je Erlaubnis |

### G. Anwälte / Steuerberater / Architekten (reglementiert)

| Extra | Details |
|-------|---------|
| Kammer + Berufsrecht | Wie § 5 Abs. 1 Nr. 5 DDG |
| Berufsrechtliche Werbegrenzen | Kammerregeln prüfen |

---

## 3. Content-Verbote (branchenübergreifend + speziell)

| Nicht tun | Warum |
|-----------|--------|
| „§ 5 TMG“ / „§ 25 TTDSG“ als aktuelle Fundstelle | Veraltetes Recht → Abmahnrisiko |
| Link zur EU-OS-Plattform | Seit 20.07.2025 eingestellt — entfernen |
| Erfundene Testimonials / Logos | UWG + Vertrauensbruch |
| Heilversprechen (Praxis) | HWG |
| Preise ohne USt-Klarheit gegenüber Verbrauchern | PAngV |
| Tracking vor Consent | TDDDG § 25 |
| Stock-„Team“ als echte Mitarbeiter | Irreführung |

---

## 4. Factory-Pipeline: Legal Gates

```
Intake (LEGAL-INTAKE) → BRIEF.legal + BRIEF.regulated_profession
  → Content Lock (keine verbotenen Claims)
  → Build (Impressum/Datenschutz-Templates nach Branche)
  → Anti-Slop + Launch + Legal Lint
  → Human/Lawyer review für regulierte Berufe
  → Go-Live
```

### Automatisierbar (Warn/Error in Lint)

- Footer enthält Impressum + Datenschutz  
- Kein String `§ 5 TMG` / `TTDSG` als aktuelle Basis (außer historisch erklärt)  
- Kein `ec.europa.eu/odr` / OS-Plattform-Link  
- `legal.impressum_ready` / `privacy_ready` true vor Production  
- Bei `regulated_profession.enabled`: Pflichtfelder Kammer/Berufsbezeichnung gesetzt  
- Analytics nur mit Consent-Flag  
- Maps als Link bevorzugt; Embed → Consent-Hinweis  

### Nicht automatisierbar (Mensch / Anwalt)

- Vollständigkeit und Richtigkeit der Impressumsdaten  
- HWG-Konformität von Praxis-Texten  
- AGB / Widerruf für Shops  
- Ob BFSG für diesen Mandanten greift  
- AV-Verträge mit Hosting/Formular-Anbietern  

---

## 5. Empfohlene Default-Architektur (risikoarm)

Für typische KMU-Marketingseiten ohne Shop:

1. Static Hosting in DE/EU  
2. Impressum + Datenschutz immer verlinkt  
3. Kontaktformular ohne Third-Party-Tracker  
4. Keine Cookie-Banner nötig, wenn keine einwilligungspflichtigen Zugriffe  
5. Google Fonts selbst hosten oder Systemstack  
6. Maps nur Deeplink  
7. VSBG-Hinweisbaustein im Impressum (je Mitarbeiterzahl)  
8. Keine OS-Plattform  

---

## 6. Quellen (Auswahl)

- IHK: Impressumspflichten / DDG-Merkblätter (2024–2025)  
- Ärztekammern: Pflichtangaben Praxis-Homepage nach DDG  
- HWK: Impressum Handwerk / Gesundheitshandwerke  
- LfD / DSK: Orientierungshilfe digitale Dienste, TDDDG § 25  
- Bundesfachstelle Barrierefreiheit: BFSG-FAQ  
- gesetze-im-internet.de: BFSG, DDG  

---

## 7. Nächste Factory-Schritte

1. `LEGAL-INTAKE.md` im Kundengespräch ausfüllen  
2. Archetyp-spezifische Impressum-Partials (`praxis`, `handwerk`, `gastro`, `retail`)  
3. Legal-Lint-Rules in `@sbl-web/anti-slop`  
4. Optional: Anwalts-Review-Flag als Go-Live-Blocker für `praxis-local` / Shop  
