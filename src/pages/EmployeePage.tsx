import { Link, useParams } from "react-router-dom";
import { EmployeeForm } from "../components/EmployeeForm";
import { employeeName, formatDate } from "../lib/format";
import { getEmployee, getJob, listJobs, listTrackers } from "../lib/storage";

export function EmployeePage() {
  const { employeeId = "" } = useParams();
  const employee = getEmployee(employeeId);
  const jobs = listJobs().filter((job) => job.assignedEmployeeIds.includes(employeeId));
  const trackers = listTrackers().filter((tracker) => tracker.assignedEmployeeIds.includes(employeeId));

  if (!employee) {
    return (
      <div className="empty">
        Profile not found. <Link to="/app/people">Back to People</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="kicker">{employee.employeeNumber}</p>
          <h2>{employeeName(employee)}</h2>
          <p className="muted">
            {employee.role} · {employee.trade} · {employee.phone}
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 22 }}>
        <article className="card">
          <h3>Assigned jobs</h3>
          {jobs.length === 0 ? <p className="muted">Not on a job yet.</p> : null}
          <ul className="list">
            {jobs.map((job) => (
              <li key={job.id}>
                {job.number} · {job.name}
              </li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h3>Tracker history</h3>
          {trackers.length === 0 ? <p className="muted">No tracker assignments.</p> : null}
          <ul className="list">
            {trackers.map((tracker) => (
              <li key={tracker.id}>
                <Link to={`/app/trackers/${tracker.id}`}>
                  {formatDate(tracker.date)} · {getJob(tracker.jobId)?.number}
                </Link>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <EmployeeForm initial={employee} />
    </div>
  );
}
