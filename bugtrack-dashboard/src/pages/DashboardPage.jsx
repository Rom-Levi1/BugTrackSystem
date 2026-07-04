import { useEffect, useMemo, useRef, useState } from "react";
import { RefreshCcw } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ProjectSelector from "../components/ProjectSelector";
import CreateProjectModal from "../components/CreateProjectModal";
import ConfirmDialog from "../components/ConfirmDialog";
import ApiKeyBox from "../components/ApiKeyBox";
import IntegrationSnippet from "../components/IntegrationSnippet";
import SummaryCards from "../components/SummaryCards";
import SummaryBreakdown from "../components/SummaryBreakdown";
import FiltersBar from "../components/FiltersBar";
import ReportsTable from "../components/ReportsTable";
import ReportDetails from "../components/ReportDetails";
import Toast from "../components/Toast";
import {
  createProject,
  deleteProject,
  getProjects,
  getReportById,
  getReports,
  getSummary,
  updateReportStatus,
} from "../api/bugtrackApi";

function DashboardPage({ onLogout }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [summary, setSummary] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    severity: "",
    type: "",
    search: "",
    sortBy: "newest",
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);
  const [loadingProject, setLoadingProject] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const toastTimeoutRef = useRef(null);

  function showToast(message, type = "success") {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3500);
  }

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  async function loadProjects() {
    try {
      setError("");
      const data = await getProjects();

      setProjects(data);

      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0]);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadProjectData(projectId, currentFilters = filters) {
    if (!projectId) {
      setSummary(null);
      setReports([]);
      setSelectedReport(null);
      return;
    }

    try {
      setLoadingReports(true);
      setError("");

      const [summaryData, reportsData] = await Promise.all([
        getSummary(projectId),
        getReports(projectId, currentFilters),
      ]);

      setSummary(summaryData);
      setReports(reportsData);
      setLastUpdated(new Date());

      if (selectedReport) {
        const updatedSelectedReport = reportsData.find(
          (report) => report.id === selectedReport.id
        );

        setSelectedReport(updatedSelectedReport || null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingReports(false);
    }
  }

  async function handleCreateProject(projectName) {
    try {
      setLoadingProject(true);
      setError("");

      const newProject = await createProject(projectName);

      setProjects((currentProjects) => [...currentProjects, newProject]);
      setSelectedProject(newProject);
      setShowCreateModal(false);
      showToast(`Project "${newProject.name}" created`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingProject(false);
    }
  }

  async function handleSelectReport(report) {
    try {
      setError("");
      const fullReport = await getReportById(report.id);
      setSelectedReport(fullReport);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleDeleteProjectClick() {
    if (!selectedProject) {
      return;
    }

    setConfirmingDelete(true);
  }

  async function handleConfirmDeleteProject() {
    if (!selectedProject) {
      return;
    }

    try {
      setDeletingProject(true);
      setError("");

      const deletedProjectName = selectedProject.name;

      await deleteProject(selectedProject.id);

      const remainingProjects = projects.filter(
        (project) => project.id !== selectedProject.id
      );

      setProjects(remainingProjects);
      setSelectedProject(remainingProjects[0] || null);
      setSummary(null);
      setReports([]);
      setSelectedReport(null);
      setConfirmingDelete(false);
      showToast(`Project "${deletedProjectName}" deleted`);
    } catch (err) {
      setError(err.message);
      setConfirmingDelete(false);
    } finally {
      setDeletingProject(false);
    }
  }

  async function handleUpdateStatus(reportId, status) {
    try {
      setError("");

      const updatedReport = await updateReportStatus(reportId, status);

      setSelectedReport(updatedReport);

      setReports((currentReports) =>
        currentReports.map((report) =>
          report.id === reportId ? updatedReport : report
        )
      );

      if (selectedProject) {
        const summaryData = await getSummary(selectedProject.id);
        setSummary(summaryData);
        setLastUpdated(new Date());
      }

      showToast(`Report marked as ${status}`);
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    }
  }

  function handleFiltersChange(nextFilters) {
    setFilters(nextFilters);

    if (selectedProject) {
      loadProjectData(selectedProject.id, nextFilters);
    }
  }

  function handleRefresh() {
    if (selectedProject) {
      loadProjectData(selectedProject.id, filters);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadProjectData(selectedProject.id, filters);
    }
  }, [selectedProject]);


  const visibleReports = useMemo(() => {
  let result = [...reports];

  const searchText = filters.search.trim().toLowerCase();

  if (searchText) {
    result = result.filter((report) => {
      const combinedText = [
        report.title,
        report.message,
        report.description,
        report.screen_name,
        report.device_model,
        report.user_id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return combinedText.includes(searchText);
    });
  }

  if (filters.sortBy === "newest") {
    result.sort((a, b) => {
      const dateA = new Date(a.last_seen_at || a.created_at).getTime();
      const dateB = new Date(b.last_seen_at || b.created_at).getTime();
      return dateB - dateA;
    });
  }

  if (filters.sortBy === "oldest") {
    result.sort((a, b) => {
      const dateA = new Date(a.last_seen_at || a.created_at).getTime();
      const dateB = new Date(b.last_seen_at || b.created_at).getTime();
      return dateA - dateB;
    });
  }

  if (filters.sortBy === "occurrences") {
    result.sort((a, b) => {
      return (b.occurrence_count || 1) - (a.occurrence_count || 1);
    });
  }

  return result;
}, [reports, filters.search, filters.sortBy]);


  return (
    <div className="dashboard-shell">
      <Sidebar
        onLogout={onLogout}
        onDashboardClick={() => {
            document.getElementById("dashboard-top")?.scrollIntoView({
            behavior: "smooth",
            });
        }}
        />

      <main className="dashboard-main">
        <header className="dashboard-header dashboard-header-row" id="dashboard-top">
          <div>
            <p className="section-label">Overview</p>
            <h1>BugTrack Dashboard</h1>
            <p className="muted-text">
              Manage Android projects, API keys, crashes, and bug reports.
            </p>

            {lastUpdated && (
              <p className="last-updated">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          <button
            className="secondary-button"
            onClick={handleRefresh}
            disabled={!selectedProject || loadingReports}
          >
            <RefreshCcw size={17} />
            {loadingReports ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        {error && <div className="error-box dashboard-error">{error}</div>}

      <section>
        <ProjectSelector
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
            onCreateProjectClick={() => setShowCreateModal(true)}
            onDeleteProjectClick={handleDeleteProjectClick}
        />
      </section>

        {projects.length === 0 ? (
          <section className="card onboarding-card">
            <p className="section-label">Getting Started</p>
            <h2>Create your first BugTrack project</h2>
            <p>
              Each Android app should have its own BugTrack project. After creating
              a project, the dashboard will generate a project ID and API key that
              can be copied into the Kotlin SDK.
            </p>

            <button
              className="primary-button"
              onClick={() => setShowCreateModal(true)}
            >
              Create First Project
            </button>
          </section>
        ) : (
          <>
            <section className="dashboard-grid two-columns">
              <ApiKeyBox project={selectedProject} />
              <IntegrationSnippet project={selectedProject} />
            </section>

            <SummaryCards summary={summary} />

            <SummaryBreakdown summary={summary} />

            <FiltersBar filters={filters} onChangeFilters={handleFiltersChange} />

            {loadingReports && <p className="muted-text">Loading reports...</p>}

            <section className="reports-layout">
              <ReportsTable
                reports={visibleReports}
                selectedReport={selectedReport}
                onSelectReport={handleSelectReport}
              />
              <ReportDetails
                report={selectedReport}
                onClose={() => setSelectedReport(null)}
                onUpdateStatus={handleUpdateStatus}
              />
            </section>
          </>
        )}
      </main>

      {showCreateModal && (
        <CreateProjectModal
          loading={loadingProject}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateProject}
        />
      )}

      {confirmingDelete && selectedProject && (
        <ConfirmDialog
          title={`Delete "${selectedProject.name}"?`}
          message="This will also delete all reports for this project. This action cannot be undone."
          confirmLabel="Delete Project"
          loading={deletingProject}
          onConfirm={handleConfirmDeleteProject}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}

export default DashboardPage;