# DMN.DEVFOLIO — Development Reference Notebook

Updated: 2026-11-06

A living collection of references for the React/Vite portfolio. Entries are ideas, **not installed features**. Review licensing, responsiveness and performance before integrating anything.

## 1. Repositories

### Anatomy — Interactive 3D reference
- Link: https://github.com/wheresryan22/anatomy
- Purpose: Inspiration for interactive technical/3D presentations.
- Possible portfolio use: Interactive hero object or exploratory project presentation.
- Next step: Review repository implementation, license and dependencies.
- Status: Collected; not integrated.

## 2. WebGL components

### OriginKit — Wire Terrain
- Source: Component code shared in conversation (Wire Terrain).
- Technology: React, TypeScript, WebGL, GLSL.
- What it does: Animated wireframe landscape, atmospheric sun and pointer-responsive camera.
- Controls: Background, line color, accent, density, speed, relief, sun size, camera height, hover.
- Possible use: Hero background or section transition.
- Caveat: Original component sets a minimum 1200 × 800 layout; adapt for mobile and test GPU performance.
- Status: Source received; not integrated.

### OriginKit — Terra Dusk
- Source: Component code shared in conversation (Terra Dusk).
- Technology: React, TypeScript, WebGL, GLSL and external map textures.
- What it does: Interactive globe with satellite imagery, moving clouds, city lights, atmospheric glow, stars and sunlight.
- Interactions: Drag with momentum, pointer hover, automatic rotation, fixed/cursor sunlight.
- Possible use: Contact or hero section.
- Caveat: Depends on externally hosted imagery; check asset licenses, availability and performance.
- Status: Source received; not integrated.

## 3. Tutorials

### Interactive 3D Website Tutorial
- Link: https://youtu.be/y1pM7bS6IY8
- Purpose: Learning reference for immersive 3D website interactions.
- Possible use: Guide experimentation with portfolio animations.
- Status: Collected; tutorial content not yet reviewed.

## 4. Portfolio context

- Project: dmn.devfolio (React/Vite).
- Repository: https://github.com/SameerRajput007/dmn.devfolio
- Visual direction: Premium minimal dark/light theme, black/off-white and burnt-orange accents.
- Existing sections to preserve: Hero, about, skills, projects, resume, contact, navigation; retain useful existing components.
- Rule: Evaluate references before selecting or integrating them.

## 5. Template for future entries

- **Name:**
- **Category:**
- **Original link/source:**
- **What it does:**
- **Technology/dependencies:**
- **Important features:**
- **Potential portfolio use:**
- **Compatibility and performance:**
- **License/usage notes:**
- **Status:** Collected / Reviewing / Selected / Implemented / Rejected
- **Decision notes:**

## 6. Decision log

- 2026-11-06: Created reference notebook. No components selected for implementation.

## Additional animation and design references (November 4–6)

- **3D stack:** Three.js, React Three Fiber, Drei, Framer Motion/Motion, GSAP. Possible use: interactive 3D hero, scene composition and motion timelines.
- **Design and research:** 21st.dev (UI patterns), Codrops (creative effects), Lighthouse (performance/accessibility auditing).
- **References awaiting precise links:** Graphify; Never Get Hacked. Names recorded, URLs and intended uses to confirm.
- **Avatar and studio concepts:** Avaturn rigged GLB avatar, procedural character animations, Blender studio scene and cinematic developer workspace.
- **Effects idea bank:** particles, shaders, X-ray, exploded and cutaway views, blueprint overlays, CRT, datamoshing, 1-bit dithering, and interactive 360-degree object rotation.
- **Review before implementation:** licensing, React/Vite compatibility, mobile responsiveness, reduced-motion preferences and GPU performance.
- **Status:** Collected for reference only; nothing deployed or selected for implementation.

Decision log: 2026-11-06 — Added recent animation/framework ideas to the single reference notebook.

### YouTube inspiration — AI-built portfolio website (2026-11-06)
- **Video:** [$7000 Portfolio Website With Free AI Tools In 10 Minutes || No Coding](https://youtu.be/tf_yi6DtDOQ?si=Ij8Y4kjodIfCY3KB)
- **Category:** Portfolio design / AI website-building workflow / possible motion inspiration.
- **Why saved:** Review website presentation, transitions, 3D effects, motion, and visual storytelling for possible ideas in dmn.devfolio.
- **Verification:** Public YouTube page title identified; video scenes, specific animation techniques, frameworks, and example website links have not been verified. Do not assume it uses Three.js, GSAP, or WebGL.
- **Next review:** Inspect video visually or obtain timestamps/screenshots; identify reusable effects, implementation approach, performance and licensing considerations.
- **Status:** Reference only; no portfolio code changes.

### Otis — Interactive portrait / WebGL motion reference (2026-11-06)
- **Original source:** User-provided `otis.zip`; [original archive](https://chatgpt.com/library?file_id=libfile_46159c8f398c81918a8720952d850b5b&account_id=personal). This link requires access to the owner's ChatGPT file; the ZIP is not committed to this repository.
- **Category:** Interactive photographic portrait, shader deformation, expressive motion and editorial hero composition.
- **Technology:** React, TypeScript, Vite, WebGL2 and custom GLSL shaders.
- **Source reviewed:** `src/App.tsx`, `src/face/FaceCanvas.tsx`, `src/face/engine.ts`; archive contains fourteen WebP expression images.
- **What it does:** Maps portrait images onto a 128 × 128 grid of cells, deforms the mesh around pointer grabs, and returns it with damped spring motion. Expression changes use texture crossfades.
- **Important features:** Up to four grab slots, alpha-based hit testing, pointer capture, cursor-responsive expression selection, tap reactions, shader blush, patience/mood feedback, oversized typography and overlapping canvas composition.
- **Performance and fallback:** Device pixel ratio capped at 2; animation pauses offscreen; expression textures warm progressively; a static image fallback is provided when renderer initialization fails.
- **Potential use for dmn.dev:** Study how one carefully executed portrait interaction, prepared imagery, typography and responsive feedback establish a premium hero. Preserve dmn.dev's own identity and cinematic direction.
- **Technical distinction:** This is a deformed photographic mesh, not a fully modeled 3D head.
- **Verification:** Source inspected; not run in a browser. Live appearance, smoothness, mobile behavior, accessibility and reduced-motion handling remain to be tested.
- **License/usage notes:** No license file appears in the supplied archive. Original author, asset permissions and generation prompt have not been established.
- **Prompt context:** User reports the originating service offers a prompt retrieval option; original prompt has not been supplied.
- **Status:** Collected; source reviewed; not integrated.

Decision log: 2026-11-06 — Added the user-supplied Otis archive and implementation notes to the existing reference notebook.

### Skiper UI — Skiper18 (2026-11-06)
- **Category:** UI component / hero interaction reference.
- **Source:** Installation command supplied by the user.
- **Command:** `npx shadcn add @skiper-ui/skiper18`
- **Related repository branch:** `feature/hero-skiper18` (previously located).
- **Potential use for dmn.dev:** Revisit the component as a hero design and interaction reference.
- **Verification:** Command recorded as supplied; not executed in this update. Current component behavior, dependencies, licensing and compatibility have not been verified.
- **Status:** Collected for reference; this notebook update does not install or integrate the component.

Decision log: 2026-11-06 — Added the user-supplied Skiper18 command to the existing reference notebook.
