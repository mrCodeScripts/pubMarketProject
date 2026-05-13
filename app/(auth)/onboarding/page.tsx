"use client";

import { InputEventHandler, useState } from "react";
import { PROVINCES, CITIES, BARANGAYS, ENV } from "@/lib/constants";
import { PubMarketLogo } from "@/components/custom/logo/pubMarket-logo-component";
import { Input } from "@/components/custom/input/input-component";
import { Select } from "@/components/custom/select/select-component";
import { Button } from "@/components/custom/button/button-component";
import { Alert } from "@/components/custom/alert/alert-component";
import {
  PageLayout,
  validate,
} from "@/components/custom/form/authentication-form/form-components";
import { useRouter } from "next/navigation";
import { APIResponse, DbProfile } from "@/lib/types";

export default function OnboardingPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    province: "",
    city: "",
    barangay: "",
    postal_code: "",
    avatar_url: "", // Can be integrated with an uploader later
    terms: false,
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [step, setStep] = useState(1);

  // Step 1: Basic Info
  const schema1 = {
    full_name: { required: true, label: "Full name" },
    phone: { required: true, phone: true, label: "Phone number" },
    postal_code: { required: true, label: "Postal code" },
  };

  // Step 2: Location Info
  const schema2 = {
    province: { required: true, label: "Province" },
    city: { required: true, label: "City" },
    barangay: { required: true, label: "Barangay" },
  };

  const handleNext = () => {
    const errs = validate(schema1, form);
    setErrors(errs);
    if (!Object.keys(errs).length) {
      setAlert(null);
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    const errs = validate(schema2, form);
    if (!form.terms) errs.terms = "You must agree to the terms and conditions";
    setErrors(errs);

    if (Object.keys(errs).length) return;

    setLoading(true);
    setAlert(null);

    try {
      const response = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: form.full_name,
          phone: form.phone,
          province: form.province,
          city: form.city,
          barangay: form.barangay,
          postal_code: form.postal_code,
          avatar_url: form.avatar_url,
        }),
      });

      const result: APIResponse<DbProfile> = await response.json();

      if (result.success) {
        setAlert({
          type: "success",
          message: "Profile updated! Taking you to your dashboard...",
        });

        setTimeout(() => {
          router.push(ENV.CUSTOMER_DASHBOARD_PAGE);
        }, 1500);
      } else {
        setAlert({
          type: "error",
          message: result.error || "Failed to save profile details.",
        });
        setLoading(false);
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "A network error occurred. Please try again.",
      });
      setLoading(false);
    }
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
                Complete your profile
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--pm-stone-500)",
                  margin: "4px 0 0",
                }}
              >
                {step === 1 ? "Identification" : "Shipping & Location"}
              </p>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2].map((s) => (
                <div
                  key={s}
                  style={{
                    width: 28,
                    height: 4,
                    borderRadius: 9,
                    background:
                      step >= s ? "var(--pm-green-500)" : "var(--pm-stone-200)",
                    transition: "background 0.3s",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} />}

        {step === 1 && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <Input
              id="full_name"
              label="Full name"
              value={form.full_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm({ ...form, full_name: e.target.value })
              }
              placeholder="Juan dela Cruz"
              error={errors.full_name}
            />
            <Input
              id="phone"
              label="Phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="09123456789"
              error={errors.phone}
            />
            <Input
              id="postal_code"
              label="Postal code"
              value={form.postal_code}
              onChange={(e) =>
                setForm({ ...form, postal_code: e.target.value })
              }
              placeholder="7016"
              error={errors.postal_code}
            />
            <Button fullWidth onClick={handleNext}>
              Continue to Location →
            </Button>
          </div>
        )}

        {step === 2 && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <Select
              id="province"
              label="Province"
              value={form.province}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setForm({
                  ...form,
                  province: e.target.value,
                  city: "",
                  barangay: "",
                })
              }
              options={PROVINCES}
              error={errors.province}
              disabled={false}
            />
            <Select
              id="city"
              label="City / Municipality"
              value={form.city}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setForm({ ...form, city: e.target.value, barangay: "" })
              }
              options={cities}
              disabled={!form.province}
              error={errors.city}
            />
            <Select
              id="barangay"
              label="Barangay"
              value={form.barangay}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setForm({ ...form, barangay: e.target.value })
              }
              options={BARANGAYS}
              disabled={!form.city}
              error={errors.barangay}
            />

            <div style={{ marginBottom: 4 }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={(e) =>
                    setForm({ ...form, terms: e.target.checked })
                  }
                  style={{
                    marginTop: 4,
                    accentColor: "var(--pm-green-600)",
                    width: 16,
                    height: 16,
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--pm-stone-600)",
                    lineHeight: 1.5,
                  }}
                >
                  I confirm that the address provided is accurate and I agree to
                  the{" "}
                  <span
                    style={{ color: "var(--pm-green-600)", fontWeight: 500 }}
                  >
                    Terms of Service
                  </span>
                </span>
              </label>
              {errors.terms && (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--pm-red-600)",
                    marginTop: 4,
                    marginLeft: 26,
                  }}
                >
                  {errors.terms}
                </p>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <Button variant="outline" onClick={() => setStep(1)}>
                ← Back
              </Button>
              <Button fullWidth loading={loading} onClick={handleSubmit}>
                Finish Setup
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
