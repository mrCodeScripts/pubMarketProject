"use client";

import { useState, useEffect } from "react";
import { ENV } from "@/lib/constants";
import { PubMarketLogo } from "@/components/custom/logo/pubMarket-logo-component";
import { Card } from "@/components/custom/card/card-component";
import { Input } from "@/components/custom/input/input-component";
import { Button } from "@/components/custom/button/button-component";
import { Divider } from "@/components/custom/divider/divider-component";
import { Alert } from "@/components/custom/alert/alert-component";
import {
  PageLayout,
  validate,
} from "@/components/custom/form/authentication-form/form-components";
import { useRouter } from "next/navigation";
import GoogleIcon from "@/components/custom/icon/Google";
import FacebookIcon from "@/components/custom/icon/Facebook";
import { APIResponse, LoginPayload } from "@/lib/types";
import { isMobileDevice } from "@/lib/utils/helpers/isMobile";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<any>({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [continuewWithGoogle, setContinueWithGoogle] = useState<boolean>(false);
  const [continueWithFacebook, setContinueWithFacebook] =
    useState<boolean>(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const schema = {
    email: { required: true, email: true, label: "Email" },
    password: { required: true, label: "Password" },
  };

  const isBusy = loading || continueWithFacebook || continuewWithGoogle;

  useEffect(() => {
    if (alert?.type === "error" || !alert?.type) return;
    const refreshTimeout = async () => {
      await new Promise((res) => setTimeout(res, 1000));
      router.refresh();
    };
    refreshTimeout();
  }, [alert]);

  const handleSubmit = async () => {
    if (loading) return;

    // Clear previous states
    setErrors({});
    setAlert(null);

    setLoading(true);
    // console.log(result.error);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Ensure we are sending the EXACT current state
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setAlert({ type: "success", message: result.message });
        setLoading(false);
      } else {
        // This is where Supabase/Your Action sends back "Invalid login credentials"
        setAlert({
          type: "error",
          message: result.error || "Login failed. Check your credentials.",
        });
        setLoading(false);
      }
    } catch (err: any) {
      if (err.name === "TypeError" && err.message === "Failed to fetch") return;

      setAlert({
        type: "error",
        message: "Connection error. Please try again.",
      });
      setLoading(false);
    }
  };

  const setLoadingProvider = (
    provider: "google" | "facebook",
    activate: boolean,
  ) => {
    if (provider === "google") setContinueWithGoogle(activate);
    else if (provider === "facebook") setContinueWithFacebook(activate);
  };

  // Inside your LoginPage component
  useEffect(() => {
    // Listener for the Storage Sync (Path B)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ENV.SECRET_OAUTH_POPUP_WINDOW_KEY) {
        localStorage.removeItem(ENV.SECRET_OAUTH_POPUP_WINDOW_KEY);

        // Give Supabase a heartbeat to ensure cookies are written
        setTimeout(() => {
          // Hard redirect to dashboard
          window.location.href = ENV.CUSTOMER_DASHBOARD_PAGE;
        }, 800);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleOAuthSignIn = async (provider: "google" | "facebook") => {
    setLoadingProvider(provider, true);

    // try {
    const res = await fetch(`${ENV.API_AUTH_OAUTH_ROUTE}?provider=${provider}`);
    const result = await res.json();
    if (!result.success) throw new Error(result.error);

    const { url } = result.extraPayload;

    if (isMobileDevice()) {
      window.location.href = url;
    } else {
      const popup = window.open(url, "_blank", "width=550,height=650");

      // Path A: Direct Message Listener
      const messageHandler = (e: MessageEvent) => {
        if (e.data === ENV.SECRET_OAUTH_POPUP_WINDOW_KEY) {
          window.removeEventListener("message", messageHandler);
          window.location.reload();
        }
      };

      window.addEventListener("message", messageHandler);

      // Path C: The Watchdog (The safety net)
      const checkPopupClosed = setInterval(() => {
        if (!popup) return;

        if (popup.closed) {
          clearInterval(checkPopupClosed);
          window.removeEventListener("message", messageHandler);

          // Give Path B (Storage) or Path A (Message) a split second to finish,
          // if not, the watchdog forces the reload.
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      }, 1000);
    }
    // } catch (err) {
    //   console.error(err);
    //   setLoadingProvider(provider, true);
    // }
  };

  return (
    <PageLayout>
      <div style={{ marginBottom: 28 }}>
        <PubMarketLogo size="lg" />
      </div>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "var(--pm-stone-900)",
              margin: 0,
            }}
            className="font-sans!"
          >
            Welcome back
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--pm-stone-500)",
              margin: "4px 0 0",
            }}
            className="font-sans!"
          >
            Sign in to your PubMarket account
          </p>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} />}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: alert ? "16px" : "0",
          }}
        >
          <Input
            id="email"
            label="Email address"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className="font-sans!"
            error={errors.email}
            disable={isBusy}
          />
          <Input
            id="password"
            label="Password"
            type={showPass ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter your password"
            error={errors.password}
            disable={isBusy}
            rightElement={
              <span
                onClick={() => setShowPass(!showPass)}
                style={{
                  fontSize: 13,
                  color: "var(--pm-stone-400)",
                  userSelect: "none",
                  cursor: "pointer",
                }}
              >
                {showPass ? "Hide" : "Show"}
              </span>
            }
          />
        </div>

        <div style={{ textAlign: "right", marginTop: 8, marginBottom: 20 }}>
          <Link
            href="/forgot-password"
            className="font-sans! relative z-[999] block"
            onClick={(e) => {
              e.preventDefault(); // Stop the Link from trying to handle it
              console.log("Navigating...");
              router.push("/forgot-password"); // Force navigation
            }}
            style={{
              fontSize: 13,
              color: "var(--pm-green-600)",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Forgot password?
          </Link>
        </div>

        <Button fullWidth loading={loading} onClick={handleSubmit}>
          Sign In
        </Button>

        <Divider text="or continue with" />
        <div className="flex flex-col gap-3">
          <Button
            fullWidth
            variant="outline"
            loadingType="spinner-with-children"
            disable={isBusy}
            loading={continuewWithGoogle}
            onClick={() => handleOAuthSignIn("google")}
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <Button
            fullWidth
            variant="outline"
            loadingType="spinner-with-children"
            disable={isBusy}
            loading={continueWithFacebook}
            onClick={() => handleOAuthSignIn("facebook")}
          >
            <FacebookIcon />
            Continue with Facebook
          </Button>
        </div>
      </Card>

      <p style={{ fontSize: 14, color: "var(--pm-stone-500)", marginTop: 20 }}>
        Don't have an account?{" "}
        <span
          onClick={() => router.push(ENV.AUTH_REGISTER_PAGE)}
          style={{
            color: "var(--pm-green-600)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Register
        </span>
      </p>
    </PageLayout>
  );
}
