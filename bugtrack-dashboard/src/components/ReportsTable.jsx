import { Eye } from "lucide-react";
import SeverityBadge from "./SeverityBadge";
import StatusBadge from "./StatusBadge";

function formatDate(value) {
  if (!value) {
    return "Unknown";
  }

  return new Date(value).toLocaleString();
}

function ReportsTable({ reports, selectedReport, onSelectReport }) {
  if (!reports || reports.length === 0) {
    return (
      <div className="card empty-card">
        <h3>No reports found</h3>
        <p>
          When the Android SDK sends bug reports or crashes, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="card reports-table-card">
      <div className="table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Screen</th>
              <th>Occurrences</th>
              <th>Last Seen</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                className={selectedReport?.id === report.id ? "selected-row" : ""}
              >
                <td>
                  <strong>{report.title || report.message}</strong>
                  <span>{report.message}</span>
                </td>

                <td className="capitalize">{report.type}</td>

                <td>
                  <SeverityBadge severity={report.severity} />
                </td>

                <td>
                  <StatusBadge status={report.status} />
                </td>

                <td>{report.screen_name || "Unknown"}</td>

                <td className="numeric-cell">{report.occurrence_count || 1}</td>

                <td>{formatDate(report.last_seen_at || report.created_at)}</td>

                <td>
                  <button
                    className="icon-button"
                    onClick={() => onSelectReport(report)}
                    title="View report details"
                    aria-label={`View details for ${report.title || report.message}`}
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportsTable;