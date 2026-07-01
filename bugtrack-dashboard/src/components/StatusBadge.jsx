function StatusBadge({ status }) {
  const normalizedStatus = status || "Open";

  return (
    <span className={`badge status-${normalizedStatus.toLowerCase()}`}>
      {normalizedStatus}
    </span>
  );
}

export default StatusBadge;