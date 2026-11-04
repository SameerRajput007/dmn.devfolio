# Development rules

- Preserve truthful portfolio content. Do not invent clients, experience, project repositories, social profiles, reviews, or business addresses.
- Keep new visual experiments inside the lab. Prefer existing React, Framer Motion, Lucide and browser APIs before adding dependencies.
- Provide keyboard controls, visible focus, readable labels, touch equivalents, pause and reduced-motion fallbacks.
- Clean up animation frames, observers and event listeners, including React StrictMode remounts.
- Never render submitted content using raw HTML. Never commit secrets or claim a static contact form sends mail.
- Avoid a continuous canvas loop when there is no interaction. Lazy-load noncritical images.
- Run build, lint, browser interactions and narrow-screen checks for UI changes. Report measured results rather than assumed Lighthouse scores.
- Domain changes require coordinated metadata, robots, sitemap and documentation edits.
- Use the existing isolated cloud checkout; create no worktree unless requested.
