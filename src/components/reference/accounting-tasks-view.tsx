import { CalendarClock, Info } from "lucide-react";
import { accountingTasks } from "@/data/reference";
import { cn } from "@/lib/utils";

const FREQUENCY_ORDER = [
  "Hàng ngày",
  "Hàng tuần",
  "Hàng tháng",
  "Hàng quý",
  "Hàng năm",
  "Định kỳ",
  "Khi phát sinh",
  "Khi nghi ngờ",
];

const frequencyStyles: Record<string, string> = {
  "Hàng ngày": "bg-process-fill text-process-ink border-process-stroke/40",
  "Hàng tuần": "bg-intake-fill text-intake-ink border-intake-stroke/40",
  "Hàng tháng": "bg-gold-soft text-final-ink border-final-stroke/40",
  "Hàng quý": "bg-gold-soft text-final-ink border-final-stroke/40",
  "Hàng năm": "bg-brand-soft text-brand-deep border-brand/30",
  "Định kỳ": "bg-bg-elevated text-ink-strong border-ink-subtle/40",
  "Khi phát sinh": "bg-warn-fill text-warn-ink border-warn-stroke/40",
  "Khi nghi ngờ": "bg-warn-fill text-warn-ink border-warn-stroke/40",
};

/** Tổng hợp việc kế toán định kỳ theo tần suất (sheet "Kế toán - Tổng hợp" v3) */
export function AccountingTasksView() {
  const groups = FREQUENCY_ORDER.map((freq) => ({
    freq,
    tasks: accountingTasks.filter((t) => t.frequency === freq),
  })).filter((g) => g.tasks.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2.5 rounded-xl border border-ink-subtle/30 bg-bg-elevated/70 px-4 py-3 text-[13px] text-ink-muted leading-relaxed">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-ink-subtle" aria-hidden />
        <p>
          Đây KHÔNG phải quy trình riêng — các việc kế toán realtime đã nằm
          trong mục "Kế toán" của từng bước. Phần này tổng hợp các việc TUẦN /
          THÁNG / QUÝ / NĂM không gắn với một bước nghiệp vụ cụ thể.
        </p>
      </div>

      {groups.map(({ freq, tasks }) => (
        <section key={freq}>
          <div className="flex items-center gap-3 mb-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-semibold",
                frequencyStyles[freq],
              )}
            >
              <CalendarClock className="w-3.5 h-3.5" aria-hidden />
              {freq}
            </span>
            <div className="flex-1 h-px bg-ink-subtle/25" aria-hidden />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {tasks.map((t) => (
              <article
                key={t.task}
                className="rounded-xl border border-ink-subtle/30 bg-bg-panel p-4 shadow-sm flex flex-col"
              >
                <h3 className="font-semibold text-[15px] text-ink-strong leading-tight mb-2">
                  {t.task}
                </h3>
                <p className="text-[13px] text-ink-muted leading-relaxed mb-3">
                  {t.description}
                </p>
                <div className="mt-auto text-xs font-semibold text-brand-deep bg-brand-soft rounded-md px-2.5 py-1.5">
                  ⏱ {t.deadline}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
