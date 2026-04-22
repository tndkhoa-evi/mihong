import type { ReactNode } from "react";

interface ZoomContainerProps {
  zoom: number;
  children: ReactNode;
}

export function ZoomContainer({ zoom, children }: ZoomContainerProps) {
  return (
    <div className="w-full overflow-auto">
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
          transition: "transform 180ms ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}
