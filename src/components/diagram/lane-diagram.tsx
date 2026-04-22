import { Fragment } from "react";
import { motion } from "framer-motion";
import type { Flow, Step } from "@/data/types";
import { StepNode } from "./step-node";
import { DiamondNode } from "./diamond-node";
import { FlowConnector } from "./flow-connector";
import { getFlow } from "@/data/validate";

interface LaneDiagramProps {
  flow: Flow;
  activeStepId?: string | null;
  onStepClick: (step: Step) => void;
}

function HorizontalRow({
  steps,
  activeStepId,
  onStepClick,
  label,
}: {
  steps: Step[];
  activeStepId?: string | null;
  onStepClick: (s: Step) => void;
  label?: string;
}) {
  return (
    <div className="flex flex-col items-start">
      {label && (
        <div className="text-xs font-semibold text-brand mb-2 px-1 uppercase tracking-wide">
          {label}
        </div>
      )}
      <div className="flex flex-row items-center">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          const active = step.id === activeStepId;
          const node =
            step.shape === "diamond" ? (
              <DiamondNode
                step={step}
                active={active}
                onClick={() => onStepClick(step)}
              />
            ) : (
              <StepNode
                step={step}
                active={active}
                onClick={() => onStepClick(step)}
              />
            );
          const nextIsDiamond = !isLast && steps[idx + 1]?.shape === "diamond";
          const thisIsDiamond = step.shape === "diamond";
          const variant =
            thisIsDiamond || nextIsDiamond ? "split-right" : "horizontal";
          const length = thisIsDiamond || nextIsDiamond ? 28 : 22;
          return (
            <Fragment key={step.id}>
              <div className="flex-shrink-0">{node}</div>
              {!isLast && <FlowConnector variant={variant} length={length} />}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function LaneDiagram({
  flow,
  activeStepId,
  onStepClick,
}: LaneDiagramProps) {
  const diamondStep = flow.steps.find((s) => s.shape === "diamond");
  const subflows = diamondStep?.subflows
    ?.map((s) => getFlow(s.flowId))
    .filter((f): f is Flow => !!f);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex flex-col items-center px-4 w-full gap-8 ${activeStepId ? "py-3" : "py-8"}`}
    >
      <HorizontalRow
        steps={flow.steps}
        activeStepId={activeStepId}
        onStepClick={onStepClick}
      />

      {!activeStepId && subflows && subflows.length > 0 && (
        <div className="w-full flex flex-col items-center gap-4">
          <div className="text-xs font-medium text-ink-muted uppercase tracking-wide">
            ↓ Rẽ nhánh sau bước {diamondStep?.order}
          </div>
          <div className="flex flex-col gap-6">
            {subflows.map((sub) => (
              <HorizontalRow
                key={sub.id}
                steps={sub.steps}
                activeStepId={activeStepId}
                onStepClick={onStepClick}
                label={sub.name}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
