import { useMemo, useState, type FormEvent } from "react";
import { emptyJob } from "../lib/defaults";
import { employeeName, newId } from "../lib/format";
import { listEmployees, saveJob } from "../lib/storage";
import type { Job } from "../types";

type Props = {
  onSaved: (job: Job) => void;
};

export function JobForm({ onSaved }: Props) {
  const employees = useMemo(() => listEmployees(), []);
  const [job, setJob] = useState<Job>(() => emptyJob());
  const [error, setError] = useState("");

  function patch(partial: Partial<Job>) {
    setJob((current) => ({ ...current, ...partial }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!job.name.trim() || !job.number.trim()) {
      setError("Job name and number are required.");
      return;
    }
    const next = { ...job, id: newId("job") };
    saveJob(next);
    onSaved(next);
  }

  return (
    <form className="panel" onSubmit={submit}>
      <h3>New job</h3>
      {error ? <p className="status punch">{error}</p> : null}
      <div className="form-grid">
        <div>
          <label htmlFor="jname">Job name</label>
          <input id="jname" value={job.name} onChange={(event) => patch({ name: event.target.value })} />
        </div>
        <div>
          <label htmlFor="jnum">Job number</label>
          <input id="jnum" value={job.number} onChange={(event) => patch({ number: event.target.value })} />
        </div>
        <div>
          <label htmlFor="addr">Street</label>
          <input id="addr" value={job.address} onChange={(event) => patch({ address: event.target.value })} />
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input id="city" value={job.city} onChange={(event) => patch({ city: event.target.value })} />
        </div>
        <div>
          <label htmlFor="client">Client</label>
          <input id="client" value={job.client} onChange={(event) => patch({ client: event.target.value })} />
        </div>
        <div>
          <label htmlFor="super">Superintendent</label>
          <select
            id="super"
            value={job.superintendentId}
            onChange={(event) => patch({ superintendentId: event.target.value })}
          >
            <option value="">—</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employeeName(employee)}
              </option>
            ))}
          </select>
        </div>
        <div className="wide">
          <label htmlFor="jdesc">Description</label>
          <textarea id="jdesc" value={job.description} onChange={(event) => patch({ description: event.target.value })} />
        </div>
      </div>
      <div className="actions" style={{ marginTop: 12 }}>
        <button className="btn" type="submit">
          Save job
        </button>
      </div>
    </form>
  );
}
