import type { Flow } from "@/data/types";
import { LaneCard } from "./lane-card";
import { SubLaneCard } from "./sub-lane-card";
import { getFlow } from "@/data/validate";

interface OverviewDiagramProps {
  flows: Flow[];
  onLaneClick: (flowId: string) => void;
}

export function OverviewDiagram({ flows, onLaneClick }: OverviewDiagramProps) {
  const left = flows.find((f) => f.lane === "left");
  const right = flows.find((f) => f.lane === "right");
  const middle = flows.find((f) => f.lane === "middle");
  const banHang = flows.find((f) => f.id === "ban-hang");

  const leftDiamond = left?.steps.find((s) => s.shape === "diamond");
  const leftSubflows = leftDiamond?.subflows
    ?.map((s) => getFlow(s.flowId))
    .filter((f): f is Flow => !!f);

  return (
    <div className="relative w-full max-w-6xl mx-auto px-6 py-8">
      <div className="grid grid-cols-2 gap-10 items-stretch">
        {/* LEFT column: F2B + short arrow + sub-branches */}
        <div className="flex flex-col items-end">
          {left && (
            <LaneCard
              flow={left}
              accent="intake"
              stageLabel="GĐ 1 · Thu mua"
              onClick={() => onLaneClick(left.id)}
            />
          )}

          {leftSubflows && leftSubflows.length > 0 && (
            <div className="flex flex-col items-end w-[380px]">
              <BranchArrow />
              <div className="text-[11px] font-semibold text-brand uppercase tracking-wide mb-2">
                GĐ 2 · Xử lý — rẽ nhánh sau bước {leftDiamond?.order}
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                {leftSubflows.map((sub) => (
                  <SubLaneCard
                    key={sub.id}
                    flow={sub}
                    onClick={() => onLaneClick(sub.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT column: B2B + down arrow to align with left column bottom */}
        {right && (
          <div className="flex flex-col items-start">
            <LaneCard
              flow={right}
              accent="intake"
              stageLabel="GĐ 1 · Thu mua"
              onClick={() => onLaneClick(right.id)}
            />
            <StraightDownArrow />
          </div>
        )}
      </div>

      {/* Convergence: from sub-branches (left) & B2B (right) down to Hội tụ */}
      <div className="relative h-24 flex items-center justify-center">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1104 96"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <marker
              id="ov-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path
                d="M1 1L9 5L1 9"
                fill="none"
                stroke="#8b1a1a"
                strokeWidth="1.5"
              />
            </marker>
          </defs>
          {/* Sơ chế (x=244) → Hội tụ */}
          <polyline
            points="244,0 244,48 552,48 552,90"
            fill="none"
            stroke="#8b1a1a"
            strokeOpacity="0.55"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            markerEnd="url(#ov-arrow)"
          />
          {/* Nung chảy (x=440) → Hội tụ */}
          <polyline
            points="440,0 440,48 552,48 552,90"
            fill="none"
            stroke="#8b1a1a"
            strokeOpacity="0.55"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            markerEnd="url(#ov-arrow)"
          />
          {/* Right: B2B (x=762) → Hội tụ (x=552) */}
          <polyline
            points="762,0 762,48 552,48 552,90"
            fill="none"
            stroke="#8b1a1a"
            strokeOpacity="0.55"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            markerEnd="url(#ov-arrow)"
          />
        </svg>
      </div>

      <div className="flex justify-center">
        {middle && (
          <LaneCard
            flow={middle}
            accent="gold"
            stageLabel="GĐ 3 · Lên kệ"
            onClick={() => onLaneClick(middle.id)}
          />
        )}
      </div>

      {banHang && (
        <>
          <div className="flex justify-center">
            <ConvergeDownArrow />
          </div>
          <div className="flex justify-center">
            <LaneCard
              flow={banHang}
              accent="gold"
              stageLabel="GĐ 4 · Bán hàng"
              onClick={() => onLaneClick(banHang.id)}
            />
          </div>
        </>
      )}
    </div>
  );
}

/** Vertical arrow between Hội tụ → Bán hàng */
function ConvergeDownArrow() {
  return (
    <svg
      width="24"
      height="48"
      viewBox="0 0 24 48"
      aria-hidden
      className="my-1"
    >
      <defs>
        <marker
          id="ov-down-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M1 1L9 5L1 9"
            fill="none"
            stroke="#8b1a1a"
            strokeWidth="1.5"
          />
        </marker>
      </defs>
      <line
        x1="12"
        y1="0"
        x2="12"
        y2="44"
        stroke="#8b1a1a"
        strokeOpacity="0.55"
        strokeWidth="2"
        markerEnd="url(#ov-down-arrow)"
      />
    </svg>
  );
}

/** Vertical line extending B2B card down to match left column height */
function StraightDownArrow() {
  return (
    <div className="w-[380px] flex-1 min-h-[180px] flex flex-col items-center">
      <div className="w-0.5 flex-1 bg-brand/55" />
    </div>
  );
}

/** Vertical arrow connecting F2B card bottom → sub-branch row */
function BranchArrow() {
  return (
    <svg
      width="380"
      height="32"
      viewBox="0 0 380 32"
      className="my-1"
      aria-hidden
    >
      <defs>
        <marker
          id="branch-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M1 1L9 5L1 9"
            fill="none"
            stroke="#8b1a1a"
            strokeWidth="1.5"
          />
        </marker>
      </defs>
      {/* Fork: from F2B center down, split to two sub-card centers */}
      <path
        d="M190 0 V 12 H 95 V 28"
        fill="none"
        stroke="#8b1a1a"
        strokeOpacity="0.55"
        strokeWidth="2"
        markerEnd="url(#branch-arrow)"
      />
      <path
        d="M190 12 H 285 V 28"
        fill="none"
        stroke="#8b1a1a"
        strokeOpacity="0.55"
        strokeWidth="2"
        markerEnd="url(#branch-arrow)"
      />
    </svg>
  );
}
