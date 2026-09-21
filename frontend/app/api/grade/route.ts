import { NextResponse } from "next/server";
import { course } from "@/lib/learn/content";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  }
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getClaims();
  if (authError || !auth?.claims?.sub)
    return NextResponse.json(
      { error: "Please sign in again." },
      { status: 401 },
    );

  let body;
  try {
    const text = await request.text();
    if (text.length > 8000)
      return NextResponse.json(
        { error: "Submission is too large." },
        { status: 413 },
      );
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }
  const chapter = course.chapters.find(
    (chapter) => chapter.id === body?.chapterId,
  );
  if (!chapter)
    return NextResponse.json({ error: "Chapter not found." }, { status: 404 });
  const answers = body.answers;
  if (
    body.read !== true ||
    body.version !== chapter.quiz.version ||
    typeof body.attemptId !== "string" ||
    !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(body.attemptId) ||
    !answers ||
    typeof answers !== "object" ||
    Array.isArray(answers) ||
    Object.keys(answers).length !== chapter.quiz.questions.length ||
    chapter.quiz.questions.some(
      (q) => !q.options.some((option) => option.id === answers[q.id]),
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Answer every quiz question and confirm you have read the lesson. Reload if the quiz has changed.",
      },
      { status: 400 },
    );
  }
  const { data, error } = await supabase.rpc("submit_learn_quiz", {
    p_chapter_id: chapter.id,
    p_version: chapter.quiz.version,
    p_answers: answers,
    p_attempt_id: body.attemptId,
    p_read: true,
  });
  if (error)
    return NextResponse.json(
      {
        error:
          error.code === "22023"
            ? error.message
            : "Your quiz could not be saved. Please try again.",
      },
      { status: error.code === "22023" ? 400 : 503 },
    );
  return NextResponse.json(
    {
      ...data,
      feedback: chapter.quiz.questions.map((q) => ({
        id: q.id,
        correctOptionId: q.correctOptionId,
        explanation: q.explanation,
      })),
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
