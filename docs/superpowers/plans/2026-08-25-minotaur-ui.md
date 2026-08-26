# Minotaur UI v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a publishable `@minotaur-ui/ui` library (Harvey-inspired, light-only) plus a Next.js docs app with component pages and a workspace shell demo (sidebar, chat, document panel).

**Architecture:** pnpm + Turborepo monorepo. `packages/ui` owns tokens (CSS variables), Tailwind-styled Radix primitives, and shell building blocks, built with tsup. `apps/docs` consumes the workspace package via `transpilePackages` and hosts docs + the product demo with mock data.

**Tech Stack:** TypeScript (strict), React 19, Next.js App Router, Tailwind CSS v4, Radix UI, CVA, clsx, tailwind-merge, tsup, Vitest + React Testing Library, ESLint + Prettier, Newsreader + Geist fonts.

## Global Constraints

- Package name: `@minotaur-ui/ui`
- Theme: light only (no dark mode requirement)
- Styling: Tailwind CSS v4 + CSS variables on `:root`
- Accent: restrained deep slate/ink (not bright teal or purple)
- Fonts: Newsreader (display/headings), Geist Sans (UI/body)
- Dual register: editorial (docs landing, empty states) + product (shell density)
- No Storybook; no real AI backend; mock data only in demo
- Library must be publish-ready (`exports`, `types`, `files`, `peerDependencies`)
- Spec: `docs/superpowers/specs/2026-08-25-minotaur-ui-design.md`

---

## File structure (target)

```
minotaur-ui/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── prettier.config.mjs
├── .gitignore
├── packages/
│   ├── typescript-config/
│   │   ├── package.json
│   │   ├── base.json
│   │   ├── react-library.json
│   │   └── nextjs.json
│   ├── eslint-config/
│   │   ├── package.json
│   │   └── library.js
│   └── ui/
│       ├── package.json
│       ├── tsconfig.json
│       ├── tsup.config.ts
│       ├── vitest.config.ts
│       ├── src/
│       │   ├── index.ts
│       │   ├── styles.css
│       │   ├── lib/cn.ts
│       │   ├── components/
│       │   │   ├── button.tsx
│       │   │   ├── input.tsx
│       │   │   ├── textarea.tsx
│       │   │   ├── label.tsx
│       │   │   ├── checkbox.tsx
│       │   │   ├── select.tsx
│       │   │   ├── dialog.tsx
│       │   │   ├── dropdown-menu.tsx
│       │   │   ├── tooltip.tsx
│       │   │   ├── tabs.tsx
│       │   │   ├── badge.tsx
│       │   │   ├── separator.tsx
│       │   │   ├── avatar.tsx
│       │   │   ├── scroll-area.tsx
│       │   │   ├── app-shell.tsx
│       │   │   ├── sidebar.tsx
│       │   │   ├── top-bar.tsx
│       │   │   ├── page-header.tsx
│       │   │   ├── panel.tsx
│       │   │   └── split-view.tsx
│       │   └── __tests__/
│       │       ├── button.test.tsx
│       │       └── dialog.test.tsx
│       └── dist/                    # build output (gitignored)
└── apps/
    └── docs/
        ├── package.json
        ├── next.config.ts
        ├── tsconfig.json
        ├── postcss.config.mjs
        ├── app/
        │   ├── layout.tsx
        │   ├── globals.css
        │   ├── page.tsx
        │   ├── components/
        │   │   ├── page.tsx
        │   │   └── [slug]/page.tsx
        │   └── demo/
        │       └── page.tsx
        └── lib/
            └── component-docs.ts
```

---

### Task 1: Scaffold monorepo workspace

**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.gitignore`, `prettier.config.mjs`
- Create: `packages/typescript-config/package.json`, `packages/typescript-config/base.json`, `packages/typescript-config/react-library.json`, `packages/typescript-config/nextjs.json`
- Create: `packages/eslint-config/package.json`, `packages/eslint-config/library.js`
- Create: `packages/ui/package.json`, `packages/ui/tsconfig.json`
- Create: `apps/docs/package.json` (minimal stub; Next scaffold completed in Task 8)

**Interfaces:**
- Consumes: none
- Produces: pnpm workspace with `@minotaur-ui/typescript-config`, `@minotaur-ui/eslint-config`, `@minotaur-ui/ui` (empty), `docs` app stub

- [ ] **Step 1: Create root workspace files**

`package.json`:
```json
{
  "name": "minotaur-ui",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "format": "prettier --write \"**/*.{ts,tsx,md,json,css}\""
  },
  "devDependencies": {
    "prettier": "^3.5.3",
    "turbo": "^2.5.4",
    "typescript": "^5.8.3"
  },
  "packageManager": "pnpm@9.15.0",
  "engines": {
    "node": ">=20"
  }
}
```

`pnpm-workspace.yaml`:
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

`turbo.json`:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

`.gitignore`:
```
node_modules
dist
.next
.turbo
coverage
*.log
.DS_Store
```

`prettier.config.mjs`:
```js
/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 90,
};
export default config;
```

- [ ] **Step 2: Create shared TypeScript configs**

`packages/typescript-config/package.json`:
```json
{
  "name": "@minotaur-ui/typescript-config",
  "version": "0.0.0",
  "private": true,
  "files": ["*.json"]
}
```

`packages/typescript-config/base.json`:
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "noUncheckedIndexedAccess": true
  }
}
```

`packages/typescript-config/react-library.json`:
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  }
}
```

`packages/typescript-config/nextjs.json`:
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "allowJs": true,
    "noEmit": true,
    "incremental": true,
    "plugins": [{ "name": "next" }]
  }
}
```

- [ ] **Step 3: Create shared ESLint config package stub**

`packages/eslint-config/package.json`:
```json
{
  "name": "@minotaur-ui/eslint-config",
  "version": "0.0.0",
  "private": true,
  "main": "library.js",
  "files": ["library.js"]
}
```

`packages/eslint-config/library.js`:
```js
/** @type {import("eslint").Linter.Config[]} */
module.exports = [
  {
    ignores: ["dist/**", ".next/**", "node_modules/**"],
  },
];
```

- [ ] **Step 4: Create `packages/ui` package skeleton**

`packages/ui/package.json`:
```json
{
  "name": "@minotaur-ui/ui",
  "version": "0.1.0",
  "private": false,
  "type": "module",
  "sideEffects": ["**/*.css"],
  "files": ["dist"],
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./styles.css": "./dist/styles.css"
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint ."
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@minotaur-ui/typescript-config": "workspace:*",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "tsup": "^8.4.0",
    "typescript": "^5.8.3",
    "vitest": "^3.1.2",
    "@testing-library/react": "^16.3.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.2.0"
  },
  "dependencies": {
    "@radix-ui/react-avatar": "^1.1.7",
    "@radix-ui/react-checkbox": "^1.2.3",
    "@radix-ui/react-dialog": "^1.1.11",
    "@radix-ui/react-dropdown-menu": "^2.1.12",
    "@radix-ui/react-label": "^2.1.4",
    "@radix-ui/react-scroll-area": "^1.2.6",
    "@radix-ui/react-select": "^2.2.2",
    "@radix-ui/react-separator": "^1.1.4",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-tabs": "^1.1.9",
    "@radix-ui/react-tooltip": "^1.2.4",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.2.0"
  }
}
```

`packages/ui/tsconfig.json`:
```json
{
  "extends": "@minotaur-ui/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules", "**/*.test.tsx"]
}
```

Create placeholder `packages/ui/src/index.ts`:
```ts
export {};
```

Create stub `apps/docs/package.json`:
```json
{
  "name": "docs",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

- [ ] **Step 5: Install dependencies**

Run: `pnpm install`
Expected: lockfile created; workspace packages linked without errors.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-workspace.yaml turbo.json .gitignore prettier.config.mjs pnpm-lock.yaml packages apps
git commit -m "chore: scaffold minotaur-ui pnpm monorepo"
```

---

### Task 2: Design tokens and `styles.css`

**Files:**
- Create: `packages/ui/src/styles.css`
- Create: `packages/ui/tsup.config.ts`
- Modify: `packages/ui/src/index.ts` (keep empty exports until components land; ensure CSS is copied by tsup)
- Modify: `packages/ui/package.json` if tsup needs `css` handling

**Interfaces:**
- Consumes: none
- Produces: CSS variable contract on `:root` + base element styles; build copies `styles.css` to `dist/styles.css`

- [ ] **Step 1: Write token stylesheet**

`packages/ui/src/styles.css`:
```css
:root {
  --background: #f7f5f0;
  --foreground: #1c1b19;
  --muted: #ece8e1;
  --muted-foreground: #6b6760;
  --border: #ddd6cb;
  --accent: #2f3438;
  --accent-foreground: #f7f5f0;
  --ring: #2f3438;
  --success: #3f6b54;
  --warning: #8a6a2f;
  --danger: #8f3d3d;
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --shadow-sm: 0 1px 2px rgb(28 27 25 / 0.06);
  --font-sans: "Geist", "Geist Fallback", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Newsreader", "Newsreader Fallback", ui-serif, Georgia, serif;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  color-scheme: light;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3,
.font-display {
  font-family: var(--font-serif);
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}
```

- [ ] **Step 2: Configure tsup to build JS and copy CSS**

`packages/ui/tsup.config.ts`:
```ts
import { defineConfig } from "tsup";
import { copyFileSync, mkdirSync } from "node:fs";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "react/jsx-runtime"],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
  async onSuccess() {
    mkdirSync("dist", { recursive: true });
    copyFileSync("src/styles.css", "dist/styles.css");
  },
});
```

Note: the `"use client"` banner applies to the bundle so Next App Router can import interactive components. Keep non-client utilities free of hooks; all exported UI components are client-safe.

- [ ] **Step 3: Build package to verify CSS lands in dist**

Run: `pnpm --filter @minotaur-ui/ui build`
Expected: `packages/ui/dist/styles.css` exists and contains `--background`.

- [ ] **Step 4: Commit**

```bash
git add packages/ui
git commit -m "feat(ui): add light theme design tokens"
```

---

### Task 3: `cn` helper and Button (TDD)

**Files:**
- Create: `packages/ui/src/lib/cn.ts`
- Create: `packages/ui/src/components/button.tsx`
- Create: `packages/ui/src/__tests__/button.test.tsx`
- Create: `packages/ui/vitest.config.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Consumes: tokens via class strings using CSS variables
- Produces:
  - `cn(...inputs: ClassValue[]): string`
  - `Button` props: `React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }`
  - Variants: `default | secondary | ghost | outline | danger`; sizes: `sm | md | lg`
  - Export: `Button`, `buttonVariants`, `cn`

- [ ] **Step 1: Add Vitest config**

`packages/ui/vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: [],
    globals: true,
  },
});
```

- [ ] **Step 2: Write failing Button test**

`packages/ui/src/__tests__/button.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "../components/button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
  });

  it("applies danger variant class", () => {
    render(<Button variant="danger">Delete</Button>);
    const btn = screen.getByRole("button", { name: "Delete" });
    expect(btn.className).toMatch(/danger|bg-\[var\(--danger\)\]|--danger/);
  });

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>Wait</Button>);
    expect(screen.getByRole("button", { name: "Wait" })).toBeDisabled();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm --filter @minotaur-ui/ui test`
Expected: FAIL (cannot find module `../components/button` or similar)

- [ ] **Step 4: Implement `cn` and `Button`**

`packages/ui/src/lib/cn.ts`:
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`packages/ui/src/components/button.tsx`:
```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90",
        secondary:
          "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[color-mix(in_oklab,var(--muted),var(--foreground)_6%)]",
        outline:
          "border border-[var(--border)] bg-transparent hover:bg-[var(--muted)]",
        ghost: "bg-transparent hover:bg-[var(--muted)]",
        danger: "bg-[var(--danger)] text-white hover:opacity-90",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4",
        lg: "h-11 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
```

Update `packages/ui/src/index.ts`:
```ts
export { cn } from "./lib/cn";
export { Button, buttonVariants, type ButtonProps } from "./components/button";
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm --filter @minotaur-ui/ui test`
Expected: PASS (3 tests)

- [ ] **Step 6: Commit**

```bash
git add packages/ui
git commit -m "feat(ui): add cn helper and Button"
```

---

### Task 4: Form primitives

**Files:**
- Create: `packages/ui/src/components/input.tsx`, `textarea.tsx`, `label.tsx`, `checkbox.tsx`, `select.tsx`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Consumes: `cn`
- Produces: `Input`, `Textarea`, `Label`, `Checkbox`, `Select` (+ Radix subparts: `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue`)

- [ ] **Step 1: Implement Label, Input, Textarea**

`packages/ui/src/components/label.tsx`:
```tsx
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "../lib/cn";

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn("text-sm font-medium text-[var(--foreground)]", className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;
```

`packages/ui/src/components/input.tsx`:
```tsx
import * as React from "react";
import { cn } from "../lib/cn";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-9 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-sm text-[var(--foreground)] shadow-[var(--shadow-sm)] placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";
```

`packages/ui/src/components/textarea.tsx`:
```tsx
import * as React from "react";
import { cn } from "../lib/cn";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[80px] w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] shadow-[var(--shadow-sm)] placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";
```

- [ ] **Step 2: Implement Checkbox and Select**

`packages/ui/src/components/checkbox.tsx`:
```tsx
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "../lib/cn";

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] data-[state=checked]:bg-[var(--accent)] data-[state=checked]:text-[var(--accent-foreground)] disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
        <path
          d="M2.5 6.5 L5 9 L9.5 3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
```

`packages/ui/src/components/select.tsx`:
```tsx
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "../lib/cn";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon>
      <svg viewBox="0 0 16 16" className="h-4 w-4 opacity-60" aria-hidden>
        <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-[var(--shadow-sm)]",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-[var(--radius-sm)] py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-[var(--muted)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
```

- [ ] **Step 3: Export form primitives**

Append to `packages/ui/src/index.ts`:
```ts
export { Input } from "./components/input";
export { Textarea } from "./components/textarea";
export { Label } from "./components/label";
export { Checkbox } from "./components/checkbox";
export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./components/select";
```

- [ ] **Step 4: Build to verify types compile**

Run: `pnpm --filter @minotaur-ui/ui build`
Expected: exit 0; `dist/index.d.ts` includes `Input`, `Select`.

- [ ] **Step 5: Commit**

```bash
git add packages/ui
git commit -m "feat(ui): add form primitives"
```

---

### Task 5: Overlay and display primitives + Dialog test

**Files:**
- Create: `dialog.tsx`, `dropdown-menu.tsx`, `tooltip.tsx`, `tabs.tsx`, `badge.tsx`, `separator.tsx`, `avatar.tsx`, `scroll-area.tsx`
- Create: `packages/ui/src/__tests__/dialog.test.tsx`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Consumes: `cn`, Button patterns
- Produces: Dialog/Dropdown/Tooltip/Tabs compound components; `Badge`, `Separator`, `Avatar`, `ScrollArea`

- [ ] **Step 1: Write failing Dialog test**

`packages/ui/src/__tests__/dialog.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/dialog";

describe("Dialog", () => {
  it("opens on trigger click and shows title", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
            <DialogDescription>Are you sure?</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.queryByText("Confirm")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByText("Confirm")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `pnpm --filter @minotaur-ui/ui test`
Expected: FAIL missing `../components/dialog`

- [ ] **Step 3: Implement Dialog and remaining primitives**

`packages/ui/src/components/dialog.tsx`:
```tsx
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "../lib/cn";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-[color-mix(in_oklab,var(--foreground)_40%,transparent)] data-[state=open]:animate-in data-[state=closed]:animate-out",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border border-[var(--border)] bg-[var(--background)] p-6 shadow-[var(--shadow-sm)] duration-200 rounded-[var(--radius-lg)]",
        className,
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 text-left", className)} {...props} />;
}

export function DialogTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("font-display text-lg text-[var(--foreground)]", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-[var(--muted-foreground)]", className)}
      {...props}
    />
  );
}
```

Implement the other files with the same patterns (Radix wrappers + `cn` + CSS variable classes):

- `dropdown-menu.tsx`: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`, `DropdownMenuLabel`
- `tooltip.tsx`: `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent`
- `tabs.tsx`: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `badge.tsx`: CVA variants `default | secondary | outline`
- `separator.tsx`: Radix Separator, horizontal/vertical
- `avatar.tsx`: `Avatar`, `AvatarImage`, `AvatarFallback`
- `scroll-area.tsx`: `ScrollArea`, `ScrollBar`

Use muted backgrounds, hairline borders, and `rounded-[var(--radius-*)]`. Keep class strings consistent with Button/Input.

- [ ] **Step 4: Export everything from index**

```ts
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./components/dialog";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./components/dropdown-menu";
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./components/tooltip";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/tabs";
export { Badge } from "./components/badge";
export { Separator } from "./components/separator";
export { Avatar, AvatarImage, AvatarFallback } from "./components/avatar";
export { ScrollArea } from "./components/scroll-area";
```

- [ ] **Step 5: Run tests**

Run: `pnpm --filter @minotaur-ui/ui test`
Expected: PASS (Button + Dialog tests)

- [ ] **Step 6: Commit**

```bash
git add packages/ui
git commit -m "feat(ui): add overlay and display primitives"
```

---

### Task 6: Shell building blocks

**Files:**
- Create: `app-shell.tsx`, `sidebar.tsx`, `top-bar.tsx`, `page-header.tsx`, `panel.tsx`, `split-view.tsx`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Consumes: `cn`, `Separator`, `ScrollArea`, `Button`
- Produces:
  - `AppShell({ sidebar, children, className? })`
  - `Sidebar`, `SidebarHeader`, `SidebarNav`, `SidebarItem({ href?, active?, children, onClick? })`
  - `TopBar`, `PageHeader({ title, description?, actions? })`
  - `Panel({ title?, children })`
  - `SplitView({ primary, secondary, primaryWidthClassName? })`

- [ ] **Step 1: Implement shell components**

`packages/ui/src/components/app-shell.tsx`:
```tsx
import * as React from "react";
import { cn } from "../lib/cn";

export function AppShell({
  sidebar,
  children,
  className,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-screen bg-[var(--background)] text-[var(--foreground)]", className)}>
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
```

`packages/ui/src/components/sidebar.tsx`:
```tsx
import * as React from "react";
import { cn } from "../lib/cn";

export function Sidebar({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <aside
      className={cn(
        "flex w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--muted)]/40",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-14 items-center border-b border-[var(--border)] px-4 font-display text-lg",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return <nav className={cn("flex flex-1 flex-col gap-1 p-2", className)} {...props} />;
}

export function SidebarItem({
  className,
  active,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center rounded-[var(--radius-md)] px-3 py-2 text-left text-sm transition-colors",
        active
          ? "bg-[var(--background)] text-[var(--foreground)] shadow-[var(--shadow-sm)]"
          : "text-[var(--muted-foreground)] hover:bg-[var(--background)]/70 hover:text-[var(--foreground)]",
        className,
      )}
      {...props}
    />
  );
}
```

`packages/ui/src/components/top-bar.tsx`:
```tsx
import * as React from "react";
import { cn } from "../lib/cn";

export function TopBar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      className={cn(
        "flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-4",
        className,
      )}
      {...props}
    />
  );
}
```

`packages/ui/src/components/page-header.tsx`:
```tsx
import * as React from "react";
import { cn } from "../lib/cn";

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 px-6 py-5", className)}>
      <div className="space-y-1">
        <h1 className="font-display text-2xl text-[var(--foreground)]">{title}</h1>
        {description ? (
          <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}
```

`packages/ui/src/components/panel.tsx`:
```tsx
import * as React from "react";
import { cn } from "../lib/cn";

export function Panel({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex min-h-0 flex-1 flex-col border border-[var(--border)] bg-[var(--background)] rounded-[var(--radius-lg)]",
        className,
      )}
    >
      {title ? (
        <div className="border-b border-[var(--border)] px-4 py-3 text-sm font-medium">
          {title}
        </div>
      ) : null}
      <div className="min-h-0 flex-1 p-4">{children}</div>
    </section>
  );
}
```

`packages/ui/src/components/split-view.tsx`:
```tsx
import * as React from "react";
import { cn } from "../lib/cn";

export function SplitView({
  primary,
  secondary,
  className,
  primaryClassName = "w-[42%]",
}: {
  primary: React.ReactNode;
  secondary: React.ReactNode;
  className?: string;
  primaryClassName?: string;
}) {
  return (
    <div className={cn("flex min-h-0 flex-1 gap-4 p-4", className)}>
      <div className={cn("flex min-h-0 shrink-0 flex-col", primaryClassName)}>{primary}</div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{secondary}</div>
    </div>
  );
}
```

- [ ] **Step 2: Export shell components from index**

```ts
export { AppShell } from "./components/app-shell";
export { Sidebar, SidebarHeader, SidebarNav, SidebarItem } from "./components/sidebar";
export { TopBar } from "./components/top-bar";
export { PageHeader } from "./components/page-header";
export { Panel } from "./components/panel";
export { SplitView } from "./components/split-view";
```

- [ ] **Step 3: Build + test**

Run: `pnpm --filter @minotaur-ui/ui build && pnpm --filter @minotaur-ui/ui test`
Expected: both exit 0

- [ ] **Step 4: Commit**

```bash
git add packages/ui
git commit -m "feat(ui): add app shell building blocks"
```

---

### Task 7: Next.js docs app scaffold + theming

**Files:**
- Replace/expand: `apps/docs/package.json`, `apps/docs/tsconfig.json`, `apps/docs/next.config.ts`, `apps/docs/postcss.config.mjs`
- Create: `apps/docs/app/layout.tsx`, `globals.css`, `page.tsx`
- Ensure Tailwind v4 scans both docs and `packages/ui` source

**Interfaces:**
- Consumes: `@minotaur-ui/ui`, `@minotaur-ui/ui/styles.css`
- Produces: running Next app at `/` with editorial landing linking to Components and Demo

- [ ] **Step 1: Configure docs package**

`apps/docs/package.json`:
```json
{
  "name": "docs",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@minotaur-ui/ui": "workspace:*",
    "next": "^15.3.1",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@minotaur-ui/typescript-config": "workspace:*",
    "@tailwindcss/postcss": "^4.1.4",
    "@types/node": "^22.14.1",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "tailwindcss": "^4.1.4",
    "typescript": "^5.8.3"
  }
}
```

`apps/docs/next.config.ts`:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@minotaur-ui/ui"],
};

export default nextConfig;
```

`apps/docs/tsconfig.json`:
```json
{
  "extends": "@minotaur-ui/typescript-config/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`apps/docs/postcss.config.mjs`:
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

- [ ] **Step 2: Install and create app shell files**

Run: `pnpm install`

`apps/docs/app/globals.css`:
```css
@import "tailwindcss";
@import "@minotaur-ui/ui/styles.css";

@source "../../../packages/ui/src";

@theme inline {
  --font-sans: var(--font-sans);
  --font-serif: var(--font-serif);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
}
```

`apps/docs/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Geist, Newsreader } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: "Minotaur UI",
  description: "Editorial design system for calm product interfaces",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${newsreader.variable}`}>
      <body
        style={
          {
            "--font-sans": "var(--font-geist), ui-sans-serif, system-ui, sans-serif",
            "--font-serif": "var(--font-newsreader), ui-serif, Georgia, serif",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
```

`apps/docs/app/page.tsx`:
```tsx
import Link from "next/link";
import { Button } from "@minotaur-ui/ui";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
        Minotaur UI
      </p>
      <h1 className="font-display text-5xl text-[var(--foreground)]">
        Quiet interfaces for serious work.
      </h1>
      <p className="max-w-xl text-lg text-[var(--muted-foreground)]">
        A light-only component library with editorial restraint and product density —
        tokens, primitives, and an app shell you can ship.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/components">Browse components</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/demo">Open workspace demo</Link>
        </Button>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Verify docs app starts**

Run: `pnpm --filter docs build`
Expected: Next build succeeds.

- [ ] **Step 4: Commit**

```bash
git add apps/docs pnpm-lock.yaml
git commit -m "feat(docs): scaffold Next.js docs app with Minotaur theme"
```

---

### Task 8: Component documentation pages

**Files:**
- Create: `apps/docs/lib/component-docs.ts`
- Create: `apps/docs/app/components/page.tsx`
- Create: `apps/docs/app/components/[slug]/page.tsx`

**Interfaces:**
- Consumes: all exported primitives from `@minotaur-ui/ui`
- Produces: `/components` index + `/components/[slug]` live examples for every v1 component

- [ ] **Step 1: Define docs registry**

`apps/docs/lib/component-docs.ts` — export an array:

```ts
export type ComponentDoc = {
  slug: string;
  title: string;
  description: string;
};

export const componentDocs: ComponentDoc[] = [
  { slug: "button", title: "Button", description: "Primary actions and quiet alternatives." },
  { slug: "input", title: "Input", description: "Single-line text fields." },
  { slug: "textarea", title: "Textarea", description: "Multi-line text entry." },
  { slug: "label", title: "Label", description: "Accessible field labels." },
  { slug: "checkbox", title: "Checkbox", description: "Binary choices." },
  { slug: "select", title: "Select", description: "Single option menus." },
  { slug: "dialog", title: "Dialog", description: "Focused modal tasks." },
  { slug: "dropdown-menu", title: "Dropdown Menu", description: "Contextual actions." },
  { slug: "tooltip", title: "Tooltip", description: "Short hover hints." },
  { slug: "tabs", title: "Tabs", description: "Section switching." },
  { slug: "badge", title: "Badge", description: "Compact status labels." },
  { slug: "separator", title: "Separator", description: "Hairline division." },
  { slug: "avatar", title: "Avatar", description: "User or entity marks." },
  { slug: "scroll-area", title: "Scroll Area", description: "Contained scrolling." },
  { slug: "app-shell", title: "App Shell", description: "Sidebar + main layout." },
  { slug: "sidebar", title: "Sidebar", description: "Navigation chrome." },
  { slug: "top-bar", title: "Top Bar", description: "Dense header strip." },
  { slug: "page-header", title: "Page Header", description: "Title, description, actions." },
  { slug: "panel", title: "Panel", description: "Bordered content surface." },
  { slug: "split-view", title: "Split View", description: "Primary + secondary panes." },
];
```

- [ ] **Step 2: Build index and slug pages**

`/components` lists links for each doc entry with editorial intro.

`/components/[slug]` renders:
- Title (serif) + description
- Live example using the real component(s)
- Short usage snippet in a `<pre>`

Implement a `switch (slug)` or map of example renderers covering every slug above. For compound components (Dialog, Select, etc.), show a minimal working composition.

Wrap interactive examples that need client state in small `"use client"` example components colocated under `apps/docs/app/components/_examples/`.

- [ ] **Step 3: Build docs**

Run: `pnpm --filter docs build`
Expected: all `/components/*` routes build.

- [ ] **Step 4: Commit**

```bash
git add apps/docs
git commit -m "feat(docs): add component documentation pages"
```

---

### Task 9: Workspace product demo

**Files:**
- Create: `apps/docs/app/demo/page.tsx`
- Create: `apps/docs/app/demo/workspace-demo.tsx` (`"use client"`)

**Interfaces:**
- Consumes: `AppShell`, `Sidebar*`, `TopBar`, `PageHeader`, `SplitView`, `Panel`, `ScrollArea`, `Avatar`, `Button`, `Textarea`, `Badge`
- Produces: `/demo` — sidebar workspace with mock chat thread + document panel; include 2–3 CSS transitions (sidebar item active state, panel fade/slide on mount, composer focus ring already from tokens)

- [ ] **Step 1: Implement client workspace demo**

`workspace-demo.tsx` responsibilities:
- Sidebar with brand “Minotaur”, nav items (Matters, Research, Drafts) — one `active`
- TopBar with muted status badge “Demo”
- PageHeader title “Research workspace”
- SplitView:
  - Primary `Panel` title “Assistant”: scrollable mock messages (user/assistant), composer `Textarea` + `Button` that appends a local message (client state only)
  - Secondary `Panel` title “Document”: mock legal/memo paragraphs with editorial serif heading
- Motion: `transition-colors` on sidebar items; `animate` class or CSS `@keyframes` fade-in for panels on first paint; composer button hover opacity

Mock data only — no network.

- [ ] **Step 2: Server page wrapper**

`apps/docs/app/demo/page.tsx` imports and renders `WorkspaceDemo`.

- [ ] **Step 3: Verify**

Run: `pnpm --filter docs build`
Expected: `/demo` builds. Manually spot-check with `pnpm --filter docs dev` if available.

- [ ] **Step 4: Commit**

```bash
git add apps/docs
git commit -m "feat(docs): add workspace shell demo"
```

---

### Task 10: Publish readiness and verification

**Files:**
- Modify: `packages/ui/package.json` (confirm `files`, `exports`, `peerDependencies`)
- Create: `README.md` at repo root (install + usage)
- Optionally: ensure `private: false` on `@minotaur-ui/ui`

**Interfaces:**
- Consumes: completed library
- Produces: verified monorepo scripts + consumer instructions

- [ ] **Step 1: Write root README**

Include:
- What Minotaur UI is
- Monorepo structure
- `pnpm install` / `pnpm dev` / `pnpm build` / `pnpm test`
- Consumer snippet:

```tsx
import "@minotaur-ui/ui/styles.css";
import { Button } from "@minotaur-ui/ui";
```

- [ ] **Step 2: Run full verification**

```bash
pnpm test
pnpm build
```

Expected: UI tests pass; `@minotaur-ui/ui` and `docs` build successfully; `packages/ui/dist` contains `index.js`, `index.d.ts`, `styles.css`.

- [ ] **Step 3: Confirm success criteria**

Checklist against spec:
1. Library installable via workspace and renders with token CSS
2. Docs list each v1 component with live examples
3. `/demo` shows editorial + dense shell (sidebar, chat, document)
4. Package exports/types/files/peerDependencies present

- [ ] **Step 4: Commit**

```bash
git add README.md packages/ui/package.json
git commit -m "docs: add README and confirm publish-ready package exports"
```

---

## Spec coverage self-review

| Spec requirement | Task |
|------------------|------|
| Monorepo pnpm + Turborepo | Task 1 |
| `@minotaur-ui/ui` + `apps/docs` | Tasks 1, 7 |
| Tailwind v4 + CSS variables, light only | Tasks 2, 7 |
| Newsreader + Geist | Task 7 |
| Deep slate/ink accent | Task 2 |
| Foundation primitives list | Tasks 3–5 |
| Shell: AppShell, Sidebar*, TopBar, PageHeader, Panel, SplitView | Task 6 |
| Docs pages + live examples | Task 8 |
| Chat + document demo, mock data | Task 9 |
| RTL smoke tests Button + Dialog | Tasks 3, 5 |
| Publish-ready exports | Tasks 1, 10 |
| Editorial + product dual register | Tasks 7–9 |
| No Storybook / no dark / no real AI | Honored throughout |

**Placeholder scan:** none intentional. Task 5 Step 3 lists remaining overlay/display files to implement with the same Radix+`cn` pattern as Dialog (full Dialog code inlined; sibling components follow identical structure).

**Type consistency:** `cn`, `Button`/`ButtonProps`/`buttonVariants`, shell prop shapes, and CSS variable names are stable across tasks.
