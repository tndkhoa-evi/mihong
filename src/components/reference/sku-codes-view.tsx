import { QrCode, GitBranch } from "lucide-react";
import { skuCodes, lineageRules } from "@/data/reference";

/** Bảng quy tắc mã SKU / Batch-ID / Session ID + nguyên tắc lineage (sheet "Ký hiệu SKU" v3) */
export function SkuCodesView() {
  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-2xl border border-ink-subtle/25 bg-bg-panel shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand text-white">
              <th className="px-4 py-3 text-left font-semibold w-[200px]">
                Loại mã
              </th>
              <th className="px-4 py-3 text-left font-semibold w-[240px]">
                Định dạng
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                Ý nghĩa từng phần
              </th>
              <th className="px-4 py-3 text-left font-semibold w-[280px]">
                Ví dụ + ghi chú
              </th>
            </tr>
          </thead>
          <tbody>
            {skuCodes.map((c, i) => (
              <tr
                key={c.name}
                className={i % 2 ? "bg-bg-elevated/60" : "bg-bg-panel"}
              >
                <td className="px-4 py-3 font-semibold text-ink-strong align-top">
                  <span className="inline-flex items-center gap-1.5">
                    <QrCode
                      className="w-3.5 h-3.5 text-brand shrink-0"
                      aria-hidden
                    />
                    {c.name}
                  </span>
                </td>
                <td className="px-4 py-3 align-top">
                  <code className="px-2 py-1 rounded-md bg-brand-soft text-brand-deep font-semibold text-[13px] whitespace-nowrap">
                    {c.format}
                  </code>
                </td>
                <td className="px-4 py-3 text-ink-muted align-top leading-relaxed">
                  {c.meaning}
                </td>
                <td className="px-4 py-3 align-top">
                  {c.example.split("\n").map((line, j) => (
                    <div
                      key={j}
                      className={
                        j === 0
                          ? "font-mono text-[13px] text-ink-strong"
                          : "text-xs text-ink-muted mt-1"
                      }
                    >
                      {line}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="rounded-2xl border-2 border-gold/40 bg-gold-soft/60 p-6">
        <h2 className="flex items-center gap-2 text-h3 text-final-ink mb-4">
          <GitBranch className="w-4 h-4" aria-hidden />
          Nguyên tắc lineage (truy xuất ngược)
        </h2>
        <ul className="space-y-2.5">
          {lineageRules.map((r) => (
            <li
              key={r}
              className="flex items-start gap-2.5 text-sm text-ink-strong"
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full bg-final-stroke shrink-0"
                aria-hidden
              />
              <span className="leading-relaxed">{r}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
