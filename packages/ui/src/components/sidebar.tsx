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
