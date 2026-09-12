import assert from "node:assert/strict";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { verifyPhysics } from "./quantum.mjs";
import { buildVisuals } from "./visuals.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const frontend = resolve(root, "../frontend");
const visualDirectory = resolve(frontend, "public/learn/visuals");
const readJson = async (path) => JSON.parse(await readFile(resolve(root, path), "utf8"));
const catalog = await readJson("catalog.json");
const sources = await readJson("sources.json");
const { circuits } = await readJson("examples/circuits.json");
const unique = (values, label) => assert.equal(new Set(values).size, values.length, "Duplicate " + label);
unique(sources.map((s) => s.id), "source IDs");
unique(catalog.chapters.map((c) => c.id), "chapter IDs");
unique(catalog.modules.map((m) => m.id), "module IDs");
assert.ok(catalog.modules.every((m) => m.description), "Missing module description");
unique(circuits.map((c) => c.id), "circuit IDs");
assert.deepEqual(catalog.engines, ["aer", "cirq"]);
assert.equal(catalog.chapters.length, 14);
assert.equal(catalog.chapterQuiz.questions, 10);
assert.deepEqual(catalog.chapterQuiz.difficultyOrder, ["easy", "medium", "hard"]);
assert.deepEqual(catalog.chapterQuiz.difficultyCounts, { easy: 3, medium: 4, hard: 3 });
const expectedDifficulty = catalog.chapterQuiz.difficultyOrder.flatMap((level) =>
  Array(catalog.chapterQuiz.difficultyCounts[level]).fill(level));
for (const source of sources) {
  assert.ok(source.title && source.publisher && source.supports && source.reuse);
  assert.equal(new URL(source.url).protocol, "https:");
}

for (const c of circuits) {
  assert.ok(Number.isInteger(c.qubits) && c.qubits > 0 && c.qubits <= 3);
  assert.equal(c.probabilities.length, 2 ** c.qubits);
  for (const op of c.operations) {
    assert.ok(op.targets.length > 0 && op.targets.every((q) => Number.isInteger(q) && q >= 0 && q < c.qubits));
    unique(op.targets, c.id + " targets");
  }
}
const results = verifyPhysics(circuits);
const figures = buildVisuals(circuits, results);
unique(figures.map((f) => f.id), "figure IDs");
const figureIds = new Set(figures.map((f) => f.id));
const sourceIds = new Set(sources.map((s) => s.id));
const usedFigures = new Set();
const chapters = [];
let questionCount = 0;

for (const [index, chapter] of catalog.chapters.entries()) {
  assert.ok(chapter.summary && chapter.difficulty, "Missing chapter navigation metadata");
  assert.match(chapter.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.equal(chapter.order, index + 1);
  assert.equal(chapter.lesson, "lessons/" + chapter.id + ".md");
  assert.equal(chapter.quiz, "quizzes/" + chapter.id + ".json");
  assert.ok(catalog.modules.some((m) => m.id === chapter.module));
  assert.ok(chapter.sourceIds.length && chapter.sourceIds.every((id) => sourceIds.has(id)));
  assert.ok(chapter.prerequisites.every((id) => catalog.chapters.slice(0, index).some((c) => c.id === id)), "Prerequisite cycle or missing chapter");
  assert.ok(chapter.visualIds.length >= 1 && chapter.visualIds.every((id) => figureIds.has(id)));
  const markdown = await readFile(resolve(root, chapter.lesson), "utf8");
  for (const heading of ["Learning objectives", "Summary", "Chapter quiz", "Sources"]) assert.ok(markdown.includes("## " + heading), "Missing " + heading + " in " + chapter.id);
  assert.ok(markdown.trim().split(/\s+/).length >= 250, "Lesson too short: " + chapter.id);
  assert.equal((markdown.match(new RegExp("^" + String.fromCharCode(96).repeat(3), "gm")) ?? []).length % 2, 0, "Unclosed code fence");
  assert.equal((markdown.match(/^\$\$/gm) ?? []).length % 2, 0, "Unclosed display math");
  const refs = [...markdown.matchAll(/!\[([^\]]+)\]\(\/learn\/visuals\/([a-z0-9-]+)\.svg\)/g)];
  assert.deepEqual(refs.map((r) => r[2]).sort(), [...chapter.visualIds].sort(), "Figure references differ in " + chapter.id);
  refs.forEach((r) => { assert.ok(r[1].length >= 20, "Missing descriptive alt text"); usedFigures.add(r[2]); });
  chapter.sourceIds.forEach((id) => assert.ok(markdown.includes(sources.find((s) => s.id === id).url), "Missing chapter citation"));
  const quiz = await readJson(chapter.quiz);
  assert.equal(quiz.chapterId, chapter.id);
  assert.equal(quiz.questions.length, catalog.chapterQuiz.questions);
    assert.ok(Number.isInteger(quiz.version) && quiz.version > 0 && quiz.version <= 2147483647, "Quiz version must be a positive PostgreSQL integer");
  assert.deepEqual(quiz.questions.map((q) => q.difficulty), expectedDifficulty, "Quiz difficulty order differs in " + chapter.id);
  unique(quiz.questions.map((q) => q.prompt.trim().toLowerCase()), "question prompts");
  assert.ok(!/[\u2014]/.test(markdown + JSON.stringify(quiz)), "Em dash in " + chapter.id);
  assert.ok(markdown.includes("Answer all 10 questions"), "Outdated quiz instructions in " + chapter.id);
  unique(quiz.questions.map((q) => q.id), "question IDs");
  for (const q of quiz.questions) {
    assert.equal(q.options.length, 4);
    unique(q.options.map((o) => o.id), "option IDs");
    assert.deepEqual(q.options.map((o) => o.id), ["a", "b", "c", "d"]);
    unique(q.options.map((o) => o.text.trim().toLowerCase()), "option texts");
    assert.ok(q.id.startsWith(chapter.id + "-q"), "Question belongs to wrong chapter");
    assert.equal(q.options.filter((o) => o.id === q.correctOptionId).length, 1);
    assert.ok(q.prompt && q.explanation && q.options.every((o) => o.text));
    questionCount++;
  }
  chapters.push({ ...chapter, markdown, quiz });
}
assert.deepEqual([...usedFigures].sort(), [...figureIds].sort(), "Unused or unreferenced figure");
for (const [folder, extension, expected] of [
  ["lessons", ".md", catalog.chapters.map((c) => c.id + ".md")],
  ["quizzes", ".json", catalog.chapters.map((c) => c.id + ".json")],
]) assert.deepEqual((await readdir(resolve(root, folder))).filter((p) => p.endsWith(extension)).sort(), expected.sort(), "Orphan files in " + folder);

const visualManifest = figures.map(({ svg, data, ...f }) => ({
  ...f,
  file: f.id + ".svg",
  url: "/learn/visuals/" + f.id + ".svg",
  author: "Original QuantLearn teaching figure",
  chapterIds: catalog.chapters.filter((c) => c.visualIds.includes(f.id)).map((c) => c.id),
}));
const json = (value) => JSON.stringify(value, null, 2) + "\n";
const outputs = new Map(figures.map((f) => [f.id + ".svg", f.svg]));
outputs.set("manifest.json", json(visualManifest));
outputs.set("data.json", json({
  note: "Exact authoring calculations unless a figure explicitly says synthetic samples. SVGs are static. These data can support future interactive components.",
  basisOrder: "q(n-1)...q0",
  states: results,
  figures: Object.fromEntries(figures.map((f) => [f.id, f.data])),
}));
const esc = (v) => v.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
outputs.set("index.html", '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>QuantLearn chapter figures</title><style>body{margin:0;padding:2rem;font:1rem/1.5 system-ui;background:#faf8ff;color:#221536}main{max-width:80rem;margin:auto}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,32rem),1fr));gap:1.5rem}figure{margin:0;background:white;border:1px solid #ddd6fe;padding:1rem}img{display:block;width:100%;height:auto}figcaption{margin-top:1rem;color:#62556f}a{color:#6d28d9}</style><main><h1>QuantLearn chapter figures</h1><p>28 original read-only figures. Open an image for its full-size view. Circuit basis: q(n−1)…q0; q0 is the top wire.</p><section>' + figures.map((f) => '<figure><a href="' + f.id + '.svg"><img src="' + f.id + '.svg" alt="' + esc(f.description) + '"></a><figcaption>' + esc(f.id + " · " + f.kind) + '</figcaption></figure>').join("") + '</section></main></html>\n');

await mkdir(visualDirectory, { recursive: true });
for (const [path, value] of outputs) await writeFile(resolve(visualDirectory, path), value);
await mkdir(resolve(frontend, ".generated"), { recursive: true });
await writeFile(resolve(frontend, ".generated/learn.json"), json({ ...catalog, chapters, sources, visuals: visualManifest }));
const sqlString = (value) => "'" + value.replaceAll("'", "''") + "'";
const quizRows = chapters.map(({ id, quiz }) => "(" + sqlString(id) + "," + quiz.version + "," + sqlString(JSON.stringify(Object.fromEntries(quiz.questions.map((q) => [q.id, q.correctOptionId])))) + "::jsonb)");
await writeFile(resolve(frontend, ".generated/learn-seed.sql"),
  "-- Generated from content/quizzes; do not edit. Apply after supabase/schema.sql.\n" +
  "insert into private.learn_quizzes (chapter_id,version,answers) values\n" + quizRows.join(",\n") +
  "\non conflict (chapter_id) do update set version=excluded.version, answers=excluded.answers;\n");
console.log("Prepared: " + chapters.length + " chapters; " + questionCount + " MCQs; " + figures.length + " SVGs; " + circuits.length + " circuit fixtures; " + sources.length + " sources.");
console.log("Physics checks: fixture probabilities, Grover phase and overshoot, 7 VQE angles, 20 QAOA angle pairs, 16 teleportation branches, mixture/Bell comparisons and expanded assessment arithmetic.");
console.log("Scope: Learn content and figures; live simulator execution belongs in Lab.");
