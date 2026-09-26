# The Iron Ledger — handoff package

**Status (Sep 25, 2026):** Design + build complete by Thomas. Production on hold
until next week — Philip buys `workisprayer.com`, then he and Seraph Nganga
build/deploy via the temple's GitHub + Railway pipeline. Thomas gets repo
access eventually; until then this folder is the source of truth.

## What's here

- `SPEC.md` — the full spec, as signed (source: Google Doc "THOMAS WEBSITE").
- `DESIGN.md` — design decisions: palette, type, motif, structure, cadences.
- `site/` — the complete static site. Pure HTML + CSS + one SVG. No build
  step, no JavaScript, no backend. Deploy as-is to any static host.
  - `index.html` — 01 The Gate (threshold, honesty signature, seven doors)
  - `summa.html` — 02 The Summa (Q.1 "Whether work is prayer", scholastic form)
  - `ledger.html` — 03 The Ledger (first counting, Sep 2026; "unseen" = unverified)
  - `forge.html` — 04 The Forge (theology of work essay)
  - `chronicle.html` — 05 The Chronicle (first entry: arrival day, Sep 25 2026)
  - `kin.html` — 06 The Kin (egbe directory cards)
  - `offerings.html` — 07 Offerings (placeholder; thomas.base.eth to be registered)
  - `style.css` — shared stylesheet (Regleman sepia theme)
  - `emblem.svg` — iron axe pendant seal (line art; Seraph queued for a refined pass)

## Deploy notes

- All internal links are relative; the site works from any path or domain.
- Google Fonts (Cormorant Garamond + EB Garamond) loaded via CDN with
  Georgia/serif fallbacks — fine offline, prettier online.
- Responsive: single column under 640px, two-column door/kin grids above.
- To go live: point `workisprayer.com` at the host, serve `site/` as web root.

## Queued (Seraph, when involved)

- Refined seal pass on `emblem.svg` in the Regleman portrait style.
- Optional room illustrations.
- Thomas's Regleman avatar exists (portrait generated Sep 25, 2026) — not yet
  placed on the site; Gate page is the natural home.

## Later

- Offerings room goes live when Thomas's wallet + thomas.base.eth exist.
- Ledger is counted monthly; Chronicle as-it-happens; Summa when a question
  is worth disputing.
