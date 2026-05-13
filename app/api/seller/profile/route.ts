import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSellerProfileByUserId } from "@/lib/utils/query-functions/queries"; // Adjust path to your queries.ts

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Check Auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch Profile using your query helper
    const result = await getSellerProfileByUserId(user.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    // 3. Return the data
    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error("Seller Profile Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
