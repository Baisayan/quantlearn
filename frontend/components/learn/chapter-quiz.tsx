"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AIPanel } from "@/components/ai/ai-panel";
import { LabHandoff, type LabHandoffChallenge } from "@/components/learn/lab-handoff";
import { ArrowRight, CheckCircle2, RotateCcw, Sparkles, Trophy, X } from "lucide-react";

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
  previousTotal,
  labChallenges = [],
}: {
  chapterId: string;
  version: number;
  questions: Question[];
  previousScore?: number;
  previousTotal?: number;
  labChallenges?: LabHandoffChallenge[];
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [read, setRead] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [progressError, setProgressError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
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
      if (typeof window !== "undefined") {
        const chapterId = questions[0]?.id ? questions[0].id.replace(/-q\d+$/, "") : "";
        window.dispatchEvent(
          new CustomEvent("quantlearn:progress-updated", {
            detail: { chapterId },
          }),
        );
      }
      router.refresh();
      setEvaluating(true);
      setShowCelebration(true);
      setTimeout(() => {
        setEvaluating(false);
      }, 800);
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
          {questions.length} questions, from quick checks to deeper reasoning.
          Answer them all, then review the explanations. There is no pass
          threshold, and you can retry as often as you like.
        </p>
        {previousScore !== undefined && previousTotal !== undefined && (
          <p className="text-sm text-secondary-foreground">
            Last saved score: {previousScore}/{previousTotal}
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
                        className="flex cursor-pointer items-start gap-3 rounded-md border border-border/70 px-4 py-3 text-sm font-normal leading-relaxed transition-[border-color,background-color] duration-300 hover:border-primary/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-secondary/70"
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
                  <div
                    className={`mt-4 space-y-3 rounded-xl p-4 text-sm leading-relaxed border ${
                      correct
                        ? "bg-success/10 border-success/30"
                        : "bg-accent/60 border-accent-foreground/25"
                    }`}
                  >
                    <p
                      className={
                        correct
                          ? "font-semibold text-success flex items-center gap-1.5"
                          : "font-semibold text-accent-foreground"
                      }
                    >
                      {correct ? (
                        <>
                          <CheckCircle2 className="size-4 shrink-0" />
                          <span>Correct</span>
                        </>
                      ) : (
                        `Review this one. Correct answer: ${feedback.correctOptionId.toUpperCase()}`
                      )}
                    </p>
                    <p className="text-muted-foreground">
                      {feedback.explanation}
                    </p>
                    {!correct && (
                      <div className="pt-1">
                        <AIPanel
                          context={{
                            surface: "learn",
                            chapterId,
                            ...(result ? { attemptId: result.attemptId } : {}),
                          }}
                          label="✨ Ask AI Tutor to explain this question"
                          title={`Question ${index + 1} Deep Breakdown`}
                          initialQuestion={`I answered Question ${index + 1} incorrectly: "${question.prompt}". My choice was (${answers[question.id]?.toUpperCase() || "unanswered"}), but the correct answer is (${feedback.correctOptionId.toUpperCase()}). Can you explain why my choice was mistaken, and break down why (${feedback.correctOptionId.toUpperCase()}) is correct with physical intuition?`}
                          triggerVariant="secondary"
                          triggerSize="sm"
                          triggerClassName="h-8 gap-1.5 rounded-lg border border-primary/30 bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/20"
                        />
                      </div>
                    )}
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
          <Button variant="outline" onClick={retry}>
            Try again
          </Button>
        </div>
      )}
      {result && <LabHandoff chapterId={chapterId} challenges={labChallenges} />}

      {/* Gamified Quiz Result Celebration Modal */}
      {showCelebration && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-2xl sm:p-8">
            {/* Close button */}
            {!evaluating && (
              <button
                type="button"
                onClick={() => setShowCelebration(false)}
                className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close celebration modal"
              >
                <X className="size-5" />
              </button>
            )}

            {evaluating ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                <div className="relative size-16 flex items-center justify-center">
                  <span className="absolute size-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Sparkles className="size-6 text-primary animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">
                    Analyzing Quantum Reasoning...
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Grading conceptual checks & calculating mastery points
                  </p>
                </div>
              </div>
            ) : result && (
              <div className="flex flex-col items-center text-center space-y-5 animate-in zoom-in-95 duration-300">
                {/* Score Circular Gauge */}
                <div className="relative size-28">
                  {(() => {
                    const pct = Math.round((result.score / result.total) * 100);
                    const radius = 44;
                    const circ = 2 * Math.PI * radius;
                    const offset = circ - (pct / 100) * circ;
                    const isGreat = pct >= 70;
                    return (
                      <>
                        <svg className="size-28 -rotate-90 transform" viewBox="0 0 112 112">
                          <circle
                            cx="56"
                            cy="56"
                            r={radius}
                            className="stroke-muted/30"
                            strokeWidth="10"
                            fill="transparent"
                          />
                          <circle
                            cx="56"
                            cy="56"
                            r={radius}
                            className={`transition-all duration-1000 ease-out ${
                              isGreat ? "stroke-emerald-500" : pct >= 50 ? "stroke-amber-500" : "stroke-rose-500"
                            }`}
                            strokeWidth="10"
                            strokeDasharray={circ}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            fill="transparent"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="font-mono text-2xl font-black text-foreground">
                            {pct}%
                          </span>
                          <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                            Score
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Score & Points Badges */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      <Trophy className="size-3.5" />
                      +{Math.round((result.score / result.total) * 100)} Quantum XP
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 font-mono text-xs font-semibold text-foreground">
                      {result.score} / {result.total} Correct
                    </span>
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {result.score === result.total
                      ? "🌟 Quantum Prodigy!"
                      : result.score / result.total >= 0.7
                      ? "✨ Solid Understanding!"
                      : "💡 Keep Practising!"}
                  </h3>
                  <p className="max-w-xs text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {result.score === result.total
                      ? "You mastered every single question in this chapter. Outstanding intuition!"
                      : result.score / result.total >= 0.7
                      ? "Great performance! You grasped the core mechanics. Review any missed concepts below."
                      : "Good effort. Take a look at the explanations below to refine your intuition."}
                  </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex w-full flex-col gap-2 pt-2 sm:flex-row sm:items-center">
                  <Button
                    className="flex-1 gap-1.5"
                    onClick={() => {
                      setShowCelebration(false);
                      document.getElementById("chapter-quiz")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <span>Review Answers</span>
                    <ArrowRight className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-1.5"
                    onClick={() => {
                      setShowCelebration(false);
                      retry();
                    }}
                  >
                    <RotateCcw className="size-4" />
                    <span>Try Again</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
