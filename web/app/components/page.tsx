import Link from "next/link";
import { componentDocs } from "../../lib/component-docs";

export default function ComponentsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-16 sm:py-24">
      <div className="mb-16 max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
        >
          ← Minotaur UI
        </Link>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          Component library
        </p>
        <h1 className="font-display text-5xl leading-tight text-[var(--foreground)] sm:text-6xl">
          The pieces of a quieter interface.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--muted-foreground)]">
          Twenty focused building blocks for clear product work. Each primitive favors
          composability, measured density, and accessible interaction.
        </p>
      </div>

      <div className="grid border-t border-l border-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
        {componentDocs.map((component, index) => (
          <Link
            key={component.slug}
            href={`/components/${component.slug}`}
            className="group min-h-44 border-r border-b border-[var(--border)] p-6 transition-colors hover:bg-[var(--muted)]/50"
          >
            <span className="text-xs tabular-nums text-[var(--muted-foreground)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-8 font-display text-2xl text-[var(--foreground)]">
              {component.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              {component.description}
            </p>
            <span className="mt-6 inline-block text-sm text-[var(--foreground)] opacity-0 transition-opacity group-hover:opacity-100">
              View component →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
