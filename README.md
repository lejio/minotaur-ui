# Minotaur UI

A light-only React component library for product interfaces that need editorial restraint and product density. Minotaur UI ships design tokens (Tailwind v4 + CSS variables), accessible Radix-based primitives, and an app shell for workspace layouts — with Newsreader and Geist typography and a deep slate/ink accent palette.

## Monorepo structure

```
minotaur-ui/
├── demo/              # Next.js product workspace demo
├── web/               # Next.js documentation site
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
| `web` | Component docs with live examples and `/demo` workspace shell |
| `demo` | Standalone product workspace app |

## Getting started

Requires Node.js ≥ 20 and [pnpm](https://pnpm.io) 9.

```bash
pnpm install
pnpm dev      # Start web (http://localhost:3000) and demo (http://localhost:3001)
pnpm build    # Build @minotaur-ui/ui, web, and demo
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
shown in `web/app/globals.css`. Importing `styles.css` alone provides tokens and
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

Run `pnpm --filter web dev` and open:

- `/components` — all v1 components with live examples
- `/demo` — editorial + dense workspace shell (sidebar, chat, document)

## License

MIT
