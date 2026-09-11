import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesCombined,
  Infinity,
  Play,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "AI-Powered Learning",
    description: "Get instant, personalized explanations.",
    icon: Sparkles,
  },
  {
    title: "Visual Understanding",
    description: "See quantum concepts come to life.",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Real Progress",
    description: "Build intuition. Go beyond memorization.",
    icon: Infinity,
  },
];

export default function Home() {
  return (
    <main
      className="flex h-svh min-h-svh flex-col overflow-hidden bg-cover bg-center bg-no-repeat text-foreground"
      style={{ backgroundImage: "url('/bg.webp')" }}
    >
      <header className="mx-auto flex w-full max-w-7xl shrink-0 items-center justify-between px-6 py-4 sm:px-8 sm:py-5 lg:px-10">
        <Link
          href="/"
          aria-label="QuantLearn home"
          className="text-2xl font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
        >
          <span className="text-foreground">Quant</span>
          <span className="text-primary">Learn</span>
        </Link>

        <Button
          asChild
          size="lg"
          className="h-auto rounded-full px-6 py-3 font-medium shadow-lg shadow-primary/25 sm:px-8"
        >
          <Link href="/sign-up">
            Getting Started
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </header>

      <section
        className="flex min-h-0 flex-1 items-center justify-center px-6 pb-10 text-center sm:px-8 sm:pb-16 lg:px-10 lg:pb-24"
        aria-labelledby="hero-heading"
      >
        <div className="flex w-full max-w-6xl flex-col items-center">
          <h1
            id="hero-heading"
            className="max-w-4xl text-4xl font-bold leading-none tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="block">Learn Quantum Smarter</span>
            <span className="block">
              with <span className="text-primary">QuantLearn</span>
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-6 text-muted-foreground sm:mt-7 sm:text-lg sm:leading-7 lg:text-xl">
            <span className="block">
              An AI-based quantum learning platform that helps you understand
            </span>
            <span className="block">
              quantum concepts faster and more intuitively.
            </span>
          </p>

          <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="h-auto rounded-full px-8 py-3.5 text-base font-medium shadow-xl shadow-primary/25 sm:px-9"
            >
              <Link href="/sign-up">
                Getting Started
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-auto rounded-full border-primary/50 bg-white/20 px-8 py-3.5 text-base font-medium text-primary shadow-sm hover:bg-white/50 hover:text-primary sm:px-9"
            >
              <Link href="/learn">
                <Play className="size-5 fill-current" />
                Explore Features
              </Link>
            </Button>
          </div>

          <ul
            className="mt-10 grid w-full max-w-6xl grid-cols-3 gap-3 sm:mt-12 sm:gap-5"
            aria-label="QuantLearn features"
          >
            {features.map(({ title, description, icon: Icon }) => (
              <li key={title} className="min-w-0">
                <Card className="h-full border-white/70 bg-white/55 shadow-lg shadow-primary/5 backdrop-blur-md">
                  <CardContent className="flex h-full items-center gap-3 p-3 text-left sm:gap-4 sm:p-5 lg:p-6">
                    <Icon
                      className="size-7 shrink-0 text-primary drop-shadow-sm sm:size-9"
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-5 text-foreground sm:text-sm lg:text-base">
                        {title}
                      </p>
                      <p className="hidden text-sm leading-6 text-muted-foreground sm:block lg:text-base">
                        {description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
