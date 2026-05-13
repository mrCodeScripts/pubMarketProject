import { NextResponse } from "next/server";
import { getCategories } from "@/lib/utils/query-functions/queries";
import { APIResponse, DbCategory } from "@/lib/types";

export async function GET() {
  const result = await getCategories();
  return NextResponse.json(result as APIResponse<DbCategory[]>);
}
