import { useState, useEffect } from "react";
import { Target, Trash2, Calendar, Pencil, X } from "lucide-react";
import ConfirmDialog from "../../components/ConfirmDialog";
import DateField from "../../components/ui/DateField";
import { goalApi } from "../../api/goals";

export default function GoalView() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [editingGoal, setEditingGoal] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchGoals = async () => {
    try {
      const data = await goalApi.getAll();
      setGoals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load goals:", err);
      setGoals([]);
    }
  };

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const data = await goalApi.getAll();
        setGoals(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load goals:", err);
        setGoals([]);
      }
    };

    loadGoals();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await goalApi.create({
        title: title.trim(),
        target_date: date,
        progress: 0,
      });

      setTitle("");
      setDate("");

      await fetchGoals();

      window.dispatchEvent(new CustomEvent("taskflow-data-changed"));
    } catch (err) {
      console.error("Failed to create goal:", err);
    }
  };

  const updateProgress = async (id, val) => {
    const progress = parseInt(val, 10);

    try {
      await goalApi.updateProgress(id, progress);

      setGoals((currentGoals) =>
        currentGoals.map((goal) =>
          goal.id === id
            ? {
                ...goal,
                progress,
              }
            : goal,
        ),
      );

      window.dispatchEvent(new CustomEvent("taskflow-data-changed"));
    } catch (err) {
      console.error("Failed to update goal progress:", err);

      await fetchGoals();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingGoal) return;

    try {
      await goalApi.update(editingGoal);

      setEditingGoal(null);

      await fetchGoals();

      window.dispatchEvent(new CustomEvent("taskflow-data-changed"));
    } catch (err) {
      console.error("Failed to update goal:", err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await goalApi.delete(deleteTarget.id);

      setDeleteTarget(null);

      await fetchGoals();

      window.dispatchEvent(new CustomEvent("taskflow-data-changed"));
    } catch (err) {
      setDeleteError(err.message || "Failed to delete goal");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">
        <div className="page-title-icon" style={{ background: "#16a34a" }}>
          <Target size={24} color="white" />
        </div>
        Goals
      </h2>

      <form onSubmit={handleCreate} className="goal-form">
        <div className="goal-form-row">
          <div className="goal-form-field">
            <label>Goal Title</label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="modern-input"
              required
            />
          </div>

          <div className="goal-form-field goal-form-date">
            <label>Target Date</label>

            <DateField value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <button
            type="submit"
            className="btn-login"
            style={{
              height: 48,
              alignSelf: "flex-end",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Target size={18} />
            Set Goal
          </button>
        </div>
      </form>

      <div className="goal-list">
        {goals.length === 0 && (
          <p className="empty-state">No goals yet. Set one above!</p>
        )}

        {goals.map((goal) => (
          <div key={goal.id} className="goal-item">
            <div className="goal-header">
              <div>
                <h3 className="goal-title">{goal.title}</h3>

                <div className="goal-date">
                  <Calendar size={14} />
                  {goal.target_date || "No target date"}
                </div>
              </div>

              <div className="goal-actions">
                <button
                  type="button"
                  onClick={() => setEditingGoal({ ...goal })}
                  className="edit-btn"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(goal)}
                  className="delete-btn"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="goal-progress-row">
              <input
                type="range"
                min="0"
                max="100"
                value={goal.progress || 0}
                onChange={(e) => updateProgress(goal.id, e.target.value)}
                className="goal-slider"
              />

              <span className="goal-percent">{goal.progress || 0}%</span>
            </div>
          </div>
        ))}
      </div>

      {editingGoal && (
        <div className="edit-form-overlay" onClick={() => setEditingGoal(null)}>
          <div className="edit-form-card" onClick={(e) => e.stopPropagation()}>
            <div className="edit-form-header">
              <h3>Edit Goal</h3>

              <button
                type="button"
                onClick={() => setEditingGoal(null)}
                className="edit-btn"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="input-group">
                <label>Title</label>

                <input
                  className="modern-input"
                  value={editingGoal.title || ""}
                  onChange={(e) =>
                    setEditingGoal({
                      ...editingGoal,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="input-group">
                <label>Target Date</label>

                <DateField
                  value={editingGoal.target_date || ""}
                  onChange={(e) =>
                    setEditingGoal({
                      ...editingGoal,
                      target_date: e.target.value,
                    })
                  }
                />
              </div>

              <div className="input-group">
                <label>Progress: {editingGoal.progress || 0}%</label>

                <input
                  type="range"
                  min="0"
                  max="100"
                  className="goal-slider"
                  value={editingGoal.progress || 0}
                  onChange={(e) =>
                    setEditingGoal({
                      ...editingGoal,
                      progress: parseInt(e.target.value, 10),
                    })
                  }
                />
              </div>

              <div className="edit-form-actions">
                <button
                  type="button"
                  onClick={() => setEditingGoal(null)}
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
        title="Delete Goal"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete Goal"
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
