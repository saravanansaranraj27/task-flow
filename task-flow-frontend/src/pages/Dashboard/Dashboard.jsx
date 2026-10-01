import {
  CheckSquare,
  StickyNote,
  Target,
  Sun,
  Moon,
  Clock,
  ArrowRight,
  Plus,
  Zap,
} from "lucide-react";
import useDashboardData from "../../hooks/useDashboardData";
import { QUICK_ACTIONS, MODULE_CARDS } from "../../data/constants";

export default function Dashboard({ onNavigate, user, theme }) {
  const { stats, recentActivity, loading } = useDashboardData();
  const completionRate =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;
  const quickIcons = {
    "add-task": <Plus size={20} />,
    "quick-note": <Zap size={20} />,
    "set-goal": <Target size={20} />,
  };
  const moduleIcons = {
    tasks: <CheckSquare size={28} />,
    notes: <StickyNote size={28} />,
    goals: <Target size={28} />,
  };
  return (
    <div className="intro-page">
      <div className="intro-welcome-box">
        <div className="intro-welcome-accent" />
        <div className="welcome-header">
          <div className={`welcome-greeting-icon ${theme}`}>
            {theme === "light" ? <Sun size={26} /> : <Moon size={26} />}
          </div>
          <div>
            <p className="intro-greeting">
              Welcome back, {user?.name || "User"}
            </p>
            <h1 className="intro-title">Your Productivity Hub</h1>
          </div>
        </div>
        <p className="intro-welcome-text">
          Manage daily tasks, capture quick notes, and track long-term goals —
          all in one unified workspace designed for deep focus.
        </p>
      </div>
      <div className="stats-grid">
        <StatCard
          icon={<CheckSquare size={24} />}
          value={stats.completedTasks}
          label="Tasks Done"
          colorClass="stat-icon-green"
          trend={`${completionRate}% complete`}
          loading={loading}
        />
        <StatCard
          icon={<Clock size={24} />}
          value={stats.pendingTasks}
          label="Pending"
          colorClass="stat-icon-orange"
          trend="Needs attention"
          loading={loading}
        />
        <StatCard
          icon={<StickyNote size={24} />}
          value={stats.totalNotes}
          label="Notes"
          colorClass="stat-icon-blue"
          trend="Ideas captured"
          loading={loading}
        />
        <StatCard
          icon={<Target size={24} />}
          value={stats.activeGoals}
          label="Active Goals"
          colorClass="stat-icon-purple"
          trend="In progress"
          loading={loading}
        />
      </div>
      <div className="dashboard-split-layout">
        <div>
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-action-grid">
            {QUICK_ACTIONS.map((a) => (
              <div
                key={a.id}
                className={`quick-action-card quick-action-${a.id}`}
                onClick={() => onNavigate(a.target)}
              >
                <div className="qa-icon">{quickIcons[a.id]}</div>
                <div>
                  <h4 className="qa-title">{a.title}</h4>
                  <p className="qa-desc">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-list-container">
            {loading ? (
              <p className="empty-state">Loading activity...</p>
            ) : recentActivity.length === 0 ? (
              <p className="empty-state">No recent activity found.</p>
            ) : (
              recentActivity.map((a, idx) => (
                <div key={idx} className="activity-item">
                  <div className={`activity-dot dot-${a.type}`} />
                  <div className="activity-content">
                    <p className="activity-text">{a.text}</p>
                    <span className="activity-time">{a.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <p className="intro-subheading">Explore Modules</p>
      <div className="intro-grid">
        {MODULE_CARDS.map((c, idx) => (
          <div
            key={c.id}
            className={`intro-card intro-card-${c.id}`}
            onClick={() => onNavigate(c.id)}
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            <div className="intro-card-icon">{moduleIcons[c.id]}</div>
            <h3 className="intro-card-title">{c.title}</h3>
            <p className="intro-card-desc">{c.desc}</p>
            <div className="intro-card-link">
              <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, colorClass, trend, loading }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${colorClass}`}>{icon}</div>
      <div className="stat-info">
        <div className="stat-value">{loading ? "-" : value}</div>
        <div className="stat-label">{label}</div>
        {!loading && <div className="stat-trend">{trend}</div>}
      </div>
    </div>
  );
}
