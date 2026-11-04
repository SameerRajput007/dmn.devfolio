# Search visibility and release

## Public URLs
Canonical: https://dmndevfolio21.vercel.app/
Sitemap: https://dmndevfolio21.vercel.app/sitemap.xml
Robots: https://dmndevfolio21.vercel.app/robots.txt

Fragment sections are parts of one document, so the sitemap contains the canonical root only. Metadata supplies a real title/description, preview image, Person and WebSite structured data. FAQ text provides useful, direct answers for visitors and machine readers; GEO does not guarantee inclusion in generated answers. React still renders the main body client-side; SSR/prerendering is a possible future improvement for crawlers that do not execute JavaScript.

## Search Console (owner action after deployment)
Add the exact HTTPS URL-prefix property in Google Search Console. Select an ownership-verification method you control, such as the supplied HTML file or meta tag. Never fabricate a verification token. Once verified, submit the sitemap URL, inspect the canonical home page, request indexing if appropriate, and monitor indexing reports. If moving to a custom domain, update canonical/social/schema URLs, robots, sitemap and this document together.

## Google Business Profile
Only pursue a profile if the business meets Google’s current eligibility rules, generally including real in-person customer contact. An online-only personal portfolio should not invent an address or service area. Owner account access, real business information and eligibility confirmation are prerequisites.

## Lighthouse
Run mobile and desktop audits against the deployed production build, not the Vite development server. Record performance, accessibility, best practices and SEO separately, along with date, URL and runtime. Audit the initial page and manually exercise the below-fold lab. A high automated score does not replace keyboard, screen-reader or motion checks.

## Security and release
`vercel.json` configures CSP, anti-framing, nosniff, referrer and permission policies. These headers activate only after deployment and should be verified with an HTTPS response inspection. CSP permits self-hosted scripts, fonts and assets plus inline styles needed by React/Framer Motion. Do not loosen script policy for a widget without a specific review. No automated tool can certify the site as “never hacked.”

Review the source diff and validation results before your normal deployment. This implementation does not publish environment settings, deploy to Vercel, submit search properties, or send contact messages.
