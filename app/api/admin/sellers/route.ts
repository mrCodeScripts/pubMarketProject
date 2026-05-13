import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getAllSellersAdmin } from "@/lib/utils/query-functions/queries";

export async function GET() {
  const supabase = await createClient();

  // Security Check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 403 },
    );
  }

  const result = await getAllSellersAdmin();

  // Transform DB data to match your UI's "SellerWithOwner" shape if necessary
  // For now, we'll return the raw joined data
  return NextResponse.json(result);
}
