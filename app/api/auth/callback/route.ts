import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ENV } from "@/lib/constants";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const provider = searchParams.get("provider"); // Captured from the redirectTo above
  const type = searchParams.get("type");

  if (code) {
    const supabase = await createClient();
    const { data: authData, error: authError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!authError && type === "recovery") {
      return NextResponse.redirect(`${origin}${ENV.AUTH_RESETPASSWORD_PAGE}`);
    }

    if (!authError && authData.user) {
      // 1. Check Onboarding Status
      const { data: profile } = await supabase
        .from("profiles")
        .select("completed_onboarding")
        .eq("id", authData.user.id)
        .single();

      // 2. Determine Destination (if the user is not done with onboarding after code exchange, then we proceed to onboarding later on)
      let nextStep = ENV.CUSTOMER_DASHBOARD_PAGE;
      if (profile && profile.completed_onboarding === false) {
        nextStep = ENV.AUTH_ONBOARDING_PAGE;
      }

      /**
       * 3. POPUP LOGIC vs DIRECT LOGIC
       * If it's a popup flow (usually on Desktop), we MUST send them to
       * the cleanup page to shout the secret and close the window.
       *
       * If we aren't using popups on mobile, we'd check the User Agent here
       * or rely on a 'flow=popup' query param sent from the frontend.
       */
      const isPopup =
        provider == "google" || provider == "facebook" ? true : false; // You can refine this check if needed

      if (isPopup) {
        // Redirect to cleanup, but pass the final destination so the
        // parent window knows where to go after reload if needed.
        return NextResponse.redirect(
          `${origin}${ENV.API_AUTH_CALLBACK_CLEANUP_ROUTE}`,
        );
      }

      // return NextResponse.redirect(`${origin}${nextStep}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
