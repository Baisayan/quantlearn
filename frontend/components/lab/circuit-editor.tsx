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
  return (
    <Button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onClick}
      variant={selected ? "default" : "outline"}
      className={`touch-none rounded-md ${isDragging ? "opacity-40" : ""}`}
      aria-label={`Select or drag ${gate.toUpperCase()} gate`}
    >
      {gate.toUpperCase()}
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
  const drag = useDraggable({ id: `operation:${column}:${row}`, disabled: !here || here.targets[0] !== row, data: { column, gate: here?.gate } });
  const label = here
    ? here.targets[0] === row && ["cx", "cz"].includes(here.gate)
      ? "●"
      : here.gate.toUpperCase()
    : "─";
  return (
    <Button
      ref={node => { setNodeRef(node); drag.setNodeRef(node); }}
      {...(here?.targets[0] === row ? drag.attributes : {})}
      {...(here?.targets[0] === row ? drag.listeners : {})}
      variant={here ? "secondary" : "ghost"}
      onClick={onClick}
      className={`m-1 min-w-14 rounded-md font-mono ${isOver ? "ring-2 ring-primary" : ""}`}
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
      <DndContext sensors={sensors} onDragEnd={dropped} onDragStart={event => setDragLabel(String(event.active.data.current?.gate || event.active.id).toUpperCase())} onDragCancel={() => setDragLabel(null)}>
        <DragOverlay>
          {dragLabel && (
            <div className="rounded-xl border border-primary bg-card px-4 py-2 text-sm font-medium text-primary shadow-lg">
              {dragLabel}
            </div>
          )}
        </DragOverlay>
        <div className="flex flex-wrap gap-2">
          {gates.map((g) => (
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
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label htmlFor="angle">Rotation angle (radians)</Label>
            <Input
              id="angle"
              type="number"
              step="any"
              min={-100}
              max={100}
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              className="w-48"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setPending(null);
              setMessage("");
            }}
          >
            Cancel selection
          </Button>
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
