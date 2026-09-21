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
10. Summary and glossary.
11. Assessment.
12. Lab connection.
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