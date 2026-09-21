import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";

export type LabHandoffChallenge = {
  id: string;
  title: string;
  objective: string;
  difficulty?: string;
  hint?: string;
};

export function LabHandoff({
  chapterId,
  challenges,
}: {
  chapterId: string;
  challenges: LabHandoffChallenge[];
}) {
  if (!challenges.length) return null;
  return (
    <div id="lab-handoff" className="space-y-4 rounded-2xl border border-primary/20 bg-card p-5 sm:p-6">
      <div className="flex gap-3">
        <FlaskConical className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="space-y-1">
          <h3 className="font-semibold">Try this in Lab.</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You have checked the idea. Now build the open-ended circuit in Lab,
            where execution, grading and saved attempts are handled separately.
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="space-y-3 rounded-xl border border-border/70 bg-secondary/30 p-4">
            <div className="space-y-1">
              <h4 className="font-medium">{challenge.title}</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">{challenge.objective}</p>
              <p className="text-xs leading-relaxed text-secondary-foreground">
                Debugging prompt: {challenge.hint ?? "Compare the statevector, output basis and expected result."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/lab?challenge=${challenge.id}`}>
                  Open challenge <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/learn/${chapterId}#study-material`}>Back to lesson</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
