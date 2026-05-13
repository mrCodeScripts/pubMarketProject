"use client";

export const PubMarketLogo = ({ size = "md" }) => {
  const sizes = {
    sm: { icon: 28, text: "text-lg" },
    md: { icon: 36, text: "text-xl" },
    lg: { icon: 44, text: "text-2xl" },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-2.5">
      <div
        style={{
          width: s.icon,
          height: s.icon,
          background: "var(--pm-green-600)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg
          width={s.icon * 0.6}
          height={s.icon * 0.6}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M3 9l9-6 9 6v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9z"
            stroke="white"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9 21V12h6v9"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="8" r="1.5" fill="var(--pm-gold-400)" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span
          style={{
            fontFamily: "'Georgia', serif",
            fontWeight: 700,
            color: "var(--pm-green-700)",
            letterSpacing: "-0.02em",
          }}
          className={s.text}
        >
          Pub<span style={{ color: "var(--pm-gold-600)" }}>Market</span>
        </span>
        <span
          style={{
            fontSize: 10,
            color: "var(--pm-stone-500)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginTop: 1,
          }}
        >
          Fresh. Local. Yours.
        </span>
      </div>
    </div>
  );
};
