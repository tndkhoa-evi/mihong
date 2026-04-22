# Mi Hồng — Interactive Process Flow Presentation App

> **Brief dành cho Claude Code.** Build một web app tương tác để trình chiếu quy trình vận hành của tiệm vàng Mi Hồng cho chính chủ tiệm (người sẽ là khán giả). Tài liệu này chứa toàn bộ yêu cầu sản phẩm, kiến trúc, design system, và dữ liệu process cần plug vào codebase. Tiếng Việt cho nội dung hiển thị; English cho thuật ngữ kỹ thuật.

---

## 1. Goal

Xây dựng một Single-Page Application (SPA) trình bày quy trình thu mua → xử lý → lên kệ của Mi Hồng, với khả năng:

- Hiển thị **lưu đồ tổng quát** ở cấp cao nhất
- **Drill down** vào từng luồng con khi click
- **Hiện panel ghi chú** chi tiết khi click vào một bước cụ thể
- Thao tác mượt, hình ảnh chuyên nghiệp, phù hợp để trình chiếu TV/máy chiếu cho khách hàng

App này KHÔNG phải prototype — là sản phẩm demo final để present, nên polish level phải cao (typography, spacing, transitions, micro-interactions).

---

## 2. Audience & Scenario

- **Người trình bày:** consultant / owner của Mi Hồng
- **Khán giả:** chủ tiệm Mi Hồng + team vận hành (không phải developer — ngôn ngữ phải business, không technical)
- **Ngữ cảnh sử dụng:**
  - Mở trên laptop, phóng lên màn hình lớn (TV 55" hoặc máy chiếu 1920×1080)
  - Presenter click navigate trực tiếp, đôi khi đưa laptop cho chủ tiệm tự explore
  - Có thể dùng chế độ full-screen để tập trung

---

## 3. Core UX Principles

1. **Presentation-first.** Mọi micro-interaction phải smooth, không giật. Transition giữa các view là phần trải nghiệm chính — đừng cut cứng.
2. **Click-to-drill.** Mỗi node trên lưu đồ đều clickable. Chỉ có 2 hành vi khi click:
   - Node có **sub-diagram** (ví dụ "Phân loại" rẽ nhánh) → drill vào sub-diagram
   - Node là **leaf step** → mở side-panel hiện chi tiết (không che lưu đồ)
3. **Không bao giờ mất context.** Luôn hiện breadcrumb, nút back, và bối cảnh hiện tại ở toolbar.
4. **Professional, không flashy.** Không gradient cầu vồng, không emoji, không animation phô trương. Typography sạch + spacing đủ + màu doanh nghiệp.
5. **Mobile-secondary.** Target chính 1920×1080. Responsive xuống 1280 OK; dưới đó không phải priority.

---

## 4. Drill-down Architecture

3 cấp điều hướng:

```
Level 0 — OVERVIEW
 ├─ Click "F2B Mua từ cá nhân"  ──►  Level 1: F2B Common (bước 1→6b)
 │                                    └─ Click "Phân loại (6b)" ──► Level 1: F2B Sơ chế (7a.1→7a.2)
 │                                                              └─► Level 1: F2B Nung chảy (7b→11)
 ├─ Click "B2B Nhập sỉ"         ──►  Level 1: B2B (bước 1→7)
 └─ Click "Hội tụ — Lên kệ"     ──►  Level 1: Hội tụ (H.1→H.3)

AT ANY LEVEL: click vào một step node ──► Level 2: Side panel chi tiết
```

Step "Phân loại (6b)" là node duy nhất có **branch sub-diagrams** — nó hiện như hình thoi (diamond). Khi click:

- Side panel chi tiết vẫn mở như step thường
- Ở cuối panel có 2 primary button: **"Xem nhánh Sơ chế →"** và **"Xem nhánh Nung chảy →"** để drill sâu hơn

---

## 5. Feature List

### Must-have (P0)

- [ ] Overview diagram (3 lanes + convergence)
- [ ] 5 sub-flow diagrams (F2B-common, F2B-soche, F2B-nung, B2B, Hoi-tu)
- [ ] Step detail side-panel slide-in từ phải, chiếm ~40% width
- [ ] Breadcrumb navigation (Trang chủ › F2B Mua cá nhân › Bước 3)
- [ ] Back button + keyboard Esc để back
- [ ] Full-screen toggle (F11 behavior trong app)
- [ ] Color legend (giao dịch / xử lý / cuối / cảnh báo)
- [ ] Smooth transitions giữa các level (framer-motion layoutId)

### Should-have (P1)

- [ ] Presentation mode: ẩn toolbar, diagram chiếm full viewport
- [ ] Zoom in/out + pan trên lưu đồ (pinch + scroll + nút)
- [ ] Keyboard navigation: ← → đi giữa các step, Esc back, Space toggle panel
- [ ] Hover preview: hover vào step → tooltip ngắn
- [ ] Export PDF cho handout (print-friendly CSS)

### Nice-to-have (P2)

- [ ] Guided tour auto-advance qua các flow với delay
- [ ] Search: type tên bước → jump tới
- [ ] Link share: URL phản ánh vị trí hiện tại (deep-link)
- [ ] Dark mode cho trình chiếu phòng tối

Ưu tiên P0 đầu tiên. Làm xong P0 + polish rồi mới động P1.

---

## 6. Screens & Components

### 6.1 `<OverviewPage />` (Level 0)

Layout:

- Header: logo "Mi Hồng" + title "Quy trình thu mua → xử lý → lên kệ"
- Main: diagram SVG chiếm ~80% viewport
- Footer: legend + info pill ("8 bước F2B · 7 bước B2B · 3 bước hội tụ")

Diagram layout (3 lanes dọc, converge xuống):

```
  [F2B Mua từ cá nhân]        [B2B Nhập sỉ]
   │ 6 bước                    │ 7 bước
   │                           │
   ▼                           ▼
  (Sơ chế hoặc Nung chảy)     (Nhập kho)
   │                           │
   └──────────┬────────────────┘
              ▼
         [Hội tụ — Lên kệ]
              3 bước
              ▼
         ● Sẵn sàng bán
```

Mỗi lane là một card chữ nhật lớn, hover scale 1.02, click drill down. Không show từng bước con ở cấp này — chỉ name lane + số bước + 1-2 dòng mô tả.

### 6.2 `<LaneDetailPage flowId={...} />` (Level 1)

Layout:

- Top bar: breadcrumb + back + presentation mode toggle + zoom controls
- Main: diagram của lane đó, vertical flow
- Side panel area (initially closed)

Diagram rendering tuỳ flow:

- **F2B Common**: linear 5 bước xám + 1 hình thoi (6a) + 1 hình thoi split (6b)
- **F2B Sơ chế**: 2 bước linear
- **F2B Nung chảy**: 5 bước linear
- **B2B**: 7 bước linear
- **Hội tụ**: 3 bước linear, bước cuối có màu amber

Mỗi step là một card có:

- Số bước (badge trái, ví dụ "3" hoặc "6a")
- Tên bước (bold)
- Bộ phận phụ trách (muted text, ví dụ "Thu ngân")
- 1 dòng subtitle hành động chính
- Icon nhỏ góc phải chỉ loại (📋 giao dịch / ⚙ xử lý / ✓ cuối / ⚠ cảnh báo — nhưng KHÔNG DÙNG EMOJI thật, dùng lucide-react icons)

Click vào step card → side panel slide in.

### 6.3 `<StepDetailPanel step={...} />` (Level 2)

Slide in từ phải, width 560px (~40% of 1440 viewport). Màu nền trắng, shadow lớn. Không che hoàn toàn diagram — presenter vẫn thấy vị trí bước đó trên lưu đồ phía trái.

Nội dung panel (scroll được nếu dài):

1. **Header**: Badge số bước + tên bước (h1) + bộ phận phụ trách
2. **Section "Hành động chi tiết"**: paragraph dài mô tả bước
3. **Section "Công cụ / thiết bị"**: bullet list
4. **Section "Dữ liệu vào hệ thống"**: bullet list
5. **Section "Kiểm soát & quy định"**: bullet list với icon shield
6. **Section "Rủi ro & ghi chú"**: bullet list với icon alert-triangle
7. **Footer actions**:
   - Nếu có sub-flows: render 2-3 primary buttons để drill sâu (vd bước 6b)
   - Nếu là step thường: nút "← Bước trước" và "Bước tiếp theo →" để chạy qua step trong cùng lane

Đóng panel: click nút X, click outside (trên diagram), hoặc Esc.

### 6.4 `<PresentationToolbar />`

Sticky top, minimal. Gồm:

- Logo + breadcrumb (flex-1)
- Nút zoom in/out
- Nút full-screen
- Nút "Trình chiếu" (presentation mode — ẩn toolbar)
- Nút "Quay lại" (back button)

Trong presentation mode: toolbar tự ẩn, dùng shortcut phím để thao tác, hover cạnh trên màn hình để hiện lại toolbar trong 2s.

### 6.5 `<Legend />`

Floating bottom-left hoặc inline trong overview. Gồm 4 ô màu với label:

- Xám: Tiếp nhận / giao dịch
- Teal: Xử lý nội bộ
- Vàng: Trạng thái cuối
- Đỏ: Cảnh báo / nhạy cảm

---

## 7. Design System

### Colors

```css
/* Backgrounds */
--bg-base: #fafaf9; /* page background */
--bg-panel: #ffffff; /* card, panel background */
--bg-elevated: #f5f5f4; /* hover state */

/* Ink */
--ink-strong: #1c1917; /* body text */
--ink-muted: #57534e; /* secondary text */
--ink-subtle: #a8a29e; /* captions */

/* Semantic step colors (fill / stroke / text) */
--intake-fill: #f5f5f4; /* giao dịch */
--intake-stroke: #78716c;
--intake-ink: #1c1917;

--process-fill: #ccfbf1; /* xử lý nội bộ */
--process-stroke: #0f766e;
--process-ink: #134e4a;

--final-fill: #fef3c7; /* trạng thái cuối */
--final-stroke: #b45309;
--final-ink: #78350f;

--warn-fill: #fee2e2; /* cảnh báo */
--warn-stroke: #b91c1c;
--warn-ink: #7f1d1d;

/* Brand accent (Mi Hồng màu chủ đạo — có thể đổi sau khi xem branding thực tế) */
--brand: #be123c; /* crimson/rose — gần với "hồng" */
--brand-soft: #fff1f2;
```

### Typography

- **Font**: `Inter` cho sans-serif chính (via Google Fonts). Fallback: -apple-system, BlinkMacSystemFont, Segoe UI, Arial
- **Heading scale**: 32 / 24 / 20 / 16 / 14
- **Body**: 14-15px, line-height 1.6
- **Font weights**: 400 body, 500 UI, 600 heading, 700 title

### Spacing

Dùng Tailwind scale. Diagram node padding nên thoáng: `p-6`. Khoảng cách giữa các node trong flow: `gap-10` (40px).

### Motion

- Standard transition: `ease-out` 200-300ms
- Drill-down transition: `ease-in-out` 400ms (framer-motion layoutId)
- Panel slide: `ease-out` 250ms
- Hover scale: `ease-out` 150ms, scale 1.02

### Elevation (shadows)

- Card default: `shadow-sm`
- Card hover: `shadow-md`
- Panel: `shadow-xl`
- Modal (nếu dùng): `shadow-2xl`

---

## 8. Tech Stack (Recommended)

- **Build**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS v3 (đừng v4 vì lỗi vặt)
- **Animations**: framer-motion (dùng layoutId cho shared element transitions)
- **Icons**: lucide-react
- **Routing**: react-router-dom v6 (cho deep-link) hoặc tanstack router
- **State**: React local state là đủ — KHÔNG cần redux/zustand cho scope này
- **Diagrams**: **Custom SVG với framer-motion** (không dùng React Flow vì muốn toàn quyền styling, và flow không complex)
- **PDF export**: `react-to-print` hoặc browser print CSS

Không cần backend. Dữ liệu hard-code trong `src/data/process.ts`.

---

## 9. Suggested File Structure

```
mi-hong-flow/
├─ index.html
├─ vite.config.ts
├─ tailwind.config.ts
├─ package.json
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ routes.tsx                    # route definitions
│  ├─ data/
│  │  ├─ process.ts                 # TOÀN BỘ DỮ LIỆU (xem Section 11)
│  │  └─ types.ts                   # TypeScript types (xem Section 10)
│  ├─ components/
│  │  ├─ diagram/
│  │  │  ├─ StepNode.tsx            # 1 ô bước (rect)
│  │  │  ├─ DiamondNode.tsx         # hình thoi cho decision steps
│  │  │  ├─ FlowConnector.tsx       # mũi tên nối
│  │  │  ├─ OverviewDiagram.tsx     # diagram level 0
│  │  │  └─ LaneDiagram.tsx         # diagram level 1
│  │  ├─ panel/
│  │  │  ├─ StepDetailPanel.tsx
│  │  │  └─ Section.tsx             # section trong panel
│  │  ├─ layout/
│  │  │  ├─ PresentationToolbar.tsx
│  │  │  ├─ Breadcrumb.tsx
│  │  │  └─ Legend.tsx
│  │  └─ ui/                        # primitives (Button, Badge, etc.)
│  ├─ pages/
│  │  ├─ OverviewPage.tsx
│  │  └─ LanePage.tsx
│  ├─ hooks/
│  │  ├─ useKeyboard.ts
│  │  └─ useFullscreen.ts
│  └─ lib/
│     └─ utils.ts                   # cn(), etc.
└─ public/
   └─ favicon.svg
```

---

## 10. TypeScript Types

```ts
// src/data/types.ts

export type StepKind = "intake" | "process" | "final" | "warn";
export type NodeShape = "rect" | "diamond";

export interface Step {
  /** Unique ID, ví dụ 'f2b-common-3' */
  id: string;
  /** Label hiển thị trên node, ví dụ '3' hoặc '6a' */
  order: string;
  /** Tên bước, ví dụ 'Cân + đo tuổi vàng' */
  title: string;
  /** Bộ phận phụ trách */
  department: string;
  /** Câu subtitle 1 dòng hiện trên card diagram */
  subtitle: string;
  /** Đoạn văn dài mô tả hành động — hiện trong panel */
  detail: string;
  /** Danh sách công cụ/thiết bị */
  tools: string[];
  /** Dữ liệu vào hệ thống */
  dataIn: string[];
  /** Kiểm soát / quy định */
  controls: string[];
  /** Rủi ro & ghi chú */
  risks: string[];
  /** Màu loại step */
  kind: StepKind;
  /** Hình dáng node trong diagram */
  shape: NodeShape;
  /** Có drill tiếp được không — nếu có thì liệt kê flow con */
  subflows?: Array<{
    flowId: string;
    label: string;
  }>;
}

export interface Flow {
  /** 'overview' | 'f2b-common' | 'f2b-soche' | 'f2b-nung' | 'b2b' | 'hoi-tu' */
  id: string;
  name: string;
  shortDescription: string;
  /** Flow cha (để back). 'overview' không có parent */
  parentId?: string;
  /** Số thứ tự entry trong overview */
  lane?: "left" | "right" | "middle" | null;
  steps: Step[];
}

export interface ProcessData {
  flows: Flow[];
  /** Mô tả luồng tổng thể hiện ở overview */
  meta: {
    title: string;
    subtitle: string;
  };
}
```

---

## 11. Process Data (`src/data/process.ts`)

Dưới đây là toàn bộ data cần copy vào file. KHÔNG tự ý paraphrase hoặc rút gọn — nội dung đã được khách duyệt.

```ts
// src/data/process.ts
import type { ProcessData } from "./types";

export const processData: ProcessData = {
  meta: {
    title: "Mi Hồng",
    subtitle: "Quy trình thu mua → xử lý → lên kệ",
  },
  flows: [
    // ============================================================
    // F2B — QUY TRÌNH CHUNG (bước 1 → 6b)
    // ============================================================
    {
      id: "f2b-common",
      name: "F2B — Mua từ cá nhân",
      shortDescription:
        "Khách cá nhân bán vàng cho Mi Hồng. Bước 1-6 chung cho cả hai nhánh sau phân loại.",
      parentId: "overview",
      lane: "left",
      steps: [
        {
          id: "f2b-common-1",
          order: "1",
          title: "Tiếp nhận khách",
          department: "Thu ngân / tư vấn",
          subtitle: "Phát phiếu chờ QR — Session ID auto sinh",
          detail:
            "Khách vào quầy, nhân viên phát phiếu chờ có mã QR. QR này chính là Session ID do hệ thống auto sinh. Mọi thao tác cân, đo, báo giá sau đó đều gắn vào Session ID này để tránh lẫn vàng giữa các khách khi quầy đông.",
          tools: ["Máy in nhiệt phiếu QR", "Tablet thu ngân"],
          dataIn: [
            "Session ID (YYMMDD-HHMM-####)",
            "Thời điểm tiếp nhận",
            "Nhân viên tiếp nhận",
          ],
          controls: [
            "Không yêu cầu KYC ở bước này",
            "Session tự hết hạn sau 30 phút nếu không hoạt động",
          ],
          risks: [
            "Nguy cơ: nhầm lẫn vàng giữa các khách nếu không gắn QR ngay",
            "Bắt buộc phát QR trước khi khách đặt vàng lên quầy",
          ],
          kind: "intake",
          shape: "rect",
        },
        {
          id: "f2b-common-2",
          order: "2",
          title: "KYC + thu thập thông tin ngân hàng",
          department: "Thu ngân",
          subtitle: "Quét CCCD NFC + selfie + số tài khoản",
          detail:
            "Khách xuất trình CCCD gắn chip → nhân viên quét NFC (hoặc QR mặt sau). Hệ thống tự đổ: họ tên, số CCCD, ngày cấp, nơi cấp, ngày sinh, địa chỉ — KHÔNG gõ tay. Chụp ảnh CCCD 2 mặt + selfie khách để face-match. THU THẬP SỐ TÀI KHOẢN NGÂN HÀNG của khách ngay tại bước này (sẽ dùng cho chuyển khoản ở bước 5). Xác minh tên chủ tài khoản KHỚP với họ tên CCCD (tránh chuyển nhầm người, tránh rủi ro pháp lý). Khách quen: profile đã lưu tài khoản → skip bước nhập, chỉ xác nhận lại.",
          tools: [
            "Đầu đọc NFC CCCD",
            "Webcam selfie",
            "Tablet KYC",
            "Tra cứu tên tài khoản qua NAPAS",
          ],
          dataIn: [
            "Thông tin CCCD đầy đủ",
            "Ảnh 2 mặt CCCD",
            "Ảnh selfie + face-match score",
            "Số tài khoản + ngân hàng",
            "Tên chủ tài khoản (verify khớp CCCD)",
          ],
          controls: [
            "Luật PCRT 2022: KYC bắt buộc trước mọi giao dịch",
            "Block khách <18 tuổi (auto tính từ CCCD)",
            "Tên TK lệch CCCD → cảnh báo, yêu cầu khách xác minh",
          ],
          risks: [
            "Nguy cơ: CCCD giả → bắt buộc quét chip thay vì chụp ảnh",
            "TK khác tên: rủi ro rửa tiền / tranh chấp → từ chối CK",
            "Người cao tuổi không CCCD chip: kèm giấy tờ phụ + chữ ký",
          ],
          kind: "intake",
          shape: "rect",
        },
        {
          id: "f2b-common-3",
          order: "3",
          title: "Cân + đo tuổi vàng",
          department: "Thu ngân",
          subtitle: "Cân điện tử nối PM + XRF",
          detail:
            "Thu ngân thực hiện luôn (không chuyển thủ kho ở bước này để tiết kiệm thời gian giao dịch). Đặt vàng lên cân điện tử đã hiệu chuẩn. Cân NỐI THẲNG vào PM — số cân TỰ NHẬP, không gõ tay. Đo tuổi: khoản nhỏ thử axit + kinh nghiệm, khoản lớn BẮT BUỘC dùng XRF. Lưu cả ảnh phổ + số liệu kim loại. Phát hiện rhodium / palladium / wolfram → cảnh báo ngay (dấu hiệu vàng độn / giả).",
          tools: ["Cân điện tử nối PM", "Máy XRF", "Camera bàn cân"],
          dataIn: [
            "Khối lượng (g, chỉ)",
            "Tuổi vàng %",
            "Phổ XRF (ảnh + data)",
            "Session ID tham chiếu",
            "Ảnh tại bàn cân",
            "ID thu ngân nhập",
          ],
          controls: [
            "Cân có tem kiểm định trong hạn",
            "Hiệu chuẩn định kỳ theo Bộ KHCN",
            "Ghi log mọi lần zero-calibrate",
            "Thủ kho sẽ đối chiếu lại ở bước 6a",
          ],
          risks: [
            "Điểm gian lận phổ biến: gõ tay cân → cộng trừ 0,1 chỉ/đơn. Bắt buộc cân nối PM",
            "Sai sót (không cố ý) của thu ngân sẽ được thủ kho bắt ở bước 6a và xử lý theo workflow riêng",
          ],
          kind: "intake",
          shape: "rect",
        },
        {
          id: "f2b-common-4",
          order: "4",
          title: "Định giá thu mua",
          department: "Hệ thống (auto) + thu ngân",
          subtitle: "API Mi Hồng + SJC đối chiếu · time-lock 3-5 phút",
          detail:
            "Hệ thống lấy giá từ 2 nguồn SONG SONG: (a) API giá nội bộ Mi Hồng — giá niêm yết mua vào của Mi Hồng, (b) API SJC — làm tham chiếu đối chiếu. Refresh 30 giây/lần. Tính giá thu theo công thức nội bộ: Giá tham chiếu Mi Hồng × tuổi vàng − biên thu mua. ĐỐI CHIẾU HAI NGUỒN: nếu chênh lệch giữa giá Mi Hồng và giá SJC vượt ngưỡng (ví dụ > 1-2%) → hệ thống CẢNH BÁO để quản lý xem có cần cập nhật giá niêm yết Mi Hồng không (tránh giá Mi Hồng bị lỗi thời khi SJC biến động mạnh). Hiển thị giá trên màn hình nhân viên VÀ màn hình khách. Time-lock 3–5 phút cho khách cân nhắc.",
          tools: [
            "API giá Mi Hồng (nội bộ)",
            "API giá SJC (đối chiếu)",
            "Màn hình phụ hướng khách",
          ],
          dataIn: [
            "Giá Mi Hồng tại thời điểm",
            "Giá SJC tại thời điểm",
            "% chênh lệch 2 nguồn",
            "Flag cảnh báo nếu vượt ngưỡng",
            "Giá đề xuất + time-lock",
          ],
          controls: [
            "Công thức giá do quản lý duyệt",
            "Quyền điều chỉnh biên: quản lý ca trở lên",
            "Khi flag cảnh báo chênh lệch: quản lý phải duyệt trước khi báo giá khách",
          ],
          risks: [
            "Nguy cơ: API Mi Hồng không update kịp khi SJC biến động → cảnh báo đối chiếu giúp phát hiện ngay",
            "API mất kết nối: fallback giá mới nhất + flag cảnh báo",
            "Khách từ chối sau lock: session hủy, log đầy đủ",
          ],
          kind: "intake",
          shape: "rect",
        },
        {
          id: "f2b-common-5",
          order: "5",
          title: "Thanh toán",
          department: "Thu ngân",
          subtitle: "> 5 triệu BẮT BUỘC CK · phiếu ký tay",
          detail:
            "Mi Hồng thanh toán cho khách theo quy tắc: (a) Giao dịch > 5 triệu đồng BẮT BUỘC chuyển khoản (policy nội bộ Mi Hồng). Thông tin tài khoản đã lấy ở bước 2 KYC — thu ngân chọn từ dropdown, không nhập lại. (b) Giao dịch ≤ 5 triệu: tiền mặt hoặc CK tùy khách chọn. Hệ thống sinh phiếu thu mua (PTM) có QR, in 2 BẢN GIẤY (khách + Mi Hồng). Khách KÝ TAY trực tiếp trên phiếu giấy (không ký số/ký điện tử trên tablet). Mỗi bên giữ 1 bản có chữ ký tay. Nếu tổng ≥ 400 triệu VNĐ: tự đưa vào danh sách chờ CTR NHNN + bổ sung nghề nghiệp, nguồn gốc vàng.",
          tools: [
            "Phần mềm thu mua",
            "Máy in phiếu A5",
            "Bút ký",
            "Tài khoản ngân hàng Mi Hồng",
          ],
          dataIn: [
            "Mã phiếu thu mua (PTM-...)",
            "Phương thức (TM / CK)",
            "TK đích (link từ KYC)",
            "Bút tích ký tay (scan phiếu lưu hệ thống)",
            "Ảnh phiếu đã ký",
            "Flag CTR nếu ≥ 400M",
          ],
          controls: [
            "Chính sách Mi Hồng: > 5 triệu BẮT BUỘC CK (không ghi đè)",
            "Luật PCRT: ≥ 400M/ngày/CCCD → CTR NHNN trong 1 ngày",
            "NĐ 24: lưu hồ sơ thu mua ≥ 5 năm",
            "Phiếu gốc có chữ ký tay là chứng từ pháp lý — lưu bản cứng",
          ],
          risks: [
            "Nguy cơ: khách chia nhỏ né 400M → cảnh báo structuring (cộng dồn CCCD/ngày)",
            "Nguy cơ CK nhầm tài khoản: đã verify tên TK ở bước 2",
            "Vàng dán tem tạm + Session ID, chuyển khu xử lý",
          ],
          kind: "intake",
          shape: "rect",
        },
        {
          id: "f2b-common-6a",
          order: "6a",
          title: "Đối chiếu lại cân + tuổi",
          department: "Thủ kho",
          subtitle: "Kiểm tra chéo thu ngân · liên hệ CSKH nếu lệch",
          detail:
            "THỦ KHO CÂN + ĐO TUỔI LẠI MỘT LẦN NỮA tại bàn phân loại (kiểm tra chéo công việc của thu ngân). So sánh với số liệu thu ngân đã nhập ở bước 3. KHỚP → tiếp tục sang bước 6b (phân loại). LỆCH (cân chênh > 0,05 chỉ HOẶC tuổi lệch > 1%): báo ngay quản lý + bộ phận CSKH/thu mua để LIÊN HỆ LẠI KHÁCH HÀNG. Truy ngược CCCD + SĐT khách qua Session ID (gắn trên tem tạm của món vàng). Nếu Mi Hồng đã trả DƯ cho khách → yêu cầu khách hoàn thêm. Nếu Mi Hồng trả THIẾU → chuyển bổ sung cho khách. Hệ thống LOG đầy đủ từng lần sai lệch gắn với ID thu ngân. Sai lệch lặp nhiều lần → đánh giá chất lượng nhân sự thu mua (KPI / đào tạo lại / kỷ luật).",
          tools: [
            "Cân điện tử",
            "Máy XRF",
            "Camera bàn phân loại",
            "Tablet thủ kho",
          ],
          dataIn: [
            "Khối lượng thủ kho đo lại",
            "Tuổi vàng thủ kho đo lại",
            "Chênh lệch so với thu ngân",
            "Quyết định: khớp / lệch",
            "Nếu lệch: mã hồ sơ liên hệ lại khách, số tiền chênh, phương án xử lý",
          ],
          controls: [
            "Đối chiếu bắt buộc trước khi phân loại",
            "Chênh lệch được gắn vào ID thu ngân để tính KPI",
            "Liên hệ CSKH: ưu tiên điện thoại trước, nếu không liên lạc được → gửi tin nhắn / thư mời",
          ],
          risks: [
            "Workflow truy vết: Session ID → PTM → CCCD → SĐT khách (từ hệ thống)",
            "QR trên tem sản phẩm cho phép tra ngược nếu phát hiện sau (ngay cả khi đã lên kệ)",
            "Tỷ lệ sai lệch theo thu ngân là chỉ báo chất lượng nhân sự",
          ],
          kind: "process",
          shape: "rect",
        },
        {
          id: "f2b-common-6b",
          order: "6b",
          title: "Phân loại (rẽ nhánh)",
          department: "Thủ kho",
          subtitle: "Sơ chế đích danh hoặc Nung chảy theo lô",
          detail:
            "Khi cân + tuổi đã khớp: thủ kho ra quyết định: SƠ CHẾ ĐÍCH DANH — nếu còn nguyên vẹn, kiểu dáng còn hợp thị trường → sang nhánh Sơ chế. NUNG CHẢY THEO LÔ — nếu hàng vụn, móp méo, kiểu cũ không bán được, khóa hỏng → sang nhánh Nung chảy. Quyết định KÈM ID thủ kho + lý do ngắn (dropdown), ghi vào hệ thống. Camera giám sát bàn phân loại.",
          tools: ["Bàn phân loại", "Camera giám sát", "Tablet thủ kho"],
          dataIn: [
            "Quyết định (sơ chế / nung)",
            "ID thủ kho",
            "Lý do (dropdown cố định)",
            "Ảnh món lúc phân loại",
            "Timestamp",
          ],
          controls: [
            "Camera bàn phân loại ghi liên tục, lưu ≥ 30 ngày",
            "Quản lý ca đối chiếu xác suất quyết định hàng tuần",
            "Cấm thủ kho đổi quyết định sau khi submit",
          ],
          risks: [
            "Điểm dễ thất thoát nội bộ NHẤT",
            "Kiểm soát chéo: camera + quản lý ca duyệt mẫu xác suất",
            "QR trên tem sản phẩm cuối cùng vẫn cho phép truy vết về khách gốc",
          ],
          kind: "process",
          shape: "diamond",
          subflows: [
            { flowId: "f2b-soche", label: "Xem nhánh Sơ chế" },
            { flowId: "f2b-nung", label: "Xem nhánh Nung chảy" },
          ],
        },
      ],
    },

    // ============================================================
    // F2B - SƠ CHẾ (7a.1 → 7a.2)
    // ============================================================
    {
      id: "f2b-soche",
      name: "F2B — Sơ chế đích danh",
      shortDescription: "Nhánh 7a: giữ nguyên món, tracking 1-1 theo SKU.",
      parentId: "f2b-common",
      steps: [
        {
          id: "f2b-soche-1",
          order: "7a.1",
          title: "Sơ chế bề mặt",
          department: "Thợ vàng",
          subtitle: "Đánh bóng · siết khóa · hàn nhẹ",
          detail:
            "Đánh bóng, lau rửa, kiểm khóa và chi tiết. Sửa nhẹ nếu cần: siết khóa, hàn mắt xích đứt, chỉnh vòng khuyên. KHÔNG thay đổi khối lượng đáng kể — nếu có mất vàng (đánh bóng tự nhiên) thì phải cân lại và log chênh lệch.",
          tools: ["Máy đánh bóng", "Máy hàn laser mini", "Kính lúp kiểm tra"],
          dataIn: [
            "Khối lượng sau sơ chế",
            "Chênh lệch so với lúc cân",
            "ID thợ xử lý",
            "Thời gian xử lý",
          ],
          controls: [
            "Chênh khối lượng > 0,1% so với lúc thu → yêu cầu lý do",
            "Camera xưởng sơ chế hoạt động liên tục",
          ],
          risks: [
            "Món hỏng nặng phát hiện ở bước này → chuyển ngược sang nhánh nung chảy (có log chuyển đổi)",
          ],
          kind: "process",
          shape: "rect",
        },
        {
          id: "f2b-soche-2",
          order: "7a.2",
          title: "Gắn SKU + chụp ảnh",
          department: "Thủ kho",
          subtitle: "SKU F2B-YYMMDD-XXXX · tem QR + RFID · 4-6 ảnh",
          detail:
            "Hệ thống sinh SKU theo quy tắc F2B-YYMMDD-XXXX (YY=năm, MM=tháng, DD=ngày, XXXX=số thứ tự trong ngày). In TEM có QR + RFID (nếu dùng), đính vào món. QR trên tem cho phép TRUY VẾT NGƯỢC về khách gốc ngay cả sau khi sản phẩm đã lên kệ (quan trọng khi phát hiện sai sót cần liên hệ lại khách). Chụp 4–6 ảnh upload với SKU làm khóa: mặt trước, mặt sau, cận cảnh khóa, cận cảnh đá (nếu có), tag SKU.",
          tools: [
            "Máy in tem QR + RFID",
            "Booth chụp ảnh",
            "Đèn LED cố định",
            "Tablet upload",
          ],
          dataIn: [
            "SKU F2B-YYMMDD-XXXX",
            "Link Session ID thu mua",
            "Link CCCD khách bán (lineage)",
            "4–6 ảnh chuẩn hóa",
            "QR trên tem = lối truy vết ngược",
          ],
          controls: [
            "Mỗi SKU phải link ngược về PTM và CCCD khách bán",
            "Không được tạo SKU thủ công",
          ],
          risks: [
            "Lineage là chứng cứ NĐ 24 về truy xuất nguồn gốc",
            "QR trên tem là công cụ chính khi cần contact khách sau (bước 6a phát hiện sai, hoặc trong quá trình bảo hành)",
            "Ánh sáng booth chuẩn để ảnh không bóng loáng",
          ],
          kind: "process",
          shape: "rect",
        },
      ],
    },

    // ============================================================
    // F2B - NUNG CHẢY (7b → 11)
    // ============================================================
    {
      id: "f2b-nung",
      name: "F2B — Nung chảy theo lô",
      shortDescription:
        "Nhánh 7b→11: gom batch theo tuổi → niêm phong → nung → đúc → gắn SKU. Tracking theo batch-ID.",
      parentId: "f2b-common",
      steps: [
        {
          id: "f2b-nung-1",
          order: "7b",
          title: "Gom batch theo tuổi",
          department: "Thủ kho",
          subtitle: "Thùng 9999 / 980 / 750 riêng · batch-ID",
          detail:
            "Vàng gom vào thùng INOX CÓ KHÓA theo từng nhóm tuổi: 9999, 980, 750, 610… TUYỆT ĐỐI không trộn tuổi vì sau khi nung không tách ra được. Mỗi thùng nhận một batch-ID riêng — là đơn vị truy xuất duy nhất từ điểm này đến cuối quy trình.",
          tools: ["Thùng inox có khóa", "Cân điện tử", "Tablet thủ kho"],
          dataIn: [
            "Batch-ID (BATCH-YYMMDD-###)",
            "Tuổi vàng của batch",
            "Danh sách Session ID đóng góp",
            "Tổng khối lượng tích lũy",
          ],
          controls: [
            "Quy tắc cứng: 1 batch = 1 tuổi vàng",
            "Hệ thống block bỏ món khác tuổi vào batch",
          ],
          risks: [
            "Lineage quan trọng: truy vết ngược từ sản phẩm đúc ra về từng món thu từ khách",
          ],
          kind: "process",
          shape: "rect",
        },
        {
          id: "f2b-nung-2",
          order: "8",
          title: "Niêm phong + chuyển xưởng",
          department: "Thủ kho + quản lý",
          subtitle: "2 chữ ký + tem seri · cân tổng → xưởng",
          detail:
            "Khi đủ khối lượng / đến ca xử lý: thủ kho + quản lý CÙNG niêm phong thùng (2 chữ ký + tem niêm phong có số seri). Cân tổng khối lượng vào hệ thống → chuyển xưởng chế tác. Log đầy đủ: batch-ID, tuổi, khối lượng vào, thời điểm, người giao, người nhận.",
          tools: [
            "Tem niêm phong có seri",
            "Cân lớn",
            "Phiếu bàn giao 2 chữ ký",
          ],
          dataIn: [
            "Seri tem niêm phong",
            "Khối lượng bàn giao",
            "Chữ ký thủ kho + quản lý",
            "Chữ ký thợ nhận bên xưởng",
            "Ảnh thùng đã niêm",
          ],
          controls: [
            "Bắt buộc 2 chữ ký — thiếu 1 là không hợp lệ",
            "Seri tem kiểm soát bởi quản lý (tương tự HĐ đỏ)",
          ],
          risks: [
            "Nguy cơ tráo thùng giữa kho và xưởng → tem niêm phong chống bóc",
            "Camera ghi hình bàn giao",
          ],
          kind: "process",
          shape: "rect",
        },
        {
          id: "f2b-nung-3",
          order: "9",
          title: "Nung chảy tại xưởng",
          department: "Thợ vàng + quản lý xưởng",
          subtitle: "Hao 0,3-0,5% · camera kép",
          detail:
            "Thợ nung vàng trong nồi nấu, kết hợp hợp kim tinh chế nếu cần. Sau khi đổ thỏi/hột và để nguội: cân ra → khối lượng ra so với vào phải trong định mức hao hụt 0,3–0,5% tùy tuổi. Trong định mức: hệ thống tự ghi nhận. Vượt định mức: BẮT BUỘC lập biên bản giải trình có chữ ký thợ + thủ kho + quản lý, kèm video camera xưởng.",
          tools: [
            "Nồi nấu",
            "Lò nung",
            "Cân chính xác",
            "Camera kép (toàn cảnh + cận bàn cân)",
          ],
          dataIn: [
            "Khối lượng ra",
            "% hao hụt",
            "ID thợ nung",
            "Thời gian nung",
            "Video clip nung (lưu 30-90 ngày)",
          ],
          controls: [
            "Camera kép: 1 toàn cảnh + 1 cận bàn cân, ghi liên tục",
            "Lưu video ≥ 30 ngày, batch giá trị cao ≥ 90 ngày",
          ],
          risks: [
            "KHÂU NHẠY CẢM NHẤT VỀ THẤT THOÁT",
            "Vượt định mức → biên bản + review quản lý",
            "Pattern hao cao lặp lại → điều tra thợ",
          ],
          kind: "warn",
          shape: "rect",
        },
        {
          id: "f2b-nung-4",
          order: "10",
          title: "Đúc sản phẩm mới",
          department: "Thợ vàng",
          subtitle: "Đúc / kéo / dập · XRF lại · dấu NĐ 24",
          detail:
            "Thỏi vàng được đúc / kéo dây / dập khuôn thành nhẫn, dây chuyền, lắc, bông tai… Mỗi sản phẩm mới được tạo ra nhưng CHƯA gắn SKU ở bước này (sang bước 11). Kiểm tuổi thành phẩm bằng XRF thêm lần nữa sau đúc (đảm bảo không lẫn tạp chất trong quá trình đúc). Đóng dấu tuổi theo NĐ 24 (dấu riêng của Mi Hồng đã đăng ký với cơ quan chức năng). Kiểm chất lượng bề mặt, khóa, độ hoàn thiện — món lỗi đúc lại.",
          tools: [
            "Khuôn đúc / máy kéo dây / máy dập",
            "Máy XRF",
            "Bộ dấu đóng tuổi (của Mi Hồng, đã đăng ký)",
          ],
          dataIn: [
            "Loại sản phẩm đúc ra",
            "Khối lượng thành phẩm",
            "Kết quả XRF thành phẩm",
            "Dấu tuổi đã đóng",
            "ID thợ đúc",
            "Batch-ID nguồn (kế thừa từ bước 7b)",
          ],
          controls: [
            "Dấu tuổi vàng Mi Hồng phải đăng ký với cơ quan chức năng (NĐ 24)",
            "Mi Hồng có 1 bộ dấu riêng, không được cho mượn",
            "XRF bắt buộc dù đã XRF nguyên liệu",
          ],
          risks: [
            "Món lỗi phát hiện ở đúc → nung lại (trong cùng batch-ID)",
            "Khối lượng thành phẩm tổng ≤ khối lượng vào sau hao ở bước 9",
          ],
          kind: "process",
          shape: "rect",
        },
        {
          id: "f2b-nung-5",
          order: "11",
          title: "Gắn SKU + chụp ảnh",
          department: "Thủ kho / kỹ thuật",
          subtitle: "SKU F2B-NC-YYMMDD-XXXX · tem QR + RFID",
          detail:
            'Từng sản phẩm đúc xong được gắn SKU riêng theo quy tắc F2B-NC-YYMMDD-XXXX (NC = nung chảy). In TEM có QR + RFID, đính vào món. Field "nguồn batch" = batch-ID gốc từ bước 7b — cho phép truy xuất ngược TOÀN BỘ sản phẩm đúc từ lô đó nếu sau này phát hiện vấn đề (độn, giả, nguồn không sạch). Chụp 4–6 ảnh upload với SKU làm khóa: mặt trước, mặt sau, cận khóa, cận dấu tuổi, tag SKU.',
          tools: [
            "Máy in tem QR + RFID",
            "Booth chụp ảnh",
            "Đèn LED cố định",
            "Tablet upload",
          ],
          dataIn: [
            "SKU F2B-NC-YYMMDD-XXXX",
            "Link batch-ID nguồn",
            "Link danh sách Session ID đóng góp batch",
            "4–6 ảnh chuẩn hóa",
            "QR trên tem cho truy vết",
          ],
          controls: [
            "Mỗi SKU phải link ngược về batch-ID → nhiều Session ID → nhiều CCCD",
            "Không tạo SKU thủ công",
          ],
          risks: [
            "Lineage many-to-one là bằng chứng NĐ 24",
            "Khác với F2B Sơ chế (1-1), Nung chảy là nhiều-1: truy vết về danh sách khách",
            "QR trên tem cho phép contact khách khi cần",
          ],
          kind: "process",
          shape: "rect",
        },
      ],
    },

    // ============================================================
    // B2B — NHẬP SỈ (bước 1 → 7)
    // ============================================================
    {
      id: "b2b",
      name: "B2B — Nhập sỉ",
      shortDescription:
        "NCC đem hàng đến chào → Mi Hồng lựa chọn những mặt hàng phù hợp → cân đo, làm HĐ, nhập kho.",
      parentId: "overview",
      lane: "right",
      steps: [
        {
          id: "b2b-1",
          order: "1",
          title: "Liên hệ NCC / đặt hàng khung",
          department: "Mua hàng / quản lý",
          subtitle: "PO khung (optional) · hẹn NCC đem hàng",
          detail:
            "Dựa trên dữ liệu tồn kho realtime + tốc độ bán của từng mã (dữ liệu đã có từ F2B + lịch sử bán), quản lý ước tính nhu cầu: loại hàng nào đang thiếu, mẫu nào đang bán chạy. Liên hệ NCC qua email/Zalo — có thể gửi PO khung (loại hàng quan tâm, khoảng khối lượng, tuổi vàng) HOẶC hẹn NCC đem hàng đến chào. KHÁC VỚI mua sỉ kiểu công nghiệp: NCC vàng thường đem nhiều mẫu đến chào — không phải ai cũng đặt PO chặt trước.",
          tools: ["Hệ thống tồn kho", "Email / Zalo", "File PO khung"],
          dataIn: [
            "Mã liên hệ (nếu có PO: PO-YYMMDD-###)",
            "Danh mục hàng quan tâm",
            "Thời gian hẹn NCC đến",
            "Hạn thoả thuận giá",
          ],
          controls: [
            "Quyền tạo PO khung: quản lý trở lên",
            "PO khung không ràng buộc số lượng cứng — linh hoạt theo hàng NCC mang đến",
          ],
          risks: [
            "Đây là bước lên kế hoạch. Quyết định thực sự ở bước 2 khi NCC đem hàng đến",
          ],
          kind: "intake",
          shape: "rect",
        },
        {
          id: "b2b-2",
          order: "2",
          title: "NCC đem hàng → Mi Hồng lựa chọn",
          department: "Thủ kho + quản lý",
          subtitle: "NCC mang nhiều · Mi Hồng chọn món phù hợp",
          detail:
            "NCC đem đến Mi Hồng NHIỀU mặt hàng / nhiều mẫu. Thủ kho + quản lý cùng xem toàn bộ hàng NCC mang, CHỌN RA NHỮNG MẶT HÀNG PHÙ HỢP với nhu cầu của Mi Hồng (dựa trên tồn kho, mẫu bán chạy, tuổi vàng, chất lượng hoàn thiện). Những món KHÔNG chọn → trả lại NCC ngay tại chỗ. Hệ thống ghi nhận: danh sách NCC mang (packing list do NCC cung cấp), danh sách Mi Hồng chọn, danh sách trả lại. Ghi hình toàn bộ quá trình bằng camera bàn giao dịch.",
          tools: [
            "Bàn xem hàng",
            "Camera",
            "Tablet ghi nhận",
            "Cân nhanh (sơ bộ)",
          ],
          dataIn: [
            "Packing list NCC (danh sách hàng mang tới)",
            "Danh sách Mi Hồng chọn (subset)",
            "Danh sách trả lại",
            "Ảnh từng lô phân loại",
            "Lý do loại trừ (ngắn)",
          ],
          controls: [
            "Bắt buộc có mặt tối thiểu 2 người Mi Hồng khi xem hàng (thủ kho + quản lý) — tránh 1 người nhận hối lộ",
            "Camera ghi hình toàn bộ",
            "Packing list NCC phải có chữ ký NCC và Mi Hồng khi bắt đầu xem",
          ],
          risks: [
            "Nguy cơ thiên vị NCC: có 2 người duyệt chéo",
            "Món trả lại: chụp ảnh trước khi trả để tránh tranh chấp",
            "Quyết định chọn dựa trên tiêu chí có trước (mẫu bán chạy, tuổi ưu tiên) — không phải cảm tính",
          ],
          kind: "intake",
          shape: "rect",
        },
        {
          id: "b2b-3",
          order: "3",
          title: "Cân + XRF các món đã chọn",
          department: "Thủ kho / kỹ thuật",
          subtitle: "Cân nội bộ · mẫu XRF 5-10% · lệch → 100%",
          detail:
            "Những món đã chọn ở bước 2 → cân lại TOÀN BỘ trên cân nội bộ (không tin cân NCC). Kiểm tuổi XÁC SUẤT 5–10% số món bằng XRF. Nếu mẫu đạt → chấp nhận cả phần đã chọn. Nếu sai lệch tuổi ở bất kỳ món nào → kiểm 100% phần đã chọn. Nếu phát hiện NCC cố tình đưa hàng tuổi thấp: có thể từ chối toàn bộ và chấm dứt hợp tác.",
          tools: ["Cân điện tử nội bộ", "Máy XRF", "Tablet"],
          dataIn: [
            "Khối lượng thực tế từng món",
            "Kết quả XRF mẫu",
            "% mẫu đạt",
            "Quyết định: chấp nhận / kiểm 100% / trả NCC",
          ],
          controls: [
            "Tỷ lệ mẫu 5–10% — NCC mới hoặc NCC có lịch sử lệch: 20–30%",
            "Chọn mẫu random, không để NCC chỉ định món kiểm",
          ],
          risks: [
            "Nguy cơ: NCC độn vàng thấp tuổi ở giữa lô → random sampling + XRF",
            "Sai lệch nhỏ lặp lại trên cùng 1 NCC → điều tra",
          ],
          kind: "process",
          shape: "rect",
        },
        {
          id: "b2b-4",
          order: "4",
          title: "Thoả thuận giá + lập HĐ GTGT",
          department: "Quản lý + kế toán",
          subtitle: "HĐ GTGT điện tử · khớp đúng danh sách đã chọn",
          detail:
            "Dựa trên khối lượng + tuổi thực tế của phần đã chọn, quản lý thoả thuận giá cuối với NCC (tham chiếu giá thị trường + giá đã thoả thuận sơ bộ ở PO khung nếu có). NCC XUẤT HÓA ĐƠN GTGT ĐIỆN TỬ cho đúng số lượng Mi Hồng đã chọn (KHÔNG phải toàn bộ hàng mang đến). Kế toán Mi Hồng KIỂM TRA HÓA ĐƠN: mã số thuế NCC, thông tin Mi Hồng, danh mục + khối lượng + đơn giá + thành tiền + VAT. Khớp với thực tế đã chọn + cân ở bước 3 → xác nhận nhận hóa đơn.",
          tools: [
            "Hệ thống HĐ điện tử (NĐ 123)",
            "Tra cứu MST trên tracuunnt.gdt.gov.vn",
            "Tablet kế toán",
          ],
          dataIn: [
            "Số HĐ GTGT",
            "Chi tiết từng line item (khớp bước 2-3)",
            "Đơn giá thoả thuận",
            "Tổng thành tiền + VAT",
            "Chữ ký điện tử NCC trên HĐ",
          ],
          controls: [
            "NĐ 123/2020: HĐ GTGT điện tử bắt buộc",
            "HĐ phải khớp 100% với danh sách chọn + cân — bất kỳ lệch nào phải điều chỉnh trước khi nhận",
            "Lưu HĐ ≥ 10 năm theo quy định thuế",
          ],
          risks: [
            "Nguy cơ HĐ khống / HĐ sai mã số: tra cứu MST trước khi chấp nhận",
            "HĐ lệch với thực tế: trả lại NCC điều chỉnh, không ký nhận",
          ],
          kind: "process",
          shape: "rect",
        },
        {
          id: "b2b-5",
          order: "5",
          title: "Nhập kho + tạo batch-ID",
          department: "Thủ kho",
          subtitle: "BATCH-B2B-NCC-YYMMDD-### · link HĐ GTGT",
          detail:
            "Hàng đã có HĐ GTGT hợp lệ → nhập kho chính thức. Hệ thống tạo batch-ID: BATCH-B2B-NCC-YYMMDD-###. Log đầy đủ: khối lượng vào, thời gian, NCC, HĐ GTGT tham chiếu, danh sách món. Batch-ID được KẾ THỪA ở mức SKU sau khi tách từng món — để truy xuất ngược nếu NCC có vấn đề chất lượng / nguồn gốc.",
          tools: ["Hệ thống kho", "Máy in tem batch", "Tablet"],
          dataIn: [
            "Batch-ID B2B-NCC-YYMMDD-###",
            "NCC + HĐ GTGT (tham chiếu)",
            "PO khung (nếu có)",
            "Danh sách món → sẽ kế thừa batch-ID sang SKU ở bước 7",
          ],
          controls: [
            "Mỗi batch link ngược về HĐ GTGT",
            "Hệ thống block tạo batch không có HĐ",
          ],
          risks: [
            "Lợi ích: thu hồi nhanh theo batch nếu phát hiện vấn đề",
            "Batch-ID theo NCC giúp phân tích chất lượng nguồn hàng định kỳ",
          ],
          kind: "process",
          shape: "rect",
        },
        {
          id: "b2b-6",
          order: "6",
          title: "Kiểm QC chi tiết từng món",
          department: "Thủ kho",
          subtitle: "Đường / khóa / mạ · fail → trả NCC",
          detail:
            "Kiểm chất lượng từng món sau khi đã nhập kho: đường cạnh, khóa, nước mạ, độ hoàn thiện, đá quý (nếu có), dấu tuổi của NCC. Món KHÔNG ĐẠT phát hiện ở bước này (sót từ bước 2) → trả lại NCC + yêu cầu đổi, kèm ảnh chứng minh. Nếu đã làm HĐ thì phải làm HĐ điều chỉnh (theo NĐ 123).",
          tools: ["Kính lúp", "Đèn LED cao CRI", "Bàn kiểm QC", "Tablet"],
          dataIn: [
            "Kết quả QC từng món",
            "Danh sách reject sau nhập (nếu có)",
            "Yêu cầu đổi + HĐ điều chỉnh",
          ],
          controls: [
            "Chụp ảnh món reject trước khi đóng gói trả",
            "Yêu cầu NCC ký biên bản trả hàng + làm HĐ điều chỉnh",
          ],
          risks: [
            "Reject sau nhập kho là lỗi của Mi Hồng ở bước 2 — KPI QC của thủ kho",
            "Rate reject cao với 1 NCC → review hợp tác",
          ],
          kind: "process",
          shape: "rect",
        },
        {
          id: "b2b-7",
          order: "7",
          title: "Gắn SKU B2B + chụp ảnh",
          department: "Thủ kho",
          subtitle: "SKU B2B-NCC-YYMMDD-XXXX · tem QR + RFID",
          detail:
            'Hệ thống sinh SKU theo quy tắc B2B-NCC-YYMMDD-XXXX. In TEM QR + RFID, đính vào món. Field "nguồn batch" = batch-ID B2B vừa tạo ở bước 5. Chụp 4–6 ảnh upload: mặt trước, mặt sau, cận khóa, cận đá, tag SKU.',
          tools: ["Máy in tem QR + RFID", "Booth chụp ảnh", "Tablet upload"],
          dataIn: [
            "SKU B2B-NCC-YYMMDD-XXXX",
            "Link batch-ID B2B → PO khung → HĐ GTGT",
            "4–6 ảnh chuẩn hóa",
          ],
          controls: [
            "SKU link ngược về batch + HĐ GTGT",
            "Không tạo SKU thủ công",
          ],
          risks: [
            "Chuẩn hóa tem giúp RFID ở bước hội tụ hoạt động đúng",
            "Mã NCC trong SKU giúp phân tích doanh thu theo nguồn hàng",
          ],
          kind: "process",
          shape: "rect",
        },
      ],
    },

    // ============================================================
    // HỘI TỤ — LÊN KỆ (H.1 → H.3)
    // ============================================================
    {
      id: "hoi-tu",
      name: "Hội tụ — Lên kệ",
      shortDescription:
        "Điểm gặp của 3 nhánh: F2B Sơ chế · F2B Nung chảy · B2B. Sau bước này sản phẩm xuất hiện trong POS.",
      parentId: "overview",
      lane: "middle",
      steps: [
        {
          id: "hoi-tu-1",
          order: "H.1",
          title: "Nhập hệ thống + định giá bán",
          department: "Quản lý + thủ kho",
          subtitle: "Giá = vốn + công + biên · quản lý duyệt",
          detail:
            "Tất cả SKU (từ 3 nhánh) được nhập vào hệ thống với đầy đủ thông tin: khối lượng, tuổi, nguồn (session/batch), ảnh, nhà sản xuất (B2B). Hệ thống tính GIÁ BÁN ĐỀ XUẤT theo công thức: Giá vốn + công chế tác + biên lợi nhuận theo loại. Quản lý DUYỆT GIÁ cuối cùng. Công thức khác giữa F2B và B2B do cấu thành giá vốn + vòng quay hàng khác nhau.",
          tools: [
            "Hệ thống quản trị kho",
            "Tablet quản lý",
            "Màn hình duyệt giá",
          ],
          dataIn: [
            "SKU",
            "Giá vốn (tính ra từ nguồn)",
            "Công chế tác (nếu có)",
            "Biên lợi nhuận áp dụng",
            "Giá bán đề xuất",
            "Giá bán duyệt + ID người duyệt",
          ],
          controls: [
            "Quyền duyệt giá: quản lý ca trở lên",
            "Log mọi lần điều chỉnh vs đề xuất",
            "Chênh đề xuất > ngưỡng → yêu cầu lý do",
          ],
          risks: [
            "Nguy cơ: định giá sai do biến động giá vàng → công thức refresh theo API giá spot",
            "Biên lợi nhuận bảo mật, chỉ quản lý nhìn",
          ],
          kind: "process",
          shape: "rect",
        },
        {
          id: "hoi-tu-2",
          order: "H.2",
          title: "RFID trưng bày",
          department: "Nhân viên trưng bày",
          subtitle: "Đầu đọc bắt tag · auto đổi status",
          detail:
            'Khi đặt SKU lên kệ trưng bày: đầu đọc RFID tự bắt tín hiệu tag RFID trên món. Hệ thống tự động đổi trạng thái SKU từ "chờ trưng bày" → "sẵn sàng bán". Không cần nhân viên thao tác thủ công — tránh quên và tránh sai trạng thái.',
          tools: [
            "Đầu đọc RFID tại kệ",
            "Tag RFID trên SKU",
            "Màn hình kiểm tra hiện trạng kệ",
          ],
          dataIn: [
            "Trạng thái SKU auto update",
            "Vị trí kệ (nếu đa vị trí)",
            "Thời điểm lên kệ",
            "ID nhân viên trưng bày (phân công)",
          ],
          controls: [
            "Đầu đọc quét định kỳ (ví dụ 5 phút/lần)",
            "SKU không bắt tín hiệu > 30 phút sau lịch trưng bày → cảnh báo",
          ],
          risks: [
            "Lợi ích: đồng bộ tồn kho realtime, không lệch giữa kho và POS",
            "RFID cũng dùng cho kiểm kê 2 lần/ngày",
          ],
          kind: "process",
          shape: "rect",
        },
        {
          id: "hoi-tu-3",
          order: "H.3",
          title: "Sẵn sàng bán",
          department: "POS",
          subtitle: "Xuất hiện trong POS · nhân viên có thể bán",
          detail:
            "Trạng thái cuối: SKU xuất hiện trong POS của nhân viên bán. Khách hàng có thể được tư vấn và mua món này. Giao dịch bán kích hoạt quy trình bán (ngoài phạm vi tài liệu này).",
          tools: ["POS", "Màn hình nhân viên bán", "Hệ thống tồn kho realtime"],
          dataIn: [
            'Trạng thái "ready_to_sell"',
            "Giá bán hiện hành",
            "Thông tin hiển thị khách",
            "Link ảnh hi-res",
            "Lineage (ẩn với khách)",
          ],
          controls: [
            "Chỉ nhân viên được phân quyền bán mới thấy SKU trong POS",
            'Không cho phép bán SKU chưa ở trạng thái "ready_to_sell"',
          ],
          risks: [
            "Vòng tiếp theo: quy trình bán hàng (KYC khách mua, HĐ điện tử NĐ 123, thanh toán VietQR / TM, xuất kho)",
          ],
          kind: "final",
          shape: "rect",
        },
      ],
    },
  ],
};
```

---

## 12. Implementation Roadmap

### Phase 1 — Scaffold (1-2 giờ)

- Vite + React + TS + Tailwind setup
- Copy `types.ts` và `process.ts` vào `src/data/`
- Router với 2 routes: `/` (overview) và `/flow/:flowId`
- Font Inter, design tokens trong `tailwind.config.ts`

### Phase 2 — Overview + 1 Lane (3-4 giờ)

- `<OverviewPage />`: 3 lane cards + convergence diagram tĩnh
- `<LanePage />` với 1 flow (bắt đầu bằng `f2b-common`)
- `<StepNode />` component render cả rect và diamond
- `<FlowConnector />` SVG mũi tên
- Click lane → navigate; click step → log console (panel sau)

### Phase 3 — Step Detail Panel (2-3 giờ)

- `<StepDetailPanel />` slide-in từ phải
- Render tất cả section (detail, tools, dataIn, controls, risks)
- Close: X button + Esc + click outside
- Button "Bước trước / Bước tiếp" ở footer
- Nếu step có `subflows` → render buttons ở footer panel

### Phase 4 — Drill-down transitions (2-3 giờ)

- Framer-motion layoutId giữa overview lane → lane detail
- Transition fade + scale giữa lane detail → sub-lane (khi click diamond)
- Breadcrumb update live
- Back button (← và Esc)

### Phase 5 — Remaining flows (1-2 giờ)

- Fill in tất cả 5 flow views (`f2b-soche`, `f2b-nung`, `b2b`, `hoi-tu`)
- Verify mọi step đều hiện đúng data từ panel

### Phase 6 — Polish (2-3 giờ)

- Hover states, focus rings, keyboard nav
- Legend component
- Presentation toolbar với full-screen + presentation mode
- Print CSS cho PDF
- Test trên viewport 1920×1080

Total estimate: ~12-17 giờ để đạt P0 production-ready.

---

## 13. Acceptance Criteria

App được coi là đạt khi:

1. ✅ Overview hiển thị đúng 3 lane: F2B Mua từ cá nhân (trái), B2B Nhập sỉ (phải), Hội tụ (giữa)
2. ✅ Click vào lane → đi đến lane detail với breadcrumb đúng
3. ✅ Tất cả **22 step** có card hiển thị đúng số thứ tự, tên, bộ phận, subtitle
4. ✅ Click step bất kỳ → panel mở bên phải, hiện đủ 5 section (detail, tools, dataIn, controls, risks)
5. ✅ Step "Phân loại (6b)" là hình thoi, click mở panel có 2 button drill đến nhánh sơ chế / nung
6. ✅ Nhấn Esc đóng panel; nhấn Esc lần nữa back về level trên
7. ✅ Breadcrumb luôn đúng (Overview › F2B › Bước 3)
8. ✅ Hoạt động ổn định ở 1920×1080 và 1440×900
9. ✅ Transition mượt (≥ 60fps), không giật
10. ✅ Build `npm run build` không error, không warning quan trọng
11. ✅ Lighthouse Performance ≥ 90, Accessibility ≥ 95 trên production build

---

## 14. Engineering Notes

### SVG Diagram approach

Không dùng lib phức tạp. Layout các node thủ công với position absolute hoặc CSS grid, sau đó vẽ connector bằng `<svg>` absolute overlay với `<path>`. Bằng cách này:

- Full quyền styling
- Framer-motion layoutId work perfectly trên div nodes
- Export PDF dễ (no canvas fuzz)

Ví dụ pattern:

```tsx
// StepNode.tsx
import { motion } from "framer-motion";

export function StepNode({ step, onClick }: Props) {
  const kindStyles = {
    intake: "bg-stone-100 border-stone-400 text-stone-900",
    process: "bg-teal-50 border-teal-700 text-teal-900",
    final: "bg-amber-100 border-amber-700 text-amber-900",
    warn: "bg-red-100 border-red-700 text-red-900",
  }[step.kind];

  return (
    <motion.button
      layoutId={`step-${step.id}`}
      onClick={onClick}
      className={`w-64 rounded-lg border-2 p-5 text-left shadow-sm transition-shadow hover:shadow-md ${kindStyles}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-baseline gap-3">
        <span className="text-sm font-semibold opacity-70">{step.order}</span>
        <h3 className="text-base font-semibold">{step.title}</h3>
      </div>
      <p className="mt-1 text-xs text-stone-500">{step.department}</p>
      <p className="mt-2 text-sm">{step.subtitle}</p>
    </motion.button>
  );
}
```

### Connector pattern

```tsx
// FlowConnector.tsx — vẽ mũi tên nối 2 điểm
export function FlowConnector({ from, to }: { from: Point; to: Point }) {
  return (
    <svg className="pointer-events-none absolute inset-0">
      <defs>
        <marker
          id="arrowhead"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M2 1L8 5L2 9"
            fill="none"
            stroke="#525252"
            strokeWidth="1.5"
          />
        </marker>
      </defs>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke="#525252"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );
}
```

### Layout strategy

Mỗi flow dùng CSS Grid 1 cột với `gap-y-10`. Connectors là SVG absolute position full-bleed behind nodes. Tính toạ độ connectors bằng `getBoundingClientRect()` sau khi nodes render (dùng `useLayoutEffect`).

### Panel pattern

Dùng native `<dialog>` hoặc Radix `Dialog` với custom styling slide-in. Trap focus trong panel. Return focus về step node khi close.

### Deep link state

URL pattern:

- `/` → overview
- `/flow/f2b-common` → lane detail
- `/flow/f2b-common/step/f2b-common-3` → lane detail + panel open cho step đó

Deep link cho phép share link hoặc mở lại chính xác vị trí.

---

## 15. Don'ts

- ❌ Đừng dùng icon emoji. Dùng `lucide-react` only.
- ❌ Đừng tạo gradient background hoặc glassmorphism. Flat + shadow + border là đủ.
- ❌ Đừng tự thêm nội dung step mới hoặc paraphrase data trong Section 11. Copy nguyên.
- ❌ Đừng làm mobile-responsive trước khi xong P0 desktop.
- ❌ Đừng cài dependency không cần (lodash, moment, axios, state management library). Scope nhỏ.
- ❌ Đừng dùng inline style object. Tailwind classes only.
- ❌ Đừng quên `lang="vi"` trên `<html>` tag để browser phát âm đúng screen reader.

---

## 16. First commands for Claude Code

```bash
npm create vite@latest mi-hong-flow -- --template react-ts
cd mi-hong-flow
npm install
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
npm install framer-motion lucide-react react-router-dom clsx
```

Sau đó:

1. Config tailwind với design tokens ở Section 7
2. Copy `types.ts` và `process.ts` từ Section 10, 11 vào `src/data/`
3. Scaffold routes + pages
4. Triển khai theo roadmap Section 12

---

Kết thúc brief. Chúc build vui. Nếu có chỗ nào trong data thấy bất nhất với kiến trúc — dừng lại hỏi, đừng tự ý "sửa cho phù hợp".
