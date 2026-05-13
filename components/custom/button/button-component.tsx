"use client";

import React from "react"; // Make sure React is imported for types

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled: boolean;
  variant?:
    | "primary"
    | "outline"
    | "ghost"
    | "googleProvider"
    | "facebookProvider";
  loading?: boolean;
  loadingType?: "full-loading" | "spinner-only" | "spinner-with-children"; // Example types
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export const Button = ({
  children,
  onClick,
  variant = "primary",
  loading,
  loadingType = "full-loading",
  fullWidth,
  disabled = false,
  type = "button",
  className,
}: ButtonProps) => {
  const base: React.CSSProperties = {
    padding: "11px 20px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: loading ? "not-allowed" : "pointer",
    border: "none",
    transition: "all 0.15s",
    width: fullWidth ? "100%" : "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    letterSpacing: "0.01em",
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: "var(--pm-green-600)",
      color: "white",
    },
    outline: {
      background: "transparent",
      color: "var(--pm-green-700)",
      border: "1.5px solid var(--pm-green-300)",
    },
    ghost: {
      background: "transparent",
      color: "var(--pm-stone-600)",
      padding: "8px 12px",
    },
    googleProvider: {
      background: "white",
      color: "var(--pm-stone-900)",
      border: "1.5px solid var(--pm-stone-200)",
      padding: "11px 20px",
    },
    facebookProvider: {
      background: "#1877F2",
      color: "white",
      padding: "11px 20px",
    },
  };

  // FIX: Correct Type is React.ReactNode
  let LoadingElement: React.ReactNode = null;

  // FIX: check loadingType instead of loading (since loading is boolean)
  if (loadingType === "full-loading") {
    LoadingElement = (
      <>
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          style={{ animation: "spin 0.8s linear infinite" }}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray="60"
            strokeDashoffset="45"
          />
        </svg>
        Processing...
      </>
    );
  } else if (loadingType === "spinner-only") {
    LoadingElement = (
      <>
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          style={{ animation: "spin 0.8s linear infinite" }}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray="60"
            strokeDashoffset="45"
          />
        </svg>
      </>
    );
  } else if (loadingType === "spinner-with-children") {
    LoadingElement = (
      <>
        {children}
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          style={{ animation: "spin 0.8s linear infinite" }}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray="60"
            strokeDashoffset="45"
          />
        </svg>
      </>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        ...base,
        ...variants[variant],
        opacity: loading ? 0.7 : 1,
      }}
      className={className}
      onMouseEnter={(e) => {
        if (!loading)
          (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.opacity = "1";
      }}
    >
      {/* FIX: Render the variable directly */}
      {loading ? LoadingElement : children}
    </button>
  );
};
