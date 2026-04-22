# Mi Hồng — Interactive Flow Presentation App

Bản trình chiếu web tương tác quy trình **Thu mua → Xử lý → Lên kệ** của Mi Hồng, tối ưu cho màn hình TV/projector 1920×1080.

## Stack

- Vite 5 + React 18 + TypeScript (strict)
- Tailwind CSS v3 (theme tuỳ biến: đỏ đô `#8b1a1a` + gold `#c9a227`)
- framer-motion (shared layout transitions)
- react-router-dom v6
- lucide-react (icons)
- react-to-print (xuất PDF)

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Cấu trúc

```
src/
├── app.tsx                 # Root + Esc handler + data integrity check
├── main.tsx                # BrowserRouter entry
├── routes.tsx              # Routes + AnimatePresence
├── pages/
│   ├── overview-page.tsx   # "/" — 3-lane overview
│   └── lane-page.tsx       # "/flow/:flowId[/step/:stepId]" — chi tiết
├── components/
│   ├── diagram/            # StepNode, DiamondNode, FlowConnector, LaneDiagram, OverviewDiagram, ZoomContainer
│   ├── panel/              # StepDetailPanel + Section / BulletList / ChipList
│   ├── layout/             # AppHeader, Breadcrumb, PresentationToolbar, Legend, PrintLayout
│   └── ui/                 # Button, Badge
├── hooks/                  # use-fullscreen, use-zoom-pan, use-presentation-mode, use-keyboard
├── data/                   # types.ts, process.ts (toàn bộ dữ liệu Section 11), validate.ts
└── lib/utils.ts            # cn()
```

## Phím tắt

| Phím      | Hành động                  |
| --------- | -------------------------- |
| `Esc`     | Quay lại / đóng panel      |
| `←` / `→` | Chuyển bước trong panel    |
| `+` / `-` | Zoom in / out              |
| `0`       | Reset zoom 100%            |
| `P`       | Bật/tắt chế độ trình chiếu |

## Tính năng

- 3-lane overview (F2B Tiệm — B2B Bạn hàng — Hội tụ)
- Drill-down 5 sub-flows với transition layoutId mượt mà
- Panel chi tiết: mô tả · công cụ · dữ liệu vào · kiểm soát · rủi ro · nhánh con
- Nhánh con của "6b Lựa chọn hướng xử lý" → Sơ chế / Nung luyện
- Breadcrumb đa cấp
- Zoom 50%–200% + pan scroll
- Presentation mode: ẩn toolbar sau 2.5s idle
- Fullscreen toggle
- Xuất PDF đầy đủ toàn bộ quy trình (react-to-print)
- Keyboard nav toàn cục

## Brand

- `brand` `#8b1a1a` (đỏ đô)
- `brand-deep` `#5c0f0f`
- `gold` `#c9a227`
- Font: Inter (Google Fonts, tiếng Việt đủ dấu)

## Responsive

Thiết kế chính cho 1280+ (TV/projector). Mobile breakpoint giữ layout cơ bản đọc được nhưng **không phải scope chính**.
