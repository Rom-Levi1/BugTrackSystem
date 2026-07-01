import { Bug, LayoutDashboard, LogOut, FolderKanban } from "lucide-react";

function Sidebar({ onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Bug size={24} />
        </div>
        <div>
          <h2>BugTrack</h2>
          <span>Developer Console</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button className="sidebar-link active">
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        <button className="sidebar-link">
          <FolderKanban size={18} />
          Projects
        </button>
      </nav>

      <button className="sidebar-logout" onClick={onLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;