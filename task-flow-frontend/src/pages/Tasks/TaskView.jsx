import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Clock,
  Pencil,
  X,
  CheckSquare,
} from "lucide-react";
import ConfirmDialog from "../../components/ConfirmDialog";
import ThemeSelect from "../../components/ui/ThemeSelect";
import { taskApi } from "../../api/tasks";

const FILTERS = [
  { value: "", label: "All", icon: <CheckSquare size={14} /> },
  { value: "pending", label: "Pending", icon: <Circle size={14} /> },
  { value: "in_progress", label: "In Progress", icon: <Clock size={14} /> },
  { value: "done", label: "Done", icon: <CheckCircle size={14} /> },
];

export default function TaskView() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);

    try {
      const data = await taskApi.getAll(filter);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);

      try {
        const data = await taskApi.getAll(filter);
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [filter]);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    await taskApi.create({
      title,
      description,
      status: "pending",
    });

    setTitle("");
    setDescription("");

    fetchTasks();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingTask) return;

    await taskApi.replace(editingTask.id, {
      title: editingTask.title,
      description: editingTask.description,
      status: editingTask.status,
    });

    setEditingTask(null);

    fetchTasks();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await taskApi.delete(deleteTarget.id);

      setDeleteTarget(null);

      fetchTasks();

      window.dispatchEvent(new CustomEvent("taskflow-data-changed"));
    } catch (err) {
      setDeleteError(err.message || "Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status === "done") {
      return <CheckCircle size={18} className="status-done" />;
    }

    if (status === "in_progress") {
      return <Clock size={18} className="status-progress" />;
    }

    return <Circle size={18} className="status-pending" />;
  };

  return (
    <div>
      <h2 className="page-title">
        <div className="page-title-icon" style={{ background: "#d97706" }}>
          <CheckSquare size={24} color="white" />
        </div>
        My Tasks
      </h2>

      <form onSubmit={handleCreate} className="task-form">
        <input
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="modern-input"
          required
        />

        <textarea
          placeholder="Add details (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="modern-input task-textarea"
        />

        <button
          type="submit"
          className="btn-login"
          style={{
            width: "auto",
            alignSelf: "flex-end",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Plus size={18} />
          Add Task
        </button>
      </form>

      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`filter-btn ${filter === f.value ? "active" : ""}`}
          >
            {f.icon} {f.label}
          </button>
        ))}
      </div>

      <div className="task-list">
        {loading ? (
          <p className="empty-state">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty-state">No tasks yet. Create one above!</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-item">
              <div className="task-content">
                <div className="task-header">
                  {getStatusIcon(task.status)}

                  <strong className={task.status === "done" ? "task-done" : ""}>
                    {task.title}
                  </strong>

                  <span className="task-badge">
                    {task.status.replace("_", " ")}
                  </span>
                </div>

                {task.description && (
                  <p className="task-desc">{task.description}</p>
                )}

                <span className="task-date">
                  {new Date(task.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="task-actions">
                <button
                  onClick={() => setEditingTask({ ...task })}
                  className="edit-btn"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() => setDeleteTarget(task)}
                  className="delete-btn"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {editingTask && (
        <div className="edit-form-overlay" onClick={() => setEditingTask(null)}>
          <div className="edit-form-card" onClick={(e) => e.stopPropagation()}>
            <div className="edit-form-header">
              <h3>Edit Task</h3>

              <button onClick={() => setEditingTask(null)} className="edit-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="input-group">
                <label>Title</label>

                <input
                  className="modern-input"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="input-group">
                <label>Description</label>

                <textarea
                  className="modern-input task-textarea"
                  value={editingTask.description || ""}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="input-group">
                <label>Status</label>

                <ThemeSelect
                  value={editingTask.status}
                  onChange={(status) =>
                    setEditingTask({
                      ...editingTask,
                      status,
                    })
                  }
                  ariaLabel="Task status"
                  options={[
                    { value: "pending", label: "Pending" },
                    { value: "in_progress", label: "In Progress" },
                    { value: "done", label: "Done" },
                  ]}
                />
              </div>

              <div className="edit-form-actions">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-login"
                  style={{ width: "auto" }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
        isLoading={isDeleting}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteError(null);
        }}
      />
    </div>
  );
}
