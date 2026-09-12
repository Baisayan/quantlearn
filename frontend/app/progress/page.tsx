import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { course } from "@/lib/learn/content";
import { getProgress } from "@/lib/learn/progress";

export default async function ProgressPage() {
  const { email, chapterProgress, attempts } = await getProgress();
  const completed = new Set(Object.keys(chapterProgress).filter((id) => chapterProgress[id].count));
  const next = course.chapters.find((chapter) => !completed.has(chapter.id));
  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-5 py-10 sm:px-8 sm:py-14">
      <div className="space-y-3">
        <p className="text-sm font-medium text-primary">Your progress</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Every chapter is a step forward.
        </h1>
        <p className="break-words text-muted-foreground">{email}</p>
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
          <Card key={label} className="bg-white/80 shadow-none">
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
        <Button asChild className="rounded-full">
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
        <div className="divide-y rounded-xl border bg-white/80">
          {course.chapters.map((chapter) => {
            const { count, bestScore, status } = chapterProgress[chapter.id];
            return (
              <Link
                key={chapter.id}
                href={`/learn/${chapter.id}`}
                className="flex flex-col justify-between gap-2 p-5 hover:bg-secondary/50 focus-visible:outline-2 focus-visible:outline-primary sm:flex-row sm:items-center"
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
        <h2 className="text-xl font-semibold">Recent attempts</h2>
        {attempts.length ? (
          <ul className="divide-y rounded-xl border bg-white/80">
            {attempts.slice(0, 10).map((attempt) => (
              <li
                key={attempt.id}
                className="flex flex-wrap justify-between gap-2 p-5 text-sm"
              >
                <Link
                  href={`/learn/${attempt.chapter_id}`}
                  className="font-medium hover:text-primary"
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
