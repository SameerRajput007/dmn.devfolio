# Sync your Mac and Vercel

The Mac checkout uses `SameerRajput007/dmn.devfolio`; Vercel uses `SameerRajput007/dmn.devfolio21`. The integrated portfolio is on dmn.devfolio21/main. The cloud session was denied push permission to dmn.devfolio, so the commands below complete that synchronization using your Mac’s existing GitHub access. Your saved work remains on `backup/local-portfolio` at `337e3d1`.

In the existing VS Code project terminal, stop Vite with Ctrl+C, confirm the working tree is clean with `git status`, then run:

```sh
git switch main
git pull --ff-only https://github.com/SameerRajput007/dmn.devfolio21.git main
git push origin main
npm ci
npm run dev -- --port 5174 --strictPort
```

Open your local site and use the new Lab navigation link or the hero’s “Try the new visual lab” link. If Git reports local changes or a non-fast-forward error, preserve those changes and resolve the divergence; do not use reset or force.

The integration preserves the ancestry of your backup commit, so this pull can fast-forward your local main without discarding your saved refactor. Vercel should build from the integration commit on dmn.devfolio21 main. Check the project’s Deployments page for that commit and a successful production result. Pushing source is not proof that a production build succeeded. This cloud session cannot modify your Mac files directly.

For future work, consider connecting Vercel to dmn.devfolio as well, so local work and deployment share one repository. Changing that setting requires the project owner; it has not been changed here.
