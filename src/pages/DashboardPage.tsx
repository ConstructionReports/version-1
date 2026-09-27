import { Link } from "react-router-dom";
import { crewTotal, formatShortDate } from "../lib/format";
import { listProjects, listReports } from "../lib/storage";

export function DashboardPage() {
  const projects = listProjects();
  const reports = listReports();
  const submitted = reports.filter((report) => report.status === "submitted").length;
  const drafts = reports.filter((report) => report.status === "draft").length;
  const heads = reports[0] ? crewTotal(reports[0].crew) : 0;

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="kicker">Board</p>
          <h2>Jobs in the book</h2>
          <p className="muted">Southwest sample set. Open a job or file a new daily.</p>
        </div>
        <Link className="btn" to="/app/reports/new">
          New daily report
        </Link>
      </div>

      <div className="stats">
        <article className="card">
          <span className="stat-num">{projects.length}</span>
          Open projects
        </article>
        <article className="card">
          <span className="stat-num">{submitted}</span>
          Submitted reports
          <div className="meta">{drafts} draft{drafts === 1 ? "" : "s"} still open</div>
        </article>
        <article className="card">
          <span className="stat-num">{reports.length}</span>
          Reports on file
        </article>
        <article className="card">
          <span className="stat-num">{heads}</span>
          Latest crew count
        </article>
      </div>

      <div className="projects" style={{ marginTop: 22 }}>
        {projects.map((project) => {
          const latest = reports.find((report) => report.projectId === project.id);
          return (
            <Link className="card" key={project.id} to={`/app/projects/${project.id}`}>
              <div className="meta">{project.number}</div>
              <h3>{project.name}</h3>
              <p className="muted">
                {project.city}, {project.state} · {project.superintendent}
              </p>
              <p>
                <span className={`status ${project.status}`}>{project.status}</span>
              </p>
              <p className="meta">
                {latest
                  ? `Last report ${formatShortDate(latest.date)} · ${latest.status}`
                  : "No reports yet"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
