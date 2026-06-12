import { Link } from "react-router-dom";
import { processData } from "@/data/process";
import { BRAND_LOGO, BRAND_NAME } from "@/lib/brand";

export function AppHeader() {
  return (
    <Link
      to="/"
      className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md"
      aria-label="Về trang chủ"
    >
      <img
        src={BRAND_LOGO}
        alt={BRAND_NAME}
        className="w-10 h-10 object-contain"
        loading="eager"
      />
      <div className="leading-tight">
        <div className="text-brand font-bold text-[17px] tracking-tight">
          {processData.meta.title}
        </div>
        <div className="text-[11px] text-ink-muted font-medium">
          {processData.meta.subtitle}
        </div>
      </div>
    </Link>
  );
}
