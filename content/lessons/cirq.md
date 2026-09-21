# Cirq

Cirq makes the structure of a quantum program explicit: qubit objects are named, operations are placed into moments, and a `Circuit` collects them in time order. Its simulator separates repeated measurement runs from exact state simulation. That separation is especially helpful when debugging bit order, because Cirq lets you state the tensor order directly instead of relying on a default that may not match your platform.

## Learning objectives

By the end of this lesson you should be able to:

- identify Cirq qubits, operations, moments and circuits;
- distinguish `Simulator.run` from `Simulator.simulate`;
- use repetitions and measurement keys to read sampled results;
- use explicit `qubit_order` for statevector comparisons; and
- explain a common idle-wire and bit-ordering failure.

## Why this concept matters

Quantum code is a description of time, not only a list of gates. Cirq's moment model makes parallelism visible and helps learners reason about circuit depth. Its explicit qubit objects also make wire identity visible, which is valuable when the same logical experiment is translated between frameworks.

The biggest practical trap is ordering. A Bell histogram is symmetric, so reversing two bits can look harmless. An asymmetric preparation such as `X(q0)` exposes the bug immediately. Cirq's `qubit_order` and measurement-key choices are tools for making that convention a deliberate part of the experiment.

The moment model also gives a first approximation to circuit depth. Two H gates on independent wires can share one moment, while a two-qubit operation occupies both wires and prevents another operation on either wire from being placed in that same slice. This logical depth is not automatically the hardware depth, because a device may need routing or native-gate decomposition, but it is a useful bridge from circuit notation to execution cost.

## Plain-language intuition

Think of a Cirq circuit as a timeline with lanes. A qubit is a lane label. An operation is an instruction occupying a time slot. A moment is one vertical slice containing operations that can happen together. A measurement operation writes a classical record under a key.

`run` asks the timeline to produce many classical records. `simulate` asks for the internal final state of an ideal unmeasured circuit. They are not two spellings for the same result, and choosing the wrong one can make a correct circuit look like it lost information.

## Prerequisite recap

You should know circuit time, statevectors, measurements, shots and basis ordering. Use the shared Bell fixture: H on q0 followed by CX from q0 to q1. The ideal Z results are `00` and `11`. For an asymmetric test, apply X only to q0 and expect display string `01` under QuantLearn's q1q0 convention.

## Notation and vocabulary

`cirq.LineQubit.range(2)` creates q0 and q1. `cirq.H(q0)` returns a gate operation. `cirq.CNOT(q0,q1)` returns a controlled operation. `cirq.Circuit(...)` arranges operations into moments. `cirq.measure(q1,q0,key="bits")` records two measured values under the key `bits` in the requested argument order.

`Simulator.run(circuit, repetitions=N)` produces sampled records. `Simulator.simulate(circuit, qubit_order=[q1,q0])` returns an exact state for the specified tensor order. Explicit order matters when a wire is idle or when comparing with a statevector whose most significant factor is q1.

## Visual explanation before equations

First see the timeline. The H and CNOT cannot be reduced to a static gate list if you care about when the entanglement is made.

![The Cirq timeline maps operations to moments and makes parallel time slices visible.](/learn/visuals/cirq-timeline.svg)

Then compare the two simulator entry points.

![Cirq run produces finite measurement records while simulate exposes an exact state.](/learn/visuals/cirq-run-simulate.svg)

Finally make order explicit. The same logical state can be stored at a different index if q0 and q1 are reversed.

![Explicit qubit order maps Cirq statevector indices and measurement keys to the displayed bitstring convention.](/learn/visuals/cirq-ordering.svg)

## Worked example 1: run a Bell circuit

```python
import cirq

q0, q1 = cirq.LineQubit.range(2)
circuit = cirq.Circuit(
    cirq.H(q0),
    cirq.CNOT(q0, q1),
    cirq.measure(q1, q0, key="bits"),
)

simulator = cirq.Simulator(seed=42)
result = simulator.run(circuit, repetitions=1024)
histogram = result.histogram(key="bits")
```

The measurement arguments are intentionally `q1,q0`, so the recorded bits follow the displayed `q1q0` order. The ideal histogram should contain only 00 and 11, with frequencies near 512 each. The key is a label for a classical record; it does not alter the quantum operations or insert a SWAP.

The first calculation is the total count: sum the histogram values and confirm 1,024. The second is the support: check that no ideal sample appears at 01 or 10. If the support is right but the split is not exactly equal, that is ordinary sampling variation.

![The Bell preparation is shown in Cirq notation with a keyed measurement and expected outcomes.](/learn/visuals/cirq-bell.svg)

## Worked example 2: simulate an asymmetric state

Remove the measurement and prepare only q0:

```python
state_circuit = cirq.Circuit(cirq.X(q0))
state = simulator.simulate(state_circuit, qubit_order=[q1, q0])
print(state.final_state_vector)
```

With basis order `|q1q0>`, the expected vector is `[0,1,0,0]`, because q1 is zero and q0 is one. If you use `qubit_order=[q0,q1]`, the nonzero entry moves to the index representing `10` in that alternate order. The physics did not change. The array interpretation changed.

Including an idle q1 in `qubit_order` is important. If the circuit only exposes q0 as active and you omit q1, Cirq can return a one-qubit state, which is not comparable to the requested two-qubit vector.

## Interactive prediction

Step through the moment timeline, switch from `run()` to `simulate()`, and toggle the explicit order. Predict which part changes: the logical state, the finite samples, or only the array index labels.

```interactive
{"widget":"cirq-explorer","preset":"bell-run-simulate"}
```

Inline check: reversing `qubit_order` should move an asymmetric amplitude, while a symmetric Bell histogram can remain visually unchanged.

## Common mistakes

- Assuming each line of a circuit is automatically a different moment.
- Using `simulate` when the lesson question is about finite measurement counts.
- Omitting an idle qubit from `qubit_order` and then comparing different state dimensions.
- Treating `measure(q1,q0)` as a physical SWAP.
- Comparing integer histogram keys without formatting or documenting their bit order.
- Expecting Cirq's seed to reproduce samples from a different framework.

## Summary and glossary

Cirq names qubits and operations explicitly, groups compatible operations into moments, and stores them in a circuit. `run` samples measurement records for a declared repetition count. `simulate` exposes an ideal state and accepts an explicit tensor order. Measurement keys and qubit order are representation choices that should be documented alongside the circuit.

Glossary: **LineQubit** is a named Cirq wire; **operation** applies a gate to qubits; **moment** is a time slice; **Circuit** is the ordered program; **run** samples records; **simulate** returns an exact state; **measurement key** labels classical results; **qubit_order** declares tensor-factor order.

## Assessment

Answer the chapter quiz after tracing both the Bell run and the asymmetric simulation. The questions check moments, repetitions, exact state inspection, measurement keys and explicit ordering.

## Transfer problem

Prepare `X(q1)` with q0 idle. Write the expected vector under `[q1,q0]`, then change only the order to `[q0,q1]`. Explain why the nonzero index changes while the measured physical bitstring can be normalized to the same logical state.

## Lab connection

Try the Bell-pair challenge in Lab and compare its circuit timeline and results with the Cirq representation. Debugging prompt: if an asymmetric result is reversed, record the exact wire order first, then change the adapter rather than adding an unexplained SWAP.

Try this in Lab: [open the Bell-pair challenge](/lab?challenge=bell).

## Chapter quiz

Answer every question and read the feedback. The question count follows the Cirq API and ordering content in this lesson.

## Sources

- Google Quantum AI, [Simulation](https://quantumai.google/cirq/simulate/simulation).
- Google Quantum AI, [Circuits](https://quantumai.google/cirq/build/circuits).
- Google Quantum AI, [Gates and operations](https://quantumai.google/cirq/build/gates).
- IBM Quantum, [Bit ordering in the Qiskit SDK](https://quantum.cloud.ibm.com/docs/en/guides/bit-ordering).
