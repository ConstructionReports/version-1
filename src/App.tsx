import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { SiteLayout } from "./components/SiteLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { EditReportPage } from "./pages/EditReportPage";
import { LandingPage } from "./pages/LandingPage";
import { NewReportPage } from "./pages/NewReportPage";
import { ProjectPage } from "./pages/ProjectPage";
import { ReportPage } from "./pages/ReportPage";
import { ReportsPage } from "./pages/ReportsPage";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
        <Route path="/app" element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="reports/new" element={<NewReportPage />} />
          <Route path="reports/:reportId/edit" element={<EditReportPage />} />
          <Route path="reports/:reportId" element={<ReportPage />} />
          <Route path="projects/:projectId" element={<ProjectPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
