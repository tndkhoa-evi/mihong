import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  Monitor,
  Printer,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { AppHeader } from "./app-header";
import { Breadcrumb, type Crumb } from "./breadcrumb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  crumbs: Crumb[];
  canBack?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  canZoom?: boolean;
  onTogglePresent?: () => void;
  isPresenting?: boolean;
  onPrint?: () => void;
  hidden?: boolean;
}

export function PresentationToolbar({
  crumbs,
  canBack,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  canZoom,
  onTogglePresent,
  isPresenting,
  onPrint,
  hidden,
}: ToolbarProps) {
  const navigate = useNavigate();
  const { isFullscreen, toggle } = useFullscreen();

  return (
    <motion.header
      animate={{ y: hidden ? "-100%" : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-40 w-full border-b border-ink-subtle/20 bg-bg-panel/90 backdrop-blur",
        "print:hidden",
      )}
    >
      <div className="flex items-center gap-4 px-5 h-14">
        <AppHeader />
        <div className="hidden md:block h-6 w-px bg-ink-subtle/30" />
        <div className="flex-1 min-w-0 overflow-hidden">
          <Breadcrumb items={crumbs} />
        </div>

        <div className="flex items-center gap-1">
          {canZoom && (
            <div className="hidden md:flex items-center gap-0.5 mr-2 pr-2 border-r border-ink-subtle/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomOut}
                aria-label="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomReset}
                aria-label="Reset"
              >
                <span className="text-xs font-semibold">100%</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomIn}
                aria-label="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          )}

          {onPrint && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrint}
              aria-label="Xuất PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden lg:inline">Xuất PDF</span>
            </Button>
          )}

          {onTogglePresent && (
            <Button
              variant={isPresenting ? "primary" : "ghost"}
              size="sm"
              onClick={onTogglePresent}
              aria-label="Trình chiếu"
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden lg:inline">Trình chiếu</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            aria-label="Toàn màn hình"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>

          {canBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Quay lại</span>
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
