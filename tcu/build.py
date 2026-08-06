#!/usr/bin/env python3
"""
Build the TCU offspring deliverables.

  1. Render each source HTML page-set to PDF at exactly 960 x 540 pt
     using headless Chromium.
  2. Append the new colour pages (10-13) to the approved 9-page deck
     WITHOUT re-rendering pages 1-9, so nothing already signed off moves.
  3. Emit both deliverables into out/.

Usage:  python3 tcu/build.py [--proof]
        --proof also writes PNG proofs of every page into out/proofs/.
"""

import glob
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "out")

# The approved deck the colour amendment extends. Pages 1-9 are carried
# through untouched; only pages 10+ are generated from HTML.
SOURCE_DECK = os.environ.get(
    "TCU_SOURCE_DECK",
    "/root/.claude/uploads/fc34e31d-0726-5b02-8f66-6cb03e70a05c/"
    "ee3c3bb1-TCU_Offspring_Guideline__Amended.pdf",
)


def chromium() -> str:
    for pattern in ("/opt/pw-browsers/chromium-*/chrome-linux/chrome",
                    "/opt/pw-browsers/chromium/chrome-linux/chrome"):
        hits = sorted(glob.glob(pattern))
        if hits:
            return hits[-1]
    raise SystemExit("Chromium not found under /opt/pw-browsers")


def render(html: str, pdf: str) -> None:
    """Print one HTML file to PDF. Page geometry comes from the CSS @page rule."""
    os.makedirs(os.path.dirname(pdf), exist_ok=True)
    subprocess.run(
        [
            chromium(),
            "--headless",
            "--disable-gpu",
            "--no-sandbox",
            "--no-pdf-header-footer",
            "--run-all-compositor-stages-before-draw",
            "--virtual-time-budget=20000",
            f"--print-to-pdf={pdf}",
            f"file://{html}",
        ],
        check=True,
        capture_output=True,
    )
    print(f"  rendered {os.path.basename(html)} -> {os.path.basename(pdf)}")


def proof(pdf: str, tag: str) -> None:
    import fitz

    d = fitz.open(pdf)
    out = os.path.join(OUT, "proofs")
    os.makedirs(out, exist_ok=True)
    for i, page in enumerate(d):
        page.get_pixmap(dpi=110).save(os.path.join(out, f"{tag}-{i + 1:02d}.png"))
    print(f"  proofed {len(d)} page(s) from {os.path.basename(pdf)}")


def main() -> None:
    import fitz

    os.makedirs(OUT, exist_ok=True)
    want_proof = "--proof" in sys.argv

    # ---- 1. Colour amendment: render new pages, append to approved deck ----
    new_pages = os.path.join(OUT, "_colour-pages.pdf")
    render(os.path.join(HERE, "colour-amendment.html"), new_pages)

    merged = os.path.join(OUT, "TCU_Offspring_Guideline_Amended_v2.pdf")
    deck = fitz.open(SOURCE_DECK)
    additions = fitz.open(new_pages)
    deck.insert_pdf(additions)
    deck.set_metadata({
        "title": "The Craft Union — Offspring Brand Character Guidelines",
        "subject": "Offspring colour palettes, amended",
        "author": "And Again Advisory",
    })
    deck.save(merged, garbage=4, deflate=True)
    print(f"  merged {len(deck)} pages -> {os.path.basename(merged)}")

    # ---- 2. Typeface alternatives: standalone document -------------------
    typefaces_src = os.path.join(HERE, "typeface-alternatives.html")
    typefaces = os.path.join(OUT, "TCU_Offspring_Typeface_Alternatives.pdf")
    if os.path.exists(typefaces_src):
        render(typefaces_src, typefaces)
        d = fitz.open(typefaces)
        d.set_metadata({
            "title": "The Craft Union — Offspring Typeface Alternatives",
            "subject": "Display typeface options for Treesongs, Riversprings and Whisperlake",
            "author": "And Again Advisory",
        })
        tmp = typefaces + ".tmp"
        d.save(tmp, garbage=4, deflate=True)
        d.close()
        os.replace(tmp, typefaces)
        print(f"  wrote {len(fitz.open(typefaces))} pages -> {os.path.basename(typefaces)}")

    if want_proof:
        proof(merged, "guideline")
        if os.path.exists(typefaces):
            proof(typefaces, "typeface")

    if os.path.exists(new_pages):
        os.remove(new_pages)


if __name__ == "__main__":
    main()
