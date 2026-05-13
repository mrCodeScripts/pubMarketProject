"use client";

import { useEffect, useState } from "react";
import { PubMarketLogo } from "@/components/custom/logo/pubMarket-logo-component";
import { Card } from "@/components/custom/card/card-component";
import { Input } from "@/components/custom/input/input-component";
import { Button } from "@/components/custom/button/button-component";
import {
  PageLayout,
  validate,
} from "@/components/custom/form/authentication-form/form-components";
import { useRouter } from "next/navigation";
import { ENV } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client"; // Use your client-side creator

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState<any>({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true); // Airlock state
  const [done, setDone] = useState(false);

  // 1. AIRLOCK CHECK: Ensure user has a recovery session
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // No session found? Kicked to login.
        router.replace(ENV.AUTH_LOGIN_PAGE);
      } else {
        setVerifying(false);
      }
    };
    checkSession();
  }, [router, supabase]);

  const getStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = getStrength(form.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#fbbf24", "#22c55e"][
    strength
  ];

  const handleSubmit = async () => {
    const schema = {
      password: { required: true, minLength: 8, label: "Password" },
      confirm: { required: true, match: "password", label: "Confirm password" },
    };

    const errs = validate(schema, form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ action: "update", password: form.password }),
      });
      const result = await res.json();

      if (result.success) {
        setDone(true);
      } else {
        setErrors({ server: result.error });
      }
    } catch (err) {
      setErrors({ server: "Something went wrong. Try again." });
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <PubMarketLogo size="lg" />
          <p className="mt-4 text-sm text-stone-500 animate-pulse">
            Verifying security link...
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div style={{ marginBottom: 28 }}>
        <PubMarketLogo size="lg" />
      </div>
      <Card>
        {!done ? (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#f0fdf4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <rect
                    x="5"
                    y="11"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="#166534"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M8 11V7a4 4 0 018 0v4"
                    stroke="#166534"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#1c1917",
                  margin: 0,
                  fontFamily: "'Georgia', serif",
                }}
              >
                Set new password
              </h1>
              <p style={{ fontSize: 14, color: "#78716c", margin: "6px 0 0" }}>
                Choose a strong password for your account.
              </p>
            </div>

            {errors.server && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-md border border-red-100">
                {errors.server}
              </div>
            )}

            <Input
              id="new-pass"
              label="New password"
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 8 characters"
              error={errors.password}
              rightElement={
                <span
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    fontSize: 13,
                    color: "#a8a29e",
                    userSelect: "none",
                    cursor: "pointer",
                  }}
                >
                  {showPass ? "Hide" : "Show"}
                </span>
              }
            />

            {form.password && (
              <div style={{ marginTop: -8, marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 4,
                        background: i <= strength ? strengthColor : "#e7e5e4",
                        transition: "background 0.3s",
                      }}
                    />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: strengthColor,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {strengthLabel}
                </p>
              </div>
            )}

            <Input
              id="confirm-pass"
              label="Confirm new password"
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="Repeat your new password"
              error={errors.confirm}
            />

            <div
              style={{
                background: "#fafaf9",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 20,
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "#78716c",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Password must be at least 8 characters and include a mix of
                letters, numbers, and symbols.
              </p>
            </div>

            <Button fullWidth loading={loading} onClick={handleSubmit}>
              Update Password
            </Button>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#f0fdf4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12l5 5L19 7"
                  stroke="#166534"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#1c1917",
                margin: "0 0 8px",
                fontFamily: "'Georgia', serif",
              }}
            >
              Password updated!
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "#78716c",
                margin: "0 0 20px",
                lineHeight: 1.7,
              }}
            >
              Your password has been changed successfully. You can now sign in
              with your new password.
            </p>
            <Button fullWidth onClick={() => router.push(ENV.AUTH_LOGIN_PAGE)}>
              ← Back to Sign In
            </Button>
          </div>
        )}
      </Card>
    </PageLayout>
  );
}
