import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LessonReader } from "@/components/learn/lesson-reader";
import { ChapterQuiz } from "@/components/learn/chapter-quiz";
import { course, getChapter, getQuizQuestions } from "@/lib/learn/content";
import { getProgress } from "@/lib/learn/progress";
import { AIPanel } from "@/components/ai/ai-panel";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const chapter = getChapter((await params).chapterId);
  const { chapterProgress } = await getProgress(chapter.id);
  const progress = chapterProgress[chapter.id];
  const chapterModule = course.modules.find(
    (item) => item.id === chapter.module,
  )!;
  const previous = course.chapters[chapter.order - 2];
  const next = course.chapters[chapter.order];
  // The template supplies the title, objectives and quiz; all study sections remain authored Markdown.
  const markdown = chapter.markdown
    .replace(/^# .+\r?\n/, "")
    .replace(/## Learning objectives\r?\n[\s\S]*?(?=\r?\n## )/, "")
    .replace(/## Chapter quiz\r?\n[\s\S]*?(?=\r?\n## |$)/, "");
  return (
    <main className="mx-auto w-full max-w-5xl min-w-0 space-y-8 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
      >
        <Link href="/learn" className="transition-colors duration-300 hover:text-primary">
          Learn
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/learn#${chapterModule.id}`}
          className="transition-colors duration-300 hover:text-primary"
        >
          {chapterModule.title}
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Chapter {chapter.order}</span>
      </nav>
      <div className="space-y-4">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
          Chapter {chapter.order} of {course.chapters.length} ·{" "}
          {chapter.difficulty}
        </p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {chapter.title}
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
          {chapter.summary}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span
            className={`rounded-full px-3 py-1 ${progress.count ? "bg-success/10 text-success" : "bg-secondary text-secondary-foreground"}`}
          >
            {progress.count
              ? `Completed · Best ${progress.bestScore}/10`
              : "In progress"}
          </span>
          <a
            href="#chapter-quiz"
            className="text-primary underline underline-offset-4 transition-colors duration-300 hover:text-primary/80"
          >
            Go to quiz
          </a>
          <AIPanel
            key={chapter.id}
            context={{ surface: "learn", chapterId: chapter.id }}
          />
        </div>
        {chapter.prerequisites.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Suggested preparation:{" "}
            {chapter.prerequisites.map((id) => (
              <Link
                key={id}
                href={`/learn/${id}`}
                className="text-primary underline underline-offset-4 transition-colors duration-300 hover:text-primary/80"
              >
                {getChapter(id).title}
              </Link>
            ))}
            . You can read chapters in any order.
          </p>
        )}
      </div>
      <Card>
        <CardContent className="space-y-3 p-6">
          <h2 className="font-semibold">What you will learn</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-primary">
            {chapter.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <article aria-label="Study material">
        <LessonReader markdown={markdown} />
      </article>
      <ChapterQuiz
        key={chapter.id}
        chapterId={chapter.id}
        version={chapter.quiz.version}
        questions={getQuizQuestions(chapter)}
        previousScore={progress.lastScore}
      />
      <nav
        aria-label="Chapter navigation"
        className="flex flex-wrap justify-between gap-4 border-t border-border/70 pt-6"
      >
        <Button asChild variant="outline">
          <Link href={previous ? `/learn/${previous.id}` : "/learn"}>
            <ArrowLeft aria-hidden="true" />
            {previous ? "Previous chapter" : "All chapters"}
          </Link>
        </Button>
        <Button asChild>
          <Link href={next ? `/learn/${next.id}` : "/progress"}>
            {next ? "Next chapter" : "Review progress"}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </nav>
    </main>
  );
}
