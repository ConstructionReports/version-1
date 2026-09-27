import { NavLink, Outlet } from "react-router-dom";
import { resetStore } from "../lib/storage";

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="app-topbar">
        <NavLink className="brand" to="/">
          <span className="mark">C</span>
          Construction Reports
        </NavLink>
        <NavLink className="btn" to="/app/reports/new">
          New daily report
        </NavLink>
      </header>
      <div className="app-frame">
        <aside className="sidebar">
          <NavLink end to="/app">
            Board
          </NavLink>
          <NavLink to="/app/reports">All reports</NavLink>
          <NavLink to="/app/reports/new">File a report</NavLink>
          <button
            className="linkish"
            type="button"
            onClick={() => {
              resetStore();
              window.location.assign("/app");
            }}
          >
            Reset demo data
          </button>
        </aside>
        <main id="main" className="workspace">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
