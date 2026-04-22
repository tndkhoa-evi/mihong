import { forwardRef } from "react";
import { processData } from "@/data/process";
import { getTopLevelFlows } from "@/data/validate";
import type { Flow } from "@/data/types";

function FlowSection({ flow }: { flow: Flow }) {
  return (
    <section className="break-inside-avoid mb-8">
      <h2 className="text-xl font-semibold text-brand-deep border-b-2 border-brand/30 pb-1 mb-3">
        {flow.name}
      </h2>
      {flow.shortDescription && (
        <p className="text-sm text-ink-muted mb-3">{flow.shortDescription}</p>
      )}
      <ol className="space-y-3 list-none">
        {flow.steps.map((step) => (
          <li
            key={step.id}
            className="border border-ink-subtle/30 rounded-lg p-3 break-inside-avoid"
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-xs font-semibold text-brand">
                {step.order}
              </span>
              <h3 className="text-sm font-semibold text-ink-strong">
                {step.title}
              </h3>
              <span className="ml-auto text-xs text-ink-muted">
                {step.department}
              </span>
            </div>
            <p className="text-xs text-ink-muted mb-2">{step.subtitle}</p>
            {step.detail && (
              <p className="text-xs text-ink-strong whitespace-pre-line mb-2">
                {step.detail}
              </p>
            )}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {step.tools.length > 0 && (
                <div>
                  <strong className="text-ink-subtle uppercase text-[10px]">
                    Công cụ:
                  </strong>{" "}
                  {step.tools.join(", ")}
                </div>
              )}
              {step.dataIn.length > 0 && (
                <div>
                  <strong className="text-ink-subtle uppercase text-[10px]">
                    Đầu vào:
                  </strong>{" "}
                  {step.dataIn.join(", ")}
                </div>
              )}
              {step.controls.length > 0 && (
                <div>
                  <strong className="text-ink-subtle uppercase text-[10px]">
                    Kiểm soát:
                  </strong>{" "}
                  {step.controls.join(", ")}
                </div>
              )}
              {step.risks.length > 0 && (
                <div>
                  <strong className="text-ink-subtle uppercase text-[10px]">
                    Rủi ro:
                  </strong>{" "}
                  {step.risks.join(", ")}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export const PrintLayout = forwardRef<HTMLDivElement>((_props, ref) => {
  const flows = [
    ...getTopLevelFlows(),
    ...processData.flows.filter((f) => f.parentId && f.parentId !== "overview"),
  ];

  return (
    <div ref={ref} className="hidden print:block p-8 text-ink-strong bg-white">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-brand">
          {processData.meta.title}
        </h1>
        <p className="text-sm text-ink-muted">{processData.meta.subtitle}</p>
      </header>
      {flows.map((f) => (
        <FlowSection key={f.id} flow={f} />
      ))}
    </div>
  );
});

PrintLayout.displayName = "PrintLayout";
