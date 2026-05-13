"use client";

export const PageLayout = ({ children }) => (
  <div
    style={{
      minHeight: "100vh",
      background:
        "linear-gradient(145deg, var(--pm-green-50) 0%, white 50%, var(--pm-gold-50) 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: -80,
        right: -80,
        width: 320,
        height: 320,
        borderRadius: "50%",
        background: "var(--pm-green-100)",
        opacity: 0.5,
        zIndex: 0,
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: -60,
        left: -60,
        width: 240,
        height: 240,
        borderRadius: "50%",
        background: "var(--pm-gold-100)",
        opacity: 0.5,
        zIndex: 0,
      }}
    />
    <div
      style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  </div>
);

export function validate(schema, values) {
  const errors = {};
  for (const [field, rules] of Object.entries(schema)) {
    const val = values[field];
    if (rules.required && !val) {
      errors[field] = `${rules.label} is required`;
      continue;
    }
    if (rules.email && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      errors[field] = "Enter a valid email address";
    }
    if (rules.minLength && val && val.length < rules.minLength) {
      errors[field] = `Minimum ${rules.minLength} characters`;
    }
    if (rules.match && val && val !== values[rules.match]) {
      errors[field] = "Passwords do not match";
    }
    if (
      rules.phone &&
      val &&
      !/^(09|\+639)\d{9}$/.test(val.replace(/\s/g, ""))
    ) {
      errors[field] = "Enter a valid PH phone number (e.g. 09xxxxxxxxx)";
    }
  }
  return errors;
}
