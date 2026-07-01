function SeverityBadge({ severity }) {
  const normalizedSeverity = severity || "Medium";

  return (
    <span className={`badge severity-${normalizedSeverity.toLowerCase()}`}>
      {normalizedSeverity}
    </span>
  );
}

export default SeverityBadge;