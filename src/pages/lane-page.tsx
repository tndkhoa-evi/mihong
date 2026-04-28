import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import { PresentationToolbar } from "@/components/layout/presentation-toolbar";
import { LaneDiagram } from "@/components/diagram/lane-diagram";
import { ZoomContainer } from "@/components/diagram/zoom-container";
import { Legend } from "@/components/layout/legend";
import { StepDetailPanel } from "@/components/panel/step-detail-panel";
import { PrintLayout } from "@/components/layout/print-layout";
import { useZoomPan } from "@/hooks/use-zoom-pan";
import { usePresentationMode } from "@/hooks/use-presentation-mode";
import { useKeyboard } from "@/hooks/use-keyboard";
import { getFlow, getStep, getStepIndex } from "@/data/validate";
import type { Crumb } from "@/components/layout/breadcrumb";

export function LanePage() {
  const { flowId, stepId } = useParams<{ flowId: string; stepId?: string }>();
  const navigate = useNavigate();
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

  const flow = flowId ? getFlow(flowId) : undefined;
  const activeStep = flow && stepId ? getStep(flow.id, stepId) : undefined;

  useEffect(() => {
    if (flowId && !flow) navigate("/", { replace: true });
  }, [flowId, flow, navigate]);

  if (!flow) return null;

  const crumbs: Crumb[] = [
    { label: "Tổng quan", to: "/" },
    { label: flow.name, to: `/flow/${flow.id}` },
  ];
  if (activeStep) crumbs.push({ label: activeStep.title });

  const idx = activeStep ? getStepIndex(flow.id, activeStep.id) : -1;
  const hasPrev = idx > 0;
  const hasNext = idx >= 0 && idx < flow.steps.length - 1;

  const goToStep = (newIdx: number) => {
    const next = flow.steps[newIdx];
    if (next) navigate(`/flow/${flow.id}/step/${next.id}`);
  };

  return (
    <div
      className="min-h-screen bg-bg-base flex flex-col transition-[padding] duration-300"
      style={{ paddingBottom: activeStep ? "60vh" : 0 }}
    >
      <PresentationToolbar
        crumbs={crumbs}
        canBack
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
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="flex-1 flex flex-col items-center"
      >
        <div className="w-full max-w-3xl text-center px-6 pt-4 print:hidden">
          <h2 className="text-xl md:text-2xl font-semibold text-ink-strong">
            {flow.name}
          </h2>
          {!activeStep && flow.shortDescription && (
            <p className="text-sm text-ink-muted mt-1">
              {flow.shortDescription}
            </p>
          )}
        </div>

        <ZoomContainer zoom={zoom}>
          <LaneDiagram
            flow={flow}
            activeStepId={activeStep?.id ?? null}
            onStepClick={(s) => navigate(`/flow/${flow.id}/step/${s.id}`)}
          />
        </ZoomContainer>

        {!activeStep && <Legend className="mb-8 print:hidden" />}
      </motion.main>

      <StepDetailPanel
        flow={flow}
        step={activeStep ?? null}
        onClose={() => navigate(`/flow/${flow.id}`)}
        onPrev={() => goToStep(idx - 1)}
        onNext={() => goToStep(idx + 1)}
        onDrillSubflow={(fid) => navigate(`/flow/${fid}`)}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />

      <PrintLayout ref={printRef} />
    </div>
  );
}
