# Terra UI

A light-only React component library for product interfaces that need editorial restraint and product density. Terra UI ships design tokens (Tailwind v4 + CSS variables), accessible Radix-based primitives, and an app shell for workspace layouts — with Newsreader and Geist typography and a deep slate/ink accent palette.

## Monorepo structure

```
terra-ui/
├── apps/
│   └── docs/          # Next.js documentation site and workspace demo
├── packages/
│   ├── ui/            # @terra-ui/ui — publishable component library
│   ├── eslint-config/ # Shared ESLint config
│   └── typescript-config/  # Shared TypeScript config
├── pnpm-workspace.yaml
└── turbo.json
```

| Package | Description |
|---------|-------------|
| `@terra-ui/ui` | React components, utilities, and compiled CSS tokens |
| `docs` | Component docs with live examples and `/demo` workspace shell |

## Getting started

Requires Node.js ≥ 20 and [pnpm](https://pnpm.io) 9.

```bash
pnpm install
pnpm dev      # Start docs dev server (http://localhost:3000)
pnpm build    # Build @terra-ui/ui and docs
pnpm test     # Run UI library tests
```

## Using in your app

Install the package (once published) or link via workspace:

```bash
pnpm add @terra-ui/ui
```

Import the compiled token stylesheet and components:

```tsx
import "@terra-ui/ui/styles.css";
import { Button } from "@terra-ui/ui";

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

Private monorepo — see package maintainers for usage terms.
