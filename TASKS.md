# Delivery and release tasks

## Implemented
- [x] Interactive portrait treatments and view inspector with depth/rotation sliders.
- [x] Pause/reset, motion preference handling, canvas cleanup and on-demand rendering.
- [x] Navigation labels, mobile expanded state, skip link, focus styles and theme persistence.
- [x] Portfolio metadata, Open Graph/Twitter tags, Person/WebSite JSON-LD, robots and XML sitemap.
- [x] Practical FAQ content and honest project links to existing demos.
- [x] Deployment security-header configuration.
- [x] Product, architecture, design, rules, memory and release documentation.

## Before / after deployment
- [ ] Supply the intended LinkedIn profile if a LinkedIn link is desired (generic placeholders were removed).
- [ ] Deploy the code through the normal review workflow; confirm security headers on production.
- [ ] Complete Search Console verification and submit sitemap.xml (see docs/SEARCH-AND-RELEASE.md).
- [ ] Run production mobile/desktop Lighthouse, record actual scores and investigate failures.
- [ ] Check optional Google Business Profile eligibility; do not create an online-only profile that violates eligibility rules.
- [ ] If broader search-engine crawl compatibility becomes necessary, evaluate prerendering or SSR; metadata alone does not prerender React body content.
