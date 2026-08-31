# GitHub Pages for `web/` — Design

**Date:** 2026-08-30  
**Status:** Approved for implementation pending spec review  
**Site URL:** https://lejio.github.io/minotaur-ui/

## Goal

Deploy the Next.js docs app in `web/` to GitHub Pages via GitHub Actions, without forcing a permanent static-export config for local or other hosts.

## Constraints

- GitHub Pages serves **static** files only (no Node `next start`).
- Branch-folder Pages sources only allow `/` or `/docs`; `web/` is not selectable — Actions + artifact is required.
- Project site lives under `/minotaur-ui`, so static builds need `basePath` / `assetPrefix`.
- Local default remains `output: "standalone"` (dual-mode).

## Approach

**Env-gated Next config + official Pages Actions**

When `GITHUB_PAGES=1` (or truthy), `web/next.config.ts` enables:

- `output: "export"`
- `basePath: "/minotaur-ui"`
- `assetPrefix: "/minotaur-ui"`
- `images: { unoptimized: true }` (required for static export)

Otherwise keep current `transpilePackages` + `output: "standalone"`.

## Workflow

File: `.github/workflows/deploy-web-pages.yml`

| Item | Choice |
|------|--------|
| Triggers | `push` to `main`, plus `workflow_dispatch` |
| Package manager | pnpm (match root `packageManager`) |
| Build order | install → build `@minotaur-ui/ui` → `GITHUB_PAGES=1` build `web` |
| Artifact | `web/out` via `actions/upload-pages-artifact` |
| Deploy | `actions/deploy-pages` (separate job, `environment: github-pages`) |
| Permissions | `contents: read`, `pages: write`, `id-token: write` |

## Out of scope

- Deploying `demo/` to Pages
- Custom domain
- Changing Pages source in the GitHub UI (manual one-time: **Settings → Pages → Source = GitHub Actions**)

## Success criteria

1. Push to `main` (or manual run) builds and deploys without error.
2. https://lejio.github.io/minotaur-ui/ loads the docs home page; `/components` and `/demo` routes work under the base path.
3. `pnpm --filter web build` without `GITHUB_PAGES` still produces a standalone build locally.
