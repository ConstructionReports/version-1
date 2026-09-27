import { Link, useParams } from "react-router-dom";
import { TrackerForm } from "../components/TrackerForm";
import { getTracker } from "../lib/storage";
import { useManager } from "../lib/useManager";

export function EditTrackerPage() {
  const { trackerId = "" } = useParams();
  const tracker = getTracker(trackerId);
  const { manager } = useManager();

  if (!tracker) {
    return (
      <div className="empty">
        Tracker not found. <Link to="/app">Back to Job Trackers</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="kicker">Edit tracker</p>
          <h2>Update the record</h2>
        </div>
      </div>
      <TrackerForm manager={manager} initial={tracker} />
    </div>
  );
}
