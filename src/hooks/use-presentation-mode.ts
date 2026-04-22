import { useCallback, useEffect, useRef, useState } from "react";

const IDLE_MS = 2500;

export function usePresentationMode() {
  const [isPresenting, setIsPresenting] = useState(false);
  const [toolbarHidden, setToolbarHidden] = useState(false);
  const timerRef = useRef<number | null>(null);

  const toggle = useCallback(() => {
    setIsPresenting((v) => !v);
    setToolbarHidden(false);
  }, []);

  useEffect(() => {
    if (!isPresenting) {
      setToolbarHidden(false);
      return;
    }
    const resetTimer = () => {
      setToolbarHidden(false);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(
        () => setToolbarHidden(true),
        IDLE_MS,
      );
    };
    resetTimer();
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [isPresenting]);

  return { isPresenting, toolbarHidden, toggle };
}
