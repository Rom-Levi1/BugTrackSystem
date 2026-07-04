import { Bug, LayoutDashboard, LogOut } from "lucide-react";

function Sidebar({ onLogout, onDashboardClick }) {
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
        <button className="sidebar-link active" onClick={onDashboardClick} aria-current="page">
          <LayoutDashboard size={18} />
          Dashboard
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={onLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
