import { useState, type FormEvent } from "react";
import { emptyEmployee } from "../lib/defaults";
import { newId } from "../lib/format";
import { saveEmployee } from "../lib/storage";
import type { Certification, Employee } from "../types";

type Props = {
  initial?: Employee;
};

export function EmployeeForm({ initial }: Props) {
  const [employee, setEmployee] = useState<Employee>(() => initial ?? emptyEmployee());
  const [error, setError] = useState("");

  function patch(partial: Partial<Employee>) {
    setEmployee((current) => ({ ...current, ...partial }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!employee.firstName.trim() || !employee.lastName.trim()) {
      setError("First and last name are required.");
      return;
    }
    const next = {
      ...employee,
      id: employee.id || newId("emp"),
      employeeNumber: employee.employeeNumber || `E-${Date.now().toString().slice(-4)}`,
      certifications: employee.certifications.filter((item) => item.name),
    };
    saveEmployee(next);
    window.location.assign(`/app/people/${next.id}`);
  }

  return (
    <form className="panel" onSubmit={submit}>
      {error ? <p className="status punch">{error}</p> : null}
      <div className="form-grid">
        <div>
          <label htmlFor="fn">First name</label>
          <input id="fn" value={employee.firstName} onChange={(event) => patch({ firstName: event.target.value })} />
        </div>
        <div>
          <label htmlFor="ln">Last name</label>
          <input id="ln" value={employee.lastName} onChange={(event) => patch({ lastName: event.target.value })} />
        </div>
        <div>
          <label htmlFor="enum">Employee #</label>
          <input id="enum" value={employee.employeeNumber} onChange={(event) => patch({ employeeNumber: event.target.value })} />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <input id="role" value={employee.role} onChange={(event) => patch({ role: event.target.value })} />
        </div>
        <div>
          <label htmlFor="trade">Trade</label>
          <input id="trade" value={employee.trade} onChange={(event) => patch({ trade: event.target.value })} />
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input id="phone" value={employee.phone} onChange={(event) => patch({ phone: event.target.value })} />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" value={employee.email} onChange={(event) => patch({ email: event.target.value })} />
        </div>
        <div>
          <label htmlFor="hire">Hire date</label>
          <input id="hire" type="date" value={employee.hireDate} onChange={(event) => patch({ hireDate: event.target.value })} />
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={employee.status}
            onChange={(event) => patch({ status: event.target.value as Employee["status"] })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <label className="check">
          <input
            type="checkbox"
            checked={employee.assignable}
            onChange={(event) => patch({ assignable: event.target.checked })}
          />
          Assignable to job trackers
        </label>
        <div>
          <label htmlFor="ec-name">Emergency contact</label>
          <input
            id="ec-name"
            value={employee.emergencyContactName}
            onChange={(event) => patch({ emergencyContactName: event.target.value })}
          />
        </div>
        <div>
          <label htmlFor="ec-rel">Relationship</label>
          <input
            id="ec-rel"
            value={employee.emergencyContactRelationship}
            onChange={(event) => patch({ emergencyContactRelationship: event.target.value })}
          />
        </div>
        <div>
          <label htmlFor="ec-phone">Emergency phone</label>
          <input
            id="ec-phone"
            value={employee.emergencyContactPhone}
            onChange={(event) => patch({ emergencyContactPhone: event.target.value })}
          />
        </div>
        <div className="wide">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" value={employee.notes} onChange={(event) => patch({ notes: event.target.value })} />
        </div>
      </div>

      <h3>Certifications</h3>
      {employee.certifications.map((cert, index) => (
        <div className="repeat-row" key={cert.id}>
          <input
            placeholder="Certification"
            value={cert.name}
            onChange={(event) => {
              const certifications = employee.certifications.map((item, i) =>
                i === index ? { ...item, name: event.target.value } : item,
              );
              patch({ certifications });
            }}
          />
          <input
            type="date"
            value={cert.expiresOn}
            onChange={(event) => {
              const certifications = employee.certifications.map((item, i) =>
                i === index ? { ...item, expiresOn: event.target.value } : item,
              );
              patch({ certifications });
            }}
          />
        </div>
      ))}
      <button
        className="btn secondary"
        type="button"
        onClick={() =>
          patch({
            certifications: [
              ...employee.certifications,
              { id: newId("cert"), name: "", expiresOn: "", notes: "" } satisfies Certification,
            ],
          })
        }
      >
        Add certification
      </button>

      <div className="actions" style={{ marginTop: 18 }}>
        <button className="btn" type="submit">
          Save profile
        </button>
      </div>
    </form>
  );
}
