import { NextRequest, NextResponse } from "next/server";
import { updateProfile } from "@/lib/lib/query-functions/queries"; // Adjust path to your actions file
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const payload = await req.json();

    // Call your existing updateProfile action
    const result = await updateProfile(user.id, payload);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
