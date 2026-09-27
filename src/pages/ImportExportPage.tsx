import { useState } from "react";
import {
  detectTrackerMapping,
  downloadTemplate,
  downloadWorkbook,
  headersFromWorkbook,
  parseWorkbook,
  TRACKER_COLUMNS,
} from "../lib/excel";
import { newId } from "../lib/format";
import { listImportAudits, loadStore, recordImport, replaceImported } from "../lib/storage";
import { useManager } from "../lib/useManager";

export function ImportExportPage() {
  const { manager } = useManager();
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [mapping, setMapping] = useState<{ column: string; field: string }[]>([]);
  const audits = listImportAudits();

  async function onFile(file: File) {
    const buffer = await file.arrayBuffer();
    const current = loadStore();
    const result = parseWorkbook(buffer, current);
    replaceImported({
      employees: result.employees,
      jobs: result.jobs,
      trackers: result.trackers,
    });
    recordImport({
      id: newId("imp"),
      fileName: file.name,
      at: new Date().toISOString(),
      managerId: manager.id,
      created: result.created,
      updated: result.updated,
      errors: result.errors,
    });
    setErrors(result.errors);
    setMessage(
      `Imported ${file.name}: ${result.created} created, ${result.updated} updated${result.errors.length ? `, ${result.errors.length} row warnings` : ""}.`,
    );
  }

  async function previewMapping(file: File) {
    const headers = headersFromWorkbook(await file.arrayBuffer());
    const next = detectTrackerMapping(headers);
    setMapping(next);
    setMessage(`Mapped ${next.length} of ${TRACKER_COLUMNS.length} tracker fields from ${file.name}.`);
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="kicker">Import / Export</p>
          <h2>Excel in and out</h2>
          <p className="muted">
            Same column names we will use later to auto-fill a tracker from a simple sheet.
          </p>
        </div>
      </div>

      <div className="grid-2">
        <article className="card">
          <h3>Export</h3>
          <p className="muted">Download the live book: jobs, employees, daily_logs, and crew.</p>
          <div className="actions">
            <button
              className="btn"
              type="button"
              onClick={() => downloadWorkbook(loadStore(), "construction-reports-book.xlsx")}
            >
              Export current book
            </button>
            <button className="btn secondary" type="button" onClick={() => downloadTemplate()}>
              Empty template
            </button>
          </div>
        </article>
        <article className="card">
          <h3>Import</h3>
          <p className="muted">Upserts on job_number, employee_id, and job_number + log_date.</p>
          <label className="btn secondary" htmlFor="xlsx">
            Choose Excel file
          </label>
          <input
            id="xlsx"
            className="file-input"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onFile(file);
            }}
          />
        </article>
      </div>

      <article className="panel" style={{ marginTop: 18 }}>
        <h3>Future auto-populate map</h3>
        <p className="muted">
          Drop a sheet to see which headers already match tracker fields. Later this map will fill a blank
          tracker without a full import.
        </p>
        <label className="btn secondary" htmlFor="mapfile">
          Preview column map
        </label>
        <input
          id="mapfile"
          className="file-input"
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void previewMapping(file);
          }}
        />
        {mapping.length ? (
          <ul className="list">
            {mapping.map((item) => (
              <li key={item.field}>
                {item.column} → {item.field}
              </li>
            ))}
          </ul>
        ) : (
          <p className="meta">Expected headers include job_number, log_date, work_completed, assigned_employee_numbers.</p>
        )}
      </article>

      {message ? <p className="status submitted" style={{ marginTop: 16 }}>{message}</p> : null}
      {errors.length ? (
        <ul className="list">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}

      {audits.length ? (
        <article className="panel" style={{ marginTop: 18 }}>
          <h3>Recent imports</h3>
          <ul className="list">
            {audits.map((audit) => (
              <li key={audit.id}>
                {audit.fileName} · {new Date(audit.at).toLocaleString()} · +{audit.created} / ~{audit.updated}
              </li>
            ))}
          </ul>
        </article>
      ) : null}
    </div>
  );
}
