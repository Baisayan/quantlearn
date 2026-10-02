"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import {
  RotateCcw,
  Copy,
  Check,
  BookOpen,
  Sparkles,
  SendHorizontal,
  Atom,
  FlaskConical,
  Binary,
  Compass,
} from "lucide-react";
import { QuantumAIIcon } from "./quantum-ai-icon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  parseReply,
  type AIContext,
  type AIMessage,
  type AIReply,
} from "@/lib/ai/types";

const prompts = {
  learn: [
    "Explain this concept simply",
    "Walk through the formula",
    "Explain the chapter figures",
    "Give me a practice quiz question",
    "Which Lab challenge should I try?",
  ],
  lab: [
    "Explain my circuit",
    "Explain these measurement results",
    "Help me understand this error",
    "Give me a next-gate hint",
    "Compare statevector vs shots",
  ],
  progress: [
    "Create my study plan",
    "How do streaks work?",
    "What should I study next?",
  ],
  general: [
    "How should I study on QuantLearn?",
    "Where do I start as a beginner?",
    "How does the Quantum Lab work?",
    "How do I earn Quantum XP?",
  ],
};

const capabilityCards = [
  {
    icon: Atom,
    title: "Deconstruct Concepts",
    desc: "Superposition, entanglement & Bloch sphere",
    prompt: "Explain quantum superposition and statevectors simply with an intuition guide",
  },
  {
    icon: FlaskConical,
    title: "Circuit Lab Copilot",
    desc: "Bell states, gate depth & measurement stats",
    prompt: "How do I construct a Bell State circuit in the Quantum Lab?",
  },
  {
    icon: Binary,
    title: "Formulas & Dirac Math",
    desc: "Unitary matrices, bra-ket & eigenvalues",
    prompt: "Walk me through the mathematical matrix of a Hadamard gate and how it transforms |0>",
  },
  {
    icon: Compass,
    title: "Curriculum Roadmap",
    desc: "Modules, streaks, challenges & earning XP",
    prompt: "Where should I start as a beginner on QuantLearn to master quantum computing?",
  },
];

const thinkingSteps = [
  "Analyzing quantum principles…",
  "Formulating explanation…",
  "Synthesizing Dirac notation & gates…",
];

function normalizeMarkdownMath(text: string): string {
  if (!text) return "";
  let out = text;

  // 1. Convert LaTeX display math \[ ... \] to $$ ... $$ and inline \( ... \) to $ ... $
  out = out.replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => `\n$$\n${math.trim()}\n$$\n`);
  out = out.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => `$${math.trim()}$`);

  // 2. Fix broken closing tags where backslash was dropped in JSON serialization (e.g. "end{pmatrix}" -> "\end{pmatrix}")
  out = out.replace(/(?<!\\)end\{(pmatrix|bmatrix|vmatrix|matrix|align|aligned|array)\}/g, "\\end{$1}");

  // 3. Fix matrix environments not wrapped in math mode ($ or $$)
  const envRegex = /(\\begin\{(?:pmatrix|bmatrix|vmatrix|matrix|aligned|array)\}[\s\S]*?\\end\{(?:pmatrix|bmatrix|vmatrix|matrix|aligned|array)\})/g;
  out = out.replace(envRegex, (match, _, offset, str) => {
    const before = str.slice(0, offset);
    const after = str.slice(offset + match.length);
    const hasOpeningDollar = /\$\s*$/.test(before);
    const hasClosingDollar = /^\s*\$/.test(after);
    if (hasOpeningDollar && hasClosingDollar) {
      return match;
    }
    return `\n$$\n${match.trim()}\n$$\n`;
  });

  // 4. Ensure lists have clean separation from preceding paragraphs for proper markdown rendering
  out = out.replace(/([^\n])\n([0-9]+\.\s)/g, "$1\n\n$2");
  out = out.replace(/([^\n])\n([*-]\s)/g, "$1\n\n$2");

  return out;
}

export function AIPanel({
  context,
  label = "Ask AI Copilot",
  title = "QuantLearn AI Copilot",
  onApplyCode,
  initialQuestion,
  triggerVariant = "outline",
  triggerSize = "default",
  triggerClassName,
  customTrigger,
}: {
  context: AIContext;
  label?: string;
  title?: string;
  onApplyCode?: (code: string) => void;
  initialQuestion?: string;
  triggerVariant?: "default" | "outline" | "secondary" | "ghost" | "link";
  triggerSize?: "default" | "sm" | "lg" | "icon";
  triggerClassName?: string;
  customTrigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<(AIMessage & { reply?: AIReply })[]>(
    [],
  );
  const [pending, setPending] = useState(false);
  const [thinkingStepIndex, setThinkingStepIndex] = useState(0);
  const [error, setError] = useState("");
  const [selection, setSelection] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const controller = useRef<AbortController | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const plan = context.surface === "progress";

  useEffect(() => () => controller.current?.abort(), []);

  useEffect(() => {
    if (!pending) {
      setThinkingStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setThinkingStepIndex((prev) => (prev + 1) % thinkingSteps.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [pending]);

  useEffect(() => {
    if (context.surface !== "learn") return;
    function captureSelection() {
      const selected = window.getSelection();
      if (
        selected?.anchorNode?.parentElement?.closest(
          'article[aria-label="Study material"]',
        )
      )
        setSelection(selected.toString().trim().slice(0, 2000));
    }
    document.addEventListener("selectionchange", captureSelection);
    return () =>
      document.removeEventListener("selectionchange", captureSelection);
  }, [context.surface]);

  useEffect(() => {
    if (open) end.current?.scrollIntoView({ block: "nearest" });
  }, [messages, pending, open]);

  useEffect(() => {
    if (open && initialQuestion && messages.length === 0 && !pending) {
      ask(initialQuestion);
    }
  }, [open, initialQuestion]);

  async function ask(question: string) {
    if (!question.trim() || controller.current) return;
    const abort = new AbortController();
    controller.current = abort;
    setPending(true);
    setError("");
    setLastQuestion(question);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abort.signal,
        body: JSON.stringify({
          context:
            context.surface === "learn"
              ? { ...context, selectedText: selection }
              : context,
          message: question,
          history: messages
            .slice(-6)
            .map(({ role, text }) => ({ role, text: text.slice(0, 6000) })),
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "The tutor could not respond.");
      const reply = parseReply(data);
      setMessages((current) => [
        ...current.slice(-10),
        { role: "user", text: question },
        { role: "assistant", text: reply.answer, reply },
      ]);
      setInput("");
    } catch (cause) {
      if (!abort.signal.aborted)
        setError(
          cause instanceof Error
            ? cause.message
            : "Please check your connection and retry.",
        );
    } finally {
      controller.current = null;
      setPending(false);
    }
  }

  function handleCopy(text: string, index: number) {
    void navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  const last = messages.at(-1)?.reply;

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) controller.current?.abort();
      }}
    >
      <SheetTrigger asChild>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button
            variant={triggerVariant}
            size={triggerSize}
            className={
              triggerClassName ||
              "rounded-md border-border/80 bg-card text-foreground hover:bg-muted"
            }
          >
            <QuantumAIIcon className="size-4 shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </Button>
        )}
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col bg-card p-0 sm:max-w-lg shadow-2xl border-l border-border/80">
        {/* Sleek High-Tech Header with Live Telemetry */}
        <SheetHeader className="border-b border-border/80 bg-card/70 backdrop-blur-xl px-5 py-3.5">
          <div className="flex items-center justify-between gap-3 pr-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary/20 via-cyan-500/15 to-primary/10 border border-primary/25 shadow-xs">
                <QuantumAIIcon className="size-5.5" />
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-card animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <SheetTitle className="text-sm font-semibold tracking-tight text-foreground truncate">
                    {title}
                  </SheetTitle>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-primary">
                    <span className="size-1 rounded-full bg-primary animate-ping" />
                    Gemini Flash
                  </span>
                </div>
                <SheetDescription className="text-xs text-muted-foreground truncate">
                  {plan
                    ? "Adaptive study plan from your Learn & Lab telemetry"
                    : context.surface === "lab"
                      ? "Assisting with circuits, gates and code"
                      : context.surface === "learn"
                        ? `Learning with you: ${context.chapterId.replaceAll("-", " ")}`
                        : "24/7 Quantum physics mentor and guide"}
                </SheetDescription>
              </div>
            </div>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setMessages([]);
                  setError("");
                }}
                title="Clear conversation"
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <RotateCcw className="size-3.5" />
                <span className="sr-only">Clear chat</span>
              </button>
            )}
          </div>
        </SheetHeader>

        {/* Message Stream */}
        <div
          className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5"
          role="log"
          aria-label={plan ? "Study plan" : "Tutor conversation"}
        >
          {/* Welcome Screen with Linear/Raycast Style Capability Cards */}
          {!messages.length && (
            <div className="my-auto flex flex-col items-center justify-center text-center px-2 py-6 space-y-5">
              <div className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/20 via-cyan-500/15 to-primary/10 border border-primary/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <QuantumAIIcon className="size-8" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h4 className="text-base font-semibold tracking-tight text-foreground">
                  What would you like to explore?
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Your interactive quantum copilot. Deconstruct Dirac notation, simulate circuits, or master core fundamentals.
                </p>
              </div>

              {/* 4 Interactive Starter Capability Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-1 text-left">
                {capabilityCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.title}
                      type="button"
                      disabled={pending}
                      onClick={() => void ask(card.prompt)}
                      className="group flex flex-col justify-between rounded-xl border border-border/70 bg-card/60 p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-muted/50 hover:shadow-md text-left disabled:opacity-50"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                          <Icon className="size-3.5" />
                        </span>
                        <span className="text-xs font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
                          {card.title}
                        </span>
                      </div>
                      <p className="text-[11px] leading-snug text-muted-foreground line-clamp-2">
                        {card.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {messages.map((message, index) =>
            message.role === "user" ? (
              /* User Bubble */
              <div key={index} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-xs">
                  <p className="whitespace-pre-wrap break-words leading-relaxed">
                    {message.text}
                  </p>
                </div>
              </div>
            ) : (
              /* Tutor Card with Quantum AI Emblem */
              <div key={index} className="flex items-start gap-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary/20 via-cyan-500/15 to-primary/10 border border-primary/25 mt-0.5 shadow-xs">
                  <QuantumAIIcon className="size-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-2.5 rounded-2xl rounded-tl-xs border border-border/70 bg-card/80 backdrop-blur-sm p-4 shadow-xs">
                  <div className="min-w-0 space-y-3 break-words text-sm leading-relaxed text-foreground [&_.katex-display]:my-3.5 [&_.katex-display]:overflow-x-auto [&_.katex-display]:py-3 [&_.katex-display]:px-4 [&_.katex-display]:rounded-xl [&_.katex-display]:bg-muted/40 [&_.katex-display]:border [&_.katex-display]:border-border/60 [&_.katex-display]:shadow-xs [&_.katex]:text-[1.05em] [&_.katex-error]:rounded-md [&_.katex-error]:bg-destructive/10 [&_.katex-error]:border [&_.katex-error]:border-destructive/30 [&_.katex-error]:px-1.5 [&_.katex-error]:py-0.5 [&_.katex-error]:font-mono [&_.katex-error]:text-xs [&_.katex-error]:text-rose-400 [&_pre]:overflow-x-auto">
                    <Markdown
                      skipHtml
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[
                        [
                          rehypeKatex,
                          { trust: false, strict: false, throwOnError: false },
                        ],
                      ]}
                      disallowedElements={["img"]}
                      components={{
                        p: ({ children }) => (
                          <p className="text-[13.5px] leading-relaxed text-foreground/95 mb-3 last:mb-0">
                            {children}
                          </p>
                        ),
                        ol: ({ children }) => (
                          <ol className="my-3 space-y-2.5 pl-5 list-decimal marker:text-primary/70 marker:font-mono marker:text-xs">
                            {children}
                          </ol>
                        ),
                        ul: ({ children }) => (
                          <ul className="my-3 space-y-2 pl-5 list-disc marker:text-primary/60">
                            {children}
                          </ul>
                        ),
                        li: ({ children }) => (
                          <li className="text-[13.5px] leading-relaxed pl-1 text-foreground/90">
                            {children}
                          </li>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-base font-bold text-foreground mt-4 mb-2 tracking-tight">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-sm font-bold text-foreground mt-3.5 mb-2 tracking-tight">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm font-semibold text-primary mt-3 mb-1.5 tracking-tight flex items-center gap-1.5">
                            {children}
                          </h3>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-foreground">
                            {children}
                          </strong>
                        ),
                        code: ({ children, className }) => {
                          const isInline = !className;
                          if (isInline) {
                            return (
                              <code className="rounded-md bg-muted/80 px-1.5 py-0.5 font-mono text-[12px] font-medium text-primary border border-border/60">
                                {children}
                              </code>
                            );
                          }
                          return <code className={className}>{children}</code>;
                        },
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-primary/50 bg-primary/5 pl-3.5 py-1.5 my-2.5 rounded-r-lg text-xs italic text-muted-foreground">
                            {children}
                          </blockquote>
                        ),
                        table: ({ children }) => (
                          <div className="my-3 overflow-x-auto rounded-lg border border-border/70">
                            <table className="w-full border-collapse text-xs">
                              {children}
                            </table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="border-b border-border/70 bg-muted/40 px-3 py-1.5 text-left font-semibold text-foreground">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="border-b border-border/40 px-3 py-1.5 text-muted-foreground">
                            {children}
                          </td>
                        ),
                        a: ({ href, children }) =>
                          href?.startsWith("/") ? (
                            <Link
                              href={href}
                              onClick={() => setOpen(false)}
                              className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary hover:bg-primary/20 hover:underline transition-colors"
                            >
                              <span>{children}</span>
                              <span className="text-[10px] opacity-70">↗</span>
                            </Link>
                          ) : (
                            <a
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline font-medium"
                            >
                              {children}
                            </a>
                          ),
                        pre: ({ children }) => {
                          let rawText = "";
                          if (
                            children &&
                            typeof children === "object" &&
                            "props" in
                              (children as unknown as Record<string, unknown>)
                          ) {
                            const inner = (
                              children as unknown as {
                                props?: { children?: unknown };
                              }
                            ).props?.children;
                            if (typeof inner === "string") rawText = inner;
                          }
                          const isCircuitCode =
                            rawText.includes("QuantumCircuit") ||
                            rawText.includes("cirq.") ||
                            rawText.includes("qml.");
                          return (
                            <div className="relative group my-2">
                              <pre className="overflow-x-auto rounded-lg border border-border/70 bg-muted/60 p-3 text-xs font-mono">
                                {children}
                              </pre>
                              {onApplyCode && isCircuitCode && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onApplyCode(rawText.trim());
                                    setOpen(false);
                                  }}
                                  className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                                >
                                  ⚡ Apply to Lab Editor
                                </button>
                              )}
                            </div>
                          );
                        },
                      }}
                    >
                      {normalizeMarkdownMath(message.text)}
                    </Markdown>
                  </div>

                  {/* Citations & Topic Chips */}
                  {!!message.reply?.citations.length && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/50">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mr-1">
                        Topics:
                      </span>
                      {message.reply.citations
                        .filter((c) => /^[a-z0-9-]+\.md$/.test(c))
                        .map((c) => (
                          <a
                            key={c}
                            href={`/learn/${c.replace(/\.md$/, "")}`}
                            className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
                          >
                            <BookOpen className="size-3" />
                            {c.replace(/\.md$/, "").replaceAll("-", " ")}
                          </a>
                        ))}
                    </div>
                  )}

                  {/* Message Action Footer */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/40">
                    <button
                      type="button"
                      onClick={() => handleCopy(message.text, index)}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      title="Copy response"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="size-3 text-emerald-500" />
                          <span className="text-emerald-500 font-semibold">
                            Copied
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ),
          )}

          {/* Animated Gemini + ChatGPT Style Thinking Indicator */}
          {pending && (
            <div
              className="flex items-start gap-3"
              role="status"
              aria-label="Tutor is thinking"
            >
              <div className="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 mt-0.5 shadow-xs ring-4 ring-primary/15 animate-pulse">
                <QuantumAIIcon className="size-4" />
              </div>
              <div className="min-w-0 flex-1 space-y-3 rounded-2xl rounded-tl-xs border border-border/70 bg-card p-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 py-0.5">
                    <span className="size-2 rounded-full bg-primary chatgpt-dot-1" />
                    <span className="size-2 rounded-full bg-primary chatgpt-dot-2" />
                    <span className="size-2 rounded-full bg-primary chatgpt-dot-3" />
                  </div>
                  <span className="text-xs font-semibold text-primary tracking-tight transition-opacity duration-300">
                    {thinkingSteps[thinkingStepIndex]}
                  </span>
                </div>

                {/* Gemini Shimmer Skeleton Wave */}
                <div className="space-y-2 pt-0.5">
                  <div className="h-2.5 w-5/6 rounded-full gemini-shimmer" />
                  <div className="h-2.5 w-full rounded-full gemini-shimmer" />
                  <div className="h-2.5 w-3/5 rounded-full gemini-shimmer" />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="space-y-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-sm"
            >
              <p className="text-xs text-destructive">{error}</p>
              <Button
                size="sm"
                variant="outline"
                disabled={pending}
                onClick={() => ask(lastQuestion)}
              >
                Retry
              </Button>
            </div>
          )}
          <div ref={end} />
        </div>

        {/* Input & Action Area */}
        <div className="space-y-2.5 border-t border-border/80 bg-card p-4">
          {selection && context.surface === "learn" && (
            <div className="flex items-center justify-between rounded-lg border border-border/80 bg-muted/40 px-3 py-2 text-xs">
              <p className="line-clamp-1 text-muted-foreground">
                <span className="font-semibold text-foreground">Selected:</span>{" "}
                {selection}
              </p>
              <button
                type="button"
                onClick={() => setSelection("")}
                className="shrink-0 text-[11px] font-medium text-primary hover:underline ml-2"
              >
                Clear
              </button>
            </div>
          )}

          {/* Suggested Prompts - Horizontal Scrollable Rail */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {(plan
              ? [
                  messages.length
                    ? "Refresh my study plan"
                    : "Create my study plan",
                  "What should I study next?",
                  "How do streaks work?",
                ]
              : last?.suggestedPrompts.length
                ? last.suggestedPrompts
                : prompts[context.surface]
            ).map((p) => (
              <button
                key={p}
                type="button"
                disabled={pending}
                onClick={() => ask(p)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-xs transition-colors hover:border-primary/40 hover:bg-muted/70 active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="size-3 text-primary/70" />
                <span>{p}</span>
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!pending && input.trim()) void ask(input);
            }}
          >
            {/* Unified Seamless Omnibar */}
            <div className="relative rounded-2xl border border-border/80 bg-background/90 dark:bg-muted/30 p-3 shadow-xs transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10">
              <textarea
                aria-label="Question for the tutor"
                placeholder="Ask a question or explore a concept (e.g. Hadamard gate)..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!pending && input.trim()) void ask(input);
                  }
                }}
                maxLength={2000}
                disabled={pending}
                rows={2}
                className="w-full resize-none border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:outline-none focus:ring-0 shadow-none min-h-[48px] max-h-36"
              />
              <div className="flex items-center justify-end pt-1">
                <button
                  type="submit"
                  disabled={pending || !input.trim()}
                  className="inline-flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs transition-all hover:bg-primary/90 disabled:opacity-30 disabled:hover:bg-primary"
                  aria-label="Send message"
                >
                  <SendHorizontal className="size-3.5" />
                </button>
              </div>
            </div>
          </form>

          <p className="text-center text-[10px] text-muted-foreground">
            QuantLearn AI Copilot · Verify quantum formulas with simulator experiments
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
