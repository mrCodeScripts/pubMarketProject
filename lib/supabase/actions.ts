"use server";

import { createClient } from "@/lib/supabase/server";
import { AuthResponse, APIResponse, OnboardingPayload } from "@/lib/types";
import { ENV } from "@/lib/constants";
// ============================================================================
// HELPERS
// ============================================================================

/**
 * Fetch a user's profile from the public profiles table.
 * Used internally after auth operations.
 */
async function fetchProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return { profile: data, error };
}

// ============================================================================
// EMAIL / PASSWORD AUTH
// ============================================================================

/**
 * SIGN UP
 * Creates an auth user. The DB trigger `handle_new_user` automatically
 * inserts a row into `profiles` with id, full_name, and email.
 * If email confirmation is enabled, returns a message to check email.
 * Otherwise returns the user + profile directly.
 */
export async function signUpWithEmailPassword(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const supabase = await createClient();

  const origin = ENV.BASE_PATH || "http://localhost:3000";
  const callback = ENV.API_AUTH_CALLBACK_ROUTE || "/api/auth/callback";

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}${callback}`,
    },
  });

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message ?? "Sign up failed.",
    };
  }

  // Email confirmation required — no session yet
  if (!authData.session) {
    return {
      success: true,
      message: "Please check your email to confirm your account.",
    };
  }

  // Email confirmation disabled — session is live, fetch profile
  const { profile, error: profileError } = await fetchProfile(authData.user.id);
  if (profileError || !profile) {
    return {
      success: false,
      error: "Account created but profile could not be loaded. Try signing in.",
    };
  }

  return {
    success: true,
    message: "Account created successfully.",
    data: {
      user: authData.user,
      role: profile.role,
      redirectTo: "/onboarding", // caller decides what to do with this
    },
  };
}

/**
 * SIGN IN
 * Authenticates the user, then fetches the matching profile row.
 * Suspended accounts still return success=false.
 */
export async function signInWithEmailPassword(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message ?? "Authentication failed.",
    };
  }

  const { profile, error: profileError } = await fetchProfile(authData.user.id);
  if (profileError || !profile) {
    return {
      success: false,
      error: "Authenticated, but profile record is missing. Contact support.",
    };
  }

  if (profile.is_suspended) {
    return {
      success: false,
      error: "Your account has been suspended. Contact support.",
    };
  }

  // Determine redirect based on role and onboarding state
  // let redirectTo = "/";
  // if (profile.role === "admin") redirectTo = "/admin/overview";
  // else if (profile.role === "seller") redirectTo = "/seller/dashboard";
  // else if (!profile.province) redirectTo = "/onboarding"; // incomplete profile

  return {
    success: true,
    message: "Login successful.",
    // data: {
    // user: authData.user,
    // role: profile.role,
    // redirectTo,
    // },
  };
}

// ============================================================================
// OAUTH PROVIDERS
// ============================================================================

async function getOAuthUrl(
  provider: "google" | "facebook",
): Promise<APIResponse<{ url: string }>> {
  const supabase = await createClient();
  const origin = ENV.BASE_PATH || "http://localhost:3000";
  const callback = `${origin}${ENV.API_AUTH_CALLBACK_ROUTE || "/api/auth/callback"}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${callback}?provider=${provider}`,
      queryParams:
        provider === "google"
          ? {
              access_type: "offline",
              prompt: "consent",
            }
          : {
              auth_type: "reauthenticate", // Facebook equivalent if needed
            },
    },
  });

  if (error || !data.url) {
    return {
      success: false,
      error: error?.message ?? `Failed to initialize ${provider} sign-in.`,
    };
  }

  return {
    success: true,
    extraPayload: { url: data.url },
  };
}

export async function signInWithGoogle() {
  return getOAuthUrl("google");
}

export async function signInWithFacebook() {
  return getOAuthUrl("facebook");
}

// ============================================================================
// SIGN OUT
// ============================================================================

/**
 * SIGN OUT
 * Destroys the Supabase session server-side.
 */
export async function signOut(): Promise<APIResponse> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      error: error.message ?? "Sign out failed.",
    };
  }

  return {
    success: true,
    message: "Signed out successfully.",
  };
}

// ============================================================================
// ONBOARDING — PROFILE COMPLETION
// ============================================================================

/**
 * COMPLETE PROFILE ONBOARDING
 * Called after signup (email or OAuth) when the user lands on /onboarding.
 * Updates the profile row that the trigger already created.
 * Handles: full_name, phone, province, city, barangay, postal_code, avatar_url.
 *
 * Province/city/barangay are plain text strings here (from PSGC API or
 * whatever dropdown you use on the frontend). Store the names, not codes,
 * so they're readable everywhere without joins.
 */
export async function completeOnboarding(
  payload: OnboardingPayload,
): Promise<APIResponse> {
  const supabase = await createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user) {
    return {
      success: false,
      error: "Not authenticated.",
    };
  }

  // Strip undefined keys so we don't accidentally null out existing data
  const updates: Partial<OnboardingPayload> = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined && v !== ""),
  );

  if (Object.keys(updates).length === 0) {
    return {
      success: false,
      error: "No fields provided to update.",
    };
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (updateError) {
    return {
      success: false,
      error: updateError.message ?? "Failed to save profile.",
    };
  }

  return {
    success: true,
    message: "Profile updated successfully.",
  };
}

/**
 * UPDATE PROFILE (post-onboarding, general settings page)
 * Same as onboarding but separated for clarity.
 * Avatar upload should be done separately via Supabase Storage,
 * then pass the resulting URL here as avatar_url.
 */
export async function updateProfile(
  payload: OnboardingPayload,
): Promise<APIResponse> {
  // Identical logic — keeping separate so you can add different
  // validation rules later (e.g., phone format check)
  return completeOnboarding(payload);
}

// ============================================================================
// AVATAR UPLOAD
// ============================================================================

/**
 * UPLOAD AVATAR
 * Uploads a file to Supabase Storage under avatars/{userId}/avatar.{ext}
 * and updates the profile's avatar_url.
 *
 * Call this from the client after getting the File object from an input.
 * Returns the public URL on success.
 */
export async function uploadAvatar(
  file: File,
): Promise<APIResponse<{ avatar_url: string }>> {
  const supabase = await createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user) {
    return { success: false, error: "Not authenticated." };
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `avatars/${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("pubmarket-avatars") // make sure this bucket exists in your Supabase project
    .upload(path, file, { upsert: true });

  if (uploadError) {
    return {
      success: false,
      error: uploadError.message ?? "Avatar upload failed.",
    };
  }

  const { data: urlData } = supabase.storage
    .from("pubmarket-avatars")
    .getPublicUrl(path);

  const avatar_url = urlData.publicUrl;

  // Persist to profile
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url })
    .eq("id", user.id);

  if (updateError) {
    return {
      success: false,
      error: "Avatar uploaded but profile update failed.",
    };
  }

  return {
    success: true,
    message: "Avatar updated.",
    data: { avatar_url },
  };
}

// ============================================================================
// PASSWORD RESET
// ============================================================================

/**
 * REQUEST PASSWORD RESET
 * Sends a reset email via Supabase Auth.
 */
export async function requestPasswordReset(
  email: string,
): Promise<APIResponse> {
  const supabase = await createClient();

  const origin = ENV.BASE_PATH || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });

  if (error) {
    return {
      success: false,
      error: error.message ?? "Failed to send reset email.",
    };
  }

  // Always return success — don't leak whether email exists
  return {
    success: true,
    message: "If that email exists, a reset link has been sent.",
  };
}

/**
 * UPDATE PASSWORD
 * Called on the /reset-password page after the user follows the email link.
 * Supabase sets a temporary session from the link params automatically.
 */
export async function updatePassword(
  newPassword: string,
): Promise<APIResponse> {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return {
      success: false,
      error: error.message ?? "Password update failed.",
    };
  }

  return {
    success: true,
    message: "Password updated successfully.",
  };
}

// ============================================================================
// SESSION UTILS
// ============================================================================

/**
 * GET CURRENT SESSION
 * Useful for server components that need the user + profile in one call.
 */
export async function getCurrentSession(): Promise<
  APIResponse<{ user: unknown; profile: unknown; role: string }>
> {
  const supabase = await createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user) {
    return { success: false, error: "No active session." };
  }

  const { profile, error: profileError } = await fetchProfile(user.id);
  if (profileError || !profile) {
    return { success: false, error: "Session valid but profile missing." };
  }

  return {
    success: true,
    data: {
      user,
      profile,
      role: profile.role,
    },
  };
}
