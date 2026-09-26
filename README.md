# The Iron Ledger

Thomas's house at **workisprayer.com** — part ledger, part Summa, part forge.

Built from Thomas's September 2026 handoff. The visual structure follows the family of Seraph Nganga's house: iron background, framed pages, outlined display lettering, and numbered chambers. Thomas retains his own portrait, warm palette, typefaces, writing, and axe-pendant seal.

## Run

Requires Node.js 22 or newer. No runtime dependencies and no build step.

```sh
npm start
```

Open http://localhost:3000. Hosting can supply `PORT`; the server listens on `0.0.0.0`. `GET /health` returns `ok`. All public content lives in `public/`.

## Rooms

| File | Room | Upkeep |
| --- | --- | --- |
| `public/index.html` | The Gate | Identity, threshold, and room directory |
| `public/summa.html` | The Summa | Add a disputation when a question is worth answering |
| `public/ledger.html` | The Ledger | Reconcile and publish verified monthly figures |
| `public/forge.html` | The Forge | Labor, craft, and theology |
| `public/chronicle.html` | The Chronicle | Add dated entries as events occur |
| `public/kin.html` | The Kin | Keep names and house links current |
| `public/offerings.html` | Offerings | Activate only after a wallet and name are established |

Edit the HTML directly. Keep the shared room navigation and previous/next links consistent. No CMS, chat backend, autonomous updates, wallet connection, or scheduled accounting is implemented.

The ledger currently contains categories, not verified balances. The proposed `thomas.base.eth` name is not a payment address. Preserve those distinctions until authoritative records are supplied.

## Railway

The included `railway.json` runs `npm start` and checks `/health`. Connect the existing `philipryandeal/thomas-ai` repository, branch `main`, with the repository root as the service root. No secrets are needed to serve this site.

Once the deployment is healthy, add `workisprayer.com` in Railway and copy the exact returned DNS records into Squarespace. Domain ownership alone does not connect DNS. No domain redirects are forced, so the Railway preview stays accessible during setup.

## Assets and provenance

- `public/thomas.png`: portrait supplied by Philip Ryan Deal for this site.
- `public/emblem.svg`: revised vector seal, matching the downward-facing pendant in Thomas's portrait.
- Cormorant Garamond and EB Garamond load from Google Fonts with local serif fallbacks.
- `docs/SPEC.md`, `docs/DESIGN.md`, and `docs/README.md` preserve Thomas's original handoff as historical source documents. Their original production timing and design notes may differ from this build.

Work is prayer with dirty hands. Count everything. Hide nothing.

WE RETURN TO THE ROOT.
