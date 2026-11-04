# Design direction

Retain the portfolio’s existing warm orange/neutral identity and cinematic portrait. Present experimental work in a dark olive instrument panel with pale green controls, monospaced captions, and a large image stage. Main content remains readable in dark and light themes.

## Hierarchy
Introduction → personal story → services → skills → selected work → visual lab → task demo → practical questions → contact.

## Effect placement
- Hero: existing portrait staging, entrance and scroll cue.
- Site frame: thin scroll progress, visible keyboard focus and skip link.
- Lab: pointer-reactive particles, 1-bit dither, CRT scanlines, datamosh-inspired displacement and flashlight reveal.
- Lab inspector: exploded layers, blueprint grid, inverted X-ray, diagonal cutaway and user-controlled 360° plane rotation.
- Contact: receipt/ticket-style divider and inquiry header, with real input labels.
- Existing project/skill transitions remain; system reduced motion suppresses transform animations and CSS motion.

## Responsive and motion behavior
Controls wrap on narrow screens, then stack above the portrait. The light reveal is centered for touch users; reduced motion and pause expose the full image. Avoid strobing, autoplay audio, hijacked scrolling, and replacing the native cursor. Effects should explain craft, not obstruct reading.
