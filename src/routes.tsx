import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { OverviewPage } from "@/pages/overview-page";
import { LanePage } from "@/pages/lane-page";

/**
 * Route key excludes stepId so opening/closing the detail panel
 * within the same flow does not remount LanePage.
 */
function routeKey(pathname: string): string {
  const m = pathname.match(/^\/flow\/([^/]+)/);
  if (m) return `flow-${m[1]}`;
  return pathname;
}

export function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence initial={false}>
      <Routes location={location} key={routeKey(location.pathname)}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/flow/:flowId" element={<LanePage />} />
        <Route path="/flow/:flowId/step/:stepId" element={<LanePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
