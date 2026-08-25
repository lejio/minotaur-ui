import Link from "next/link";
import { Button } from "@terra-ui/ui";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
        Terra UI
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
