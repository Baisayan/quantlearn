import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ action: string }> },
) {
  const { action } = await params;
  if (!["simulate", "grade"].includes(action))
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub)
    return NextResponse.json(
      { error: "Please sign in again." },
      { status: 401 },
    );
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session)
    return NextResponse.json(
      { error: "Please sign in again." },
      { status: 401 },
    );
  const body = await request.text();
  if (body.length > 20000)
    return NextResponse.json(
      { error: "Circuit submission is too large." },
      { status: 413 },
    );
  try {
    const response = await fetch(
      `${process.env.LAB_API_URL || "http://127.0.0.1:8000"}/v1/${action}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body,
        signal: AbortSignal.timeout(90000),
        cache: "no-store",
      },
    );
    const result = await response.json();
    if (!response.ok) {
      const message =
        typeof result.detail === "string"
          ? result.detail
          : "Check your circuit, code and simulation settings.";
      return NextResponse.json({ error: message }, { status: response.status });
    }
    return NextResponse.json(result, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "The simulator could not respond. Check that the Python backend is running, then retry.",
      },
      { status: 503 },
    );
  }
}
