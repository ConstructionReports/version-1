import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CommentThread } from "../components/CommentThread";
import { crewHeads, crewHours, employeeName, formatDate } from "../lib/format";
import { deleteTracker, getEmployee, getJob, getTracker } from "../lib/storage";
import { useManager } from "../lib/useManager";

export function TrackerPage() {
  const { trackerId = "" } = useParams();
  const navigate = useNavigate();
  const { manager } = useManager();
  const [, setTick] = useState(0);
  const tracker = getTracker(trackerId);
  const job = tracker ? getJob(tracker.jobId) : undefined;

  if (!tracker || !job) {
    return (
      <div className="empty">
        Tracker not found. <Link to="/app">Back to Job Trackers</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head no-print">
        <div>
          <p className="kicker">Job tracker</p>
          <h2>{job.name}</h2>
          <p className="muted">
            {job.number} · {formatDate(tracker.date)} · {tracker.arrivalAt || "—"}–{tracker.departureAt || "—"}
          </p>
        </div>
        <div className="actions">
          <Link className="btn secondary" to={`/app/trackers/${tracker.id}/edit`}>
            Edit
          </Link>
          <button className="btn secondary" type="button" onClick={() => window.print()}>
            Print
          </button>
          <button
            className="btn danger"
            type="button"
            onClick={() => {
              deleteTracker(tracker.id);
              navigate("/app");
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <article className="report-sheet">
        <header className="page-head">
          <div>
            <div className="meta">{job.number}</div>
            <h3>{job.name}</h3>
            <p className="muted">
              {job.address}, {job.city}, {job.state} {job.postalCode}
            </p>
            <p className="muted">{job.description}</p>
          </div>
          <span className={`status ${tracker.status}`}>{tracker.status}</span>
        </header>

        <div className="report-grid">
          <div>
            <div className="meta">Prepared by</div>
            <p>
              {tracker.preparedByName} · {tracker.preparedByRole}
            </p>
          </div>
          <div>
            <div className="meta">Weather</div>
            <p>
              {tracker.weather.condition} · {tracker.weather.highF}° / {tracker.weather.lowF}°
            </p>
          </div>
          <div>
            <div className="meta">Crew</div>
            <p>
              {crewHeads(tracker.crew)} heads · {crewHours(tracker.crew)} man-hours
            </p>
          </div>
          <div>
            <div className="meta">Assigned profiles</div>
            <p>
              {tracker.assignedEmployeeIds.map((id) => employeeName(getEmployee(id))).join(", ") || "—"}
            </p>
          </div>
        </div>

        <h3>Work completed</h3>
        <p>{tracker.workCompleted || "—"}</p>
        <h3>Planned tomorrow</h3>
        <p>{tracker.workPlanned || "—"}</p>

        <h3>Safety / non-standard compliance</h3>
        <p>Incidents: {tracker.incidents ? "Yes" : "None"} · PPE: {tracker.ppeVerified ? "Verified" : "Not marked"}</p>
        <p>{tracker.safetyNotes || "—"}</p>
        {tracker.safetyItems.length ? (
          <ul className="list">
            {tracker.safetyItems.map((item) => (
              <li key={item.id}>
                {item.label} — {item.observed ? "observed" : "not observed"} {item.notes}
              </li>
            ))}
          </ul>
        ) : null}

        <h3>Delays</h3>
        <p>
          {tracker.delay
            ? `${tracker.delayType || "delay"} · ${tracker.delayHours} hrs — ${tracker.delayNotes}`
            : "None recorded."}
        </p>

        <h3>Crew</h3>
        <ul className="list">
          {tracker.crew.map((row) => (
            <li key={row.id}>
              {row.trade}: {row.count} × {row.hours}h
              {row.employeeId ? ` · ${employeeName(getEmployee(row.employeeId))}` : ""}
            </li>
          ))}
        </ul>

        {tracker.visitors.length ? (
          <>
            <h3>Visitors</h3>
            <ul className="list">
              {tracker.visitors.map((row) => (
                <li key={row.id}>
                  {row.name} ({row.company}) — {row.purpose}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <h3>Notes</h3>
        <p>{tracker.notes || "—"}</p>

        <section className="signature-block">
          <h3>E-signature</h3>
          {tracker.signature.status === "signed" ? (
            <>
              <p>
                {tracker.signature.signerName}, {tracker.signature.signerRole}
              </p>
              <p className="meta">
                {tracker.signature.signedAt ? new Date(tracker.signature.signedAt).toLocaleString() : ""} ·{" "}
                {tracker.signature.method}
              </p>
              {tracker.signature.imageDataUrl ? (
                <img alt="Signature" src={tracker.signature.imageDataUrl} className="signature-image" />
              ) : (
                <p className="serif" style={{ fontSize: 28 }}>
                  {tracker.signature.typedName}
                </p>
              )}
              <p className="meta">{tracker.signature.intentStatement}</p>
            </>
          ) : (
            <p className="muted">Not signed. Open Edit to use the signature pad.</p>
          )}
        </section>
      </article>

      <div className="no-print" style={{ marginTop: 18 }}>
        <CommentThread
          trackerId={tracker.id}
          comments={tracker.comments}
          manager={manager}
          onAdded={() => setTick((value) => value + 1)}
        />
      </div>
    </div>
  );
}
