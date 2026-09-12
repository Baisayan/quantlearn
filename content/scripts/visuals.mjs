// Original SVG teaching figures. Geometry is local to each scalable viewBox.
const ink = "#221536", accent = "#7c3aed", pale = "#ede9fe", muted = "#62556f";
const escape = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const text = (x, y, value, size = 21, fill = ink, anchor = "start") => '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + fill + '" text-anchor="' + anchor + '">' + escape(value) + '</text>';
const line = (x1, y1, x2, y2, color = muted, extra = "") => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + color + '" stroke-width="2" ' + extra + '/>';
const rect = (x, y, w, h, fill = pale) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="' + fill + '" stroke="' + accent + '"/>';
const wrap = (value, width) => {
  const words = String(value).split(/\s+/), lines = [""];
  for (const word of words) {
    const last = lines.length - 1;
    if (lines[last] && (lines[last] + " " + word).length > width) lines.push(word);
    else lines[last] += (lines[last] ? " " : "") + word;
  }
  return lines;
};
const paragraph = (x, y, value, width = 88, size = 20) => wrap(value, width).map((s, i) => text(x, y + i * (size + 8), s, size, muted)).join("");
const frame = (id, title, desc, content, height) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 ' + height + '" role="img" aria-labelledby="' + id + '-title ' + id + '-desc"><title id="' + id + '-title">' + escape(title) + '</title><desc id="' + id + '-desc">' + escape(desc) + '</desc><rect width="960" height="' + height + '" fill="#ffffff"/><g font-family="Arial, sans-serif">' + text(40, 46, title, 28) + paragraph(40, 80, desc, 90, 18) + content + '</g></svg>\n';

function table(headers, rows, startY = 128) {
  const cw = 880 / headers.length;
  let body = "", y = startY;
  for (const [ri, row] of [headers, ...rows].entries()) {
    const cells = row.map((s) => wrap(s, Math.floor((cw - 28) / 10)));
    const height = Math.max(...cells.map((s) => s.length)) * 27 + 24;
    body += '<rect x="40" y="' + y + '" width="880" height="' + height + '" fill="' + (ri === 0 ? pale : ri % 2 ? "#faf8ff" : "#fff") + '"/>';
    cells.forEach((cell, ci) => cell.forEach((s, li) => body += text(54 + ci * cw, y + 30 + li * 27, s, 19, ri === 0 ? accent : ink)));
    y += height;
    body += line(40, y, 920, y, "#ddd6e8");
  }
  return { body, height: y + 36 };
}

function bars(labels, series, { signed = false, counts = false, note = "" } = {}) {
  let body = "", yTop = 155, baseline = signed ? 320 : 370, scale = signed ? 160 : 210;
  const max = counts ? Math.max(...series.flatMap((s) => s.values), 1) : 1;
  const group = 800 / labels.length, width = Math.min(90, (group - 22) / series.length);
  const palette = [accent, "#c4b5fd", "#a78bfa"];
  series.forEach((s, k) => {
    body += '<rect x="' + (80 + k * 280) + '" y="116" width="18" height="18" fill="' + palette[k] + '"/>';
    body += text(106 + k * 280, 132, s.name, 18);
  });
  for (const tick of signed ? [-1, -.5, 0, .5, 1] : [0, .5, 1]) {
    const y = baseline - tick * scale;
    body += line(78, y, 905, y, tick === 0 ? muted : "#eee8f5");
    body += text(66, y + 6, counts ? Math.round(tick * max) : tick, 17, muted, "end");
  }
  labels.forEach((label, i) => {
    const mid = 95 + group * (i + .5);
    series.forEach((s, k) => {
      const value = s.values[i], h = Math.abs(value) / max * scale;
      const x = mid - width * series.length / 2 + k * width;
      body += '<rect x="' + x + '" y="' + (value >= 0 ? baseline - h : baseline) + '" width="' + (width - 4) + '" height="' + Math.max(.5, h) + '" fill="' + palette[k] + '"/>';
      const labelValue = counts ? value : Number(value.toFixed(3));
      body += text(x + (width - 4) / 2, value >= 0 ? baseline - h - 9 : baseline + h + 22, labelValue, 17, ink, "middle");
    });
    body += text(mid - 2, signed ? 520 : 410, label, 20, ink, "middle");
  });
  const y = signed ? 556 : 451;
  body += paragraph(40, y, note, 88, 18);
  return { body, height: y + 64, data: { labels, series, signed, counts, note } };
}

function circuit(fixture, note, measure = [...Array(fixture.qubits).keys()]) {
  const end = Array(fixture.qubits).fill(-1);
  const scheduled = fixture.operations.map((op) => {
    const lo = Math.min(...op.targets), hi = Math.max(...op.targets);
    const layer = Math.max(...end.slice(lo, hi + 1)) + 1;
    for (let q = lo; q <= hi; q++) end[q] = layer;
    return { ...op, layer };
  });
  const layers = Math.max(...end) + 2, step = Math.min(115, 740 / Math.max(layers, 1));
  const wireY = (q) => 175 + q * 85;
  let body = "";
  for (let q = 0; q < fixture.qubits; q++) {
    body += text(40, wireY(q) + 7, "q" + q + ": |0>", 20);
    body += line(135, wireY(q), 905, wireY(q));
  }
  for (const op of scheduled) {
    const x = 175 + op.layer * step, [q, t] = op.targets, y = wireY(q);
    if (op.gate === "cx" || op.gate === "cz") {
      body += line(x, y, x, wireY(t), accent);
      body += '<circle cx="' + x + '" cy="' + y + '" r="6" fill="' + accent + '"/>';
      if (op.gate === "cx") body += '<circle cx="' + x + '" cy="' + wireY(t) + '" r="17" fill="#fff" stroke="' + accent + '" stroke-width="2"/>' + line(x - 12, wireY(t), x + 12, wireY(t), accent) + line(x, wireY(t) - 12, x, wireY(t) + 12, accent);
      else body += '<circle cx="' + x + '" cy="' + wireY(t) + '" r="6" fill="' + accent + '"/>';
    } else if (op.gate === "rzz") {
      body += rect(x - 42, y - 23, 84, wireY(t) - y + 46) + text(x, (y + wireY(t)) / 2 - 4, "RZZ", 18, accent, "middle") + text(x, (y + wireY(t)) / 2 + 24, "-π/2", 18, accent, "middle");
    } else {
      const label = op.gate.toUpperCase();
      body += rect(x - 23, y - 23, 46, 46) + text(x, y + 7, label, 18, accent, "middle");
      if (op.angle !== undefined) body += text(x, y + 46, Math.abs(op.angle - Math.PI / 4) < 1e-9 ? "π/4" : op.angle.toFixed(2), 16, muted, "middle");
    }
  }
  measure.forEach((q) => {
    const x = 175 + (layers - 1) * step;
    body += rect(x - 21, wireY(q) - 21, 42, 42, "#fff") + text(x, wireY(q) + 7, "M", 18, ink, "middle");
  });
  const y = wireY(fixture.qubits - 1) + 90;
  body += paragraph(40, y, note, 88, 18);
  return { body, height: y + 80, data: { fixtureId: fixture.id, measurements: measure, note } };
}

function curve(fn, yMin, yMax, yLabel, extra = "") {
  const x = (theta) => 105 + theta / (2 * Math.PI) * 760;
  const y = (value) => 420 - (value - yMin) / (yMax - yMin) * 240;
  const points = Array.from({ length: 129 }, (_, i) => [i * 2 * Math.PI / 128, fn(i * 2 * Math.PI / 128)]);
  let body = text(45, 137, yLabel, 19, muted);
  for (const tick of [yMin, (yMin + yMax) / 2, yMax]) {
    body += line(105, y(tick), 865, y(tick), "#e5dfee") + text(90, y(tick) + 6, tick.toFixed(2), 17, muted, "end");
  }
  for (let i = 0; i < 5; i++) body += text(x(i * Math.PI / 2), 455, ["0", "π/2", "π", "3π/2", "2π"][i], 20, ink, "middle");
  body += '<polyline fill="none" stroke="' + accent + '" stroke-width="4" points="' + points.map(([a, b]) => x(a) + "," + y(b)).join(" ") + '"/>';
  body += text(475, 493, "θ (radians)", 21, ink, "middle") + extra;
  return { body, height: 550, data: { points, xLabel: "theta (radians)", yLabel } };
}

export function buildVisuals(circuits, results) {
  const figures = [];
  const byId = Object.fromEntries(circuits.map((c) => [c.id, c]));
  const add = (id, title, description, kind, figure) => figures.push({ id, title, description, kind, data: figure.data ?? null, svg: frame(id, title, description, figure.body, figure.height) });
  const addTable = (id, title, description, headers, rows) => add(id, title, description, "table", { ...table(headers, rows), data: { headers, rows } });
  const addCircuit = (id, title, description, fixtureId, note, measure) => add(id, title, description, "circuit", circuit(byId[fixtureId], note, measure));

  // Orthographic projection with orthonormal screen rows; every sphere point
  // projects within the silhouette. The equator projects to a 150 by 75 ellipse.
  const project = ([x, y, z]) => [295 + 150 * (-.5 * x + Math.sqrt(3) / 2 * y), 315 + 150 * (-Math.sqrt(3) / 4 * x - .25 * y - Math.sqrt(3) / 2 * z)];
  let sphere = '<circle cx="295" cy="315" r="150" fill="#faf8ff" stroke="#c4b5fd" stroke-width="2"/><ellipse cx="295" cy="315" rx="150" ry="75" fill="none" stroke="#c4b5fd"/>';
  for (const axis of [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) {
    const [ax, ay] = project(axis), [bx, by] = project(axis.map((n) => -n));
    sphere += line(bx, by, ax, ay);
  }
  sphere += text(295, 170, "|0>  +Z", 20, ink, "middle") + text(295, 478, "|1>  −Z", 20, ink, "middle") + text(185, 247, "+X", 20) + text(432, 282, "+Y", 20);
  const [ex, ey] = project([0, Math.sqrt(3) / 2, .5]);
  sphere += line(295, 315, ex, ey, accent, 'marker-end="url(#arrow)"') + '<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="' + accent + '"/></marker></defs>';
  sphere += text(550, 205, "θ = π/3; φ = π/2", 24, accent) + text(550, 252, "Bloch vector:", 22) + text(550, 288, "(0, √3/2, 1/2)", 24) + text(550, 350, "P(0) = 3/4", 24) + text(550, 389, "P(1) = 1/4", 24) + paragraph(540, 450, "Projected sphere; the arrow is a state, not a spatial orbit.", 30, 18);
  add("qubit-state", "A single pure qubit", "One original complex-amplitude example, shown on a projected Bloch sphere.", "bloch", { body: sphere, height: 560, data: { theta: Math.PI / 3, phi: Math.PI / 2, vector: [0, Math.sqrt(3) / 2, .5], amplitudes: [[Math.sqrt(3) / 2, 0], [0, .5]] } });
  addTable("statevector", "Statevector → measurement probabilities", "Basis order and complex phase are explicit; amplitudes are not probabilities.", ["Basis", "Amplitude", "Squared magnitude"], [["|0>", "√3/2", "3/4 = 0.75"], ["|1>", "i/2", "1/4 = 0.25"], ["Total", "Norm squared", "1"]]);
  addTable("phase-comparison", "Same probabilities, different phase", "All entries refer to the Z basis before any analyzing gate.", ["State", "Amplitudes [0, 1]", "P(0), P(1)"], [["Plus", "[1/√2, 1/√2]", "1/2, 1/2"], ["Minus", "[1/√2, −1/√2]", "1/2, 1/2"], ["i × Plus", "[i/√2, i/√2]", "1/2, 1/2; global phase only"]]);
  addTable("interference", "Interference paths", "Time runs left to right. The final Hadamard reveals a relative-phase difference.", ["Circuit from |0>", "State before final H", "Final Z outcome"], [["|0> → H → H → M", "Plus", "0 with probability 1"], ["|0> → H → Z → H → M", "Minus", "1 with probability 1"]]);

  // Reproducible synthetic Bernoulli shots, not counts copied from hardware.
  let seed = 42;
  const sample = (n) => {
    let zero = 0;
    for (let i = 0; i < n; i++) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; if (seed / 2 ** 32 < .75) zero++; }
    return [zero, n - zero];
  };
  const small = sample(16), large = sample(1024);
  add("measurement", "Exact probabilities and finite samples", "Fixed-seed synthetic samples illustrate sampling variation, not device noise.", "histogram", bars(["0", "1"], [{ name: "Exact probability", values: [.75, .25] }, { name: "16 shots / 16", values: small.map((x) => x / 16) }, { name: "1024 shots / 1024", values: large.map((x) => x / 1024) }], { note: "Actual synthetic counts: 16 shots = [" + small + "]; 1024 shots = [" + large + "]. Bar height is relative frequency." }));
  addTable("measurement-bases", "The analyzer selects the basis", "M denotes a Z-basis detector. A fresh state is prepared for each shot.", ["Original state", "Measurement circuit", "P(bit 0), P(bit 1)"], [["Plus", "State → M  (Z)", "1/2, 1/2"], ["Plus", "State → H → M  (X)", "1, 0"], ["Minus", "State → H → M  (X)", "0, 1"], ["Recorded eigenvalue", "bit 0 → +1; bit 1 → −1", "Average = (n0 − n1) / N"]]);
  addTable("gate-reference", "Single-qubit gate reference", "Images of basis vectors define each linear operation, including its phases.", ["Gate", "Acts on |0>", "Acts on |1>"], [["I", "|0>", "|1>"], ["X", "|1>", "|0>"], ["Y", "i|1>", "−i|0>"], ["Z", "|0>", "−|1>"], ["H", "(|0> + |1>)/√2", "(|0> − |1>)/√2"]]);
  addTable("gate-order", "Gate order can change the answer", "The last H is an X-basis analyzer for the state produced by the first two gates.", ["Read left → right", "Before analyzer", "Final outcome"], [["|0> → X → H → H → M", "Minus", "1"], ["|0> → H → X → H → M", "Plus", "0"]]);
  add("rotation-curve", "Ry rotation changes probabilities", "Exact calculation: Ry(θ)|0> gives P(1) = sin²(θ/2).", "curve", curve((theta) => Math.sin(theta / 2) ** 2, 0, 1, "P(1)"));
  addTable("phase-gates", "Phase becomes visible through interference", "The initial and final H gates turn phase-gate differences into Z probabilities.", ["Circuit", "Relative phase", "P(0), P(1)"], [["|0> → H → S → H → M", "π/2", "0.5, 0.5"], ["|0> → H → T → H → M", "π/4", "0.853553, 0.146447"], ["|0> → H → Z → H → M", "π", "0, 1"]]);
  addCircuit("multi-qubit", "A controlled X on a basis state", "q0 is the top wire. Bitstrings are written q1q0.", "basis-cx", "After X(q0): |01>. After CX(q0,q1): |11>. This input does not become entangled.");
  addCircuit("bit-order", "Top wire does not mean leftmost bit", "An asymmetric example exposes accidental bit reversal.", "asymmetric", "Expected basis order: 00, 01, 10, 11. Statevector: [0, 1, 0, 0]. Outcome: 01.");
  addCircuit("bell-circuit", "Preparing a Bell pair", "H creates two branches; CX correlates the target with the control.", "bell", "Before measurement: (|00> + |11>)/√2. Exact probabilities: [1/2, 0, 0, 1/2].");
  add("bell-correlations", "Bell coherence versus a classical mixture", "ZZ alone cannot distinguish these two states. XX uses H on both wires before measurement.", "histogram", bars(["00", "01", "10", "11"], [{ name: "Bell: XX (and ZZ)", values: results["bell-xx"].probabilities }, { name: "Mixture: XX", values: [.25, .25, .25, .25] }, { name: "Mixture: ZZ", values: [.5, 0, 0, .5] }], { note: "The comparison distinguishes the stated examples; it is not a universal entanglement test." }));

  let tel = "";
  const ys = [175, 275, 375];
  ys.forEach((y, q) => tel += text(40, y + 7, q === 0 ? "q0: ψ" : "q" + q + ": |0>", 20) + line(132, y, q < 2 ? 630 : 915, y));
  const box = (x, q, label, w = 46) => rect(x - w / 2, ys[q] - 23, w, 46) + text(x, ys[q] + 7, label, 19, accent, "middle");
  const cx = (x, a, b) => line(x, ys[a], x, ys[b], accent) + '<circle cx="' + x + '" cy="' + ys[a] + '" r="6" fill="' + accent + '"/><circle cx="' + x + '" cy="' + ys[b] + '" r="16" fill="#fff" stroke="' + accent + '"/>' + line(x - 11, ys[b], x + 11, ys[b], accent) + line(x, ys[b] - 11, x, ys[b] + 11, accent);
  tel += box(190, 1, "H") + cx(275, 1, 2) + cx(380, 0, 1) + box(475, 0, "H") + box(580, 0, "M") + box(580, 1, "M") + box(725, 2, "X") + box(840, 2, "Z");
  tel += text(610, 164, "m0", 17) + text(610, 264, "m1", 17);
  tel += '<path d="M603 175 H840 V350 M603 275 H725 V350" fill="none" stroke="' + accent + '" stroke-width="2" stroke-dasharray="6 4"/>';
  tel += paragraph(40, 455, "Dashed links are classical: m1 controls X, then m0 controls Z. Alice holds q0 and q1; Bob holds q2. Bob recovers ψ after receiving both bits.", 87, 18);
  add("teleportation", "Teleportation with classical corrections", "Prepare q1/q2 as a Bell pair. q0 is the input and q2 is Bob's output.", "circuit", { body: tel, height: 550, data: { outcomeOrder: "m0m1", xCondition: "m1=1", zCondition: "m0=1", correctionTimeOrder: ["X", "Z"] } });
  addTable("teleportation-corrections", "Teleportation branch table", "The column heading defines outcome order m0m1; each ideal branch has probability 1/4.", ["m0m1", "Bob before correction", "Bob applies in time order"], [["00", "ψ", "I"], ["01", "Xψ", "X"], ["10", "Zψ", "Z"], ["11", "XZψ", "X, then Z"]]);
  addCircuit("dj-circuit", "Deutsch-Jozsa: balanced XOR oracle", "The two CX gates together implement one oracle call for f(q1,q0)=q1 XOR q0.", "dj-balanced", "q2 starts in |1> then H prepares |−>. Measure q1q0 only: the XOR instance returns 11.", [0, 1]);
  add("dj-results", "Deutsch-Jozsa input-register results", "Exact distributions after the final H gates. The helper qubit is marginalized out.", "histogram", bars(["00", "01", "10", "11"], [{ name: "Constant zero", values: [1, 0, 0, 0] }, { name: "Balanced XOR", values: [0, 0, 0, 1] }], { note: "Other balanced oracles need not return 11; the guarantee excludes only the all-zero result." }));
  addCircuit("grover-circuit", "Grover search with two qubits", "The first CZ marks 11. The remaining H-X-CZ-X-H block implements −D.", "grover", "Before measurement the amplitude of |11> is −1: a global-phase difference from mathematical D.");
  add("grover-amplitudes", "One mathematical Grover iteration", "Signed real amplitudes are shown, not probabilities. D reflects about the mean.", "amplitudes", bars(["00", "01", "10", "11"], [{ name: "Uniform", values: [.5, .5, .5, .5] }, { name: "After oracle", values: [.5, .5, .5, -.5] }, { name: "After D", values: [0, 0, 0, 1] }], { signed: true, note: "Mean after oracle = 1/4. Mathematical D maps each a to 2 × mean − a." }));
  addCircuit("qaoa-circuit", "QAOA: one edge, one layer", "Maximize C=(I−Z0Z1)/2 with γ=π/2 and β=π/8. Rotation labels are radians.", "qaoa", "Cost: RZZ(−γ), up to global phase. Mixer: RX(2β) on each qubit. P(01)=P(10)=1/2.");
  add("qaoa-cost", "Sampling cuts in the one-edge model", "Cut scores for [00,01,10,11] are [0,1,1,0]. Both figures are exact predictions.", "histogram", bars(["00", "01", "10", "11"], [{ name: "β = 0", values: [.25, .25, .25, .25] }, { name: "γ=π/2; β=π/8", values: results.qaoa.probabilities }], { note: "Average score improves from 1/2 to 1 for this toy instance. It is not a practical speedup claim." }));
  addTable("vqe-measurements", "Two measurement settings for one energy", "Prepare a fresh Ry(θ)|0> for each shot in each setting. M is a Z detector.", ["Term", "Read left → right", "Contribution to E"], [["Z", "|0> → Ry(θ) → M", "(n0 − n1) / N"], ["0.5 X", "|0> → Ry(θ) → H → M", "0.5 × (n0 − n1) / N"], ["Combined", "Separate preparations", "E = mean(Z) + 0.5 mean(X)"]]);
  const boundY = 420 - (-Math.sqrt(1.25) + 1.25) / 2.5 * 240;
  const bound = line(105, boundY, 865, boundY, muted, 'stroke-dasharray="7 5"') + text(505, 160, "Minimum = −√1.25 ≈ −1.118", 19, accent);
  add("vqe-energy", "A VQE energy with a known answer", "Exact parameter sweep for H=Z+0.5X and |ψ(θ)>=Ry(θ)|0>; not optimizer history.", "curve", curve((theta) => Math.cos(theta) + .5 * Math.sin(theta), -1.25, 1.25, "Energy expectation", bound));
  add("noise-comparison", "Noise changes the underlying distribution", "Prepare plus, apply a random Z with probability p, then H and Z measurement.", "histogram", bars(["0", "1"], [{ name: "Ideal: p = 0", values: [1, 0] }, { name: "Phase flip: p = 1/4", values: [.75, .25] }], { note: "These are exact channel predictions. Finite-shot fluctuations are a separate effect." }));
  addTable("result-panels", "Four views of the Bell experiment", "Each panel answers a different question. A local view cannot replace the joint state.", ["Panel", "Example content", "Interpretation"], [["Circuit", "H(q0); CX(q0,q1)", "Operations that prepare the pair"], ["Statevector", "[1/√2, 0, 0, 1/√2]", "Joint amplitudes in 00,01,10,11 order"], ["Histogram", "P(00)=P(11)=1/2", "Z probabilities; phase is absent"], ["Reduced Bloch", "Both vectors at (0,0,0)", "Each local state is I/2"]]);
  addTable("framework-order", "One basis convention across both engines", "Use the asymmetric X(q0) example to verify the adapter, not only a symmetric Bell pair.", ["View", "Order", "Expected representation"], [["Circuit", "q0 on top; q1 below", "X applied to q0"], ["Qiskit statevector", "|q1q0>", "[0,1,0,0]"], ["Cirq statevector", "qubit_order=[q1,q0]", "[0,1,0,0]"], ["Cirq measurement", "measure(q1,q0)", "Bitstring 01"]]);
  addTable("framework-flow", "Choose the simulation result you need", "Aer and Cirq offer different views of the same experiment. Name the representation explicitly.", ["Question", "Use", "Interpretation"], [["Which bits were observed?", "Sampled measurements", "Counts from a stated number of shots"], ["What are the amplitudes?", "Unmeasured pure-state simulation", "Exact statevector, up to numerical precision"], ["How does phase affect the circuit?", "State inspection or a basis analyzer", "One Z histogram omits relative phase"], ["What is the noisy ensemble?", "Density-matrix simulation", "Mixed state, not just one random trajectory"]]);
  return figures;
}
