import { useEffect } from "react";
import { X } from "lucide-react";

function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="section-label">Confirm</p>
            <h2>{title}</h2>
          </div>

          <button className="icon-button" onClick={onCancel} aria-label="Cancel">
            <X size={18} />
          </button>
        </div>

        <p className="muted-text">{message}</p>

        <div className="confirm-actions">
          <button className="secondary-button" onClick={onCancel}>
            Cancel
          </button>

          <button
            className={danger ? "danger-button" : "primary-button"}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
