# Minotaur UI

A light-only React component library for product interfaces that need editorial restraint and product density. Minotaur UI ships design tokens (Tailwind v4 + CSS variables), accessible Radix-based primitives, and an app shell for workspace layouts — with Newsreader and Geist typography and a deep slate/ink accent palette.

## Monorepo structure

```
minotaur-ui/
├── apps/
│   └── docs/          # Next.js documentation site and workspace demo
├── packages/
│   ├── ui/            # @minotaur-ui/ui — publishable component library
│   ├── eslint-config/ # Shared ESLint config
│   └── typescript-config/  # Shared TypeScript config
├── pnpm-workspace.yaml
└── turbo.json
```

| Package | Description |
|---------|-------------|
| `@minotaur-ui/ui` | React components, utilities, and compiled CSS tokens |
| `docs` | Component docs with live examples and `/demo` workspace shell |

## Getting started

Requires Node.js ≥ 20 and [pnpm](https://pnpm.io) 9.

```bash
pnpm install
pnpm dev      # Start docs dev server (http://localhost:3000)
pnpm build    # Build @minotaur-ui/ui and docs
pnpm test     # Run UI library tests
```

## Using in your app

Install the package (once published) or link via workspace:

```bash
pnpm add @minotaur-ui/ui
```

Minotaur UI requires Tailwind CSS v4 in the consuming app. Import Tailwind and Minotaur UI's
token stylesheet in your global CSS, then explicitly scan the installed package so
Tailwind generates the utilities used by the components (adjust the relative path for
your stylesheet):

```css
@import "tailwindcss";
@import "@minotaur-ui/ui/styles.css";

@source "../node_modules/@minotaur-ui/ui/dist";
```

If you consume the package through this monorepo, source `packages/ui/src` instead, as
shown in `apps/docs/app/globals.css`. Importing `styles.css` alone provides tokens and
base styles, but not all component utility CSS.

Then import components:

```tsx
import { Button } from "@minotaur-ui/ui";

export function Example() {
  return <Button>Save draft</Button>;
}
```

Peer dependencies: `react` and `react-dom` ^19.

## Documentation

Run `pnpm dev` and open:

- `/components` — all v1 components with live examples
- `/demo` — editorial + dense workspace shell (sidebar, chat, document)

## License

MIT
