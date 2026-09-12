"use client";

import { Button } from "@/components/ui/button";

export default function ProgressError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-2xl space-y-4 px-5 py-16 text-center">
      <h1 className="text-2xl font-semibold">Progress could not be loaded</h1>
      <p className="text-muted-foreground">
        Check your connection and try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
