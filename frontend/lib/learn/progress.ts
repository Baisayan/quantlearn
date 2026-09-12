import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { course } from "@/lib/learn/content";

type QuizAttempt = {
  id: string;
  chapter_id: string;
  score: number;
  total: number;
  submitted_at: string;
};

export async function getProgress(chapterId?: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) redirect("/login");
  const userId = data.claims.sub;
  const [lessons, attempts] = await Promise.all([
    supabase
      .from("lesson_progress")
      .select("chapter_id")
      .eq("user_id", data.claims.sub)
      .in(
        "chapter_id",
        chapterId ? [chapterId] : course.chapters.map((chapter) => chapter.id),
      ),
    loadAttempts(),
  ]);
  if (lessons.error)
    throw new Error(
      "Your learning progress could not be loaded. Please try again.",
    );
  return {
    email: String(data.claims.email ?? ""),
    lessons: lessons.data,
    attempts,
    chapterProgress: Object.fromEntries(
      course.chapters.map((chapter) => {
        const results = attempts.filter(
          (attempt) => attempt.chapter_id === chapter.id,
        );
        return [chapter.id, {
          count: results.length,
          bestScore: results.length
            ? results.reduce((best, attempt) => Math.max(best, attempt.score), 0)
            : undefined,
          lastScore: results[0]?.score,
          status: results.length
            ? "Completed"
            : lessons.data.some((lesson) => lesson.chapter_id === chapter.id)
              ? "In progress"
              : "Not started",
        }];
      }),
    ),
  };

  async function loadAttempts() {
    const attempts: QuizAttempt[] = [];
    const cutoff = new Date().toISOString();
    // Use the exact count, since the server may cap pages below 500 rows.
    for (;;) {
      let query = supabase
        .from("quiz_attempts")
        .select("id,chapter_id,score,total,submitted_at", { count: "exact" })
        .eq("user_id", userId)
        .lte("submitted_at", cutoff)
        .order("submitted_at", { ascending: false })
        .order("id", { ascending: false });
      if (chapterId) query = query.eq("chapter_id", chapterId);
      const page = await query.range(attempts.length, attempts.length + 499);
      if (page.error || page.count === null)
        throw new Error("Your learning progress could not be loaded. Please try again.");
      if (!page.data.length && attempts.length < page.count)
        throw new Error("Your learning progress changed while loading. Please try again.");
      attempts.push(...page.data);
      if (attempts.length >= page.count) return attempts;
    }
  }
}
