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
