"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { BookOpen, ChevronDown, FlaskConical } from "lucide-react";

import challenges from "@/.generated/lab.json";
import learnContent from "@/.generated/learn.json";

type Section = "learn" | "lab" | null;

const itemClass =
  "flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-sm transition-[background-color,color] duration-300";

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
    chapter ? [chapter.module] : [],
  );

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

  return (
    <aside className="border-b border-border/70 bg-card/70 lg:sticky lg:top-16 lg:flex lg:h-[calc(100svh-4rem)] lg:w-72 lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="w-full p-3 sm:p-4 lg:p-5">
        <nav aria-label="Workspace navigation" className="space-y-2">
          <button
            type="button"
            aria-expanded={learnOpen}
            onClick={() => open("learn")}
            className={`${itemClass} w-full justify-between ${learnOpen ? "bg-primary-soft font-semibold text-primary" : "text-foreground hover:bg-muted"}`}
          >
            <span className="flex items-center gap-2">
              <BookOpen className="size-4" aria-hidden="true" />
              Learn
            </span>
            <ChevronDown
              className={`size-4 transition-transform duration-300 ${learnOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {learnOpen && (
            <div className="space-y-1 border-l border-border/70 pl-3">
              {learnContent.modules.map((module, index) => {
                const chapters = learnContent.chapters.filter(
                  (chapterItem) => chapterItem.module === module.id,
                );
                const expanded =
                  openModules.includes(module.id) || chapter?.module === module.id;

                return (
                  <div key={module.id}>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => toggleModule(module.id)}
                      className={`${itemClass} w-full justify-between text-left text-muted-foreground hover:bg-muted hover:text-foreground`}
                    >
                      <span className="min-w-0 truncate">
                        <span className="mr-2 font-mono text-xs text-primary/70">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {module.title}
                      </span>
                      <ChevronDown
                        className={`size-4 shrink-0 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                    {expanded && (
                      <div className="ml-3 space-y-0.5 border-l border-border/50 py-1 pl-2">
                        {chapters.map((chapterItem) => {
                          const selected = pathname === `/learn/${chapterItem.id}`;
                          return (
                            <Link
                              key={chapterItem.id}
                              href={`/learn/${chapterItem.id}`}
                              aria-current={selected ? "page" : undefined}
                              className={`${itemClass} ${selected ? "bg-primary-soft font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                            >
                              <span className="truncate">{chapterItem.title}</span>
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

          <button
            type="button"
            aria-expanded={labOpen}
            onClick={() => open("lab")}
            className={`${itemClass} w-full justify-between ${labOpen ? "bg-primary-soft font-semibold text-primary" : "text-foreground hover:bg-muted"}`}
          >
            <span className="flex items-center gap-2">
              <FlaskConical className="size-4" aria-hidden="true" />
              Lab
            </span>
            <ChevronDown
              className={`size-4 transition-transform duration-300 ${labOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {labOpen && (
            <div className="space-y-0.5 border-l border-border/70 pl-3">
              <p className="px-3 pb-1 pt-1 font-mono text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
                Experiments
              </p>
              {challenges.map((challenge) => {
                const selected =
                  pathname === "/lab" && selectedChallenge === challenge.id;
                return (
                  <Link
                    key={challenge.id}
                    href={`/lab?challenge=${challenge.id}`}
                    aria-current={selected ? "page" : undefined}
                    className={`${itemClass} ${selected ? "bg-primary-soft font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                  >
                    <span className="truncate">{challenge.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}
