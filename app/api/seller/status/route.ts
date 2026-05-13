import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getSellerProfileByUserId } from "@/lib/utils/query-functions/queries"; // Adjust path

export async function GET() {
  const supabase = await createClient();

  // 1. Get the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  // 2. Fetch the profile
  const result = await getSellerProfileByUserId(user.id);

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}
