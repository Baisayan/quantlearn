import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildContext } from "@/lib/ai/context";
import { askGemini } from "@/lib/ai/provider";
import { AIError, parseRequest } from "@/lib/ai/types";
import { course } from "@/lib/learn/content";

export const maxDuration = 60;
// A small per-instance burst guard. Provider quotas remain the deployment-wide limit.
const requests = new Map<string, { count: number; until: number }>();

export async function POST(request: Request) {
  const reply = (value: unknown, status = 200) =>
    NextResponse.json(value, {
      status,
      headers: { "Cache-Control": "private, no-store" },
    });
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return reply({ error: "Invalid request origin." }, 403);
  try {
    const db = await createClient();
    const { data, error } = await db.auth.getClaims();
    if (error || !data?.claims?.sub)
      return reply({ error: "Please sign in again." }, 401);
    const userId = data.claims.sub;
    const reader = request.body?.getReader();
    if (!reader) throw new AIError("Missing tutor request.");
    let size = 0;
    let text = "";
    const decoder = new TextDecoder();
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 48000) {
        await reader.cancel();
        throw new AIError("Tutor context is too large.", 413);
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new AIError("Invalid tutor request.");
    }
    const input = parseRequest(json);
    if (!process.env.GEMINI_API_KEY)
      throw new AIError(
        "The tutor is not configured yet. Add GEMINI_API_KEY on the server.",
        503,
      );
    const now = Date.now();
    for (const [id, value] of requests)
      if (value.until <= now) requests.delete(id);
    const limit = requests.get(userId) ?? { count: 0, until: now + 60000 };
    if (limit.count >= 6 || requests.size >= 1000)
      throw new AIError("Please wait a minute before asking again.", 429);
    limit.count++;
    requests.set(userId, limit);
    const context = await buildContext(input.context, userId);
    const result = await askGemini(
      context,
      input.context.surface === "progress"
        ? "Give me three next steps, my strengths, a revision recommendation, a Lab challenge and a session-based study plan."
        : input.message,
      input.context.surface === "progress" ? [] : input.history,
      request.signal,
    );
    const serializedContext = JSON.stringify(context);
    result.citations = [...new Set(result.citations)].filter(
      (c) =>
        course.chapters.some((ch) => c === `${ch.id}.md`) &&
        serializedContext.includes(`"${c}"`),
    );
    if (input.context.surface === "progress") {
      result.action = "study-plan";
      result.suggestedPrompts = [];
    }
    return reply(result);
  } catch (error) {
    return reply(
      {
        error:
          error instanceof AIError
            ? error.message
            : "The tutor could not respond. Please retry.",
      },
      error instanceof AIError ? error.status : 503,
    );
  }
}
