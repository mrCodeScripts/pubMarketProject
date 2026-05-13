"use client";

export const Alert = ({ type, message }) => {
  const styles = {
    error: {
      bg: "var(--pm-red-50)",
      border: "var(--pm-red-200)",
      text: "var(--pm-red-700)",
      icon: "⚠",
    },
    success: {
      bg: "var(--pm-green-50)",
      border: "var(--pm-green-200)",
      text: "var(--pm-green-700)",
      icon: "✓",
    },
    info: {
      bg: "oklch(0.96 0.03 220)",
      border: "oklch(0.85 0.06 220)",
      text: "oklch(0.35 0.1 220)",
      icon: "ℹ",
    },
  };
  const s = styles[type];
  return (
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: 8,
        padding: "10px 14px",
        marginBottom: 16,
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
      }}
    >
      <span style={{ color: s.text, fontSize: 14, marginTop: 1 }}>
        {s.icon}
      </span>
      <span style={{ fontSize: 13, color: s.text, lineHeight: 1.5 }}>
        {message}
      </span>
    </div>
  );
};
