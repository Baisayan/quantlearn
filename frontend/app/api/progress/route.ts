import { NextResponse } from "next/server";
import { course } from "@/lib/learn/content";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub)
    return NextResponse.json(
      { error: "Please sign in again." },
      { status: 401 },
    );
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!course.chapters.some((chapter) => chapter.id === body?.chapterId))
    return NextResponse.json({ error: "Chapter not found." }, { status: 404 });
  const { error: saveError } = await supabase
    .from("lesson_progress")
    .upsert(
      {
        user_id: data.claims.sub,
        chapter_id: body.chapterId,
        last_opened_at: new Date().toISOString(),
      },
      { onConflict: "user_id,chapter_id" },
    );
  if (saveError)
    return NextResponse.json(
      { error: "Reading progress could not be saved." },
      { status: 503 },
    );
  return NextResponse.json(
    { saved: true },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
