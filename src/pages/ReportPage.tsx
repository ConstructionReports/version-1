import { Link, useNavigate, useParams } from "react-router-dom";
import { crewTotal, formatDate } from "../lib/format";
import { deleteReport, getProject, getReport } from "../lib/storage";

export function ReportPage() {
  const { reportId = "" } = useParams();
  const navigate = useNavigate();
  const report = getReport(reportId);
  const project = report ? getProject(report.projectId) : undefined;

  if (!report || !project) {
    return (
      <div className="empty">
        Report not found. <Link to="/app/reports">Back to the log</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head no-print">
        <div>
          <p className="kicker">Daily report</p>
          <h2>{project.name}</h2>
          <p className="muted">{formatDate(report.date)}</p>
        </div>
        <div className="actions">
          <Link className="btn secondary" to={`/app/reports/${report.id}/edit`}>
            Edit
          </Link>
          <button className="btn secondary" type="button" onClick={() => window.print()}>
            Print
          </button>
          <button
            className="btn danger"
            type="button"
            onClick={() => {
              deleteReport(report.id);
              navigate(`/app/projects/${project.id}`);
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <article className="report-sheet">
        <header className="page-head">
          <div>
            <div className="meta">{project.number}</div>
            <h3>{project.name}</h3>
            <p className="muted">
              {project.address}, {project.city}, {project.state}
            </p>
          </div>
          <span className={`status ${report.status}`}>{report.status}</span>
        </header>

        <div className="report-grid">
          <div>
            <div className="meta">Date</div>
            <p>{formatDate(report.date)}</p>
          </div>
          <div>
            <div className="meta">Superintendent</div>
            <p>{report.author}</p>
          </div>
          <div>
            <div className="meta">Weather</div>
            <p>
              {report.weather.condition} · {report.weather.highF}° / {report.weather.lowF}°
            </p>
          </div>
          <div>
            <div className="meta">Crew on site</div>
            <p>{crewTotal(report.crew)}</p>
          </div>
        </div>

        <h3>Trades</h3>
        <ul className="list">
          {report.crew.map((row) => (
            <li key={row.trade}>
              {row.trade}: {row.count}
            </li>
          ))}
        </ul>

        <h3>Work in place</h3>
        <p>{report.workCompleted || "—"}</p>
        <h3>Delays</h3>
        <p>{report.delays || "None recorded."}</p>
        <h3>Safety</h3>
        <p>{report.safety || "—"}</p>
        <h3>Materials</h3>
        <p>{report.materials || "—"}</p>
        <h3>Visitors</h3>
        <p>{report.visitors || "None."}</p>
        <h3>Notes</h3>
        <p>{report.notes || "—"}</p>
      </article>
    </div>
  );
}
