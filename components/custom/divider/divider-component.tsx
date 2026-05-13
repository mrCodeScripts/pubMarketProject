"use client";

export const Divider = ({ text }) => (
  <div
    style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}
  >
    <div style={{ flex: 1, height: 1, background: "var(--pm-stone-200)" }} />
    <span style={{ fontSize: 12, color: "var(--pm-stone-400)" }}>{text}</span>
    <div style={{ flex: 1, height: 1, background: "var(--pm-stone-200)" }} />
  </div>
);
