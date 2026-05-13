import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { ENV } from "./lib/constants";

export async function middleware(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request });
  const supabase = await createClient();

  // We use getSession here because we need the 'amr' metadata for recovery checks
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;
  const path = request.nextUrl.pathname;

  // Check if the user session came from a password reset link
  const isRecovery = session?.amr?.some((m) => m.method === "recovery");

  // 1. ROUTE CATEGORIES
  const isAuthPage =
    path.startsWith(ENV.AUTH_LOGIN_PAGE) ||
    path.startsWith(ENV.AUTH_REGISTER_PAGE);

  const isPublicPage =
    isAuthPage ||
    path.startsWith(ENV.AUTH_FORGOTPASSWORD_PAGE) ||
    path.startsWith("/reset-password") ||
    path === "/";

  // 2. RECOVERY TRAP: Force users in recovery mode to stay on the reset page
  if (user && isRecovery && path !== "/reset-password") {
    return NextResponse.redirect(new URL("/reset-password", request.url));
  }

  // 3. GUEST GUARD: Redirect to login if trying to access protected routes
  if (!user && !isPublicPage) {
    return NextResponse.redirect(new URL(ENV.AUTH_LOGIN_PAGE, request.url));
  }

  // 4. AUTH GUARD: Redirect logged-in users away from Login/Register
  if (user && isAuthPage) {
    return NextResponse.redirect(
      new URL(ENV.CUSTOMER_DASHBOARD_PAGE, request.url),
    );
  }

  // 5. ONBOARDING & DASHBOARD LOGIC
  if (user && !isAuthPage) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("completed_onboarding")
      .eq("id", user.id)
      .single();

    const isOnboardingPage = path === ENV.AUTH_ONBOARDING_PAGE;

    if (profile?.completed_onboarding === false && !isOnboardingPage) {
      return NextResponse.redirect(
        new URL(ENV.AUTH_ONBOARDING_PAGE, request.url),
      );
    }

    if (profile?.completed_onboarding === true && isOnboardingPage) {
      return NextResponse.redirect(
        new URL(ENV.CUSTOMER_DASHBOARD_PAGE, request.url),
      );
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
