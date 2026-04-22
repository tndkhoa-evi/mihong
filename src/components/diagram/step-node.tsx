import { motion } from "framer-motion";
import type { Step } from "@/data/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { kindStyles } from "./step-kind-style";

interface StepNodeProps {
  step: Step;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

export function StepNode({ step, onClick, active, className }: StepNodeProps) {
  const style = kindStyles[step.kind];
  const Icon = style.icon;

  return (
    <motion.button
      layoutId={`step-card-${step.id}`}
      onClick={onClick}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(
        "group relative w-[200px] h-[120px] rounded-xl border-2 p-2.5 text-left shadow-sm flex flex-col",
        "transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        style.card,
        style.border,
        active && "ring-2 ring-brand ring-offset-2 ring-offset-bg-base",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-baseline gap-2 flex-1 min-w-0">
          <Badge variant="brand" className="px-1.5 py-0.5 text-xs shrink-0">
            {step.order}
          </Badge>
          <h3
            className={cn(
              "text-[13px] font-semibold leading-tight line-clamp-2 h-[32px]",
              style.title,
            )}
          >
            {step.title}
          </h3>
        </div>
        <Icon
          className={cn("w-3.5 h-3.5 shrink-0 mt-0.5", style.iconColor)}
          aria-hidden
        />
      </div>
      <p className="mt-1.5 text-[11px] text-ink-muted font-medium h-[14px] truncate">
        {step.department}
      </p>
      <p
        className={cn(
          "mt-1 text-[11px] leading-snug line-clamp-2 h-[28px]",
          style.title,
          "opacity-80",
        )}
      >
        {step.subtitle}
      </p>
    </motion.button>
  );
}
