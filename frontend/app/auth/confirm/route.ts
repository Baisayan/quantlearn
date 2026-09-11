import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { getSafeRedirectPath } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  const code = request.nextUrl.searchParams.get("code");
  const nextPath = getSafeRedirectPath(request.nextUrl.searchParams.get("next"));

  try {
    const supabase = await createClient();
    let error: Error | null = null;

    if (tokenHash && type) {
      const result = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
      error = result.error;
    } else if (code) {
      const result = await supabase.auth.exchangeCodeForSession(code);
      error = result.error;
    } else {
      error = new Error("The confirmation link is incomplete.");
    }

    if (!error) {
      return NextResponse.redirect(new URL(nextPath, request.url));
    }
  } catch {
    // The login page below presents a safe, user-facing error.
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("error", "The confirmation link is invalid or has expired.");
  return NextResponse.redirect(loginUrl);
}
