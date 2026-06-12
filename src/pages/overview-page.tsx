import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import {
  QrCode,
  ShieldAlert,
  Calculator,
  Receipt,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { PresentationToolbar } from "@/components/layout/presentation-toolbar";
import { OverviewDiagram } from "@/components/diagram/overview-diagram";
import { ZoomContainer } from "@/components/diagram/zoom-container";
import { Legend } from "@/components/layout/legend";
import { PrintLayout } from "@/components/layout/print-layout";
import { useZoomPan } from "@/hooks/use-zoom-pan";
import { usePresentationMode } from "@/hooks/use-presentation-mode";
import { useKeyboard } from "@/hooks/use-keyboard";
import { getTopLevelFlows } from "@/data/validate";
import { BRAND_DOC_TITLE, BRAND_NAME } from "@/lib/brand";

const JOURNEY = ["Thu mua", "Xử lý", "Lên kệ", "Bán hàng"];

const REFERENCE_LINKS = [
  {
    id: "sku",
    label: "Ký hiệu SKU",
    description: "Quy tắc đặt mã SKU, batch-ID, session ID — kế thừa nguồn gốc",
    icon: QrCode,
  },
  {
    id: "canh-bao",
    label: "Cảnh báo & Kiểm soát",
    description: "21 rule cảnh báo tự động — AML, PCRT, chống gian lận",
    icon: ShieldAlert,
  },
  {
    id: "ke-toan",
    label: "Kế toán — Tổng hợp",
    description: "Việc kế toán theo ngày / tuần / tháng / quý / năm",
    icon: Calculator,
  },
  {
    id: "gia-thanh",
    label: "Kế toán — Tính giá thành",
    description: "Sơ đồ bút toán tập hợp chi phí theo công đoạn",
    icon: Receipt,
  },
];

export function OverviewPage() {
  const navigate = useNavigate();
  const flows = getTopLevelFlows();
  const { zoom, zoomIn, zoomOut, reset } = useZoomPan();
  const { isPresenting, toolbarHidden, toggle } = usePresentationMode();
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: BRAND_DOC_TITLE,
  });

  useKeyboard({
    onZoomIn: zoomIn,
    onZoomOut: zoomOut,
    onZoomReset: reset,
    onTogglePresent: toggle,
  });

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <PresentationToolbar
        crumbs={[{ label: "Tổng quan quy trình" }]}
        canZoom
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomReset={reset}
        onTogglePresent={toggle}
        isPresenting={isPresenting}
        onPrint={handlePrint}
        hidden={isPresenting && toolbarHidden}
      />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="flex-1 flex flex-col items-center justify-start py-6"
      >
        <div className="text-center mb-2 px-6 print:hidden">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold mb-1.5">
            {BRAND_NAME} · Quy trình mua bán vàng
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-ink-strong">
            Quy trình vận hành chuẩn — từ thu mua đến bán hàng
          </h1>
          <div
            className="mt-3 flex flex-wrap items-center justify-center gap-1.5"
            aria-label="Hành trình 4 giai đoạn"
          >
            {JOURNEY.map((stage, i) => (
              <span key={stage} className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-deep">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  {stage}
                </span>
                {i < JOURNEY.length - 1 && (
                  <ChevronRight
                    className="h-3.5 w-3.5 text-ink-subtle"
                    aria-hidden
                  />
                )}
              </span>
            ))}
          </div>
          <p className="text-sm text-ink-muted mt-2.5">
            Bấm vào từng nhánh để xem chi tiết từng bước
          </p>
        </div>

        <ZoomContainer zoom={zoom}>
          <OverviewDiagram
            flows={flows}
            onLaneClick={(id) => navigate(`/flow/${id}`)}
          />
        </ZoomContainer>

        <Legend className="mt-6 print:hidden" />

        <section
          className="w-full max-w-6xl px-6 mt-8 mb-10 print:hidden"
          aria-label="Tra cứu nhanh"
        >
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-muted mb-3 text-center">
            Tra cứu nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {REFERENCE_LINKS.map((ref) => (
              <button
                key={ref.id}
                onClick={() => navigate(`/ref/${ref.id}`)}
                className="group flex items-start gap-3.5 rounded-2xl border-2 border-ink-subtle/25 bg-bg-panel p-5 text-left shadow-sm transition-all hover:border-brand/50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <ref.icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-1.5 font-semibold text-[15px] text-ink-strong">
                    {ref.label}
                    <ArrowRight
                      className="h-4 w-4 text-brand transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-ink-muted">
                    {ref.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </motion.main>

      <PrintLayout ref={printRef} />
    </div>
  );
}
