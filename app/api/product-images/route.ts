import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { addProductImage } from "@/lib/utils/query-functions/queries";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const result = await addProductImage({
    product_id: body.product_id,
    url: body.url,
    alt_text: body.alt_text ?? null,
    sort_order: body.sort_order ?? 0,
  });

  if (!result.success)
    return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result.data, { status: 201 });
}
