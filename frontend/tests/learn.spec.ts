import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import course from "../.generated/learn.json";

process.loadEnvFile(".env.local");
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
test.setTimeout(240_000);

test("Learn renders every chapter, grades on the server and persists progress", async ({
  page,
  request,
}) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
  const email = `quantlearn-test-${randomUUID()}@example.com`;
  const password = randomUUID() + "aA1!";
  const signup = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username: "learn_test" } },
  });
  expect(signup.error).toBeNull();
  expect(signup.data.session).toBeTruthy();
  const userId = signup.data.user!.id;
  await mkdir(".generated", { recursive: true });
  await writeFile(
    `.generated/test-user-${userId}.json`,
    JSON.stringify({ userId, email }),
  );
  console.log(`Temporary test user for cleanup: ${userId}`);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      !message.text().includes("Failed to load resource")
    )
      errors.push(message.text());
  });
  try {
    expect(
      (await request.post(`${baseURL}/api/grade`, { data: {} })).status(),
    ).toBe(401);
    await page.goto(`${baseURL}/learn/qubits`);
    await expect(page).toHaveURL(`${baseURL}/login`);
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page).toHaveURL(`${baseURL}/learn`, { timeout: 20000 });
    await expect(
      page.getByRole("heading", { name: "Make sense of the quantum world." }),
    ).toBeVisible();
    await expect(page.locator("main section[id]")).toHaveCount(5);
    await expect(page.locator("main h3")).toHaveCount(14);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({
      caret: "initial",
      path: ".generated/learn-desktop.png",
      fullPage: true,
    });
    await page.setViewportSize({ width: 375, height: 812 });
    await page.screenshot({
      caret: "initial",
      path: ".generated/learn-mobile.png",
      fullPage: true,
    });

    await page.screenshot({
      caret: "initial",
      path: ".generated/learn-mobile-viewport.png",
    });
    for (const chapter of course.chapters) {
      await page.goto(`${baseURL}/learn/${chapter.id}`);
      await expect(
        page.getByRole("heading", { level: 1, name: chapter.title }),
      ).toBeVisible();
      await expect(page.locator("article img")).toHaveCount(
        chapter.visualIds.length,
      );
      await expect(page.getByRole("radiogroup")).toHaveCount(10);
      expect(await page.locator(".katex-error").count()).toBe(0);
      for (const figure of await page.locator("article img").all()) {
        await figure.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            figure.evaluate(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0,
            ),
          )
          .toBe(true);
      }
      expect(
        await page
          .locator("article img")
          .evaluateAll((images) =>
            images.every(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      ).toBe(true);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      const html = await (
        await page.request.get(`${baseURL}/learn/${chapter.id}`)
      ).text();
      expect(html).not.toContain("correctOptionId");
      expect(html).not.toContain(chapter.quiz.questions[0].explanation);
    }
    await page.screenshot({
      caret: "initial",
      path: ".generated/lesson-code-mobile.png",
      fullPage: true,
    });
    const unknown = await page.goto(`${baseURL}/learn/unknown-chapter`);
    expect(unknown?.status()).toBe(404);
    await page.goto(`${baseURL}/learn/qubits`);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({
      caret: "initial",
      path: ".generated/lesson-desktop.png",
      fullPage: true,
    });
    await expect(
      page.getByRole("button", { name: "Submit quiz" }),
    ).toBeDisabled();
    const quiz = course.chapters[0].quiz;
    await page.locator(`#${quiz.questions[0].id}-a`).click();
    await expect(
      page.getByText("1 of 10 answered", { exact: true }),
    ).toBeVisible();
    await page.keyboard.down("ArrowDown");
    await expect(page.locator(`#${quiz.questions[0].id}-b`)).toBeChecked();
    await page.keyboard.up("ArrowDown");
    for (const question of quiz.questions)
      await page.locator(`#${question.id}-${question.correctOptionId}`).click();
    await page.getByRole("checkbox").check();
    await page.route(
      "**/api/grade",
      (route) =>
        route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({ error: "Test save failure. Please retry." }),
        }),
      { times: 1 },
    );
    await page.getByRole("button", { name: "Submit quiz" }).click();
    await expect(page.locator("#chapter-quiz").getByRole("alert")).toHaveText(
      "Test save failure. Please retry.",
    );
    await expect(
      page.getByText("10 of 10 answered", { exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Submit quiz" }).click();
    await expect(
      page.getByRole("heading", { name: "10 of 10 correct" }),
    ).toBeVisible();
    await page.screenshot({
      caret: "initial",
      path: ".generated/quiz-result.png",
    });
    await page.getByRole("button", { name: "Try again", exact: true }).click();
    await expect(
      page.getByText("0 of 10 answered", { exact: true }),
    ).toBeVisible();
    await expect(page.locator(`#${quiz.questions[0].id}-a`)).toBeFocused();
    await page.reload();
    await expect(
      page.getByText("Completed · Best 10/10", { exact: true }),
    ).toBeVisible();
    await page.goto(`${baseURL}/learn`);
    await expect(
      page.getByText("1 of 14 chapters complete", { exact: true }),
    ).toBeVisible();

    const post = (data: unknown) =>
      page.request.post(`${baseURL}/api/grade`, {
        headers: { Origin: baseURL },
        data,
      });
    const answers = Object.fromEntries(
      quiz.questions.map((question) => [
        question.id,
        question.options.find(
          (option) => option.id !== question.correctOptionId,
        )!.id,
      ]),
    );
    const submission = {
      chapterId: "qubits",
      version: quiz.version,
      answers,
      read: true,
      attemptId: randomUUID(),
    };
    expect((await post({ ...submission, answers: {} })).status()).toBe(400);
    expect((await post({ ...submission, read: false })).status()).toBe(400);
    expect((await post({ ...submission, version: 1 })).status()).toBe(400);
    expect((await post({ ...submission, chapterId: "missing" })).status()).toBe(
      404,
    );
    expect(
      (
        await page.request.post(`${baseURL}/api/grade`, {
          headers: { Origin: "https://invalid.example" },
          data: submission,
        })
      ).status(),
    ).toBe(403);
    const wrong = await post(submission);
    expect(wrong.status()).toBe(200);
    expect((await wrong.json()).score).toBe(0);
    expect((await post(submission)).status()).toBe(200);
    const { data: attempts, error } = await supabase
      .from("quiz_attempts")
      .select("score");
    expect(error).toBeNull();
    expect(attempts?.length).toBe(2);
    expect(
      (
        await supabase
          .from("quiz_attempts")
          .update({ score: 10 })
          .eq("user_id", userId)
      ).error,
    ).toBeTruthy();
    expect(
      (await supabase.schema("private").from("learn_quizzes").select("*"))
        .error,
    ).toBeTruthy();
    await page.goto(`${baseURL}/progress`);
    await expect(
      page.getByText("Best 10/10 · 2 attempts", { exact: true }),
    ).toBeVisible();
    for (const chapter of course.chapters.slice(1)) {
      const response = await post({
        chapterId: chapter.id,
        version: chapter.quiz.version,
        read: true,
        attemptId: randomUUID(),
        answers: Object.fromEntries(
          chapter.quiz.questions.map((question) => [
            question.id,
            question.correctOptionId,
          ]),
        ),
      });
      expect(response.status()).toBe(200);
      expect((await response.json()).score).toBe(10);
    }
    await page.goto(`${baseURL}/learn`);
    await expect(
      page.getByText("14 of 14 chapters complete", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Course completed", { exact: true }),
    ).toBeVisible();
    await page.setViewportSize({ width: 375, height: 812 });
    await page
      .getByRole("heading", { name: "Simulation and Frameworks", exact: true })
      .scrollIntoViewIfNeeded();
    expect(
      await page
        .locator("header")
        .evaluate((header) => header.getBoundingClientRect().top),
    ).toBe(0);
    await page.screenshot({
      caret: "initial",
      path: ".generated/learn-scrolled-mobile.png",
    });
    await page.goto(`${baseURL}/progress`);
    await page.getByRole("button", { name: "Sign out", exact: true }).click();
    await expect(page).toHaveURL(`${baseURL}/`);
    await page.goto(`${baseURL}/learn`);
    await expect(page).toHaveURL(`${baseURL}/login`);
    expect(errors).toEqual([]);
  } finally {
    await supabase.auth.signOut();
  }
});
