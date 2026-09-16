export type Engine = "aer" | "cirq" | "pennylane";
export const gates = [
  "h",
  "x",
  "y",
  "z",
  "s",
  "t",
  "rx",
  "ry",
  "rz",
  "cx",
  "cz",
  "swap",
  "rzz",
] as const;
export type Gate = (typeof gates)[number];
export type Operation = { gate: Gate; targets: number[]; angle?: number };
export type Circuit = { qubits: number; operations: Operation[] };
export type Result = {
  engine: Engine;
  shots: number;
  circuit: Circuit;
  counts: Record<string, number>;
  statevector: {
    basis: string;
    real: number;
    imag: number;
    probability: number;
  }[];
  bloch: { qubit: number; x: number; y: number; z: number }[];
  energy: number | null;
  cutScore: number | null;
  assessment?: {
    passed: boolean;
    score: number;
    feedback: string;
    challengeId: string;
  };
};
export const isPair = (gate: Gate) =>
  ["cx", "cz", "swap", "rzz"].includes(gate);
export const isRotation = (gate: Gate) =>
  ["rx", "ry", "rz", "rzz"].includes(gate);

export function toCode(circuit: Circuit, engine: Engine) {
  if (engine === "aer")
    return [
      "from qiskit import QuantumCircuit",
      "from math import pi",
      `circuit = QuantumCircuit(${circuit.qubits})`,
      ...circuit.operations.map(
        (op) =>
          `circuit.${op.gate}(${[...(op.angle === undefined ? [] : [op.angle]), ...op.targets].join(", ")})`,
      ),
    ].join("\n");
  if (engine === "cirq") {
    const names: Record<string, string> = { cx: "CNOT", cz: "CZ", swap: "SWAP" };
    const line = (op: Operation) =>
      `circuit.append(cirq.${op.angle === undefined ? names[op.gate] || op.gate.toUpperCase() : `${op.gate}(${op.angle})`}(${op.targets.map((q) => `qubits[${q}]`).join(", ")}))`;
    return [
      "import cirq",
      "from math import pi",
      `qubits = cirq.LineQubit.range(${circuit.qubits})`,
      "circuit = cirq.Circuit()",
      ...circuit.operations.flatMap((op) =>
        op.gate === "rzz"
          ? [
              line({ gate: "cx", targets: op.targets }),
              line({ gate: "rz", targets: [op.targets[1]], angle: op.angle }),
              line({ gate: "cx", targets: op.targets }),
            ]
          : [line(op)],
      ),
    ].join("\n");
  }
  const names: Record<string, string> = {
    h: "Hadamard",
    x: "PauliX",
    y: "PauliY",
    z: "PauliZ",
    s: "S",
    t: "T",
    rx: "RX",
    ry: "RY",
    rz: "RZ",
    cx: "CNOT",
    cz: "CZ",
    swap: "SWAP",
    rzz: "IsingZZ",
  };
  return [
    "import pennylane as qml",
    "from math import pi",
    `dev = qml.device("default.qubit", wires=${circuit.qubits})`,
    "@qml.qnode(dev)",
    "def circuit():",
    ...circuit.operations.map(
      (op) =>
        `    qml.${names[op.gate]}(${op.angle === undefined ? "" : `${op.angle}, `}wires=${JSON.stringify(op.targets.length === 1 ? op.targets[0] : op.targets)})`,
    ),
    "    return qml.state()",
  ].join("\n");
}
