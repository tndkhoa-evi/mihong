import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "brand" | "muted";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums",
        variant === "default" && "bg-bg-elevated text-ink-strong",
        variant === "brand" && "bg-brand text-white",
        variant === "muted" &&
          "bg-transparent border border-ink-subtle/40 text-ink-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
