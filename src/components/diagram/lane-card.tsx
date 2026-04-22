import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Flow } from "@/data/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface LaneCardProps {
  flow: Flow;
  onClick: () => void;
  accent?: "brand" | "gold" | "neutral" | "intake" | "process";
  className?: string;
}

const accentStyles = {
  brand: {
    card: "bg-brand-soft border-brand/30 hover:border-brand/60",
    icon: "text-brand",
    title: "text-brand-deep",
  },
  gold: {
    card: "bg-gold-soft border-gold/40 hover:border-gold",
    icon: "text-gold",
    title: "text-final-ink",
  },
  neutral: {
    card: "bg-bg-panel border-ink-subtle/30 hover:border-ink-subtle/60",
    icon: "text-ink-muted",
    title: "text-ink-strong",
  },
  intake: {
    card: "bg-intake-fill border-intake-stroke/40 hover:border-intake-stroke/70",
    icon: "text-intake-stroke",
    title: "text-intake-ink",
  },
  process: {
    card: "bg-process-fill border-process-stroke/40 hover:border-process-stroke/70",
    icon: "text-process-stroke",
    title: "text-process-ink",
  },
};

export function LaneCard({
  flow,
  onClick,
  accent = "brand",
  className,
}: LaneCardProps) {
  const a = accentStyles[accent];
  return (
    <motion.button
      layoutId={`lane-card-${flow.id}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "group relative w-[380px] h-[220px] rounded-2xl border-2 p-7 text-left shadow-sm flex flex-col",
        "transition-all hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        a.card,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <Badge variant="muted" className="text-[11px] uppercase tracking-wider">
          {flow.steps.length} bước
        </Badge>
        <ArrowRight
          className={cn(
            "w-5 h-5 transition-transform group-hover:translate-x-1",
            a.icon,
          )}
          aria-hidden
        />
      </div>
      <h2
        className={cn("text-[22px] font-semibold leading-tight mb-3", a.title)}
      >
        {flow.name}
      </h2>
      <p className="text-sm text-ink-muted leading-relaxed line-clamp-3">
        {flow.shortDescription}
      </p>
    </motion.button>
  );
}
