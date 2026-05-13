"use client";

import { useState } from "react";
import { PubMarketLogo } from "@/components/custom/logo/pubMarket-logo-component";
import { Card } from "@/components/custom/card/card-component";
import { Input } from "@/components/custom/input/input-component";
import { Button } from "@/components/custom/button/button-component";
import { PageLayout } from "@/components/custom/form/authentication-form/form-components";
import { useRouter } from "next/navigation";
import { ENV } from "@/lib/constants";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    // 1. Client-side Validation
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // 2. Fetch to our Auth API
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request",
          email: email,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setSent(true);
      } else {
        setError(result.error || "Failed to send reset link.");
      }
    } catch (err) {
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div style={{ marginBottom: 28 }}>
        <PubMarketLogo size="lg" />
      </div>
      <Card>
        {!sent ? (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--pm-green-100)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <rect
                    x="2"
                    y="4"
                    width="20"
                    height="16"
                    rx="3"
                    stroke="var(--pm-green-600)"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M2 7l10 7 10-7"
                    stroke="var(--pm-green-600)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--pm-stone-900)",
                  margin: 0,
                  fontFamily: "'Georgia', serif",
                }}
              >
                Forgot password?
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--pm-stone-500)",
                  margin: "6px 0 0",
                  lineHeight: 1.6,
                }}
              >
                No worries! Enter your email and we'll send a reset link.
              </p>
            </div>

            <Input
              id="reset-email"
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              error={error}
            />

            <Button fullWidth loading={loading} onClick={handleSubmit}>
              Send Reset Link
            </Button>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <span
                onClick={() => router.push(ENV.AUTH_LOGIN_PAGE)}
                style={{
                  fontSize: 13,
                  color: "var(--pm-stone-500)",
                  cursor: "pointer",
                }}
              >
                ← Back to login
              </span>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--pm-green-100)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12l5 5L19 7"
                  stroke="var(--pm-green-600)"
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
                color: "var(--pm-stone-900)",
                margin: "0 0 8px",
                fontFamily: "'Georgia', serif",
              }}
            >
              Check your inbox
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--pm-stone-500)",
                lineHeight: 1.7,
                margin: "0 0 8px",
              }}
            >
              We've sent a password reset link to{" "}
              <strong style={{ color: "var(--pm-stone-700)" }}>{email}</strong>
            </p>
            <div
              style={{
                background: "var(--pm-gold-50)",
                border: "1px solid var(--pm-gold-200)",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 20,
                textAlign: "left",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "var(--pm-gold-800)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                📬 <strong>Link sent.</strong> The reset link will expire in 1
                hour. Check your spam folder if you don't see it.
              </p>
            </div>
            {/* Added functionality to the preview button just in case they want to jump there manually */}
            <Button
              variant="outline"
              fullWidth
              onClick={() => router.push("/reset-password")}
            >
              Go to Reset Page
            </Button>
            <div style={{ marginTop: 12 }}>
              <span
                onClick={() => router.push(ENV.AUTH_LOGIN_PAGE)}
                style={{
                  fontSize: 13,
                  color: "var(--pm-stone-500)",
                  cursor: "pointer",
                }}
              >
                ← Back to login
              </span>
            </div>
          </div>
        )}
      </Card>
    </PageLayout>
  );
}
