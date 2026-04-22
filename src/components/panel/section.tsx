import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Section({ title, children, className }: SectionProps) {
  return (
    <section className={cn("space-y-2", className)}>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
        {title}
      </h4>
      <div className="text-sm text-ink-strong leading-relaxed">{children}</div>
    </section>
  );
}

interface BulletListProps {
  items: string[];
  emptyLabel?: string;
}

export function BulletList({ items, emptyLabel = "—" }: BulletListProps) {
  if (!items.length)
    return <p className="text-ink-muted italic text-sm">{emptyLabel}</p>;
  return (
    <ul className="list-disc pl-5 space-y-1">
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

interface ChipListProps {
  items: string[];
}

export function ChipList({ items }: ChipListProps) {
  if (!items.length) return <p className="text-ink-muted italic text-sm">—</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t, i) => (
        <span
          key={i}
          className="inline-flex items-center px-2 py-0.5 rounded-md bg-bg-elevated border border-ink-subtle/20 text-xs text-ink-strong"
        >
          {t}
        </span>
      ))}
    </div>
  );
}
