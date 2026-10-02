"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { QuantumAIIcon } from "./quantum-ai-icon";
import learnContent from "@/.generated/learn.json";
import { AIPanel } from "./ai-panel";
import type { AIContext } from "@/lib/ai/types";

export function GlobalAITutor() {
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();

  // Determine context based on current route
  let context: AIContext = {
    surface: "general",
    route: pathname,
  };
  let label = "Ask AI Tutor";
  let title = "QuantLearn AI Tutor & Guide";
  let contextBadge = "Guide";

  if (pathname.startsWith("/learn/") && pathname !== "/learn") {
    const chapterId = pathname.split("/")[2];
    const chapter = learnContent.chapters.find((c) => c.id === chapterId);
    if (chapter) {
      context = {
        surface: "learn",
        chapterId,
      };
      label = "Ask Lesson Tutor";
      title = `Lesson Tutor · ${chapter.title}`;
      contextBadge = "Lesson";
    }
  } else if (pathname === "/progress") {
    context = {
      surface: "progress",
    };
    label = "Ask Study Coach";
    title = "QuantLearn Progress & Study Coach";
    contextBadge = "Study Coach";
  } else if (pathname === "/lab") {
    const challengeParam = searchParams.get("challenge");
    context = {
      surface: "general",
      route: "/lab",
      activeChapterTitle: challengeParam ? `Challenge: ${challengeParam}` : "Quantum Sandbox",
    };
    label = "Ask Lab Assistant";
    title = "Quantum Lab & Simulation Assistant";
    contextBadge = "Lab";
  } else if (pathname === "/leaderboard") {
    context = {
      surface: "general",
      route: "/leaderboard",
    };
    label = "Ask AI Tutor";
    title = "Cohort Telemetry & Leaderboard Guide";
    contextBadge = "Leaderboard";
  } else if (pathname === "/") {
    context = {
      surface: "general",
      route: "/",
    };
    label = "Ask AI Tutor";
    title = "Welcome to QuantLearn · AI Tutor";
    contextBadge = "Guide";
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      <AIPanel
        key={`${context.surface}:${"chapterId" in context ? context.chapterId : pathname}`}
        context={context}
        title={title}
        label={label}
        customTrigger={
          <button
            type="button"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-primary px-4 py-2.5 text-xs font-medium text-white shadow-xl shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-2xl hover:shadow-primary/35 active:translate-y-0 active:scale-95"
            aria-label={`${label} - Open AI assistant`}
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
              <QuantumAIIcon className="size-4" />
            </span>
            <span className="font-semibold text-white tracking-tight">
              AI Tutor
            </span>
            <span className="hidden sm:inline-block rounded-full bg-white/15 px-2 py-0.5 font-mono text-[10px] font-medium text-white/90">
              {contextBadge}
            </span>
          </button>
        }
      />
    </div>
  );
}
