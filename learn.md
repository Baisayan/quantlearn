Recommended lesson standard
Each lesson should follow this flow:
1. Why the concept matters.
2. Plain-language intuition.
3. Prerequisite recap.
4. Notation and vocabulary.
5. Visual explanation before equations.
6. One fully worked example.
7. A second varied example.
8. Interactive prediction.
9. Common mistakes.
10. Lab connection.
11. Summary and glossary.
12. Assessment.
Recommended size:
- Foundations: 1,200–1,700 words.
- Circuits and entanglement: 1,400–1,900 words.
- Algorithms: 1,600–2,200 words.
- Framework lessons: 1,200–1,700 words plus code.
Each lesson should include:
- 3–5 visuals.
- 1–3 interactive components.
- At least 2 worked calculations.
- One “predict before reveal” activity.
- One Lab handoff.
- One misconception section.
- One transfer problem.
Keep the 10-question quiz for compatibility, but add inline checks so the quiz is not doing all the teaching.
Proposed curriculum
Module 1: Foundations and Mathematical Intuition
1. Classical information versus quantum information
Teach:
- Classical bits, probability distributions, and deterministic states.
- Why a qubit is not simply a “bit that is both 0 and 1.”
- State, measurement, probability, and information as separate ideas.
- Why quantum computing uses amplitudes instead of direct probabilities.
- What quantum computing can and cannot reveal from one measurement.
Math:
- Basic probability.
- Vectors as ordered descriptions.
- Difference between a probability list and an amplitude vector.
Visuals and interaction:
- Bit toggle versus qubit state slider.
- Probability distribution versus amplitude representation.
- “What can one measurement reveal?” prediction activity.
Lab bridge:
- Run |0⟩, |1⟩, and |+⟩ in the Lab and compare output histograms.
2. The mathematics toolkit
Teach:
- Complex numbers.
- Magnitude and squared magnitude.
- Vectors and normalization.
- Inner products at an intuitive level.
- Matrices as transformations.
- Why probabilities must sum to one.
- Why complex phase cannot be treated as ordinary probability.
Worked examples:
- Normalize [1/2, 1/2].
- Calculate |i/2|².
- Apply a simple 2×2 matrix to [α, β].
Visuals and interaction:
- Complex-plane amplitude explorer.
- Normalization calculator.
- Matrix-vector multiplication stepper.
This chapter should be a gentle mathematical bridge rather than a formal linear algebra lecture.
3. Qubits, statevectors, and the Bloch sphere
Teach:
- |0⟩, |1⟩, ket notation, and statevectors.
- Pure states and global phase.
- Relative phase.
- Bloch-sphere coordinates.
- The relationship between θ, φ, amplitudes, and measurement probabilities.
- What the Bloch sphere does not represent: arbitrary multi-qubit states.
Worked examples:
- [√3/2, i/2].
- |+⟩, |−⟩.
- θ = π/3, φ = π/2.
Visuals and interaction:
- Draggable Bloch vector.
- Live amplitude and probability readout.
- Global-phase control showing no physical change.
- Relative-phase control showing later interference changes.
4. Measurement, the Born rule, and shots
Teach:
- The Born rule.
- Measurement collapse.
- Fresh preparation versus repeatedly measuring one collapsed state.
- Exact probabilities versus finite counts.
- Sampling uncertainty.
- Z, X, and Y measurement bases.
- Expectation values as averages of signed outcomes.
Worked examples:
- P(0) = 3/4 over 16, 100, and 1,024 shots.
- Estimate an expectation from 70 zeros and 30 ones.
- Show why more shots reduce uncertainty but do not remove device bias.
Visuals and interaction:
- Shots slider.
- Exact distribution versus sampled histogram.
- Confidence interval visualization.
- Basis selector showing how H changes the measurement basis.
5. Superposition, phase, and interference
Teach:
- Superposition as a state description, not “simultaneously readable answers.”
- Global versus relative phase.
- Constructive and destructive interference.
- H|0⟩, H|+⟩, H|−⟩.
- Why HH and HZH produce different results.
- Why equal Z-basis histograms do not imply identical states.
Worked examples:
- P(0) = (1 + cos φ)/2.
- φ = 0, π/2, and π.
- Classical mixture versus coherent superposition.
Visuals and interaction:
- Phase slider.
- Live signed-amplitude bars.
- Interference path animation with play/pause.
- Prediction prompt before applying the final Hadamard.
This completes the beginner foundation before introducing more gates.
Module 2: Circuits and Gates
6. The quantum circuit model
Teach:
- Wires, gates, time, measurement, and classical outputs.
- Reversible computation.
- Unitary operations versus measurement.
- Why a circuit must preserve normalization before measurement.
- Left-to-right circuit reading versus right-to-left matrix multiplication.
- Classical control after measurement.
Visuals and interaction:
- Circuit timeline.
- Step forward/backward through a circuit.
- State display after every operation.
- Toggle between circuit notation and matrix notation.
7. Single-qubit gates
Teach:
- Identity, X, Y, Z, and H.
- Matrix definitions.
- Basis-state actions.
- General statevector action.
- Unitarity and inverses.
- Why equal measurement probabilities can hide phase differences.
- Why gate order matters.
Worked examples:
- Apply X, Z, and H to [α, β].
- Compare X → H with H → X.
- Verify Y|0⟩ = i|1⟩.
Visuals and interaction:
- Gate picker.
- Animated statevector transformation.
- Before/after Bloch sphere.
- Gate-order comparison.
8. Phase and rotation gates
Teach:
- S and T.
- Rx, Ry, and Rz.
- Radians and half-angle formulas.
- Global phase versus relative phase.
- How phase becomes visible after a basis change.
- Why globally equivalent gates may differ when controlled.
- Bloch-sphere rotations.
Worked examples:
- H → S → H.
- H → T → H.
- Ry(θ)|0⟩.
- θ = 0, π/2, π, and 2π.
Visuals and interaction:
- Rotation-angle slider.
- Bloch-sphere trajectory.
- Exact probability curve.
- S/T/Rz comparison.
9. Multi-qubit states and tensor products
Teach:
- Product states.
- Tensor products.
- Basis ordering.
- Why two qubits require four amplitudes.
- Why n qubits require 2ⁿ amplitudes.
- Product state versus entangled state.
- How to calculate a tensor product by hand.
Worked examples:
- |0⟩ ⊗ |+⟩.
- [√3/2, 1/2] ⊗ [1/√2, 1/√2].
- Calculate P(10) explicitly.
Visuals and interaction:
- Tensor-product builder.
- Amplitude table that expands as qubits are added.
- Basis-ordering visualizer.
- Product-state test.
10. Controlled gates, circuit resources, and bit ordering
Teach:
- Control and target semantics.
- CX, CZ, and SWAP.
- Why CX does not always create entanglement.
- Gate count, circuit depth, and parallel operations.
- Hardware connectivity and compilation.
- Qiskit, Cirq, and PennyLane ordering differences.
- QuantLearn’s declared q0 convention.
Visuals and interaction:
- Controlled-gate truth-table explorer.
- Depth calculator.
- Wire-order toggle.
- “Find the bit-order bug” activity.
This convention should be repeated throughout every later chapter.
Module 3: Entanglement and Communication
11. Density matrices and reduced states
Teach:
- Why a statevector is not enough for every situation.
- Pure states and mixed states.
- Density matrix construction.
- Diagonal probabilities versus off-diagonal coherence.
- Reduced density matrices and partial trace.
- Bloch vectors inside the sphere.
- Why local state information can hide joint correlations.
Worked examples:
- Bell state density matrix.
- Classical 00/11 mixture.
- Reduced density matrix I/2.
Visuals and interaction:
- Toggle between vector and density-matrix views.
- Remove one subsystem and observe the reduced state.
- Bloch sphere showing pure surface state versus mixed interior state.
12. Bell states and correlations
Teach:
- The four Bell states.
- Bell-state preparation.
- Z-basis correlation.
- X-basis correlation.
- Bell state versus classical mixture.
- Why one histogram is insufficient.
- Why the shown comparison is not a universal Bell test.
- Entanglement versus ordinary correlation.
Visuals and interaction:
- Bell-state selector.
- Measurement-basis toggle.
- Correlation heatmap.
- Bell state/classical mixture comparison.
Lab bridge:
- Prepare a Bell pair and compare both statevector and measurement results.
13. Quantum teleportation
Teach:
- Input state, shared Bell resource, Alice, Bob.
- The full three-qubit circuit.
- Measurement branch table.
- Conditional corrections.
- Why two classical bits are required.
- Why teleportation does not clone matter or transmit information faster than light.
- Why testing only |0⟩ and |1⟩ is insufficient.
Worked examples:
- Teleport |0⟩.
- Teleport |1⟩.
- Teleport √3|0⟩/2 + i|1⟩/2.
- Trace at least two classical branches row by row.
Visuals and interaction:
- Step-by-step protocol tracer.
- Select measurement branch.
- Show Bob’s state before and after correction.
- Display classical-control arrows separately from quantum wires.
14. No-cloning, no-signalling, and what entanglement cannot do
Teach:
- Intuitive no-cloning argument.
- Inner-product proof for arbitrary unknown states.
- Why teleportation consumes the input.
- Why Bob’s local state is maximally mixed before classical communication.
- Why entanglement cannot transmit a chosen message instantly.
- Difference between correlation and communication.
Visuals and interaction:
- Attempted cloning simulator that shows why linearity fails.
- Bob-only view before and after receiving classical bits.
- “Can Bob decode this?” prediction activity.
Module 4: Quantum Algorithms and Variational Methods
15. Oracles and phase kickback
Teach:
- Query problems.
- Reversible Boolean oracles.
- Helper qubit.
- |−⟩ state.
- Phase kickback derivation.
- Difference between an oracle call and the gates implementing it.
- Why the oracle model is an abstraction.
Visuals and interaction:
- Truth table to reversible oracle builder.
- Toggle helper qubit between |0⟩, |1⟩, and |−⟩.
- Show bit flip versus phase flip.
16. Deutsch-Jozsa
Teach:
- Constant and balanced promise.
- Classical query complexity.
- Full circuit for a small example.
- Final Hadamards and cancellation.
- Why all-zero output indicates constant under the promise.
- Why a balanced function does not always return 11.
- Why oracle construction costs matter.
Worked examples:
- Constant-zero function.
- Constant-one function.
- Two-input XOR.
- One three-input truth table.
Visuals and interaction:
- Oracle selector.
- Truth-table editor.
- Phase-sign display.
- Final output distribution preview.
17. Grover search and amplitude amplification
Teach:
- Search as a checking problem.
- Uniform initialization.
- Phase oracle.
- Diffusion as reflection about the mean.
- Geometry of amplitude amplification.
- General success formula.
- Stopping rule.
- Oracle-cost caveat.
- Why more iterations can reduce success.
Worked examples:
- Four candidates with marked 11.
- Signed amplitudes before and after oracle.
- One diffusion step.
- Two iterations showing overshoot.
Visuals and interaction:
- Iteration slider.
- Signed amplitude bars.
- Mean-reflection animation.
- Success-probability curve.
- Marked-state selector.
18. Observables, expectation values, and cost functions
This chapter should be inserted before QAOA and VQE.
Teach:
- Observable operators.
- Eigenvalues.
- Pauli X, Y, and Z expectations.
- Basis changes.
- Expectation as an average.
- Cost functions.
- Sampled estimate versus exact expectation.
- Why one measurement basis cannot provide every term.
Worked examples:
- Estimate ⟨Z⟩ from counts.
- Estimate ⟨X⟩ after H.
- Combine terms into a cost or energy.
Visuals and interaction:
- Observable selector.
- Basis-rotation preview.
- Counts-to-expectation calculator.
- Shot noise comparison.
19. QAOA and combinatorial optimization
Teach:
- Graphs and MaxCut.
- Encoding a cost Hamiltonian.
- Why C = (I − Z₀Z₁)/2 gives scores 0 and 1.
- Initial |++⟩ state.
- Cost evolution.
- Mixer evolution.
- Parameter meanings γ and β.
- Classical optimization loop.
- Sampled bitstring score versus expected score.
- Limitations and no automatic advantage claim.
Visuals and interaction:
- Graph editor.
- Cost-Hamiltonian builder.
- γ/β parameter landscape.
- Probability distribution and expected score.
- Classical optimization loop diagram.
20. VQE and energy estimation
Teach:
- Hamiltonians and eigenvalues.
- Ground-state energy.
- Ansatz.
- Variational principle.
- Exact analytic solution for the one-qubit model.
- Measuring separate Pauli terms.
- Shot noise in energy estimates.
- Classical optimizer loop.
- Local minima, noise, and scaling.
- Difference between an educational toy Hamiltonian and chemistry.
Visuals and interaction:
- θ slider.
- Exact energy curve.
- Z and X measurement panels.
- Sampled energy estimate.
- Optimizer animation with replayable steps.
Module 5: Simulation and Frameworks
This module should explicitly be expanded into a base chapter, three framework chapters, and a comparison chapter.
21. Simulation foundations
Teach:
- Statevector simulation.
- Sampling.
- Density-matrix simulation.
- Ideal versus noisy simulation.
- Shot noise versus device noise.
- Statevector and density-matrix scaling.
- Circuit, statevector, histogram, and Bloch panels.
- Why an exact simulator state is not a hardware measurement.
- Reproducibility and seeds.
Visuals and interaction:
- Same circuit shown as statevector, histogram, density matrix, and Bloch view.
- Toggle exact versus sampled output.
- Noise channel slider.
- Dense-state scaling calculator.
22. Qiskit Aer
Teach:
- QuantumCircuit.
- Quantum and classical registers.
- Gates and measurements.
- AerSimulator.
- Transpilation.
- shots.
- Counts.
- Statevector saving.
- Density matrices.
- Qiskit bit ordering.
- Common Qiskit mistakes.
Code flow:
1. Build circuit.
2. Transpile.
3. Execute.
4. Read counts.
5. Read exact state.
6. Compare with expected result.
Interaction:
- Read-only code line highlighting.
- Click a line to show its effect on the circuit.
- Run a fixed safe example.
- Link to the same circuit in Lab.
23. Cirq
Teach:
- Qubit objects.
- Operations.
- Moments.
- Circuit construction.
- Simulator.run.
- Simulator.simulate.
- Repetitions versus exact state.
- Explicit qubit_order.
- Measurement keys.
- Common ordering mistakes.
Interaction:
- Moment-by-moment circuit timeline.
- run() versus simulate() comparison.
- Reorder qubits and show the output difference.
- Same Bell circuit rendered in Cirq notation.
24. PennyLane
Teach:
- Devices.
- Wires.
- Quantum functions.
- QNodes.
- Operations.
- qml.state().
- qml.probs().
- qml.counts().
- Expectation measurements.
- Finite shots.
- Basic gradients and differentiable parameters.
- What default.qubit means.
- Difference between PennyLane as a programming framework and a physical backend.
Interaction:
- Device selector limited to supported safe examples.
- Measurement-return selector.
- Parameter slider for Ry(θ).
- Exact state versus sampled counts.
- Optional gradient visualization.
25. Cross-framework comparison and capstone
Teach:
- Same circuit in Aer, Cirq, and PennyLane.
- Normalizing basis order.
- Comparing exact probabilities.
- Comparing statevectors up to global phase.
- Why identical seeds do not guarantee identical samples.
- Reproducibility metadata.
- Choosing the right result type.
- Debugging a framework mismatch.
- When to use each framework.
How the interactive Learn experience should work
Use generated SVGs for:
- Circuit diagrams.
- Mathematical derivations.
- Histograms.
- Tables.
- Annotated state diagrams.
- Summary illustrations.
The existing [visuals.mjs](C:\\Users\\bbbba\\Documents\\lab\\quantlearn\\content\\scripts\\visuals.mjs) approach is good for this layer, but the figures should become more explanatory and less table-like.
Level 2: Interactive SVG/React visualizations
Level 3: Lab handoff
Chapter that has relevant challenges, should end with:
- “Try this in Lab.”
- Then redirect to that specigic challenge in lab
- A debugging prompt.
- A link back to the relevant lesson section.
The Learn page should explain and scaffold. The Lab should remain the place for open-ended construction and execution.
The strongest content pipeline would validate a coverage matrix:
objective → explanation → visuals → quiz → Lab challenge
That would prevent the current situation where a topic technically appears but is not sufficiently taught.