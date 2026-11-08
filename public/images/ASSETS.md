# Nads’ supplied artwork

Copied from the locally synced `/Users/deano/Dropbox/NadsBirthday/assets/` on 8 November 2026. All five copies were checked against source SHA-256 hashes. Dropbox originals were not changed.

- `nads-reference-1.jpg`, `nads-reference-2.jpg`, `nads-reference-3.jpg`: original likeness references.
- `nads-birthday-artwork.png`: personalised party poster. Runtime version: `nads-party.webp` (WebP quality 84).
- `nads-interactive-concept.png`: supplied visual reference, including crying, drinking and roast panels. Also retained as WebP.
- `nads-reference-chat-1.jpg` through `-3.jpg`: three additional photo attachments supplied in this chat, retained separately without replacing Dropbox copies.
- `nads-portrait.webp`: reduced-size version of reference 3 for the maturity report, retaining Nads’ real face.
- `nads-cry.webp`: crop `(24,705,366,232)` from the supplied concept.
- `nads-beer.webp`: crop `(421,705,358,232)` from the supplied concept.
- `nads-roast.webp`: crop `(814,705,358,232)` from the supplied concept.

The three panel crops use WebP quality 90. They are reaction art, not pre-rendered animations. The app animates separate SVG bottle/face layers, CSS tears/shaking/foam/steam and a canvas confetti system. No generated replacement face or stock person is used.

Only five runtime WebP assets are copied into the deployment by `scripts/build.mjs`. Full reference photographs and supplied PNG originals stay in the repository.

## Updating the poster

Replace `nads-party.webp`, preserving the 1199×1312 artboard, or adjust the SVG `viewBox`, clip masks and feature coordinates in `src/index.html`. Artwork button targets are percentages in `.hotspot` rules in `src/styles.css`; all targets call the same shared actions as the standalone controls. Recheck alignment and reaction masks at phone and desktop widths after changing composition.

The reaction crop paths are configured together at the top of `src/app.js`. Replace crops at those paths without changing the layout. If their composition changes, recalibrate the independent bottle clip and tear locations too.
