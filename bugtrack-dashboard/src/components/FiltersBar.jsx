import { RotateCcw } from "lucide-react";

function FiltersBar({ filters, onChangeFilters }) {
  function updateFilter(name, value) {
    onChangeFilters({
      ...filters,
      [name]: value,
    });
  }

  function resetFilters() {
    onChangeFilters({
      status: "",
      severity: "",
      type: "",
    });
  }

  return (
    <div className="filters-bar card">
      <div>
        <p className="section-label">Reports</p>
        <h2>Issue Feed</h2>
      </div>

      <div className="filters-controls">
        <select
          value={filters.status}
          onChange={(event) => updateFilter("status", event.target.value)}
        >
          <option value="">All statuses</option>
          <option value="Open">Open</option>
          <option value="Fixed">Fixed</option>
          <option value="Ignored">Ignored</option>
        </select>

        <select
          value={filters.severity}
          onChange={(event) => updateFilter("severity", event.target.value)}
        >
          <option value="">All severities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          value={filters.type}
          onChange={(event) => updateFilter("type", event.target.value)}
        >
          <option value="">All types</option>
          <option value="bug">Bug</option>
          <option value="crash">Crash</option>
        </select>

        <button className="secondary-button small" onClick={resetFilters}>
          <RotateCcw size={15} />
          Reset
        </button>
      </div>
    </div>
  );
}

export default FiltersBar;