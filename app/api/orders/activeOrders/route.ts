import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { mockOrderSummaries } from "@/lib/mockup/pubMarket-data-mockup";

export async function GET () {
    // Simulate fetching of data
    // Use functions for fetching active orders later on...
    await new Promise(res => setTimeout(res, 3000));
    const activeOrders =mockOrderSummaries 
    .filter((o) => !["delivered", "cancelled"].includes(o.status))
    .slice(0, 3);
    // Simulate if statements here
    return NextResponse.json({success: true, data: activeOrders}, {status: 200});
}