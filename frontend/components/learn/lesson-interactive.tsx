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
    default:
      return null;
  }
}
