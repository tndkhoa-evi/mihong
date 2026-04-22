import { useCallback, useState } from "react";

const MIN = 0.5;
const MAX = 2;
const STEP = 0.1;

export function useZoomPan() {
  const [zoom, setZoom] = useState(1);

  const zoomIn = useCallback(
    () => setZoom((z) => Math.min(MAX, +(z + STEP).toFixed(2))),
    [],
  );
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(MIN, +(z - STEP).toFixed(2))),
    [],
  );
  const reset = useCallback(() => setZoom(1), []);

  return { zoom, zoomIn, zoomOut, reset };
}
