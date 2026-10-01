import { useState, useEffect } from "react";
import { StickyNote, Trash2, Pencil, X } from "lucide-react";
import ConfirmDialog from "../../components/ConfirmDialog";
import { noteApi } from "../../api/notes";

const COLORS = ["#ffffff", "#fef3c7", "#dbeafe", "#dcfce7", "#f3e8ff"];

export default function NoteView() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [editingNote, setEditingNote] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchNotes = async () => {
    const data = await noteApi.getAll();
    setNotes(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    const loadNotes = async () => {
      const data = await noteApi.getAll();
      setNotes(Array.isArray(data) ? data : []);
    };

    loadNotes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    await noteApi.create({
      title,
      content,
      color,
    });

    setTitle("");
    setContent("");
    fetchNotes();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingNote) return;

    await noteApi.replace(editingNote.id, {
      title: editingNote.title,
      content: editingNote.content,
      color: editingNote.color,
    });

    setEditingNote(null);
    fetchNotes();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await noteApi.delete(deleteTarget.id);

      setDeleteTarget(null);
      fetchNotes();

      window.dispatchEvent(new CustomEvent("taskflow-data-changed"));
    } catch (err) {
      setDeleteError(err.message || "Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">
        <div className="page-title-icon" style={{ background: "#2563eb" }}>
          <StickyNote size={24} color="white" />
        </div>
        Quick Notes
      </h2>

      <form onSubmit={handleCreate} className="note-form">
        <input
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="modern-input"
          required
        />

        <textarea
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="modern-input task-textarea"
        />

        <div className="note-form-footer">
          <div className="color-picker">
            {COLORS.map((c) => (
              <div
                key={c}
                onClick={() => setColor(c)}
                className={`color-dot ${color === c ? "selected" : ""}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <button
            type="submit"
            className="btn-login"
            style={{
              width: "auto",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <StickyNote size={18} /> Save Note
          </button>
        </div>
      </form>

      <div className="notes-grid">
        {notes.length === 0 && (
          <p className="empty-state">No notes yet. Create one above!</p>
        )}

        {notes.map((note) => (
          <div
            key={note.id}
            className="note-card"
            style={{ backgroundColor: note.color }}
          >
            <div className="note-actions">
              <button
                onClick={() => setEditingNote({ ...note })}
                className="edit-note-btn"
                title="Edit"
              >
                <Pencil size={14} />
              </button>

              <button
                onClick={() => setDeleteTarget(note)}
                className="note-delete"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <h3 className="note-title">{note.title}</h3>
            <p className="note-content">{note.content}</p>
          </div>
        ))}
      </div>

      {editingNote && (
        <div className="edit-form-overlay" onClick={() => setEditingNote(null)}>
          <div className="edit-form-card" onClick={(e) => e.stopPropagation()}>
            <div className="edit-form-header">
              <h3>Edit Note</h3>

              <button onClick={() => setEditingNote(null)} className="edit-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="input-group">
                <label>Title</label>

                <input
                  className="modern-input"
                  value={editingNote.title}
                  onChange={(e) =>
                    setEditingNote({
                      ...editingNote,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="input-group">
                <label>Content</label>

                <textarea
                  className="modern-input task-textarea"
                  value={editingNote.content || ""}
                  onChange={(e) =>
                    setEditingNote({
                      ...editingNote,
                      content: e.target.value,
                    })
                  }
                />
              </div>

              <div className="input-group">
                <label>Color</label>

                <div className="color-picker" style={{ marginTop: 8 }}>
                  {COLORS.map((c) => (
                    <div
                      key={c}
                      onClick={() =>
                        setEditingNote({
                          ...editingNote,
                          color: c,
                        })
                      }
                      className={`color-dot ${
                        editingNote.color === c ? "selected" : ""
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="edit-form-actions">
                <button
                  type="button"
                  onClick={() => setEditingNote(null)}
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
        title="Delete Note"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete Note"
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
