"use client";

export const Card = ({ children }) => (
  <div
    style={{
      background: "white",
      borderRadius: 16,
      border: "1px solid var(--pm-stone-200)",
      boxShadow:
        "0 4px 24px -4px rgba(0,0,0,0.08), 0 1px 4px -1px rgba(0,0,0,0.04)",
      padding: "2rem",
      width: "100%",
      maxWidth: 440,
    }}
  >
    {children}
  </div>
);
