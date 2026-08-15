# Pipeline-Audit — Wenig Handarbeit

Stand: 2026-08-15  
Ziel: Neue KMU-Site = **Brief ausfüllen → Draft prüfen → Lock → Deploy**, ohne Seiten zu kopieren.

## Ist-Zustand (vor diesem Refactor)

| Bereich | Status | Handarbeit |
|---------|--------|------------|
| Anti-Slop / Launch / Legal Lint | Stark | Niedrig |
| Ein Demo end-to-end | Stark | — |
| Seiten pro Client kopiert | Schwach | **Hoch** |
| `new-client.sh` klont Demo | Schwach | **Hoch** |
| CONTENT von Hand | Schwach | **Hoch** |
| Google Fonts CDN | Risiko | Mittel |
| Formular nur GET→/danke | Stub | Hoch vor Go-Live |
| Schema-Validierung | Fehlt | Mittel |
| Sitemap | Fehlt | Niedrig |
| Traefik live | Skizze | Ops |

## Soll-Zustand (Operating Model)

```
pnpm factory new <slug>
  → BRIEF skeleton + tokens + thin Astro shell

# Gespräch / Formular → BRIEF füllen (einzige echte Handarbeit + Assets)

pnpm factory draft <slug>
  → CONTENT.yaml Entwurf aus BRIEF (Services, FAQ aus Einwänden, Hero aus USP)

# Mensch prüft Copy + Design-Tokens + Rechtstexte → Locks

pnpm factory check <slug>
  → Schema + Anti-Slop + Launch + Legal

pnpm --filter @sbl-web/<slug> build && docker …
```

**Mensch bleibt nötig für:** USP/Claims, Design-Freigabe, echte Fotos/Reviews, Impressum-Daten, Anwaltsfreigabe bei regulierten Berufen, DNS.  
**Nicht nötig:** Seiten-Boilerplate, FAQ-Gerüst, Impressum-Layout, robots/OG/Schema-Verkabelung, Nav aus Pages.

## Maßnahmen in diesem Refactor

1. Routen/Seiten-Logik → Archetyp (`routes/*`); Client nur Thin-Wrapper  
2. `packages/factory` CLI: `new`, `draft`, `check`  
3. Fonts ohne Google-CDN (Fontsource)  
4. Formular-Ziel aus `BRIEF.hosting.form_endpoint`  
5. Sitemap-Plugin + robots  
6. JSON-Schema-Validierung im Check  

**Erledigt.** Verbleibende Handarbeit: Brief-Fakten, Design-Lock, Content-Review, Legal-Approve, Assets, DNS.
