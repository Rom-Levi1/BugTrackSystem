import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ProjectSelector from "../components/ProjectSelector";
import CreateProjectModal from "../components/CreateProjectModal";
import ApiKeyBox from "../components/ApiKeyBox";
import IntegrationSnippet from "../components/IntegrationSnippet";
import SummaryCards from "../components/SummaryCards";
import FiltersBar from "../components/FiltersBar";
import ReportsTable from "../components/ReportsTable";
import ReportDetails from "../components/ReportDetails";
import {
  createProject,
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
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loadingProject, setLoadingProject] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState("");

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
    } catch (err) {
      setError(err.message);
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

  return (
    <div className="dashboard-shell">
      <Sidebar onLogout={onLogout} />

      <main className="dashboard-main">
        <header className="dashboard-header dashboard-header-row">
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

        <ProjectSelector
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
          onCreateProjectClick={() => setShowCreateModal(true)}
        />

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

            <FiltersBar filters={filters} onChangeFilters={handleFiltersChange} />

            {loadingReports && <p className="muted-text">Loading reports...</p>}

            <section className="reports-layout">
              <ReportsTable
                reports={reports}
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
    </div>
  );
}

export default DashboardPage;