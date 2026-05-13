import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createProduct,
  getSellerProfileByUserId,
} from "@/lib/utils/query-functions/queries";

export async function POST(req: Request) {
  const supabase = await createClient();

  // 1. Auth check
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Get seller profile
  const profileRes = await getSellerProfileByUserId(user.id);
  if (!profileRes.success || !profileRes.data) {
    return NextResponse.json(
      { error: `Seller profile not found: ${profileRes.error}` },
      { status: 403 },
    );
  }

  // 3. Parse body
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // 4. Validate required fields
  const missing: string[] = [];
  if (!body.name) missing.push("name");
  if (!body.price) missing.push("price");
  if (!body.stock && body.stock !== 0) missing.push("stock");
  if (missing.length) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 },
    );
  }

  // 5. Build payload
  const seller = profileRes.data;
  const payload = {
    seller_id: seller.id,
    name: body.name as string,
    slug:
      (body.slug as string) ??
      (body.name as string)
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, ""),
    description: (body.description as string) ?? null,
    price: parseFloat(body.price as string),
    stock: parseInt(body.stock as string),
    is_draft: body.is_draft === true,
    is_active: body.is_active === true,
    province: (body.province as string) || seller.province,
    city: (body.city as string) || seller.city,
    barangay: (body.barangay as string) || seller.barangay,
    unit: (body.unit as string) ?? "kg",
    category_id: (body.category_id as string) ?? null,
  };

  console.log(
    "Creating product with payload:",
    JSON.stringify(payload, null, 2),
  );

  // 6. Create product
  const result = await createProduct(payload);

  console.log("createProduct result:", JSON.stringify(result, null, 2));

  if (!result.success || !result.data) {
    return NextResponse.json(
      { error: result.error ?? "Failed to create product" },
      { status: 400 },
    );
  }

  return NextResponse.json(result.data, { status: 201 });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("products")
    .update(body)
    .eq("id", params.id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Update failed" },
      { status: 400 },
    );
  }

  return NextResponse.json(data);
}
