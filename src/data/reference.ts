/**
 * Dữ liệu các sheet tra cứu của MH_QUY_TRINH_MUA_BAN v4:
 * Ký hiệu SKU · Cảnh báo & Kiểm soát · Kế toán - Tổng hợp · Kế toán - Tính giá thành
 */

import { withBrand } from "@/lib/brand";

export interface SkuCode {
  name: string;
  format: string;
  meaning: string;
  example: string;
}

const rawSkuCodes: SkuCode[] = [
  {
    name: "Session ID (F2B)",
    format: "YYMMDD-HHMM-####",
    meaning:
      "YY=năm, MM=tháng, DD=ngày, HHMM=giờ phút, ####=số thứ tự trong phút",
    example: "260422-1435-0001\nGắn phiếu QR khách nhận lúc tiếp nhận",
  },
  {
    name: "SKU F2B (Sơ chế)",
    format: "F2B-YYMMDD-XXXX",
    meaning: "F2B=nguồn cá nhân, XXXX=số thứ tự trong ngày",
    example: "F2B-260422-0017\nLineage: SKU → Session → CCCD",
  },
  {
    name: "Batch-ID (F2B Nung)",
    format: "BATCH-YYMMDD-###",
    meaning: "###=số batch trong ngày",
    example: "BATCH-260422-002\n1 batch = 1 tuổi vàng",
  },
  {
    name: "SKU đúc lại (F2B Nung)",
    format: "F2B-NC-YYMMDD-XXXX",
    meaning: "NC=nung chảy",
    example: "F2B-NC-260425-0042\nField 'nguồn batch' = BATCH gốc",
  },
  {
    name: "PO khung (B2B)",
    format: "PO-YYMMDD-###",
    meaning: "Số PO trong ngày",
    example: "PO-260420-005",
  },
  {
    name: "Batch-ID (B2B)",
    format: "BATCH-B2B-NCC-YYMMDD-###",
    meaning: "NCC=mã nhà cung cấp (3-4 ký tự)",
    example: "BATCH-B2B-SJCS-260422-001",
  },
  {
    name: "SKU B2B",
    format: "B2B-NCC-YYMMDD-XXXX",
    meaning: "NCC=mã NCC",
    example: "B2B-SJCS-260422-0088",
  },
  {
    name: "Phiếu thu mua (F2B)",
    format: "PTM-YYMMDD-####",
    meaning: "Số phiếu trong ngày",
    example: "PTM-260422-0134\nGắn CCCD + Session. Ký TAY, in giấy",
  },
  {
    name: "Mã báo cáo CTR",
    format: "CTR-YYMMDD-###",
    meaning: "Số CTR trong ngày",
    example: "CTR-260422-003\nBắt buộc khi GD ≥ 400M",
  },
  {
    name: "Mã bút toán KT",
    format: "JE-YYMMDD-######",
    meaning: "JE=Journal Entry, số liên tục toàn hệ thống",
    example: "JE-260422-000175\nMỗi sự kiện nghiệp vụ sinh 1 hoặc nhiều JE",
  },
];

const rawLineageRules: string[] = [
  "SKU F2B Sơ chế → Session ID → Phiếu PTM → CCCD khách bán",
  "SKU F2B Nung → Batch-ID → nhiều Session ID → nhiều CCCD (many-to-one)",
  "SKU B2B → Batch-ID B2B → HĐ GTGT NCC → PO khung (nếu có)",
  "Mọi bút toán kế toán link với: chứng từ gốc (PTM / HĐ GTGT / phiếu xuất) + SKU hoặc Batch-ID",
  "QR trên tem SP là lối truy vết thực tế khi contact khách (bảo hành, thu hồi, điều chỉnh…)",
];

export interface AlertRule {
  group: string;
  trigger: string;
  description: string;
  actions: string[];
  severity: "high" | "medium";
}

const rawAlertRules: AlertRule[] = [
  {
    group: "AML (rửa tiền)",
    trigger: "GD ≥ 400 triệu VNĐ",
    description:
      "Một GD F2B hoặc bán đơn lẻ vượt ngưỡng CTR theo Luật PCRT 2022",
    actions: [
      "Tự tạo báo cáo CTR",
      "Bổ sung nghề nghiệp + nguồn gốc",
      "Gửi NHNN trong 1 ngày",
    ],
    severity: "high",
  },
  {
    group: "AML (structuring)",
    trigger: "Cộng dồn ≥ 400M/ngày/CCCD",
    description: "Chia nhỏ GD né ngưỡng báo cáo",
    actions: [
      "Cảnh báo QL ca",
      "Đưa CCCD vào danh sách theo dõi 30 ngày",
      "CTR tổng hợp",
    ],
    severity: "high",
  },
  {
    group: "CK pháp lý (ND 232/2025)",
    trigger: "GD ≥ 20 triệu/ngày/khách",
    description:
      "ND 232/2025 Điều 4 khoản 10 (10/10/2025): mua/bán vàng ≥ 20M/ngày/khách bắt buộc TK NH",
    actions: [
      "Khóa option 'tiền mặt'",
      "Cộng dồn theo CCCD",
      "Log phục vụ báo cáo NHNN",
    ],
    severity: "high",
  },
  {
    group: "CK pháp lý (ND 320/2025)",
    trigger: "GD mua ≥ 5 triệu",
    description:
      "ND 320/2025 Điều 10 (15/12/2025): mua ≥ 5M/ngày/khách bắt buộc TK NH",
    actions: [
      "Khóa 'tiền mặt' trên POS",
      "Bắt buộc CK TK đã verify KYC",
      "Không ghi đè",
    ],
    severity: "high",
  },
  {
    group: "Cân gian lận",
    trigger: "Chênh cân tay vs nối PM > 0,05 chỉ",
    description: "Nhân viên cố gõ tay khi cân đã nối PM",
    actions: ["Block GD", "Cảnh báo QL", "Bắt buộc giải trình"],
    severity: "high",
  },
  {
    group: "Chênh cân/tuổi phân loại",
    trigger: "Thủ kho đo lại lệch > 0,05 chỉ hoặc > 1%",
    description: "Số thu ngân nhập không khớp thực tế",
    actions: [
      "Báo QL + CSKH contact khách",
      "Truy qua Session ID / QR tem",
      "Gắn ID thu ngân để KPI",
    ],
    severity: "medium",
  },
  {
    group: "Chênh giá Mi Hồng vs SJC",
    trigger: "Chênh > 1-2%",
    description: "Giá Mi Hồng có thể lỗi thời",
    actions: [
      "Cảnh báo QL",
      "QL duyệt trước khi báo khách",
      "Prompt cập nhật giá niêm yết",
    ],
    severity: "medium",
  },
  {
    group: "Tuổi vàng bất thường",
    trigger: "XRF phát hiện Rh / Pd / W",
    description: "Dấu hiệu vàng độn / giả",
    actions: [
      "Cảnh báo kỹ thuật",
      "Kiểm tra kỹ",
      "Xác nhận giả: từ chối + biên bản",
    ],
    severity: "high",
  },
  {
    group: "Hao nung vượt định mức",
    trigger: "Hao > 0,5%",
    description: "KL ra sau nung thấp hơn định mức",
    actions: ["Biên bản giải trình", "Video camera xưởng", "Review QL"],
    severity: "medium",
  },
  {
    group: "Chênh lệch HĐ B2B",
    trigger: "HĐ NCC không khớp thực tế",
    description: "Line item / KL / giá HĐ khác chọn + cân",
    actions: ["Block nhập kho", "Trả NCC điều chỉnh", "Không ký nhận"],
    severity: "medium",
  },
  {
    group: "MST NCC không hợp lệ",
    trigger: "Tra cứu thấy MST không hoạt động",
    description: "NCC xuất HĐ với MST sai / ảo",
    actions: ["Block nhận HĐ", "Báo kế toán", "Không khấu trừ VAT đầu vào"],
    severity: "high",
  },
  {
    group: "Face-match thấp",
    trigger: "Score < ngưỡng",
    description: "Selfie không khớp CCCD",
    actions: ["Kiểm tra thủ công", "QL ca duyệt"],
    severity: "medium",
  },
  {
    group: "Khách <18 tuổi",
    trigger: "Tuổi tính từ CCCD < 18",
    description: "Chưa thành niên bán vàng",
    actions: ["Block GD", "Không cho ghi đè"],
    severity: "high",
  },
  {
    group: "Thiếu chữ ký tay PTM",
    trigger: "Phiếu chưa scan bản ký",
    description: "PTM in ra nhưng chưa scan lưu hệ thống",
    actions: [
      "Cảnh báo thu ngân cuối ca",
      "Không đóng ca khi còn phiếu chưa scan",
    ],
    severity: "medium",
  },
  {
    group: "GD NH chưa match",
    trigger: "Sao kê có GD unmatched > 24h",
    description: "GD CK không link được với PTM/HĐ",
    actions: ["Dashboard unmatched cho KT", "Block đóng sổ ngày", "KTT review"],
    severity: "medium",
  },
  {
    group: "Công nợ NCC quá hạn",
    trigger: "Aging > ngưỡng (ví dụ > 7 ngày quá hạn)",
    description: "Đến hạn thanh toán NCC chưa xử lý",
    actions: [
      "Nhắc KT + QL",
      "Ưu tiên trong lệnh CK ngày mới",
      "Báo cáo hàng tuần",
    ],
    severity: "medium",
  },
  {
    group: "SKU không có batch-ID",
    trigger: "Bán SKU thiếu batch-ID nguồn",
    description: "Lỗi nhập liệu ở bước tạo SKU",
    actions: ["Block hạch toán giá vốn", "Báo KT xử lý", "Block đóng GD bán"],
    severity: "medium",
  },
  {
    group: "SKU không lên kệ",
    trigger: "Đã lên lịch > 30 phút, RFID không bắt",
    description: "Tag lỗi hoặc quên đặt lên kệ",
    actions: ["Cảnh báo thủ kho", "Kiểm tra"],
    severity: "medium",
  },
  {
    group: "Pattern thợ gian lận",
    trigger: "Hao cao lặp lại trên 1 thợ",
    description: "% hao bất thường so với trung bình",
    actions: ["Báo cáo định kỳ", "Điều tra video"],
    severity: "medium",
  },
  {
    group: "Điều chỉnh giá bán lớn",
    trigger: "Giá duyệt lệch đề xuất > 5%",
    description: "Giảm giá nhiều so với đề xuất hệ thống",
    actions: ["Yêu cầu lý do", "Log audit", "Báo cáo hàng tuần"],
    severity: "medium",
  },
  {
    group: "Báo cáo định kỳ NHNN",
    trigger: "Đến kỳ báo cáo tháng / quý",
    description:
      "ND 232/2025: báo cáo tình hình mua/bán vàng trang sức định kỳ cho NHNN",
    actions: [
      "Tổng hợp số liệu",
      "Xuất file theo mẫu NHNN",
      "Nhắc QL duyệt trước deadline",
    ],
    severity: "medium",
  },
];

const rawLegalDocs: { name: string; children?: string[] }[] = [
  {
    name: "Nghị định 24/2012/NĐ-CP — quản lý hoạt động kinh doanh vàng (văn bản gốc)",
  },
  {
    name: "Nghị định 232/2025/NĐ-CP (26/8/2025, hiệu lực 10/10/2025) — sửa đổi, bổ sung NĐ 24/2012",
    children: [
      "Điều 4 khoản 10: thanh toán ≥ 20 triệu/ngày/khách bắt buộc qua TK ngân hàng",
      "Điều 7a: quản lý kinh doanh vàng trang sức — niêm yết giá, ghi hàm lượng, chịu trách nhiệm nguồn gốc",
      "Yêu cầu báo cáo định kỳ NHNN",
    ],
  },
  {
    name: "Luật Phòng, chống rửa tiền 2022 (14/2022/QH15) — ngưỡng CTR 400 triệu VNĐ",
  },
  { name: "Nghị định 123/2020/NĐ-CP — hóa đơn, chứng từ điện tử" },
  {
    name: "Luật Kế toán 2015 + Thông tư 99/2025/TT-BTC — chế độ kế toán doanh nghiệp",
  },
  { name: "Luật Quản lý thuế 2019 — kê khai, nộp thuế" },
  { name: "Nghị định 13/2023/NĐ-CP — bảo vệ dữ liệu cá nhân" },
  {
    name: "Nghị định 320/2025/NĐ-CP — hướng dẫn thi hành Luật thuế thu nhập doanh nghiệp",
  },
  {
    name: "Thông tư 20/2026/TT-BTC — hướng dẫn thi hành Luật thuế thu nhập doanh nghiệp",
  },
];

export interface AccountingTask {
  frequency: string;
  task: string;
  description: string;
  deadline: string;
}

const rawAccountingTasks: AccountingTask[] = [
  {
    frequency: "Hàng ngày",
    task: "Đối chiếu sao kê ngân hàng",
    description:
      "Pull sao kê mọi TK NH Mi Hồng qua API / IB. AUTO MATCH từng GD với bút toán đã hạch toán ở các flow (PTM F2B, HĐ B2B, HĐ bán). Unmatched → xử lý trong 24h.",
    deadline: "Trong ngày — không đóng sổ ngày khi còn unmatched",
  },
  {
    frequency: "Hàng ngày",
    task: "Kiểm quỹ tiền mặt + phiếu thu/chi",
    description:
      "Cuối ca: kiểm đếm tiền mặt tại két, so với sổ quỹ (tổng phiếu thu - tổng phiếu chi trong ca). Chênh lệch → tìm nguyên nhân, lập biên bản.",
    deadline: "Cuối mỗi ca",
  },
  {
    frequency: "Hàng ngày",
    task: "Review bút toán của ca",
    description:
      "Kế toán viên review tất cả bút toán auto-sinh trong ca (không sửa, chỉ duyệt). Bất thường (giá vốn lệch, bút toán không có chứng từ, điều chỉnh tay) → báo KTT.",
    deadline: "Cuối ca",
  },
  {
    frequency: "Hàng tuần",
    task: "KTT duyệt mẫu xác suất",
    description:
      "KTT chọn ngẫu nhiên 5-10% bút toán trong tuần, kiểm tra kỹ: chứng từ gốc, mapping nghiệp vụ-TK, số tiền, chữ ký duyệt. Phát hiện lỗi → đào tạo lại + cảnh báo.",
    deadline: "Thứ 2 tuần sau",
  },
  {
    frequency: "Hàng tuần",
    task: "Báo cáo công nợ",
    description:
      "Aging report NCC (phải trả) + khách (phải thu nếu có). Đến hạn thanh toán NCC → đưa vào lệnh CK tuần.",
    deadline: "Thứ 2 đầu tuần",
  },
  {
    frequency: "Hàng tuần",
    task: "Báo cáo quản trị bán hàng",
    description:
      "Doanh thu theo SKU/nguồn/NV, lãi gộp, top SKU bán chạy, pattern discount. Input cho QL điều chỉnh bộ sưu tập + KPI NV.",
    deadline: "Thứ 2 đầu tuần",
  },
  {
    frequency: "Hàng tháng",
    task: "Đóng sổ cuối tháng",
    description:
      "Tính COGS theo phương pháp đã đăng ký (FIFO batch-ID hoặc BQGQ). Đối chiếu tồn kho sổ vs thực tế (RFID kiểm kê). Lệch > ngưỡng → điều tra trước khi đóng sổ. Khóa cứng số liệu tháng.",
    deadline: "Ngày 5 tháng sau — chuẩn bị cho kê khai thuế",
  },
  {
    frequency: "Hàng tháng",
    task: "Kê khai VAT (nếu thuộc diện)",
    description:
      "Doanh thu > 50 tỷ/năm: kê khai THÁNG. Tờ khai 02/GTGT tự sinh từ HĐ đầu vào/ra. KTT duyệt trước submit eTax.",
    deadline: "Trước ngày 20 tháng sau — Luật QLT; chậm phạt + lãi 0,03%/ngày",
  },
  {
    frequency: "Hàng tháng",
    task: "Tạm tính + nộp TNCN khấu trừ",
    description:
      "Khấu trừ TNCN từ lương nhân viên, nộp hàng tháng (nếu thuộc diện).",
    deadline: "Trước ngày 20 tháng sau",
  },
  {
    frequency: "Hàng quý",
    task: "Kê khai VAT (nếu thuộc diện)",
    description: "Doanh thu < 50 tỷ/năm: kê khai QUÝ thay vì tháng.",
    deadline: "Trước ngày 30 tháng đầu quý sau",
  },
  {
    frequency: "Hàng quý",
    task: "Tạm tính TNDN",
    description: "Tạm tính TNDN quý, nộp (nếu phát sinh).",
    deadline: "Trước ngày 30 tháng đầu quý sau",
  },
  {
    frequency: "Hàng quý",
    task: "Báo cáo TNCN",
    description: "Báo cáo quý TNCN đã khấu trừ.",
    deadline: "Trước ngày 30 tháng đầu quý sau",
  },
  {
    frequency: "Định kỳ",
    task: "Báo cáo NHNN (ND 232/2025)",
    description:
      "Tình hình mua/bán vàng trang sức, mỹ nghệ theo hướng dẫn NHNN. Tần suất + mẫu biểu chờ NHNN ban hành hướng dẫn cụ thể.",
    deadline: "Theo hướng dẫn NHNN — ND 232/2025 (hiệu lực 10/10/2025)",
  },
  {
    frequency: "Khi phát sinh",
    task: "Báo cáo CTR — GD lớn ≥ 400M",
    description:
      "Cho mỗi GD F2B/bán ≥ 400M/ngày/CCCD. Tự flag từ bước KYC + thanh toán. KTT duyệt. Submit NHNN.",
    deadline: "Trong 1 ngày làm việc — Luật PCRT 2022",
  },
  {
    frequency: "Khi nghi ngờ",
    task: "Báo cáo STR — GD đáng ngờ",
    description:
      "GD có dấu hiệu đáng ngờ (structuring, tuổi vàng lạ, CCCD mới lặp lại, khách lạ GD lớn...). Không cần đạt ngưỡng 400M. Quyết định báo do KTT + QL cân nhắc.",
    deadline: "Trong 48h kể từ khi phát hiện — Luật PCRT 2022",
  },
  {
    frequency: "Hàng năm",
    task: "Quyết toán TNDN",
    description: "Quyết toán năm + nộp TNDN còn thiếu (nếu có).",
    deadline: "Trước 31/3 năm sau",
  },
  {
    frequency: "Hàng năm",
    task: "Quyết toán TNCN",
    description: "Quyết toán TNCN cho toàn bộ nhân viên.",
    deadline: "Trước 31/3 năm sau",
  },
  {
    frequency: "Hàng năm",
    task: "BCTC + kiểm toán (nếu thuộc diện)",
    description:
      "Báo cáo tài chính năm theo TT 200/2014. Nộp Thuế + Sở KHĐT. Kiểm toán độc lập nếu thuộc diện bắt buộc.",
    deadline: "Trước 31/3 năm sau",
  },
];

export interface CostingEntry {
  stage: string;
  entry: string;
  code: string;
  warehouse: string;
  costItem: string;
}

/** Sheet "Kế toán - Tính giá thành" v4 — sơ đồ bút toán theo từng công đoạn */
const rawCostingEntries: CostingEntry[] = [
  {
    stage: "Thu mua",
    entry: "Nợ 152 / Có 331",
    code: "Theo tuổi vàng",
    warehouse: "Kho NVL thu mua",
    costItem: "",
  },
  {
    stage: "Phân loại",
    entry: "Nợ 152 / Có 152",
    code: "Theo tuổi vàng",
    warehouse: "Kho NVL sơ chế",
    costItem: "",
  },
  {
    stage: "Phân loại",
    entry: "Nợ 152 / Có 152",
    code: "Theo tuổi vàng",
    warehouse: "Kho NVL nung chảy",
    costItem: "",
  },
  {
    stage: "Sơ chế",
    entry: "Nợ 621 / Có 152",
    code: "Theo tuổi vàng",
    warehouse: "Kho NVL sơ chế",
    costItem: "NVLTT",
  },
  {
    stage: "Sơ chế",
    entry: "Nợ 622 / Có 334",
    code: "",
    warehouse: "",
    costItem: "NCTT - Bộ phận sơ chế",
  },
  {
    stage: "Sơ chế",
    entry: "Nợ 627 / Có …",
    code: "",
    warehouse: "",
    costItem: "SXC - Bộ phận sơ chế",
  },
  {
    stage: "Tập hợp giá thành sơ chế",
    entry: "Nợ 154 / Có 621, 622, 627",
    code: "",
    warehouse: "",
    costItem: "",
  },
  {
    stage: "Tập hợp giá thành sơ chế",
    entry: "Nợ 155 / Có 154",
    code: "",
    warehouse: "",
    costItem: "",
  },
  {
    stage: "Nung chảy",
    entry: "Nợ 621 / Có 152",
    code: "Theo tuổi vàng",
    warehouse: "Kho NVL nung chảy",
    costItem: "NVLTT",
  },
  {
    stage: "Nung chảy",
    entry: "Nợ 622 / Có 334",
    code: "",
    warehouse: "",
    costItem: "NCTT - Bộ phận chế tác",
  },
  {
    stage: "Nung chảy",
    entry: "Nợ 627 / Có …",
    code: "",
    warehouse: "",
    costItem: "SXC - Bộ phận chế tác",
  },
  {
    stage: "Tập hợp giá thành nung chảy",
    entry: "Nợ 154 / Có 621, 622, 627",
    code: "",
    warehouse: "",
    costItem: "",
  },
  {
    stage: "Tập hợp giá thành nung chảy",
    entry: "Nợ 155 / Có 154",
    code: "",
    warehouse: "",
    costItem: "",
  },
  {
    stage: "Nhập sỉ",
    entry: "Nợ 156 / Có 331",
    code: "",
    warehouse: "",
    costItem: "",
  },
];

// Export sau khi thay tên thương hiệu theo biến môi trường (VITE_BRAND_NAME)
export const skuCodes = withBrand(rawSkuCodes);
export const lineageRules = withBrand(rawLineageRules);
export const alertRules = withBrand(rawAlertRules);
export const legalDocs = withBrand(rawLegalDocs);
export const accountingTasks = withBrand(rawAccountingTasks);
export const costingEntries = withBrand(rawCostingEntries);
