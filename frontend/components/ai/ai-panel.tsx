"use client";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Sparkles } from "lucide-react";
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
    "Walk through a formula",
    "Explain the chapter's figures",
    "Give me a practice question",
    "Which Lab challenge should I try?",
  ],
  lab: [
    "Explain my circuit",
    "Explain these results",
    "Help me understand this error",
    "Give me a next-gate hint",
    "Compare my engine results",
  ],
  progress: ["Create my study plan"],
};

export function AIPanel({
  context,
  label = "Ask Tutor",
  title = "QuantLearn Tutor",
}: {
  context: AIContext;
  label?: string;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<(AIMessage & { reply?: AIReply })[]>(
    [],
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [selection, setSelection] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const controller = useRef<AbortController | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const plan = context.surface === "progress";
  useEffect(() => () => controller.current?.abort(), []);
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
          history: plan
            ? []
            : messages
                .slice(-6)
                .map(({ role, text }) => ({ role, text: text.slice(0, 6000) })),
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "The tutor could not respond.");
      const reply = parseReply(data);
      setMessages((current) => [
        ...(plan ? [] : current.slice(-10)),
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
        <Button
          variant="outline"
          className="rounded-xl border-primary/30 bg-card text-primary hover:bg-primary-soft hover:text-primary"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          {label}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col bg-card p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border/70 bg-secondary/40 pr-12">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>
            {plan
              ? "Recommendations from your saved Learn and Lab results."
              : context.surface === "lab"
                ? "Help with your current circuit, code and results."
                : `Learning with you: ${context.chapterId.replaceAll("-", " ")}.`}
          </SheetDescription>
        </SheetHeader>
        <div
          className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5"
          role="log"
          aria-label={plan ? "Study plan" : "Tutor conversation"}
        >
          {!messages.length && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {plan
                ? "Get three next steps, a chapter to revisit and a Lab challenge to practise."
                : "Ask a question or choose a starting point. AI can make mistakes; use the lesson and simulator to check its suggestions."}
            </p>
          )}
          {messages
            .filter((m) => !plan || m.role === "assistant")
            .map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "rounded-xl bg-secondary/60 p-4 text-sm"
                    : "space-y-3 text-sm leading-7"
                }
              >
                {!plan && (
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    {message.role === "user" ? "You" : "Tutor"}
                  </p>
                )}
                <div className="min-w-0 space-y-3 break-words [&_.katex-display]:overflow-x-auto [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-secondary/50 [&_pre]:p-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5">
                  <Markdown
                    skipHtml
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[[rehypeKatex, { trust: false }]]}
                    disallowedElements={["img"]}
                    components={{
                      a: ({ href, children }) =>
                        /^\/learn(?:\/[a-z0-9-]+)?(?:#[a-z0-9-]+)?$/.test(
                          href ?? "",
                        ) || href === "/lab" ? (
                          <a href={href} className="text-primary underline">
                            {children}
                          </a>
                        ) : (
                          <span>{children}</span>
                        ),
                    }}
                  >
                    {message.text}
                  </Markdown>
                </div>
                {!!message.reply?.citations.length && (
                  <div className="flex flex-wrap gap-2">
                    {message.reply.citations
                      .filter((c) => /^[a-z0-9-]+\.md$/.test(c))
                      .map((c) => (
                        <a
                          key={c}
                          href={`/learn/${c.replace(/\.md$/, "")}`}
                          className="text-xs text-primary underline"
                        >
                          {c.replace(/\.md$/, "").replaceAll("-", " ")}
                        </a>
                      ))}
                  </div>
                )}
              </div>
            ))}
          {pending && (
            <p role="status" className="text-sm text-primary">
              Thinking through your question…
            </p>
          )}
          {error && (
            <div
              role="alert"
              className="space-y-2 rounded-lg border border-border/70 p-3 text-sm"
            >
              <p>{error}</p>
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
        <div className="space-y-3 border-t p-5">
          {selection && context.surface === "learn" && (
            <div className="rounded-lg border border-border/70 bg-secondary/50 p-3 text-xs">
              <p className="line-clamp-3">Selected text: {selection}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelection("")}
              >
                Remove selection
              </Button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {(plan
              ? [
                  messages.length
                    ? "Refresh my study plan"
                    : "Create my study plan",
                ]
              : last?.suggestedPrompts.length
                ? last.suggestedPrompts
                : prompts[context.surface]
            ).map((p) => (
              <Button
                key={p}
                size="sm"
                variant="outline"
                className="h-auto whitespace-normal text-left"
                disabled={pending}
                onClick={() => ask(p)}
              >
                {p}
              </Button>
            ))}
          </div>
          {!plan && (
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                void ask(input);
              }}
            >
              <Textarea
                aria-label="Question for the tutor"
                placeholder="What would you like to understand?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={2000}
                disabled={pending}
                className="max-h-36 resize-none"
              />
              <div className="flex justify-between gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={pending || !messages.length}
                  onClick={() => {
                    setMessages([]);
                    setError("");
                  }}
                >
                  Clear chat
                </Button>
                <Button disabled={pending || !input.trim()}>Send</Button>
              </div>
            </form>
          )}
          <p className="text-xs text-muted-foreground">
            Uses Gemini. Questions and page context are sent to Google. Chat is
            not saved.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
