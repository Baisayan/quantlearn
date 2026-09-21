import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";

export type LabHandoffChallenge = {
  id: string;
  title: string;
  objective: string;
  difficulty?: string;
};

export function LabHandoff({ challenges }: { challenges: LabHandoffChallenge[] }) {
  if (!challenges.length) return null;
  return (
    <div className="space-y-4 rounded-2xl border border-primary/20 bg-card p-5 sm:p-6">
      <div className="flex gap-3">
        <FlaskConical className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="space-y-1">
          <h3 className="font-semibold">You have the idea. Build it in Lab.</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Move from the worked example to an open-ended circuit. The Lab runs and grades the challenge separately.
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="space-y-3 rounded-xl border border-border/70 bg-secondary/30 p-4">
            <div className="space-y-1">
              <h4 className="font-medium">{challenge.title}</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">{challenge.objective}</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={`/lab?challenge=${challenge.id}`}>
                Try in Lab <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
