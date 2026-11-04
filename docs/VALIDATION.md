# Validation — 4 November 2026

## Integration with the VS Code project

The integration is based on the user’s `dmn.devfolio` backup commit `337e3d1`, retaining the section refactor, persisted/editable tasks, filters, active navigation, role rotation, and back-to-top control. Build, lint, functional browser tests and accessibility checks are rerun for this version; see the integration note below. The Lighthouse numbers in the table are measurements of the earlier cloud implementation and are not fresh measurements of the refactored integration.

Checks ran against the local production build on Node 24.22.1 / npm 11.9.0 in the cloud environment. These results do not describe the currently deployed Vercel version.

| Check | Result |
| --- | --- |
| `npm run build` | Passed |
| `npm run lint` | Passed |
| `git diff --check` | Passed |
| Chromium desktop/mobile functional checks | Passed; no application exceptions |
| Mobile layout at 390 × 844 | No horizontal overflow |
| axe-core, dark theme | 0 reported violations |
| axe-core, light theme | 0 reported violations |
| npm production dependency audit | 0 known vulnerabilities reported |
| Lighthouse desktop | Performance 100; accessibility 100; best practices 100; SEO 100 |
| Lighthouse simulated mobile | Performance 84; accessibility 100; best practices 100; SEO 100 |
| Mobile layout shift | CLS 0 in the measured run |
| Mobile largest contentful paint | 3.6 seconds in the measured run |

## Functional coverage
Chromium exercised all five portrait treatments, all inspector modes, layer-depth and rotation ranges, reset, pause/resume, theme persistence across reload, task creation/completion/deletion, mobile navigation, and the system reduced-motion setting. There is one H1. The canvas was checked for nonempty pixels and the dither treatment was verified to produce exactly two RGB colors, not just a successful button click.

Robots, sitemap and social image returned successful local HTTP responses. The canonical URL matched the user-confirmed public URL. A browser check applied the configured Content-Security-Policy to the local document and exercised the app without console or application errors. Production deployment headers still need verification on Vercel.

The final visual review covered the lab in desktop dark/light and mobile light layouts. Self-hosted fonts eliminated the external-font request failure seen in the initial audit. Loading only the required animation features reduced the initial compressed JS from about 128 KB to 100 KB, with a separate ~18 KB compressed animation-feature chunk.

## Limits
Lighthouse scores vary with device, network and load. The 84 mobile performance score leaves room to optimize image delivery and render timing. Automated accessibility checks are not a full screen-reader audit. npm advisories do not certify security. Search ownership, indexing, business-profile eligibility, actual email delivery through a user's email client, and deployment have not been tested or performed. Main content is client-rendered; metadata and a noscript introduction do not replace SSR/prerendering for every crawler.

## Integration check results

The section-based integration passed build, lint and diff-whitespace checks. Chromium verified particle/dither/CRT/glitch/flashlight controls, the inspector sliders, reset/pause, desktop/mobile rendering, theme reload persistence, and reduced motion with no application errors and no horizontal overflow at 390px. Separate regression checks confirmed task persistence across reload, editing and saving task text, completion/deletion, HTML/All project filters and Escape-to-close mobile navigation. The final axe-core run reported zero violations in both dark and light themes. A transient test run overlapped a rebuild and timed out loading the lazy task chunk; the test passed after the completed production build. No assertion was disabled.
