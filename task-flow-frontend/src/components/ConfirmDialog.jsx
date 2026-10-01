import { useEffect, useRef } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  error = null,
  onConfirm,
  onCancel,
}) {
  const confirmBtnRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel?.();
      if (e.key === "Enter" && !isLoading) onConfirm?.();

      if (e.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    setTimeout(() => confirmBtnRef.current?.focus(), 50);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onConfirm, onCancel]);

  if (!isOpen) return null;

  const accentColor = variant === "danger" ? "#ef4444" : "#d97706";

  return (
    <div
      className="edit-form-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        ref={modalRef}
        className="edit-form-card confirm-dialog-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "420px" }}
      >
        <div className="edit-form-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: `${accentColor}15`,
                color: accentColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <h3 id="confirm-dialog-title">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="edit-btn"
            disabled={isLoading}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <p
          style={{
            margin: "0 0 24px 0",
            color: "var(--text-secondary)",
            fontSize: "15px",
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>

        {error && (
          <div className="error-message" style={{ marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div className="edit-form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            className="btn-login"
            disabled={isLoading}
            style={{
              background: accentColor,
              minWidth: "100px",
              justifyContent: "center",
            }}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
