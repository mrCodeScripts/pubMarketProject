import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/utils/query-functions/queries";

export async function GET() {
  const result = await getCurrentProfile();

  if (!result.success) {
    return NextResponse.json(result, { status: 401 });
  }

  return NextResponse.json(result, { status: 200 });
}
