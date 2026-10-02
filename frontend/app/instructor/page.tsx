"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  BookOpen,
  FlaskConical,
  GraduationCap,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ChapterStat = {
  chapter_id: string;
  title?: string;
  module?: string;
  total_attempts: number;
  active_students: number;
  avg_score_percent: number | null;
};

type ChallengeStat = {
  challenge_id: string;
  title?: string;
  total_attempts: number;
  active_students: number;
  passed_count: number;
  pass_rate: number | null;
  avg_fidelity_score: number | null;
  aer_count: number;
  cirq_count: number;
  pennylane_count: number;
};

type ActivityItem = {
  type: "quiz" | "challenge";
  title: string;
  score: number;
  submitted_at: string;
};

type AnalyticsData = {
  totalLearners: number;
  totalQuizSubmissions: number;
  avgQuizScorePercent: number;
  totalLabSubmissions: number;
  labPassRate: number;
  chapterStats: ChapterStat[];
  challengeStats: ChallengeStat[];
  recentActivity: ActivityItem[];
};

export default function InstructorDashboard() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAnalytics() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/instructor");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to load cohort analytics.");
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analytics unavailable.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    fetch("/api/instructor")
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/login");
            return null;
          }
          throw new Error("Failed to load cohort analytics.");
        }
        return res.json();
      })
      .then((json) => {
        if (active && json) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Analytics unavailable.");
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [router]);

  const struggleChapters = data?.chapterStats.filter(
    (c) => c.avg_score_percent !== null && c.avg_score_percent < 70,
  ) || [];

  return (
    <main className="w-full space-y-8 px-5 py-8 sm:px-8 lg:px-10 xl:px-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-primary">
              <GraduationCap className="size-3.5" />
              Instructor Portal
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              SIH26140 Assessment & Progress Module
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Cohort Analytics & Performance
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Monitor student progression, diagnose curriculum friction points, and inspect quantum simulation challenge mastery.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAnalytics}
            disabled={loading}
            className="rounded-md"
          >
            <RefreshCw className={`mr-1.5 size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
          <Button asChild size="sm" className="rounded-md shadow-sm">
            <Link href="/lab">Open Lab Sandbox</Link>
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="rounded-2xl border-destructive/30 bg-destructive/5">
          <CardContent className="p-6 text-sm text-destructive">
            <p className="font-semibold">Unable to load cohort statistics</p>
            <p className="mt-1 text-xs opacity-90">{error}</p>
          </CardContent>
        </Card>
      ) : null}

      {/* Overview Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border/80 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Learners
            </span>
            <Users className="size-4 text-primary" />
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {data ? data.totalLearners : "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Enrolled students with activity
          </p>
        </Card>

        <Card className="rounded-2xl border-border/80 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Quiz Submissions
            </span>
            <BookOpen className="size-4 text-teal" />
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {data ? data.totalQuizSubmissions : "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Avg accuracy:{" "}
            <span className="font-semibold text-foreground">
              {data ? `${data.avgQuizScorePercent}%` : "—"}
            </span>
          </p>
        </Card>

        <Card className="rounded-2xl border-border/80 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Lab Challenges Run
            </span>
            <FlaskConical className="size-4 text-violet" />
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {data ? data.totalLabSubmissions : "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Challenge pass rate:{" "}
            <span className="font-semibold text-foreground">
              {data ? `${data.labPassRate}%` : "—"}
            </span>
          </p>
        </Card>

        <Card className="rounded-2xl border-border/80 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Curriculum Topics
            </span>
            <TrendingUp className="size-4 text-amber" />
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight">25</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Chapters across 5 modules
          </p>
        </Card>
      </div>

      {/* Friction Alert Banner if chapters have high failure rate */}
      {struggleChapters.length > 0 && (
        <Card className="rounded-2xl border-amber/30 bg-amber/10 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber" />
            <div>
              <h2 className="text-sm font-semibold text-amber">
                Curriculum Attention Required
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-foreground">
                Students are encountering high friction in{" "}
                {struggleChapters.map((c) => c.title || c.chapter_id).join(", ")}.
                Average quiz accuracy in these topics is below 70%. Consider scheduling a guided walkthrough or lab review.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="curriculum" className="space-y-6">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="curriculum">Curriculum Friction Heatmap</TabsTrigger>
          <TabsTrigger value="challenges">Lab Challenge Performance</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity Feed</TabsTrigger>
        </TabsList>

        {/* Tab 1: Curriculum Heatmap */}
        <TabsContent value="curriculum" className="space-y-4">
          <Card className="rounded-2xl border-border/80">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border/80 bg-secondary/50 font-mono text-xs text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3.5">Chapter</th>
                      <th className="px-5 py-3.5">Module</th>
                      <th className="px-5 py-3.5">Total Attempts</th>
                      <th className="px-5 py-3.5">Active Learners</th>
                      <th className="px-5 py-3.5">Avg Accuracy</th>
                      <th className="px-5 py-3.5">Friction Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {data?.chapterStats && data.chapterStats.length > 0 ? (
                      data.chapterStats.map((ch) => {
                        const score = ch.avg_score_percent;
                        let badgeColor = "bg-secondary text-muted-foreground";
                        let levelText = "No data yet";

                        if (score !== null) {
                          if (score >= 80) {
                            badgeColor = "bg-success/20 text-success";
                            levelText = "Low friction";
                          } else if (score >= 65) {
                            badgeColor = "bg-amber/20 text-amber";
                            levelText = "Moderate friction";
                          } else {
                            badgeColor = "bg-destructive/20 text-destructive";
                            levelText = "High friction";
                          }
                        }

                        return (
                          <tr key={ch.chapter_id} className="hover:bg-muted/40 transition-colors">
                            <td className="px-5 py-4 font-medium text-foreground">
                              <Link
                                href={`/learn/${ch.chapter_id}`}
                                className="hover:text-primary hover:underline"
                              >
                                {ch.title || ch.chapter_id.replaceAll("-", " ")}
                              </Link>
                            </td>
                            <td className="px-5 py-4 font-mono text-xs uppercase text-muted-foreground">
                              {ch.module || "—"}
                            </td>
                            <td className="px-5 py-4 font-mono text-xs">{ch.total_attempts}</td>
                            <td className="px-5 py-4 font-mono text-xs">{ch.active_students}</td>
                            <td className="px-5 py-4 font-mono text-xs font-semibold">
                              {score !== null ? `${score}%` : "—"}
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex rounded-full px-2.5 py-0.5 font-mono text-[0.7rem] font-medium ${badgeColor}`}>
                                {levelText}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">
                          {loading ? "Loading curriculum stats…" : "No quiz attempts recorded yet."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Lab Challenges */}
        <TabsContent value="challenges" className="space-y-4">
          <Card className="rounded-2xl border-border/80">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border/80 bg-secondary/50 font-mono text-xs text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3.5">Challenge</th>
                      <th className="px-5 py-3.5">Total Attempts</th>
                      <th className="px-5 py-3.5">Pass Count</th>
                      <th className="px-5 py-3.5">Pass Rate</th>
                      <th className="px-5 py-3.5">Avg Fidelity</th>
                      <th className="px-5 py-3.5">Framework Adoption</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {data?.challengeStats && data.challengeStats.length > 0 ? (
                      data.challengeStats.map((ch) => (
                        <tr key={ch.challenge_id} className="hover:bg-muted/40 transition-colors">
                          <td className="px-5 py-4 font-medium text-foreground">
                            <Link
                              href={`/lab?challenge=${ch.challenge_id}`}
                              className="hover:text-primary hover:underline"
                            >
                              {ch.title || ch.challenge_id}
                            </Link>
                          </td>
                          <td className="px-5 py-4 font-mono text-xs">{ch.total_attempts}</td>
                          <td className="px-5 py-4 font-mono text-xs">{ch.passed_count}</td>
                          <td className="px-5 py-4 font-mono text-xs font-semibold">
                            {ch.pass_rate !== null ? `${ch.pass_rate}%` : "—"}
                          </td>
                          <td className="px-5 py-4 font-mono text-xs">
                            {ch.avg_fidelity_score !== null ? `${ch.avg_fidelity_score}/100` : "—"}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 font-mono text-[0.7rem] text-muted-foreground">
                              <span className="rounded bg-secondary px-1.5 py-0.5">Aer: {ch.aer_count}</span>
                              <span className="rounded bg-secondary px-1.5 py-0.5">Cirq: {ch.cirq_count}</span>
                              <span className="rounded bg-secondary px-1.5 py-0.5">PL: {ch.pennylane_count}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">
                          {loading ? "Loading challenge diagnostics…" : "No lab submissions recorded yet."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Recent Activity */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="rounded-2xl border-border/80">
            <CardContent className="p-5">
              <div className="space-y-3">
                {data?.recentActivity && data.recentActivity.length > 0 ? (
                  data.recentActivity.map((act, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-xl border border-border/70 p-3.5 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {act.type === "quiz" ? (
                          <span className="rounded-lg bg-primary/10 p-2 text-primary">
                            <BookOpen className="size-4" />
                          </span>
                        ) : (
                          <span className="rounded-lg bg-violet/10 p-2 text-violet">
                            <FlaskConical className="size-4" />
                          </span>
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {act.type === "quiz" ? "Chapter Quiz" : "Lab Challenge"}:{" "}
                            <span className="font-mono">{act.title}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(act.submitted_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-sm font-semibold text-primary">
                        Score: {act.score}%
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    {loading ? "Loading activity feed…" : "No recent activity."}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
