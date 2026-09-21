# Qiskit Aer

Qiskit Aer gives a concrete Python workflow for the abstract simulator ideas from the previous chapter. A `QuantumCircuit` describes quantum and classical registers, gates and measurements. An `AerSimulator` executes that description locally. Transpilation adapts the circuit to a simulator or hardware target, and the result object exposes counts or saved exact-state data. The workflow is simple enough for a first program, but each line has a different job.

## Learning objectives

By the end of this lesson you should be able to:

- identify quantum registers, classical registers, gates and measurements in a `QuantumCircuit`;
- trace the build, transpile, execute, counts and state-save pipeline;
- explain what `shots` and a simulator seed control;
- retrieve statevector or density-matrix snapshots separately from counts; and
- debug Qiskit bit ordering without treating it as a gate reversal.

## Why this concept matters

Framework fluency is not memorizing import statements. It is learning how a mathematical experiment becomes executable code and how to inspect every boundary. A circuit can be logically correct but produce a surprising count key because classical bits are displayed in a different order. A simulator can return counts correctly while a saved state is requested after measurement and no longer represents the intended pre-measurement state.

The Qiskit workflow also teaches a useful engineering habit: build the experiment in small steps, then inspect the result rather than trusting a single final number.

![The Qiskit Aer workflow separates circuit construction, transpilation, execution and result reading.](/learn/visuals/qiskit-pipeline.svg)

## Plain-language intuition

Treat `QuantumCircuit` as a recipe. Quantum registers are the ingredients that can be put into superposition and entangled. Classical registers are the notebook where measurement outcomes are written. `transpile` rewrites the recipe into operations allowed by the selected target. `run` repeats the recipe for a requested number of shots. `get_counts` counts the notebook entries.

Saving a statevector is like asking for a backstage snapshot from the simulator. It is useful for debugging an ideal circuit, but it is not an outcome that a hardware detector returns in one shot.

## Prerequisite recap

You should know circuit wires, H, CX, measurement, statevectors, shots and basis ordering. The example prepares a Bell pair, so you should expect ideal counts only at `00` and `11`. QuantLearn's display convention is `q0` on the top wire and the rightmost bit in a two-bit string.

## Notation and vocabulary

`QuantumCircuit(2,2)` creates two quantum bits and two classical bits. `circuit.h(0)` applies H to q0. `circuit.cx(0,1)` uses q0 as control and q1 as target. `measure([0,1],[0,1])` maps q0 to c0 and q1 to c1. `AerSimulator` is a local simulator backend. `shots=N` requests N repeated measurement executions. `seed_simulator` controls pseudorandom sampling within that simulator setup.

Qiskit displays multi-bit classical strings with the highest-index classical bit on the left. Qiskit statevectors also use a little-endian convention in which q0 is the least significant bit. This is not a physical reversal of the circuit. It is a representation rule that must be normalized before comparison.

## Visual explanation before equations

The registers should be understood before the code is executed.

![Quantum and classical registers have different roles in the Qiskit circuit.](/learn/visuals/qiskit-registers.svg)

The line-by-line pipeline then makes the result boundary explicit.

The ordering figure uses an asymmetric state because a symmetric Bell histogram could hide a swapped bit convention.

![Qiskit statevector indices and count keys are mapped to the QuantLearn q1q0 display convention.](/learn/visuals/qiskit-ordering.svg)

## Worked example 1: build, transpile and sample

```python
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

circuit = QuantumCircuit(2, 2)
circuit.h(0)
circuit.cx(0, 1)
circuit.measure([0, 1], [0, 1])

simulator = AerSimulator(seed_simulator=42)
compiled = transpile(circuit, simulator)
result = simulator.run(compiled, shots=1024).result()
counts = result.get_counts()
print(counts)
```

The H and CX prepare `|Phi+>`. Ideal counts should sum to 1,024 and should be concentrated on `00` and `11`. The exact split is random in a finite run, so `00:510, 11:514` is as conceptually valid as another nearby split. `transpile` did not measure or randomize the circuit; it adapted the representation to the target.

The first debugging calculation is the total count. If `sum(counts.values())` is not 1,024, inspect the call or result object before reasoning about quantum behavior. The second is the support: an ideal Bell circuit should not produce `01` or `10` without an added change in gates, ordering or noise.

## Worked example 2: save an exact state before measurement

Counts and an exact state are best obtained from compatible but separately understood runs. For an unmeasured Bell circuit, save the statevector before adding measurement:

```python
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

state_circuit = QuantumCircuit(2)
state_circuit.h(0)
state_circuit.cx(0, 1)
state_circuit.save_statevector()

state_simulator = AerSimulator(method="statevector")
state_result = state_simulator.run(state_circuit).result()
state = state_result.get_statevector()
```

The expected vector under the declared order is `[1/sqrt(2),0,0,1/sqrt(2)]`. If the circuit uses `save_density_matrix()` instead, the returned object represents the density matrix. If measurements have already collapsed the state, a later snapshot describes that changed experiment rather than the original coherent Bell pair.

![Statevector and density-matrix snapshots must be requested as explicit result types, separate from counts.](/learn/visuals/qiskit-state-snapshot.svg)

## Interactive prediction

Step through the fixed code in the widget. Click a line to predict whether it changes the logical state, the output storage, the compilation representation, or only the returned data. Then switch between counts and an exact snapshot.

```interactive
{"widget":"qiskit-code-explorer","preset":"bell-pipeline"}
```

Inline check: `shots=1024` affects repeated measurement count totals. It does not create 1,024 qubits and it does not make the exact statevector longer.

## Common mistakes

- Confusing a classical bit with a quantum bit. The classical register stores measurement results.
- Thinking `transpile` changes the intended logical unitary rather than adapting its implementation.
- Reading Qiskit count keys as though q0 were the leftmost bit.
- Asking for a statevector after a measurement and calling it the pre-measurement state.
- Expecting a simulator seed to produce identical samples in Cirq or PennyLane.
- Treating a local `AerSimulator` result as a hardware execution.

## Summary and glossary

The Qiskit flow is build a `QuantumCircuit`, transpile it for an `AerSimulator`, execute with declared shots, and read counts or explicit saved state data. Quantum and classical registers have separate roles. State snapshots and measurements answer different questions. Qiskit's bit ordering must be normalized before comparing arrays and strings with another framework.

Glossary: **QuantumCircuit** is Qiskit's circuit object; **QuantumRegister** holds qubits; **ClassicalRegister** stores measured bits; **AerSimulator** is the local simulator backend; **transpile** adapts a circuit to a target; **counts** map strings to frequencies; **snapshot** is saved simulator state data.

## Assessment

Answer the chapter quiz after stepping through both code examples. The questions cover registers, transpilation, shots, snapshots, counts and bit ordering.

## Transfer problem

Change the circuit to apply `X(0)` with q1 idle. Predict the statevector and count key under QuantLearn's `q1q0` display before running it. Explain which Qiskit convention could make the same state look like index 2 instead of index 1.

## Lab connection

Try the Bell-pair challenge in Lab and compare its result panels with the Qiskit pipeline. Debugging prompt: if your counts appear as `01` and `10` instead of `00` and `11`, first check the entangling circuit and output mapping, then check whether you are reading the classical key in the intended direction.

Try this in Lab: [open the Bell-pair challenge](/lab?challenge=bell).

## Chapter quiz

Answer every question and read the feedback. The count follows the code and ordering content in this framework chapter.

## Sources

- Qiskit Aer, [Simulators](https://qiskit.github.io/qiskit-aer/tutorials/1_aersimulator.html).
- IBM Quantum, [Quantum circuits](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/quantum-circuits).
- IBM Quantum, [Bit ordering in the Qiskit SDK](https://quantum.cloud.ibm.com/docs/en/guides/bit-ordering).
- IBM Quantum, [Visualization API](https://quantum.cloud.ibm.com/docs/en/api/qiskit/visualization).
