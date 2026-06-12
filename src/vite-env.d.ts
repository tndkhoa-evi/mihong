/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Tên thương hiệu hiển thị (mặc định: "Mi Hồng") */
  readonly VITE_BRAND_NAME?: string;
  /** Đường dẫn logo trong public/ hoặc URL (mặc định: "/logo.png") */
  readonly VITE_BRAND_LOGO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
