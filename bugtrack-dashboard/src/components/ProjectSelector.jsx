import { Plus, Trash2 } from "lucide-react";

function ProjectSelector({
  projects,
  selectedProject,
  onSelectProject,
  onCreateProjectClick,
  onDeleteProjectClick,
}) {
  return (
    <div className="project-selector card">
      <div>
        <p className="section-label">Project Manager</p>
        <h2>Project Workspace</h2>
        <p className="muted-text">
          Create, select, and manage Android apps connected to BugTrack.
        </p>
      </div>

      <div className="project-selector-actions">
        <select
          value={selectedProject?.id || ""}
          onChange={(event) => {
            const project = projects.find((item) => item.id === event.target.value);
            onSelectProject(project || null);
          }}
        >
          {projects.length === 0 ? (
            <option value="">No projects yet</option>
          ) : (
            projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))
          )}
        </select>

        <button className="primary-button small" onClick={onCreateProjectClick}>
          <Plus size={16} />
          New Project
        </button>

        <button
          className="danger-button small"
          onClick={onDeleteProjectClick}
          disabled={!selectedProject}
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}

export default ProjectSelector;