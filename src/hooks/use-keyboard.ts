import { useEffect } from "react";

interface Handlers {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  onEscape?: () => void;
  onTogglePresent?: () => void;
}

export function useKeyboard(h: Handlers) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;

      if ((e.key === "+" || e.key === "=") && h.onZoomIn) {
        e.preventDefault();
        h.onZoomIn();
      } else if (e.key === "-" && h.onZoomOut) {
        e.preventDefault();
        h.onZoomOut();
      } else if (e.key === "0" && h.onZoomReset) {
        e.preventDefault();
        h.onZoomReset();
      } else if (e.key === "Escape" && h.onEscape) {
        h.onEscape();
      } else if (e.key.toLowerCase() === "p" && h.onTogglePresent) {
        h.onTogglePresent();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [h]);
}
