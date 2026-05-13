import { mockFeaturedProducts } from "@/lib/mockup/pubMarket-data-mockup";
import { NextResponse } from "next/server";

export async function GET (req: Request) {
    await new Promise(res => setTimeout(res, 3000));
    // Simulate loading and sending of data
    return NextResponse.json({success: true, data: mockFeaturedProducts }, {status: 200})
}