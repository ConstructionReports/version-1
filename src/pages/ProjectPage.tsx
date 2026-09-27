import { Link, useParams } from "react-router-dom";
import { crewTotal, formatDate } from "../lib/format";
import { getProject, listReportsForProject } from "../lib/storage";

export function ProjectPage() {
  const { projectId = "" } = useParams();
  const project = getProject(projectId);
  const reports = listReportsForProject(projectId);

  if (!project) {
    return (
      <div className="empty">
        That job is not in the book. <Link to="/app">Back to the board</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="kicker">{project.number}</p>
          <h2>{project.name}</h2>
          <p className="muted">
            {project.address}, {project.city}, {project.state} · {project.client}
          </p>
          <p>
            <span className={`status ${project.status}`}>{project.status}</span>
            <span className="meta"> · Super: {project.superintendent}</span>
          </p>
        </div>
        <Link className="btn" to={`/app/reports/new?project=${project.id}`}>
          File a report
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="empty">No reports on this job yet.</div>
      ) : (
        <div className="panel">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weather</th>
                <th>Crew</th>
                <th>Status</th>
                <th>Work in place</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <Link to={`/app/reports/${report.id}`}>{formatDate(report.date)}</Link>
                  </td>
                  <td>
                    {report.weather.condition}
                    <div className="meta">
                      {report.weather.highF}° / {report.weather.lowF}°
                    </div>
                  </td>
                  <td>{crewTotal(report.crew)}</td>
                  <td>
                    <span className={`status ${report.status}`}>{report.status}</span>
                  </td>
                  <td>{report.workCompleted.slice(0, 140)}{report.workCompleted.length > 140 ? "…" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
