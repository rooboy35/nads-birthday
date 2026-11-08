# Nads’ Ridiculous Birthday

A personalised, mobile-first birthday playground: animated crying, beer and roast reactions; 36 uncensored original roasts; optional synthesised sound; confetti; a permanently broken 3% maturity meter; and a few hidden extras. Vanilla HTML/CSS/JavaScript, no runtime dependencies, API keys, backend or external assets.

## Run locally

Requires Node 20 or newer. No package installation is needed.

```sh
npm run check
npm run build
npm run preview
```

Open http://127.0.0.1:4440. Preview stops automatically after an hour; Ctrl+C stops it sooner. Rebuild and reload after changes.

## Netlify

Existing project: `cheery-salamander-a64a94`.

Live birthday website: https://cheery-salamander-a64a94.netlify.app/

`netlify.toml` sets `npm run build` and the `dist` publish directory. Link this GitHub repository to that **existing** project for continuous deployment, or build locally and drag a ZIP containing the contents of `dist/` onto the existing project’s Deploys screen. `index.html` must be at the ZIP root. Do not create another site or upload the repository root.

For an already authenticated Netlify CLI:

```sh
netlify link --name cheery-salamander-a64a94
npm run build
netlify deploy --prod --dir=dist --no-build
```

Verify the public URL after deployment. Netlify’s pre-launch/private site setting must be disabled for visitors to open the birthday link without signing in; deployment alone does not prove public access.

## Artwork and animation

All five supplied Dropbox originals and the three additional chat photos are retained in `public/images/`. Dropbox originals are untouched. See `public/images/ASSETS.md` for provenance, optimisation, crop coordinates and asset replacement instructions.

The poster uses accessible HTML buttons positioned over its three pictured controls. Standalone controls are large touch targets and invoke the same actions. Character reaction panels come from the supplied concept. Live layers add streaming tears, a tantrum, an articulated drinking bottle, bubbles, roast lighting, steam, reaction movement, and finite canvas confetti.

Sound is off on every new page load and starts only after enabling it. Wailing, glugs, burps, roasts and the duck are synthesised locally using Web Audio; no audio samples are fetched. Switching scenes cancels prior sounds. Turning sound off, resetting, and hiding the tab stop audio immediately.

Reduced-motion preferences disable movement and confetti, preserving readable scene changes. Scene movement otherwise settles after 6.5 seconds. Roasts are shuffled through all 36 before repeating, including protection against immediate repeats across deck boundaries. Counters are session-only and do not track visitors.

## Acceptance checks

`npm run check` verifies JS syntax, content uniqueness, full-deck rotation and required local images. Browser QA should cover all six main controls (three image hit targets and three standalone controls), crying → beer → roast transitions, repeated and rapid interactions, mute/reset, keyboard focus, sharing, phone widths, reduced motion and console/network errors. See `QA.md` for the actual results recorded for this delivery.

## Nads QR code

Ready-to-share files are in `artifacts/qr/`: `nads-birthday-qr.png` and `.svg` include the cap-and-beard birthday frame; `nads-qr-code.png` and `.svg` contain just the code and Nads’ portrait. They link directly to the live website, with no tracking or redirect service. Full-size and reduced/rotated PNG decoding is recorded in `verification.json`.

Optional regeneration on this Mac: install `scripts/requirements-qr.txt` in a Python environment, then run `python scripts/make-qr.py`. These authoring dependencies are separate from the website. The SVGs include the portrait and QR geometry locally; their typography uses Impact with system fallbacks.
