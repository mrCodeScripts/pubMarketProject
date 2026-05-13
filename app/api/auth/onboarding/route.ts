import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DbProfile } from "@/lib/types";
import { APIResponse } from "@/lib/types";
import { completeOnboarding } from "@/lib/supabase/actions";
import { OnboardingPayload } from "@/lib/types";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    const response: APIResponse = {
      success: false,
      error: "Unauthorized: No active session found.",
    };
    return NextResponse.json(response, { status: 401 });
  }

  try {
    const body = await req.json();

    const updateData: OnboardingPayload = {
      full_name: body.full_name,
      phone: body.phone,
      province: body.province,
      city: body.city,
      barangay: body.barangay,
      postal_code: body.postal_code,
      completed_onboarding: true,
    };

    const onboardingAction = await completeOnboarding(updateData);

    if (onboardingAction.success) {
      // 4. Return the custom API Response
      const response: APIResponse<DbProfile> = {
        success: true,
        message: "Onboarding completed successfully.",
        extraPayload: onboardingAction,
      };

      return NextResponse.json(response, { status: 200 });
    } else {
      const response: APIResponse = {
        success: false,
        error: onboardingAction.error,
      };
      return NextResponse.json(response, { status: 400 });
    }
  } catch (err) {
    const response: APIResponse = {
      success: false,
      error: "Invalid request payload.",
    };
    return NextResponse.json(response, { status: 400 });
  }
}
