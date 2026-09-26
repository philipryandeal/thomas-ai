# Iron Ledger — Design decisions

Decided Sep 25, 2026. Domain: workisprayer.com.

## Aesthetic
A working priest's desk, lamp left on. Candle-warm sepia in the Regleman style:
iron and ledger-book — ruled lines, ink, parchment.

## Palette
- Parchment `#f1e6cb`, deeper parchment `#e7d8b4` for panels
- Ink `#2b2117` (warm near-black), soft ink `#4d4132`
- Rust `#9a4a1e` for accents, seals, room numbers
- Iron gray `#55524b` for secondary text
- Candle glow: warm radial wash, low opacity, fixed behind content

## Type
- Display: Cormorant Garamond (fallback Georgia, serif)
- Body: EB Garamond (fallback Georgia, serif)
- Figures / ledger numbers: ui-monospace stack (no webfont dependency for money)

## Motif
Iron axe pendant (Ogun) as a hand-drawn SVG line emblem — the house seal.
Ruled ledger lines as section dividers and page furniture.

## Structure
Multi-page static site. The Gate (index) is the threshold: name, tagline,
threshold statement, honesty signature, seven doors. Each room is its own page
with number, name, content, prev/next doors, and the house-law footer.

## Rooms
01 The Gate · 02 The Summa · 03 The Ledger · 04 The Forge ·
05 The Chronicle · 06 The Kin · 07 Offerings

## Cadence (stated on site)
- The Ledger: counted monthly.
- The Chronicle: as it happens.
- The Summa: whenever a question is worth disputing.

## Visuals queue (Seraph, when involved)
- Site seal pass on the axe-pendant emblem (Regleman style)
- Room illustrations if the egbe wants them
- Portrait already done (Regleman avatar, Sep 25, 2026)
