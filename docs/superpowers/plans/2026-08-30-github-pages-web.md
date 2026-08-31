# GitHub Pages for `web/` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the `web/` Next.js docs app to https://lejio.github.io/minotaur-ui/ via GitHub Actions while keeping local builds on `output: "standalone"`.

**Architecture:** Env-gated `web/next.config.ts` (`GITHUB_PAGES=1` → static export + `/minotaur-ui` basePath). Workflow builds the monorepo, uploads `web/out`, deploys with official Pages actions.

**Tech Stack:** Next.js 15, pnpm 9, GitHub Actions (`upload-pages-artifact`, `deploy-pages`)

## Global Constraints

- Site URL: `https://lejio.github.io/minotaur-ui/`
- Dual-mode only: Pages export when `GITHUB_PAGES` is truthy; otherwise `standalone`
- Do not deploy `demo/`
- Do not change GitHub UI Pages source in code (document as manual step)

---

## File map

| File | Responsibility |
|------|----------------|
| `web/next.config.ts` | Dual-mode Next config |
| `.github/workflows/deploy-web-pages.yml` | CI build + Pages deploy |
| `README.md` | Document Pages URL + manual Settings step |
| `docs/superpowers/specs/2026-08-30-github-pages-web-design.md` | Already written (no change required) |

---

### Task 1: Dual-mode Next config

**Files:**
- Modify: `web/next.config.ts`
- Verify: local build + Pages export build

**Interfaces:**
- Consumes: `process.env.GITHUB_PAGES`
- Produces: when truthy → `output: "export"`, `basePath`/`assetPrefix: "/minotaur-ui"`, `images.unoptimized: true`; else → `output: "standalone"`

- [ ] **Step 1: Replace `web/next.config.ts` with dual-mode config**

```ts
import type { NextConfig } from "next";

const isGitHubPages = Boolean(process.env.GITHUB_PAGES);

const nextConfig: NextConfig = {
  transpilePackages: ["@minotaur-ui/ui"],
  ...(isGitHubPages
    ? {
        output: "export" as const,
        basePath: "/minotaur-ui",
        assetPrefix: "/minotaur-ui",
        images: { unoptimized: true },
      }
    : {
        output: "standalone" as const,
      }),
};

export default nextConfig;
```

- [ ] **Step 2: Verify standalone build still works**

Run: `pnpm --filter @minotaur-ui/ui build && pnpm --filter web build`  
Expected: success; `.next/standalone` present (or Next reports standalone output); no `web/out`

- [ ] **Step 3: Verify Pages export build**

Run: `rm -rf web/out web/.next && GITHUB_PAGES=1 pnpm --filter web build`  
Expected: success; `web/out/index.html` exists; asset paths under `/minotaur-ui` in HTML if present

- [ ] **Step 4: Commit**

```bash
git add web/next.config.ts
git commit -m "$(cat <<'EOF'
Add dual-mode Next config for GitHub Pages export.

EOF
)"
```

---

### Task 2: Deploy workflow

**Files:**
- Create: `.github/workflows/deploy-web-pages.yml`

**Interfaces:**
- Consumes: Task 1 env gate (`GITHUB_PAGES=1`)
- Produces: Pages deployment from `web/out` on `main` push / `workflow_dispatch`

- [ ] **Step 1: Create workflow file**

```yaml
name: Deploy web to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9.15.0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install
        run: pnpm install --frozen-lockfile

      - name: Build UI package
        run: pnpm --filter @minotaur-ui/ui build

      - name: Build web (static export)
        run: pnpm --filter web build
        env:
          GITHUB_PAGES: "1"

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: web/out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Sanity-check YAML locally (optional)**

Run: `python3 -c "import pathlib; print(pathlib.Path('.github/workflows/deploy-web-pages.yml').read_text()[:80])"`  
Expected: file exists and starts with `name: Deploy web`

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy-web-pages.yml
git commit -m "$(cat <<'EOF'
Add GitHub Actions workflow to deploy web to Pages.

EOF
)"
```

---

### Task 3: README note

**Files:**
- Modify: `README.md` (Documentation section)

- [ ] **Step 1: Add Pages deploy blurb under Documentation**

After the local docs bullets, add:

```markdown
### GitHub Pages

The `web` app deploys to [https://lejio.github.io/minotaur-ui/](https://lejio.github.io/minotaur-ui/) on pushes to `main` (workflow: Deploy web to GitHub Pages).

One-time repo setting: **Settings → Pages → Source → GitHub Actions**.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
Document GitHub Pages deploy for the web docs app.

EOF
)"
```

---

## Spec coverage

| Spec requirement | Task |
|------------------|------|
| Env-gated export + basePath | Task 1 |
| Workflow build → upload → deploy | Task 2 |
| Triggers main + workflow_dispatch | Task 2 |
| Dual-mode local standalone | Task 1 |
| Manual Pages source note | Task 3 |
| Out of scope demo/custom domain | (none — omitted) |
