"use client";

import { Button } from "@/components/ui/button";

export default function LearnError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-4 px-5 py-16 text-center">
      <h1 className="text-2xl font-semibold">Learn could not be loaded</h1>
      <p className="text-muted-foreground">
        Please check your connection and try again. Your saved progress is kept.
      </p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
