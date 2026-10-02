"use client";
import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Circuit,
  Gate,
  gates,
  isPair,
  isRotation,
  Operation,
} from "@/lib/lab/types";

type GateCategory = "superposition" | "pauli" | "rotation" | "entangling";

interface GateInfo {
  name: string;
  category: GateCategory;
  description: string;
  matrix: string;
  multiQubit?: boolean;
}

const GATE_INFO: Record<Gate, GateInfo> = {
  h: {
    name: "Hadamard",
    category: "superposition",
    description: "Creates equal superposition: |0⟩ → (|0⟩+|1⟩)/√2",
    matrix: "1/√2 [[1, 1], [1, -1]]",
  },
  x: {
    name: "Pauli-X",
    category: "pauli",
    description: "Bit-flip / quantum NOT: |0⟩ ↔ |1⟩",
    matrix: "[[0, 1], [1, 0]]",
  },
  y: {
    name: "Pauli-Y",
    category: "pauli",
    description: "Bit and phase flip: |0⟩ → i|1⟩, |1⟩ → -i|0⟩",
    matrix: "[[0, -i], [i, 0]]",
  },
  z: {
    name: "Pauli-Z",
    category: "pauli",
    description: "Phase flip: leaves |0⟩, inverts |1⟩ → -|1⟩",
    matrix: "[[1, 0], [0, -1]]",
  },
  s: {
    name: "Phase S (√Z)",
    category: "rotation",
    description: "Quarter-turn phase shift: π/2 rotation about Z",
    matrix: "[[1, 0], [0, i]]",
  },
  t: {
    name: "Phase T (∜Z)",
    category: "rotation",
    description: "Eighth-turn phase shift: π/4 rotation about Z",
    matrix: "[[1, 0], [0, e^(iπ/4)]]",
  },
  rx: {
    name: "Rotation X",
    category: "rotation",
    description: "Continuous rotation by angle θ around X axis",
    matrix: "[[cos(θ/2), -i sin(θ/2)], [-i sin(θ/2), cos(θ/2)]]",
  },
  ry: {
    name: "Rotation Y",
    category: "rotation",
    description: "Continuous rotation by angle θ around Y axis",
    matrix: "[[cos(θ/2), -sin(θ/2)], [sin(θ/2), cos(θ/2)]]",
  },
  rz: {
    name: "Rotation Z",
    category: "rotation",
    description: "Continuous rotation by angle θ around Z axis",
    matrix: "[[e^(-iθ/2), 0], [0, e^(iθ/2)]]",
  },
  cx: {
    name: "CNOT (Controlled-X)",
    category: "entangling",
    description: "Flips target wire if control wire is |1⟩",
    matrix: "4×4 Permutation Unitary",
    multiQubit: true,
  },
  cz: {
    name: "Controlled-Z",
    category: "entangling",
    description: "Applies phase-flip if both qubits are |1⟩",
    matrix: "diag(1, 1, 1, -1)",
    multiQubit: true,
  },
  swap: {
    name: "SWAP Gate",
    category: "entangling",
    description: "Swaps the quantum states of two qubits",
    matrix: "4×4 Swap Unitary",
    multiQubit: true,
  },
  rzz: {
    name: "Ising ZZ Rotation",
    category: "entangling",
    description: "Two-qubit ZZ interaction by angle θ",
    matrix: "exp(-i θ/2 Z⊗Z)",
    multiQubit: true,
  },
};

const CATEGORY_STYLES: Record<
  GateCategory,
  {
    title: string;
    border: string;
    activeBg: string;
    hoverBg: string;
  }
> = {
  superposition: {
    title: "Superposition",
    border: "border-cyan-500/40",
    activeBg: "bg-cyan-500/20 border-cyan-500 text-cyan-600 dark:text-cyan-300 font-bold",
    hoverBg: "hover:border-cyan-500/60 hover:bg-cyan-500/10",
  },
  pauli: {
    title: "Pauli Flips",
    border: "border-amber-500/40",
    activeBg: "bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-300 font-bold",
    hoverBg: "hover:border-amber-500/60 hover:bg-amber-500/10",
  },
  rotation: {
    title: "Phase & Rotations",
    border: "border-violet-500/40",
    activeBg: "bg-violet-500/20 border-violet-500 text-violet-600 dark:text-violet-300 font-bold",
    hoverBg: "hover:border-violet-500/60 hover:bg-violet-500/10",
  },
  entangling: {
    title: "Multi-Qubit (2Q)",
    border: "border-emerald-500/40",
    activeBg: "bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-300 font-bold",
    hoverBg: "hover:border-emerald-500/60 hover:bg-emerald-500/10",
  },
};

const CATEGORY_GATES: Record<GateCategory, Gate[]> = {
  superposition: ["h"],
  pauli: ["x", "y", "z"],
  rotation: ["s", "t", "rx", "ry", "rz"],
  entangling: ["cx", "cz", "swap", "rzz"],
};

const ANGLE_PRESETS = [
  { label: "π/4", value: (Math.PI / 4).toString() },
  { label: "π/2", value: (Math.PI / 2).toString() },
  { label: "π", value: Math.PI.toString() },
  { label: "2π", value: (2 * Math.PI).toString() },
];

function GateButton({
  gate,
  selected,
  onClick,
}: {
  gate: Gate;
  selected: boolean;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: gate,
  });
  const spec = GATE_INFO[gate];
  const cat = CATEGORY_STYLES[spec.category];
  const activeClass = selected
    ? `${cat.activeBg} ring-2 ring-primary/40`
    : `bg-card border border-border/80 ${cat.hoverBg} text-foreground`;

  return (
    <Button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onClick}
      variant="ghost"
      title={`${spec.name}: ${spec.description}`}
      className={`touch-none h-9 px-3 font-mono font-medium rounded-md transition-all duration-150 ${activeClass} ${isDragging ? "opacity-40" : ""}`}
      aria-label={`Select or drag ${gate.toUpperCase()} gate`}
    >
      <span>{gate.toUpperCase()}</span>
      {spec.multiQubit && (
        <span className="ml-1 text-[9px] opacity-70">2Q</span>
      )}
      {isRotation(gate) && (
        <span className="ml-0.5 text-[9px] opacity-70">θ</span>
      )}
    </Button>
  );
}

function Cell({
  row,
  column,
  operation,
  onClick,
}: {
  row: number;
  column: number;
  operation?: Operation;
  onClick: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${row}:${column}`,
    data: { row, column },
  });
  const here =
    operation && operation.targets.includes(row) ? operation : undefined;
  const drag = useDraggable({
    id: `operation:${column}:${row}`,
    disabled: !here || here.targets[0] !== row,
    data: { column, gate: here?.gate },
  });

  const isControl = here && here.targets[0] === row && ["cx", "cz"].includes(here.gate);
  const label = here
    ? isControl
      ? "●"
      : here.gate.toUpperCase()
    : "─";

  const spec = here ? GATE_INFO[here.gate] : undefined;
  const cat = spec ? CATEGORY_STYLES[spec.category] : undefined;

  let cellClass = "m-1 min-w-14 rounded-md font-mono transition-all duration-200 ";
  if (isOver) cellClass += "ring-2 ring-primary ";

  if (!here) {
    cellClass += "text-muted-foreground/30 hover:bg-muted/40 hover:text-foreground";
  } else if (isControl) {
    cellClass += "bg-emerald-500/20 text-emerald-500 border border-emerald-500/60 font-bold shadow-sm";
  } else if (cat) {
    cellClass += `${cat.activeBg} border shadow-sm`;
  } else {
    cellClass += "bg-secondary text-secondary-foreground";
  }

  return (
    <Button
      ref={(node) => {
        setNodeRef(node);
        drag.setNodeRef(node);
      }}
      {...(here?.targets[0] === row ? drag.attributes : {})}
      {...(here?.targets[0] === row ? drag.listeners : {})}
      variant="ghost"
      onClick={onClick}
      className={cellClass}
      aria-label={`q${row}, step ${column + 1}${here ? `, ${here.gate.toUpperCase()}` : ", empty"}`}
    >
      {label}
    </Button>
  );
}

export function CircuitEditor({
  circuit,
  onChange,
}: {
  circuit: Circuit;
  onChange: (c: Circuit) => void;
}) {
  const [gate, setGate] = useState<Gate>("h");
  const [angle, setAngle] = useState("1.5707963267948966");
  const [pending, setPending] = useState<{
    gate: Gate;
    row: number;
    column: number;
  } | null>(null);
  const [message, setMessage] = useState("");
  const [dragLabel, setDragLabel] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );
  function place(selected: Gate, row: number, column: number) {
    const chosen = pending?.gate || selected;
    if (isPair(chosen) && circuit.qubits < 2) {
      setMessage("This gate needs at least two qubits.");
      return;
    }
    if (
      circuit.operations.length >= 48 &&
      column >= circuit.operations.length
    ) {
      setMessage("This demo supports at most 48 gates.");
      return;
    }
    if (
      isRotation(chosen) &&
      (!angle.trim() ||
        !Number.isFinite(Number(angle)) ||
        Math.abs(Number(angle)) > 100)
    ) {
      setMessage("Enter a finite angle between -100 and 100 radians.");
      return;
    }
    if (isPair(selected) && !pending) {
      setPending({ gate: selected, row, column });
      setMessage(
        `Now select another wire for ${selected.toUpperCase()}. First wire is the control for CX/CZ.`,
      );
      return;
    }
    if (pending && pending.row === row) {
      setMessage("Select a different wire for the second target.");
      return;
    }
    const op: Operation = {
      gate: pending?.gate || selected,
      targets: pending ? [pending.row, row] : [row],
      ...(isRotation(pending?.gate || selected)
        ? { angle: Number(angle) }
        : {}),
    };
    const operations = [...circuit.operations];
    operations.splice(
      pending?.column ?? column,
      (pending?.column ?? column) < operations.length ? 1 : 0,
      op,
    );
    onChange({ ...circuit, operations });
    setPending(null);
    setMessage("");
  }
  function dropped(event: DragEndEvent) {
    setDragLabel(null);
    if (event.over?.data.current) {
      const { row, column } = event.over.data.current;
      if (String(event.active.id).startsWith("operation:")) {
        const from = event.active.data.current!.column as number;
        const operations = [...circuit.operations];
        const [operation] = operations.splice(from, 1);
        operations.splice(Math.min(column, operations.length), 0, operation);
        onChange({ ...circuit, operations });
        setPending(null);
        return;
      }
      place(event.active.id as Gate, row, column);
    }
  }
  return (
    <div className="space-y-4">
      <DndContext id="quantlearn-circuit-editor" sensors={sensors} onDragEnd={dropped} onDragStart={event => setDragLabel(String(event.active.data.current?.gate || event.active.id).toUpperCase())} onDragCancel={() => setDragLabel(null)}>
        <DragOverlay>
          {dragLabel && (
            <div className="rounded-xl border border-primary bg-card px-4 py-2 text-sm font-medium text-primary shadow-lg">
              {dragLabel}
            </div>
          )}
        </DragOverlay>
        {/* IBM Quantum Composer-style Categorized Gate Palette */}
        <div className="space-y-3 rounded-xl border border-border/80 bg-card/60 p-3.5 backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Quantum Gate Palette (IBM Composer Standard)
            </span>
            <span className="text-[11px] text-muted-foreground/80">
              Drag to wire or click to place
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(Object.keys(CATEGORY_GATES) as GateCategory[]).map((catKey) => {
              const cat = CATEGORY_STYLES[catKey];
              const catGates = CATEGORY_GATES[catKey];
              return (
                <div
                  key={catKey}
                  className={`rounded-lg border ${cat.border} bg-background/50 p-2.5 flex flex-col justify-between`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground/90">
                      {cat.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {catGates.length} {catGates.length === 1 ? "gate" : "gates"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {catGates.map((g) => (
                      <GateButton
                        key={g}
                        gate={g}
                        selected={gate === g}
                        onClick={() => {
                          setGate(g);
                          setPending(null);
                          setMessage("");
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Gate Inspection & Parameter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 p-2.5 text-xs">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-semibold text-foreground">
                Selected: <span className="font-mono text-primary font-bold">{gate.toUpperCase()}</span> ({GATE_INFO[gate]?.name})
              </span>
              <span className="text-muted-foreground hidden md:inline">•</span>
              <span className="text-muted-foreground hidden md:inline">
                {GATE_INFO[gate]?.description}
              </span>
              <span className="font-mono text-[11px] bg-background/80 px-2 py-0.5 rounded border border-border/60 text-muted-foreground">
                U = {GATE_INFO[gate]?.matrix}
              </span>
            </div>

            {(isRotation(gate) || gate === "rzz") && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium">θ presets:</span>
                <div className="flex gap-1">
                  {ANGLE_PRESETS.map((p) => (
                    <Button
                      key={p.label}
                      type="button"
                      size="sm"
                      variant={angle === p.value ? "default" : "outline"}
                      className="h-6 px-2 text-xs font-mono"
                      onClick={() => setAngle(p.value)}
                    >
                      {p.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label htmlFor="angle" className="text-xs">Rotation angle θ (radians)</Label>
            <Input
              id="angle"
              type="number"
              step="any"
              min={-100}
              max={100}
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              className="w-48 h-8 text-xs font-mono"
            />
          </div>
          {pending && (
            <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary">
              <span>
                Target wire required for <strong>{pending.gate.toUpperCase()}</strong> (control: q{pending.row})
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-[11px] border-primary/40 hover:bg-primary/20"
                onClick={() => {
                  setPending(null);
                  setMessage("");
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Drag a gate onto a wire, or select a gate and click a cell. Two-qubit
          gates need a second wire. Each column is one operation; placing on an
          occupied column replaces it. Drag an existing gate to change its order.
        </p>
        <p className="text-sm text-primary" role="status">
          {message}
        </p>
        <div className="overflow-x-auto rounded-xl border border-border/70 bg-card p-3">
          {Array.from({ length: circuit.qubits }, (_, row) => (
            <div key={row} className="flex w-max items-center">
              <span className="w-14 font-mono text-sm">q{row} |0⟩</span>
              {Array.from(
                { length: circuit.operations.length + 1 },
                (_, column) => (
                  <Cell
                    key={column}
                    row={row}
                    column={column}
                    operation={circuit.operations[column]}
                    onClick={() => place(gate, row, column)}
                  />
                ),
              )}
            </div>
          ))}
        </div>
      </DndContext>
      {circuit.operations.length > 0 && (
        <ol className="flex flex-wrap gap-2">
          {circuit.operations.map((op, i) => (
            <li key={i}>
              <Button
                size="sm"
                variant="outline"
                aria-label={`Remove step ${i + 1}: ${op.gate}`}
                onClick={() => {
                  setPending(null);
                  setMessage("");
                  onChange({
                    ...circuit,
                    operations: circuit.operations.filter((_, n) => n !== i),
                  });
                }}
              >
                {i + 1}. {op.gate.toUpperCase()}({op.targets.join(",")})
                {op.angle !== undefined ? ` ${op.angle.toFixed(3)}` : ""} ×
              </Button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
