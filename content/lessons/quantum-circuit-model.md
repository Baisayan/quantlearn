# The quantum circuit model

## Learning objectives

By the end of this lesson, you should be able to:

- read wires, gates, time steps, measurement boxes and classical outputs;
- distinguish reversible unitary evolution from measurement;
- explain why normalization is preserved before readout; and
- translate a short circuit between left-to-right time order and matrix notation.

## Why the concept matters

A circuit diagram is a compact program for a quantum device. It tells you which systems exist, which operation happens at each moment, when information is still quantum, and when a classical record is created. If the diagram is read as a decorative sequence of boxes, it is easy to reverse an operation, confuse a control with a target, or treat measurement as just another gate.

The circuit model gives a stable reading habit. Start with an initialized state, move from left to right, update the state after each operation, and stop treating the system as a reversible quantum state once it has been measured. This habit will make single-qubit gates, controlled gates, teleportation and algorithms easier to follow.

## Plain-language intuition

Think of a circuit as a timeline with two kinds of information. The horizontal wire carries a quantum state through reversible transformations. A measurement is an observation point that converts part of that state into an ordinary classical value. After that point, a classical bit may control a later gate, but the recorded bit is not a second qubit wire.

Gates do not “look at” the qubit and choose an output. They transform amplitudes according to a linear rule. A measurement samples an outcome from the resulting probabilities and may change the state. Those are different jobs, so they use different mathematical objects.

## Prerequisite recap

You already know that amplitudes are normalized and that a probability comes from squared magnitude. You have used H and Z to make phase differences visible. In this chapter, the new skill is arranging those operations in time and distinguishing the quantum part of a program from its classical output.

## Notation and vocabulary

A wire represents a qubit over time. A gate is a unitary matrix $U$. A circuit moment is a time slice containing operations that can occur in parallel on disjoint qubits. A measurement $M$ produces a classical value such as 0 or 1. A conditional operation applies a gate only when a classical condition is true.

For an ideal closed system,

$$
U^\dagger U=I.
$$

This implies that $U$ preserves inner products and therefore normalization. If $|\psi\rangle$ has total probability one, then $U|\psi\rangle$ also has total probability one. Measurement is not unitary because it produces a classical record and selects a conditional post-measurement state.

## Visual explanation before equations

The circuit below separates the quantum timeline from the classical record. H and Z change the quantum state. M creates a classical output that can be used by later classical control.

![A quantum circuit timeline showing unitary gates, measurement and a classical output.](/learn/visuals/circuit-model.svg)

The next visual makes the intermediate states explicit. It is often more useful to inspect the state after each moment than to stare only at the final histogram.

![A step-by-step circuit state table from preparation through measurement.](/learn/visuals/circuit-stepper.svg)

## Circuit time versus matrix order

Suppose the circuit applies H and then Z to $|0\rangle$. In time order,

$$
|0\rangle\xrightarrow{H}|+\rangle\xrightarrow{Z}|-\rangle.
$$

When written as a product of operators, the rightmost matrix acts first:

$$
|\psi_{\mathrm{out}}\rangle=ZH|0\rangle.
$$

This is not a contradiction. The diagram reads left to right because time advances left to right. Algebra writes composition so the first action is nearest the input vector. If you write $HZ|0\rangle$, you have described a different circuit: Z acts first, and because Z leaves $|0\rangle$ unchanged, the result is $|+\rangle$.

![Circuit time and matrix multiplication use opposite visual directions for the same composition.](/learn/visuals/circuit-matrix.svg)

## Worked example: H then Z then measurement

Start with $|0\rangle$.

1. Apply H. The state becomes $|+\rangle=(|0\rangle+|1\rangle)/\sqrt2$.
2. Apply Z. The $|1\rangle$ amplitude changes sign, giving $|-\rangle=(|0\rangle-|1\rangle)/\sqrt2$.
3. Measure in Z. The probabilities are $1/2$ and $1/2$.

The state is still normalized after each unitary. The measurement is the first step that turns amplitudes into a classical sample. One shot is either 0 or 1, and repeated fresh shots estimate the 50/50 distribution.

## Second example: classical control after measurement

Prepare $|+\rangle$, measure it in Z, and let the recorded bit control an X gate on a second qubit initially in $|0\rangle$. If the classical result is 0, the X is skipped and the second qubit stays in $|0\rangle$. If the result is 1, X runs and the second qubit becomes $|1\rangle$.

The first qubit is no longer being coherently controlled by the second operation. The branch was selected by a classical record. This distinction matters in teleportation and error correction, where a measurement result can choose a correction without allowing the correction to act on a superposition of classical outcomes.

## Reversibility and normalization

An ideal gate can be undone by its inverse. H is its own inverse, as are X, Y and Z up to the relevant global phase behavior. A unitary cannot map both orthogonal inputs $|0\rangle$ and $|1\rangle$ to the same output because that would erase the distinction needed by an inverse. Reset and measurement are not ordinary reversible gates.

Hardware operations are approximate, so physical execution can introduce noise even when the ideal algebra says two gates cancel. The ideal circuit model is still the correct baseline: first calculate what should happen, then compare the device or simulator result with that expectation.

## Interactive prediction

Step through preparation, H, Z and measurement. The local activity shows the state at each moment and makes the boundary between quantum evolution and classical output explicit. It does not call the Lab backend.

```interactive
{"widget":"circuit-stepper","preset":"hz-measurement"}
```

## Common mistakes

- Reading a circuit right to left because matrix products are written right to left.
- Treating measurement as a unitary gate that can be undone.
- Assuming a classical output remains a coherent quantum branch.
- Forgetting that disjoint gates can share a circuit moment.
- Checking only the final histogram and missing a phase or ordering error earlier.
- Claiming a physical circuit is noiseless because the ideal matrices cancel.

## Summary and glossary

A circuit is a time-ordered program. Unitary gates transform normalized quantum states and can be reversed. Measurement creates a classical record and may change the state. Circuit diagrams read left to right, while matrix products place the first operation on the right. Circuit moments, classical control and basis conventions should be stated explicitly.

**Wire:** a qubit tracked through time. **Moment:** a schedulable time layer. **Unitary:** a reversible norm-preserving transformation. **Measurement:** conversion from quantum state to classical outcome. **Classical control:** a later operation selected by a recorded bit.

## Transfer problem

Compare the circuits H then Z and Z then H on $|0\rangle$. Write both operator products, calculate the intermediate state after each gate, and predict a final Z histogram. The two circuits differ even though both use the same two gates. Your debugging question is: did the state change at the same moment as the diagram, or did the matrix order get reversed?

## Assessment

Before submitting the quiz, explain aloud where the first classical information appears in the circuit. Then use the stepper to check whether every unitary state remains normalized. This inline check is meant to make the ten-question assessment a review rather than the first time you practise the concepts.

## Lab connection

The Lab is where you can build the circuit and inspect its state after execution. Start with H, add Z, choose a shot count, and compare the state panel with the histogram. If your result disagrees, debug the operation order, measurement basis and whether the Lab is showing exact probabilities or finite counts.

## Chapter quiz

Answer every question in order. This chapter keeps ten questions for compatibility, covering circuit reading, unitary evolution, matrix order, measurement and classical control. Read the explanations after submission and retry if your circuit timeline and operator notation disagree.

## Sources

- [Quantum circuits](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/quantum-circuits). IBM Quantum Learning / John Watrous.
- [Circuits](https://quantumai.google/cirq/build/circuits). Google Quantum AI.
- [Computer Science + QISE Key Concepts K-12 Framework](https://q12education.org/learning-materials/learning-materials-framework/computer-science-qise-key-concepts). Q-12 Education Partnership.
