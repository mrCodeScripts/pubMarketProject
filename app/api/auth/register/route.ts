// app/api/auth/register/route.ts
import { signUpWithEmailPassword } from "@/lib/supabase/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const result = await signUpWithEmailPassword(email, password);
  return NextResponse.json(result);
}
