import { Link } from "react-router-dom";
import { employeeName, formatShortDate } from "../lib/format";
import { listEmployees, listJobs, listTrackers } from "../lib/storage";

export function PeoplePage() {
  const people = listEmployees();
  const jobs = listJobs();
  const trackers = listTrackers();

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="kicker">People</p>
          <h2>Employee profiles</h2>
          <p className="muted">Assign these records onto Job Trackers for crew and analysis.</p>
        </div>
        <Link className="btn" to="/app/people/new">
          Add profile
        </Link>
      </div>
      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Trade / role</th>
              <th>Phone</th>
              <th>Jobs</th>
              <th>Trackers</th>
            </tr>
          </thead>
          <tbody>
            {people.map((employee) => {
              const onJobs = jobs.filter((job) => job.assignedEmployeeIds.includes(employee.id)).length;
              const onTrackers = trackers.filter((tracker) => tracker.assignedEmployeeIds.includes(employee.id)).length;
              return (
                <tr key={employee.id}>
                  <td>
                    <Link to={`/app/people/${employee.id}`}>{employeeName(employee)}</Link>
                    <div className="meta">
                      {employee.employeeNumber} · hired {formatShortDate(employee.hireDate)}
                    </div>
                  </td>
                  <td>
                    {employee.trade}
                    <div className="meta">{employee.role}</div>
                  </td>
                  <td>{employee.phone}</td>
                  <td>{onJobs}</td>
                  <td>{onTrackers}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
