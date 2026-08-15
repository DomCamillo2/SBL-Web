# Launch Checklist Gate

Die 20 Launch-Aspekte sind Teil der Factory — nicht „nice to have nach dem Launch“.

## Wann

Nach Content Lock, vor Staging-Freigabe und erneut vor Production DNS.

```
Content Lock → Build → Anti-Slop → Launch Checklist → Staging → Go-Live
```

## Automatisch prüfbar (`pnpm anti-slop` / launch rules)

| ID | Check |
|----|-------|
| LC01 | `404` page exists |
| LC02 | Hero CTA present (content hero.cta_*) |
| LC03 | Internal nav links ≥ 2 destinations |
| LC04 | `/danke` (thank-you) page exists |
| LC05 | Breadcrumbs component used on inner pages OR launch.breadcrumbs=false |
| LC06 | FAQ section with ≥ 5 items if launch.faq_required |
| LC07 | Response-time promise in brief.contact or content |
| LC08 | Sticky mobile CTA markup present if launch.sticky_mobile_cta |
| LC09 | `robots.txt` present |
| LC10 | Unique titles across pages |
| LC11 | meta_description on every page |
| LC12 | og:image configured (brief.launch.og_image or default) |
| LC13 | maps_url or address for local schema |
| LC14 | Reviews only if launch.reviews.enabled + items |
| LC15 | No `<img>` without alt in site source |
| LC16 | JSON-LD LocalBusiness emitted |
| LC17 | Datenschutz + Impressum linked |
| LC18 | Analytics snippet only if launch.analytics.enabled |
| LC19 | Team photo path or honest skip flag |
| LC20 | Case studies only if provided (no invented logos) |

## Menschlich prüfen

- Ton der 404 und Danke-Seite
- Ob Reviews/Cases wirklich freigegeben sind
- Analytics-Einwilligung (DSGVO)
- Sticky CTA verdeckt keinen Content
