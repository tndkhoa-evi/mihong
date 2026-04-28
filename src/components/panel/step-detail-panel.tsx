import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, GitBranch, X } from "lucide-react";
import type { Flow, Step } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { kindStyles } from "@/components/diagram/step-kind-style";
import { Section, BulletList, ChipList } from "./section";
import { cn } from "@/lib/utils";

interface StepDetailPanelProps {
  flow: Flow;
  step: Step | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onDrillSubflow: (flowId: string) => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function StepDetailPanel({
  flow,
  step,
  onClose,
  onPrev,
  onNext,
  onDrillSubflow,
  hasPrev,
  hasNext,
}: StepDetailPanelProps) {
  useEffect(() => {
    if (!step) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && hasNext) onNext();
      else if (e.key === "ArrowLeft" && hasPrev) onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, onPrev, onNext, hasPrev, hasNext]);

  return (
    <AnimatePresence>
      {step && (
        <>
          <motion.aside
            key={step.id}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 w-full h-[60vh]",
              "bg-bg-panel shadow-2xl border-t border-ink-subtle/20",
              "rounded-t-2xl flex flex-col",
            )}
            role="dialog"
            aria-label={`Chi tiết bước ${step.title}`}
          >
            <header className="flex items-start gap-3 px-5 py-2.5 border-b border-ink-subtle/20">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="brand">{step.order}</Badge>
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-md",
                      kindStyles[step.kind].label,
                    )}
                  >
                    {flow.name}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-ink-strong leading-tight">
                  {step.title}
                </h2>
                <p className="text-sm text-ink-muted mt-1">{step.department}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </Button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 max-w-[1600px] mx-auto">
                <Section title="Mô tả" className="xl:col-span-4">
                  <p>{step.subtitle}</p>
                  {step.detail && (
                    <p className="mt-2 text-ink-muted whitespace-pre-line">
                      {step.detail}
                    </p>
                  )}
                </Section>

                {step.subflows && step.subflows.length > 0 && (
                  <Section title="Nhánh con">
                    <div className="flex flex-col gap-2">
                      {step.subflows.map((s) => (
                        <button
                          key={s.flowId}
                          onClick={() => onDrillSubflow(s.flowId)}
                          className={cn(
                            "group inline-flex items-center justify-between",
                            "px-3 py-2.5 rounded-lg border border-brand/30 bg-brand-soft/50",
                            "hover:border-brand hover:bg-brand-soft transition-colors text-left",
                          )}
                        >
                          <span className="flex items-center gap-2 text-sm font-medium text-brand-deep">
                            <GitBranch className="w-4 h-4" />
                            {s.label}
                          </span>
                          <ChevronRight className="w-4 h-4 text-brand group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </Section>
                )}

                <Section title="Công cụ / hệ thống">
                  <ChipList items={step.tools} />
                </Section>

                <Section title="Dữ liệu đầu vào">
                  <BulletList items={step.dataIn} />
                </Section>

                <Section title="Kiểm soát">
                  <BulletList items={step.controls} />
                </Section>

                <Section title="Rủi ro / cảnh báo">
                  <BulletList items={step.risks} />
                </Section>

                {step.accounting && (
                  <Section title="Kế toán" className="xl:col-span-2">
                    <p className="whitespace-pre-line">{step.accounting}</p>
                  </Section>
                )}

                {step.accountingDocs && step.accountingDocs.length > 0 && (
                  <Section title="Chứng từ kế toán" className="xl:col-span-2">
                    <BulletList items={step.accountingDocs} />
                  </Section>
                )}
              </div>
            </div>

            <footer className="flex items-center justify-between gap-2 px-5 py-3 border-t border-ink-subtle/20 bg-bg-elevated/40">
              <Button
                variant="ghost"
                size="sm"
                onClick={onPrev}
                disabled={!hasPrev}
                aria-label="Bước trước"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Trước</span>
              </Button>
              <span className="text-xs text-ink-subtle">Bước {step.order}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onNext}
                disabled={!hasNext}
                aria-label="Bước sau"
              >
                <span>Sau</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
