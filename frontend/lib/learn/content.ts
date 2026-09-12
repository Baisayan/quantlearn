import "server-only";

import { notFound } from "next/navigation";
import content from "@/.generated/learn.json";

export const course = content;
export type Chapter = (typeof course.chapters)[number];

export function getChapter(id: string) {
  const chapter = course.chapters.find((chapter) => chapter.id === id);
  if (!chapter) notFound();
  return chapter;
}

export function getQuizQuestions(chapter: Chapter) {
  return chapter.quiz.questions.map(({ id, prompt, options, difficulty }) => ({
    id,
    prompt,
    options,
    difficulty,
  }));
}
