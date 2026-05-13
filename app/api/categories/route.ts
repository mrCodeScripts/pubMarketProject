// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { getCategories } from "@/lib/utils/query-functions/queries";

export async function GET() {
  const result = await getCategories();
  return NextResponse.json(result);
}
