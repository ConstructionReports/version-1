import { useSearchParams } from "react-router-dom";
import { TrackerForm } from "../components/TrackerForm";
import { useManager } from "../lib/useManager";

export function NewTrackerPage() {
  const [params] = useSearchParams();
  const { manager } = useManager();

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="kicker">New tracker</p>
          <h2>File the day</h2>
          <p className="muted">Assign people from profiles, then save or sign.</p>
        </div>
      </div>
      <TrackerForm manager={manager} presetJobId={params.get("job") ?? undefined} />
    </div>
  );
}
