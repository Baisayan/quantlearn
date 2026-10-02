"use client";

import Link from "next/link";
import { CheckCircle2, AlertCircle, Trophy, ArrowRight, Zap, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Circuit, Engine, Result } from "@/lib/lab/types";
import challenges from "@/.generated/lab.json";

interface SubmissionHudProps {
  assessment: NonNullable<Result["assessment"]>;
  challenge?: (typeof challenges)[number];
  circuit: Circuit;
  engine: Engine;
}

export function SubmissionHud({
  assessment,
  challenge,
  circuit,
  engine,
}: SubmissionHudProps) {
  const passed = assessment.passed;
  const score = Math.max(0, Math.min(100, Math.round(assessment.score)));
  const gatesUsed = circuit.operations.length;
  const maxGates = challenge?.maxGates || 10;
  const isOptimalGates = gatesUsed <= maxGates;

  // Find next challenge in sequence
  const currentIndex = challenge
    ? challenges.findIndex((c) => c.id === challenge.id)
    : -1;
  const nextChallenge =
    currentIndex >= 0 && currentIndex < challenges.length - 1
      ? challenges[currentIndex + 1]
      : null;

  // SVG Gauge Calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const engineLabels: Record<Engine, string> = {
    aer: "Qiskit Aer Statevector",
    cirq: "Cirq Simulator",
    pennylane: "PennyLane Default.Qubit",
  };

  return (
    <Card
      className={`relative overflow-hidden rounded-2xl border transition-all duration-500 shadow-lg ${
        passed
          ? "border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-background to-emerald-500/5 shadow-emerald-500/5"
          : "border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-background to-amber-500/5 shadow-amber-500/5"
      }`}
    >
      {/* Decorative ambient glow */}
      <div
        className={`pointer-events-none absolute -right-16 -top-16 size-48 rounded-full blur-3xl opacity-20 ${
          passed ? "bg-emerald-400" : "bg-amber-400"
        }`}
      />

      <CardContent className="space-y-6 p-6">
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-10 items-center justify-center rounded-xl border shadow-sm ${
                passed
                  ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-500"
                  : "border-amber-500/40 bg-amber-500/20 text-amber-500"
              }`}
            >
              {passed ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <AlertCircle className="size-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-mono text-xs font-bold uppercase tracking-wider ${
                    passed ? "text-emerald-500" : "text-amber-500"
                  }`}
                >
                  {passed ? "Accepted · Solution Verified" : "Needs Refinement"}
                </span>
                {passed && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <Trophy className="size-3" /> SIH Complete
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                {challenge?.title || "Challenge Submission"}
              </h3>
            </div>
          </div>

          {/* Gamified Next Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {passed && nextChallenge && (
              <Button asChild size="sm" className="gap-1.5 shadow-sm">
                <Link href={`/lab?challenge=${nextChallenge.id}`}>
                  <span>Next Challenge</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            )}
            {challenge && (
              <Button asChild size="sm" variant="outline" className="gap-1.5">
                <Link href={`/learn/${challenge.chapterId}`}>
                  <BookOpen className="size-3.5" />
                  <span>Review Lesson</span>
                </Link>
              </Button>
            )}
            <Button asChild size="sm" variant="ghost" className="gap-1.5 text-xs">
              <Link href="/progress">
                <span>Progress Dashboard →</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* HUD Center: Fidelity Gauge & Quantum Efficiency Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6 items-center">
          {/* Circular Animated Fidelity Gauge */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative size-24">
              <svg className="size-24 -rotate-90 transform" viewBox="0 0 96 96">
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  className="stroke-muted/30"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  className={`transition-all duration-1000 ease-out ${
                    passed
                      ? "stroke-emerald-500"
                      : score >= 50
                      ? "stroke-amber-500"
                      : "stroke-rose-500"
                  }`}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-xl font-black tracking-tight text-foreground">
                  {score}%
                </span>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Match
                </span>
              </div>
            </div>
            <span className="mt-2 text-xs font-medium text-muted-foreground">
              State Fidelity
            </span>
          </div>

          {/* Efficiency Benchmarks (LeetCode-style metrics) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Gate Budget Metric */}
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Gate Budget</span>
                <Zap className="size-3.5 text-primary" />
              </div>
              <div className="mt-2">
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="text-xl font-bold text-foreground">
                    {gatesUsed}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    / {maxGates} max
                  </span>
                </div>
                <div className="mt-1">
                  <span
                    className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                      isOptimalGates
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {isOptimalGates ? "Optimal Efficiency" : "Exceeds Gate Limit"}
                  </span>
                </div>
              </div>
            </div>

            {/* Qubit Wire Allocation */}
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Active Qubits</span>
                <Sparkles className="size-3.5 text-primary" />
              </div>
              <div className="mt-2">
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="text-xl font-bold text-foreground">
                    {circuit.qubits}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    / {challenge?.qubits || circuit.qubits} required
                  </span>
                </div>
                <div className="mt-1">
                  <span className="inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    Little-Endian Ordered
                  </span>
                </div>
              </div>
            </div>

            {/* Evaluator Engine */}
            <div className="rounded-xl border border-border/60 bg-card/60 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Evaluator Engine</span>
                <span className="font-mono text-[10px] uppercase text-primary font-bold">
                  {engine}
                </span>
              </div>
              <div className="mt-2">
                <p className="text-xs font-semibold text-foreground truncate">
                  {engineLabels[engine] || engine}
                </p>
                <div className="mt-1">
                  <span className="inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    Exact Statevector Projection
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pedagogical Feedback Narrative */}
        <div className="rounded-xl border border-border/80 bg-background/60 p-3.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Evaluator Analysis & Diagnostic Feedback:
          </p>
          <p className="text-sm leading-relaxed text-foreground/90 font-sans">
            {assessment.feedback}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
