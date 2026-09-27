import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { crewTotal, formatDate } from "../lib/format";
import { filterReportsByQuery } from "../lib/search";
import { getProject, listReports } from "../lib/storage";

export function ReportsPage() {
  const [query, setQuery] = useState("");
  const reports = listReports();

  const filtered = useMemo(
    () => filterReportsByQuery(reports, query, getProject),
    [query, reports],
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="kicker">Log</p>
          <h2>All reports</h2>
        </div>
        <Link className="btn" to="/app/reports/new">
          New daily report
        </Link>
      </div>

      <div className="search">
        <input
          aria-label="Search reports"
          placeholder="Search job, author, work, delays, safety, or notes"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty">No reports match that search.</div>
      ) : (
        <div className="panel">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Job</th>
                <th>Crew</th>
                <th>Status</th>
                <th>Work</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((report) => {
                const project = getProject(report.projectId);
                return (
                  <tr key={report.id}>
                    <td>
                      <Link to={`/app/reports/${report.id}`}>{formatDate(report.date)}</Link>
                      <div className="meta">{report.author}</div>
                    </td>
                    <td>
                      {project?.name}
                      <div className="meta">{project?.number}</div>
                    </td>
                    <td>{crewTotal(report.crew)}</td>
                    <td>
                      <span className={`status ${report.status}`}>{report.status}</span>
                    </td>
                    <td>{report.workCompleted.slice(0, 110)}{report.workCompleted.length > 110 ? "…" : ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
