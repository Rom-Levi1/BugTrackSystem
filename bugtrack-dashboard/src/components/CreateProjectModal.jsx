import { useEffect, useState } from "react";
import { X } from "lucide-react";

function CreateProjectModal({ onClose, onCreate, loading }) {
  const [name, setName] = useState("");

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    onCreate(name.trim());
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <p className="section-label">New Project</p>
            <h2>Create Android App Project</h2>
          </div>

          <button className="icon-button" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>Project name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Example: RoamNote Android App"
            autoFocus
          />

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;