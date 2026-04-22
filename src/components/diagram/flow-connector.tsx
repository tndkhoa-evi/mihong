import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlowConnectorProps {
  variant?: "vertical" | "split-down" | "horizontal" | "split-right";
  length?: number;
  className?: string;
}

export function FlowConnector({
  variant = "vertical",
  length = 40,
  className,
}: FlowConnectorProps) {
  const isHorizontal = variant === "horizontal" || variant === "split-right";
  const accent =
    variant === "split-down" || variant === "split-right"
      ? "bg-brand/40"
      : "bg-ink-subtle/50";
  const iconColor =
    variant === "split-down" || variant === "split-right"
      ? "text-brand/70"
      : "text-ink-subtle";

  if (isHorizontal) {
    return (
      <div
        className={cn("flex flex-row items-center", className)}
        style={{ width: length }}
        aria-hidden
      >
        <div className={cn("h-0.5 flex-1", accent)} />
        <ChevronRight
          className={cn("w-4 h-4 -mx-1", iconColor)}
          strokeWidth={2.5}
        />
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-col items-center", className)}
      style={{ height: length }}
      aria-hidden
    >
      <div className={cn("w-0.5 flex-1", accent)} />
      <ChevronDown
        className={cn("w-4 h-4 -my-1", iconColor)}
        strokeWidth={2.5}
      />
    </div>
  );
}
