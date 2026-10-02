import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChartNoAxesCombined,
  CheckCircle2,
  ChevronRight,
  Cpu,
  EyeOff,
  FlaskConical,
  Hourglass,
  Sparkles,
  Terminal,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const eyebrow = "font-mono text-xs font-semibold uppercase leading-tight tracking-widest";

const problemPoints = [
  {
    num: "01",
    tag: "Visual Gap",
    title: "Abstract concepts are difficult to picture.",
    description: "Bloch spheres, phase angles, and complex statevectors remain purely theoretical equations on static blackboard chalk.",
    icon: EyeOff,
    accent: "text-rose-500 bg-rose-500/10 border-rose-500/25",
    badge: "text-rose-600 dark:text-rose-400 bg-rose-500/15 border-rose-500/30",
  },
  {
    num: "02",
    tag: "Cognitive Bottleneck",
    title: "Theory-heavy resources make progress feel slow.",
    description: "Dense 400-page academic textbooks drown beginners in matrix arithmetic before ever constructing a functional algorithm.",
    icon: Hourglass,
    accent: "text-amber-500 bg-amber-500/10 border-amber-500/25",
    badge: "text-amber-600 dark:text-amber-400 bg-amber-500/15 border-amber-500/30",
  },
  {
    num: "03",
    tag: "Passive Learning",
    title: "Too little hands-on practice while learning.",
    description: "Reading theorems without assembling and running live simulator circuits leaves critical conceptual blind spots.",
    icon: Terminal,
    accent: "text-cyan-500 bg-cyan-500/10 border-cyan-500/25",
    badge: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/15 border-cyan-500/30",
  },
  {
    num: "04",
    tag: "Access Barrier",
    title: "Access to real quantum hardware is limited.",
    description: "Multi-hour cloud queues, noisy physical QPUs, and complex local Python environment setups stall curiosity.",
    icon: Cpu,
    accent: "text-emerald-500 bg-emerald-500/10 border-emerald-500/25",
    badge: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
  },
] as const;



const heroSignals = [
  { title: "Interactive", subtitle: "lessons", icon: BookOpen },
  { title: "Real quantum", subtitle: "experiments", icon: FlaskConical },
  { title: "Visual results", subtitle: "and progress", icon: ChartNoAxesCombined },
] as const;

const learningPipeline = [
  {
    step: "01",
    title: "Visual Lessons",
    subtitle: "Interactive Intuition",
    description: "Understand superposition, phase kickback, and entanglement through live Bloch spheres and math visuals.",
    icon: BookOpen,
    accent: "border-cyan-500/40 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10",
    badge: "border-cyan-500/30 bg-cyan-500/15 text-cyan-600 dark:text-cyan-300",
    href: "/learn",
  },
  {
    step: "02",
    title: "Concept Quizzes",
    subtitle: "Instant Validation",
    description: "Solidify your grasp with conceptual MCQs and immediate Socratic explanations after each chapter.",
    icon: CheckCircle2,
    accent: "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10",
    badge: "border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-300",
    href: "/learn/superposition-and-phase",
  },
  {
    step: "03",
    title: "Multi-Engine Lab",
    subtitle: "Hands-on Composer",
    description: "Assemble circuits with an IBM-style palette or Python. Simulate on Qiskit Aer, Cirq & PennyLane.",
    icon: FlaskConical,
    accent: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    badge: "border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
    href: "/lab",
  },
  {
    step: "04",
    title: "AI Tutor",
    subtitle: "24/7 Deep Mentorship",
    description: "Ask Gemini to diagnose incorrect answers, suggest hints, and break down complex gate matrices.",
    icon: Sparkles,
    accent: "border-violet-500/40 text-violet-600 dark:text-violet-400 bg-violet-500/10",
    badge: "border-violet-500/30 bg-violet-500/15 text-violet-600 dark:text-violet-300",
    href: "/lab",
  },
  {
    step: "05",
    title: "Gamified Mastery",
    subtitle: "Fidelity & Streaks",
    description: "Track state fidelity, earn XP points, build study streaks, and spot areas needing attention.",
    icon: Trophy,
    accent: "border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-500/10",
    badge: "border-rose-500/30 bg-rose-500/15 text-rose-600 dark:text-rose-300",
    href: "/progress",
  },
] as const;

function CircuitPreview() {
  return (
    <div className="relative mx-auto w-full max-w-none">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-2xl sm:p-4">
        <div className="flex items-center justify-between border-b border-border/70 px-1 pb-2.5 sm:px-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2 rounded-full bg-destructive" />
            <span className="size-2 rounded-full bg-amber" />
            <span className="size-2 rounded-full bg-success" />
          </div>
          <span className="font-mono text-xs font-medium text-muted-foreground">
            Quantum Circuit Lab
          </span>
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-0.5 font-mono text-xs font-medium text-primary-foreground shadow-sm">
              <span className="text-xs">▶</span>
              Run
            </span>
            <span className="rounded-md border border-border bg-card px-2.5 py-0.5 font-mono text-xs text-foreground">
              ↻&nbsp; Reset
            </span>
          </div>
        </div>

        <div className="mt-2 grid gap-2 md:grid-cols-5">
          <div className="min-w-0 rounded-xl border border-border/80 bg-surface-alt p-2 sm:p-3 md:col-span-3">
            <svg
              viewBox="0 0 620 190"
              className="h-auto w-full"
              role="img"
            >
              <title>Bell state circuit</title>
              <defs>
                <pattern id="hero-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--border)" strokeOpacity="0.55" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="620" height="190" rx="12" fill="url(#hero-grid)" />
              <g fill="var(--foreground)" fontFamily="IBM Plex Mono, monospace" fontSize="16">
                <text x="18" y="64">q0</text>
                <text x="18" y="132">q1</text>
                <text x="56" y="64">|0⟩</text>
                <text x="56" y="132">|0⟩</text>
              </g>
              <g stroke="var(--foreground)" strokeWidth="2" fill="none">
                <path d="M 100 59 H 440" />
                <path d="M 494 59 H 522" />
                <path d="M 100 127 H 440" />
                <path d="M 494 127 H 522" />
                <path d="M 318 59 V 127" />
              </g>
              <g fill="var(--primary-soft)" stroke="var(--primary)" strokeWidth="2">
                <rect x="150" y="32" width="54" height="54" rx="8" />
              </g>
              <text x="170" y="67" fill="var(--primary)" fontFamily="IBM Plex Mono, monospace" fontSize="22" fontWeight="600">H</text>
              <circle cx="318" cy="59" r="8" fill="var(--primary)" />
              <circle cx="318" cy="127" r="20" fill="var(--card)" stroke="var(--teal)" strokeWidth="2" />
              <path d="M 306 127 H 330 M 318 115 V 139" stroke="var(--teal)" strokeWidth="2" />
              <g stroke="var(--amber)" strokeWidth="2" fill="var(--accent)">
                <rect x="440" y="32" width="54" height="54" rx="8" />
                <rect x="440" y="100" width="54" height="54" rx="8" />
              </g>
              <g stroke="var(--amber)" strokeWidth="2" fill="none">
                <path d="M 453 70 A 17 17 0 0 1 481 70" />
                <path d="M 467 70 L 477 55" />
                <path d="M 453 138 A 17 17 0 0 1 481 138" />
                <path d="M 467 138 L 477 123" />
              </g>
              <g fill="var(--muted-foreground)" fontFamily="IBM Plex Mono, monospace" fontSize="12">
                <text x="438" y="18">measure</text>
                <text x="534" y="64">m0</text>
                <text x="534" y="132">m1</text>
              </g>
            </svg>
          </div>

          <div className="flex min-h-32 flex-col justify-center rounded-xl border border-border/80 bg-card p-3.5 md:col-span-2">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              State (ideal)
            </p>
            <p className="mt-3 font-mono text-sm leading-6 text-foreground sm:text-base">
              |ψ⟩ = 1/√2 (|00⟩ + |11⟩)
            </p>
            <span className="mt-3 w-fit rounded-md bg-secondary px-2 py-1 font-mono text-xs text-secondary-foreground">
              maximally entangled
            </span>
          </div>
        </div>

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-border/80 bg-card p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-foreground">Measurement results</p>
              <span className="font-mono text-xs text-muted-foreground">1,024 shots</span>
            </div>
            <div className="mt-2 grid grid-cols-4 items-end gap-2">
              {[0.5, 0, 0, 0.5].map((value, index) => (
                <div key={`${value}-${index}`} className="space-y-2 text-center">
                  <div className="flex h-16 flex-col items-center justify-end gap-1">
                    <span className="font-mono text-xs text-foreground">{value.toFixed(3)}</span>
                    <div
                      className="w-full max-w-8 rounded-t-md bg-amber"
                      style={{ height: `${Math.max(value * 100, 3)}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {index.toString(2).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border/80 bg-secondary p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-foreground">Bloch sphere (q0)</p>
              <span className="font-mono text-xs text-secondary-foreground">reduced state</span>
            </div>
            <div className="mt-2 flex min-w-0 items-center gap-2">
              <div className="min-w-0 flex-1">
                <svg
                  viewBox="0 0 224 176"
                  className="mx-auto h-auto w-full max-w-36 overflow-visible"
                  role="img"
                >
                  <title>Maximally mixed reduced Bloch state</title>
                  <defs>
                    <radialGradient id="bloch-fill" cx="34%" cy="28%" r="76%">
                      <stop offset="0" stopColor="var(--card)" stopOpacity="0.96" />
                      <stop offset="0.48" stopColor="var(--teal)" stopOpacity="0.18" />
                      <stop offset="1" stopColor="var(--teal)" stopOpacity="0.28" />
                    </radialGradient>
                  </defs>
                  <circle cx="88" cy="88" r="56" fill="url(#bloch-fill)" stroke="var(--teal)" strokeOpacity="0.38" />
                  <g fill="none" stroke="var(--teal)" strokeOpacity="0.38" strokeWidth="1">
                    <ellipse cx="88" cy="88" rx="56" ry="16" />
                    <ellipse cx="88" cy="88" rx="20" ry="56" />
                    <ellipse cx="88" cy="88" rx="42" ry="56" transform="rotate(-48 88 88)" />
                    <line x1="32" y1="88" x2="144" y2="88" />
                    <line x1="88" y1="32" x2="88" y2="144" />
                    <line x1="43" y1="126" x2="133" y2="50" />
                  </g>
                  <circle cx="88" cy="88" r="7" fill="var(--teal)" stroke="var(--card)" strokeWidth="3" />
                  <g fill="var(--secondary-foreground)" fontFamily="IBM Plex Mono, monospace" fontSize="10">
                    <text x="85" y="22">z</text>
                    <text x="151" y="92">x</text>
                    <text x="136" y="46">y</text>
                  </g>
                </svg>
              </div>
              <div className="space-y-2 font-mono text-xs text-muted-foreground">
                <p><span className="text-teal">x</span>&nbsp; 0.000</p>
                <p><span className="text-teal">y</span>&nbsp; 0.000</p>
                <p><span className="text-teal">z</span>&nbsp; 0.000</p>
                <p className="pt-1 text-foreground">mixed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/80 bg-card px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-teal" aria-hidden="true" />
            <span className="font-mono text-xs text-secondary-foreground">Expected Bell-pair distribution</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">Ideal simulator · 2 qubits · 1,024 shots</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <section
        className="relative isolate border-b border-border/70"
        aria-labelledby="hero-heading"
      >
        <div className="mx-auto grid w-full max-w-screen-2xl gap-7 px-5 py-8 sm:px-8 sm:py-9 xl:grid-cols-2 xl:items-center xl:gap-8 xl:px-10 xl:py-8">
          <div className="max-w-xl xl:max-w-2xl">
            <p className={`${eyebrow} flex items-center gap-3 text-primary`}>
              <span className="size-2 rounded-full bg-primary ring-4 ring-primary/10" aria-hidden="true" />
              Quantum learning, rebuilt
            </p>
            <h1 id="hero-heading" className="mt-4 max-w-none text-4xl font-semibold leading-[0.98] tracking-tight text-foreground sm:text-5xl xl:text-[3.45rem] 2xl:text-[4.15rem]">
              <span className="block 2xl:whitespace-nowrap">Understand the state.</span>
              <span className="mt-1 block text-primary 2xl:whitespace-nowrap">Shape the circuit.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Learn quantum computing through guided lessons, real experiments,
              and visual results that make difficult ideas easier to see.
            </p>
            <div className="mt-7 flex gap-3 sm:items-center">
              <Button
                asChild
                size="lg"
                className="h-auto px-6 py-3 text-base shadow-lg shadow-primary/20 sm:px-7"
              >
                <Link href="/learn">
                  Getting started
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-auto border-primary/30 bg-card/80 px-6 py-3 text-base text-primary hover:border-primary/50 hover:bg-primary-soft hover:text-primary sm:px-7"
              >
                <a href="#features">
                  Explore features
                  <ArrowRight className="size-5" aria-hidden="true" />
                </a>
              </Button>
            </div>

            <div className="mt-7 grid max-w-lg pt-4 grid-cols-3 gap-5 sm:pt-5">
              {heroSignals.map(({ title, subtitle, icon: Icon }) => (
                <div key={title} className="flex min-w-0 items-start gap-2.5">
                  <Icon className="mt-0.5 size-5 shrink-0 text-primary/80 sm:size-6" strokeWidth={1.7} aria-hidden="true" />
                  <span className="min-w-0 text-xs leading-4 text-muted-foreground sm:text-sm">
                    <span className="block font-medium text-foreground/80">{title}</span>
                    <span className="block">{subtitle}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <CircuitPreview />
        </div>
      </section>

      {/* Learning Pipeline: How QuantLearn Works */}
      <section
        id="features"
        className="scroll-mt-24 border-b border-border/70 bg-gradient-to-b from-background via-surface-alt/40 to-background py-14 sm:py-18 lg:py-20"
        aria-labelledby="pipeline-heading"
      >
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col items-center text-center">
            <p className={`${eyebrow} text-primary`}>The Learning Pipeline</p>
            <h2
              id="pipeline-heading"
              className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
            >
              How QuantLearn Rebuilds Your Quantum Intuition
            </h2>
            <p className="mt-3.5 max-w-xl text-base leading-7 text-muted-foreground">
              A continuous 5-step feedback loop designed to take you from abstract theory to confident quantum circuit builder.
            </p>
          </div>

          {/* Horizontal Connected Pipeline */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 relative">
            {learningPipeline.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="group relative flex flex-col">
                  <Link
                    href={item.href}
                    className="flex flex-1 flex-col justify-between rounded-2xl border border-border/80 bg-card/70 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <div>
                      {/* Step Header */}
                      <div className="flex items-center justify-between pb-3">
                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold ${item.badge}`}>
                          Step {item.step}
                        </span>
                        <div className={`flex size-9 items-center justify-center rounded-xl border ${item.accent} transition-transform duration-300 group-hover:scale-110`}>
                          <Icon className="size-4" strokeWidth={2} />
                        </div>
                      </div>

                      <h3 className="mt-2 text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="font-mono text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        {item.subtitle}
                      </p>

                      <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <span>Explore</span>
                      <ChevronRight className="size-3.5" />
                    </div>
                  </Link>

                  {/* Desktop connector arrow between steps */}
                  {index < learningPipeline.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 size-6 items-center justify-center rounded-full border border-border/80 bg-card text-muted-foreground/60 shadow-sm"
                    >
                      <ChevronRight className="size-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Flow CTA */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-center">
            <Button asChild size="lg" className="gap-2 shadow-md shadow-primary/20">
              <Link href="/learn">
                <span>Start Learning Pipeline with Chapter 1</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href="/lab">
                <span>Jump Straight into Lab</span>
                <FlaskConical className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="problem" className="scroll-mt-24 border-b border-border/70 bg-surface-alt/40 py-16 sm:py-20 lg:py-24" aria-labelledby="problem-heading">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-5 lg:gap-14 lg:px-10">
          <div className="lg:col-span-2 space-y-4">
            <p className={`${eyebrow} text-teal flex items-center gap-1.5`}>
              <span className="size-2 rounded-full bg-teal" aria-hidden="true" />
              The Problem
            </p>
            <h2 id="problem-heading" className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl text-foreground">
              <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                Quantum learning
              </span>{" "}
              is hard for predictable reasons.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              The subject is powerful, but most learners need an intuitive visual bridge between mathematical notation on the page and the actual physical behavior of quantum circuits.
            </p>

            <div className="pt-2 hidden lg:block">
              <Button asChild variant="outline" size="sm" className="rounded-xl gap-2 text-xs border-primary/30 text-primary hover:bg-primary/10">
                <Link href="/learn">
                  Explore Guided Curriculum
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
            {problemPoints.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.num}
                  interactive
                  className="group relative flex flex-col justify-between rounded-2xl border-border/80 bg-card/80 p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                >
                  <CardContent className="p-0 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold ${item.badge}`}>
                        {item.num} · {item.tag}
                      </span>
                      <div className={`flex size-9 items-center justify-center rounded-xl border ${item.accent} transition-transform duration-300 group-hover:scale-110 shadow-xs`}>
                        <Icon className="size-4" strokeWidth={2} />
                      </div>
                    </div>

                    <h3 className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Redesigned The QuantLearn Approach Hero Banner */}
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 lg:col-span-5 shadow-xl shadow-primary/5">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7 space-y-3.5">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                  <Sparkles className="size-3.5" />
                  The QuantLearn Solution
                </div>
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground leading-snug">
                  <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                    Turn invisible ideas
                  </span>{" "}
                  into something you can work with.
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground max-w-xl">
                  Learn the idea visually with interactive Bloch spheres, build and test circuits instantly across industrial engines (Qiskit Aer, Cirq, PennyLane), and get 24/7 Socratic AI diagnostics whenever you get stuck.
                </p>
                <div className="pt-1 flex flex-wrap gap-2.5">
                  <Button asChild size="sm" className="rounded-xl gap-2 text-xs font-semibold shadow-md">
                    <Link href="/learn">
                      Get Started Free
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="rounded-xl gap-2 text-xs font-semibold border-border/80">
                    <Link href="/lab">
                      <FlaskConical className="size-3.5 text-primary" />
                      Open Simulator Lab
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-5 grid gap-3">
                <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card/90 p-3.5 shadow-xs transition-colors hover:border-cyan-500/40">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                    <BookOpen className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Live Bloch & Math Visuals</p>
                    <p className="text-[11px] text-muted-foreground">Interactive intuition for all 25 chapters</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card/90 p-3.5 shadow-xs transition-colors hover:border-emerald-500/40">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <FlaskConical className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Multi-Engine Quantum Lab</p>
                    <p className="text-[11px] text-muted-foreground">Qiskit, Cirq & PennyLane with 0 setup</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card/90 p-3.5 shadow-xs transition-colors hover:border-primary/40">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/30">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Socratic AI Mentorship</p>
                    <p className="text-[11px] text-muted-foreground">Instant concept diagnostics on quizzes and circuits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="border-t border-border/70 bg-surface-alt px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20" aria-labelledby="cta-heading">
        <div className="mx-auto max-w-5xl rounded-3xl border border-primary/15 bg-gradient-to-br from-primary-soft via-background to-secondary px-6 py-9 text-center shadow-xl sm:px-10 sm:py-12">
          <p className={`${eyebrow} text-primary`}>Your next experiment starts here</p>
          <h2 id="cta-heading" className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
            Ready to enter the quantum world?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-muted-foreground">
            Start from your first qubit or jump directly into the playground.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-auto px-6 py-3 text-base shadow-lg shadow-primary/20">
              <Link href="/learn">
                Start learning
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-auto border-primary/30 bg-card/80 px-6 py-3 text-base text-primary hover:bg-card hover:text-primary">
              <Link href="/lab">
                Explore the lab
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
