import { Navigate, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { QrCode, ShieldAlert, Calculator, Receipt } from "lucide-react";
import { PresentationToolbar } from "@/components/layout/presentation-toolbar";
import { SkuCodesView } from "@/components/reference/sku-codes-view";
import { AlertRulesView } from "@/components/reference/alert-rules-view";
import { AccountingTasksView } from "@/components/reference/accounting-tasks-view";
import { CostingEntriesView } from "@/components/reference/costing-entries-view";
import { cn } from "@/lib/utils";

const TABS = [
  {
    id: "sku",
    label: "Ký hiệu SKU",
    description: "Quy tắc đặt mã SKU, batch-ID, session — tra cứu nhanh",
    icon: QrCode,
    view: SkuCodesView,
  },
  {
    id: "canh-bao",
    label: "Cảnh báo & Kiểm soát",
    description:
      "Mốc AML, ngưỡng cảnh báo, kiểm soát gian lận — NĐ 24 + PCRT + ND 232/2025 + ND 320/2025",
    icon: ShieldAlert,
    view: AlertRulesView,
  },
  {
    id: "ke-toan",
    label: "Kế toán — Tổng hợp",
    description:
      "Tổng hợp việc kế toán theo ngày/tuần/tháng/quý/năm — đóng sổ + thuế + báo cáo",
    icon: Calculator,
    view: AccountingTasksView,
  },
  {
    id: "gia-thanh",
    label: "Kế toán — Tính giá thành",
    description:
      "Sơ đồ bút toán tập hợp chi phí + tính giá thành theo công đoạn (152 → 621/622/627 → 154 → 155)",
    icon: Receipt,
    view: CostingEntriesView,
  },
] as const;

export function ReferencePage() {
  const { refId } = useParams<{ refId: string }>();
  const navigate = useNavigate();
  const tab = TABS.find((t) => t.id === refId);
  if (!tab) return <Navigate to="/" replace />;
  const View = tab.view;

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <PresentationToolbar
        crumbs={[{ label: "Tổng quan", to: "/" }, { label: tab.label }]}
        canBack
      />

      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="flex-1 w-full max-w-7xl mx-auto px-6 py-8"
      >
        <header className="mb-6">
          <h1 className="text-h1 text-ink-strong flex items-center gap-2.5">
            <tab.icon className="w-6 h-6 text-brand" aria-hidden />
            {tab.label}
          </h1>
          <p className="text-sm text-ink-muted mt-1">{tab.description}</p>
        </header>

        <nav className="flex flex-wrap gap-2 mb-8" aria-label="Tra cứu">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => navigate(`/ref/${t.id}`)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-semibold transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                t.id === tab.id
                  ? "bg-brand text-white border-brand"
                  : "bg-bg-panel text-ink-muted border-ink-subtle/30 hover:border-brand/50 hover:text-brand-deep",
              )}
            >
              <t.icon className="w-4 h-4" aria-hidden />
              {t.label}
            </button>
          ))}
        </nav>

        <View />
      </motion.main>
    </div>
  );
}
