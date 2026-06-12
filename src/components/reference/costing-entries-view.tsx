import { Info } from "lucide-react";
import { costingEntries } from "@/data/reference";

/** Sơ đồ bút toán tính giá thành theo công đoạn (sheet "Kế toán - Tính giá thành" v4) */
export function CostingEntriesView() {
  // Gom dòng theo công đoạn để render rowspan cho cột "Công đoạn"
  const groups = costingEntries.reduce<
    { stage: string; rows: typeof costingEntries }[]
  >((acc, e) => {
    const last = acc[acc.length - 1];
    if (last && last.stage === e.stage) last.rows.push(e);
    else acc.push({ stage: e.stage, rows: [e] });
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2.5 rounded-xl border border-ink-subtle/30 bg-bg-elevated/70 px-4 py-3 text-[13px] text-ink-muted leading-relaxed">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-ink-subtle" aria-hidden />
        <p>
          Sơ đồ bút toán tập hợp chi phí và tính giá thành theo từng công đoạn:
          thu mua → phân loại → sơ chế / nung chảy → tập hợp giá thành (154 →
          155). Hàng nhập sỉ B2B đi thẳng vào TK 156.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink-subtle/30 shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="bg-brand text-white text-left">
              <th className="px-4 py-3 font-semibold">Công đoạn</th>
              <th className="px-4 py-3 font-semibold">Hạch toán</th>
              <th className="px-4 py-3 font-semibold">Mã</th>
              <th className="px-4 py-3 font-semibold">Kho</th>
              <th className="px-4 py-3 font-semibold">Khoản mục chi phí</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g, gi) =>
              g.rows.map((row, ri) => (
                <tr
                  key={`${g.stage}-${ri}`}
                  className={gi % 2 === 0 ? "bg-bg-panel" : "bg-bg-elevated/60"}
                >
                  {ri === 0 && (
                    <td
                      rowSpan={g.rows.length}
                      className="px-4 py-3 align-top font-semibold text-ink-strong border-t border-ink-subtle/20"
                    >
                      {g.stage}
                    </td>
                  )}
                  <td className="px-4 py-3 border-t border-ink-subtle/20">
                    <code className="rounded bg-brand-soft px-2 py-0.5 text-[13px] font-semibold text-brand-deep whitespace-nowrap">
                      {row.entry}
                    </code>
                  </td>
                  <td className="px-4 py-3 border-t border-ink-subtle/20 text-ink-muted">
                    {row.code || "—"}
                  </td>
                  <td className="px-4 py-3 border-t border-ink-subtle/20 text-ink-muted">
                    {row.warehouse || "—"}
                  </td>
                  <td className="px-4 py-3 border-t border-ink-subtle/20 text-ink-strong">
                    {row.costItem || "—"}
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
