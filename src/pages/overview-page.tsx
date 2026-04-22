import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import { PresentationToolbar } from "@/components/layout/presentation-toolbar";
import { OverviewDiagram } from "@/components/diagram/overview-diagram";
import { ZoomContainer } from "@/components/diagram/zoom-container";
import { Legend } from "@/components/layout/legend";
import { PrintLayout } from "@/components/layout/print-layout";
import { useZoomPan } from "@/hooks/use-zoom-pan";
import { usePresentationMode } from "@/hooks/use-presentation-mode";
import { useKeyboard } from "@/hooks/use-keyboard";
import { getTopLevelFlows } from "@/data/validate";

export function OverviewPage() {
  const navigate = useNavigate();
  const flows = getTopLevelFlows();
  const { zoom, zoomIn, zoomOut, reset } = useZoomPan();
  const { isPresenting, toolbarHidden, toggle } = usePresentationMode();
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Mi-Hong-quy-trinh",
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
          <h1 className="text-2xl md:text-3xl font-semibold text-ink-strong">
            Quy trình thu mua → xử lý → lên kệ
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Bấm vào từng nhánh để xem chi tiết
          </p>
        </div>

        <ZoomContainer zoom={zoom}>
          <OverviewDiagram
            flows={flows}
            onLaneClick={(id) => navigate(`/flow/${id}`)}
          />
        </ZoomContainer>

        <Legend className="mt-6 mb-8 print:hidden" />
      </motion.main>

      <PrintLayout ref={printRef} />
    </div>
  );
}
