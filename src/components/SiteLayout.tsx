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
          <a href="#product">Product</a>
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <NavLink className="btn" to="/app">
          Open the log
        </NavLink>
      </header>
      <Outlet />
      <footer className="site-footer">
        <div>Construction Reports · Version 1</div>
        <div>Built for supers who still write the day down.</div>
      </footer>
    </>
  );
}
