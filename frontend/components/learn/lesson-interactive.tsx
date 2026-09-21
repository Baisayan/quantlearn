"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type LessonInteractiveSpec = {
  widget: string;
  preset?: string;
  labChallenge?: string;
};

function Choice({
  selected,
  children,
  onClick,
}: {
  selected: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-left text-sm transition-[border-color,background-color] duration-300 ${selected ? "border-primary bg-secondary text-foreground" : "border-border/70 hover:border-primary/50"}`}
    >
      {children}
    </button>
  );
}

function Frame({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl border-primary/20 bg-card/80">
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="space-y-1">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            {eyebrow}
          </p>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function InformationBasics() {
  const [prediction, setPrediction] = useState("");
  const [revealed, setRevealed] = useState(false);
  return (
    <Frame eyebrow="Predict first" title="What can one measurement reveal?">
      <p className="text-sm leading-relaxed text-muted-foreground">
        You prepare |+⟩ and measure once in the Z basis. Pick the most precise
        answer before revealing the result.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {[
          ["one", "Only 0"],
          ["two", "Only 1"],
          ["either", "One outcome: 0 or 1"],
          ["state", "The full statevector"],
        ].map(([id, label]) => (
          <Choice key={id} selected={prediction === id} onClick={() => setPrediction(id)}>
            {label}
          </Choice>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={() => setRevealed(true)}>
        Reveal the idea
      </Button>
      {revealed && (
        <p className="rounded-lg bg-secondary/70 p-4 text-sm leading-relaxed text-secondary-foreground">
          One shot returns either 0 or 1. For |+⟩, fresh Z-basis shots approach
          P(0) = 1/2 and P(1) = 1/2. Your prediction: {prediction || "not selected"}.
        </p>
      )}
    </Frame>
  );
}

function Normalization() {
  const [a, setA] = useState(50);
  const [checked, setChecked] = useState(false);
  const first = a / 100;
  const second = 0.5;
  const norm = Math.hypot(first, second);
  const normalized = norm ? [first / norm, second / norm] : [0, 0];
  return (
    <Frame eyebrow="Try the calculation" title="Normalize a two-entry vector">
      <label className="block space-y-2 text-sm">
        <span className="flex justify-between gap-3">
          <span>First amplitude</span>
          <span className="font-mono text-xs text-muted-foreground">{first.toFixed(2)}</span>
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={a}
          onChange={(event) => {
            setA(Number(event.target.value));
            setChecked(false);
          }}
          className="w-full accent-primary"
        />
      </label>
      <div className="grid gap-3 rounded-lg bg-secondary/70 p-4 font-mono text-sm sm:grid-cols-3">
        <span>raw [{first.toFixed(2)}, 0.50]</span>
        <span>norm {norm.toFixed(3)}</span>
        <span>norm² {(norm * norm).toFixed(3)}</span>
      </div>
      <Button type="button" variant="outline" onClick={() => setChecked(true)}>
        Check normalization
      </Button>
      {checked && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          Divide both entries by {norm.toFixed(3)}. The normalized vector is [
          {normalized[0].toFixed(3)}, {normalized[1].toFixed(3)}], whose squared
          magnitudes add to 1.
        </p>
      )}
    </Frame>
  );
}

function BlochState() {
  const [theta, setTheta] = useState(60);
  const [phi, setPhi] = useState(90);
  const radians = Math.PI / 180;
  const x = Math.sin(theta * radians) * Math.cos(phi * radians);
  const y = Math.sin(theta * radians) * Math.sin(phi * radians);
  const z = Math.cos(theta * radians);
  const p0 = (1 + z) / 2;
  return (
    <Frame eyebrow="Move the state" title="Explore one qubit on the Bloch sphere">
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_15rem] sm:items-center">
        <svg viewBox="0 0 200 150" className="h-40 w-full rounded-lg bg-secondary/50" role="img">
          <title>Bloch sphere with a draggable-style state position</title>
          <circle cx="80" cy="75" r="48" fill="none" stroke="currentColor" strokeOpacity=".25" />
          <ellipse cx="80" cy="75" rx="48" ry="18" fill="none" stroke="currentColor" strokeOpacity=".2" />
          <line x1="32" y1="75" x2="128" y2="75" stroke="currentColor" strokeOpacity=".3" />
          <line x1="80" y1="27" x2="80" y2="123" stroke="currentColor" strokeOpacity=".3" />
          <line x1="80" y1="75" x2={80 + x * 40} y2={75 - z * 40} stroke="hsl(var(--primary))" strokeWidth="3" />
          <circle cx={80 + x * 40} cy={75 - z * 40} r="6" fill="hsl(var(--primary))" />
          <text x="80" y="18" textAnchor="middle" fontSize="10" fill="currentColor">|0⟩</text>
          <text x="80" y="140" textAnchor="middle" fontSize="10" fill="currentColor">|1⟩</text>
        </svg>
        <div className="space-y-4 text-sm">
          <label className="block space-y-1">
            <span className="flex justify-between"><span>θ</span><span className="font-mono text-xs">{theta}°</span></span>
            <input type="range" min="0" max="180" value={theta} onChange={(event) => setTheta(Number(event.target.value))} className="w-full accent-primary" />
          </label>
          <label className="block space-y-1">
            <span className="flex justify-between"><span>φ</span><span className="font-mono text-xs">{phi}°</span></span>
            <input type="range" min="0" max="360" value={phi} onChange={(event) => setPhi(Number(event.target.value))} className="w-full accent-primary" />
          </label>
          <p className="font-mono text-xs leading-relaxed text-muted-foreground">
            (x, y, z) = ({x.toFixed(2)}, {y.toFixed(2)}, {z.toFixed(2)})
            <br />P(0) = {p0.toFixed(2)} · P(1) = {(1 - p0).toFixed(2)}
          </p>
        </div>
      </div>
    </Frame>
  );
}

function MeasurementShots() {
  const [shots, setShots] = useState(256);
  const [ran, setRan] = useState(false);
  const sampleCounts: Record<number, number> = { 16: 11, 64: 48, 256: 194, 1024: 767 };
  const zeros = ran ? sampleCounts[shots] : 0;
  const ones = ran ? shots - zeros : 0;
  return (
    <Frame eyebrow="Sample the distribution" title="Exact probability versus finite shots">
      <div className="flex flex-wrap items-end gap-4">
        <label className="space-y-1 text-sm">
          <span className="block">Shots</span>
          <select value={shots} onChange={(event) => { setShots(Number(event.target.value)); setRan(false); }} className="rounded-lg border border-border/70 bg-background px-3 py-2">
            {[16, 64, 256, 1024].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <Button type="button" variant="outline" onClick={() => setRan(true)}>Run fresh shots</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["0", 0.75, ran ? zeros / shots : 0],
          ["1", 0.25, ran ? ones / shots : 0],
        ].map(([label, exact, sample]) => (
          <div key={label} className="space-y-2 rounded-lg border border-border/70 p-4 text-sm">
            <div className="flex justify-between"><span>Outcome {label}</span><span className="font-mono text-xs">exact {Number(exact).toFixed(2)}</span></div>
            <div className="h-2 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${Number(exact) * 100}%` }} /></div>
            <p className="font-mono text-xs text-muted-foreground">sample {ran ? `${Number(sample).toFixed(3)} (${label === "0" ? zeros : ones})` : "run to sample"}</p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function PhaseInterference() {
  const [circuit, setCircuit] = useState("HH");
  const [prediction, setPrediction] = useState("");
  const [revealed, setRevealed] = useState(false);
  const answer = circuit === "HH" ? "|0⟩ with probability 1" : "|1⟩ with probability 1";
  return (
    <Frame eyebrow="Predict, then reveal" title="Let the final Hadamard expose phase">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant={circuit === "HH" ? "default" : "outline"} onClick={() => { setCircuit("HH"); setRevealed(false); }}>H → H</Button>
        <Button type="button" variant={circuit === "HZH" ? "default" : "outline"} onClick={() => { setCircuit("HZH"); setRevealed(false); }}>H → Z → H</Button>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">What should the last measurement return for |0⟩ → {circuit}?</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {[["zero", "0"], ["one", "1"], ["split", "50/50"], ["phase", "The phase itself"]].map(([id, label]) => <Choice key={id} selected={prediction === id} onClick={() => setPrediction(id)}>{label}</Choice>)}
      </div>
      <Button type="button" variant="outline" onClick={() => setRevealed(true)}>Run the circuit</Button>
      {revealed && <p className="rounded-lg bg-secondary/70 p-4 text-sm leading-relaxed text-secondary-foreground">Result: {answer}. The phase sign is invisible in the first Z histogram but changes how the final H recombines the paths. Your prediction: {prediction || "not selected"}.</p>}
    </Frame>
  );
}

function CircuitStepper() {
  const steps = [
    ["Prepare", "|0⟩", "Initial normalized state"],
    ["H", "|+⟩", "A unitary creates equal amplitudes"],
    ["Z", "|−⟩", "The |1⟩ amplitude changes sign"],
    ["Measure", "0 or 1", "A classical result is recorded"],
  ];
  const [step, setStep] = useState(0);
  const current = steps[step];
  return (
    <Frame eyebrow="Step through time" title="A circuit is a sequence, not a formula dump">
      <div className="flex flex-wrap gap-2">
        {steps.map(([label], index) => (
          <button key={label} type="button" onClick={() => setStep(index)} className={`rounded-lg border px-3 py-2 text-sm transition-[border-color,background-color] duration-300 ${step === index ? "border-primary bg-secondary" : "border-border/70 hover:border-primary/50"}`}>
            {index + 1}. {label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 rounded-xl border border-border/70 bg-secondary/30 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="rounded-md border border-border/70 bg-background px-3 py-2">|0⟩</span>
          <span>→</span>
          {steps.slice(1, step + 1).map(([label]) => <span key={label} className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-primary">{label}</span>)}
        </div>
        <p className="font-mono text-sm text-primary">{current[1]}</p>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{current[2]}</p>
      <div className="flex gap-2">
        <Button type="button" size="sm" variant="outline" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>Back</Button>
        <Button type="button" size="sm" disabled={step === steps.length - 1} onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))}>Forward</Button>
      </div>
    </Frame>
  );
}

function GateExplorer() {
  const [gate, setGate] = useState("H");
  const [input, setInput] = useState("0");
  const gateOutputs: Record<string, Record<string, string>> = {
    I: { "0": "|0⟩", "1": "|1⟩" },
    X: { "0": "|1⟩", "1": "|0⟩" },
    Y: { "0": "i|1⟩", "1": "−i|0⟩" },
    Z: { "0": "|0⟩", "1": "−|1⟩" },
    H: { "0": "|+⟩", "1": "|−⟩" },
  };
  const output = gateOutputs[gate][input];
  return (
    <Frame eyebrow="Pick a gate" title="Predict the state transformation">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Gate</p>
          <div className="flex flex-wrap gap-2">{["I", "X", "Y", "Z", "H"].map((value) => <Choice key={value} selected={gate === value} onClick={() => setGate(value)}>{value}</Choice>)}</div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Input basis state</p>
          <div className="flex gap-2"><Choice selected={input === "0"} onClick={() => setInput("0")}>|0⟩</Choice><Choice selected={input === "1"} onClick={() => setInput("1")}>|1⟩</Choice></div>
        </div>
      </div>
      <p className="rounded-lg bg-secondary/70 p-4 font-mono text-sm">{gate}|{input}⟩ = {output}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">For a general state, the same matrix acts on both amplitudes. A basis check is a useful first step, not a substitute for multiplying the full vector.</p>
    </Frame>
  );
}

function RotationExplorer() {
  const [angle, setAngle] = useState(90);
  const p1 = Math.sin((angle * Math.PI) / 360) ** 2;
  return (
    <Frame eyebrow="Rotate the state" title="Ry angle to measurement probability">
      <label className="block space-y-2 text-sm">
        <span className="flex justify-between"><span>Ry angle</span><span className="font-mono text-xs">{angle}°</span></span>
        <input type="range" min="0" max="360" value={angle} onChange={(event) => setAngle(Number(event.target.value))} className="w-full accent-primary" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        {[['0', 1 - p1], ['1', p1]].map(([label, probability]) => <div key={label} className="space-y-2 rounded-lg border border-border/70 p-4 text-sm"><div className="flex justify-between"><span>P({label})</span><span className="font-mono text-xs">{Number(probability).toFixed(3)}</span></div><div className="h-2 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${Number(probability) * 100}%` }} /></div></div>)}
      </div>
      <p className="font-mono text-xs text-muted-foreground">P(1) = sin²(θ/2) = {p1.toFixed(3)}</p>
    </Frame>
  );
}

function TensorBuilder() {
  const [q1, setQ1] = useState("0");
  const [q0, setQ0] = useState("+");
  const values: Record<string, number[]> = {
    "0": [1, 0],
    "+": [1 / Math.sqrt(2), 1 / Math.sqrt(2)],
  };
  const vector = values[q1].flatMap((left) => values[q0].map((right) => left * right));
  return (
    <Frame eyebrow="Build a product state" title="Expand q1 ⊗ q0 into four amplitudes">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm"><span className="block">q1</span><select value={q1} onChange={(event) => setQ1(event.target.value)} className="w-full rounded-lg border border-border/70 bg-background px-3 py-2"><option value="0">|0⟩</option><option value="+">|+⟩</option></select></label>
        <label className="space-y-1 text-sm"><span className="block">q0</span><select value={q0} onChange={(event) => setQ0(event.target.value)} className="w-full rounded-lg border border-border/70 bg-background px-3 py-2"><option value="0">|0⟩</option><option value="+">|+⟩</option></select></label>
      </div>
      <div className="space-y-2 rounded-lg bg-secondary/70 p-4 font-mono text-xs leading-relaxed"><p>basis: 00 · 01 · 10 · 11</p><p>state: [{vector.map((value) => value.toFixed(3)).join(", ")}]</p><p>P(10): {(vector[2] ** 2).toFixed(3)}</p></div>
      <p className="text-sm leading-relaxed text-muted-foreground">The left factor is q1 and the right factor is q0. The ordering stays |q1q0⟩ even though q0 is the top circuit wire in QuantLearn.</p>
    </Frame>
  );
}

function ControlledGate() {
  const [gate, setGate] = useState("CX");
  const [input, setInput] = useState("01");
  const q1 = input[0];
  const q0 = input[1];
  const output = gate === "CX" && q0 === "1" ? `${q1 === "0" ? "1" : "0"}${q0}` : input;
  const phase = gate === "CZ" && input === "11" ? "−|11⟩" : `|${input}⟩`;
  return (
    <Frame eyebrow="Debug the control" title="Controlled gates act on a chosen branch">
      <div className="flex flex-wrap gap-2"><Button type="button" size="sm" variant={gate === "CX" ? "default" : "outline"} onClick={() => setGate("CX")}>CX(q0,q1)</Button><Button type="button" size="sm" variant={gate === "CZ" ? "default" : "outline"} onClick={() => setGate("CZ")}>CZ(q0,q1)</Button></div>
      <div className="grid gap-2 sm:grid-cols-4">{["00", "01", "10", "11"].map((value) => <Choice key={value} selected={input === value} onClick={() => setInput(value)}>{value}</Choice>)}</div>
      <p className="rounded-lg bg-secondary/70 p-4 font-mono text-sm">{gate === "CX" ? `|${input}⟩ → |${output}⟩` : `|${input}⟩ → ${phase}`}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">Under the declared convention q0 is the rightmost bit. For CX, q0 controls and q1 is the target; for CZ, only |11⟩ receives a minus phase.</p>
    </Frame>
  );
}

function DensityMatrixExplorer() {
  const [view, setView] = useState("pure");
  const [system, setSystem] = useState("joint");
  const content = view === "pure"
    ? system === "joint"
      ? "|Φ+⟩ = (|00⟩ + |11⟩)/√2"
      : "No local statevector; reduced state ρlocal = I/2"
    : system === "joint"
      ? "ρΦ+ = 1/2 [[1,0,0,1],[0,0,0,0],[0,0,0,0],[1,0,0,1]]"
      : "Trother(ρΦ+) = I/2 = [[1/2,0],[0,1/2]]";
  return (
    <Frame eyebrow="Change the representation" title="A local state can hide a joint state">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">View</p>
          <div className="flex flex-wrap gap-2">
            <Choice selected={view === "pure"} onClick={() => setView("pure")}>Statevector</Choice>
            <Choice selected={view === "matrix"} onClick={() => setView("matrix")}>Density matrix</Choice>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Keep</p>
          <div className="flex flex-wrap gap-2">
            <Choice selected={system === "joint"} onClick={() => setSystem("joint")}>Both qubits</Choice>
            <Choice selected={system === "local"} onClick={() => setSystem("local")}>One qubit</Choice>
          </div>
        </div>
      </div>
      <p className="rounded-lg bg-secondary/70 p-4 font-mono text-xs leading-relaxed">{content}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border/70 p-4 text-sm"><p className="font-medium">Diagonal</p><p className="mt-1 text-muted-foreground">Measurement probabilities in the displayed basis.</p></div>
        <div className="rounded-lg border border-border/70 p-4 text-sm"><p className="font-medium">Off diagonal</p><p className="mt-1 text-muted-foreground">Coherence that can affect later interference.</p></div>
      </div>
    </Frame>
  );
}

function BellExplorer() {
  const [state, setState] = useState("phi-plus");
  const [basis, setBasis] = useState("Z");
  const [comparison, setComparison] = useState("bell");
  const labels: Record<string, string> = {
    "phi-plus": "Φ+ = (00 + 11)/√2",
    "phi-minus": "Φ− = (00 − 11)/√2",
    "psi-plus": "Ψ+ = (01 + 10)/√2",
    "psi-minus": "Ψ− = (01 − 10)/√2",
  };
  const correlation = comparison === "mixture"
    ? basis === "Z" ? "Z: matching 00/11" : "X: all four outcomes"
    : state.startsWith("phi")
      ? basis === "Z" ? "matching" : state === "phi-plus" ? "matching" : "opposite"
      : basis === "Z" ? "opposite" : state === "psi-plus" ? "matching" : "opposite";
  return (
    <Frame eyebrow="Compare correlations" title="One basis is not enough">
      <div className="grid gap-4 lg:grid-cols-3">
        <label className="space-y-1 text-sm"><span className="block">Bell state</span><select value={state} onChange={(event) => setState(event.target.value)} className="w-full rounded-lg border border-border/70 bg-background px-3 py-2"><option value="phi-plus">Φ+</option><option value="phi-minus">Φ−</option><option value="psi-plus">Ψ+</option><option value="psi-minus">Ψ−</option></select></label>
        <div className="space-y-1 text-sm"><span className="block">Measurement basis</span><div className="flex gap-2"><Choice selected={basis === "Z"} onClick={() => setBasis("Z")}>Z</Choice><Choice selected={basis === "X"} onClick={() => setBasis("X")}>X</Choice></div></div>
        <div className="space-y-1 text-sm"><span className="block">Preparation</span><div className="flex gap-2"><Choice selected={comparison === "bell"} onClick={() => setComparison("bell")}>Bell</Choice><Choice selected={comparison === "mixture"} onClick={() => setComparison("mixture")}>00/11 mixture</Choice></div></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <p className="rounded-lg bg-secondary/70 p-4 font-mono text-sm">{comparison === "bell" ? labels[state] : "50% |00⟩, 50% |11⟩"}</p>
        <p className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">Observed: <span className="font-semibold">{correlation}</span></p>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">This comparison distinguishes the displayed examples. It is not a universal Bell test, and a matching histogram alone does not prove entanglement.</p>
    </Frame>
  );
}

function TeleportationTracer() {
  const [input, setInput] = useState("phase");
  const [branch, setBranch] = useState("10");
  const [step, setStep] = useState(0);
  const inputLabel = input === "zero" ? "|0⟩" : input === "one" ? "|1⟩" : "ψ = [√3/2, i/2]";
  const branchState: Record<string, [string, string, string]> = {
    "00": ["ψ", "I", "ψ"],
    "01": ["Xψ", "X", "ψ"],
    "10": ["Zψ", "Z", "ψ"],
    "11": ["XZψ", "X then Z", "ψ"],
  };
  const [before, correction, after] = branchState[branch];
  const displayed = step === 0 ? inputLabel : step === 1 ? `${before} · branch ${branch}` : `${after} after ${correction}`;
  return (
    <Frame eyebrow="Trace a branch" title="Classical bits choose Bob's correction">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-1 text-sm"><span className="block">Input</span><select value={input} onChange={(event) => { setInput(event.target.value); setStep(0); }} className="w-full rounded-lg border border-border/70 bg-background px-3 py-2"><option value="zero">|0⟩</option><option value="one">|1⟩</option><option value="phase">√3|0⟩/2 + i|1⟩/2</option></select></label>
        <label className="space-y-1 text-sm"><span className="block">Alice reports m0m1</span><select value={branch} onChange={(event) => { setBranch(event.target.value); setStep(1); }} className="w-full rounded-lg border border-border/70 bg-background px-3 py-2">{["00", "01", "10", "11"].map((value) => <option key={value}>{value}</option>)}</select></label>
        <div className="space-y-1 text-sm"><span className="block">Protocol step</span><div className="flex flex-wrap gap-2">{["Input", "Measure", "Correct"].map((label, index) => <Choice key={label} selected={step === index} onClick={() => setStep(index)}>{label}</Choice>)}</div></div>
      </div>
      <div className="grid gap-3 rounded-xl border border-border/70 bg-secondary/30 p-4 sm:grid-cols-3 sm:items-center"><p className="font-mono text-sm">{displayed}</p><p className="text-sm text-muted-foreground">Before: {before}</p><p className="text-sm text-primary">Correction: {correction}</p></div>
      <p className="text-sm leading-relaxed text-muted-foreground">The branch is random and carries no readable copy of the unknown amplitudes. Bob reaches the input state only after the two classical bits select the correction.</p>
    </Frame>
  );
}

function NoCloningExplorer() {
  const [state, setState] = useState("basis");
  const [revealed, setRevealed] = useState(false);
  const superposition = state === "superposition";
  return (
    <Frame eyebrow="Predict before reveal" title="Can one device copy an unknown state?">
      <p className="text-sm leading-relaxed text-muted-foreground">Choose the input family. A copier can be defined on known basis states, but the same linear operation cannot copy every unknown superposition.</p>
      <div className="flex flex-wrap gap-2"><Choice selected={state === "basis"} onClick={() => { setState("basis"); setRevealed(false); }}>Known basis states</Choice><Choice selected={superposition} onClick={() => { setState("superposition"); setRevealed(false); }}>α|0⟩ + β|1⟩</Choice></div>
      <Button type="button" variant="outline" onClick={() => setRevealed(true)}>Test linearity</Button>
      {revealed && <div className="space-y-3 rounded-lg bg-secondary/70 p-4 text-sm leading-relaxed"><p>{superposition ? "The copier's linear output is α|00⟩ + β|11⟩, but a true copy would require α²|00⟩ + αβ|01⟩ + αβ|10⟩ + β²|11⟩. These are not equal in general." : "The basis mapping |0⟩|0⟩ → |0⟩|0⟩ and |1⟩|0⟩ → |1⟩|1⟩ is allowed. The contradiction appears when one device must also copy their superpositions."}</p><p className="font-mono text-xs text-muted-foreground">Bob-only view of an entangled pair before classical communication: ρB = I/2.</p></div>}
    </Frame>
  );
}

export function LessonInteractive({ spec }: { spec: LessonInteractiveSpec }) {
  switch (spec.widget) {
    case "information-basics":
      return <InformationBasics />;
    case "normalization":
      return <Normalization />;
    case "bloch-state":
      return <BlochState />;
    case "measurement-shots":
      return <MeasurementShots />;
    case "phase-interference":
      return <PhaseInterference />;
    case "circuit-stepper":
      return <CircuitStepper />;
    case "gate-explorer":
      return <GateExplorer />;
    case "rotation-explorer":
      return <RotationExplorer />;
    case "tensor-builder":
      return <TensorBuilder />;
    case "controlled-gate":
      return <ControlledGate />;
    case "density-matrix-explorer":
      return <DensityMatrixExplorer />;
    case "bell-explorer":
      return <BellExplorer />;
    case "teleportation-tracer":
      return <TeleportationTracer />;
    case "no-cloning-explorer":
      return <NoCloningExplorer />;
    default:
      return null;
  }
}
