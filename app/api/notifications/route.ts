import { mockCurrentUser, mockNotifications } from "@/lib/mockup/pubMarket-data-mockup";
import { NextResponse } from "next/server";

export async function POST (req: Request) {
    const {id} = await req.json();
    // Simulate loading animatoin
    if (!id) {
        return NextResponse.json({success: false, message: "User id is required!"}, {status: 400});
    }
    const recentNotifs = mockNotifications 
        .filter((n) => n.userId === id!)
        .slice(0, 3);
    await new Promise(res => setTimeout(res, 3000));
    const res = {success: true, data: recentNotifs};
    return NextResponse.json(res, {status: 200});
}