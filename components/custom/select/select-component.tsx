"use client";

export const Select = ({
  label,
  value,
  onChange,
  options,
  id,
  error,
  disabled,
}) => (
  <div style={{ marginBottom: 16 }}>
    <label
      htmlFor={id}
      style={{
        display: "block",
        fontSize: 13,
        fontWeight: 500,
        color: "var(--pm-stone-700)",
        marginBottom: 6,
      }}
    >
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "10px 14px",
        border: `1px solid ${error ? "var(--pm-red-400)" : "var(--pm-stone-300)"}`,
        borderRadius: 8,
        fontSize: 14,
        color: value ? "var(--pm-stone-900)" : "var(--pm-stone-400)",
        background: "white",
        outline: "none",
        appearance: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        boxSizing: "border-box",
      }}
    >
      <option value="">Select {label}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    {error && (
      <p style={{ fontSize: 12, color: "var(--pm-red-600)", marginTop: 4 }}>
        {error}
      </p>
    )}
  </div>
);
