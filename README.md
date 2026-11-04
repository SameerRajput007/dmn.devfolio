# Sameer’s portfolio

React 19 + Vite 8 portfolio with responsive project sections, an interactive portrait lab, a task-list demo, and a contact form that prepares an email in the visitor’s email application.

Public URL: https://dmndevfolio21.vercel.app/

## Develop

Use Node 24 (validated with 24.22.1) and npm 11.

```sh
npm ci
npm run dev -- --host 0.0.0.0 --port 5173
```

No backend, secret variables, or external font service is required. Theme preference and demo tasks are saved locally when storage is available; tasks support editing.

## Validate and preview

```sh
npm run build
npm run lint
npm run preview -- --host 0.0.0.0 --port 5173
```

See [validation results](docs/VALIDATION.md) for functional/browser, accessibility, Lighthouse and dependency-audit evidence. There is no repository test runner configured.

## Project notes

- [Mac and Vercel synchronization](docs/LOCAL-SYNC.md)
- [Concept implementation map](docs/CONCEPT-MAP.md)
- [Product requirements](PRD.md)
- [Architecture](ARCHITECTURE.md)
- [Design](DESIGN.md)
- [Development rules](RULES.md)
- [Release tasks](TASKS.md)
- [Handoff facts](MEMORY.md)
- [Search and release steps](docs/SEARCH-AND-RELEASE.md)

The visual lab’s layered and rotating views operate on a flat portrait. They do not reconstruct a 3D person. Production security headers are configured in `vercel.json` and apply after deployment. Search Console and any eligible Business Profile require owner setup; this code does not register or publish them.
