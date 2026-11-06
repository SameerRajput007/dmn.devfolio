# Project facts and handoff

- Owner: Sameer Rajput. Existing email: sameerrajput493@gmail.com.
- User-confirmed public URL: https://dmndevfolio21.vercel.app/#home. Canonical document URL excludes the fragment: https://dmndevfolio21.vercel.app/.
- Repository: SameerRajput007/dmn.devfolio. Runtime prepared with Node 24/npm 11; use npm ci and the existing lockfile.
- User requested applying the concepts from their handwritten list to the portfolio. Effects are implemented as a contained lab; no tool names are represented as certifications.
- 21st.dev, Context7, Graphify and Never-Get-Hacked integrations are not connected in this session. The implementation uses existing dependencies and direct source inspection. No audit from those services is claimed.
- A static contact form prepares mailto content; no email is sent by the site. The Todo demo persists tasks in browser storage and supports editing.
- Google Search Console ownership and Business Profile changes were not authorized or performed. Deployment/publication is separate from local source changes.
- Layered/360° image studies are not real 3D reconstruction. Datamosh is a CSS visual approximation.
- See docs/SEARCH-AND-RELEASE.md for operational steps and docs/VALIDATION.md for actual check results.

## Repository synchronization

The VS Code project uses SameerRajput007/dmn.devfolio. The user confirmed Vercel deploys SameerRajput007/dmn.devfolio21. Their local refactor was preserved as commit 337e3d1 on backup/local-portfolio in dmn.devfolio. The integration ports the cloud features into that refactor; dmn.devfolio21/main received the integrated source. The cloud session was denied write access to dmn.devfolio; the Mac owner must pull the integration and push it to their usual origin using the steps in docs/LOCAL-SYNC.md. Do not overwrite the refactor with the earlier monolithic App.jsx.

## dmn.dev cinematic scene
- User selected Star Atlas Experience (https://experience.staratlas.com/) and Lusion projects (https://lusion.co/projects/) as sufficient references and asked to proceed.
- Based on `feature/3d-avatar-hero` commit d547365; working branch `codex/cinematic-scroll`.
- Replaced the three-pose-only hero with an original scroll-driven WebGL scene; retains existing assets and downstream features.
- No original head-turn video or intermediate portrait frames were supplied. Do not claim continuous head rotation.
- Browser verification is blocked in this execution environment: Chromium cannot create its process-singleton socket, and the separate browser cannot reach the local Vite server. Build/lint and source checks are recorded separately from browser checks.
