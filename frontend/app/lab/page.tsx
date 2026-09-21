import { LabWorkspace } from "@/components/lab/workspace";

type LabPageProps = {
  searchParams: Promise<{ challenge?: string }>;
};

export default async function LabPage({ searchParams }: LabPageProps) {
  const { challenge } = await searchParams;
  return <LabWorkspace key={challenge ?? "bell"} initialChallengeId={challenge} />;
}
