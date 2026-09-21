# Quantum teleportation

## Learning objectives

By the end of this chapter, you should be able to label the input, Bell resource, Alice and Bob; trace the three-qubit circuit; use the two-bit branch table to select X and Z corrections; test a complex input; and explain why teleportation consumes the input and cannot transmit a chosen message faster than light.

## Why this concept matters

Teleportation is a compact demonstration of several ideas that otherwise feel disconnected: entanglement, measurement, classical control, phase, and the difference between transferring a state and copying an object. It is also a debugging stress test. An implementation can pass $|0\rangle$ and $|1\rangle$ while still applying a wrong phase correction. A real learner should therefore trace a superposition and compare the full recovered state, not only a histogram.

The name is intentionally provocative, but nothing material disappears and reappears. Alice and Bob consume a shared Bell pair, Alice measures the input and her half, and two ordinary classical bits tell Bob which correction to apply. The original quantum state is reconstructed at Bob only after that classical information arrives.

## Plain-language intuition

Imagine that Bob already holds a correlated quantum resource with Alice. Alice has an unknown qubit $|\psi\rangle$. She cannot read its amplitudes and send them as two numbers. Instead, she lets the input interact with her half of the resource, measures two qubits, and sends the random two-bit result. The result tells Bob which of four known distortions his qubit received: no change, X, Z, or XZ. Applying the inverse correction recovers the state.

The classical bits do not reveal the state. They identify the branch. The entangled resource supplies the coherent relationship that makes the branch correction sufficient.

## Prerequisite recap

You should know how H creates a plus state, how CX prepares $\Phi^+$, how a measurement produces a classical bit, and how X and Z act on a general vector. Keep the ordering explicit: q0 is the input, q1 is Alice's Bell half, q2 is Bob's half. This lesson names measurement bits as m0 for q0 and m1 for q1, in that order.

## Notation and vocabulary

Let

$$
|\psi\rangle=\alpha|0\rangle+\beta|1\rangle,
\qquad |\alpha|^2+|\beta|^2=1.
$$

The resource is $|\Phi^+\rangle_{12}=(|00\rangle+|11\rangle)/\sqrt2$. Alice owns q0 and q1. Bob owns q2. After Alice applies CX(q0,q1) and H(q0), she measures q0 and q1. Bob receives m0m1 and applies X if m1=1, then Z if m0=1. “Conditional” means the correction is selected by a classical record after measurement, not by a coherent control qubit that remains unmeasured.

## Visual explanation before equations

![Three-qubit teleportation circuit with separate Alice and Bob wires and dashed classical corrections.](/learn/visuals/teleportation.svg)

![The four teleportation branches with Bob states before and after conditional correction.](/learn/visuals/teleportation-corrections.svg)

![A complex input traced through two teleportation branches to show phase recovery.](/learn/visuals/teleportation-branch.svg)

Read the circuit in three layers. The solid lines are quantum wires. The measurement boxes turn Alice's quantum wires into classical records. The dashed lines are classical control links to Bob's X and Z corrections. Keeping those layers separate prevents the common mistake of treating the correction as an extra quantum branch.

## The full protocol

Start with

$$
|\psi\rangle_0\otimes|\Phi^+\rangle_{12}
=\frac{1}{\sqrt2}(\alpha|000\rangle+\alpha|011\rangle+\beta|100\rangle+\beta|111\rangle).
$$

The register order is q0q1q2. Apply CX(q0,q1), then H(q0). Grouping by the computational values measured on q0 and q1 gives

$$
\frac12\big[|00\rangle(\alpha|0\rangle+\beta|1\rangle)
+|01\rangle(\alpha|1\rangle+\beta|0\rangle)
+|10\rangle(\alpha|0\rangle-\beta|1\rangle)
+|11\rangle(\alpha|1\rangle-\beta|0\rangle)\big].
$$

The first two bits are Alice's outcomes. Each branch has probability $1/4$, because the norm of Bob's conditional state is one and the outer coefficient is 1/2. Bob's state is respectively $\psi$, $X\psi$, $Z\psi$, or $XZ\psi$ up to a global sign convention. The correction table is therefore a compact description of the post-measurement state.

## Worked example: teleport |0⟩

For $|\psi\rangle=|0\rangle$, $\alpha=1$ and $\beta=0$. The branches become

| m0m1 | Bob before correction | Correction | Bob after |
| --- | --- | --- | --- |
| 00 | $|0\rangle$ | I | $|0\rangle$ |
| 01 | $|1\rangle$ | X | $|0\rangle$ |
| 10 | $|0\rangle$ | Z | $|0\rangle$ |
| 11 | $|1\rangle$ up to sign | X then Z | $|0\rangle$ up to global phase |

Every branch recovers the input. The random branch is not a failed run; it is the classical information Bob uses to undo the known distortion.

## Second example: teleport |1⟩

For $|\psi\rangle=|1\rangle$, $\alpha=0$ and $\beta=1$. The table becomes

| m0m1 | Bob before correction | Correction | Bob after |
| --- | --- | --- | --- |
| 00 | $|1\rangle$ | I | $|1\rangle$ |
| 01 | $|0\rangle$ | X | $|1\rangle$ |
| 10 | $-|1\rangle$ | Z | $|1\rangle$ up to global phase |
| 11 | $-|0\rangle$ | X then Z | $|1\rangle$ up to global phase |

Basis states are necessary sanity checks, but they are not sufficient. A missing phase correction can look harmless when the input is a basis state because a minus sign may be global.

## Worked phase example: a complex superposition

Take

$$
|\psi\rangle=\frac{\sqrt3}{2}|0\rangle+\frac{i}{2}|1\rangle.
$$

Its Z probabilities are 3/4 and 1/4. Suppose m0m1=10. Before correction, Bob holds $Z|\psi\rangle=[\sqrt3/2,-i/2]^T$. The m0 bit is 1, so Bob applies Z:

$$
Z\begin{bmatrix}\sqrt3/2\\-i/2\end{bmatrix}
=\begin{bmatrix}\sqrt3/2\\i/2\end{bmatrix}=|\psi\rangle.
$$

For m0m1=11, Bob starts with $XZ|\psi\rangle=[-i/2,\sqrt3/2]^T$. X first gives $[\sqrt3/2,-i/2]^T$ and Z gives the original vector. The second calculation checks both correction order and relative phase.

## Why two classical bits are required

Alice has four equally likely branches. One bit can distinguish only two choices, but Bob must know which of I, X, Z or XZ occurred. The bits do not encode $\alpha$ and $\beta$ as classical data; those amplitudes remain protected inside the entangled protocol. Classical communication is the final condition that lets Bob turn a random branch into the intended state.

Before the bits arrive, Bob's unconditioned density matrix is $I/2$, independent of Alice's input. He cannot use his local measurement outcomes to identify $|0\rangle$, $|1\rangle$ or the complex superposition. Once the bits arrive, he conditions on the branch and applies the appropriate correction.

## Interactive prediction

Select an input, choose a measurement branch, and step from the input to Bob's pre-correction state and then to the recovered state. The tracer uses the displayed correction table locally. It does not execute a three-qubit backend circuit.

```interactive
{"widget":"teleportation-tracer","preset":"complex-input"}
```

## Common mistakes

- Calling the measurement bits a readable copy of the unknown state.
- Applying X based on m0 instead of m1, or Z based on m1 instead of m0.
- Forgetting that correction order is stated explicitly as X then Z for branch 11.
- Testing only basis states and missing a relative-phase error.
- Treating classical dashed links as quantum wires.
- Saying teleportation is faster than light because the correlations appear before the bits are compared.

## Summary and glossary

Teleportation starts with an unknown input and a shared Bell pair. Alice's two measurements select one of four correction branches. Bob uses two classical bits to apply X and Z and recover the input up to global phase. The original input is consumed; no copy is created. Bob's local state is maximally mixed before the classical message arrives.

Glossary: input state, Bell resource, Alice, Bob, measurement branch, classical control, conditional correction, global phase, no-cloning, no-signalling.

## Transfer problem

Repeat the complex-input calculation for branch 01. Write Bob's pre-correction vector, apply X, and compare the recovered state with the original up to global phase. Then explain why a test using only $|0\rangle$ could fail to reveal a missing Z correction.

## Assessment

Inline check: name the owner of q0, q1 and q2; write the correction for m0m1=11; and state Bob's unconditioned local density matrix before the bits arrive. If any answer depends on reading $\alpha$ or $\beta$ from the two bits, revisit the branch derivation.

## Lab connection

The current Lab catalogue exposes the [Bell-pair resource challenge](/lab?challenge=bell), which is the executable prerequisite for teleportation. Build and inspect that pair before attempting a future teleportation-specific challenge. The lesson's branch tracer is explanatory only; simulator execution, grading and saved attempts remain in Lab.

## Chapter quiz

Answer each question in this lesson's assessment. The question count follows protocol ownership, branch corrections, phase-sensitive testing and no-signalling coverage rather than a fixed number. Read explanations after submission, then use the tracer to replay any branch that was unclear.

## Sources

- [Quantum teleportation](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/entanglement-in-action/quantum-teleportation). IBM Quantum Learning / John Watrous.
- [Quantum circuits](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/quantum-circuits). IBM Quantum Learning / John Watrous.
