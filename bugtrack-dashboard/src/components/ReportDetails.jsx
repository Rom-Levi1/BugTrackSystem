import { Smartphone, Trash2, User, X } from "lucide-react";
import SeverityBadge from "./SeverityBadge";
import StatusBadge from "./StatusBadge";

function formatDate(value) {
  if (!value) {
    return "Unknown";
  }

  return new Date(value).toLocaleString();
}

function ReportDetails({ report, onClose, onUpdateStatus, onDeleteClick }) {
  if (!report) {
    return (
      <div className="card empty-card details-empty">
        <h3>Select a report</h3>
        <p>Click a report from the table to inspect stack trace, metadata, and breadcrumbs.</p>
      </div>
    );
  }

  return (
    <aside className="report-details card">
      <div className="details-header">
        <div>
          <p className="section-label">Report Details</p>
          <h2>{report.title || report.message}</h2>
        </div>

        <div className="details-header-actions">
          <button
            className="icon-button icon-button-danger"
            onClick={() => onDeleteClick(report)}
            aria-label="Delete report"
          >
            <Trash2 size={16} />
          </button>

          <button className="icon-button" onClick={onClose} aria-label="Close report details">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="details-badges">
        <SeverityBadge severity={report.severity} />
        <StatusBadge status={report.status} />
        <span className="badge type-badge">{report.type}</span>
      </div>

      <p className="details-message">{report.message}</p>

      {report.description && (
        <div className="details-section">
          <h3>Description</h3>
          <p>{report.description}</p>
        </div>
      )}

      <div className="details-section">
        <h3>Status Controls</h3>

        <div className="status-actions">
          <button onClick={() => onUpdateStatus(report.id, "Open")}>Open</button>
          <button onClick={() => onUpdateStatus(report.id, "Fixed")}>Fixed</button>
          <button onClick={() => onUpdateStatus(report.id, "Ignored")}>Ignored</button>
        </div>
      </div>

      <div className="details-section">
        <h3>Context</h3>

        <div className="metadata-grid">
          <div>
            <Smartphone size={16} />
            <span>Device</span>
            <strong>{report.device_model || "Unknown"}</strong>
          </div>

          <div>
            <Smartphone size={16} />
            <span>Android</span>
            <strong>{report.android_version || "Unknown"}</strong>
          </div>

          <div>
            <User size={16} />
            <span>User ID</span>
            <strong>{report.user_id || "Not set"}</strong>
          </div>

          <div>
            <span>App Version</span>
            <strong>{report.app_version || "Unknown"}</strong>
          </div>

          <div>
            <span>Created</span>
            <strong>{formatDate(report.created_at)}</strong>
          </div>

          <div>
            <span>Last Seen</span>
            <strong>{formatDate(report.last_seen_at)}</strong>
          </div>

          <div>
            <span>Occurrences</span>
            <strong>{report.occurrence_count || 1}</strong>
          </div>

          <div>
            <span>Screen</span>
            <strong>{report.screen_name || "Unknown"}</strong>
          </div>
        </div>
      </div>

      {report.breadcrumbs && (
        <div className="details-section">
          <h3>Breadcrumbs</h3>
          <pre className="details-code">{report.breadcrumbs}</pre>
        </div>
      )}

      {report.stack_trace && (
        <div className="details-section">
          <h3>Stack Trace</h3>
          <pre className="details-code">{report.stack_trace}</pre>
        </div>
      )}

      {report.fingerprint && (
        <div className="details-section">
          <h3>Fingerprint</h3>
          <code>{report.fingerprint}</code>
        </div>
      )}
    </aside>
  );
}

export default ReportDetails;