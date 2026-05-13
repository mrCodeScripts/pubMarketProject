import React from "react";

export const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  id,
  rightElement,
  disabled = false,
}: {
  label: string;
  type?: string;
  placeholder: string;
  error?: string;
  id?: string;
  rightElement?: React.ReactNode;
  value: any;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
    <div style={{ position: "relative" }}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "10px 14px",
          paddingRight: rightElement ? 44 : 14,
          border: `1px solid ${error ? "var(--pm-red-400)" : "var(--pm-stone-300)"}`,
          borderRadius: 8,
          fontSize: 14,
          color: "var(--pm-stone-900)",
          background: "white",
          outline: "none",
          transition: "border-color 0.15s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--pm-green-500)")}
        onBlur={(e) =>
          (e.target.style.borderColor = error
            ? "var(--pm-red-400)"
            : "var(--pm-stone-300)")
        }
      />
      {rightElement && (
        <div
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: "var(--pm-stone-400)",
            fontSize: 16,
          }}
        >
          {rightElement}
        </div>
      )}
    </div>
    {error && (
      <p style={{ fontSize: 12, color: "var(--pm-red-600)", marginTop: 4 }}>
        {error}
      </p>
    )}
  </div>
);
