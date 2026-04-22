import { motion } from "framer-motion";
import { ArrowRight, Settings2 } from "lucide-react";
import type { Flow } from "@/data/types";
import { cn } from "@/lib/utils";

interface SubLaneCardProps {
  flow: Flow;
  onClick: () => void;
  className?: string;
}

export function SubLaneCard({ flow, onClick, className }: SubLaneCardProps) {
  return (
    <motion.button
      layoutId={`lane-card-${flow.id}`}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(
        "group relative rounded-xl border-2 border-dashed border-process-stroke/50 bg-process-fill/70 p-3 text-left",
        "hover:border-process-stroke hover:bg-process-fill transition-all shadow-sm hover:shadow-md",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-process-stroke",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5">
          <Settings2 className="w-3.5 h-3.5 text-process-stroke" aria-hidden />
          <span className="text-[10px] uppercase tracking-wider font-semibold text-process-stroke">
            {flow.steps.length} bước
          </span>
        </div>
        <ArrowRight
          className="w-3.5 h-3.5 text-process-stroke group-hover:translate-x-0.5 transition-transform"
          aria-hidden
        />
      </div>
      <h3 className="text-[13px] font-semibold leading-tight text-process-ink line-clamp-2">
        {flow.name}
      </h3>
      <p className="mt-1 text-[11px] text-ink-muted leading-snug line-clamp-2">
        {flow.shortDescription}
      </p>
    </motion.button>
  );
}
