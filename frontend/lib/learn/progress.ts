import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LessonProgress = {
  chapter_id: string;
  last_opened_at: string;
};
export type QuizAttempt = {
  id: string;
  chapter_id: string;
  quiz_version: number;
  score: number;
  total: number;
  submitted_at: string;
};

export async function getProgress() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) redirect("/login");
  const [lessons, attempts] = await Promise.all([
    supabase
      .from("lesson_progress")
      .select("chapter_id,last_opened_at")
      .eq("user_id", data.claims.sub),
    supabase
      .from("quiz_attempts")
      .select("id,chapter_id,quiz_version,score,total,submitted_at")
      .eq("user_id", data.claims.sub)
      .order("submitted_at", { ascending: false }),
  ]);
  if (lessons.error || attempts.error)
    throw new Error(
      "Your learning progress could not be loaded. Please try again.",
    );
  return {
    email: String(data.claims.email ?? ""),
    lessons: lessons.data as LessonProgress[],
    attempts: attempts.data as QuizAttempt[],
  };
}
