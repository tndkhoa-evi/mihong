import { cn } from "@/lib/utils";

const items = [
  {
    label: "Tiếp nhận / giao dịch",
    bg: "bg-intake-fill",
    border: "border-intake-stroke",
  },
  {
    label: "Xử lý nội bộ",
    bg: "bg-process-fill",
    border: "border-process-stroke",
  },
  {
    label: "Trạng thái cuối",
    bg: "bg-final-fill",
    border: "border-final-stroke",
  },
  {
    label: "Cảnh báo / nhạy cảm",
    bg: "bg-warn-fill",
    border: "border-warn-stroke",
  },
];

interface LegendProps {
  className?: string;
}

export function Legend({ className }: LegendProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-4 px-4 py-2.5 rounded-xl",
        "bg-bg-panel/80 backdrop-blur-sm border border-ink-subtle/20 shadow-sm",
        className,
      )}
    >
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2">
          <span
            className={cn("w-3.5 h-3.5 rounded border", it.bg, it.border)}
            aria-hidden
          />
          <span className="text-xs text-ink-muted font-medium">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
