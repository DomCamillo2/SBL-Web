#!/usr/bin/env python3
"""Generate SBL-Web Kundenfragebogen PDF from pflichtfragen.catalog.yaml (CI styling)."""

from __future__ import annotations

import argparse
from pathlib import Path

import yaml
from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Flowable,
)

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "docs/research/pflichtfragen.catalog.yaml"
FONTS = ROOT / "brand/fonts"
MARK = ROOT / "brand/logo/sbl-mark.png"
OUT_DEFAULT = ROOT / "brand/exports/SBL-Web-Kundenfragebogen.pdf"

INK = HexColor("#141816")
INK_SOFT = HexColor("#2A302C")
PAPER = HexColor("#F3F5F2")
PAPER_DEEP = HexColor("#E4E8E3")
ACCENT = HexColor("#C45C26")
LINE = HexColor("#C8CFC6")

PAGE_W, PAGE_H = A4
MARGIN = 16 * mm


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("Plex", str(FONTS / "IBMPlexSans-Regular.ttf")))
    pdfmetrics.registerFont(TTFont("Plex-Med", str(FONTS / "IBMPlexSans-Medium.ttf")))
    pdfmetrics.registerFont(TTFont("Plex-Semi", str(FONTS / "IBMPlexSans-SemiBold.ttf")))
    pdfmetrics.registerFont(TTFont("Plex-Bold", str(FONTS / "IBMPlexSans-Bold.ttf")))
    pdfmetrics.registerFont(TTFont("PlexMono", str(FONTS / "IBMPlexMono-Regular.ttf")))


def styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "cover_brand": ParagraphStyle(
            "cover_brand",
            parent=base["Normal"],
            fontName="Plex-Bold",
            fontSize=28,
            leading=34,
            textColor=INK,
            alignment=TA_LEFT,
        ),
        "cover_sub": ParagraphStyle(
            "cover_sub",
            parent=base["Normal"],
            fontName="Plex",
            fontSize=12,
            leading=18,
            textColor=INK_SOFT,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=base["Normal"],
            fontName="Plex-Bold",
            fontSize=16,
            leading=20,
            textColor=INK,
            spaceBefore=4,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Normal"],
            fontName="Plex-Semi",
            fontSize=11,
            leading=14,
            textColor=ACCENT,
            spaceBefore=10,
            spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["Normal"],
            fontName="Plex",
            fontSize=9,
            leading=12,
            textColor=INK_SOFT,
        ),
        "q_id": ParagraphStyle(
            "q_id",
            parent=base["Normal"],
            fontName="PlexMono",
            fontSize=8,
            leading=10,
            textColor=ACCENT,
        ),
        "q_prompt": ParagraphStyle(
            "q_prompt",
            parent=base["Normal"],
            fontName="Plex-Med",
            fontSize=9.5,
            leading=12.5,
            textColor=INK,
        ),
        "q_meta": ParagraphStyle(
            "q_meta",
            parent=base["Normal"],
            fontName="Plex",
            fontSize=7.5,
            leading=10,
            textColor=INK_SOFT,
        ),
        "footer": ParagraphStyle(
            "footer",
            parent=base["Normal"],
            fontName="Plex",
            fontSize=7,
            leading=9,
            textColor=INK_SOFT,
            alignment=TA_CENTER,
        ),
        "tier_badge": ParagraphStyle(
            "tier_badge",
            parent=base["Normal"],
            fontName="Plex-Bold",
            fontSize=8,
            leading=10,
            textColor=white,
        ),
    }


class AnswerLines(Flowable):
    """Ruled answer area for handwriting."""

    def __init__(self, width: float, lines: int = 2, gap: float = 7 * mm):
        super().__init__()
        self.width = width
        self.lines = lines
        self.gap = gap
        self.height = lines * gap + 2

    def draw(self) -> None:
        self.canv.setStrokeColor(LINE)
        self.canv.setLineWidth(0.6)
        y = self.height - 2
        for _ in range(self.lines):
            self.canv.line(0, y, self.width, y)
            y -= self.gap


class CheckboxRow(Flowable):
    def __init__(self, labels: list[str], width: float):
        super().__init__()
        self.labels = labels
        self.width = width
        self.height = 8 * mm

    def draw(self) -> None:
        c = self.canv
        x = 0
        box = 3.2 * mm
        c.setFont("Plex", 8)
        c.setFillColor(INK)
        c.setStrokeColor(INK)
        c.setLineWidth(0.8)
        col_w = self.width / max(len(self.labels), 1)
        for label in self.labels:
            c.rect(x, 2 * mm, box, box, stroke=1, fill=0)
            c.drawString(x + box + 1.5 * mm, 2.4 * mm, label)
            x += col_w


def draw_page_chrome(canvas, doc, *, cover: bool = False) -> None:
    canvas.saveState()
    # paper background
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    # top accent bar
    canvas.setFillColor(INK)
    canvas.rect(0, PAGE_H - 4 * mm, PAGE_W, 4 * mm, fill=1, stroke=0)
    canvas.setFillColor(ACCENT)
    canvas.rect(0, PAGE_H - 4 * mm, 28 * mm, 4 * mm, fill=1, stroke=0)

    if not cover:
        # footer
        canvas.setStrokeColor(LINE)
        canvas.setLineWidth(0.5)
        canvas.line(MARGIN, 12 * mm, PAGE_W - MARGIN, 12 * mm)
        canvas.setFont("Plex", 7)
        canvas.setFillColor(INK_SOFT)
        canvas.drawString(MARGIN, 7 * mm, "SBL-Web · Kundenfragebogen · Keine Rechtsberatung")
        canvas.drawRightString(PAGE_W - MARGIN, 7 * mm, f"{doc.page}")
        # small mark
        if MARK.exists():
            canvas.drawImage(
                str(MARK),
                PAGE_W - MARGIN - 8 * mm,
                PAGE_H - 14 * mm,
                width=8 * mm,
                height=8 * mm,
                mask="auto",
                preserveAspectRatio=True,
            )
    canvas.restoreState()


def group_label(group: str) -> str:
    return {
        "identity": "Identität & NAP",
        "legal": "Rechtliche Basis",
        "offer": "Angebot & Positionierung",
        "conversion": "Conversion",
        "hosting": "Domain & Technik",
        "assets": "Assets",
        "trust": "Vertrauen & Lokal",
        "design": "Design",
        "content": "Inhalt",
        "gate_handwerk": "Branchengate · Handwerk",
        "gate_gastro": "Branchengate · Gastronomie",
        "gate_praxis": "Branchengate · Praxis / Heilberufe",
        "gate_retail": "Branchengate · Retail / Shop",
        "gate_license": "Branchengate · Erlaubnis / Kammer",
        "later": "Später / Nice-to-have",
    }.get(group, group.replace("_", " ").title())


def answer_lines_for(q: dict) -> int:
    t = q.get("type", "string")
    if t in ("text", "list_string", "list_object", "object", "upload_or_skip"):
        return 3
    if t in ("boolean", "enum"):
        return 1
    return 2


def question_block(q: dict, sty: dict, content_w: float) -> KeepTogether:
    bits = []
    header = Table(
        [
            [
                Paragraph(q["id"], sty["q_id"]),
                Paragraph(q["prompt"], sty["q_prompt"]),
            ]
        ],
        colWidths=[16 * mm, content_w - 16 * mm],
    )
    header.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 2),
                ("TOPPADDING", (0, 0), (-1, -1), 2),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]
        )
    )
    bits.append(header)

    meta_parts = []
    path = q.get("brief_path") or (
        ", ".join(q["brief_paths"]) if q.get("brief_paths") else None
    )
    if path:
        meta_parts.append(f"BRIEF: <font name='PlexMono'>{path}</font>")
    if q.get("why"):
        meta_parts.append(q["why"])
    if q.get("when_archetype"):
        meta_parts.append(f"nur bei Archetyp <b>{q['when_archetype']}</b>")
    if q.get("when_flag"):
        meta_parts.append(f"Flag: <b>{q['when_flag']}</b>")
    if q.get("requires_lawyer"):
        meta_parts.append("<b>Anwalt / Freigabe empfohlen</b>")
    if meta_parts:
        bits.append(Paragraph(" · ".join(meta_parts), sty["q_meta"]))

    if q.get("type") == "boolean":
        bits.append(CheckboxRow(["Ja", "Nein"], content_w))
    elif q.get("type") == "enum" and q.get("enum"):
        bits.append(CheckboxRow([str(x) for x in q["enum"][:6]], content_w))
    else:
        bits.append(Spacer(1, 1.5 * mm))
        bits.append(AnswerLines(content_w, lines=answer_lines_for(q)))

    bits.append(Spacer(1, 3 * mm))
    return KeepTogether(bits)


def build_pdf(out: Path) -> None:
    register_fonts()
    sty = styles()
    catalog = yaml.safe_load(CATALOG.read_text(encoding="utf-8"))
    questions = catalog["questions"]
    tiers = catalog["tiers"]

    content_w = PAGE_W - 2 * MARGIN

    doc = BaseDocTemplate(
        str(out),
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title="SBL-Web Kundenfragebogen",
        author="SBL-Web",
        subject="Pflichtfragen-Katalog P0–P3",
    )

    frame_cover = Frame(MARGIN, MARGIN, content_w, PAGE_H - 2 * MARGIN, id="cover")
    frame_body = Frame(MARGIN, 16 * mm, content_w, PAGE_H - 34 * mm, id="body")

    doc.addPageTemplates(
        [
            PageTemplate(
                id="cover",
                frames=[frame_cover],
                onPage=lambda c, d: draw_page_chrome(c, d, cover=True),
            ),
            PageTemplate(
                id="body",
                frames=[frame_body],
                onPage=lambda c, d: draw_page_chrome(c, d, cover=False),
            ),
        ]
    )

    story: list = []

    # ── Cover ──────────────────────────────────────────────────
    story.append(Spacer(1, 28 * mm))
    if MARK.exists():
        from reportlab.platypus import Image as RLImage

        story.append(RLImage(str(MARK), width=22 * mm, height=22 * mm))
        story.append(Spacer(1, 8 * mm))
    story.append(Paragraph("SBL-Web", sty["cover_brand"]))
    story.append(Spacer(1, 3 * mm))
    # accent rule
    story.append(
        Table(
            [[""]],
            colWidths=[36 * mm],
            rowHeights=[2.2 * mm],
        )
    )
    story[-1].setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), ACCENT)]))
    story.append(Spacer(1, 8 * mm))
    story.append(Paragraph("Kundenfragebogen", sty["cover_brand"]))
    story.append(
        Paragraph(
            "Ein Formular → Brief → Website in Docker.<br/>"
            "Bitte handschriftlich oder digital ausfüllen. Dauer typisch 15–25 Minuten.",
            sty["cover_sub"],
        )
    )
    story.append(Spacer(1, 14 * mm))

    tier_rows = []
    for key in ("P0", "P1", "P2", "P3"):
        t = tiers[key]
        tier_rows.append(
            [
                Paragraph(f"<b>{key}</b> {t['label']}", sty["q_prompt"]),
                Paragraph(t["description"], sty["body"]),
            ]
        )
    tier_table = Table(tier_rows, colWidths=[42 * mm, content_w - 42 * mm])
    tier_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PAPER_DEEP),
                ("BOX", (0, 0), (-1, -1), 0.5, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.4, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    story.append(tier_table)
    story.append(Spacer(1, 16 * mm))
    story.append(
        Paragraph(
            "<b>Meta</b> (vor dem Start ausfüllen)",
            sty["h2"],
        )
    )
    for label in (
        "Kundenname / Projekt:",
        "Ansprechpartner:",
        "Datum:",
        "Archetyp (service-local-b2b / handwerk / gastro / praxis / retail):",
    ):
        story.append(Paragraph(label, sty["q_prompt"]))
        story.append(AnswerLines(content_w, lines=1, gap=8 * mm))
        story.append(Spacer(1, 2 * mm))

    story.append(Spacer(1, 10 * mm))
    story.append(
        Paragraph(
            "Hinweis: Dieses Dokument ist <b>keine Rechtsberatung</b>. "
            "Impressum, Datenschutz und Branchentexte müssen vom Mandanten "
            "bzw. Anwalt freigegeben werden. Katalog-Version "
            f"{catalog.get('version', '1.0.0')}.",
            sty["body"],
        )
    )

    story.append(NextPageTemplate("body"))
    story.append(PageBreak())

    # ── How to ─────────────────────────────────────────────────
    story.append(Paragraph("So nutzen Sie den Fragebogen", sty["h1"]))
    story.append(
        Paragraph(
            "1) Zuerst <b>P0</b> vollständig — ohne diese Felder keine Site-Generierung.<br/>"
            "2) <b>P1</b> soweit bekannt; leere Felder bekommen Factory-Defaults.<br/>"
            "3) Nur zutreffende <b>P2</b>-Blöcke (Branche) ausfüllen.<br/>"
            "4) <b>P3</b> optional für spätere Ausbaustufen.<br/>"
            "5) Logo/Fotos parallel schicken. Antworten landen in BRIEF.yaml.",
            sty["body"],
        )
    )
    story.append(Spacer(1, 4 * mm))
    story.append(
        Paragraph(
            "Kurzform zuerst (wenn Zeit knapp): Q01, Q05–Q09, Q11–Q13, Q15, Q18, Q22 — "
            "dann Legal Q03/Q04/Q20/Q21 und Upload Q23.",
            sty["body"],
        )
    )
    story.append(PageBreak())

    # ── Questions by tier ──────────────────────────────────────
    by_tier: dict[str, list] = {"P0": [], "P1": [], "P2": [], "P3": []}
    for q in questions:
        by_tier.setdefault(q["tier"], []).append(q)

    tier_titles = {
        "P0": "P0 — Muss (Generator-Blocker)",
        "P1": "P1 — Soll (Defaults möglich)",
        "P2": "P2 — Branchengates (nur wenn zutreffend)",
        "P3": "P3 — Nice / später",
    }

    for tier in ("P0", "P1", "P2", "P3"):
        story.append(Paragraph(tier_titles[tier], sty["h1"]))
        story.append(Paragraph(tiers[tier]["description"], sty["body"]))
        story.append(Spacer(1, 2 * mm))

        current_group = None
        for q in by_tier.get(tier, []):
            g = q.get("group", "")
            if g != current_group:
                current_group = g
                story.append(Paragraph(group_label(g), sty["h2"]))
            story.append(question_block(q, sty, content_w))

        story.append(PageBreak())

    # ── Closing ────────────────────────────────────────────────
    story.append(Paragraph("Abgabe & nächste Schritte", sty["h1"]))
    story.append(
        Paragraph(
            "Nach Ausfüllen: Dateien (Logo, Fotos) + dieses PDF an SBL-Web senden.<br/>"
            "Pipeline: <font name='PlexMono'>factory new → BRIEF → draft → check → build → Docker</font>",
            sty["body"],
        )
    )
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("Freigaben", sty["h2"]))
    story.append(CheckboxRow(["Impressum freigegeben", "Datenschutz freigegeben"], content_w))
    story.append(Spacer(1, 3 * mm))
    story.append(CheckboxRow(["Assets vollständig", "Anwalt geprüft (falls nötig)"], content_w))
    story.append(Spacer(1, 10 * mm))
    story.append(Paragraph("Unterschrift Kunde", sty["q_prompt"]))
    story.append(AnswerLines(content_w * 0.55, lines=1, gap=12 * mm))
    story.append(Spacer(1, 6 * mm))
    story.append(Paragraph("Unterschrift SBL-Web", sty["q_prompt"]))
    story.append(AnswerLines(content_w * 0.55, lines=1, gap=12 * mm))
    story.append(Spacer(1, 14 * mm))
    story.append(
        Paragraph(
            "Quellen: Pflichtfragen-Katalog · Launch-Intake · Legal-Intake · brief.schema.json<br/>"
            "SBL-Web — Website-Factory für KMU — strukturiert, nicht vibecoded.",
            sty["body"],
        )
    )

    out.parent.mkdir(parents=True, exist_ok=True)
    doc.build(story)
    print(f"Wrote {out}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=OUT_DEFAULT,
        help="Output PDF path",
    )
    args = parser.parse_args()
    build_pdf(args.output)


if __name__ == "__main__":
    main()
