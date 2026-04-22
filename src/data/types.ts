export type StepKind = "intake" | "process" | "final" | "warn";
export type NodeShape = "rect" | "diamond";

export interface Subflow {
  flowId: string;
  label: string;
}

export interface Step {
  id: string;
  order: string;
  title: string;
  department: string;
  subtitle: string;
  detail: string;
  tools: string[];
  dataIn: string[];
  controls: string[];
  risks: string[];
  kind: StepKind;
  shape: NodeShape;
  subflows?: Subflow[];
  accounting?: string;
  accountingDocs?: string[];
}

export type LanePosition = "left" | "right" | "middle";

export interface Flow {
  id: string;
  name: string;
  shortDescription: string;
  parentId?: string;
  lane?: LanePosition | null;
  steps: Step[];
}

export interface ProcessMeta {
  title: string;
  subtitle: string;
}

export interface ProcessData {
  flows: Flow[];
  meta: ProcessMeta;
}
