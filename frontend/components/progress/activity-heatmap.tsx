"use client";

import React, { useMemo, useState } from "react";
import { Calendar, Flame, Sparkles, Trophy, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ActivityHeatmapProps {
  quizAttempts: Array<{ submitted_at: string }>;
  labAttempts: Array<{ submitted_at: string }>;
  currentStreak: number;
}

interface DayData {
  dateStr: string;
  formattedDate: string;
  dayOfWeek: number; // 0 = Sun, 6 = Sat
  total: number;
  quizCount: number;
  labCount: number;
  level: number; // 0 to 4
  isToday: boolean;
}

interface WeekData {
  weekIndex: number;
  monthLabel?: string;
  days: (DayData | null)[];
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ActivityHeatmap({
  quizAttempts,
  labAttempts,
  currentStreak,
}: ActivityHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);

  const { weeks, stats } = useMemo(() => {
    // 1. Group submissions by date string YYYY-MM-DD
    const dateMap = new Map<string, { total: number; quiz: number; lab: number }>();

    for (const a of quizAttempts) {
      const d = a.submitted_at ? a.submitted_at.slice(0, 10) : "";
      if (!d) continue;
      const prev = dateMap.get(d) || { total: 0, quiz: 0, lab: 0 };
      dateMap.set(d, {
        total: prev.total + 1,
        quiz: prev.quiz + 1,
        lab: prev.lab,
      });
    }

    for (const l of labAttempts) {
      const d = l.submitted_at ? l.submitted_at.slice(0, 10) : "";
      if (!d) continue;
      const prev = dateMap.get(d) || { total: 0, quiz: 0, lab: 0 };
      dateMap.set(d, {
        total: prev.total + 1,
        quiz: prev.quiz,
        lab: prev.lab + 1,
      });
    }

    // 2. Compute longest streak
    const activeDates = Array.from(dateMap.keys()).sort();
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const dStr of activeDates) {
      const cur = new Date(dStr);
      if (lastDate) {
        const diffMs = cur.getTime() - lastDate.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      lastDate = cur;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    // 3. Generate 16 weeks (112 days) leading up to today
    const today = new Date();
    const todayDateStr = today.toISOString().slice(0, 10);
    const dayOfWeekToday = today.getDay(); // 0 to 6
    const totalDaysToShow = 16 * 7; // 16 full weeks

    // Calculate start date (Sunday 15 weeks before the current week's Sunday)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeekToday - 15 * 7);

    const generatedWeeks: WeekData[] = [];
    let currentWeek: (DayData | null)[] = [];
    let lastSeenMonth = -1;

    for (let i = 0; i < totalDaysToShow; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);

      const dStr = d.toISOString().slice(0, 10);
      const isFuture = d.getTime() > today.getTime();
      const countData = dateMap.get(dStr) || { total: 0, quiz: 0, lab: 0 };

      let level = 0;
      if (countData.total >= 5) level = 4;
      else if (countData.total >= 3) level = 3;
      else if (countData.total >= 2) level = 2;
      else if (countData.total >= 1) level = 1;

      const dayObj: DayData | null = isFuture
        ? null
        : {
            dateStr: dStr,
            formattedDate: d.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            dayOfWeek: d.getDay(),
            total: countData.total,
            quizCount: countData.quiz,
            labCount: countData.lab,
            level,
            isToday: dStr === todayDateStr,
          };

      currentWeek.push(dayObj);

      if (currentWeek.length === 7) {
        // First non-null day of this week to check month
        const firstDay = currentWeek.find((item) => item !== null);
        let monthLabel: string | undefined = undefined;

        if (firstDay) {
          const mDate = new Date(firstDay.dateStr);
          const m = mDate.getMonth();
          if (m !== lastSeenMonth) {
            monthLabel = mDate.toLocaleDateString("en-US", { month: "short" });
            lastSeenMonth = m;
          }
        }

        generatedWeeks.push({
          weekIndex: generatedWeeks.length,
          monthLabel,
          days: currentWeek,
        });
        currentWeek = [];
      }
    }

    return {
      weeks: generatedWeeks,
      stats: {
        totalSubmissions: quizAttempts.length + labAttempts.length,
        activeDays: dateMap.size,
        longestStreak,
      },
    };
  }, [quizAttempts, labAttempts, currentStreak]);

  // Color mapping per level
  const getLevelClasses = (level: number, isToday: boolean) => {
    if (level === 4)
      return "bg-primary border-primary shadow-[0_0_8px_rgba(124,58,237,0.7)] text-primary-foreground";
    if (level === 3)
      return "bg-primary/80 border-primary/90 text-primary-foreground";
    if (level === 2)
      return "bg-primary/50 border-primary/60 text-primary-foreground";
    if (level === 1)
      return "bg-primary/25 border-primary/40 text-primary";
    return isToday
      ? "bg-muted/60 border-primary/40 ring-1 ring-primary/30"
      : "bg-muted/30 border-border/50 hover:border-border";
  };

  return (
    <Card className="rounded-3xl border-border/80 bg-gradient-to-br from-card via-card to-card/90 shadow-sm">
      <CardContent className="space-y-6 p-6 sm:p-8">
        {/* Header & Metric Highlights */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
          <div className="space-y-1">
            <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              <span>
                <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                  Quantum Consistency
                </span>{" "}
                & Activity Heatmap
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Daily quiz and quantum simulator engagement across the last 16 weeks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Current Streak */}
            <div className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 shadow-xs">
              <Flame className="size-4 fill-amber-500 text-amber-500 animate-pulse" />
              <div className="text-xs">
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {currentStreak} {currentStreak === 1 ? "Day" : "Days"}
                </span>
                <span className="text-muted-foreground ml-1">Current Streak</span>
              </div>
            </div>

            {/* Longest Streak */}
            <div className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/10 px-3 py-1.5 shadow-xs">
              <Trophy className="size-4 text-primary" />
              <div className="text-xs">
                <span className="font-bold text-primary">
                  {stats.longestStreak} {stats.longestStreak === 1 ? "Day" : "Days"}
                </span>
                <span className="text-muted-foreground ml-1">Best Streak</span>
              </div>
            </div>

            {/* Total Submissions */}
            <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-muted/30 px-3 py-1.5 text-xs text-foreground font-medium">
              <Zap className="size-3.5 text-cyan-400" />
              <span>{stats.totalSubmissions} Total Submissions</span>
            </div>
          </div>
        </div>

        {/* Heatmap Grid Container */}
        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="inline-flex flex-col gap-1 min-w-[620px]">
            {/* Month Labels Row */}
            <div className="flex pl-8 text-[11px] font-medium text-muted-foreground">
              {weeks.map((week, idx) => (
                <div key={idx} className="w-[18px] mr-1 text-center shrink-0">
                  {week.monthLabel ? (
                    <span className="font-semibold text-primary">{week.monthLabel}</span>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Days Grid: 7 Rows (Sun to Sat) */}
            <div className="flex gap-1.5">
              {/* Day Name Column */}
              <div className="flex flex-col gap-1 pr-1 text-[9px] font-mono text-muted-foreground justify-between">
                <span className="h-[14px] leading-[14px]">Mon</span>
                <span className="h-[14px] leading-[14px]">Wed</span>
                <span className="h-[14px] leading-[14px]">Fri</span>
              </div>

              {/* Weeks Columns */}
              <div className="flex gap-1">
                {weeks.map((week) => (
                  <div key={week.weekIndex} className="flex flex-col gap-1">
                    {week.days.map((day, dayIndex) => {
                      if (!day) {
                        return (
                          <div
                            key={dayIndex}
                            className="size-3.5 rounded-sm bg-transparent"
                            aria-hidden="true"
                          />
                        );
                      }

                      return (
                        <div
                          key={day.dateStr}
                          onMouseEnter={() => setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          className={`size-3.5 rounded-sm border transition-all duration-150 cursor-pointer hover:scale-125 hover:z-10 ${getLevelClasses(
                            day.level,
                            day.isToday,
                          )}`}
                          aria-label={`${day.formattedDate}: ${day.total} activities`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Live Hover Inspector + Intensity Legend */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border/50 pt-4 text-xs">
          {/* Hover Status Box */}
          <div className="min-h-[22px] flex items-center gap-2">
            {hoveredDay ? (
              <span className="inline-flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-1 text-xs text-foreground font-medium border border-border/60">
                <Sparkles className="size-3.5 text-primary" />
                <span className="font-semibold text-primary">{hoveredDay.formattedDate}:</span>
                <span>
                  {hoveredDay.total === 0
                    ? "No quantum activity recorded"
                    : `${hoveredDay.total} ${
                        hoveredDay.total === 1 ? "submission" : "submissions"
                      } (${hoveredDay.quizCount} quizzes, ${hoveredDay.labCount} lab circuits)`}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground text-[11px] italic">
                Hover over any grid cell to inspect daily quantum telemetry.
              </span>
            )}
          </div>

          {/* Color Intensity Legend */}
          <div className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
            <span>Less</span>
            <div className="size-3 rounded-xs border border-border/50 bg-muted/30" title="0 submissions" />
            <div className="size-3 rounded-xs border border-primary/40 bg-primary/25" title="1 submission" />
            <div className="size-3 rounded-xs border border-primary/60 bg-primary/50" title="2 submissions" />
            <div className="size-3 rounded-xs border border-primary/90 bg-primary/80" title="3-4 submissions" />
            <div className="size-3 rounded-xs border border-primary bg-primary shadow-xs" title="5+ submissions" />
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
