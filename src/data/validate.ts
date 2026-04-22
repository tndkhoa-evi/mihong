import { processData } from "./process";
import type { Flow, Step } from "./types";

export function getFlow(id: string): Flow | undefined {
  return processData.flows.find((f) => f.id === id);
}

export function getStep(flowId: string, stepId: string): Step | undefined {
  return getFlow(flowId)?.steps.find((s) => s.id === stepId);
}

export function getTopLevelFlows(): Flow[] {
  return processData.flows.filter((f) => f.parentId === "overview");
}

export function getStepIndex(flowId: string, stepId: string): number {
  const flow = getFlow(flowId);
  if (!flow) return -1;
  return flow.steps.findIndex((s) => s.id === stepId);
}

export function assertDataIntegrity(): void {
  const seen = new Set<string>();
  const flowIds = new Set(processData.flows.map((f) => f.id));

  for (const flow of processData.flows) {
    for (const step of flow.steps) {
      if (seen.has(step.id)) {
        console.error(`[data] duplicate step ID: ${step.id}`);
      }
      seen.add(step.id);

      if (step.subflows) {
        for (const sub of step.subflows) {
          if (!flowIds.has(sub.flowId)) {
            console.error(
              `[data] step ${step.id} references missing flow: ${sub.flowId}`,
            );
          }
        }
      }
    }
  }
}
