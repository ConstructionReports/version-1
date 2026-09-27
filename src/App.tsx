import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { SiteLayout } from "./components/SiteLayout";
import { EditTrackerPage } from "./pages/EditTrackerPage";
import { EmployeePage } from "./pages/EmployeePage";
import { ImportExportPage } from "./pages/ImportExportPage";
import { LandingPage } from "./pages/LandingPage";
import { NewEmployeePage } from "./pages/NewEmployeePage";
import { NewTrackerPage } from "./pages/NewTrackerPage";
import { PeoplePage } from "./pages/PeoplePage";
import { TrackerPage } from "./pages/TrackerPage";
import { TrackersPage } from "./pages/TrackersPage";

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
          <Route index element={<TrackersPage />} />
          <Route path="trackers/new" element={<NewTrackerPage />} />
          <Route path="trackers/:trackerId/edit" element={<EditTrackerPage />} />
          <Route path="trackers/:trackerId" element={<TrackerPage />} />
          <Route path="people" element={<PeoplePage />} />
          <Route path="people/new" element={<NewEmployeePage />} />
          <Route path="people/:employeeId" element={<EmployeePage />} />
          <Route path="import-export" element={<ImportExportPage />} />
          <Route path="reports/*" element={<Navigate to="/app" replace />} />
          <Route path="projects/*" element={<Navigate to="/app" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
