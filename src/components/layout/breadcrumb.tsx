import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: Crumb[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1.5 text-sm", className)}
    >
      {items.map((item, idx) => {
        const last = idx === items.length - 1;
        const content = last ? (
          <span className="text-ink-strong font-medium" aria-current="page">
            {item.label}
          </span>
        ) : item.to ? (
          <Link
            to={item.to}
            className="text-ink-muted hover:text-brand transition-colors focus:outline-none focus-visible:underline"
          >
            {item.label}
          </Link>
        ) : (
          <span className="text-ink-muted">{item.label}</span>
        );

        return (
          <span key={idx} className="flex items-center gap-1.5">
            {content}
            {!last && (
              <ChevronRight
                className="w-3.5 h-3.5 text-ink-subtle"
                aria-hidden
              />
            )}
          </span>
        );
      })}
    </nav>
  );
}
