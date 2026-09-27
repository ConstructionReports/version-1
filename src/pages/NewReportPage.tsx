import { useSearchParams } from "react-router-dom";
import { ReportForm } from "../components/ReportForm";

export function NewReportPage() {
  const [params] = useSearchParams();
  const presetProjectId = params.get("project") ?? undefined;

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="kicker">New daily</p>
          <h2>File the day</h2>
          <p className="muted">Write it like you would on the tailgate. Submit when the shift is done.</p>
        </div>
      </div>
      <ReportForm presetProjectId={presetProjectId} />
    </div>
  );
}
