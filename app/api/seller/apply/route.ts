import { NextRequest, NextResponse } from "next/server";
import { createSellerProfile } from "@/lib/utils/query-functions/queries";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
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

    // --- CHECK FOR EXISTING PROFILE ---
    const { data: existingProfile } = await supabase
      .from("seller_profiles")
      .select("status")
      .eq("user_id", user.id)
      .single();

    if (existingProfile) {
      if (existingProfile.status === "approved") {
        return NextResponse.json(
          {
            success: false,
            error: "ALREADY_APPROVED",
            message: "You are already an approved seller.",
          },
          { status: 400 },
        );
      }
      if (existingProfile.status === "pending") {
        return NextResponse.json(
          {
            success: false,
            error: "PENDING_REVIEW",
            message: "Your application is still under review.",
          },
          { status: 400 },
        );
      }
    }

    const payload = await req.json();

    const result = await createSellerProfile({
      ...payload,
      user_id: user.id,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
