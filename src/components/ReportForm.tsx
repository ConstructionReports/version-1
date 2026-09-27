import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { newId, todayIso } from "../lib/format";
import { listProjects, saveReport } from "../lib/storage";
import type { CrewCount, DailyReport, ReportStatus } from "../types";

const emptyCrew: CrewCount[] = [
  { trade: "Concrete", count: 0 },
  { trade: "Carpenters", count: 0 },
];

type Props = {
  initial?: DailyReport;
  presetProjectId?: string;
};

export function ReportForm({ initial, presetProjectId }: Props) {
  const navigate = useNavigate();
  const projects = useMemo(() => listProjects(), []);

  const [projectId, setProjectId] = useState(
    initial?.projectId ?? presetProjectId ?? projects[0]?.id ?? "",
  );
  const [date, setDate] = useState(initial?.date ?? todayIso());
  const [condition, setCondition] = useState(initial?.weather.condition ?? "Clear");
  const [highF, setHighF] = useState(String(initial?.weather.highF ?? 95));
  const [lowF, setLowF] = useState(String(initial?.weather.lowF ?? 72));
  const [crew, setCrew] = useState<CrewCount[]>(initial?.crew ?? emptyCrew);
  const [workCompleted, setWorkCompleted] = useState(initial?.workCompleted ?? "");
  const [delays, setDelays] = useState(initial?.delays ?? "");
  const [safety, setSafety] = useState(initial?.safety ?? "");
  const [materials, setMaterials] = useState(initial?.materials ?? "");
  const [visitors, setVisitors] = useState(initial?.visitors ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [author, setAuthor] = useState(
    initial?.author ?? projects.find((project) => project.id === projectId)?.superintendent ?? "",
  );
  const [error, setError] = useState("");

  function updateCrew(index: number, patch: Partial<CrewCount>) {
    setCrew((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function persist(nextStatus: ReportStatus) {
    if (!projectId) {
      setError("Choose a job.");
      return;
    }
    if (!workCompleted.trim()) {
      setError("Write what got done today.");
      return;
    }

    const report: DailyReport = {
      id: initial?.id ?? newId("rpt"),
      projectId,
      date,
      status: nextStatus,
      weather: {
        condition,
        highF: Number(highF) || 0,
        lowF: Number(lowF) || 0,
      },
      crew: crew.filter((row) => row.trade.trim() && row.count > 0),
      workCompleted: workCompleted.trim(),
      delays: delays.trim(),
      safety: safety.trim(),
      materials: materials.trim(),
      visitors: visitors.trim(),
      notes: notes.trim(),
      author: author.trim() || "Superintendent",
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    };

    saveReport(report);
    navigate(`/app/reports/${report.id}`);
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

      <div className="form-grid">
        <div>
          <label htmlFor="project">Job</label>
          <select
            id="project"
            value={projectId}
            onChange={(event) => {
              const next = event.target.value;
              setProjectId(next);
              if (!initial) {
                setAuthor(projects.find((project) => project.id === next)?.superintendent ?? "");
              }
            }}
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.number} · {project.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input id="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
        <div>
          <label htmlFor="author">Superintendent</label>
          <input id="author" value={author} onChange={(event) => setAuthor(event.target.value)} />
        </div>
        <div>
          <label htmlFor="condition">Weather</label>
          <select id="condition" value={condition} onChange={(event) => setCondition(event.target.value)}>
            <option>Clear</option>
            <option>Hazy</option>
            <option>Windy</option>
            <option>Rain</option>
            <option>Storm</option>
          </select>
        </div>
        <div>
          <label htmlFor="high">High °F</label>
          <input id="high" inputMode="numeric" value={highF} onChange={(event) => setHighF(event.target.value)} />
        </div>
        <div>
          <label htmlFor="low">Low °F</label>
          <input id="low" inputMode="numeric" value={lowF} onChange={(event) => setLowF(event.target.value)} />
        </div>

        <div className="wide">
          <label>Crew by trade</label>
          {crew.map((row, index) => (
            <div className="crew-row" key={`${row.trade}-${index}`}>
              <input
                aria-label={`Trade ${index + 1}`}
                value={row.trade}
                onChange={(event) => updateCrew(index, { trade: event.target.value })}
              />
              <input
                aria-label={`${row.trade || "Trade"} count`}
                inputMode="numeric"
                value={row.count}
                onChange={(event) => updateCrew(index, { count: Number(event.target.value) || 0 })}
              />
              <button
                className="btn ghost"
                type="button"
                aria-label="Remove trade"
                onClick={() => setCrew((rows) => rows.filter((_, i) => i !== index))}
              >
                ×
              </button>
            </div>
          ))}
          <button
            className="btn secondary"
            type="button"
            onClick={() => setCrew((rows) => [...rows, { trade: "", count: 0 }])}
          >
            Add trade
          </button>
        </div>

        <div className="wide">
          <label htmlFor="work">Work in place</label>
          <textarea
            id="work"
            value={workCompleted}
            onChange={(event) => setWorkCompleted(event.target.value)}
            placeholder="What moved today?"
          />
        </div>
        <div>
          <label htmlFor="delays">Delays</label>
          <textarea id="delays" value={delays} onChange={(event) => setDelays(event.target.value)} />
        </div>
        <div>
          <label htmlFor="safety">Safety</label>
          <textarea id="safety" value={safety} onChange={(event) => setSafety(event.target.value)} />
        </div>
        <div>
          <label htmlFor="materials">Materials</label>
          <textarea id="materials" value={materials} onChange={(event) => setMaterials(event.target.value)} />
        </div>
        <div>
          <label htmlFor="visitors">Visitors</label>
          <textarea id="visitors" value={visitors} onChange={(event) => setVisitors(event.target.value)} />
        </div>
        <div className="wide">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} />
        </div>
      </div>

      <div className="actions" style={{ marginTop: 18 }}>
        <button className="btn secondary" type="submit">
          Save draft
        </button>
        <button className="btn" type="button" onClick={() => persist("submitted")}>
          Submit report
        </button>
      </div>
    </form>
  );
}
