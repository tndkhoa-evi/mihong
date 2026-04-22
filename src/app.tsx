import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "./routes";
import { assertDataIntegrity } from "@/data/validate";

function GlobalEscHandler() {
  const navigate = useNavigate();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (window.location.pathname !== "/") navigate(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);
  return null;
}

export function App() {
  useEffect(() => {
    if (import.meta.env.DEV) assertDataIntegrity();
  }, []);

  return (
    <>
      <GlobalEscHandler />
      <AppRoutes />
    </>
  );
}
