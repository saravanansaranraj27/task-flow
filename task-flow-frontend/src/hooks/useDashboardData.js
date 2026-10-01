import { useCallback, useEffect, useState } from "react";
import { taskApi } from "../api/tasks";
import { noteApi } from "../api/notes";
import { goalApi } from "../api/goals";
import { getTimeAgo } from "../utils/date";

export default function useDashboardData() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalNotes: 0,
    activeGoals: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tasks, notes, goals] = await Promise.all([
        taskApi.getAll(undefined, { throwOnError: false }),
        noteApi.getAll({ throwOnError: false }),
        goalApi.getAll({ throwOnError: false }),
      ]);
      const taskList = Array.isArray(tasks) ? tasks : [];
      const noteList = Array.isArray(notes) ? notes : [];
      const goalList = Array.isArray(goals) ? goals : [];
      const completed = taskList.filter((t) => t.status === "done").length;
      const pending = taskList.length - completed;
      const activeGoalsCount = goalList.filter((g) => g.progress < 100).length;
      setStats({
        totalTasks: taskList.length,
        completedTasks: completed,
        pendingTasks: pending,
        totalNotes: noteList.length,
        activeGoals: activeGoalsCount,
      });
      const now = new Date();
      const activities = [
        ...taskList.map((t) => ({
          type: "task",
          text: `${t.status === "done" ? "Completed" : "Added"} task "${t.title}"`,
          date: new Date(t.created_at),
        })),
        ...noteList.map((n) => ({
          type: "note",
          text: `Added note "${n.title}"`,
          date: new Date(n.created_at),
        })),
        ...goalList.map((g) => ({
          type: "goal",
          text: `Set goal "${g.title}"`,
          date: new Date(g.created_at),
        })),
      ]
        .sort((a, b) => b.date - a.date)
        .slice(0, 5)
        .map((a) => ({ ...a, time: getTimeAgo(a.date, now) }));
      setRecentActivity(activities);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const initializeData = async () => {
      if (mounted) await fetchData();
    };
    initializeData();
    const handleChange = () => {
      if (mounted) fetchData();
    };
    window.addEventListener("taskflow-data-changed", handleChange);
    return () => {
      mounted = false;
      window.removeEventListener("taskflow-data-changed", handleChange);
    };
  }, [fetchData]);

  return { stats, recentActivity, loading, refetch: fetchData };
}
