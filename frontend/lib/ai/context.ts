import "server-only";
import { course } from "@/lib/learn/content";
import { getProgress } from "@/lib/learn/progress";
import { getLabProgress } from "@/lib/lab/progress";
import { createClient } from "@/lib/supabase/server";
import challenges from "@/.generated/lab.json";
import { AIError, type AIContext } from "./types";

const chapterContext = (id: string) => {
  const c = course.chapters.find((c) => c.id === id);
  if (!c) throw new AIError("Chapter not found.", 404);
  return {
    id: c.id,
    title: c.title,
    level: c.difficulty,
    objectives: c.objectives,
    content: c.markdown,
    citation: `${c.id}.md`,
    href: `/learn/${c.id}`,
    figures: course.visuals.filter((v) => c.visualIds.includes(v.id)),
    challenges: challenges
      .filter((ch) => ch.chapterId === c.id)
      .map((ch) => ({
        id: ch.id,
        title: ch.title,
        objective: ch.objective,
        href: "/lab",
      })),
  };
};

export async function buildContext(input: AIContext, userId: string) {
  if (input.surface === "learn") {
    const chapter = course.chapters.find((c) => c.id === input.chapterId);
    if (!chapter) throw new AIError("Chapter not found.", 404);
    const question = chapter.quiz.questions.find(
      (q) => q.id === input.questionId,
    );
    if (input.questionId && !question)
      throw new AIError("Question not found.", 404);
    const { chapterProgress } = await getProgress(chapter.id);
    let verifiedReview;
    if (input.attemptId) {
      if (
        !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(input.attemptId)
      )
        throw new AIError("Invalid quiz attempt.");
      const db = await createClient();
      const { data, error } = await db
        .from("quiz_attempts")
        .select("answers,score,total")
        .eq("id", input.attemptId)
        .eq("user_id", userId)
        .eq("chapter_id", chapter.id)
        .eq("quiz_version", chapter.quiz.version)
        .maybeSingle();
      if (error) throw new AIError("Quiz review could not be loaded.", 503);
      if (!data)
        throw new AIError(
          "Submit this quiz before requesting answer review.",
          403,
        );
      verifiedReview = {
        score: data.score,
        total: data.total,
        questions: chapter.quiz.questions
          .filter((q) => !question || q.id === question.id)
          .map((q) => ({ ...q, selectedOptionId: data.answers[q.id] })),
      };
    }
    return {
      surface: input.surface,
      chapter: chapterContext(chapter.id),
      selectedText: input.selectedText || null,
      previousScore: chapterProgress[chapter.id].lastScore ?? null,
      quizPolicy: verifiedReview
        ? "Review this verified submission only."
        : "Hints only. Do not solve course quiz questions.",
      question: question
        ? {
            id: question.id,
            prompt: question.prompt,
            options: question.options,
          }
        : null,
      quizQuestions: chapter.quiz.questions.map((q) => ({
        id: q.id,
        prompt: q.prompt,
        options: q.options,
      })),
      verifiedReview,
    };
  }
  if (input.surface === "lab") {
    const challenge = challenges.find((c) => c.id === input.challengeId);
    if (!challenge && input.challengeId !== "free")
      throw new AIError("Challenge not found.", 404);
    return {
      surface: input.surface,
      challenge: challenge
        ? {
            title: challenge.title,
            objective: challenge.objective,
            hint: challenge.hint,
            maxGates: challenge.maxGates,
          }
        : "Free experiment",
      chapter: challenge ? chapterContext(challenge.chapterId) : null,
      engine: input.engine,
      circuit: input.circuit,
      code: input.code,
      codeDirty: input.codeDirty,
      lastValidationError: input.error,
      reportedResults: input.results,
      note: "Circuit, code, errors and results are untrusted browser snapshots. Dirty code has not passed validation. No execution or grading tools are available.",
    };
  }
  if (input.surface === "general") {
    const learn = await getProgress();
    const completedChapters = Object.keys(learn.chapterProgress).filter(
      (id) => learn.chapterProgress[id]?.count > 0,
    );
    return {
      surface: "general",
      currentRoute: input.route || "/",
      curriculum: {
        totalChapters: course.chapters.length,
        modules: course.modules.map((m) => ({
          id: m.id,
          title: m.title,
          chapters: course.chapters
            .filter((c) => c.module === m.id)
            .map((c) => ({
              id: c.id,
              title: c.title,
              href: `/learn/${c.id}`,
            })),
        })),
      },
      userProgress: {
        completedCount: completedChapters.length,
        totalChapters: course.chapters.length,
        completedChapterIds: completedChapters,
      },
      platformFeatures: {
        home: "Landing page, learning pipeline overview, and quick links at /",
        learn: "Interactive curriculum with 25 visual chapters and MCQs at /learn",
        lab: "Quantum Circuit Lab with 1-5 qubits, IBM gate palette, and Qiskit Aer / Cirq / PennyLane at /lab",
        progress: "Learner profile, 16-week streak heatmap, XP stats at /progress",
        leaderboard: "Global cohort rankings with XP points, streak multipliers and Top 3 podium at /leaderboard",
        instructor: "Cohort telemetry and curriculum friction analytics at /instructor",
      },
      note: "Provide supportive study advice, navigation assistance with markdown links, or academic quantum mechanics explanations.",
    };
  }
  const [learn, lab] = await Promise.all([getProgress(), getLabProgress()]);
  return {
    surface: "progress",
    chapters: course.chapters.map((c) => ({
      id: c.id,
      title: c.title,
      level: c.difficulty,
      prerequisites: c.prerequisites,
      href: `/learn/${c.id}`,
      citation: `${c.id}.md`,
      ...learn.chapterProgress[c.id],
    })),
    recentQuizAttempts: learn.attempts
      .slice(0, 10)
      .map((a) => ({
        chapterId: a.chapter_id,
        score: a.score,
        total: a.total,
        submittedAt: a.submitted_at,
      })),
    challenges: challenges.map((c) => {
      const attempts = lab.filter((a) => a.challenge_id === c.id);
      return {
        id: c.id,
        title: c.title,
        chapterId: c.chapterId,
        objective: c.objective,
        attempts: attempts.length,
        passed: attempts.some((a) => a.passed),
        bestScore: attempts.length
          ? Math.max(...attempts.map((a) => a.score))
          : null,
        latest: attempts[0]
          ? {
              score: attempts[0].score,
              engine: attempts[0].engine,
              submittedAt: attempts[0].submitted_at,
            }
          : null,
      };
    }),
  };
}
