import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Flame, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { course } from "@/lib/learn/content";
import { getProgress } from "@/lib/learn/progress";
import { getLabProgress } from "@/lib/lab/progress";
import challenges from "@/.generated/lab.json";
import { AIPanel } from "@/components/ai/ai-panel";
import { ProfileCard } from "@/components/profile/profile-card";
import { ActivityHeatmap } from "@/components/progress/activity-heatmap";

const eyebrow = "font-mono text-xs font-semibold uppercase tracking-widest";

export default async function ProgressPage() {
  const { email, chapterProgress, attempts } = await getProgress();
  const labAttempts = await getLabProgress();
  const completed = new Set(
    Object.keys(chapterProgress).filter((id) => chapterProgress[id].count),
  );
  const next = course.chapters.find((chapter) => !completed.has(chapter.id));

  // Compute Daily Study Streak from all quiz & lab activity
  const activeDates = new Set([
    ...attempts.map((a) => a.submitted_at.slice(0, 10)),
    ...labAttempts.map((l) => l.submitted_at.slice(0, 10)),
  ]);

  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().slice(0, 10);

  let streak = 0;
  const checkDate = new Date(today);
  const todayStr = formatDate(today);

  // If no action today yet, check yesterday to provide grace period
  if (!activeDates.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (activeDates.has(formatDate(checkDate))) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  const recentDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = formatDate(d);
    const dayName = d.toLocaleDateString("en-US", { weekday: "narrow" });
    return {
      dateStr,
      dayName,
      active: activeDates.has(dateStr),
    };
  });

  // Identify weak areas (< 75% quiz score or unpassed lab challenge)
  const weakChapters = course.chapters.filter((chapter) => {
    const p = chapterProgress[chapter.id];
    return p.count > 0 && (p.bestPercent ?? 100) < 75;
  });

  const weakChallenges = challenges.filter((c) => {
    const results = labAttempts.filter((a) => a.challenge_id === c.id);
    return results.length > 0 && !results.some((a) => a.passed);
  });

  return (
    <main className="w-full space-y-8 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 xl:px-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className={`${eyebrow} text-primary`}>Quantum Learner Dashboard</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
              Every chapter
            </span>{" "}
            <span className="text-foreground">is a step forward.</span>
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-xl gap-2 text-xs font-semibold border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 shadow-xs"
          >
            <Link href="/leaderboard">
              <Trophy className="size-3.5" />
              Leaderboard
            </Link>
          </Button>
          <AIPanel
            context={{ surface: "progress" }}
            label="Ask for a study plan"
            title="Your next steps"
          />
        </div>
      </div>

      {/* Personal Identity Profile Card */}
      <ProfileCard
        initialEmail={email}
        completedCount={completed.size}
        totalChapters={course.chapters.length}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Chapters Completed */}
        <Card interactive className="rounded-2xl border-border/80">
          <CardContent className="space-y-2 p-6">
            <p className="text-sm text-muted-foreground">Chapters completed</p>
            <p className="text-2xl font-semibold">
              {completed.size} / {course.chapters.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.round((completed.size / course.chapters.length) * 100)}% of curriculum
            </p>
          </CardContent>
        </Card>

        {/* Daily Study Streak */}
        <Card interactive className="rounded-2xl border-border/80 bg-gradient-to-br from-amber-500/10 via-card to-card">
          <CardContent className="space-y-2 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Flame className="size-4 fill-amber-500 text-amber-500" />
                <span>Daily Streak</span>
              </p>
              <span className="font-mono text-xs font-bold text-foreground">
                {streak} {streak === 1 ? "day" : "days"}
              </span>
            </div>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {streak > 0 ? `${streak} Day Streak! 🔥` : "Start Today!"}
            </p>
            <div className="flex items-center justify-between gap-1 pt-1">
              {recentDays.map((d) => (
                <div key={d.dateStr} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {d.dayName}
                  </span>
                  <div
                    className={`size-3 rounded-full transition-colors ${
                      d.active
                        ? "bg-amber-500 ring-2 ring-amber-500/30"
                        : "bg-muted border border-border/60"
                    }`}
                    title={`${d.dateStr}: ${d.active ? "Active" : "No submission"}`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quiz Attempts */}
        <Card interactive className="rounded-2xl border-border/80">
          <CardContent className="space-y-2 p-6">
            <p className="text-sm text-muted-foreground">Quiz submissions</p>
            <p className="text-2xl font-semibold">{attempts.length}</p>
            <p className="text-xs text-muted-foreground">
              Across all chapter quizzes
            </p>
          </CardContent>
        </Card>

        {/* Average Score */}
        <Card interactive className="rounded-2xl border-border/80">
          <CardContent className="space-y-2 p-6">
            <p className="text-sm text-muted-foreground">Average quiz score</p>
            <p className="text-2xl font-semibold">
              {attempts.length
                ? `${Math.round(
                    (attempts.reduce(
                      (sum, attempt) => sum + attempt.score / attempt.total,
                      0,
                    ) /
                      attempts.length) *
                      100,
                  )}%`
                : "No attempts yet"}
            </p>
            <p className="text-xs text-muted-foreground">
              {attempts.length ? "Based on all attempts" : "Submit a quiz to begin"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* GitHub & LeetCode Style Consistency Heatmap */}
      <ActivityHeatmap
        quizAttempts={attempts}
        labAttempts={labAttempts}
        currentStreak={streak}
      />

      <div className="space-y-4">
        <Progress
          value={(completed.size / course.chapters.length) * 100}
          aria-label="Course completion"
        />
        <Button asChild>
          <Link href={next ? `/learn/${next.id}` : "/learn"}>
            {next ? "Continue learning" : "Revisit the course"}
          </Link>
        </Button>
      </div>

      {/* Targeted AI Remediation & Weak Topics Section */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-500" />
              <span>
                <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                  Targeted Practice:
                </span>{" "}
                Recommended Focus Areas
              </span>
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Personalized concept diagnostics based on your quiz and lab submissions.
            </p>
          </div>
        </div>

        {weakChapters.length === 0 && weakChallenges.length === 0 ? (
          <Card className="rounded-2xl border-success/30 bg-success/5 p-5">
            <CardContent className="p-0 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-success/15 text-success">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  🌟 High Concept Mastery!
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  No critical concept weaknesses detected. All your completed chapters maintain &gt;= 75% score. Keep pushing into advanced algorithms!
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {weakChapters.map((chapter) => {
              const p = chapterProgress[chapter.id];
              return (
                <Card
                  key={chapter.id}
                  className="rounded-2xl border-amber-500/30 bg-card p-4 transition-all duration-200 hover:border-amber-500/60"
                >
                  <CardContent className="p-0 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                          Chapter {chapter.order}
                        </span>
                        <h3 className="font-semibold text-foreground text-sm">
                          {chapter.title}
                        </h3>
                      </div>
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                        {p.bestScore}/{p.bestTotal} ({p.bestPercent}%)
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/60">
                      <Button asChild size="sm" variant="ghost" className="h-8 px-2 text-xs">
                        <Link href={`/learn/${chapter.id}`}>
                          <span>Review Lesson</span>
                          <ArrowRight className="size-3.5 ml-1" />
                        </Link>
                      </Button>
                      <AIPanel
                        context={{ surface: "learn", chapterId: chapter.id }}
                        label="✨ Remediate with AI"
                        title={`AI Remediation: ${chapter.title}`}
                        initialQuestion={`I scored below 75% on chapter "${chapter.title}". Can you diagnose the most common misconceptions students face here, explain the core physics intuition simply, and give me a quick practice question?`}
                        triggerVariant="secondary"
                        triggerSize="sm"
                        triggerClassName="h-8 gap-1.5 rounded-lg border border-primary/30 bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/20"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {weakChallenges.map((challenge) => (
              <Card
                key={challenge.id}
                className="rounded-2xl border-amber-500/30 bg-card p-4 transition-all duration-200 hover:border-amber-500/60"
              >
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        Lab Challenge
                      </span>
                      <h3 className="font-semibold text-foreground text-sm">
                        {challenge.title}
                      </h3>
                    </div>
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                      Needs Verification
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/60">
                    <Button asChild size="sm" className="h-8 text-xs gap-1">
                      <Link href={`/lab?challenge=${challenge.id}`}>
                        <span>Solve in Lab</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                    <AIPanel
                      context={{ surface: "learn", chapterId: challenge.chapterId }}
                      label="✨ Ask AI for Hint"
                      title={`Challenge Hint: ${challenge.title}`}
                      initialQuestion={`I'm trying to solve the lab challenge "${challenge.title}" (${challenge.objective}). Can you give me a conceptual hint on how to design this circuit without giving away the full answer?`}
                      triggerVariant="secondary"
                      triggerSize="sm"
                      triggerClassName="h-8 gap-1.5 rounded-lg border border-primary/30 bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/20"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
            Chapter
          </span>{" "}
          results
        </h2>
        <p className="text-sm text-muted-foreground">
          Completion records your study and quiz submission. Scores show where
          you can keep practising.
        </p>
        <div className="divide-y overflow-hidden rounded-2xl border border-border/70 bg-card">
          {course.chapters.map((chapter) => {
            const { count, bestScore, bestTotal, status } = chapterProgress[chapter.id];
            return (
              <Link
                key={chapter.id}
                href={`/learn/${chapter.id}`}
                className="flex flex-col justify-between gap-2 p-5 transition-colors duration-300 hover:bg-secondary/50 focus-visible:outline-2 focus-visible:outline-primary sm:flex-row sm:items-center"
              >
                <span className="font-medium">
                  {chapter.order}. {chapter.title}
                </span>
                <span
                  className={count ? "shrink-0 text-sm text-success" : "shrink-0 text-sm text-muted-foreground"}
                >
                  {count
                    ? `Best ${bestScore}/${bestTotal} · ${count} attempt${count === 1 ? "" : "s"}`
                    : status}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
            Lab
          </span>{" "}
          challenges
        </h2>
        <p className="text-sm text-muted-foreground">
          {
            new Set(
              labAttempts.filter((a) => a.passed).map((a) => a.challenge_id),
            ).size
          }{" "}
          / {challenges.length} completed · {labAttempts.length} submissions
        </p>
        <div className="divide-y overflow-hidden rounded-2xl border border-border/70 bg-card">
          {challenges.map((challenge) => {
            const results = labAttempts.filter(
              (a) => a.challenge_id === challenge.id,
            );
            return (
              <div
                key={challenge.id}
                className="flex flex-wrap justify-between gap-2 p-5 transition-colors duration-300 hover:bg-secondary/50"
              >
                <span className="font-medium">{challenge.title}</span>
                <span
                  className={results.some((a) => a.passed) ? "text-sm text-success" : "text-sm text-muted-foreground"}
                >
                  {results.length
                    ? `${results.some((a) => a.passed) ? "Completed" : "In progress"} · Best ${Math.max(...results.map((a) => a.score))}% · ${results.length} attempts`
                    : "Not started"}
                </span>
              </div>
            );
          })}
        </div>
        <Button asChild variant="outline">
          <Link href="/lab">Open Lab</Link>
        </Button>
        {labAttempts.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Latest:{" "}
            {
              challenges.find((c) => c.id === labAttempts[0].challenge_id)
                ?.title
            }{" "}
            · {labAttempts[0].engine} · {labAttempts[0].score}%
          </p>
        )}
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
            Recent
          </span>{" "}
          quiz attempts
        </h2>
        {attempts.length ? (
          <ul className="divide-y overflow-hidden rounded-2xl border border-border/70 bg-card">
            {attempts.slice(0, 10).map((attempt) => (
              <li
                key={attempt.id}
                className="flex flex-wrap justify-between gap-2 p-5 text-sm"
              >
                <Link
                  href={`/learn/${attempt.chapter_id}`}
                  className="font-medium transition-colors duration-300 hover:text-primary"
                >
                  {
                    course.chapters.find(
                      (chapter) => chapter.id === attempt.chapter_id,
                    )?.title
                  }
                </Link>
                <span className="text-muted-foreground">
                  {attempt.score}/{attempt.total} ·{" "}
                  {new Date(attempt.submitted_at).toLocaleDateString("en", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Your first quiz result will appear here.
          </p>
        )}
      </section>
    </main>
  );
}
