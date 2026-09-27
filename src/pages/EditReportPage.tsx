import { Link, useParams } from "react-router-dom";
import { ReportForm } from "../components/ReportForm";
import { getReport } from "../lib/storage";

export function EditReportPage() {
  const { reportId = "" } = useParams();
  const report = getReport(reportId);

  if (!report) {
    return (
      <div className="empty">
        Report not found. <Link to="/app/reports">Back to the log</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="kicker">Edit daily</p>
          <h2>Update the report</h2>
        </div>
      </div>
      <ReportForm initial={report} />
    </div>
  );
}
