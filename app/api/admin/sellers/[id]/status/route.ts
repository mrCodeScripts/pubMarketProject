import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  approveSellerProfile,
  rejectSellerProfile,
} from "@/lib/utils/query-functions/queries";

export async function PATCH(
  req: NextRequest,
  // FIXED SYNTAX: The second argument is an object containing a Promise
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();

    // 1. Await the params properly
    const resolvedParams = await params;
    const id = resolvedParams.id;

    console.log("ID CHECK: ", id);

    if (!id || id === "undefined") {
      return NextResponse.json(
        { error: "Invalid ID parameter" },
        { status: 400 },
      );
    }

    const { status, reason } = await req.json();

    // 2. Authenticate & Check Admin Role
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 3. Route logic
    let result;
    if (status === "approved") {
      result = await approveSellerProfile(id, user.id);
    } else if (status === "rejected") {
      if (!reason) {
        return NextResponse.json(
          { error: "Rejection reason is required" },
          { status: 400 },
        );
      }
      result = await rejectSellerProfile(id, reason);
    } else {
      return NextResponse.json(
        { error: "Invalid status type" },
        { status: 400 },
      );
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error: any) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
