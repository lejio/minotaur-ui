# Terra UI — Design Spec

**Date:** 2026-08-25  
**Status:** Approved for planning  
**Repo:** `~/Developer/Workspace/Projects/terra-ui`

## Goal

Build **Terra UI**: an open/team design system and component library inspired by Harvey AI’s quiet, editorial product aesthetic, delivered as:

1. A **publishable React component library** (`@terra-ui/ui`)
2. A **Next.js App Router docs + product-shell demo** (`apps/docs`) that consumes the library

v1 is light-theme only. Visual language blends **editorial restraint** (marketing/docs, empty states) with **product density** (workspace chrome: sidebar, chat, document panels).

## Non-goals (v1)

- Dark mode polish (tokens may be structured for later; no dark UI requirement)
- Storybook (docs app is the canonical showcase)
- Real AI / backend integration (demo uses static mock data)
- Full form kit, data tables, charts, or large marketing section library
- Automated npm publish pipeline / Changesets (package should be *publish-ready*; automation can come later)
- Multi-package component split (one UI package for v1)

## Architecture

### Monorepo layout

```
terra-ui/
├── apps/
│   └── docs/                 # Next.js App Router — docs + shell demo (private)
├── packages/
│   ├── ui/                   # @terra-ui/ui — publishable library
│   ├── typescript-config/    # shared TS configs
│   └── eslint-config/        # shared ESLint configs
├── package.json              # pnpm workspace root
├── pnpm-workspace.yaml
└── turbo.json
```

**Tooling:** pnpm workspaces + Turborepo.

### Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Language | TypeScript (strict) | Open team library requires clear types |
| UI primitives | Radix UI | Accessibility, focus management, unstyled behavior |
| Styling | Tailwind CSS v4 | Utility DX; tokens via CSS variables mapped into theme |
| Variants | `class-variance-authority` + `clsx` / `tailwind-merge` (`cn` helper) | Consistent `variant` / `size` APIs |
| Docs app | Next.js App Router | Same runtime consumers will use; RSC-friendly docs |
| Package model | shadcn-style ownership | Source lives in-repo; published as `@terra-ui/ui` for install |

### Package boundary

- **`@terra-ui/ui`**
  - Peer deps: `react`, `react-dom`
  - Exports: named component exports + CSS entry for tokens
  - Build: `tsup` (or equivalent) emitting ESM + `.d.ts` for publish; docs app may also use Next `transpilePackages` during local development
- **`apps/docs`**
  - Depends on `@terra-ui/ui` via `workspace:*`
  - Not published

### Consumer DX (target)

```tsx
import "@terra-ui/ui/styles.css";
import { Button, AppShell } from "@terra-ui/ui";
```

Consumers who already use Tailwind may also share the same CSS variable contract so utilities like `bg-background` align when configured.

## Visual language

### Personality

Quietly authoritative — legal/editorial calm. Paper-like surfaces, precise interaction, no loud gradients, pill clusters, or generic “AI purple” chrome.

### Color (light only)

CSS variables on `:root`:

- `--background` — warm off-white / paper
- `--foreground` — near-black ink
- `--muted` / `--muted-foreground` — secondary panels, sidebars, quiet text
- `--border` — hairline, low contrast
- `--accent` / `--accent-foreground` — restrained deep slate/ink primary; used sparingly (not bright teal or purple)
- `--ring` — focus ring
- Semantic: `--success`, `--warning`, `--danger` — desaturated, professional

### Typography

- **Display / headings:** Newsreader (serif) for editorial moments
- **UI / body:** Geist Sans for dense chrome
- Clear type scale; generous line-height on long reading surfaces; tighter rhythm inside the shell

### Space, shape, motion

- Editorial surfaces: generous whitespace
- Product surfaces: denser padding and tighter stacks
- Subtle radius; elevation primarily via borders, soft shadows only when needed
- Motion: short and purposeful (sidebar, panels, focus) — demo ships 2–3 intentional motions, not decorative noise

### Dual register (same token system)

| Register | Where | Feel |
|----------|--------|------|
| Editorial | Docs landing, empty states, section intros | Serif headlines, more air |
| Product | App shell, chat, document panel | Sans-led, denser, calm |

## Components & surfaces (v1)

### Foundation (`packages/ui`)

**Tokens:** color, typography, space, radius, elevation (CSS variables + Tailwind theme mapping).

**Primitives:**

- `Button`, `Input`, `Textarea`, `Label`, `Checkbox`, `Select`
- `Dialog`, `DropdownMenu`, `Tooltip`, `Tabs`
- `Badge`, `Separator`, `Avatar`, `ScrollArea`

**Helpers:** `cn()`, shared variant/size conventions, exported TypeScript prop types.

### Shell building blocks (`packages/ui`)

- `AppShell` (sidebar + main)
- `Sidebar`, `SidebarNav`, `SidebarItem`
- `TopBar`, `PageHeader`
- `Panel`, `SplitView` (document + context layouts)

### Docs app patterns (`apps/docs`)

- Index + per-component documentation pages (usage, props summary, live examples)
- Product demo route: workspace shell with **chat thread** + **document panel** (mock data only)

## API conventions

- Named exports only from `@terra-ui/ui` (no default export barrel surprises beyond a single index)
- Prefer composable parts over mega-props (e.g. `Dialog` + `DialogContent` pattern consistent with Radix)
- `variant` and `size` where applicable; sensible defaults that look correct in both editorial and product contexts
- Accessibility is required: keyboard navigation, visible focus, correct labeling via Radix patterns

## Quality bar

- TypeScript strict across the monorepo
- Shared ESLint config + Prettier
- Docs app must `build` cleanly
- Minimal tests: React Testing Library smoke tests for critical primitives (e.g. Button variants render; Dialog open/close)
- No E2E suite in v1

## Success criteria (v1)

1. `@terra-ui/ui` can be linked/installed and renders primitives with token CSS.
2. Docs site lists each v1 component with live examples.
3. One shell demo page reads as Harvey-adjacent: editorial empty/calm states + dense workspace chrome (sidebar, chat, document panel).
4. Library `package.json` is publish-ready (`name`, `exports`, `types`, `files`, `peerDependencies`).

## Implementation sequence (high level)

1. Scaffold monorepo (pnpm, Turborepo, shared configs).
2. Define tokens + Tailwind theme in `packages/ui`.
3. Implement foundation primitives.
4. Implement shell building blocks.
5. Build `apps/docs` component pages + product demo.
6. Verify build, types, and smoke tests; tighten package exports.

Detailed task breakdown belongs in the implementation plan (next step after spec approval).
