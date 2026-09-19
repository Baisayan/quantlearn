import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { course } from "@/lib/learn/content";
import { getProgress } from "@/lib/learn/progress";
import { getLabProgress } from "@/lib/lab/progress";
import challenges from "@/.generated/lab.json";
import { AIPanel } from "@/components/ai/ai-panel";

const eyebrow = "font-mono text-xs font-semibold uppercase tracking-widest";

export default async function ProgressPage() {
  const { email, chapterProgress, attempts } = await getProgress();
  const labAttempts = await getLabProgress();
  const completed = new Set(
    Object.keys(chapterProgress).filter((id) => chapterProgress[id].count),
  );
  const next = course.chapters.find((chapter) => !completed.has(chapter.id));
  return (
    <main className="mx-auto w-full max-w-7xl space-y-10 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <p className={`${eyebrow} text-primary`}>Your progress</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Every chapter is a step forward.
          </h1>
          <p className="break-words text-muted-foreground">{email}</p>
        </div>
        <AIPanel
          context={{ surface: "progress" }}
          label="Ask for a study plan"
          title="Your next steps"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          [
            "Chapters completed",
            `${completed.size} / ${course.chapters.length}`,
          ],
          ["Quiz attempts", attempts.length],
          [
            "Average attempt score",
            attempts.length
              ? `${Math.round((attempts.reduce((sum, attempt) => sum + attempt.score / attempt.total, 0) / attempts.length) * 100)}%`
              : "No attempts yet",
          ],
        ].map(([label, value]) => (
          <Card key={label} interactive className="rounded-2xl border-border/80">
            <CardContent className="space-y-2 p-6">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="space-y-4">
        <Progress
          value={(completed.size / course.chapters.length) * 100}
          aria-label="Course completion"
        />
        <Button asChild className="rounded-xl">
          <Link href={next ? `/learn/${next.id}` : "/learn"}>
            {next ? "Continue learning" : "Revisit the course"}
          </Link>
        </Button>
      </div>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Chapter results</h2>
        <p className="text-sm text-muted-foreground">
          Completion records your study and quiz submission. Scores show where
          you can keep practising.
        </p>
        <div className="divide-y overflow-hidden rounded-2xl border border-border/70 bg-card">
          {course.chapters.map((chapter) => {
            const { count, bestScore, status } = chapterProgress[chapter.id];
            return (
              <Link
                key={chapter.id}
                href={`/learn/${chapter.id}`}
                className="flex flex-col justify-between gap-2 p-5 transition-colors duration-300 hover:bg-secondary/50 focus-visible:outline-2 focus-visible:outline-primary sm:flex-row sm:items-center"
              >
                <span className="font-medium">
                  {chapter.order}. {chapter.title}
                </span>
                <span className="shrink-0 text-sm text-muted-foreground">
                  {count
                    ? `Best ${bestScore}/10 · ${count} attempt${count === 1 ? "" : "s"}`
                    : status}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Lab challenges</h2>
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
                <span className="text-sm text-muted-foreground">
                  {results.length
                    ? `${results.some((a) => a.passed) ? "Completed" : "In progress"} · Best ${Math.max(...results.map((a) => a.score))}% · ${results.length} attempts`
                    : "Not started"}
                </span>
              </div>
            );
          })}
        </div>
        <Button asChild variant="outline" className="rounded-xl">
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
        <h2 className="text-xl font-semibold">Recent quiz attempts</h2>
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
