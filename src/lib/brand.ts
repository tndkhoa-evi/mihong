/**
 * Cấu hình thương hiệu qua biến môi trường — cho phép deploy nhiều site
 * (Mi Hồng, Cửa hàng vàng, …) từ cùng một repo, chỉ khác tên + logo.
 *
 * Netlify: đặt VITE_BRAND_NAME / VITE_BRAND_LOGO trong Site settings → Environment variables.
 * Local: tạo file .env.<mode> và chạy `npm run dev -- --mode <mode>`.
 */

/** Tên thương hiệu gốc dùng trong nội dung dữ liệu (process.ts / reference.ts) */
const SOURCE_BRAND = "Mi Hồng";

export const BRAND_NAME: string =
  import.meta.env.VITE_BRAND_NAME || SOURCE_BRAND;

export const BRAND_LOGO: string =
  import.meta.env.VITE_BRAND_LOGO || "/logo.png";

/** Tiêu đề tài liệu khi in / xuất PDF */
export const BRAND_DOC_TITLE = `${BRAND_NAME} — quy trình`;

/** Thay mọi "Mi Hồng" trong một chuỗi bằng tên thương hiệu hiện tại */
export function brandText(text: string): string {
  return text.split(SOURCE_BRAND).join(BRAND_NAME);
}

function deepReplace(value: unknown): unknown {
  if (typeof value === "string") return brandText(value);
  if (Array.isArray(value)) return value.map(deepReplace);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, deepReplace(v)]),
    );
  }
  return value;
}

/**
 * Deep-replace tên thương hiệu trong toàn bộ chuỗi của một cấu trúc dữ liệu.
 * Trả về chính object gốc khi brand không đổi (zero-cost cho site Mi Hồng).
 */
export function withBrand<T>(data: T): T {
  if (BRAND_NAME === SOURCE_BRAND) return data;
  return deepReplace(data) as T;
}
