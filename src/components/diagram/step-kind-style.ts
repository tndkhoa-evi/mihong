import type { StepKind } from "@/data/types";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Settings2,
  type LucideIcon,
} from "lucide-react";

export interface KindStyle {
  card: string;
  border: string;
  title: string;
  icon: LucideIcon;
  iconColor: string;
  label: string;
}

export const kindStyles: Record<StepKind, KindStyle> = {
  intake: {
    card: "bg-intake-fill",
    border: "border-intake-stroke/40",
    title: "text-intake-ink",
    icon: FileText,
    iconColor: "text-intake-stroke",
    label: "Tiếp nhận / giao dịch",
  },
  process: {
    card: "bg-process-fill",
    border: "border-process-stroke/40",
    title: "text-process-ink",
    icon: Settings2,
    iconColor: "text-process-stroke",
    label: "Xử lý nội bộ",
  },
  final: {
    card: "bg-final-fill",
    border: "border-final-stroke/50",
    title: "text-final-ink",
    icon: CheckCircle2,
    iconColor: "text-final-stroke",
    label: "Trạng thái cuối",
  },
  warn: {
    card: "bg-warn-fill",
    border: "border-warn-stroke/50",
    title: "text-warn-ink",
    icon: AlertTriangle,
    iconColor: "text-warn-stroke",
    label: "Cảnh báo / nhạy cảm",
  },
};
