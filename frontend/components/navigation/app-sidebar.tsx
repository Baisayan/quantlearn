"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  Cpu,
  FlaskConical,
  GraduationCap,
  TrendingUp,
  Trophy,
} from "lucide-react";

import challenges from "@/.generated/lab.json";
import learnContent from "@/.generated/learn.json";

type Section = "learn" | "lab" | null;

function activeChapter(pathname: string) {
  if (!pathname.startsWith("/learn/")) return undefined;
  const chapterId = pathname.split("/")[2];
  return learnContent.chapters.find((chapter) => chapter.id === chapterId);
}

export function AppSidebar() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapter = activeChapter(pathname);
  const [openModules, setOpenModules] = useState<string[]>(
    chapter ? [chapter.module] : ["foundations"],
  );
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    async function fetchProgress() {
      try {
        const res = await fetch("/api/progress");
        if (res.ok) {
          const data = await res.json();
          if (mounted && Array.isArray(data.completedChapters)) {
            setCompletedChapters(data.completedChapters);
          }
        }
      } catch {
        // Ignore network errors
      }
    }

    fetchProgress();

    function onProgressUpdated(e: Event) {
      const customEvent = e as CustomEvent<{ chapterId?: string }>;
      if (customEvent.detail?.chapterId) {
        setCompletedChapters((prev) =>
          prev.includes(customEvent.detail.chapterId!)
            ? prev
            : [...prev, customEvent.detail.chapterId!],
        );
      } else {
        fetchProgress();
      }
    }

    window.addEventListener("quantlearn:progress-updated", onProgressUpdated);
    return () => {
      mounted = false;
      window.removeEventListener("quantlearn:progress-updated", onProgressUpdated);
    };
  }, []);

  function open(section: Exclude<Section, null>) {
    const target = section === "learn" ? "/learn" : "/lab";
    if (pathname !== target) router.push(target);
  }

  function toggleModule(moduleId: string) {
    setOpenModules((current) =>
      current.includes(moduleId)
        ? current.filter((id) => id !== moduleId)
        : [...current, moduleId],
    );
  }

  const openSection: Section = pathname.startsWith("/learn")
    ? "learn"
    : pathname.startsWith("/lab")
      ? "lab"
      : null;
  const learnOpen = openSection === "learn";
  const labOpen = openSection === "lab";
  const selectedChallenge = searchParams.get("challenge") ?? "bell";
  const totalChapters = learnContent.chapters.length;
  const progressPercent = totalChapters > 0 ? Math.round((completedChapters.length / totalChapters) * 100) : 0;

  return (
    <aside className="border-b border-border/70 bg-card/60 backdrop-blur-xl lg:sticky lg:top-16 lg:flex lg:h-[calc(100svh-4rem)] lg:w-80 lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="flex h-full w-full flex-col justify-between p-3 sm:p-4">
        <nav aria-label="Workspace navigation" className="space-y-3">
          {/* Learn Section Card */}
          <div className="space-y-1">
            <button
              type="button"
              aria-expanded={learnOpen}
              onClick={() => open("learn")}
              className={`group flex w-full items-center justify-between rounded-2xl border p-2.5 text-left transition-all duration-200 ${
                learnOpen
                  ? "border-primary/30 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent text-primary shadow-xs ring-1 ring-primary/20"
                  : "border-border/70 bg-card/70 hover:border-border hover:bg-muted/50 text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    learnOpen
                      ? "bg-primary/20 text-primary shadow-xs"
                      : "bg-muted text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  <BookOpen className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground tracking-tight">Curriculum</div>
                  <div className="text-[11px] font-medium text-muted-foreground">
                    {completedChapters.length} of {totalChapters} completed
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {completedChapters.length > 0 && (
                  <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                    {progressPercent}%
                  </span>
                )}
                <ChevronDown
                  className={`size-4 text-muted-foreground transition-transform duration-300 ${
                    learnOpen ? "rotate-180 text-primary" : "group-hover:text-foreground"
                  }`}
                  aria-hidden="true"
                />
              </div>
            </button>

            {/* Modules Accordion */}
            {learnOpen && (
              <div className="space-y-1 pt-1">
                {learnContent.modules.map((module, index) => {
                  const chapters = learnContent.chapters.filter(
                    (chapterItem) => chapterItem.module === module.id,
                  );
                  const expanded =
                    openModules.includes(module.id) || chapter?.module === module.id;
                  const modCompleted = chapters.filter((c) =>
                    completedChapters.includes(c.id),
                  ).length;
                  const isAllDone = chapters.length > 0 && modCompleted === chapters.length;

                  return (
                    <div key={module.id} className="space-y-1">
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() => toggleModule(module.id)}
                        className={`group flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left transition-all duration-200 ${
                          expanded
                            ? "bg-muted/70 text-foreground font-medium shadow-xs"
                            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={`flex size-5 shrink-0 items-center justify-center rounded-md font-mono text-[10px] font-bold transition-colors ${
                              isAllDone
                                ? "border border-primary/30 bg-primary/20 text-primary"
                                : modCompleted > 0
                                  ? "border border-primary/20 bg-primary/10 text-primary"
                                  : "border border-border/80 bg-muted text-muted-foreground"
                            }`}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="truncate text-xs font-semibold tracking-tight text-foreground/90">
                            {module.title}
                          </span>
                        </div>
                        <div className="ml-2 flex shrink-0 items-center gap-1.5">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {modCompleted}/{chapters.length}
                          </span>
                          <ChevronDown
                            className={`size-3.5 text-muted-foreground transition-transform duration-300 ${
                              expanded ? "rotate-180 text-foreground" : "group-hover:text-foreground"
                            }`}
                            aria-hidden="true"
                          />
                        </div>
                      </button>

                      {/* Chapters Continuous Stepper Rail */}
                      {expanded && (
                        <div className="relative ml-4 space-y-0.5 border-l-2 border-primary/25 py-1 pl-2.5">
                          {chapters.map((chapterItem) => {
                            const selected = pathname === `/learn/${chapterItem.id}`;
                            const isCompleted = completedChapters.includes(chapterItem.id);
                            return (
                              <Link
                                key={chapterItem.id}
                                href={`/learn/${chapterItem.id}`}
                                aria-current={selected ? "page" : undefined}
                                className={`group relative flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs transition-all duration-150 ${
                                  selected
                                    ? "border border-primary/30 bg-gradient-to-r from-primary/15 via-primary/10 to-transparent font-semibold text-primary shadow-xs ring-1 ring-primary/20"
                                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                                }`}
                              >
                                <span className="flex min-w-0 items-center gap-2.5">
                                  {isCompleted ? (
                                    <span
                                      title="Quiz completed"
                                      className="flex size-4 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/20 text-primary shadow-xs"
                                    >
                                      <Check className="size-2.5 stroke-[3]" aria-hidden="true" />
                                    </span>
                                  ) : selected ? (
                                    <span
                                      title="Current lesson"
                                      className="relative flex size-4 shrink-0 items-center justify-center"
                                    >
                                      <span className="absolute inline-flex size-2 animate-ping rounded-full bg-primary opacity-60"></span>
                                      <span className="relative inline-flex size-2 rounded-full bg-primary"></span>
                                    </span>
                                  ) : (
                                    <span
                                      title="Not started"
                                      className="flex size-4 shrink-0 items-center justify-center"
                                    >
                                      <span className="size-1.5 rounded-full bg-muted-foreground/30 transition-all group-hover:scale-125 group-hover:bg-primary/50"></span>
                                    </span>
                                  )}
                                  <span className="truncate leading-snug">{chapterItem.title}</span>
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Lab Section Card */}
          <div className="space-y-1">
            <button
              type="button"
              aria-expanded={labOpen}
              onClick={() => open("lab")}
              className={`group flex w-full items-center justify-between rounded-2xl border p-2.5 text-left transition-all duration-200 ${
                labOpen
                  ? "border-cyan-500/30 bg-gradient-to-r from-cyan-500/15 via-cyan-500/5 to-transparent text-cyan-600 dark:text-cyan-400 shadow-xs ring-1 ring-cyan-500/20"
                  : "border-border/70 bg-card/70 hover:border-border hover:bg-muted/50 text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    labOpen
                      ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shadow-xs"
                      : "bg-muted text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  <FlaskConical className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground tracking-tight">Quantum Lab</div>
                  <div className="text-[11px] font-medium text-muted-foreground">
                    Composer & 3 backends
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-border bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {challenges.length}
                </span>
                <ChevronDown
                  className={`size-4 text-muted-foreground transition-transform duration-300 ${
                    labOpen ? "rotate-180 text-foreground" : "group-hover:text-foreground"
                  }`}
                  aria-hidden="true"
                />
              </div>
            </button>

            {/* Lab Experiments List */}
            {labOpen && (
              <div className="relative ml-4 space-y-1 border-l-2 border-cyan-500/25 py-1 pl-2.5">
                <p className="px-2.5 pb-1 pt-1 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Circuit Benchmarks
                </p>
                {challenges.map((challenge) => {
                  const selected =
                    pathname === "/lab" && selectedChallenge === challenge.id;
                  return (
                    <Link
                      key={challenge.id}
                      href={`/lab?challenge=${challenge.id}`}
                      aria-current={selected ? "page" : undefined}
                      className={`group flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs transition-all duration-150 ${
                        selected
                          ? "border border-cyan-500/30 bg-cyan-500/15 font-semibold text-cyan-600 dark:text-cyan-400 shadow-xs ring-1 ring-cyan-500/25"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <Cpu className="size-3.5 shrink-0 opacity-70 group-hover:opacity-100" aria-hidden="true" />
                        <span className="truncate">{challenge.title}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Floating Quick Dock Card */}
        <div className="mt-4 space-y-1 rounded-2xl border border-border/70 bg-muted/40 p-1.5 backdrop-blur-sm shadow-xs">
          <Link
            href="/progress"
            aria-current={pathname === "/progress" ? "page" : undefined}
            className={`flex min-h-9 items-center justify-between rounded-xl px-3 py-1.5 text-xs transition-all duration-150 ${
              pathname === "/progress"
                ? "border border-primary/20 bg-primary-soft font-semibold text-primary shadow-xs"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <TrendingUp className="size-3.5 text-primary" aria-hidden="true" />
              <span className="font-medium">My Progress</span>
            </span>
            {completedChapters.length > 0 && (
              <span className="rounded-full border border-primary/20 bg-primary/10 px-1.5 py-0.2 font-mono text-[9px] font-bold text-primary">
                {completedChapters.length} done
              </span>
            )}
          </Link>

          <Link
            href="/leaderboard"
            aria-current={pathname === "/leaderboard" ? "page" : undefined}
            className={`flex min-h-9 items-center justify-between rounded-xl px-3 py-1.5 text-xs transition-all duration-150 ${
              pathname === "/leaderboard"
                ? "border border-amber-500/30 bg-amber-500/15 font-semibold text-amber-500 shadow-xs ring-1 ring-amber-500/20"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Trophy className="size-3.5 text-amber-500" aria-hidden="true" />
              <span className="font-medium">Leaderboard</span>
            </span>
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.2 font-mono text-[9px] font-bold text-amber-500">
              Live
            </span>
          </Link>

          <Link
            href="/instructor"
            aria-current={pathname === "/instructor" ? "page" : undefined}
            className={`flex min-h-9 items-center justify-between rounded-xl px-3 py-1.5 text-xs transition-all duration-150 ${
              pathname === "/instructor"
                ? "border border-primary/40 bg-primary/20 font-bold text-primary shadow-xs ring-1 ring-primary/30"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <GraduationCap className="size-3.5 text-primary" aria-hidden="true" />
              <span className="font-medium">Instructor Portal</span>
            </span>
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
