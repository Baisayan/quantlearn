# Controlled gates, circuit resources and bit ordering

## Learning objectives

By the end of this lesson, you should be able to:

- distinguish control and target semantics for CX, CZ and SWAP;
- explain why CX does not always create entanglement;
- separate gate count, circuit depth and hardware routing; and
- debug bit-order mismatches across QuantLearn, Qiskit, Cirq and PennyLane.

## Why the concept matters

Multi-qubit circuits fail in especially frustrating ways because the diagram can look correct while the labels are reversed. A controlled gate might be applied to the wrong target, a simulator might print q0 on the opposite side of a bitstring, or an extra routing operation might change the depth without changing the abstract algorithm.

This chapter gives you a repeatable debugging method. First state which wire is the control and which is the target. Then state the displayed basis order. Finally separate the logical circuit from the physical circuit that a hardware compiler may create. These statements are part of the result, not optional comments.

## Plain-language intuition

A controlled gate is a conditional operation. The control branch decides whether the target operation runs. In CX, a control of 1 flips the target; the control itself does not flip. In CZ, the 11 branch gets a minus phase. SWAP exchanges the two wire values.

The same gate can create entanglement for one input and leave another input separable. A CX applied to 01 produces 11, a single basis state. A CX applied to a suitable superposition can correlate branches. The gate has entangling capability; entanglement is a property of the input and output state together.

## Prerequisite recap

You can calculate tensor products and read a two-qubit statevector. You know that QuantLearn displays basis strings as $|q_1q_0\rangle$, that q0 is the top wire and least significant bit, and that the rightmost printed bit is q0.

## Notation and vocabulary

Write $\mathrm{CX}(q_0,q_1)$ to mean q0 is control and q1 is target. Under the declared basis order,

$$
00\to00,\quad 01\to11,\quad 10\to10,\quad 11\to01.
$$

CZ leaves every basis state unchanged except $|11\rangle$, which receives a factor of $-1$. SWAP maps 01 to 10 and 10 to 01. Gate count counts logical operations. Circuit depth counts sequential layers after a scheduling rule is stated. Connectivity describes which physical qubits can interact directly.

## Visual explanation before equations

The truth-table view makes control and target explicit. It also shows that CZ changes phase rather than flipping a bit.

![Truth-table view of CX, CZ and SWAP under the QuantLearn q0 convention.](/learn/visuals/controlled-gates.svg)

Resource metrics are different measurements of a circuit. Two H gates can be parallel, while a CX uses both wires and must occur later.

![Gate count and circuit depth comparison for parallel and sequential operations.](/learn/visuals/circuit-resources.svg)

The asymmetric circuit is the important test case. A symmetric Bell distribution can look correct even if q0 and q1 are reversed.

![An asymmetric two-qubit circuit exposing top-wire and rightmost-bit conventions.](/learn/visuals/bit-order.svg)

The debugging visual compares the conventions that an adapter must normalize.

![A bit-order debugging matrix comparing QuantLearn, Qiskit, Cirq and PennyLane conventions.](/learn/visuals/bit-order-debug.svg)

## Worked example: CX on all basis inputs

Apply $\mathrm{CX}(q_0,q_1)$ to each basis state.

1. 00 has q0=0, so the target q1 is unchanged: 00.
2. 01 has q0=1, so q1 flips from 0 to 1: 11.
3. 10 has q0=0, so q1 remains 1: 10.
4. 11 has q0=1, so q1 flips from 1 to 0: 01.

The mapping is reversible because applying the same CX again returns every input. Notice that the order of the printed string is q1q0. If you interpret 01 as q0=0,q1=1, you have silently changed the convention.

## Second example: gate count, depth and routing

Consider H(q0), H(q1), then CX(q0,q1). The logical gate count is three. The two H operations act on disjoint qubits, so they can occupy one layer. CX uses both qubits and occupies a second layer. The minimum logical depth is therefore two.

If hardware cannot directly connect q0 and q1, a compiler may insert SWAP operations to move states next to one another. The logical algorithm still has three gates, but the physical circuit has more gates and greater depth. Gate count and depth should always be reported with the layer and connectivity assumptions that produced them.

## Why CX does not always entangle

Starting from 01, CX produces 11. The output is $|1\rangle\otimes|1\rangle$, which is a product state. Starting from $|+\rangle\otimes|0\rangle$, CX produces

$$
\frac{|00\rangle+|11\rangle}{\sqrt2},
$$

which cannot be factored into independent single-qubit states. The operation is the same; the input is different. Therefore “a CX creates entanglement” is too broad. The precise statement is that CX can entangle some product superpositions.

## Classical control and quantum control

A control dot in a circuit is a coherent quantum condition. A classical bit produced by measurement is different. After measurement, a classical controller can decide whether to apply X or Z, but the device is no longer keeping both classical outcomes as coherent branches. This distinction will matter when you read teleportation and algorithmic oracles.

## Framework ordering and the adapter boundary

Qiskit commonly writes statevector entries in $|q_1q_0\rangle$ order, with q0 as the least significant bit. Cirq lets the caller set `qubit_order`; QuantLearn requests an explicit order so output arrays line up. PennyLane uses integer wire labels, which still need an adapter when a visual places q0 at the top.

Do not solve a display mismatch by changing the physics. Normalize the convention at the boundary: label wires, reorder arrays once, and test with an asymmetric state such as 01. Symmetric states such as 00 and 11 cannot reveal a reversal.

The circuit shown on a page is the logical circuit: it describes the operation the learner intends. A hardware compiler may insert SWAPs, decompose a gate into native pulses, or schedule independent gates in parallel. Those implementation details change physical gate count and depth, but they should preserve the logical statevector after the chosen ordering adapter. When comparing two results, say whether you are comparing logical depth, compiled depth, or execution time. Otherwise a learner may mistake an optimization detail for a change in quantum meaning.

## Interactive prediction

Choose CX or CZ and an input bitstring. Predict the output before selecting a different input. The local activity keeps the control semantics and q0 convention visible without changing a Lab circuit.

```interactive
{"widget":"controlled-gate","preset":"cx-order"}
```

## Common mistakes

- Flipping the control instead of the target in CX.
- Treating CZ as a bit flip instead of a phase change on 11.
- Assuming every two-qubit gate creates entanglement.
- Reporting circuit depth without saying which gates can run in parallel.
- Comparing simulator arrays without fixing wire order first.
- Testing only symmetric states and missing a q0/q1 reversal.
- Treating a classical measurement result as a coherent quantum control.

## Summary and glossary

Controlled gates apply an operation conditionally according to control and target semantics. CX can entangle superpositions but not every basis input. Gate count, depth and hardware routing describe different circuit costs. A stable q0 convention and asymmetric test state are the simplest defenses against bit-order bugs.

**Control:** wire that selects a conditional operation. **Target:** wire receiving the operation. **Depth:** number of sequential layers. **Connectivity:** which hardware qubits can interact directly. **Bit-order adapter:** the boundary code that maps one framework's wire order to the platform convention.

## Transfer problem

Use the declared convention to predict $\mathrm{CX}(q_0,q_1)$ on 01 and 10, then reverse the display order and see which labels change. As a debugging prompt, write “q0 control, q1 target, display q1q0” above your calculation. If the Lab reports 10 where you expected 01, inspect the adapter and measurement order before changing the gates.

## Assessment

Run the controlled-gate activity on all four inputs, then calculate the two-layer depth example by hand. The ten-question assessment should check semantics, resource accounting and convention debugging rather than only ask for truth-table memorization.

## Lab connection

The matching challenge is [Which qubit is which?](/lab?challenge=bit-order). Build the asymmetric circuit, apply X to q0, and verify that the result is 01 under QuantLearn's convention. After the quiz, the Lab handoff repeats the debugging prompt and links back to this lesson section so you can compare the visual and simulator output.

## Chapter quiz

Answer every question in order. This ten-question assessment covers CX, CZ, SWAP, entanglement conditions, gate count, circuit depth, connectivity and framework bit ordering. Review the explanations before retrying the bit-order challenge.

## Sources

- [Quantum circuits](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/quantum-circuits). IBM Quantum Learning / John Watrous.
- [Bit-ordering in the Qiskit SDK](https://quantum.cloud.ibm.com/docs/en/guides/bit-ordering). IBM Quantum Documentation.
- [Circuits](https://quantumai.google/cirq/build/circuits). Google Quantum AI.
