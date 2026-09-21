# Cross-framework comparison and capstone

The final chapter turns three framework lessons into one debugging method. Qiskit Aer, Cirq and PennyLane can represent the same ideal circuit, but they expose wires, state arrays, measurements, seeds and return values differently. A fair comparison first normalizes the logical experiment, then compares exact probabilities, then compares statevectors up to global phase, and only then compares finite samples.

## Learning objectives

By the end of this lesson you should be able to:

- implement the same Bell and asymmetric circuits in Aer, Cirq and PennyLane;
- normalize wire order and compare exact probabilities;
- explain why equivalent statevectors can differ by global phase;
- explain why identical seeds do not promise identical samples; and
- choose a framework and result type for a stated debugging task.

## Why this concept matters

Cross-framework work is common in quantum computing. A research group may design a circuit in one API, validate it in another simulator, and submit it through a third provider. If the comparison is casual, a bit-order convention can look like a physics disagreement. If the comparison is staged, each mismatch becomes diagnosable.

The capstone is therefore not a popularity contest. Qiskit is useful for circuit and transpilation workflows, Cirq makes qubits and moments explicit, and PennyLane makes measurement returns and differentiable parameters convenient. The right choice depends on the question, while the mathematical experiment should remain invariant.

## Plain-language intuition

Imagine three teams following the same recipe but writing their notes in different coordinate systems. Before comparing the final answer, verify that they used the same ingredients, order, units, measurement basis and number of trials. A statevector is like a coordinate list, so the same physical state can be stored at different indices or multiplied by a common phase. A count table is like a poll, so even identical sampling instructions can produce different random responses.

## Prerequisite recap

You should know the Qiskit, Cirq and PennyLane vocabulary from the previous three chapters. You should also know Bell-state preparation, asymmetric bit-order tests, exact probabilities, finite counts, global phase and simulator seeds.

## Notation and vocabulary

The shared Bell circuit is H on q0 followed by CX from q0 to q1. In QuantLearn's convention, display basis strings as `q1q0`, so the ideal statevector is `[1/sqrt(2),0,0,1/sqrt(2)]` and counts are `00` or `11`.

The asymmetric test is X on q0 with q1 idle. In `q1q0` order the statevector is `[0,1,0,0]` and the display outcome is `01`. Use this test to expose order mismatches. A statevector comparison should allow a global phase: vectors `v` and `e^{iφ}v` have identical physical predictions.

**Exact probability comparison** checks squared magnitudes after order normalization. **Statevector comparison** checks complex amplitudes after order normalization and global-phase alignment. **Sample comparison** checks statistical consistency, not exact count identity. **Reproducibility metadata** includes fixture, framework, version, device, order, shots, seed and measurement return.

## Visual explanation before equations

First choose the result type that answers your question.

![Sampled measurements, exact states and mixed representations answer different framework questions.](/learn/visuals/framework-flow.svg)

Then normalize labels and tensor order.

![A framework comparison maps wire order, statevector basis and count-string order into one convention.](/learn/visuals/framework-order.svg)

The comparison matrix makes the staging explicit.

![Framework comparison stages normalize logical gates, basis order, probabilities and observable conventions.](/learn/visuals/framework-matrix.svg)

Seeds and shots are metadata, not proof that independent samplers share one random sequence.

![Reproducibility metadata records circuit, engine, shots, seed and basis order for a fair comparison.](/learn/visuals/framework-repro.svg)

Finally choose the framework by the task rather than by a universal winner.

![Framework choice connects Qiskit Aer, Cirq and PennyLane to different workflow questions.](/learn/visuals/framework-choice.svg)

## Worked example 1: compare the Bell probabilities

In Aer, build a two-qubit circuit, transpile it, and run measurements. In Cirq, create q0 and q1, place H and CNOT in a circuit, and call `run` with repetitions. In PennyLane, create `default.qubit` with finite shots and return `qml.counts()`.

The logical operations are the same. After normalizing count keys to `q1q0`, each engine should approach `P(00)=1/2` and `P(11)=1/2`, while `P(01)=P(10)=0` in the ideal model. With 1,024 shots, each engine can return different nearby counts. The correct comparison is support, frequencies within sampling variation, and declared metadata.

The first calculation is the exact probability vector `[0.5,0,0,0.5]`. The second is a sampled estimate such as `00:506, 11:518`, which sums to 1,024 and estimates frequencies near one half. Do not call the second vector an exact state.

## Worked example 2: align an asymmetric state

Apply X only to q0. Under QuantLearn order `q1q0`, the state is `[0,1,0,0]`. If a framework returns `[0,0,1,0]`, first ask whether it uses `q0q1` storage order. Reversing the adapter's basis labels can reconcile the arrays. Adding a SWAP gate would change the circuit and is not a valid fix for a display mismatch.

Next compare states up to global phase. If one engine returns `[-1/sqrt(2),0,0,-1/sqrt(2)]` for a Bell state, the common factor `-1` does not change any probability or expectation. Align the phase using one nonzero reference amplitude before judging the remaining entries.

## Interactive prediction

Select a framework view, switch the Bell experiment between exact probabilities and sampled counts, and toggle the asymmetric order. Predict whether the logical circuit, the state array, or only the random sample changes.

```interactive
{"widget":"framework-comparison","preset":"bell-and-order-debug"}
```

Inline check: identical seeds can produce different count maps across libraries because their random-number generators and sampling implementations can differ. Agreement of ideal probabilities is the stronger cross-framework invariant.

## Choosing a framework

Use Qiskit Aer when the task emphasizes `QuantumCircuit`, transpilation, backend methods and detailed result objects. Use Cirq when explicit qubit objects, moments, circuit timelines and simulator methods are central. Use PennyLane when quantum functions, measurement returns and differentiable parameters are central. Use all three when the goal is validation or adapter testing.

The choice does not remove the need for a convention. A Qiskit count key, a Cirq integer histogram and a PennyLane count dictionary still need a common bitstring interpretation. A QNode expectation and an Aer counts-derived expectation need the same observable and shot assumptions before they can be compared.

## Debugging sequence

1. Compare source operations and wire mapping.
2. Run an asymmetric basis-state fixture.
3. Declare the tensor and count-key order.
4. Compare exact probabilities before finite samples.
5. Align statevectors up to global phase.
6. Compare expectations using the same observable and basis.
7. Only then investigate seeds, statistical variation or noise.

This sequence prevents a common failure mode: changing gates until two display panels look alike, even though the logical experiments have diverged.

## Common mistakes

- Comparing raw arrays before normalizing basis order.
- Treating a global phase difference as a physical disagreement.
- Expecting the same seed to synchronize three libraries.
- Comparing count integers instead of probabilities and confidence from the same shot budget.
- Forgetting idle wires in Cirq or classical-register order in Qiskit.
- Calling `default.qubit` hardware or assuming every device supports every measurement.
- Choosing a framework before writing down the result type required by the task.

## Summary and glossary

Equivalent frameworks should agree on logical operations and ideal probabilities. Statevectors should be compared after basis-order normalization and global-phase alignment. Samples should be compared statistically, with shots and seeds recorded but not overinterpreted. Qiskit Aer emphasizes circuit and transpilation workflows, Cirq emphasizes explicit qubits and moments, and PennyLane emphasizes QNodes, measurement returns and gradients.

Glossary: **adapter** maps one framework's representation to another; **basis order** assigns array indices to bitstrings; **global phase** is a common unit-magnitude factor with no measurement effect; **exact probability** is a simulator calculation; **sample** is a finite measurement record; **reproducibility metadata** records the setup needed to repeat a comparison.

## Assessment

Answer the chapter quiz after working both the Bell and asymmetric examples. The questions check framework roles, state and count normalization, global phase, seeds, result types and debugging order.

## Transfer problem

You receive three outputs: Aer counts `{'00': 510, '11': 514}`, Cirq counts `{1: 512, 2: 512}`, and PennyLane probabilities `[0.5,0,0,0.5]`. Decide which can be compared directly, what mapping is missing for the Cirq integers, and what claim is justified about the experiment.

## Lab connection

Use the Bell-pair challenge as the capstone. Run the fixture through the available Lab engines, inspect each result panel, and document the normalized order and shot count. Debugging prompt: when two results disagree, reproduce the asymmetric X(q0) fixture before changing the Bell circuit.

Try this in Lab: [open the Bell-pair challenge](/lab?challenge=bell).

## Chapter quiz

Answer every question and read the feedback. The count follows the capstone comparison and debugging content in this module.

## Sources

- Qiskit Aer, [Simulators](https://qiskit.github.io/qiskit-aer/tutorials/1_aersimulator.html).
- Google Quantum AI, [Simulation](https://quantumai.google/cirq/simulate/simulation).
- Google Quantum AI, [Circuits](https://quantumai.google/cirq/build/circuits).
- PennyLane, [Circuits](https://docs.pennylane.ai/en/stable/introduction/circuits.html).
- PennyLane, [Measurements](https://docs.pennylane.ai/en/stable/introduction/measurements.html).
- IBM Quantum, [Bit ordering in the Qiskit SDK](https://quantum.cloud.ibm.com/docs/en/guides/bit-ordering).
