import { useState } from "react";
import { Check, Copy } from "lucide-react";

function IntegrationSnippet({ project }) {
  const [copied, setCopied] = useState(false);

  if (!project) {
    return (
      <div className="card empty-card">
        <h3>Integration snippet</h3>
        <p>Select a project to generate the Android SDK setup code.</p>
      </div>
    );
  }

  const snippet = `BugTrack.init(
    application = application,
    projectId = "${project.id}",
    apiKey = "${project.api_key}"
)`;

  async function copySnippet() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1400);
  }

  return (
    <div className="card snippet-card">
      <div className="card-title-row">
        <div>
          <p className="section-label">Android Setup</p>
          <h3>SDK Integration</h3>
        </div>

        <button className="secondary-button small" onClick={copySnippet}>
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre>
        <code>{snippet}</code>
      </pre>
    </div>
  );
}

export default IntegrationSnippet;