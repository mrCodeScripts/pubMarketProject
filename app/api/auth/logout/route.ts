import { NextRequest, NextResponse } from "next/server";
import { signOut } from "@/lib/supabase/actions";

export async function POST(req: NextRequest) {
  const result = await signOut();

  if (result.success) {
    // We return the response so the client knows it's okay to reload/redirect
    return NextResponse.json(result, { status: 200 });
  }

  return NextResponse.json(result, { status: 500 });
}
