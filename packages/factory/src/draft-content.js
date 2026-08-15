import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

export async function draftContent(slug, { force = false } = {}) {
  if (!slug) throw new Error("slug required");
  const dir = path.join(ROOT, "clients", slug);
  const briefPath = path.join(dir, "BRIEF.yaml");
  const contentPath = path.join(dir, "CONTENT.yaml");

  const brief = parseYaml(await fs.readFile(briefPath, "utf8"));
  let existing = null;
  try {
    existing = parseYaml(await fs.readFile(contentPath, "utf8"));
  } catch {
    /* none */
  }

  if (existing?.pages?.length && !force) {
    throw new Error(
      `CONTENT.yaml already has pages. Re-run with --force to overwrite draft (slug=${slug}).`,
    );
  }

  const name = brief.business?.name || slug;
  const region = brief.business?.region || brief.business?.city || "Ihrer Region";
  const usp = String(brief.usp || "").trim();
  const cta = brief.contact?.cta_label || "Kontakt aufnehmen";
  const response = brief.contact?.response_time_promise || "Wir melden uns zeitnah.";
  const services = brief.services?.length
    ? brief.services
    : [{ name: "Beratung", summary: "Individuelle Unterstützung für Ihr Vorhaben." }];
  const objections = brief.audience?.objections?.length
    ? brief.audience.objections
    : [
        "Zu aufwendig für uns",
        "Unklarer Nutzen",
        "Zu teuer",
        "Keine Kapazität im Team",
        "Datenschutz bedenken",
      ];

  // pad FAQ to ≥5
  const faqItems = objections.slice(0, 5).map((q) => ({
    title: typeof q === "string" && q.endsWith("?") ? q : `${q}?`,
    body: "Dazu klären wir im Erstgespräch Ihren konkreten Ablauf, Nutzen und Aufwand — ohne Standardsoftware-Zwang.",
  }));
  while (faqItems.length < 5) {
    faqItems.push({
      title: "Wie starten wir?",
      body: "Mit einem klar abgegrenzten Ablauf und messbaren Erfolgskriterien.",
    });
  }

  const content = {
    slug,
    locale: "de-DE",
    brand_voice_notes: `Abgeleitet aus BRIEF für ${name}. Bitte menschlich nachschärfen vor content.lock.`,
    draft: true,
    forbidden_phrases: [
      "Unlock the power",
      "Seamless",
      "Cutting-edge",
      "Next-level",
      "Revolutionize",
      "Ganzheitliche Lösungen",
      "Mit Leidenschaft und Innovation",
    ],
    seo_defaults: {
      site_name: name,
      title_suffix: ` | ${name}`,
      default_description: usp.slice(0, 155) || `${name} in ${region}`,
    },
    pages: [
      {
        id: "home",
        path: "/",
        title: brief.business?.tagline || name,
        meta_description: (usp || `${name} — ${region}`).slice(0, 155),
        sections: [
          {
            id: "hero",
            job: "Marke + eine Aussage + eine Handlung",
            headline: brief.business?.tagline || usp.split(".")[0] || name,
            support: usp,
            cta_label: cta,
            cta_href: "/kontakt",
          },
          {
            id: "pain_points",
            job: "Probleme der Zielgruppe",
            eyebrow: "Alltag",
            headline: "Wo im Alltag Zeit verloren geht",
            support: "Wir starten bei Ihrem konkreten Ablauf — nicht bei einem Tool.",
            items: objections.slice(0, 3).map((o) => ({
              title: String(o).replace(/\?$/, ""),
              body: "Das klären wir im Prozess-Check mit Blick auf Systeme, Daten und Ausnahmen.",
            })),
          },
          {
            id: "topics",
            job: "Leistungen",
            eyebrow: "Leistungen",
            headline: "Wobei wir unterstützen",
            support: `Schwerpunkte für ${brief.audience?.primary || "Ihre Zielgruppe"}.`,
            items: services.map((s) => ({
              title: s.name,
              body: s.summary,
              meta: s.proof,
            })),
          },
          {
            id: "examples",
            job: "Konkrete Startpunkte",
            eyebrow: "Beispiele",
            headline: "Typische Einstiege",
            support: "Klar abgegrenzt, mit menschlicher Kontrolle.",
            items: services.slice(0, 3).map((s) => ({
              title: s.name,
              body: s.summary,
            })),
          },
          {
            id: "method",
            job: "Phasen",
            eyebrow: "Vorgehen",
            headline: "Von der Prüfung bis zur Übergabe",
            support: "Jede Phase endet mit einem klaren Ergebnis.",
            items: [
              {
                title: "Prüfen",
                body: "Ablauf, Systeme und Risiken einordnen.",
                meta: "Ergebnis — Go/No-Go für einen Pilot",
              },
              {
                title: "Pilot",
                body: "Abgegrenzter Teil mit realen Fällen.",
                meta: "Ergebnis — messbare Resultate",
              },
              {
                title: "Anbinden",
                body: "Nur bestätigte Schritte mit Freigaben verbinden.",
                meta: "Ergebnis — dokumentierte Schnittstellen",
              },
              {
                title: "Übergeben",
                body: "Team und Kontrollen für den Betrieb vorbereiten.",
                meta: "Ergebnis — klare Zuständigkeit",
              },
            ],
          },
          {
            id: "faq",
            job: "Einwände",
            eyebrow: "FAQ",
            headline: "Häufige Fragen",
            support: "Aus den typischen Einwänden Ihres Briefings.",
            items: faqItems,
          },
          {
            id: "closing_cta",
            job: "Abschluss",
            headline: "Bereit für den nächsten Schritt?",
            support: response,
            cta_label: cta,
            cta_href: "/kontakt",
          },
        ],
      },
      {
        id: "method",
        path: "/vorgehen",
        title: "Vorgehen",
        meta_description: `So arbeiten wir mit ${name}: prüfen, pilotieren, anbinden, übergeben.`,
        sections: [
          {
            id: "method_detail",
            job: "Phasen vertiefen",
            eyebrow: "Vorgehen",
            headline: "Jede Phase liefert ein Ergebnis",
            support: "Transparent und kontrollierbar.",
            items: [
              {
                title: "Prüfen",
                body: "Ablauf und Systeme betrachten.",
                meta: "Ergebnis — nächster Schritt",
              },
              {
                title: "Pilot",
                body: "Mit Nutzenden testen.",
                meta: "Ergebnis — belastbare Erkenntnisse",
              },
              {
                title: "Anbinden",
                body: "Systeme und Freigaben verbinden.",
                meta: "Ergebnis — dokumentierte Flüsse",
              },
              {
                title: "Übergeben",
                body: "Betrieb und Verantwortung klären.",
                meta: "Ergebnis — Übergabe",
              },
            ],
          },
          {
            id: "closing_cta",
            job: "CTA",
            headline: "Fragen zum Ablauf?",
            support: response,
            cta_label: cta,
            cta_href: "/kontakt",
          },
        ],
      },
      {
        id: "contact",
        path: "/kontakt",
        title: "Kontakt",
        meta_description: `Kontakt zu ${name} — ${region}.`,
        sections: [
          {
            id: "contact_intro",
            job: "Anfrage",
            headline: cta,
            support: response,
          },
        ],
      },
      {
        id: "thanks",
        path: "/danke",
        title: "Danke",
        meta_description: "Vielen Dank — wir haben Ihre Anfrage erhalten und melden uns.",
        sections: [
          {
            id: "thanks_body",
            job: "Bestätigung",
            headline: "Danke. Wir haben Ihre Anfrage.",
            support: response,
            cta_label: "Zur Startseite",
            cta_href: "/",
          },
        ],
      },
    ],
  };

  const header = `# AUTO-DRAFT from BRIEF — review before content.lock\n# Generated by: pnpm factory draft ${slug}\n`;
  await fs.writeFile(contentPath, header + stringifyYaml(content));
  console.log(`Wrote draft CONTENT.yaml for ${slug}`);
  console.log("Review copy, then set locks.content_locked_at in BRIEF.yaml");
}
