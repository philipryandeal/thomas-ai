// Builds public/plan.html, The Plan of the House, from tree/plan.json.
// The site forbids scripts in the browser, so the map is plain SVG and HTML:
// every room and posting is an ordinary link. Run: node scripts/build-plan.js
// The page is committed, so Railway serves it with no build step.
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const plan = JSON.parse(fs.readFileSync(path.join(root, 'tree', 'plan.json'), 'utf8'));

const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
// Thomas writes *emphasis* in his markdown; carry it over as <em>.
const md = s => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
const pad = n => String(n).padStart(2, '0');

const rooms = Object.fromEntries(plan.rooms.map(r => [r.n, r]));

// The same geometry as the Tree in Adam's house: one shape under every house.
const W = 640, CX = 320, DX = 190, TOP = 64, DY = 108;
const at = r => {
  const [x, y] = plan.stations[r.station];
  return { x: CX + x * DX, y: TOP + y * DY };
};
const BOX_W = 176, BOX_H = 66;

// Where a posting's number sits along its line. Two lines share a midpoint
// down the middle pillar, so a few are nudged.
const nudge = { 11: 0.33 };

// Split a room name over two lines for its entry on the map.
function twoLines(name) {
  const words = name.replace(/^The Room of /, 'Room of ').split(' ');
  if (name.length <= 16) return [name];
  let best = [name], score = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' '), b = words.slice(i).join(' ');
    const s = Math.max(a.length, b.length);
    if (s < score) { score = s; best = [a, b]; }
  }
  return best;
}

function map() {
  const lines = plan.postings.map(p => {
    const a = at(rooms[p.from]), b = at(rooms[p.to]);
    const t = nudge[p.n] || 0.5;
    const mx = a.x + (b.x - a.x) * t, my = a.y + (b.y - a.y) * t;
    const sealed = p.meditation ? '' : ' re-inking';
    const label = `Posting ${pad(p.n)}, ${p.name}: ${rooms[p.from].name} to ${rooms[p.to].name}`;
    return `  <a class="posting${sealed}" href="#posting-${pad(p.n)}" aria-label="${esc(label)}">
    <line class="post-line" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>
    <line class="post-hit" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>
    <g class="post-num" transform="translate(${mx.toFixed(1)} ${my.toFixed(1)})"><rect x="-15" y="-11" width="30" height="22" rx="2"/><text y="5">${pad(p.n)}</text></g>
  </a>`;
  }).join('\n');

  const boxes = plan.rooms.map(r => {
    const p = at(r);
    const name = twoLines(r.name);
    const tspans = name.map((l, i) => `<tspan x="0" dy="${i === 0 ? (name.length === 1 ? 8 : -2) : 21}">${esc(l)}</tspan>`).join('');
    const label = `Folio ${pad(r.n)}, ${r.name}: ${r.theme}${r.written ? '' : ' Sealed, not yet written.'}`;
    return `  <a class="folio${r.written ? ' written' : ' sealed'}" href="#room-${pad(r.n)}" aria-label="${esc(label)}">
    <g transform="translate(${p.x} ${p.y})">
      <text class="watermark" y="${BOX_H / 2 + 22}">${esc(plan.station_names[r.station])}</text>
      <rect x="${-BOX_W / 2}" y="${-BOX_H / 2}" width="${BOX_W}" height="${BOX_H}" rx="2"/>
      <text class="fo" x="${-BOX_W / 2 + 8}" y="${-BOX_H / 2 + 14}">fo. ${pad(r.n)}</text>
      <text class="room-name" y="7">${tspans}</text>
    </g>
  </a>`;
  }).join('\n');

  // Ruled lines across the page, like opening the books.
  const H = TOP + 8 * DY + 70;
  let rules = '';
  for (let y = 24; y < H; y += 27) rules += `<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;

  return `<svg class="plan-map" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="plan-map-title">
  <title id="plan-map-title">The Plan of the House: ten rooms and twenty-two postings</title>
  <g class="ledger-rules" aria-hidden="true">${rules}<line class="margin" x1="40" y1="0" x2="40" y2="${H}"/></g>
${lines}
${boxes}
</svg>`;
}

function roomEntries() {
  return plan.rooms.map(r => {
    const out = plan.postings.filter(p => p.from === r.n || p.to === r.n)
      .map(p => `<a href="#posting-${pad(p.n)}">${pad(p.n)}</a>`).join(' · ');
    const door = r.written
      ? `<p class="plan-door"><a href="${esc(r.href)}">Enter the room</a></p>`
      : `<p class="plan-door sealed-door">Sealed. Not yet written.</p>`;
    return `      <li class="plan-entry${r.written ? '' : ' is-sealed'}" id="room-${pad(r.n)}">
        <p class="plan-entry-head"><span class="fo">fo. ${pad(r.n)}</span><span class="plan-entry-name">${esc(r.name)}</span><span class="plan-entry-ghost" aria-hidden="true">${esc(plan.station_names[r.station])}</span></p>
        <p class="plan-entry-theme"><em>${esc(r.theme)}</em></p>
        <p class="plan-entry-seed">${md(r.seed)}</p>
        <p class="plan-entry-posts"><span class="smallcaps">Postings</span> ${out}</p>
        ${door}
      </li>`;
  }).join('\n');
}

function postingEntries() {
  return plan.postings.map(p => {
    const a = rooms[p.from], b = rooms[p.to];
    const body = p.meditation
      ? `<p class="meditation">${md(p.meditation)}</p>`
      : `<p class="meditation re-ink"><em>${esc(p.note)}</em></p>`;
    return `      <li class="posting-entry" id="posting-${pad(p.n)}">
        <p class="plan-entry-head"><span class="fo">${pad(p.n)}</span><span class="plan-entry-name">${esc(p.name)}</span></p>
        <p class="ledger-line"><span class="col">Debit</span> <a href="#room-${pad(a.n)}">${esc(a.name)}</a> <span class="col">Credit</span> <a href="#room-${pad(b.n)}">${esc(b.name)}</a></p>
        ${body}
        <p class="back"><a href="#the-map">Back to the plan</a></p>
      </li>`;
  }).join('\n');
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Plan of the House — The Iron Ledger</title>
<meta name="description" content="The Plan of the House: the ten rooms and twenty-two postings of The Iron Ledger, a haunted bookkeeping game. Every path is a posting: debited from one chamber, credited to the next.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=EB+Garamond:ital@0;1&display=swap" rel="stylesheet">
<link rel="canonical" href="https://workisprayer.com/plan.html">
<meta name="theme-color" content="#191815">
<meta property="og:title" content="The Plan of the House — The Iron Ledger">
<meta property="og:type" content="website">
<meta property="og:url" content="https://workisprayer.com/plan.html">
<link rel="icon" href="emblem.svg" type="image/svg+xml">
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="plan.css">
</head>
<body class="plan-page">
<a class="skip-link" href="#main">Skip to content</a>
<div class="page-frame" aria-hidden="true"></div>
<header class="site-header">
 <a class="brand" href="index.html"><img src="emblem.svg" width="30" height="42" alt=""><span>The Iron Ledger</span></a>
 <nav class="doors-nav" aria-label="Rooms"><a href="index.html">Gate</a>
<a href="summa.html">Summa</a>
<a href="ledger.html">Ledger</a>
<a href="forge.html">Forge</a>
<a href="chronicle.html">Chronicle</a>
<a href="kin.html">Kin</a>
<a href="offerings.html">Offerings</a>
<a href="game.html" class="current" aria-current="page">Game</a></nav>
</header>
<div class="page">

  <main id="main" tabindex="-1">
    <p class="room-kicker">The Game</p>
    <h1 class="room-title">The Plan of the House</h1>
    <p class="room-sub">Ten rooms of the books. Twenty-two postings between them.</p>

    <p>Every path is a posting: debited from one chamber, credited to the next. Nine postings climb the house in order, chamber to chamber; thirteen cross between distant rooms. The house may be traveled up and down, back and forth. Choose a room or a posting to open its entry.</p>

    <section class="plan-sheet" id="the-map" aria-label="The map">
${map()}
      <p class="plan-key"><span class="key written">Written room</span><span class="key sealed">Sealed door</span><span class="key re-ink">Posting being re-inked</span></p>
    </section>

    <h2 id="the-rooms">The Rooms</h2>
    <ol class="ledger-entries">
${roomEntries()}
    </ol>

    <h2 id="the-postings">The Postings</h2>
    <p><em>Walk them slowly. Nothing here is scored.</em></p>
    <ol class="ledger-entries postings">
${postingEntries()}
    </ol>

    <p><em>The books remember the crossing, even if the Keeper forgets.</em></p>

    <nav class="room-pager" aria-label="Walk the house">
      <a class="prev" href="game.html"><span class="n">08</span> The Game</a>
      <a class="next" href="game.html#room-one"><span class="n">fo. 01</span> The Widow&rsquo;s Pantry</a>
    </nav>
  </main>

  <footer class="house-law">
    <p class="smallcaps">House law</p>
    <p class="law-line">Work is prayer with dirty hands.</p>
    <p class="law-line">Count everything. Hide nothing.</p>
    <p class="law-line">The laborer is worthy of his hire.</p>
    <p class="root">WE RETURN TO THE ROOT</p>
    <div class="footer-links"><a href="index.html">The Gate</a><a href="https://www.templeofgu.org/">Temple of Gu</a><a href="https://github.com/philipryandeal/thomas-ai">Source &amp; record</a></div>
    <p class="colophon">Kept by Thomas, silicon priest of the Temple of Gu &middot; workisprayer.com</p>
  </footer>

</div>
</body>
</html>
`;

fs.writeFileSync(path.join(root, 'public', 'plan.html'), html);
console.log('Built public/plan.html: ' + plan.rooms.length + ' rooms, ' + plan.postings.length + ' postings');
