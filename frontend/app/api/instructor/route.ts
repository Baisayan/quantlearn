import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { course } from "@/lib/learn/content";
import challenges from "@/.generated/lab.json";

export async function GET() {
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getClaims();

  if (authError || !auth?.claims?.sub) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  // Attempt RPC first
  try {
    const { data, error } = await supabase.rpc("get_instructor_cohort_analytics");
    if (!error && data) {
      return NextResponse.json(data);
    }
  } catch {
    // Fall back to client query if RPC not yet deployed
  }

  // Graceful fallback aggregation
  try {
    const [quizAttemptsRes, labAttemptsRes, lessonProgressRes] = await Promise.all([
      supabase.from("quiz_attempts").select("chapter_id, score, total, user_id, submitted_at").limit(1000),
      supabase.from("lab_attempts").select("challenge_id, engine, passed, score, user_id, submitted_at").limit(1000),
      supabase.from("lesson_progress").select("chapter_id, user_id").limit(1000),
    ]);

    const quizzes = quizAttemptsRes.data || [];
    const labs = labAttemptsRes.data || [];
    const lessons = lessonProgressRes.data || [];

    const activeUsers = new Set([
      ...quizzes.map((q) => q.user_id),
      ...labs.map((l) => l.user_id),
      ...lessons.map((lp) => lp.user_id),
    ]);

    const totalLearners = Math.max(activeUsers.size, 1);
    const totalQuizSubmissions = quizzes.length;
    const avgQuizScorePercent = totalQuizSubmissions
      ? Math.round(
        quizzes.reduce((sum, q) => sum + (q.score / (q.total || 1)) * 100, 0) /
        totalQuizSubmissions,
      )
      : 0;

    const totalLabSubmissions = labs.length;
    const passedLabs = labs.filter((l) => l.passed).length;
    const labPassRate = totalLabSubmissions
      ? Math.round((passedLabs / totalLabSubmissions) * 100)
      : 0;

    // Aggregate by chapter
    const chapterStats = course.chapters.map((ch) => {
      const chapterAttempts = quizzes.filter((q) => q.chapter_id === ch.id);
      const uniqueStudents = new Set(chapterAttempts.map((q) => q.user_id)).size;
      const avgScore = chapterAttempts.length
        ? Math.round(
          chapterAttempts.reduce((sum, q) => sum + (q.score / q.total) * 100, 0) /
          chapterAttempts.length,
        )
        : null;

      return {
        chapter_id: ch.id,
        title: ch.title,
        module: ch.module,
        total_attempts: chapterAttempts.length,
        active_students: uniqueStudents,
        avg_score_percent: avgScore,
      };
    });

    // Aggregate by challenge
    const challengeStats = challenges.map((ch) => {
      const chAttempts = labs.filter((l) => l.challenge_id === ch.id);
      const passedCount = chAttempts.filter((l) => l.passed).length;
      const passRate = chAttempts.length
        ? Math.round((passedCount / chAttempts.length) * 100)
        : null;
      const avgFidelity = chAttempts.length
        ? Math.round(chAttempts.reduce((sum, l) => sum + l.score, 0) / chAttempts.length)
        : null;

      return {
        challenge_id: ch.id,
        title: ch.title,
        total_attempts: chAttempts.length,
        active_students: new Set(chAttempts.map((l) => l.user_id)).size,
        passed_count: passedCount,
        pass_rate: passRate,
        avg_fidelity_score: avgFidelity,
        aer_count: chAttempts.filter((l) => l.engine === "aer").length,
        cirq_count: chAttempts.filter((l) => l.engine === "cirq").length,
        pennylane_count: chAttempts.filter((l) => l.engine === "pennylane").length,
      };
    });

    // Recent activity
    const recentActivity = [
      ...quizzes.map((q) => ({
        type: "quiz" as const,
        title: q.chapter_id,
        score: Math.round((q.score / q.total) * 100),
        submitted_at: q.submitted_at,
      })),
      ...labs.map((l) => ({
        type: "challenge" as const,
        title: l.challenge_id,
        score: l.score,
        submitted_at: l.submitted_at,
      })),
    ]
      .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
      .slice(0, 15);

    return NextResponse.json({
      totalLearners,
      totalQuizSubmissions,
      avgQuizScorePercent,
      totalLabSubmissions,
      labPassRate,
      chapterStats,
      challengeStats,
      recentActivity,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not load instructor analytics." },
      { status: 500 },
    );
  }
}
