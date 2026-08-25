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
