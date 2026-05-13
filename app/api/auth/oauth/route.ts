import { NextResponse } from "next/server";
import { signInWithGoogle, signInWithFacebook } from "@/lib/supabase/actions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider");

  let result;

  if (provider === "google") {
    result = await signInWithGoogle();
  } else if (provider === "facebook") {
    result = await signInWithFacebook();
  } else {
    return NextResponse.json(
      { success: false, error: "Invalid provider" },
      { status: 400 },
    );
  }

  if (result.success) {
    return NextResponse.json(result);
  }

  return NextResponse.json(result, { status: 500 });
}
