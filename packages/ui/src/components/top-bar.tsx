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
