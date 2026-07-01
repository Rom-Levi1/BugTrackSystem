import { Plus } from "lucide-react";

function ProjectSelector({
  projects,
  selectedProject,
  onSelectProject,
  onCreateProjectClick,
}) {
  return (
    <div className="project-selector card">
      <div>
        <p className="section-label">Current Project</p>
        <h2>Project Workspace</h2>
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
      </div>
    </div>
  );
}

export default ProjectSelector;