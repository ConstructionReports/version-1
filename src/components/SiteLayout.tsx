import { NavLink, Outlet } from "react-router-dom";

export function SiteLayout() {
  return (
    <>
      <header className="site-header">
        <NavLink className="brand" to="/">
          <span className="mark">C</span>
          Construction Reports
        </NavLink>
        <nav className="nav" aria-label="Primary">
          <NavLink to="/app">Job Trackers</NavLink>
          <NavLink to="/app/import-export">Import / Export</NavLink>
          <a href="#product">Product</a>
        </nav>
        <NavLink className="btn" to="/app">
          Open the book
        </NavLink>
      </header>
      <Outlet />
      <footer className="site-footer">
        <div>Construction Reports · Version 1</div>
        <div>Small-team construction management. Track, sign, export.</div>
      </footer>
    </>
  );
}
