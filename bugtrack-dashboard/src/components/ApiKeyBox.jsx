import { useState } from "react";
import { Check, Copy, KeyRound } from "lucide-react";

function ApiKeyBox({ project }) {
  const [copiedField, setCopiedField] = useState("");

  if (!project) {
    return (
      <div className="card empty-card">
        <h3>No project selected</h3>
        <p>Create or select a project to see its API credentials.</p>
      </div>
    );
  }

  async function copyText(text, fieldName) {
    await navigator.clipboard.writeText(text);
    setCopiedField(fieldName);

    setTimeout(() => {
      setCopiedField("");
    }, 1400);
  }

  return (
    <div className="card api-key-box">
      <div className="card-title-row">
        <div>
          <p className="section-label">SDK Credentials</p>
          <h3>{project.name}</h3>
        </div>

        <KeyRound size={22} />
      </div>

      <div className="credential-row">
        <span>Project ID</span>
        <code>{project.id}</code>
        <button
          className="icon-button"
          onClick={() => copyText(project.id, "project_id")}
          title="Copy project ID"
          aria-label="Copy project ID"
        >
          {copiedField === "project_id" ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>

      <div className="credential-row">
        <span>API Key</span>
        <code>{project.api_key}</code>
        <button
          className="icon-button"
          onClick={() => copyText(project.api_key, "api_key")}
          title="Copy API key"
          aria-label="Copy API key"
        >
          {copiedField === "api_key" ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}

export default ApiKeyBox;