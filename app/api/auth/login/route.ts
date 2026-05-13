import { NextRequest, NextResponse } from "next/server";
import { signInWithEmailPassword } from "@/lib/supabase/actions";
import { APIResponse } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Basic validation before hitting the action
    if (!email || !password) {
      const response: APIResponse = {
        success: false,
        error: "Email and password are required.",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Use your existing action logic
    const authResult = await signInWithEmailPassword(email, password);

    if (authResult.success) {
      const response: APIResponse = {
        success: true,
        message: authResult.message,
        // extraPayload: authResult.data, // Contains user, role, and redirectTo
      };

      return NextResponse.json(response, { status: 200 });
    } else {
      // Handle business logic failures (wrong pass, suspended, etc.)
      const response: APIResponse = {
        success: false,
        error: authResult.error,
      };

      // 401 is more accurate for auth failures
      return NextResponse.json(response, { status: 401 });
    }
  } catch (err) {
    // Catch-all for malformed JSON or unexpected server crashes
    const response: APIResponse = {
      success: false,
      error: "An unexpected error occurred during login.",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
