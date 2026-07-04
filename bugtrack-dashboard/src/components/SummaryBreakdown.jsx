function StatBar({ title, segments }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  const summaryText = `${title}: ${segments
    .map((segment) => `${segment.label} ${segment.value}`)
    .join(", ")}`;

  return (
    <div className="stat-breakdown card">
      <h4>{title}</h4>

      {total === 0 ? (
        <p className="stat-bar-empty">No reports yet</p>
      ) : (
        <div className="stat-bar" role="img" aria-label={summaryText}>
          {segments
            .filter((segment) => segment.value > 0)
            .map((segment) => (
              <span
                key={segment.label}
                className="stat-bar-segment"
                style={{
                  width: `${(segment.value / total) * 100}%`,
                  background: segment.color,
                }}
                title={`${segment.label}: ${segment.value}`}
              />
            ))}
        </div>
      )}

      <ul className="stat-legend">
        {segments.map((segment) => (
          <li key={segment.label}>
            <span className="stat-dot" style={{ background: segment.color }} />
            {segment.label}
            <strong>{segment.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SummaryBreakdown({ summary }) {
  if (!summary) {
    return null;
  }

  return (
    <section className="breakdown-grid">
      <StatBar
        title="Status breakdown"
        segments={[
          { label: "Open", value: summary.open_reports || 0, color: "var(--blue)" },
          { label: "Fixed", value: summary.fixed_reports || 0, color: "var(--success)" },
          { label: "Ignored", value: summary.ignored_reports || 0, color: "var(--warning)" },
        ]}
      />

      <StatBar
        title="Severity breakdown"
        segments={[
          { label: "Low", value: summary.low_severity_reports || 0, color: "var(--success)" },
          { label: "Medium", value: summary.medium_severity_reports || 0, color: "var(--yellow)" },
          { label: "High", value: summary.high_severity_reports || 0, color: "var(--danger)" },
        ]}
      />

      <StatBar
        title="Type breakdown"
        segments={[
          { label: "Bug", value: summary.bug_reports || 0, color: "var(--blue-light)" },
          { label: "Crash", value: summary.crash_reports || 0, color: "var(--purple)" },
        ]}
      />
    </section>
  );
}

export default SummaryBreakdown;
