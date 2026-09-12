// Small offline reference calculation for authored figures, never imported by the app.
import assert from "node:assert/strict";

const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const scale = (a, k) => [a[0] * k, a[1] * k];
const phase = (theta) => [Math.cos(theta), Math.sin(theta)];
const abs2 = (a) => a[0] ** 2 + a[1] ** 2;
const conjugate = ([r, i]) => [r, -i];
export const near = (a, b, message = "numerical mismatch") => assert.ok(Math.abs(a - b) < 1e-9, message + ": " + a + " vs " + b);

export function simulate(qubits, operations, initial) {
  let state = initial?.map((v) => [...v]) ?? Array.from({ length: 2 ** qubits }, (_, i) => [Number(i === 0), 0]);
  for (const { gate, targets, angle = 0 } of operations) {
    const [q, t] = targets;
    const mask = 1 << q;
    const next = state.map((v) => [...v]);
    if (gate === "cx" || gate === "cz" || gate === "rzz") {
      const other = 1 << t;
      state.forEach((v, i) => {
        if (gate === "cx") next[i & mask ? i ^ other : i] = [...v];
        if (gate === "cz" && (i & mask) && (i & other)) next[i] = scale(v, -1);
        if (gate === "rzz") next[i] = mul(v, phase(((!!(i & mask)) === (!!(i & other)) ? -1 : 1) * angle / 2));
      });
    } else {
      const c = Math.cos(angle / 2), s = Math.sin(angle / 2), h = Math.SQRT1_2;
      const matrices = {
        h: [[[h, 0], [h, 0]], [[h, 0], [-h, 0]]],
        x: [[[0, 0], [1, 0]], [[1, 0], [0, 0]]],
        y: [[[0, 0], [0, -1]], [[0, 1], [0, 0]]],
        z: [[[1, 0], [0, 0]], [[0, 0], [-1, 0]]],
        s: [[[1, 0], [0, 0]], [[0, 0], [0, 1]]],
        t: [[[1, 0], [0, 0]], [[0, 0], phase(Math.PI / 4)]],
        rx: [[[c, 0], [0, -s]], [[0, -s], [c, 0]]],
        ry: [[[c, 0], [-s, 0]], [[s, 0], [c, 0]]],
        rz: [[phase(-angle / 2), [0, 0]], [[0, 0], phase(angle / 2)]],
      };
      const matrix = matrices[gate];
      assert.ok(matrix, "Unknown gate: " + gate);
      for (let i = 0; i < state.length; i++) {
        if (i & mask) continue;
        const j = i | mask;
        next[i] = add(mul(matrix[0][0], state[i]), mul(matrix[0][1], state[j]));
        next[j] = add(mul(matrix[1][0], state[i]), mul(matrix[1][1], state[j]));
      }
    }
    state = next;
  }
  const probabilities = state.map(abs2);
  near(probabilities.reduce((a, b) => a + b, 0), 1, "State must be normalized");
  return { state, probabilities };
}

export function verifyPhysics(circuits) {
  const results = Object.fromEntries(circuits.map((c) => {
    const r = simulate(c.qubits, c.operations);
    r.probabilities.forEach((p, i) => near(p, c.probabilities[i], c.id + " outcome " + i));
    return [c.id, r];
  }));
  near(results.grover.state[3][0], -1, "Decomposed Grover diffusion has a global minus sign");

  // Independent analytic predictions across angles, not only the illustrated optimum.
  for (const theta of [0, .2, .7, 1.9, Math.PI, Math.PI + Math.atan(.5), 5.9]) {
    const z = simulate(1, [{ gate: "ry", targets: [0], angle: theta }]);
    const x = simulate(1, [{ gate: "ry", targets: [0], angle: theta }, { gate: "h", targets: [0] }]);
    const energy = z.probabilities[0] - z.probabilities[1] + .5 * (x.probabilities[0] - x.probabilities[1]);
    near(energy, Math.cos(theta) + .5 * Math.sin(theta), "VQE analytic energy");
  }
  for (const gamma of [-Math.PI / 2, -1, 0, .3, Math.PI / 2]) {
    for (const beta of [-.2, 0, Math.PI / 8, .8]) {
      const r = simulate(2, [
        { gate: "h", targets: [0] }, { gate: "h", targets: [1] },
        { gate: "rzz", targets: [0, 1], angle: -gamma },
        { gate: "rx", targets: [0], angle: 2 * beta }, { gate: "rx", targets: [1], angle: 2 * beta },
      ]);
      near(r.probabilities[1] + r.probabilities[2], .5 + .5 * Math.sin(4 * beta) * Math.sin(gamma), "QAOA sign convention");
    }
  }
  // Verify every teleportation branch for several inputs, including complex phase.
  for (const input of [[[1, 0], [0, 0]], [[0, 0], [1, 0]], [[Math.SQRT1_2, 0], [Math.SQRT1_2, 0]], [[Math.sqrt(3) / 2, 0], [0, .5]]]) {
    const initial = Array.from({ length: 8 }, (_, i) => i < 2 ? input[i] : [0, 0]);
    const r = simulate(3, [
      { gate: "h", targets: [1] }, { gate: "cx", targets: [1, 2] },
      { gate: "cx", targets: [0, 1] }, { gate: "h", targets: [0] },
    ], initial);
    for (let m0 = 0; m0 <= 1; m0++) for (let m1 = 0; m1 <= 1; m1++) {
      const base = m0 + 2 * m1;
      const branch = [r.state[base], r.state[base + 4]];
      near(branch.map(abs2).reduce((a, b) => a + b, 0), .25, "Teleportation branch probability");
      const corrections = [];
      if (m1) corrections.push({ gate: "x", targets: [0] });
      if (m0) corrections.push({ gate: "z", targets: [0] });
      const recovered = simulate(1, corrections, branch.map((v) => scale(v, 2))).state;
      const overlap = add(mul(conjugate(input[0]), recovered[0]), mul(conjugate(input[1]), recovered[1]));
      near(abs2(overlap), 1, "Teleportation fidelity");
    }
  }
  // A classical 00/11 mixture under HH has uniform probabilities, unlike Bell.
  const hh = [{ gate: "h", targets: [0] }, { gate: "h", targets: [1] }];
  const a = simulate(2, hh).probabilities;
  const b = simulate(2, hh, [[0, 0], [0, 0], [0, 0], [1, 0]]).probabilities;
  a.forEach((p, i) => near(.5 * (p + b[i]), .25, "Classical mixture XX probability"));
  // Single-qubit partial trace of Bell: diagonal 1/2, off-diagonal zero.
  const bell = results.bell.state;
  near(abs2(bell[0]) + abs2(bell[2]), .5);
  const offDiagonal = add(mul(bell[0], conjugate(bell[1])), mul(bell[2], conjugate(bell[3])));
  near(abs2(offDiagonal), 0, "Reduced Bell coherence");
  // Additional worked calculations used by the expanded chapter assessments.
  near(abs2([0, .5]), .25, "Imaginary amplitude probability");
  near((3 / 5) ** 2 + (4 / 5) ** 2, 1, "Normalization example");
  near((.5 * Math.SQRT1_2) ** 2, 1 / 8, "Product-state P(10)");
  near(Math.sqrt(.75 * .25 / 400) / Math.sqrt(.75 * .25 / 100), .5, "Shot uncertainty scaling");
  near((80 - 20) / 100 + .5 * (60 - 40) / 100, .7, "Sampled VQE arithmetic");
  near((35 + 45) / 100, .8, "Sampled cut arithmetic");
  const grover = circuits.find((c) => c.id === "grover");
  const twice = simulate(2, [...grover.operations, ...grover.operations.slice(2)]);
  near(twice.probabilities[3], .25, "Second Grover iteration overshoots");
  const noFlip = simulate(1, [{ gate: "h", targets: [0] }, { gate: "h", targets: [0] }]);
  const flipped = simulate(1, [{ gate: "h", targets: [0] }, { gate: "z", targets: [0] }, { gate: "h", targets: [0] }]);
  for (const p of [0, .25, .5, 1]) {
    near((1 - p) * noFlip.probabilities[1] + p * flipped.probabilities[1], p, "Phase-flip ensemble P(1)");
    near(.5 + .5 * (1 - 2 * p) ** 2, (1 - p) ** 2 + p ** 2, "Phase-flip purity");
  }
  return results;
}
