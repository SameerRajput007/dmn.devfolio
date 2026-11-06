# dmn.dev

Original cinematic introduction based on feature/3d-avatar-hero at d547365.

## Install this source update

Copy the included `src` files into your REACT.JS project, preserving their relative paths. The archive includes only changed/new files, not a complete project. No package changes are required. Keep your existing source committed before copying.

```bash
npm run build
npm run lint
npm run dev
```

The existing `three` dependency is used. No new package installation is needed.

## Sequence

1. Arrival: a camera approaches an original 3D star field and red portal rings.
2. Perspective: the portrait assembles via a shader and transitions from side to three-quarter.
3. Connection: the front portrait appears with oversized outlined typography.
4. Beyond: the photograph disperses and the camera journey leads into the portfolio.

Scroll backwards to reverse the timeline. Chapter buttons jump along it without capturing the mouse wheel. Pause holds the visual progress while the page remains freely scrollable. Resume catches up to the current page position. Skip intro navigates to About. System reduced motion or a WebGL failure displays a static front portrait and removes the long scrolling segment.

The portrait is three photographic poses, not a reconstructed 3D model. The shader varies reveal/dispersal and blends those images. A smooth continuous head turn still requires additional frames or video. The star field, rings, and camera movement are rendered live.

## Files

- src/App.css: permits sticky positioning using overflow: clip.
- src/App.jsx: mounts exactly one home section.
- src/sections/CinematicPortrait.jsx: scene lifecycle, scroll controller and accessible navigation.
- src/sections/CinematicPortrait.css: isolated cinematic layout and responsive fallback.
- src/sections/portrait/createPortraitScene.js: original Three.js renderer and shaders.
- src/sections/HeroImageTrail.jsx: removes a pre-existing unused constant that failed lint.

## Validation

Production build passed. Full ESLint passed after removing the existing unused constant. A large shared Three.js chunk warning remains; scene code is loaded dynamically.

Browser verification could not run here: local Chromium failed to create a process-singleton socket, and the separate browser could not connect to the local server. No visual smoothness, frame-rate, mobile, or browser-console pass is claimed.

Before merging, check in Chrome and Safari at desktop and 390px width: all three poses; pinned top through each chapter; backwards scrolling; chapter buttons with keyboard; pause then resume; skip to About; no horizontal overflow; reduced motion; disabled WebGL; unchanged Todo and contact behavior.
