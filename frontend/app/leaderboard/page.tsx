"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Atom,
  Crown,
  Flame,
  Medal,
  RefreshCw,
  Search,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAvatar } from "@/lib/profile/avatars";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  username: string;
  avatarId: string;
  organization: string;
  masteryTitle: string;
  chaptersCompleted: number;
  quizzesTaken: number;
  avgQuizScore: number;
  labsPassed: number;
  streakDays: number;
  totalXP: number;
  isCurrentUser: boolean;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  currentUserRank: LeaderboardEntry | null;
  totalParticipants: number;
  lastUpdated: string;
}

type FilterTab = "xp" | "streak" | "chapters";

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("xp");
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchLeaderboard() {
    setLoading(true);
    try {
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const sortedList = React.useMemo(() => {
    if (!data?.leaderboard) return [];
    let list = [...data.leaderboard];

    if (filter === "streak") {
      list.sort((a, b) => b.streakDays - a.streakDays || b.totalXP - a.totalXP);
    } else if (filter === "chapters") {
      list.sort((a, b) => b.chaptersCompleted - a.chaptersCompleted || b.totalXP - a.totalXP);
    } else {
      list.sort((a, b) => b.totalXP - a.totalXP);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.username.toLowerCase().includes(q) ||
          e.organization.toLowerCase().includes(q)
      );
    }

    // Re-rank based on active filter
    return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [data, filter, searchQuery]);

  const top3 = sortedList.slice(0, 3);
  const currentUser = sortedList.find((e) => e.isCurrentUser) || data?.currentUserRank;

  return (
    <main className="w-full space-y-10 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 xl:px-12">
      {/* Page Header with High-Impact First Word Highlighting */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6">
        <div className="space-y-2">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary flex items-center gap-1.5">
            <Trophy className="size-3.5" />
            Competitive Cohort Telemetry
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
              Global Quantum
            </span>{" "}
            <span className="text-foreground">Leaderboard</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Track your standing in the cohort. Earn Quantum XP through completed chapters, high quiz scores, verified simulator circuits, and daily learning streaks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLeaderboard}
            disabled={loading}
            className="rounded-xl gap-2 text-xs"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button asChild size="sm" className="rounded-xl gap-2 text-xs font-semibold shadow-md">
            <Link href="/learn">
              Earn XP Now
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Top 3 Grandmaster Podium */}
      {top3.length >= 3 && !searchQuery && (
        <div className="grid gap-4 sm:grid-cols-3 pt-2">
          {/* Rank 2 (Silver) */}
          <div className="sm:order-1 order-2">
            <PodiumCard entry={top3[1]} rank={2} medalColor="text-slate-300" borderGlow="border-slate-400/40" />
          </div>

          {/* Rank 1 (Gold - Center & Elevated) */}
          <div className="sm:order-2 order-1 sm:-mt-4">
            <PodiumCard entry={top3[0]} rank={1} medalColor="text-amber-400" borderGlow="border-amber-400/50 shadow-amber-500/10 shadow-lg" isFirst />
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="sm:order-3 order-3">
            <PodiumCard entry={top3[2]} rank={3} medalColor="text-amber-700" borderGlow="border-amber-700/40" />
          </div>
        </div>
      )}

      {/* "Your Position" Sticky / Neighborhood Banner */}
      {currentUser && (
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/15 via-violet-500/10 to-transparent p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/20 border border-primary/30 text-primary font-mono text-lg font-bold shadow-xs">
                #{currentUser.rank}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm sm:text-base">
                    {currentUser.fullName}
                  </span>
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                    You
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentUser.organization} · {currentUser.masteryTitle}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
              <div className="flex flex-col items-start sm:items-end">
                <span className="text-[10px] uppercase font-mono text-muted-foreground">Total XP</span>
                <span className="font-mono font-bold text-primary text-base">
                  {currentUser.totalXP.toLocaleString()} XP
                </span>
              </div>
              <div className="flex flex-col items-start sm:items-end">
                <span className="text-[10px] uppercase font-mono text-muted-foreground">Streak</span>
                <span className="font-mono font-bold text-amber-500 flex items-center gap-1 text-sm">
                  <Flame className="size-3.5 fill-amber-500 text-amber-500" />
                  {currentUser.streakDays}d
                </span>
              </div>
              <div className="flex flex-col items-start sm:items-end">
                <span className="text-[10px] uppercase font-mono text-muted-foreground">Curriculum</span>
                <span className="font-mono font-bold text-foreground text-sm">
                  {currentUser.chaptersCompleted}/25
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 rounded-2xl border border-border/80 bg-muted/40 p-1.5 backdrop-blur-xs">
          <button
            type="button"
            onClick={() => setFilter("xp")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              filter === "xp"
                ? "bg-card text-primary shadow-xs ring-1 ring-primary/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ⚡ Highest XP
          </button>
          <button
            type="button"
            onClick={() => setFilter("streak")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              filter === "streak"
                ? "bg-card text-amber-500 shadow-xs ring-1 ring-amber-500/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🔥 Longest Streak
          </button>
          <button
            type="button"
            onClick={() => setFilter("chapters")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              filter === "chapters"
                ? "bg-card text-foreground shadow-xs ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📚 Most Chapters
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search learners or college..."
            className="rounded-xl pl-9 text-xs"
          />
        </div>
      </div>

      {/* Global Leaderboard Table */}
      <Card className="overflow-hidden rounded-3xl border-border/80 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/70 bg-muted/30 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3.5 pl-6 pr-3">Rank</th>
                <th className="px-3 py-3.5">Quantum Learner</th>
                <th className="px-3 py-3.5 hidden md:table-cell">Mastery Level</th>
                <th className="px-3 py-3.5 text-center">Streak</th>
                <th className="px-3 py-3.5 text-center">Quizzes</th>
                <th className="px-3 py-3.5 text-center">Avg Score</th>
                <th className="py-3.5 pl-3 pr-6 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {sortedList.map((entry) => {
                const avatar = getAvatar(entry.avatarId);
                return (
                  <tr
                    key={entry.userId}
                    className={`transition-colors ${
                      entry.isCurrentUser
                        ? "bg-primary/10 font-medium hover:bg-primary/15"
                        : "hover:bg-muted/40"
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 pl-6 pr-3">
                      <div className="flex items-center gap-1.5">
                        {entry.rank === 1 ? (
                          <Crown className="size-4 text-amber-400 fill-amber-400" />
                        ) : entry.rank === 2 ? (
                          <Medal className="size-4 text-slate-300" />
                        ) : entry.rank === 3 ? (
                          <Medal className="size-4 text-amber-700" />
                        ) : (
                          <span className="font-mono text-muted-foreground w-4 text-center">
                            {entry.rank}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Learner Info */}
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-9 shrink-0 items-center justify-center rounded-xl border ${avatar.borderClass} ${avatar.bgClass} shadow-xs`}
                        >
                          <div className="scale-90">{avatar.icon}</div>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-foreground truncate max-w-[160px] sm:max-w-none">
                              {entry.fullName}
                            </span>
                            {entry.isCurrentUser && (
                              <span className="rounded-full bg-primary/20 px-1.5 py-0.2 text-[9px] font-bold text-primary">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {entry.username} · {entry.organization}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Mastery Level */}
                    <td className="px-3 py-4 hidden md:table-cell text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-muted/40 px-2 py-0.5 text-[11px] text-foreground/80">
                        <Atom className="size-3 text-primary" />
                        {entry.masteryTitle}
                      </span>
                    </td>

                    {/* Streak */}
                    <td className="px-3 py-4 text-center">
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-500">
                        <Flame className="size-3.5 fill-amber-500 text-amber-500" />
                        {entry.streakDays}d
                      </span>
                    </td>

                    {/* Quizzes / Chapters */}
                    <td className="px-3 py-4 text-center font-mono">
                      <span className="text-foreground font-semibold">{entry.chaptersCompleted}</span>
                      <span className="text-muted-foreground">/25</span>
                    </td>

                    {/* Avg Score */}
                    <td className="px-3 py-4 text-center font-mono">
                      <span
                        className={`font-semibold ${
                          entry.avgQuizScore >= 90
                            ? "text-emerald-500"
                            : entry.avgQuizScore >= 80
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {entry.avgQuizScore}%
                      </span>
                    </td>

                    {/* Total XP */}
                    <td className="py-4 pl-3 pr-6 text-right">
                      <span className="font-mono text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-xl border border-primary/20">
                        {entry.totalXP.toLocaleString()} XP
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}

function PodiumCard({
  entry,
  rank,
  medalColor,
  borderGlow,
  isFirst = false,
}: {
  entry: LeaderboardEntry;
  rank: number;
  medalColor: string;
  borderGlow: string;
  isFirst?: boolean;
}) {
  const avatar = getAvatar(entry.avatarId);

  return (
    <Card
      className={`relative overflow-hidden rounded-3xl border bg-gradient-to-b from-card via-card to-muted/30 p-6 text-center transition-all ${borderGlow} ${
        isFirst ? "scale-105 ring-2 ring-amber-400/30" : ""
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Crown or Medal Badge */}
        <div className="relative">
          <div
            className={`flex ${
              isFirst ? "size-16" : "size-14"
            } items-center justify-center rounded-3xl border-2 ${avatar.borderClass} ${avatar.bgClass} shadow-md`}
          >
            <div className={isFirst ? "scale-125" : "scale-110"}>{avatar.icon}</div>
          </div>
          <span
            className={`absolute -bottom-2 -right-1 flex size-6 items-center justify-center rounded-full border border-card bg-card font-mono text-xs font-bold shadow-xs ${medalColor}`}
          >
            {rank === 1 ? <Crown className="size-3.5 fill-amber-400 text-amber-400" /> : `#${rank}`}
          </span>
        </div>

        {/* Name & Handle */}
        <div className="space-y-0.5">
          <div className="flex items-center justify-center gap-1.5">
            <h3 className="text-base font-bold text-foreground truncate max-w-[150px]">
              {entry.fullName}
            </h3>
            {entry.isCurrentUser && (
              <span className="rounded-full bg-primary/20 px-1.5 py-0.2 text-[9px] font-bold text-primary">
                You
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">
            {entry.organization}
          </p>
        </div>

        {/* XP Badge */}
        <div className="rounded-xl border border-primary/25 bg-primary/10 px-3 py-1 font-mono text-sm font-bold text-primary shadow-xs">
          {entry.totalXP.toLocaleString()} XP
        </div>

        {/* Micro Stats */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono pt-1">
          <span className="flex items-center gap-1 text-amber-500 font-bold">
            <Flame className="size-3 fill-amber-500" />
            {entry.streakDays}d
          </span>
          <span>•</span>
          <span>{entry.chaptersCompleted}/25 done</span>
          <span>•</span>
          <span>{entry.avgQuizScore}% avg</span>
        </div>
      </div>
    </Card>
  );
}
