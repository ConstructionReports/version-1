import { NavLink, Outlet } from "react-router-dom";
import { resetStore } from "../lib/storage";
import { useManager } from "../lib/useManager";

export function AppShell() {
  const { manager, managers, switchManager } = useManager();

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <NavLink className="brand" to="/">
          <span className="mark">C</span>
          Construction Reports
        </NavLink>
        <div className="actions">
          <label className="manager-switch">
            <span className="meta">Manager</span>
            <select
              aria-label="Current manager"
              value={manager.id}
              onChange={(event) => switchManager(event.target.value)}
            >
              {managers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <NavLink className="btn" to="/app/trackers/new">
            New tracker
          </NavLink>
        </div>
      </header>
      <div className="app-frame">
        <aside className="sidebar">
          <NavLink end to="/app">
            Job Trackers
          </NavLink>
          <NavLink to="/app/people">People</NavLink>
          <NavLink to="/app/import-export">Import / Export</NavLink>
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
