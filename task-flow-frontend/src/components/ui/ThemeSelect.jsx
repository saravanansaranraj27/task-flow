import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export default function ThemeSelect({ value, onChange, options, ariaLabel }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected =
    options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={`theme-select ${open ? "is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="theme-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selected?.label}</span>
        <ChevronDown size={17} aria-hidden="true" />
      </button>

      {open && (
        <div
          className="theme-select-menu"
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                className={`theme-select-option ${active ? "is-selected" : ""}`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <span>{option.label}</span>
                {active && <Check size={16} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
