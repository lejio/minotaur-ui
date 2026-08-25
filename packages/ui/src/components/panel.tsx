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
