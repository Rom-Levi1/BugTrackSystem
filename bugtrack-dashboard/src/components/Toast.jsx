import { AlertTriangle, CheckCircle2 } from "lucide-react";

function Toast({ toast }) {
  if (!toast) {
    return null;
  }

  return (
    <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
      {toast.type === "error" ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
      {toast.message}
    </div>
  );
}

export default Toast;
