import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChartNoAxesCombined,
  FlaskConical,
  Infinity,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const buttonMotion =
  "transition-[transform,background-color,border-color,color,box-shadow] duration-[160ms] [transition-timing-function:cubic-bezier(0.2,0,0,1)] active:scale-[0.96]";
const eyebrow = "font-mono text-[0.7rem] font-semibold uppercase leading-tight tracking-[0.16em]";

const problemPoints = [
  "Abstract concepts are difficult to picture.",
  "Theory-heavy resources can make progress feel slow.",
  "There is too little hands-on practice while learning.",
  "Access to real quantum hardware is limited.",
];

const features = [
  {
    title: "Guided learning paths",
    description:
      "Move from qubits and gates to algorithms through structured, visual lessons.",
    icon: BookOpen,
    iconClassName: "bg-primary-soft text-primary",
  },
  {
    title: "Build real circuits",
    description:
      "Drag gates into a circuit or write Python, then run the experiment in your browser.",
    icon: Infinity,
    iconClassName: "bg-secondary text-teal",
  },
  {
    title: "See the quantum state",
    description:
      "Read histograms, statevectors, Bloch views, and circuit output together.",
    icon: ChartNoAxesCombined,
    iconClassName: "bg-accent text-[#a96e09]",
  },
  {
    title: "Learn with an AI tutor",
    description:
      "Ask for explanations, hints, debugging help, and a study plan when you need it.",
    icon: Sparkles,
    iconClassName: "bg-[#f0edff] text-[#6d5ce7]",
  },
] as const;

const heroSignals = [
  { title: "Interactive", subtitle: "lessons", icon: BookOpen },
  { title: "Real quantum", subtitle: "experiments", icon: FlaskConical },
  { title: "Visual results", subtitle: "and progress", icon: ChartNoAxesCombined },
] as const;

function CircuitPreview() {
  return (
    <div className="relative mx-auto w-full max-w-none">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-black/10 bg-white/95 p-3 shadow-[0_24px_80px_rgba(35,87,217,0.18)] sm:p-4">
        <div className="flex items-center justify-between border-b border-border/70 px-1 pb-2.5 sm:px-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2 rounded-full bg-[#FF6B5F]" />
            <span className="size-2 rounded-full bg-[#FFBF3F]" />
            <span className="size-2 rounded-full bg-[#42C88A]" />
          </div>
          <span className="font-mono text-[0.62rem] font-medium text-muted-foreground">
            Quantum Circuit Lab
          </span>
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-0.5 font-mono text-[0.62rem] font-medium text-white shadow-sm shadow-primary/20">
              <span className="text-[0.55rem]">▶</span>
              Run
            </span>
            <span className="rounded-md border border-border bg-white px-2.5 py-0.5 font-mono text-[0.62rem] text-foreground">
              ↻&nbsp; Reset
            </span>
          </div>
        </div>

        <div className="mt-2.5 grid gap-2.5 md:grid-cols-[minmax(0,1.18fr)_minmax(190px,0.82fr)]">
          <div className="min-w-0 rounded-xl border border-border/80 bg-surface-alt p-2 sm:p-3">
            <svg
              viewBox="0 0 620 190"
              className="h-auto w-full"
              role="img"
              aria-label="Two-qubit Bell state circuit with a Hadamard and controlled-X gate"
            >
              <title>Bell state circuit</title>
              <defs>
                <pattern id="hero-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#DCE6F4" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="620" height="190" rx="12" fill="url(#hero-grid)" />
              <g fill="#152235" fontFamily="IBM Plex Mono, monospace" fontSize="16">
                <text x="18" y="64">q0</text>
                <text x="18" y="132">q1</text>
                <text x="56" y="64">|0⟩</text>
                <text x="56" y="132">|0⟩</text>
              </g>
              <g stroke="#152235" strokeWidth="2" fill="none">
                <path d="M 100 59 H 550" />
                <path d="M 100 127 H 550" />
                <path d="M 318 59 V 127" />
              </g>
              <g fill="#E6EEFF" stroke="#2357D9" strokeWidth="2">
                <rect x="150" y="32" width="54" height="54" rx="8" />
              </g>
              <text x="170" y="67" fill="#2357D9" fontFamily="IBM Plex Mono, monospace" fontSize="22" fontWeight="600">H</text>
              <circle cx="318" cy="59" r="8" fill="#2357D9" />
              <circle cx="318" cy="127" r="20" fill="#FFFFFF" stroke="#0D8F83" strokeWidth="2" />
              <path d="M 306 127 H 330 M 318 115 V 139" stroke="#0D8F83" strokeWidth="2" />
              <g stroke="#B7791F" strokeWidth="2" fill="#FFF7E6">
                <rect x="440" y="32" width="54" height="54" rx="8" />
                <rect x="440" y="100" width="54" height="54" rx="8" />
              </g>
              <g stroke="#B7791F" strokeWidth="2" fill="none">
                <path d="M 453 70 A 17 17 0 0 1 481 70" />
                <path d="M 467 70 L 477 55" />
                <path d="M 453 138 A 17 17 0 0 1 481 138" />
                <path d="M 467 138 L 477 123" />
              </g>
              <g fill="#637083" fontFamily="IBM Plex Mono, monospace" fontSize="12">
                <text x="438" y="18">measure</text>
                <text x="538" y="64">m0</text>
                <text x="538" y="132">m1</text>
              </g>
            </svg>
          </div>

          <div className="flex min-h-[135px] flex-col justify-center rounded-xl border border-border/80 bg-white p-3.5">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              State (ideal)
            </p>
            <p className="mt-3 font-mono text-sm leading-6 text-foreground sm:text-base">
              |ψ⟩ = 1/√2 (|00⟩ + |11⟩)
            </p>
            <span className="mt-3 w-fit rounded-md bg-[#E9F8F5] px-2 py-1 font-mono text-[0.62rem] text-teal">
              maximally entangled
            </span>
          </div>
        </div>

        <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
          <div className="rounded-xl border border-border/80 bg-white p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-foreground">Measurement results</p>
              <span className="font-mono text-[0.65rem] text-muted-foreground">1,024 shots</span>
            </div>
            <div className="mt-2 grid grid-cols-4 items-end gap-2">
              {[0.5, 0, 0, 0.5].map((value, index) => (
                <div key={`${value}-${index}`} className="space-y-2 text-center">
                  <div className="flex h-16 flex-col items-center justify-end gap-1">
                    <span className="font-mono text-[0.58rem] text-foreground">{value.toFixed(3)}</span>
                    <div
                      className="w-full max-w-8 rounded-t-md bg-amber"
                      style={{ height: `${Math.max(value * 100, 3)}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="font-mono text-[0.65rem] text-muted-foreground">
                    {index.toString(2).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border/80 bg-[#F0FBF9] p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-foreground">Bloch sphere (q0)</p>
              <span className="font-mono text-[0.62rem] text-teal">reduced state</span>
            </div>
            <div className="mt-2 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <div className="min-w-0">
                <svg
                  viewBox="0 0 224 176"
                  className="mx-auto h-auto w-full max-w-[150px] overflow-visible"
                  role="img"
                  aria-label="Bloch sphere for the maximally mixed reduced state of qubit zero"
                >
                  <title>Maximally mixed reduced Bloch state</title>
                  <defs>
                    <radialGradient id="bloch-fill" cx="34%" cy="28%" r="76%">
                      <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.96" />
                      <stop offset="0.48" stopColor="#37C2B3" stopOpacity="0.18" />
                      <stop offset="1" stopColor="#0D8F83" stopOpacity="0.28" />
                    </radialGradient>
                  </defs>
                  <circle cx="88" cy="88" r="56" fill="url(#bloch-fill)" stroke="#0D8F83" strokeOpacity="0.38" />
                  <g fill="none" stroke="#0D8F83" strokeOpacity="0.38" strokeWidth="1">
                    <ellipse cx="88" cy="88" rx="56" ry="16" />
                    <ellipse cx="88" cy="88" rx="20" ry="56" />
                    <ellipse cx="88" cy="88" rx="42" ry="56" transform="rotate(-48 88 88)" />
                    <line x1="32" y1="88" x2="144" y2="88" />
                    <line x1="88" y1="32" x2="88" y2="144" />
                    <line x1="43" y1="126" x2="133" y2="50" />
                  </g>
                  <circle cx="88" cy="88" r="7" fill="#0D8F83" stroke="#FFFFFF" strokeWidth="3" />
                  <g fill="#0D7068" fontFamily="IBM Plex Mono, monospace" fontSize="10">
                    <text x="85" y="22">z</text>
                    <text x="151" y="92">x</text>
                    <text x="136" y="46">y</text>
                  </g>
                </svg>
              </div>
              <div className="space-y-2 font-mono text-[0.62rem] text-muted-foreground">
                <p><span className="text-teal">x</span>&nbsp; 0.000</p>
                <p><span className="text-teal">y</span>&nbsp; 0.000</p>
                <p><span className="text-teal">z</span>&nbsp; 0.000</p>
                <p className="pt-1 text-foreground">mixed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/80 bg-white px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#34B27B]" aria-hidden="true" />
            <span className="font-mono text-[0.62rem] text-[#23835E]">Expected Bell-pair distribution</span>
          </div>
          <span className="font-mono text-[0.58rem] text-muted-foreground">Ideal simulator · 2 qubits · 1,024 shots</span>
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
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_80%,rgba(13,143,131,0.08),transparent_32%)]" />
        <div className="mx-auto grid w-full max-w-[94rem] gap-7 px-5 pb-10 pt-0 sm:px-8 sm:pb-12 sm:pt-2 xl:grid-cols-[minmax(580px,1fr)_minmax(0,1fr)] xl:items-center xl:gap-8 xl:px-10 xl:pb-14 xl:pt-3">
          <div className="max-w-xl xl:max-w-[40rem]">
            <p className={`${eyebrow} flex items-center gap-3 text-primary`}>
              <span className="size-2 rounded-full bg-primary shadow-[0_0_0_5px_rgba(35,87,217,0.12)]" aria-hidden="true" />
              Quantum learning, rebuilt
            </p>
            <h1 id="hero-heading" className="mt-4 max-w-none text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-foreground sm:text-5xl xl:text-[3.45rem] 2xl:text-[4.15rem]">
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
                className={`${buttonMotion} h-auto rounded-xl bg-primary px-6 py-3.5 text-base shadow-[0_12px_24px_rgba(35,87,217,0.22)] hover:bg-primary/90 sm:px-7`}
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
                className={`${buttonMotion} h-auto rounded-xl border-primary/30 bg-white/70 px-6 py-3.5 text-base text-primary hover:border-primary/50 hover:bg-primary-soft hover:text-primary sm:px-7`}
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

      <section id="problem" className="scroll-mt-24 bg-surface-alt py-14 sm:py-16 lg:py-20" aria-labelledby="problem-heading">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:px-10">
          <div>
            <p className={`${eyebrow} text-teal`}>The problem</p>
            <h2 id="problem-heading" className="mt-4 max-w-md text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
              Quantum learning is hard for predictable reasons.
            </h2>
            <p className="mt-5 max-w-md leading-7 text-muted-foreground">
              The subject is powerful, but most learners need a bridge between
              the notation on the page and the behavior of a real circuit.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {problemPoints.map((point, index) => (
              <div key={point} className="group rounded-2xl border border-border/80 bg-white p-4 shadow-[0_8px_24px_rgba(24,55,105,0.04)] transition-[transform,box-shadow,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_14px_32px_rgba(24,55,105,0.08)]">
                <span className="font-mono text-xs font-medium text-primary/70">0{index + 1}</span>
                <p className="mt-4 text-base font-medium leading-6 text-foreground">{point}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[1.5rem] border border-primary/15 bg-primary-soft p-5 sm:p-6 lg:col-span-2 lg:flex lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-xl">
              <p className={`${eyebrow} text-primary`}>The QuantLearn approach</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">Turn invisible ideas into something you can work with.</h3>
            </div>
            <p className="mt-5 max-w-xl leading-7 text-muted-foreground lg:mt-0">
              Learn the idea, build a small circuit, run it across simulators,
              and read the result with help available at the exact moment you
              get stuck.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-24 bg-background py-14 sm:py-16 lg:py-20" aria-labelledby="features-heading">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className={`${eyebrow} text-primary`}>One connected workspace</p>
            <h2 id="features-heading" className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
              Everything you need to go from curious to capable.
            </h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              QuantLearn brings the curriculum, circuit playground, simulations,
              and feedback loop into one focused place.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ title, description, icon: Icon, iconClassName }) => (
              <Card
                key={title}
                className="group h-full rounded-2xl border-border/80 bg-white shadow-[0_8px_24px_rgba(24,55,105,0.04)] transition-[transform,box-shadow,border-color] duration-150 ease-out hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_18px_40px_rgba(24,55,105,0.09)]"
              >
                <CardContent className="flex h-full flex-col p-5">
                  <div
                    className={`inline-flex size-11 items-center justify-center rounded-[0.875rem] border border-border/70 ${iconClassName}`}
                  >
                    <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold leading-6 tracking-[-0.02em]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/70 bg-surface-alt px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20" aria-labelledby="cta-heading">
        <div className="mx-auto max-w-5xl rounded-[1.75rem] border border-primary/15 bg-[linear-gradient(135deg,#E6EEFF_0%,#F6FAFF_48%,#E9F8F5_100%)] px-6 py-9 text-center shadow-[0_24px_70px_rgba(35,87,217,0.1)] sm:px-10 sm:py-12">
          <p className={`${eyebrow} text-primary`}>Your next experiment starts here</p>
          <h2 id="cta-heading" className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
            Ready to enter the quantum world?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-muted-foreground">
            Start from your first qubit or jump directly into the playground.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className={`${buttonMotion} h-auto rounded-xl px-6 py-3.5 text-base shadow-lg shadow-primary/20`}>
              <Link href="/learn">
                Start learning
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className={`${buttonMotion} h-auto rounded-xl border-primary/30 bg-white/70 px-6 py-3.5 text-base text-primary hover:bg-white hover:text-primary`}>
              <Link href="/lab">
                Explore the lab
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/70 bg-background px-5 py-7 sm:px-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 QuantLearn. Made by Ved with ❤️.</p>
          <a
            href="https://github.com/Baisayan/quantlearn"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 font-medium text-foreground underline-offset-4 transition-[color] duration-150 ease-out hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
          >
            View on GitHub
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </footer>
    </main>
  );
}
