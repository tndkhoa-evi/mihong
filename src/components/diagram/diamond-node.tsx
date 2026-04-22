import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";
import type { Step } from "@/data/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { kindStyles } from "./step-kind-style";

interface DiamondNodeProps {
  step: Step;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

/**
 * Diamond decision node with same bounding box as StepNode (260×200).
 * Uses clip-path for the rhombus shape with a matching outline via SVG overlay.
 */
export function DiamondNode({
  step,
  onClick,
  active,
  className,
}: DiamondNodeProps) {
  const style = kindStyles[step.kind];
  const strokeColor = "#8b1a1a";

  return (
    <motion.button
      layoutId={`step-card-${step.id}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(
        "group relative w-[200px] h-[180px] focus:outline-none",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 shadow-sm transition-shadow group-hover:shadow-md",
          style.card,
        )}
        style={{
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
      />
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 200 180"
        preserveAspectRatio="none"
        aria-hidden
      >
        <polygon
          points="100,4 196,90 100,176 4,90"
          fill="none"
          stroke={strokeColor}
          strokeWidth={active ? 4 : 2}
          strokeOpacity={active ? 1 : 0.7}
        />
      </svg>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center">
        <div
          className="flex flex-col items-center justify-center"
          style={{ maxWidth: 120 }}
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Badge variant="brand" className="px-1.5 py-0 text-[10px]">
              {step.order}
            </Badge>
            <GitBranch className="w-3.5 h-3.5 text-brand" aria-hidden />
          </div>
          <h3
            className={cn(
              "text-[12px] font-semibold leading-tight line-clamp-2",
              style.title,
            )}
          >
            {step.title}
          </h3>
          <p className="mt-0.5 text-[10px] text-ink-muted font-medium truncate w-full">
            {step.department}
          </p>
          <p
            className={cn(
              "mt-1 text-[10px] leading-snug line-clamp-2",
              style.title,
              "opacity-80",
            )}
          >
            {step.subtitle}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
