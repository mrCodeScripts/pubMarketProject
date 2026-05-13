"use client";
import { useEffect } from "react";
import { ENV } from "@/lib/constants";

export default function CleanupPage() {
  useEffect(() => {
    // 1. Path A: The Direct Shout (Fastest)
    if (window.opener) {
      try {
        window.opener.postMessage(ENV.SECRET_OAUTH_POPUP_WINDOW_KEY, "*");
      } catch (e) {
        console.error("Direct connection broken by Facebook");
      }
    }

    // 2. Path B: The Storage Sync (Survivability)
    // This works even if window.opener is null
    localStorage.setItem(
      ENV.SECRET_OAUTH_POPUP_WINDOW_KEY,
      Date.now().toString(),
    );

    // 3. Close the window
    window.close();

    // 4. Fail-safe: If window doesn't close, redirect to dashboard
    const timeout = setTimeout(() => {
      window.location.href = ENV.CUSTOMER_DASHBOARD_PAGE;
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex h-screen items-center justify-center font-sans">
      <p className="text-green-600 font-medium animate-pulse">
        Finalizing authentication...
      </p>
    </div>
  );
}
