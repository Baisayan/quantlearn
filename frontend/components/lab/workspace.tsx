"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { python } from "@codemirror/lang-python";
import challenges from "@/.generated/lab.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Circuit, Engine, Result, toCode } from "@/lib/lab/types";
import { CircuitEditor } from "./circuit-editor";
import { Results } from "./results";
const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
  loading: () => <p>Loading editor…</p>,
});
const selectClass =
  "h-10 max-w-full rounded-md border bg-white px-3 text-sm focus-visible:outline-primary";

export function LabWorkspace() {
  const [challengeId, setChallengeId] = useState("bell");
  const [editorKey, setEditorKey] = useState(0);
  const challenge = challenges.find((c) => c.id === challengeId);
  const [circuit, setCircuit] = useState<Circuit>({
    qubits: 2,
    operations: [],
  });
  const [engine, setEngine] = useState<Engine>("aer");
  const [shots, setShots] = useState(1024);
  const [tab, setTab] = useState("circuit");
  const [code, setCode] = useState(toCode(circuit, engine));
  const [codeDirty, setCodeDirty] = useState(false);
  const submission = useRef<{ fingerprint: string; id: string } | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [assessment, setAssessment] = useState<Result["assessment"]>();
  function update(next: Circuit) {
    setCircuit(next);
    setCode(toCode(next, engine));
    setCodeDirty(false);
    setResults([]);
    setAssessment(undefined);
    setError("");
  }
  function reset(id = challengeId) {
    setEditorKey(key => key + 1);
    const next = challenges.find((c) => c.id === id);
    setChallengeId(id);
    update({ qubits: next?.qubits || 2, operations: [] });
    setTab("circuit");
  }
  async function run(action: "simulate" | "grade", compare = false) {
    setBusy(
      compare ? "Comparing" : action === "grade" ? "Submitting" : "Running",
    );
    setError("");
    setAssessment(undefined);
    try {
      const engines: Engine[] = compare ? ["aer", "cirq"] : [engine];
      const responses: Result[] = [];
      for (const selected of engines) {
        const payload = { engine: selected, ...(tab === "code" ? { code } : { circuit }), shots, seed: 42, ...(action === "grade" ? { challengeId } : {}) };
        const fingerprint = JSON.stringify(payload);
        if (action === "grade" && submission.current?.fingerprint !== fingerprint) submission.current = { fingerprint, id: crypto.randomUUID() };
        const response = await fetch(`/api/lab/${action}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            ...(action === "grade"
              ? { attemptId: submission.current!.id }
              : {}),
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Simulation failed.");
        responses.push(data);
      }
      setResults(responses);
      if (tab === "code") { setCircuit(responses[0].circuit); setCodeDirty(false); }
      setAssessment(responses[0].assessment);
      if (action === "grade") submission.current = null;
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "The simulator could not respond.",
      );
    } finally {
      setBusy("");
    }
  }
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-5 py-8 sm:px-8">
      <div>
        <p className="text-sm font-medium text-primary">Quantum playground</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Build. Run. Understand.
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explore up to three qubits with Qiskit Aer and Cirq.
        </p>
      </div>
      <fieldset
        disabled={Boolean(busy)}
        className="space-y-6 disabled:opacity-80"
      >
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex min-w-0 flex-col gap-2">
            <Label htmlFor="challenge">Experiment</Label>
            <select
              id="challenge"
              className={selectClass}
              value={challengeId}
              onChange={(e) => reset(e.target.value)}
            >
              <option value="free">Free experiment</option>
              {challenges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="engine">Simulator</Label>
            <select
              id="engine"
              disabled={codeDirty}
              className={selectClass}
              value={engine}
              onChange={(e) => {
                const next = e.target.value as Engine;
                setEngine(next);
                setCode(toCode(circuit, next));
                setTab("circuit");
                setResults([]);
                setAssessment(undefined);
              }}
            >
              <option value="aer">Qiskit Aer</option>
              <option value="cirq">Cirq</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="shots">Shots</Label>
            <select
              id="shots"
              className={selectClass}
              value={shots}
              onChange={(e) => {
                setShots(Number(e.target.value));
                setResults([]);
              }}
            >
              {[128, 512, 1024, 2048, 4096].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <Button onClick={() => run("simulate")}>Run circuit</Button>
          <Button variant="outline" onClick={() => reset()}>
            Reset
          </Button>
          <Button
            variant="outline"
            disabled={tab === "code"}
            onClick={() => run("simulate", true)}
          >
            Compare engines
          </Button>
        </div>
        <div className="grid items-start gap-5 lg:grid-cols-[1fr_3fr]">
          <Card className="bg-white/85 shadow-none">
            <CardContent className="space-y-4 p-5">
              <p className="text-xs font-medium text-primary">
                {challenge?.difficulty || "Open exploration"}
              </p>
              <h2 className="text-lg font-semibold">
                {challenge?.title || "Your experiment"}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {challenge?.objective ||
                  "Build any supported circuit and compare exact states with sampled measurements."}
              </p>
              {challenge && (
                <>
                  <p className="text-xs text-muted-foreground">
                    {challenge.qubits} qubits · at most {challenge.maxGates}{" "}
                    gates
                  </p>
                  <Button asChild variant="link" className="h-auto p-0">
                    <Link href={`/learn/${challenge.chapterId}`}>
                      Read the lesson →
                    </Link>
                  </Button>
                  <details className="rounded-lg border p-3 text-sm">
                    <summary className="cursor-pointer font-medium">
                      Need a hint?
                    </summary>
                    <p className="mt-3 leading-relaxed text-muted-foreground">
                      {challenge.hint}
                    </p>
                  </details>
                </>
              )}
              <p className="text-xs leading-relaxed text-muted-foreground">
                All wires start at zero. Measurements are added at the end.
                Angles use radians; q0 is the rightmost bit in results.
              </p>
            </CardContent>
          </Card>
          <Card className="min-w-0 bg-white/90 shadow-none">
            <CardContent className="p-5">
              <Tabs
                value={tab}
                onValueChange={(value) => {
                  if (value === "circuit" && tab === "code") {
                    setCode(toCode(circuit, engine));
                  }
                  setTab(value);
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <TabsList>
                    <TabsTrigger value="circuit" disabled={codeDirty}>Circuit builder</TabsTrigger>
                    <TabsTrigger value="code">Python code</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="qubits">Qubits</Label>
                    <select
                      id="qubits"
                      disabled={Boolean(challenge) || codeDirty}
                      className={selectClass}
                      value={circuit.qubits}
                      onChange={(e) =>
                        update({
                          qubits: Number(e.target.value),
                          operations: [],
                        })
                      }
                    >
                      {[1, 2, 3].map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <TabsContent value="circuit">
                  <CircuitEditor
                    key={`${challengeId}:${circuit.qubits}:${editorKey}`}
                    circuit={circuit}
                    onChange={update}
                  />
                </TabsContent>
                <TabsContent value="code" className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Editable Python circuit subset. Use the imports and
                    initialization below, then gate calls with numeric angles or
                    pi. Run edited code to validate it and unlock the builder
                    and engine selector. Reset discards edits.
                  </p>
                  <div className="overflow-hidden rounded-lg border">
                    <CodeMirror
                      editable={!busy}
                      value={code}
                      extensions={[python()]}
                      theme="light"
                      minHeight="18rem"
                      basicSetup={{ lineNumbers: true, foldGutter: false }}
                      onChange={(value) => {
                        setCode(value);
                        setCodeDirty(true);
                        setResults([]);
                        setAssessment(undefined);
                      }}
                      aria-label={`${engine} Python circuit editor`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported: single-qubit gates, CX/CNOT, CZ, SWAP and
                    rotations. RZZ is generated as CX-RZ-CX for Cirq.
                    Measurement is automatic. Loops, file access and arbitrary
                    Python are outside this demo.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        {challenge && (
          <Card className="bg-white/85 shadow-none">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <h2 className="font-semibold">Check your solution</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Submit from either editor. A passing result completes this Lab
                  challenge in Progress.
                </p>
              </div>
              <Button onClick={() => run("grade")}>Submit solution</Button>
            </CardContent>
          </Card>
        )}
      </fieldset>
      <div aria-live="polite">
        {busy && <p className="text-sm text-primary">{busy}…</p>}
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-primary/30 bg-white p-4 text-sm"
          >
            {error}
          </p>
        )}
        {assessment && (
          <Card className="border-primary/30 bg-white">
            <CardContent className="space-y-2 p-5">
              <p className="font-semibold">
                {assessment.passed ? "Completed" : "Keep practising"} ·{" "}
                {assessment.score}% target match
              </p>
              <p className="text-sm">{assessment.feedback}</p>
              <Link href="/progress" className="text-sm text-primary underline">
                View saved progress
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
      {results.length === 2 && (
        <p className="rounded-lg border bg-white p-4 text-sm">
          Maximum exact probability difference:{" "}
          {Math.max(
            ...results[0].statevector.map((v, i) =>
              Math.abs(v.probability - results[1].statevector[i].probability),
            ),
          ).toExponential(2)}
          . Sampled counts can differ between engines even with the same seed.
        </p>
      )}
      <div className="space-y-5">
        {results.map((result) => (
          <Results key={result.engine} result={result} />
        ))}
        {!results.length && !busy && (
          <div className="rounded-xl border border-dashed border-primary/25 p-10 text-center text-muted-foreground">
            Run your circuit to explore its histogram, amplitudes, Bloch spheres
            and diagram.
          </div>
        )}
      </div>
    </main>
  );
}
