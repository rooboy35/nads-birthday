# Delivery checks — 8 November 2026

Tested in the owner’s Chrome browser against the locally built site on port 4440. Screenshots and DOM checks covered desktop (1512px), phone (390px and 320px) and tablet (768px) widths. These are viewport checks, not claims of testing physical iOS/Android devices.

| Check | Result |
| --- | --- |
| Supplied assets | Inspected all three original photos and both generated artworks; copied originals match Dropbox hashes; three chat photo attachments also saved |
| Visual layout | Personalised poster and supplied reaction art render; no horizontal overflow at tested widths; tablet portrait overflow corrected and rechecked |
| Artwork targets | Cry, Beer and Roast hit targets align over the pictured buttons; each triggers correct scene; smallest tested targets exceed 24px, with 84px standalone alternatives |
| Standalone actions | All three controls share scene state, selected state, messages and counters with artwork targets |
| Cry | Actual supplied crying expression, animated tear streams and shaking; beer replaces the crying state |
| Beer | Supplied drinking reaction, separate bottle articulation, foam/bubbles and a short 28-piece confetti burst; corrected an initial duplicate-bottle alignment issue |
| Roast | Supplied roast reaction, lighting/steam/flames, animated reveal; 36 distinct first-deck messages and no immediate repeat at reshuffle verified in browser |
| Sound | Muted on reload; explicitly enabled, then Cry/Beer/Roast invoked and muted again without console errors; synthesis is finite and scene changes cancel old effects |
| Reset/rapid switching | Repeated scenes and rapid Cry→Beer→Roast sequences finish in the requested state; reset restores party and clears selection |
| Maturity | Firmware button gives failure toast; progress value stays at 3 |
| Keyboard | Artwork Cry via Enter and Beer via Space work and retain the right focus/selection; native buttons and focus outlines used throughout |
| Reduced motion | Visible motion control disables reaction/tear animations and hides confetti; device media preference maps to the same state and cannot be overridden with full motion |
| Extras | Birthday wish changes message; duck gives Easter-egg toast; share fallback displays a usable link when browser clipboard access is unavailable |
| Browser errors | No error-level console entries after interaction checks |
| Static verification | JS syntax; 36 unique roasts; 12 shuffled full decks with boundary-repeat checks; required assets and local asset dependencies pass |
| Build | `npm run build` succeeds without installing dependencies; runtime output approximately 476 KB; source-only reference photos/PNG originals excluded from deployment |

OS-level reduced-motion emulation, physical Safari playback and subjective loudspeaker audio quality were not separately tested. Native share/clipboard permissions vary by browser; a visible copy-link fallback is provided.

Deployment acceptance is recorded separately after the existing Netlify project is replaced and its public URL verified.
