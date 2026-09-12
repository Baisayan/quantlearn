import Link from "next/link";
import { ArrowRight, BookOpen, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { course } from "@/lib/learn/content";
import { getProgress } from "@/lib/learn/progress";

export default async function LearnPage() {
  const { lessons, attempts } = await getProgress();
  const completed = new Set(attempts.map((attempt) => attempt.chapter_id));
  const started = new Set(lessons.map((lesson) => lesson.chapter_id));
  const next = course.chapters.find((chapter) => !completed.has(chapter.id));
  const totalMinutes = course.chapters.reduce(
    (sum, chapter) => sum + chapter.minutes,
    0,
  );

  return (
    <main className="mx-auto w-full max-w-6xl space-y-12 px-5 py-10 sm:px-8 sm:py-14">
      <section className="space-y-6">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Your learning path
        </p>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Make sense of the quantum world.
            </h1>
            <p className="leading-relaxed text-muted-foreground">
              Start with a qubit. Build your understanding one chapter at a
              time, with worked examples, visual explanations and a short quiz.
            </p>
          </div>
          <Link
            href="/progress"
            className="shrink-0 text-sm font-medium text-accent-foreground underline-offset-4 hover:underline"
          >
            View your progress ↗
          </Link>
        </div>
        <Card className="border-primary/20 bg-white/80 shadow-none">
          <CardContent className="grid gap-6 p-6 sm:grid-cols-2 sm:items-center sm:p-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-accent-foreground">
                <BookOpen className="size-4" aria-hidden="true" />
                {next
                  ? completed.size || started.size
                    ? "Continue learning"
                    : "Begin your journey"
                  : "Course completed"}
              </div>
              <h2 className="text-xl font-semibold">
                {next?.title ?? "Every chapter is complete. Keep exploring."}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {next?.summary ??
                  "Revisit a lesson, retry a quiz or review how your scores have changed."}
              </p>
              <Button asChild className="rounded-full">
                <Link href={next ? `/learn/${next.id}` : "/progress"}>
                  {next ? "Open chapter" : "Review progress"}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <div className="space-y-3 sm:pl-8">
              <div className="flex justify-between gap-3 text-sm">
                <span>
                  {completed.size} of {course.chapters.length} chapters complete
                </span>
                <span className="text-accent-foreground">
                  {Math.round((completed.size / course.chapters.length) * 100)}%
                </span>
              </div>
              <Progress
                value={(completed.size / course.chapters.length) * 100}
                aria-label="Overall course completion"
              />
              <p className="text-sm text-muted-foreground">
                Read a chapter and submit its quiz to complete it. Learn at your
                own pace; every chapter is open.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
      {course.modules.map((module, index) => {
        const chapters = course.chapters.filter(
          (chapter) => chapter.module === module.id,
        );
        const count = chapters.filter((chapter) =>
          completed.has(chapter.id),
        ).length;
        return (
          <section
            key={module.id}
            id={module.id}
            aria-labelledby={`${module.id}-title`}
            className="scroll-mt-36 space-y-5"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-widest text-primary">
                  Module {String(index + 1).padStart(2, "0")}
                </p>
                <h2
                  id={`${module.id}-title`}
                  className="text-2xl font-semibold tracking-tight"
                >
                  {module.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {module.description}
                </p>
              </div>
              <div className="w-full space-y-2 sm:w-40 sm:shrink-0">
                <p className="text-xs text-muted-foreground">
                  {count} of {chapters.length} complete
                </p>
                <Progress
                  value={(count / chapters.length) * 100}
                  aria-label={`${module.title} completion`}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {chapters.map((chapter) => {
                const done = completed.has(chapter.id);
                const status = done
                  ? "Completed"
                  : started.has(chapter.id)
                    ? "In progress"
                    : "Not started";
                const chapterAttempts = attempts.filter(
                  (attempt) => attempt.chapter_id === chapter.id,
                );
                return (
                  <Link
                    key={chapter.id}
                    href={`/learn/${chapter.id}`}
                    className="group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                  >
                    <Card className="h-full bg-white/75 shadow-none transition-colors group-hover:border-primary/50 group-hover:bg-white">
                      <CardContent className="flex h-full flex-col gap-4 p-6">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-medium text-muted-foreground">
                            Chapter {String(chapter.order).padStart(2, "0")}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-accent-foreground">
                            {done && (
                              <Check className="size-3" aria-hidden="true" />
                            )}
                            {status}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold leading-snug">
                          {chapter.title}
                        </h3>
                        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                          {chapter.summary}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3" aria-hidden="true" />
                            {chapter.minutes} min
                          </span>
                          <span>{chapter.difficulty}</span>
                          {chapterAttempts.length > 0 && (
                            <span>
                              Best{" "}
                              {Math.max(
                                ...chapterAttempts.map(
                                  (attempt) => attempt.score,
                                ),
                              )}
                              /10
                            </span>
                          )}
                          <ArrowRight
                            className="ml-auto size-4 text-primary"
                            aria-hidden="true"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
      <p className="border-t pt-6 text-center text-sm text-muted-foreground">
        {course.modules.length} modules · {course.chapters.length} chapters ·
        About {Math.floor(totalMinutes / 60)} hr {totalMinutes % 60} min of
        study · Qiskit Aer &amp; Cirq
      </p>
    </main>
  );
}
