import { useMemo, useState, type FormEvent } from "react";
import {
  emptyCrew,
  emptyEquipment,
  emptyInspection,
  emptyJob,
  emptyMaterial,
  emptySafetyItem,
  emptyTracker,
  emptyVisitor,
} from "../lib/defaults";
import { employeeName, newId } from "../lib/format";
import { getJob, listEmployees, listJobs, saveTracker } from "../lib/storage";
import type { JobTracker, Manager, TrackerStatus } from "../types";
import { SignaturePad } from "./SignaturePad";

type Props = {
  initial?: JobTracker;
  presetJobId?: string;
  manager: Manager;
};

export function TrackerForm({ initial, presetJobId, manager }: Props) {
  const jobs = useMemo(() => listJobs(), []);
  const employees = useMemo(() => listEmployees().filter((employee) => employee.assignable), []);
  const startingJob = getJob(initial?.jobId ?? presetJobId ?? jobs[0]?.id ?? "");
  const [tracker, setTracker] = useState<JobTracker>(() => {
    if (initial) return structuredClone(initial);
    return emptyTracker(
      startingJob ?? jobs[0] ?? { ...emptyJob(), id: "none", name: "No job yet", number: "—" },
      manager.id,
      manager.name,
      manager.role.replace("_", " "),
    );
  });
  const [error, setError] = useState("");

  function patch(partial: Partial<JobTracker>) {
    setTracker((current) => ({ ...current, ...partial }));
  }

  function persist(status: TrackerStatus) {
    if (!tracker.jobId) {
      setError("Choose a job.");
      return;
    }
    if (!tracker.workCompleted.trim()) {
      setError("Write the job work for this date.");
      return;
    }
    const next: JobTracker = {
      ...tracker,
      id: tracker.id || newId("trk"),
      status: tracker.signature.status === "signed" ? "signed" : status,
      updatedByManagerId: manager.id,
      updatedAt: new Date().toISOString(),
      createdAt: tracker.createdAt || new Date().toISOString(),
      createdByManagerId: tracker.createdByManagerId || manager.id,
      crew: tracker.crew.filter((row) => row.trade || row.employeeId),
      visitors: tracker.visitors.filter((row) => row.name),
      equipment: tracker.equipment.filter((row) => row.name),
      materials: tracker.materials.filter((row) => row.item),
      inspections: tracker.inspections.filter((row) => row.type),
      safetyItems: tracker.safetyItems.filter((row) => row.label),
    };
    saveTracker(next);
    window.location.assign(`/app/trackers/${next.id}`);
  }

  function onJobChange(jobId: string) {
    const job = getJob(jobId);
    patch({
      jobId,
      jobDescription: job?.description || tracker.jobDescription,
      assignedEmployeeIds: job?.assignedEmployeeIds ?? [],
    });
  }

  function toggleAssignee(id: string) {
    const has = tracker.assignedEmployeeIds.includes(id);
    patch({
      assignedEmployeeIds: has
        ? tracker.assignedEmployeeIds.filter((item) => item !== id)
        : [...tracker.assignedEmployeeIds, id],
    });
  }

  return (
    <form
      className="panel"
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        persist("draft");
      }}
    >
      {error ? <p className="status punch">{error}</p> : null}

      <h3>Job identity</h3>
      <div className="form-grid">
        <div>
          <label htmlFor="job">Job name / number</label>
          <select id="job" value={tracker.jobId} onChange={(event) => onJobChange(event.target.value)}>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.number} · {job.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input id="date" type="date" value={tracker.date} onChange={(event) => patch({ date: event.target.value })} />
        </div>
        <div>
          <label htmlFor="arrive">Arrival time</label>
          <input id="arrive" type="time" value={tracker.arrivalAt} onChange={(event) => patch({ arrivalAt: event.target.value })} />
        </div>
        <div>
          <label htmlFor="leave">Departure time</label>
          <input id="leave" type="time" value={tracker.departureAt} onChange={(event) => patch({ departureAt: event.target.value })} />
        </div>
        <div>
          <label htmlFor="prep">Prepared by</label>
          <input id="prep" value={tracker.preparedByName} onChange={(event) => patch({ preparedByName: event.target.value })} />
        </div>
        <div>
          <label htmlFor="prep-role">Role</label>
          <input id="prep-role" value={tracker.preparedByRole} onChange={(event) => patch({ preparedByRole: event.target.value })} />
        </div>
        <div className="wide">
          <label htmlFor="desc">Job description</label>
          <textarea id="desc" value={tracker.jobDescription} onChange={(event) => patch({ jobDescription: event.target.value })} />
        </div>
      </div>

      <h3>Employees assigned</h3>
      <p className="muted">Pulled from People. Check who was on this tracker for later analysis.</p>
      <div className="chip-list">
        {employees.map((employee) => (
          <label className="check" key={employee.id}>
            <input
              type="checkbox"
              checked={tracker.assignedEmployeeIds.includes(employee.id)}
              onChange={() => toggleAssignee(employee.id)}
            />
            {employeeName(employee)} · {employee.trade}
          </label>
        ))}
      </div>

      <h3>Weather</h3>
      <div className="form-grid">
        <div>
          <label htmlFor="sky">Condition</label>
          <select
            id="sky"
            value={tracker.weather.condition}
            onChange={(event) => patch({ weather: { ...tracker.weather, condition: event.target.value } })}
          >
            <option>Clear</option>
            <option>Hazy</option>
            <option>Cloudy</option>
            <option>Windy</option>
            <option>Rain</option>
            <option>Storm</option>
            <option>Extreme heat</option>
          </select>
        </div>
        <div>
          <label htmlFor="high">High °F</label>
          <input
            id="high"
            value={tracker.weather.highF}
            onChange={(event) => patch({ weather: { ...tracker.weather, highF: Number(event.target.value) || 0 } })}
          />
        </div>
        <div>
          <label htmlFor="low">Low °F</label>
          <input
            id="low"
            value={tracker.weather.lowF}
            onChange={(event) => patch({ weather: { ...tracker.weather, lowF: Number(event.target.value) || 0 } })}
          />
        </div>
        <div>
          <label htmlFor="wind">Wind</label>
          <input
            id="wind"
            value={tracker.weather.wind}
            onChange={(event) => patch({ weather: { ...tracker.weather, wind: event.target.value } })}
          />
        </div>
        <div className="wide">
          <label htmlFor="wx-notes">Weather notes / impact</label>
          <textarea
            id="wx-notes"
            value={tracker.weather.notes}
            onChange={(event) => patch({ weather: { ...tracker.weather, notes: event.target.value } })}
          />
        </div>
      </div>

      <h3>Work</h3>
      <div className="form-grid">
        <div className="wide">
          <label htmlFor="work">Work completed</label>
          <textarea
            id="work"
            value={tracker.workCompleted}
            onChange={(event) => patch({ workCompleted: event.target.value })}
          />
        </div>
        <div className="wide">
          <label htmlFor="plan">Work planned tomorrow</label>
          <textarea id="plan" value={tracker.workPlanned} onChange={(event) => patch({ workPlanned: event.target.value })} />
        </div>
      </div>

      <h3>Crew / hours</h3>
      {tracker.crew.map((row, index) => (
        <div className="repeat-row" key={row.id}>
          <select
            aria-label="Employee"
            value={row.employeeId}
            onChange={(event) => {
              const employee = employees.find((item) => item.id === event.target.value);
              const crew = tracker.crew.map((item, i) =>
                i === index
                  ? { ...item, employeeId: event.target.value, trade: employee?.trade || item.trade }
                  : item,
              );
              patch({ crew });
            }}
          >
            <option value="">Named employee…</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employeeName(employee)}
              </option>
            ))}
          </select>
          <input
            aria-label="Trade"
            placeholder="Trade"
            value={row.trade}
            onChange={(event) => {
              const crew = tracker.crew.map((item, i) => (i === index ? { ...item, trade: event.target.value } : item));
              patch({ crew });
            }}
          />
          <input
            aria-label="Headcount"
            placeholder="#"
            value={row.count}
            onChange={(event) => {
              const crew = tracker.crew.map((item, i) =>
                i === index ? { ...item, count: Number(event.target.value) || 0 } : item,
              );
              patch({ crew });
            }}
          />
          <input
            aria-label="Hours"
            placeholder="Hours"
            value={row.hours}
            onChange={(event) => {
              const crew = tracker.crew.map((item, i) =>
                i === index ? { ...item, hours: Number(event.target.value) || 0 } : item,
              );
              patch({ crew });
            }}
          />
        </div>
      ))}
      <button className="btn secondary" type="button" onClick={() => patch({ crew: [...tracker.crew, emptyCrew()] })}>
        Add crew line
      </button>

      <h3>Safety and non-standard compliance</h3>
      <div className="form-grid">
        <div>
          <label htmlFor="toolbox">Toolbox topic</label>
          <input id="toolbox" value={tracker.toolboxTopic} onChange={(event) => patch({ toolboxTopic: event.target.value })} />
        </div>
        <div>
          <label className="check">
            <input
              type="checkbox"
              checked={tracker.incidents}
              onChange={(event) => patch({ incidents: event.target.checked })}
            />
            Incident today
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={tracker.ppeVerified}
              onChange={(event) => patch({ ppeVerified: event.target.checked })}
            />
            PPE verified
          </label>
        </div>
        <div className="wide">
          <label htmlFor="incident">Incident / near miss notes</label>
          <textarea
            id="incident"
            value={`${tracker.incidentNotes}\n${tracker.nearMissNotes}`}
            onChange={(event) => patch({ incidentNotes: event.target.value, nearMissNotes: tracker.nearMissNotes })}
          />
        </div>
        <div className="wide">
          <label htmlFor="safety">Safety notes</label>
          <textarea id="safety" value={tracker.safetyNotes} onChange={(event) => patch({ safetyNotes: event.target.value })} />
        </div>
      </div>
      <p className="meta">Non-standard items (heat cycle, extra attenuator, owner-specific rules)</p>
      {tracker.safetyItems.map((row, index) => (
        <div className="repeat-row" key={row.id}>
          <input
            placeholder="Item"
            value={row.label}
            onChange={(event) => {
              const safetyItems = tracker.safetyItems.map((item, i) =>
                i === index ? { ...item, label: event.target.value } : item,
              );
              patch({ safetyItems });
            }}
          />
          <label className="check">
            <input
              type="checkbox"
              checked={row.observed}
              onChange={(event) => {
                const safetyItems = tracker.safetyItems.map((item, i) =>
                  i === index ? { ...item, observed: event.target.checked } : item,
                );
                patch({ safetyItems });
              }}
            />
            Observed
          </label>
          <input
            placeholder="Notes"
            value={row.notes}
            onChange={(event) => {
              const safetyItems = tracker.safetyItems.map((item, i) =>
                i === index ? { ...item, notes: event.target.value } : item,
              );
              patch({ safetyItems });
            }}
          />
        </div>
      ))}
      <button
        className="btn secondary"
        type="button"
        onClick={() => patch({ safetyItems: [...tracker.safetyItems, emptySafetyItem()] })}
      >
        Add compliance item
      </button>

      <h3>Delays</h3>
      <div className="form-grid">
        <label className="check">
          <input type="checkbox" checked={tracker.delay} onChange={(event) => patch({ delay: event.target.checked })} />
          Delay today
        </label>
        <div>
          <label htmlFor="delay-type">Type</label>
          <select
            id="delay-type"
            value={tracker.delayType}
            onChange={(event) => patch({ delayType: event.target.value as JobTracker["delayType"] })}
          >
            <option value="">—</option>
            <option value="weather">Weather</option>
            <option value="material">Material</option>
            <option value="labor">Labor</option>
            <option value="equipment">Equipment</option>
            <option value="access">Access</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="delay-hrs">Hours lost</label>
          <input
            id="delay-hrs"
            value={tracker.delayHours}
            onChange={(event) => patch({ delayHours: Number(event.target.value) || 0 })}
          />
        </div>
        <div className="wide">
          <label htmlFor="delay-notes">Delay notes</label>
          <textarea id="delay-notes" value={tracker.delayNotes} onChange={(event) => patch({ delayNotes: event.target.value })} />
        </div>
      </div>

      <h3>Visitors, equipment, materials, inspections</h3>
      {tracker.visitors.map((row, index) => (
        <div className="repeat-row" key={row.id}>
          <input
            placeholder="Visitor"
            value={row.name}
            onChange={(event) => {
              const visitors = tracker.visitors.map((item, i) => (i === index ? { ...item, name: event.target.value } : item));
              patch({ visitors });
            }}
          />
          <input
            placeholder="Company"
            value={row.company}
            onChange={(event) => {
              const visitors = tracker.visitors.map((item, i) =>
                i === index ? { ...item, company: event.target.value } : item,
              );
              patch({ visitors });
            }}
          />
          <input
            placeholder="Purpose"
            value={row.purpose}
            onChange={(event) => {
              const visitors = tracker.visitors.map((item, i) =>
                i === index ? { ...item, purpose: event.target.value } : item,
              );
              patch({ visitors });
            }}
          />
        </div>
      ))}
      <button className="btn secondary" type="button" onClick={() => patch({ visitors: [...tracker.visitors, emptyVisitor()] })}>
        Add visitor
      </button>

      {tracker.equipment.map((row, index) => (
        <div className="repeat-row" key={row.id}>
          <input
            placeholder="Equipment"
            value={row.name}
            onChange={(event) => {
              const equipment = tracker.equipment.map((item, i) =>
                i === index ? { ...item, name: event.target.value } : item,
              );
              patch({ equipment });
            }}
          />
          <input
            placeholder="Hours"
            value={row.hoursOperating}
            onChange={(event) => {
              const equipment = tracker.equipment.map((item, i) =>
                i === index ? { ...item, hoursOperating: Number(event.target.value) || 0 } : item,
              );
              patch({ equipment });
            }}
          />
        </div>
      ))}
      <button
        className="btn secondary"
        type="button"
        onClick={() => patch({ equipment: [...tracker.equipment, emptyEquipment()] })}
      >
        Add equipment
      </button>

      {tracker.materials.map((row, index) => (
        <div className="repeat-row" key={row.id}>
          <input
            placeholder="Material"
            value={row.item}
            onChange={(event) => {
              const materials = tracker.materials.map((item, i) =>
                i === index ? { ...item, item: event.target.value } : item,
              );
              patch({ materials });
            }}
          />
          <input
            placeholder="Qty"
            value={row.quantity}
            onChange={(event) => {
              const materials = tracker.materials.map((item, i) =>
                i === index ? { ...item, quantity: event.target.value } : item,
              );
              patch({ materials });
            }}
          />
          <input
            placeholder="Vendor / ticket"
            value={row.vendor}
            onChange={(event) => {
              const materials = tracker.materials.map((item, i) =>
                i === index ? { ...item, vendor: event.target.value } : item,
              );
              patch({ materials });
            }}
          />
        </div>
      ))}
      <button className="btn secondary" type="button" onClick={() => patch({ materials: [...tracker.materials, emptyMaterial()] })}>
        Add material
      </button>

      {tracker.inspections.map((row, index) => (
        <div className="repeat-row" key={row.id}>
          <input
            placeholder="Inspection"
            value={row.type}
            onChange={(event) => {
              const inspections = tracker.inspections.map((item, i) =>
                i === index ? { ...item, type: event.target.value } : item,
              );
              patch({ inspections });
            }}
          />
          <select
            value={row.result}
            onChange={(event) => {
              const inspections = tracker.inspections.map((item, i) =>
                i === index ? { ...item, result: event.target.value as typeof row.result } : item,
              );
              patch({ inspections });
            }}
          >
            <option value="pass">Pass</option>
            <option value="fail">Fail</option>
            <option value="pending">Pending</option>
            <option value="not_inspected">Not inspected</option>
          </select>
        </div>
      ))}
      <button
        className="btn secondary"
        type="button"
        onClick={() => patch({ inspections: [...tracker.inspections, emptyInspection()] })}
      >
        Add inspection
      </button>

      <h3>Notes</h3>
      <textarea value={tracker.notes} onChange={(event) => patch({ notes: event.target.value })} />

      <h3>E-signature</h3>
      <SignaturePad value={tracker.signature} onChange={(signature) => patch({ signature })} />

      <div className="actions" style={{ marginTop: 22 }}>
        <button className="btn secondary" type="submit">
          Save draft
        </button>
        <button className="btn" type="button" onClick={() => persist("submitted")}>
          Submit tracker
        </button>
      </div>
    </form>
  );
}
