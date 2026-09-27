import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { JobForm } from "../components/JobForm";
import { crewHeads, employeeName, formatDate } from "../lib/format";
import { getEmployee, getJob, listJobs, listTrackers } from "../lib/storage";

export function TrackersPage() {
  const [query, setQuery] = useState("");
  const [addingJob, setAddingJob] = useState(false);
  const [jobs, setJobs] = useState(() => listJobs());
  const trackers = listTrackers();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return trackers;
    return trackers.filter((tracker) => {
      const job = getJob(tracker.jobId);
      return [job?.name, job?.number, tracker.workCompleted, tracker.preparedByName, tracker.status]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [query, trackers]);

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="kicker">Job Trackers</p>
          <h2>The book for every job and day</h2>
          <p className="muted">
            {jobs.length} jobs · {trackers.length} trackers. Switch manager in the header to collaborate.
          </p>
        </div>
        <div className="actions">
          <button className="btn secondary" type="button" onClick={() => setAddingJob((value) => !value)}>
            New job
          </button>
          <Link className="btn" to="/app/trackers/new">
            New tracker
          </Link>
        </div>
      </div>

      {addingJob ? (
        <JobForm
          onSaved={(job) => {
            setJobs(listJobs());
            setAddingJob(false);
            window.location.assign(`/app/trackers/new?job=${job.id}`);
          }}
        />
      ) : null}

      <div className="projects" style={{ marginBottom: 22 }}>
        {jobs.map((job) => {
          const superName = employeeName(getEmployee(job.superintendentId));
          const latest = trackers.find((tracker) => tracker.jobId === job.id);
          return (
            <article className="card" key={job.id}>
              <div className="meta">{job.number}</div>
              <h3>{job.name}</h3>
              <p className="muted">
                {job.city}, {job.state} · {superName}
              </p>
              <p>
                <span className={`status ${job.status}`}>{job.status}</span>
              </p>
              <p className="meta">
                {latest ? `Last tracker ${formatDate(latest.date)} · ${latest.status}` : "No trackers yet"}
              </p>
              <Link className="btn secondary" to={`/app/trackers/new?job=${job.id}`}>
                File tracker
              </Link>
            </article>
          );
        })}
      </div>

      <div className="search">
        <input
          aria-label="Search trackers"
          placeholder="Search job, work, or author"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty">No trackers match.</div>
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
              {filtered.map((tracker) => {
                const job = getJob(tracker.jobId);
                return (
                  <tr key={tracker.id}>
                    <td>
                      <Link to={`/app/trackers/${tracker.id}`}>{formatDate(tracker.date)}</Link>
                      <div className="meta">{tracker.preparedByName}</div>
                    </td>
                    <td>
                      {job?.name}
                      <div className="meta">{job?.number}</div>
                    </td>
                    <td>{crewHeads(tracker.crew)}</td>
                    <td>
                      <span className={`status ${tracker.status}`}>{tracker.status}</span>
                    </td>
                    <td>
                      {tracker.workCompleted.slice(0, 110)}
                      {tracker.workCompleted.length > 110 ? "…" : ""}
                    </td>
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
