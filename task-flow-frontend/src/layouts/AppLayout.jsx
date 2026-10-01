import {
  CheckSquare,
  StickyNote,
  Target,
  Moon,
  Sun,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ArrowUp,
} from "lucide-react";

export default function AppLayout({
  view,
  theme,
  isMobileMenuOpen,
  showBackToTop,
  mainContentRef,
  onNavigate,
  onToggleTheme,
  onSignOut,
  onScroll,
  onScrollToTop,
  children,
}) {
  return (
    <div className="app-layout">
      <div className="mobile-header">
        <div className="sidebar-logo">
          <LayoutDashboard size={20} color="white" />
        </div>
        <span className="mobile-brand">TaskFlow</span>
        <button
          className="mobile-menu-toggle"
          onClick={() => onNavigate(view, true)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <aside
        className={`sidebar-labeled ${isMobileMenuOpen ? "mobile-open" : ""}`}
      >
        <div
          className="sidebar-header clickable-brand"
          onClick={() => onNavigate("home")}
        >
          <div className="sidebar-logo">
            <LayoutDashboard size={22} color="white" />
          </div>
          <span className="sidebar-brand">TaskFlow</span>
        </div>
        <nav className="sidebar-nav">
          <NavItem
            icon={<CheckSquare size={20} />}
            label="My Tasks"
            active={view === "tasks"}
            onClick={() => onNavigate("tasks")}
          />
          <NavItem
            icon={<StickyNote size={20} />}
            label="Quick Notes"
            active={view === "notes"}
            onClick={() => onNavigate("notes")}
          />
          <NavItem
            icon={<Target size={20} />}
            label="Goals"
            active={view === "goals"}
            onClick={() => onNavigate("goals")}
          />
        </nav>
        <div className="sidebar-footer">
          <NavItem
            icon={theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            label={theme === "light" ? "Dark Mode" : "Light Mode"}
            onClick={onToggleTheme}
          />
          <NavItem
            icon={<LogOut size={20} />}
            label="Sign Out"
            onClick={onSignOut}
            danger
          />
        </div>
      </aside>
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => onNavigate(view, true)}
        />
      )}
      <main className="main-content" ref={mainContentRef} onScroll={onScroll}>
        <div className="content-wrapper fade-in">{children}</div>
      </main>
      {showBackToTop && (
        <button
          className="back-to-top-btn"
          onClick={onScrollToTop}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick, danger }) {
  return (
    <button
      type="button"
      className={`nav-item ${active ? "active" : ""} ${danger ? "danger" : ""}`}
      onClick={onClick}
    >
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </button>
  );
}
