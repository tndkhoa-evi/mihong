import { AlertTriangle, ShieldAlert, Scale } from "lucide-react";
import { alertRules, legalDocs } from "@/data/reference";
import { cn } from "@/lib/utils";

/** 21 rule cảnh báo tự động + văn bản pháp lý tham chiếu (sheet "Cảnh báo & KS" v3) */
export function AlertRulesView() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {alertRules.map((rule) => (
          <article
            key={rule.group + rule.trigger}
            className={cn(
              "rounded-xl border-2 p-4 bg-bg-panel shadow-sm flex flex-col",
              rule.severity === "high"
                ? "border-warn-stroke/40"
                : "border-ink-subtle/30",
            )}
          >
            <div className="flex items-start gap-2 mb-2">
              {rule.severity === "high" ? (
                <ShieldAlert
                  className="w-4 h-4 text-warn-stroke shrink-0 mt-0.5"
                  aria-hidden
                />
              ) : (
                <AlertTriangle
                  className="w-4 h-4 text-final-stroke shrink-0 mt-0.5"
                  aria-hidden
                />
              )}
              <h3 className="font-semibold text-[15px] leading-tight text-ink-strong">
                {rule.group}
              </h3>
            </div>
            <div
              className={cn(
                "inline-block self-start text-xs font-semibold px-2 py-1 rounded-md mb-2",
                rule.severity === "high"
                  ? "bg-warn-fill text-warn-ink"
                  : "bg-final-fill text-final-ink",
              )}
            >
              Trigger: {rule.trigger}
            </div>
            <p className="text-[13px] text-ink-muted leading-relaxed mb-3">
              {rule.description}
            </p>
            <ul className="mt-auto space-y-1">
              {rule.actions.map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-2 text-[13px] text-ink-strong"
                >
                  <span
                    className="mt-[7px] w-1 h-1 rounded-full bg-brand shrink-0"
                    aria-hidden
                  />
                  {a}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border-2 border-brand/25 bg-brand-soft/70 p-6">
        <h2 className="flex items-center gap-2 text-h3 text-brand-deep mb-4">
          <Scale className="w-4 h-4" aria-hidden />
          Văn bản pháp lý tham chiếu
        </h2>
        <ul className="space-y-2.5">
          {legalDocs.map((doc) => (
            <li key={doc.name} className="text-sm text-ink-strong">
              <div className="flex items-start gap-2.5">
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand shrink-0"
                  aria-hidden
                />
                <span className="leading-relaxed font-medium">{doc.name}</span>
              </div>
              {doc.children && (
                <ul className="mt-1.5 ml-7 space-y-1">
                  {doc.children.map((c) => (
                    <li
                      key={c}
                      className="text-[13px] text-ink-muted leading-relaxed"
                    >
                      ↳ {c}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
