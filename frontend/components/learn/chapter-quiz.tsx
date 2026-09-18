"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AIPanel } from "@/components/ai/ai-panel";

type Question = {
  id: string;
  prompt: string;
  difficulty: string;
  options: { id: string; text: string }[];
};
type Result = {
  attemptId: string;
  score: number;
  total: number;
  feedback: { id: string; correctOptionId: string; explanation: string }[];
};

export function ChapterQuiz({
  chapterId,
  version,
  questions,
  previousScore,
}: {
  chapterId: string;
  version: number;
  questions: Question[];
  previousScore?: number;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [read, setRead] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [progressError, setProgressError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const attemptId = useRef<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterId }),
    })
      .then((response) => {
        if (!response.ok) throw new Error();
      })
      .catch(() => {
        if (active)
          setProgressError(
            "Reading progress could not be saved. Submitting the quiz will try again.",
          );
      });
    return () => {
      active = false;
    };
  }, [chapterId]);

  useEffect(() => {
    if (result) resultRef.current?.focus();
  }, [result]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || result) return;
    setPending(true);
    setError("");
    attemptId.current ??= crypto.randomUUID();
    try {
      const response = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId,
          version,
          answers,
          read,
          attemptId: attemptId.current,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Your quiz could not be saved.");
      setResult({ ...data, attemptId: attemptId.current });
      setProgressError("");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Check your connection and try again.",
      );
    } finally {
      setPending(false);
    }
  }

  function retry() {
    setResult(null);
    setAnswers({});
    setError("");
    attemptId.current = null;
    document.getElementById("chapter-quiz")?.scrollIntoView({ block: "start" });
    requestAnimationFrame(() => {
      document
        .getElementById(`${questions[0].id}-a`)
        ?.focus({ preventScroll: true });
    });
  }

  return (
    <section
      id="chapter-quiz"
      aria-labelledby="quiz-title"
      className="scroll-mt-36 space-y-6 border-t border-border/70 pt-8"
    >
      <div className="space-y-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
          Put it together
        </p>
        <h2 id="quiz-title" className="text-2xl font-semibold">
          Chapter quiz
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Ten questions, from quick checks to deeper reasoning. Answer them all,
          then review the explanations. There is no pass threshold, and you can
          retry as often as you like.
        </p>
        {previousScore !== undefined && (
          <p className="text-sm text-secondary-foreground">
            Last saved score: {previousScore}/10
          </p>
        )}
      </div>
      {progressError && (
        <p role="status" className="text-sm text-muted-foreground">
          {progressError}
        </p>
      )}
      <AIPanel
        key={result?.attemptId ?? "quiz-hints"}
        context={{ surface: "learn", chapterId, ...(result ? { attemptId: result.attemptId } : {}) }}
        label={result ? "Review my answers with AI" : "Ask for a quiz hint"}
        title={result ? "Review your quiz" : "Quiz hints"}
      />
      <form onSubmit={submit} className="space-y-5">
        {questions.map((question, index) => {
          const feedback = result?.feedback.find(
            (item) => item.id === question.id,
          );
          const correct = feedback?.correctOptionId === answers[question.id];
          return (
            <Card key={question.id}>
              <CardContent className="p-5 sm:p-6">
                <fieldset
                  disabled={pending || Boolean(result)}
                  className="min-w-0 space-y-4"
                >
                  <legend
                    id={`${question.id}-prompt`}
                    className="w-full space-y-2 pb-4"
                  >
                    <span className="block text-xs font-medium capitalize text-secondary-foreground">
                      Question {index + 1} · {question.difficulty}
                    </span>
                    <span className="block font-medium leading-relaxed">
                      {question.prompt}
                    </span>
                  </legend>
                  <RadioGroup
                    required
                    value={answers[question.id] ?? ""}
                    aria-labelledby={`${question.id}-prompt`}
                    onValueChange={(value) => {
                      setAnswers((current) => ({
                        ...current,
                        [question.id]: value,
                      }));
                      attemptId.current = null;
                    }}
                  >
                    {question.options.map((option) => (
                      <Label
                        key={option.id}
                        htmlFor={`${question.id}-${option.id}`}
                        className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/70 px-4 py-3 text-sm font-normal leading-relaxed transition-[border-color,background-color] duration-300 hover:border-primary/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-secondary/70"
                      >
                        <RadioGroupItem
                          id={`${question.id}-${option.id}`}
                          value={option.id}
                          className="mt-1"
                        />
                        <span>
                          <span className="mr-2 font-medium uppercase text-secondary-foreground">
                            {option.id}.
                          </span>
                          {option.text}
                        </span>
                      </Label>
                    ))}
                  </RadioGroup>
                </fieldset>
                {feedback && (
                  <div className="mt-4 space-y-2 rounded-lg bg-secondary/60 p-4 text-sm leading-relaxed">
                    <p className="font-semibold">
                      {correct
                        ? "Correct"
                        : `Review this one. Correct answer: ${feedback.correctOptionId.toUpperCase()}`}
                    </p>
                    <p className="text-muted-foreground">
                      {feedback.explanation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        {!result && (
          <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-5">
            <Label
              htmlFor="lesson-read"
              className="flex items-start gap-3 text-sm font-normal leading-relaxed"
            >
              <Checkbox
                id="lesson-read"
                required
                checked={read}
                disabled={pending}
                onCheckedChange={(checked) => setRead(checked === true)}
                className="mt-1"
              />
              I have read the lesson and reviewed its examples.
            </Label>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {Object.keys(answers).length} of {questions.length} answered
            </p>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={
                pending ||
                !read ||
                Object.keys(answers).length !== questions.length
              }
              className="rounded-xl"
            >
              {pending ? "Saving your result…" : "Submit quiz"}
            </Button>
          </div>
        )}
      </form>
      {result && (
        <div
          ref={resultRef}
          tabIndex={-1}
          role="status"
          className="space-y-3 rounded-2xl border border-primary/30 bg-secondary/70 p-6 outline-none"
        >
          <h3 className="text-xl font-semibold">
            {result.score} of {result.total} correct
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {Math.round((result.score / result.total) * 100)}% correct. Chapter
            completed and progress saved.{" "}
            {result.score === result.total
              ? "You answered every question correctly."
              : "Read the explanations above and revisit any ideas that need more practice."}
          </p>
          <Button variant="outline" onClick={retry} className="rounded-xl">
            Try again
          </Button>
        </div>
      )}
    </section>
  );
}
