"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Result } from "@/lib/lab/types";

function Bloch({ point }: { point: Result["bloch"][number] }) {
  const [rotation, setRotation] = useState(0.6);
  const project = (x: number, y: number, z: number) => [
    140 + 100 * (x * Math.cos(rotation) - y * Math.sin(rotation)),
    140 -
      100 *
        (z * 0.85 + (x * Math.sin(rotation) + y * Math.cos(rotation)) * 0.35),
  ];
  const end = project(point.x, point.y, point.z);
  const length = Math.hypot(point.x, point.y, point.z);
  return (
    <div className="space-y-2 text-center">
      <p className="font-medium">Qubit {point.qubit}</p>
      <svg
        viewBox="0 0 280 280"
        className="mx-auto w-full max-w-64 text-primary"
        role="img"
        aria-label={`Bloch vector for q${point.qubit}: x ${point.x.toFixed(3)}, y ${point.y.toFixed(3)}, z ${point.z.toFixed(3)}`}
      >
        <circle
          cx="140"
          cy="140"
          r="100"
          fill="currentColor"
          fillOpacity="0.03"
          stroke="currentColor"
          strokeOpacity="0.3"
        />
        <ellipse
          cx="140"
          cy="140"
          rx="100"
          ry="35"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.2"
        />
        {[
          [1, 0, 0, "X"],
          [0, 1, 0, "Y"],
          [0, 0, 1, "Z"],
        ].map(([x, y, z, label]) => {
          const p = project(Number(x), Number(y), Number(z));
          return (
            <g key={label}>
              <line
                x1="140"
                y1="140"
                x2={p[0]}
                y2={p[1]}
                stroke="currentColor"
                strokeOpacity="0.3"
              />
              <text x={p[0] + 5} y={p[1] - 5} fill="currentColor" fontSize="12">
                {label}
              </text>
            </g>
          );
        })}
        <line
          x1="140"
          y1="140"
          x2={end[0]}
          y2={end[1]}
          stroke="currentColor"
          strokeWidth="3"
        />
        <circle cx={end[0]} cy={end[1]} r="5" fill="currentColor" />
      </svg>
      <label className="block text-xs text-muted-foreground">
        Rotate view
        <input
          aria-label={`Rotate q${point.qubit} Bloch sphere`}
          className="mx-auto mt-2 block w-40 accent-primary"
          type="range"
          min="0"
          max="6.28"
          step="0.05"
          value={rotation}
          onChange={(e) => setRotation(Number(e.target.value))}
        />
      </label>
      <p className="font-mono text-xs">
        ({point.x.toFixed(3)}, {point.y.toFixed(3)}, {point.z.toFixed(3)})
      </p>
      <p className="text-xs text-muted-foreground">
        {length < 0.999
          ? "Mixed local state: vector lies inside the sphere."
          : "Pure local state: vector reaches the surface."}
      </p>
    </div>
  );
}

export function Results({ result }: { result: Result }) {
  const n = result.circuit.qubits;
  return (
    <Card className="min-w-0 bg-white/90 shadow-none">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap justify-between gap-2">
          <h2 className="text-lg font-semibold">
            {result.engine === "aer" ? "Qiskit Aer" : "Cirq"} results
          </h2>
          <span className="text-sm text-muted-foreground">
            {result.shots} shots · ideal simulation
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Basis order: |
          {Array.from({ length: n }, (_, i) => `q${n - i - 1}`).join("")}⟩.
          State shown before terminal Z measurements.
        </p>
        <Tabs defaultValue="histogram">
          <TabsList className="h-auto flex-wrap">
            <TabsTrigger value="histogram">Histogram</TabsTrigger>
            <TabsTrigger value="state">Statevector</TabsTrigger>
            <TabsTrigger value="bloch">Bloch</TabsTrigger>
            <TabsTrigger value="circuit">Circuit</TabsTrigger>
          </TabsList>
          <TabsContent value="histogram" className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Solid bars show sampled frequencies; the labels compare them with
              exact probabilities.
            </p>
            {result.statevector.map((v) => {
              const count = result.counts[v.basis] || 0;
              return (
                <div
                  key={v.basis}
                  className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1"
                >
                  <span className="font-mono text-sm">|{v.basis}⟩</span>
                  <div className="h-5 overflow-hidden rounded bg-secondary">
                    <div
                      className="h-full rounded bg-primary"
                      style={{ width: `${(count / result.shots) * 100}%` }}
                    />
                  </div>
                  <span />
                  <span className="text-xs text-muted-foreground">
                    {count} counts · sampled{" "}
                    {((count / result.shots) * 100).toFixed(1)}% · exact{" "}
                    {(v.probability * 100).toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </TabsContent>
          <TabsContent value="state">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <caption className="mb-3 text-left text-muted-foreground">
                  Complex amplitudes and probabilities
                </caption>
                <thead>
                  <tr>
                    {["Basis", "Real", "Imaginary", "Probability"].map((h) => (
                      <th key={h} className="p-2 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.statevector.map((v) => (
                    <tr key={v.basis} className="border-t font-mono">
                      <td className="p-2">|{v.basis}⟩</td>
                      <td className="p-2">{v.real.toFixed(5)}</td>
                      <td className="p-2">{v.imag.toFixed(5)}</td>
                      <td className="p-2">{v.probability.toFixed(5)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="bloch">
            <div className="grid gap-5 sm:grid-cols-3">
              {result.bloch.map((p) => (
                <Bloch key={p.qubit} point={p} />
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              These are reduced single-qubit states. Local spheres do not show
              all correlations in the joint state.
            </p>
          </TabsContent>
          <TabsContent value="circuit">
            <div className="overflow-x-auto">
              <svg
                viewBox={`0 0 ${160 + result.circuit.operations.length * 70} ${60 + n * 70}`}
                style={{
                  minWidth: 160 + result.circuit.operations.length * 70,
                }}
                className="w-full text-primary"
                role="img"
                aria-label="Executed quantum circuit"
              >
                {Array.from({ length: n }, (_, q) => (
                  <g key={q}>
                    <text
                      x="5"
                      y={45 + q * 70}
                      fill="currentColor"
                      fontSize="14"
                    >
                      q{q} |0⟩
                    </text>
                    <line
                      x1="60"
                      y1={40 + q * 70}
                      x2={150 + result.circuit.operations.length * 70}
                      y2={40 + q * 70}
                      stroke="currentColor"
                      strokeOpacity="0.3"
                    />
                    <rect x={118 + result.circuit.operations.length * 70} y={26 + q * 70} width="28" height="28" rx="4" fill="white" stroke="currentColor" />
                    <text x={132 + result.circuit.operations.length * 70} y={45 + q * 70} textAnchor="middle" fill="currentColor" fontSize="12">M</text>
                  </g>
                ))}
                {result.circuit.operations.map((op, i) => (
                  <g key={i}>
                    <title>{op.gate.toUpperCase()} on {op.targets.map(q => `q${q}`).join(", ")}{op.angle === undefined ? "" : `, ${op.angle.toFixed(5)} radians`}</title>
                    {op.targets.length === 2 && (
                      <line
                        x1={100 + i * 70}
                        x2={100 + i * 70}
                        y1={40 + op.targets[0] * 70}
                        y2={40 + op.targets[1] * 70}
                        stroke="currentColor"
                      />
                    )}
                    {op.targets.map((q, t) => (
                      <g key={q}>
                        {t === 0 && ["cx", "cz"].includes(op.gate) ? (
                          <circle
                            cx={100 + i * 70}
                            cy={40 + q * 70}
                            r="5"
                            fill="currentColor"
                          />
                        ) : (
                          <>
                            <rect
                              x={78 + i * 70}
                              y={22 + q * 70}
                              width="44"
                              height="36"
                              rx="5"
                              fill="white"
                              stroke="currentColor"
                            />
                            <text
                              x={100 + i * 70}
                              y={45 + q * 70}
                              textAnchor="middle"
                              fill="currentColor"
                              fontSize="11"
                            >
                              {op.gate.toUpperCase()}
                            </text>
                            {op.angle !== undefined && <text x={100 + i * 70} y={67 + q * 70} textAnchor="middle" fill="currentColor" fontSize="9">{op.angle.toFixed(3)}</text>}
                          </>
                        )}
                      </g>
                    ))}
                  </g>
                ))}
              </svg>
            </div>
          </TabsContent>
        </Tabs>
        {result.energy !== null && (
          <p className="text-sm">
            Exact ⟨Z + 0.5X⟩:{" "}
            <span className="font-mono">{result.energy.toFixed(5)}</span>
          </p>
        )}
        {result.cutScore !== null && (
          <p className="text-sm">
            Exact one-edge cut expectation:{" "}
            <span className="font-mono">{result.cutScore.toFixed(5)}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
