import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import LoginView from "./pages/Auth/LoginView";
import Dashboard from "./pages/Dashboard/Dashboard";
import TaskView from "./pages/Tasks/TaskView";
import NoteView from "./pages/Notes/NoteView";
import GoalView from "./pages/Goals/GoalView";
import AppLayout from "./layouts/AppLayout";
import { clearStoredUser, getStoredUser, storeUser } from "./utils/storage";

export default function App() {
  const [user, setUser] = useState(() => getStoredUser());
  const [view, setView] = useState("home");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );
  const [isInitializing, setIsInitializing] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const mainContentRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 800);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((prev) => (prev === "light" ? "dark" : "light")),
    [],
  );
  const handleNavigate = useCallback((newView, toggleOnly = false) => {
    if (toggleOnly) {
      setIsMobileMenuOpen((open) => !open);
      return;
    }
    setView(newView);
    setIsMobileMenuOpen(false);
    mainContentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const handleScroll = useCallback(
    () => setShowBackToTop((mainContentRef.current?.scrollTop || 0) > 300),
    [],
  );
  const scrollToTop = useCallback(
    () => mainContentRef.current?.scrollTo({ top: 0, behavior: "smooth" }),
    [],
  );
  const handleLogin = useCallback((userData) => {
    storeUser(userData);
    setUser(userData);
    setView("home");
  }, []);
  const handleSignOut = useCallback(() => {
    clearStoredUser();
    setUser(null);
    setView("home");
  }, []);

  if (isInitializing)
    return (
      <div className="app-initial-loader">
        <Loader2 size={48} className="animate-spin text-accent" />
      </div>
    );
  if (!user)
    return (
      <LoginView
        onLogin={handleLogin}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );

  let page;
  if (view === "home")
    page = (
      <Dashboard
        onNavigate={(v) => handleNavigate(v)}
        user={user}
        theme={theme}
      />
    );
  else if (view === "tasks") page = <TaskView />;
  else if (view === "notes") page = <NoteView />;
  else page = <GoalView />;

  return (
    <AppLayout
      view={view}
      theme={theme}
      isMobileMenuOpen={isMobileMenuOpen}
      showBackToTop={showBackToTop}
      mainContentRef={mainContentRef}
      onNavigate={handleNavigate}
      onToggleTheme={toggleTheme}
      onSignOut={handleSignOut}
      onScroll={handleScroll}
      onScrollToTop={scrollToTop}
    >
      {page}
    </AppLayout>
  );
}
