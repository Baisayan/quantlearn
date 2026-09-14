import type { Circuit, Engine, Result } from "@/lib/lab/types";

export type AIContext =
  | {
      surface: "learn";
      chapterId: string;
      questionId?: string;
      attemptId?: string;
      selectedText?: string;
    }
  | {
      surface: "lab";
      challengeId: string;
      engine: Engine;
      circuit: Circuit;
      code: string;
      codeDirty: boolean;
      error: string;
      results: Result[];
    }
  | { surface: "progress" };

export type AIReply = {
  answer: string;
  suggestedPrompts: string[];
  citations: string[];
  action: "explanation" | "hint" | "review" | "study-plan";
};

export type AIMessage = { role: "user" | "assistant"; text: string };

export class AIError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export function parseRequest(value: unknown): {
  context: AIContext;
  message: string;
  history: AIMessage[];
} {
  if (!value || typeof value !== "object")
    throw new AIError("Invalid tutor request.");
  const { context, message, history = [] } = value as Record<string, unknown>;
  if (
    typeof message !== "string" ||
    !message.trim() ||
    message.length > 2000 ||
    !Array.isArray(history) ||
    history.length > 6 ||
    history.some(
      (m) =>
        !m ||
        !["user", "assistant"].includes(m.role) ||
        typeof m.text !== "string" ||
        m.text.length > 6000,
    ) ||
    !context ||
    typeof context !== "object"
  )
    throw new AIError("Keep your question under 2,000 characters.");
  const c = context as Record<string, unknown>;
  const short = (v: unknown, max: number) =>
    v === undefined || (typeof v === "string" && v.length <= max);
  if (c.surface === "learn") {
    if (
      typeof c.chapterId !== "string" ||
      !short(c.chapterId, 100) ||
      !short(c.questionId, 150) ||
      !short(c.attemptId, 36) ||
      !short(c.selectedText, 2000)
    )
      throw new AIError("Invalid lesson context.");
  } else if (c.surface === "lab") {
    if (
      typeof c.challengeId !== "string" ||
      !short(c.challengeId, 100) ||
      !["aer", "cirq"].includes(String(c.engine)) ||
      typeof c.code !== "string" ||
      c.code.length > 12000 ||
      typeof c.error !== "string" ||
      c.error.length > 2000 ||
      typeof c.codeDirty !== "boolean" ||
      !c.circuit ||
      typeof c.circuit !== "object" ||
      !Array.isArray(c.results) ||
      c.results.length > 2
    )
      throw new AIError("Invalid Lab context.");
  } else if (c.surface !== "progress") throw new AIError("Unknown tutor page.");
  return { context: context as AIContext, message: message.trim(), history };
}

export function parseReply(value: unknown): AIReply {
  if (!value || typeof value !== "object")
    throw new AIError(
      "The tutor returned an incomplete answer. Please retry.",
      502,
    );
  const r = value as AIReply;
  if (
    typeof r.answer !== "string" ||
    !r.answer.trim() ||
    r.answer.length > 12000 ||
    !Array.isArray(r.suggestedPrompts) ||
    r.suggestedPrompts.length > 3 ||
    r.suggestedPrompts.some((p) => typeof p !== "string" || p.length > 200) ||
    !Array.isArray(r.citations) ||
    r.citations.length > 14 ||
    r.citations.some((p) => typeof p !== "string") ||
    !["explanation", "hint", "review", "study-plan"].includes(r.action)
  )
    throw new AIError(
      "The tutor returned an incomplete answer. Please retry.",
      502,
    );
  return r;
}
