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
          accounting:
            "KIỂM TRA ĐIỀU KIỆN KYC: dữ liệu CCCD đã đầy đủ chưa (bắt buộc để hạch toán đúng đối tượng nếu GD ≥ 400M). Dữ liệu CCCD + TK sẽ được link vào bút toán thu mua ở bước 5 — là chứng cứ tuân thủ NĐ 24 + PCRT khi có thanh tra.",
          accountingDocs: [
            "Bản scan CCCD 2 mặt (chứng từ khách hàng)",
            "Ảnh selfie + face-match score",
            "Bản khai thông tin TK ngân hàng khách\nLưu theo NĐ 13/2023 về dữ liệu cá nhân; link với PTM ở bước 5",
          ],
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
          accountingDocs: [
            "Phiếu cân điện tử (in tự động, chứng từ nội bộ)",
            "Ảnh phổ XRF + kết quả (đính kèm Session ID)\nKhông phải chứng từ kế toán gốc, nhưng là căn cứ cho giá trị trên PTM",
          ],
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
          accountingDocs: [
            "Bảng báo giá in tự động (nội bộ, không có chữ ký)",
            "Snapshot giá 2 nguồn (Mi Hồng + SJC) tại thời điểm lock\nLàm căn cứ pháp lý nếu khách khiếu nại về giá sau",
          ],
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
          accounting:
            "GHI NHẬN BÚT TOÁN THU MUA (auto từ sự kiện ký PTM): Nợ 156 (Hàng hóa) / Có 111 (nếu TM) hoặc Có 112 (nếu CK). Link bút toán với: PTM + Session ID + CCCD + mã GD ngân hàng (nếu CK). SCAN PHIẾU PTM có chữ ký tay lưu hệ thống, giữ bản cứng theo thứ tự PTM trong tủ lưu. Nếu GD ≥ 400M: flag đưa vào danh sách CTR để báo cáo NHNN trong 24h. Cuối ca: kế toán viên REVIEW bút toán (không sửa, chỉ duyệt). Bất thường → báo KTT.",
          accountingDocs: [
            "PHIẾU THU MUA (PTM) 2 BẢN GIẤY có chữ ký tay khách — CHỨNG TỪ GỐC CHÍNH (lưu 5+ năm theo NĐ 24)",
            "Ủy nhiệm chi điện tử từ NH Mi Hồng (nếu CK) — chứng từ thanh toán",
            "Phiếu chi tiền mặt (nếu TM) — in từ phần mềm",
            "Bản scan PTM đã ký upload hệ thống",
            "Flag CTR (nếu ≥ 400M) — làm dữ liệu báo cáo NHNN ở sheet Kế toán - Tổng hợp",
          ],
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
          accounting:
            "NẾU PHẢI BỔ SUNG / HOÀN TIỀN do chênh lệch: Kế toán ghi bút toán điều chỉnh: • Trả dư (Mi Hồng đưa thêm cho khách): Nợ 156 / Có 111 hoặc 112. • Trả thiếu (Mi Hồng thu lại từ khách): Có 156 / Nợ 111 hoặc 112. Liên kết với PTM gốc và phiếu điều chỉnh có chữ ký tay của khách. Nếu lệch lớn: cập nhật lại flag CTR (nếu qua/dưới ngưỡng 400M sau điều chỉnh).",
          accountingDocs: [
            "KHI LỆCH (nếu có):",
            "Biên bản chênh lệch cân/tuổi có chữ ký thủ kho + thu ngân + QL",
            "Phiếu điều chỉnh thu mua (bổ sung / hoàn) có chữ ký tay khách — tham chiếu PTM gốc",
            "Ủy nhiệm chi / phiếu chi bổ sung (nếu có)\nKHI KHỚP: không phát sinh chứng từ kế toán",
          ],
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
          accountingDocs: [
            "Phiếu quyết định phân loại (nội bộ, thủ kho ký) — ghi lý do + timestamp\nKhông phải chứng từ kế toán, là chứng từ quản trị kho",
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
          accounting:
            "Theo dõi HAO VÀNG trong sơ chế (thường không đáng kể, nhưng nếu > 0,1% phải log). Cuối tháng: tổng hao sơ chế ghi vào chi phí sản xuất chung (627) để điều chỉnh giá vốn.",
          accountingDocs: [
            "Phiếu theo dõi sơ chế (nội bộ) — ghi ID thợ, KL trước/sau, thời gian",
            "Biên bản hao vượt định mức (nếu > 0,1%) có chữ ký thợ + thủ kho",
          ],
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
          accounting:
            "SKU tạo ra mang theo GIÁ VỐN từ bước 5 (giá thu mua) = cơ sở cho tính COGS + lãi gộp khi bán. Không phát sinh bút toán mới ở bước này — vàng vẫn ở TK 156.",
          accountingDocs: [
            "Phiếu nhập kho trưng bày (nội bộ) — ghi SKU + giá vốn + link PTM nguồn",
            "Tem SKU có QR (dán lên sản phẩm) — tham chiếu cho bảo hành / truy vết",
          ],
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
          accounting:
            "TẠO GROUP ACCOUNTING: batch-ID được ghi nhận như 1 sub-ledger trong TK 156. Giá vốn của batch = tổng giá thu mua các Session đóng góp (đã hạch toán ở bước 5). Chưa phát sinh bút toán — chỉ gom logic.",
          accountingDocs: [
            "Phiếu gom batch (nội bộ) — ghi batch-ID, tuổi, danh sách Session/PTM đóng góp, tổng KL\nLàm căn cứ truy xuất ngược khi cần",
          ],
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
          accounting:
            "PHIẾU BÀN GIAO là chứng từ nội bộ kế toán lưu 5-10 năm. Theo dõi batch đang ở trạng thái 'in workshop' trong sổ kho chi tiết. Chưa phát sinh bút toán.",
          accountingDocs: [
            "PHIẾU BÀN GIAO XƯỞNG — 2 chữ ký tay (thủ kho + QL) + chữ ký thợ nhận + seri tem niêm phong",
            "Ảnh thùng đã niêm\nChứng từ nội bộ kế toán lưu ≥ 5 năm",
          ],
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
          accounting:
            "GHI NHẬN HAO HỤT VÀO CHI PHÍ: bút toán Nợ 632 (Giá vốn) / Có 156 (Hàng hóa) cho phần vàng hao trong định mức. Phần hao VƯỢT định mức: Nợ 1381 (Tài sản thiếu chờ xử lý) / Có 156 — chờ kết luận giải trình. Nếu kết luận do lỗi thợ: chuyển Nợ 1388/334 (truy thu) / Có 1381.",
          accountingDocs: [
            "BIÊN BẢN NUNG — ghi KL vào/ra, % hao, ID thợ, ký bởi thợ + thủ kho + QL",
            "Biên bản giải trình hao vượt định mức (nếu có) + video camera xưởng đính kèm",
            "Quyết định xử lý hao vượt (nếu truy thu thợ): biên bản có chữ ký thợ đồng ý\nLưu 5-10 năm, là căn cứ cho bút toán hao",
          ],
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
          accounting:
            "TÍNH CHI PHÍ CÔNG CHẾ TÁC: Nợ 627 (Chi phí sản xuất chung) / Có 334 (Phải trả người lao động — lương thợ đúc theo sản phẩm) hoặc Có 111 (nếu thuê ngoài). Chi phí công sẽ được phân bổ vào giá vốn của SKU ở bước 11.",
          accountingDocs: [
            "Phiếu công chế tác / phiếu chấm công thợ theo sản phẩm (nội bộ)",
            "Kết quả XRF thành phẩm (đính kèm batch-ID)",
            "Phiếu giao công (nếu thuê ngoài) + HĐ GTGT của đối tác gia công\nLàm căn cứ hạch toán chi phí công",
          ],
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
          accounting:
            "TÍNH GIÁ VỐN CHO SKU MỚI: Giá vốn SKU = (Tổng giá mua của batch + chi phí công ở bước 10) / tổng KL ra × KL của SKU. Lưu giá vốn vào SKU để dùng khi bán (Sheet Bán hàng bước 7b). Cập nhật sổ chi tiết 156 theo từng SKU.",
          accountingDocs: [
            "Phiếu nhập kho trưng bày từ xưởng (nội bộ) — ghi từng SKU + giá vốn + link batch-ID",
            "Biên bản quyết toán batch — tổng KL vào, tổng KL ra, hao, danh sách SKU đúc ra, chi phí công\nChứng từ nội bộ kế toán, căn cứ phân bổ giá vốn",
          ],
        },
      ],
    },

    // ============================================================
    // B2B — NHẬP SỈ (bước 1 → 8)
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
          accountingDocs: [
            "Purchase Order (PO) khung — nếu có (có thể Email/Zalo/file chính thức)\nChứng từ quản trị, không phải kế toán chính thức",
          ],
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
          accountingDocs: [
            "PACKING LIST từ NCC có chữ ký 2 bên (NCC + Mi Hồng) — chứng từ pháp lý về số hàng thực nhận",
            "Biên bản lựa chọn — danh sách Mi Hồng chọn + danh sách trả có chữ ký 2 bên + ảnh",
          ],
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
          accountingDocs: [
            "Phiếu cân nội bộ (in tự động)",
            "Kết quả XRF mẫu (đính kèm Session/batch)\nLàm căn cứ cho con số trên HĐ GTGT ở bước 4",
          ],
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
          accounting:
            "KIỂM TRA HĐ GTGT (đây là công việc chính của kế toán ở bước này): • Tra cứu MST NCC trên tracuunnt.gdt.gov.vn — MST còn hoạt động hay không. • Kiểm tra thông tin Mi Hồng trên HĐ đúng chuẩn. • Line item + KL + đơn giá + thành tiền + VAT (thường 10% với vàng trang sức gia công). • Khớp 100% với danh sách Mi Hồng chọn + cân thực tế. • Lệch bất kỳ: trả NCC điều chỉnh HĐ, KHÔNG ký nhận. • Đạt: ghi nhận HĐ vào hệ thống với trạng thái 'chờ hạch toán'.",
          accountingDocs: [
            "HÓA ĐƠN GTGT ĐIỆN TỬ của NCC — CHỨNG TỪ GỐC CHÍNH (lưu ≥ 10 năm theo NĐ 123/2020)",
            "Bản tra cứu MST NCC (screenshot từ tracuunnt.gdt.gov.vn) đính kèm",
            "Biên bản đối chiếu HĐ vs thực tế (nếu có điều chỉnh)",
          ],
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
          accounting:
            "HẠCH TOÁN NHẬP + GHI CÔNG NỢ NCC (auto ngay khi nhập kho): • Bút toán kép: Nợ 156 (Hàng hóa) + Nợ 133 (VAT đầu vào được khấu trừ) / Có 331 (Phải trả NCC).   Nếu thanh toán ngay: Có 112 thay cho 331. • Mở công nợ phải trả NCC theo điều khoản (ngay / 7 ngày / 30 ngày). Aging bucket: 0-30 / 31-60 / 61-90 / >90. • Link bút toán với: HĐ + PO + Batch-ID. • Hệ thống tự nhắc đến hạn thanh toán ở bước 8.",
          accountingDocs: [
            "PHIẾU NHẬP KHO (Mẫu 01-VT theo TT 200) — có chữ ký thủ kho + kế toán + đại diện NCC",
            "Sổ chi tiết công nợ NCC cập nhật (nội bộ)",
            "Phiếu nhập kho link với HĐ GTGT + PO ở bước trước",
          ],
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
          accounting:
            "NẾU CÓ HĐ ĐIỀU CHỈNH (do QC trả hàng): • Bút toán đảo ngược phần hàng trả: Có 156 + Có 133 / Nợ 331 (giảm công nợ) hoặc Nợ 112 (nếu đã trả tiền). • Lưu HĐ điều chỉnh kèm HĐ gốc. • Cập nhật công nợ NCC cho đúng phần hàng giữ lại.",
          accountingDocs: [
            "KHI CÓ REJECT:",
            "BIÊN BẢN TRẢ HÀNG — 2 chữ ký (Mi Hồng + NCC) + ảnh món lỗi",
            "HÓA ĐƠN GTGT ĐIỀU CHỈNH (giảm) từ NCC theo NĐ 123 — chứng từ gốc cho bút toán đảo",
            "Phiếu xuất kho trả hàng\nKHÔNG CÓ REJECT: không phát sinh chứng từ",
          ],
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
          accounting:
            "GIÁ VỐN SKU = đơn giá mua từ HĐ GTGT (bước 4) + phân bổ chi phí nhập nếu có (vận chuyển, kiểm định ngoài). Lưu giá vốn vào SKU — dùng khi bán (Sheet Bán hàng 7b). Chưa phát sinh bút toán mới.",
          accountingDocs: [
            "Tem SKU có QR (dán sản phẩm)",
            "Cập nhật sổ chi tiết 156 theo từng SKU (giá vốn cá thể) — nội bộ kế toán",
          ],
        },
        {
          id: "b2b-8",
          order: "8",
          title: "Thanh toán NCC theo công nợ",
          department: "Kế toán viên + KTT duyệt",
          subtitle: "Tất toán 331 · CK bắt buộc ≥ 20M · KTT ký số duyệt",
          detail:
            "Diễn ra SONG SONG với bước 7 (không block lên kệ). Đến hạn theo điều khoản ở bước 5. Tạo lệnh CK qua Internet Banking. ≥ 20M bắt buộc CK (ND 232/2025). KTT phê duyệt trước khi submit NH.",
          tools: [
            "Internet Banking",
            "Phần mềm kế toán",
            "Chứng thư số KTT",
            "Dashboard công nợ",
          ],
          dataIn: ["Lệnh CK", "Ủy nhiệm chi điện tử", "Mã GD NH"],
          controls: [
            "ND 232/2025: ≥ 20M CK",
            "KTT duyệt trước submit",
            "Trả muộn: mất discount",
          ],
          risks: [
            "CK nhầm NCC / số tiền: verify trước submit",
            "Quên hạch toán: đối chiếu sao kê bắt được",
          ],
          kind: "process",
          shape: "rect",
          accounting:
            "Đây là việc của kế toán: • Kiểm tra HĐ + phiếu nhập + QC (bước 6) — không có vấn đề mới thanh toán. • Tạo lệnh CK trên Internet Banking Mi Hồng → KTT ký số phê duyệt → submit NH. • Sau khi CK thành công: bút toán tất toán công nợ: Nợ 331 (Phải trả NCC) / Có 112 (TGNH). • Lấy ủy nhiệm chi điện tử từ ngân hàng lưu kèm HĐ gốc. • Cập nhật công nợ NCC về 0 cho lô đó. Đánh dấu aging bucket 'đã thanh toán'.",
          accountingDocs: [
            "ỦY NHIỆM CHI ĐIỆN TỬ từ ngân hàng Mi Hồng — CHỨNG TỪ GỐC thanh toán (lưu 10 năm)",
            "Đề nghị thanh toán (nội bộ) có chữ ký KT + KTT duyệt trước khi submit NH",
            "Phiếu chi (nếu thanh toán tiền mặt, rất hiếm với B2B)",
            "Biên bản đối chiếu công nợ định kỳ với NCC (quý/năm)",
          ],
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
          accounting:
            "KIỂM TRA GIÁ VỐN: giá vốn SKU phải được kế thừa chính xác từ bước hạch toán thu mua (F2B 5) hoặc nhập B2B (B2B 5) + chi phí công (F2B Nung 10) nếu có. Kế toán trưởng duyệt cận biên lợi nhuận (không duyệt từng SKU mà duyệt policy). Lệch biên > 5% so với đề xuất → log audit trail để quyết toán.",
          accountingDocs: [
            "Bảng phê duyệt giá bán (nội bộ, có chữ ký/ký số QL duyệt)",
            "Chính sách biên lợi nhuận theo loại hàng (KTT duyệt, lưu làm policy)\nLàm căn cứ đối chiếu khi quyết toán lãi gộp",
          ],
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

    // ============================================================
    // BÁN HÀNG — TỪ KỆ ĐẾN TAY KHÁCH
    // ============================================================
    {
      id: "ban-hang",
      name: "Bán hàng — Từ kệ đến tay khách",
      shortDescription:
        "Tiếp đón → chốt → HĐ GTGT → thanh toán → giao → hạch toán doanh thu → hậu mãi.",
      parentId: "overview",
      lane: null,
      steps: [
        {
          id: "ban-hang-1",
          order: "1",
          title: "Tiếp đón + tư vấn",
          department: "Tư vấn viên",
          subtitle: "Tìm hiểu nhu cầu · gợi ý sản phẩm · ghi CRM",
          detail:
            "Chào khách, tìm hiểu nhu cầu (tặng / đầu tư / cưới hỏi), ngân sách. Gợi ý dòng sản phẩm. Ghi CRM nếu khách đồng ý.",
          tools: ["Tablet tư vấn", "Catalog số", "Màn hình bộ sưu tập"],
          dataIn: ["ID phiên tư vấn", "Nhu cầu", "NV phụ trách", "Thời điểm"],
          controls: ["Không bắt buộc KYC", "NV đào tạo dòng SP + giá"],
          risks: ["KPI: conversion rate tư vấn → bán"],
          kind: "intake",
          shape: "rect",
        },
        {
          id: "ban-hang-2",
          order: "2",
          title: "Chọn SP + quét SKU",
          department: "Tư vấn viên",
          subtitle: "Quét QR/RFID · reserved 15 phút",
          detail:
            "Khách chọn. Quét QR/RFID → pull info SKU. Status 'reserved' giữ chỗ 15 phút.",
          tools: ["Máy quét QR/RFID", "Màn hình hiển thị", "POS"],
          dataIn: [
            "SKU chọn",
            "Status 'reserved' 15 phút",
            "Phiên + NV",
            "Thời điểm giữ",
          ],
          controls: [
            "Reserved không bán cho người khác",
            "Timeout 15p → release",
          ],
          risks: ["Tránh NV giữ chỗ cho người quen"],
          kind: "intake",
          shape: "rect",
        },
        {
          id: "ban-hang-3",
          order: "3",
          title: "Báo giá + chốt giá",
          department: "Hệ thống + tư vấn viên",
          subtitle: "Giá API · time-lock 5-10 phút · giảm giá QL duyệt",
          detail:
            "Giá = (API Mi Hồng × tuổi × KL) + công + đá. Refresh 30s. Đối chiếu SJC. Time-lock 5-10 phút. Giảm giá > ngưỡng → QL duyệt.",
          tools: ["API Mi Hồng + SJC", "Màn hình cho khách", "Tablet POS"],
          dataIn: [
            "Giá niêm yết",
            "Công thức chi tiết",
            "Giảm giá + người duyệt",
            "Giá chốt + lock",
          ],
          controls: [
            "Giảm giá > ngưỡng: QL duyệt",
            "Công thức hiển thị đầy đủ (ND 232/2025 Điều 7a)",
          ],
          risks: ["NV giảm giá tùy tiện → quyền theo cấp"],
          kind: "intake",
          shape: "rect",
          accounting:
            "THEO DÕI GIẢM GIÁ (discount): mỗi lần giảm giá > policy phải có log audit trail + người duyệt. Cuối tháng: tổng discount ghi vào TK 521 (Giảm giá hàng bán) hoặc trừ thẳng doanh thu tùy hạch toán. Báo cáo discount theo nhân viên → input cho KPI.",
          accountingDocs: [
            "Bảng báo giá chi tiết time-lock (in được để khách xem) — minh bạch theo ND 232/2025 Điều 7a",
            "Phiếu phê duyệt giảm giá (nếu có) — chữ ký QL\nLưu làm căn cứ pháp lý nếu khách khiếu nại",
          ],
        },
        {
          id: "ban-hang-4",
          order: "4",
          title: "KYC khách mua",
          department: "Thu ngân",
          subtitle: "≥ 20M BẮT BUỘC CK + CCCD · ≥ 400M CTR",
          detail:
            "≥ 20M/ngày/khách: BẮT BUỘC CK + thu CCCD + TK (ND 232/2025 Điều 4 khoản 10). ≥ 400M: BẮT BUỘC CTR + nghề nghiệp, nguồn tiền. < 20M: optional nhưng khuyến khích cho CRM.",
          tools: ["Đầu đọc NFC", "Tablet KYC", "Tra cứu NAPAS"],
          dataIn: [
            "CCCD (nếu thu)",
            "TK (nếu CK)",
            "Tên TK verify",
            "Flag CTR ≥ 400M",
            "Flag CK ≥ 20M",
          ],
          controls: [
            "ND 232/2025: ≥ 20M CK",
            "PCRT: ≥ 400M CTR",
            "ND 13/2023: bảo vệ DLCN",
          ],
          risks: ["Chia nhỏ né ngưỡng → cảnh báo structuring"],
          kind: "intake",
          shape: "rect",
          accounting:
            "CHUẨN BỊ DATA CHO HĐ GTGT: thông tin khách (CCCD, tên, địa chỉ, MST nếu có) nếu khách yêu cầu HĐ có đủ info. Nếu GD ≥ 400M: flag sẵn để kế toán tổng hợp vào báo cáo CTR cuối kỳ.",
          accountingDocs: [
            "Bản scan CCCD (nếu thu thập cho KYC ≥ 20M) — lưu theo ND 13/2023",
            "Thông tin xuất HĐ GTGT theo yêu cầu khách (nếu có MST công ty → xuất HĐ cho công ty)",
            "Phiếu bổ sung nghề nghiệp + nguồn tiền (nếu ≥ 400M) cho báo cáo CTR",
          ],
        },
        {
          id: "ban-hang-5",
          order: "5",
          title: "Lập hóa đơn GTGT điện tử",
          department: "Thu ngân (auto) + kế toán review",
          subtitle: "HĐ NĐ 123 · ký số · gửi TCT ngay",
          detail:
            "Hệ thống tự sinh HĐ theo NĐ 123/2020. MST Mi Hồng, info khách, chi tiết SKU, VAT. Ký số + gửi khách + TCT.",
          tools: [
            "PM HĐ điện tử",
            "Chứng thư số Mi Hồng",
            "API TCT",
            "Máy in A5",
          ],
          dataIn: [
            "Số HĐ (liên tục)",
            "Mã tra cứu",
            "Line item",
            "Status gửi TCT",
            "Phương thức gửi khách",
          ],
          controls: [
            "NĐ 123: HĐ điện tử, gửi TCT ngay",
            "Chuỗi số liên tục",
            "Lưu ≥ 10 năm",
          ],
          risks: [
            "HĐ sai sau khi khách đi → HĐ điều chỉnh (phức tạp)",
            "HĐ TCT từ chối → cảnh báo",
          ],
          kind: "process",
          shape: "rect",
          accounting:
            "LÀ CÔNG VIỆC CỦA KẾ TOÁN (phối hợp với thu ngân): • Review chuỗi số HĐ cuối ca — đảm bảo liên tục, không nhảy số. • Kiểm tra VAT tính đúng thuế suất (thường 10% với vàng trang sức; 0% với vàng miếng nguyên chất). • Đảm bảo trạng thái 'đã gửi TCT' cho 100% HĐ trong ngày. HĐ fail → xử lý ngay. • KTT duyệt mẫu xác suất hàng tuần.",
          accountingDocs: [
            "HÓA ĐƠN GTGT ĐIỆN TỬ BÁN RA — CHỨNG TỪ GỐC CHÍNH (lưu ≥ 10 năm theo NĐ 123)",
            "Mã tra cứu HĐ gửi khách qua Zalo/email",
            "Biên nhận từ TCT xác nhận đã nhận HĐ (auto qua API)",
            "Bản giấy (nếu khách yêu cầu)",
          ],
        },
        {
          id: "ban-hang-6",
          order: "6",
          title: "Thanh toán",
          department: "Thu ngân",
          subtitle: "TM / VietQR / thẻ POS · ≥ 20M bắt buộc CK",
          detail:
            "TM (chỉ < 20M), VietQR CK, thẻ POS, hoặc mixed. ≥ 20M bắt buộc CK. Khớp tổng = HĐ trước khi đóng GD.",
          tools: ["VietQR", "Máy POS thẻ", "Két TM", "Tablet thu ngân"],
          dataIn: [
            "Phương thức",
            "Từng dòng thanh toán",
            "Mã GD NH (nếu CK)",
            "Auth code (nếu thẻ)",
            "Tổng khớp HĐ",
          ],
          controls: [
            "ND 232/2025: ≥ 20M CK",
            "Khớp tổng bắt buộc trước đóng GD",
          ],
          risks: [
            "CK chưa về trước khi giao: policy giao khi tiền về (API NH xác nhận)",
            "Thẻ: chargeback",
          ],
          kind: "process",
          shape: "rect",
          accounting:
            "THEO DÕI DÒNG TIỀN VÀO: • TM: ghi nhận vào quỹ ngày, cuối ca kiểm quỹ + lập phiếu thu. • CK: chờ API NH báo tiền về (thường realtime với VietQR), link mã GD NH với HĐ bán. • Thẻ: ghi nhận mã authorization, đối chiếu với sao kê thẻ (thường T+1). • Mixed: tracking từng dòng riêng, khớp tổng.",
          accountingDocs: [
            "PHIẾU THU (Mẫu 01-TT) — nếu TM, có chữ ký thu ngân + người nộp",
            "Biên lai VietQR từ ngân hàng (nếu CK) — có mã GD NH",
            "Biên lai POS thẻ (nếu thẻ) — có authorization code",
            "Bảng tổng hợp phương thức thanh toán (nội bộ, khớp tổng HĐ)",
          ],
        },
        {
          id: "ban-hang-7a",
          order: "7a",
          title: "Xuất kho + giao hàng",
          department: "Thủ kho + tư vấn viên",
          subtitle: "RFID đổi 'sold' · phiếu BH + hộp quà",
          detail:
            "RFID đổi status 'sold'. Kèm phiếu bảo hành + hộp quà + thẻ CSKH.",
          tools: ["Đầu đọc RFID", "Máy in phiếu BH", "Hộp quà + túi"],
          dataIn: [
            "Status 'sold'",
            "Timestamp",
            "ID NV giao",
            "Số phiếu BH",
            "Link HĐ",
          ],
          controls: [
            "RFID bắt được trước khi đóng GD",
            "Phiếu BH có SKU + serial",
          ],
          risks: [
            "NV quên đổi status → RFID auto",
            "Trộn SKU giữa khách → xác nhận trên máy quét",
          ],
          kind: "process",
          shape: "rect",
          accountingDocs: [
            "PHIẾU XUẤT KHO (Mẫu 02-VT theo TT 200) — có chữ ký thủ kho + tư vấn viên + khách nhận",
            "PHIẾU BẢO HÀNH — có SKU + thông tin khách + ngày mua + thời hạn BH (2 bản, 1 khách 1 Mi Hồng)",
            "Hộp quà + túi + thẻ CSKH (không phải chứng từ kế toán)",
          ],
        },
        {
          id: "ban-hang-7b",
          order: "7b",
          title: "Hạch toán doanh thu + giá vốn",
          department: "Kế toán viên (auto + review)",
          subtitle: "Auto khi SKU → 'sold' · 511 + 632 · FIFO batch-ID",
          detail:
            "Auto kích hoạt khi SKU chuyển 'sold'. 2 cặp bút toán: doanh thu + giá vốn. Giá vốn theo FIFO batch-ID.",
          tools: [
            "Phần mềm kế toán",
            "Module FIFO batch-ID",
            "Dashboard bút toán",
          ],
          dataIn: [
            "BT doanh thu Nợ 111/112 / Có 511 + 3331",
            "BT giá vốn Nợ 632 / Có 156",
            "COGS SKU (batch-ID)",
            "Lãi gộp từng GD",
          ],
          controls: [
            "Luật KT 2015",
            "TT 200/2014",
            "Phương pháp giá vốn đăng ký với Thuế",
          ],
          risks: ["Batch-ID + FIFO → lãi gộp chính xác từng SKU → KPI NV bán"],
          kind: "process",
          shape: "rect",
          accounting:
            "BÚT TOÁN TỰ ĐỘNG (kế toán review + duyệt, không gõ tay): • Doanh thu: Nợ 111 hoặc 112 (theo phương thức TT ở bước 6) / Có 511 (Doanh thu) + Có 3331 (VAT đầu ra). • Giá vốn: Nợ 632 (Giá vốn hàng bán) / Có 156 (Hàng hóa).   Giá vốn = lấy từ SKU (đã set ở bước hạch toán thu mua/nhập). FIFO theo batch-ID nếu policy FIFO. • Link bút toán: SKU + HĐ bán + mã GD NH + batch-ID nguồn + CCCD khách (nếu có). • Cuối ca kế toán REVIEW. KTT duyệt mẫu xác suất. • SKU không có batch-ID → block hạch toán, cảnh báo.",
          accountingDocs: [
            "Bút toán kép tự sinh trong phần mềm kế toán (không phải chứng từ giấy)",
            "Sổ chi tiết 511 (Doanh thu) + 632 (Giá vốn) cập nhật theo từng GD",
            "Các chứng từ gốc đã có ở bước 5 (HĐ GTGT) + bước 6 (phiếu thu / biên lai CK) + bước 7a (phiếu xuất kho) là căn cứ cho bút toán này",
          ],
        },
        {
          id: "ban-hang-8",
          order: "8",
          title: "Hậu mãi + CRM",
          department: "CSKH",
          subtitle: "Cảm ơn 24h · hỏi cảm nhận 7 ngày · voucher sinh nhật",
          detail:
            "24h: cảm ơn. 7 ngày: hỏi cảm nhận. Trước hạn BH 30 ngày: nhắc kiểm tra miễn phí. Sinh nhật: voucher.",
          tools: ["CRM", "Zalo OA / SMS", "Email marketing"],
          dataIn: ["Timeline từng khách", "Loyalty tier", "LTV", "Preference"],
          controls: [
            "ND 13/2023: quyền rút đồng ý",
            "Không spam > 2-3 tin/tháng",
            "Opt-out rõ",
          ],
          risks: ["CRM tốt = repeat rate cao"],
          kind: "final",
          shape: "rect",
          accounting:
            "NẾU PHÁT SINH: • Bảo hành: chi phí sửa/đổi ghi vào TK 641 (Chi phí bán hàng) hoặc dự phòng nếu nhiều. • Voucher sinh nhật đã dùng: giảm doanh thu khi khách dùng (bút toán giảm 511 + 3331). • Trả hàng hoàn tiền: HĐ điều chỉnh, bút toán đảo ngược doanh thu + giá vốn.",
          accountingDocs: [
            "KHI PHÁT SINH:",
            "Biên bản bảo hành (sửa miễn phí hoặc đổi) có chữ ký khách + kỹ thuật",
            "HĐ GTGT điều chỉnh / hủy (nếu trả hàng) — theo NĐ 123",
            "Phiếu nhập kho hàng trả + phiếu chi hoàn tiền",
            "Voucher + log sử dụng voucher (khi khách dùng, trừ vào doanh thu)",
          ],
        },
      ],
    },
  ],
};
