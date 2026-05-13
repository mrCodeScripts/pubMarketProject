import { NextResponse } from "next/server";
import { requestPasswordReset, updatePassword } from "@/lib/supabase/actions";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, action } = body;

    // 1. Validation for Requesting Email
    if (action === "request") {
      if (!email || !email.includes("@")) {
        return NextResponse.json(
          { success: false, error: "A valid email is required." },
          { status: 400 },
        );
      }
      const result = await requestPasswordReset(email);
      return NextResponse.json(result);
    }

    // 2. Validation for Updating Password
    if (action === "update") {
      if (!password || password.length < 8) {
        return NextResponse.json(
          { success: false, error: "Password must be at least 8 characters." },
          { status: 400 },
        );
      }
      const result = await updatePassword(password);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, error: "Invalid action specified." },
      { status: 400 },
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
}
