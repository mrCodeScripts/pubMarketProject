"use client";

import { useState } from "react";
import { PROVINCES, CITIES, BARANGAYS } from "@/constants";
import { PubMarketLogo } from "@/components/custom/logo/pubMarket-logo-component";
import { Card } from "@/components/custom/card/card-component";
import { Input } from "@/components/custom/input/input-component";
import { Select } from "@/components/custom/select/select-component";
import { Button } from "@/components/custom/button/button-component";
import { Divider } from "@/components/custom/divider/divider-component";
import { Alert } from "@/components/custom/alert/alert-component";
import { createClient } from "@/lib/supabase/client";
import {
  PageLayout,
  validate,
} from "@/components/custom/form/authentication-form/form-components";
import { useRouter } from "next/navigation";
import { ENV } from "@/lib/constants";
import { signUpWithEmailPassword } from "@/lib/supabase/actions";
import GoogleIcon from "@/components/custom/icon/Google";
import FacebookIcon from "@/components/custom/icon/Facebook";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [alert, setAlert] = useState(null);
  const [step, setStep] = useState(1);

  const schema1 = {
    email: { required: true, email: true, label: "Email" },
    password: { required: true, minLength: 8, label: "Password" },
    confirm: { required: true, match: "password", label: "Confirm password" },
  };

  const handleSubmit = async () => {
    // const d = await createClient();
    // console.log(d);

    console.log(true);
    const errs = validate(schema1, form);
    // if (!form.terms) errs.terms = "You must agree to the terms";
    // setErrors(errs);
    // if (Object.keys(errs).length) return;
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });
    const data = await res.json();
    console.log(data);

    // setTimeout(() => {
    //   setLoading(false);
    //   setAlert({
    //     type: "success",
    //     message: "Account created! Redirecting to your dashboard...",
    //   });
    // }, 1600);
  };

  const cities = CITIES[form.province] || [];

  return (
    <PageLayout>
      <div style={{ marginBottom: 28 }}>
        <PubMarketLogo size="lg" />
      </div>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          border: "1px solid var(--pm-stone-200)",
          boxShadow: "0 4px 24px -4px rgba(0,0,0,0.08)",
          padding: "2rem",
          width: "100%",
          maxWidth: 480,
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--pm-stone-900)",
                  margin: 0,
                  fontFamily: "'Georgia', serif",
                }}
              >
                Create account
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--pm-stone-500)",
                  margin: "4px 0 0",
                }}
              >
                {step === 1 ? "Personal details" : "Location & contact"}
              </p>
            </div>
          </div>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} />}

        <div>
          <Input
            id="email"
            label="Email address"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            error={errors.email}
          />
          <Input
            id="password"
            label="Password"
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
                  color: "var(--pm-stone-400)",
                  userSelect: "none",
                }}
              >
                {showPass ? "Hide" : "Show"}
              </span>
            }
          />
          <Input
            id="confirm"
            label="Confirm password"
            type="password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            placeholder="Repeat your password"
            error={errors.confirm}
          />
          <Button
            fullWidth
            variant="primary"
            loading={false}
            loadingType="spinner-with-children"
            onClick={handleSubmit}
          >
            Continue
          </Button>
          <Divider text="or continue with" />
          <div className="flex flex-col gap-3">
            <Button
              fullWidth
              loading={false}
              variant="outline"
              loadingType="spinner-with-children"
              onClick={() => {}}
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            <Button
              fullWidth
              loadingType="spinner-with-children"
              loading={false}
              variant="outline"
              onClick={() => {}}
            >
              <FacebookIcon />
              Continue with Facebook
            </Button>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 14, color: "var(--pm-stone-500)", marginTop: 20 }}>
        Already have an account?{" "}
        <span
          onClick={() => router.push(ENV.AUTH_LOGIN_PAGE)}
          style={{
            color: "var(--pm-green-600)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Sign in
        </span>
      </p>
    </PageLayout>
  );
}
