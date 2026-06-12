import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { App } from "./app";
import { BRAND_NAME } from "@/lib/brand";

// Tiêu đề tab theo thương hiệu của site (index.html giữ tiêu đề trung tính)
document.title = `${BRAND_NAME} — Quy trình thu mua → xử lý → lên kệ`;

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root missing");

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
