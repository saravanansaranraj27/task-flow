import { CalendarDays } from "lucide-react";

export default function DateField({ value, onChange, className = "" }) {
  return (
    <div className={`date-field ${className}`.trim()}>
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="modern-input date-field-input"
      />
      <CalendarDays className="date-field-icon" size={18} aria-hidden="true" />
    </div>
  );
}
