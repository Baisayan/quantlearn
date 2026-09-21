# Bell states and correlations

## Learning objectives

By the end of this chapter, you should be able to name and prepare the four Bell states, predict their Z and X basis correlations, compare a Bell state with a classical 00/11 mixture, and explain why the displayed comparison is evidence about specific preparations rather than a universal Bell test.

## Why this concept matters

Entanglement is often introduced as “spooky correlation,” but that phrase hides the engineering problem. A learner needs to know which state was prepared, which basis was measured, and what information is missing from a single histogram. Bell states make those questions concrete. They are small enough to calculate by hand and rich enough to show that a pair can have a pure joint state while each local qubit has no definite pure state.

This matters in the Lab because a circuit that returns matching 00 and 11 counts may be correct, accidentally classical, or wrong in phase. The circuit and the measurement basis must be interpreted together. Bell states also become the resource for teleportation, so learning to diagnose them now prevents memorizing later correction tables without understanding where they came from.

## Plain-language intuition

Start with two separate qubits. A controlled gate can make the alternatives move together, but “move together” is not automatically entanglement. A classical source can also choose two matching strings. The quantum difference is coherence between alternatives: the pair is one joint object, not a hidden coin flip whose value was selected in advance.

The four Bell states come in two parity families. The Phi states use 00 and 11, so Z measurements match. The Psi states use 01 and 10, so Z measurements differ. The plus or minus sign is a relative phase. It may be invisible in Z but visible after applying H to both qubits and measuring in X.

## Prerequisite recap

You should be comfortable with tensor products, CX control and target semantics, density matrices and the QuantLearn convention: q0 is the top wire and least significant bit, while display strings are written $|q_1q_0\rangle$. You also know that measurement probabilities are squared amplitudes and that a density matrix can retain coherence that a histogram omits.

## Notation and vocabulary

The four Bell states are

$$
|\Phi^+\rangle=\frac{|00\rangle+|11\rangle}{\sqrt2},\quad
|\Phi^-\rangle=\frac{|00\rangle-|11\rangle}{\sqrt2},
$$

$$
|\Psi^+\rangle=\frac{|01\rangle+|10\rangle}{\sqrt2},\quad
|\Psi^-\rangle=\frac{|01\rangle-|10\rangle}{\sqrt2}.
$$

“Correlation” here means a relationship between recorded outcomes in a selected basis. “Entanglement” means a joint state cannot be written as a product of independent subsystem states. “Coherence” means the relative phase between branches remains part of the joint state. These words overlap in examples but are not interchangeable.

## Visual explanation before equations

![The four Bell states grouped by parity, phase sign and computational-basis support.](/learn/visuals/bell-states.svg)

![A circuit that prepares the Phi-plus Bell state from two zero qubits.](/learn/visuals/bell-circuit.svg)

![Bell-state and classical-mixture probabilities compared in ZZ and XX bases.](/learn/visuals/bell-correlations.svg)

![A basis-selection table showing which Bell correlations survive Z and X measurements.](/learn/visuals/bell-bases.svg)

The first figure tells you which labels differ. The circuit shows how a specific pair is prepared. The comparison then asks whether a selected measurement basis exposes the relative phase. This sequence is more reliable than calling a pair entangled after seeing one pair of matching bars.

## Worked example: prepare Phi-plus

Begin with $|00\rangle$. Apply H to q0:

$$
|00\rangle\longrightarrow\frac{|00\rangle+|01\rangle}{\sqrt2}.
$$

Because q0 is the rightmost bit, the second branch is 01. Now apply CX with q0 as control and q1 as target. The 00 branch has control 0 and remains 00. The 01 branch has control 1, so CX flips q1 and becomes 11:

$$
\frac{|00\rangle+|01\rangle}{\sqrt2}
\longrightarrow
\frac{|00\rangle+|11\rangle}{\sqrt2}=|\Phi^+\rangle.
$$

The Z probabilities are $P(00)=1/2$, $P(11)=1/2$, and zero for 01 and 10. To test whether this is the coherent Bell state rather than a classical 00/11 source, do not stop there. Apply H to both qubits before Z measurement. This is an X-basis measurement. Phi-plus is an eigenstate of X⊗X with eigenvalue +1, so the two X outcomes match.

## Second example: Phi-minus versus Psi-plus

The state $\Phi^-$ has the same Z probabilities as $\Phi^+$ because the sign disappears when amplitudes are squared. After measuring in X, the sign matters. Apply H⊗H. The state $\Phi^-$ changes into the pattern with opposite X outcomes, so the labels 01 and 10 are the likely results.

Now compare $\Psi^+=(|01\rangle+|10\rangle)/\sqrt2$. In Z, the bits differ by construction. In X, the plus sign makes them match. This is a useful varied example: the same relative sign does not mean the same Z correlation because the support moved from even parity to odd parity.

The minus version $\Psi^-$ differs in both parity and X-basis sign pattern. It is also special because it is antisymmetric under swapping the two qubits. For beginner work, the safe method is still to write the vector, apply the basis-change matrix, and then read the probabilities rather than relying on a memorized slogan.

## Why one histogram is insufficient

The coherent Bell state and the equal classical mixture

$$
\rho_{\mathrm{mix}}=\tfrac12|00\rangle\langle00|+\tfrac12|11\rangle\langle11|
$$

produce the same ZZ distribution. Their joint density matrices differ in the off-diagonal 00-to-11 terms. After H on both qubits, Phi-plus still gives matching outcomes, while the mixture gives all four outcomes with probability 1/4. The basis change converts coherence into a measurable population difference.

This is a deliberately chosen comparison, not a universal entanglement detector. A finite sample can fluctuate. A restricted set of settings can miss a different state. A loophole-free Bell inequality test also requires a carefully specified experimental design and assumptions. In this lesson, the honest claim is narrower: these two displayed preparations are distinguished by the shown measurements.

## Entanglement versus ordinary correlation

For a pure two-qubit vector with coefficients $a_{00},a_{01},a_{10},a_{11}$, separability requires

$$
a_{00}a_{11}=a_{01}a_{10}.
$$

For Phi-plus, the left side is 1/2 and the right side is 0, so the state cannot factor into one vector for q1 and another for q0. For the uniform vector $[1/2,1/2,1/2,1/2]^T$, both sides are 1/4 and the state is simply $|+\rangle\otimes|+\rangle$. Equal amplitudes do not prove entanglement.

The local density matrices of every Bell state are $I/2$. This does not mean that the pair is a classical mixture. It means a single local observer sees random results in each one-qubit basis. The joint correlations require comparing both records.

## Interactive prediction

Choose a Bell state, choose Z or X, and compare it with the classical 00/11 mixture. Predict whether the results match, differ, or become uniform before the displayed outcome appears. The component is a local correlation table, not a backend simulation.

```interactive
{"widget":"bell-explorer","preset":"basis-comparison"}
```

## Common mistakes

- Calling matching Z counts proof of entanglement. Classical mixtures can match them.
- Forgetting that the plus or minus sign is a relative phase, not a probability sign.
- Reversing q0 and q1 when reading the Bell preparation circuit.
- Calling the selected Z/X comparison a universal Bell test.
- Assuming a maximally mixed local state means the joint state has no useful structure.

## Summary and glossary

Bell states are four maximally entangled two-qubit states. Phi states use matching computational bits; Psi states use different bits. Relative phase changes what happens after a basis change. A Bell histogram is meaningful only with its basis and preparation context. Entanglement is a property of the joint state, not of one local Bloch vector.

Glossary: Bell state, parity, correlation, coherence, relative phase, separable state, entangled state, measurement basis, classical mixture, Bell test.

## Transfer problem

Prepare $\Phi^-$ and predict the ZZ and XX distributions. Then prepare $\Psi^+$ and repeat. Explain which change comes from moving the support between even and odd parity and which change comes from the relative sign. Finally, describe one measurement setting that would fail to distinguish a selected Bell state from a classical mixture.

## Assessment

Inline check: if a pair produces only 00 and 11 in Z, list two distinct preparations that could cause it. If a plus state becomes a minus state without changing its Z histogram, name the analyzer that makes the phase visible. If your answer does not mention the measurement basis, revisit the “one histogram” section.

## Lab connection

Finish with [Create a Bell pair in Lab](/lab?challenge=bell). The Lab challenge asks for $\Phi^+$ and checks more than matching counts: inspect the returned statevector and compare the result with the expected phase-sensitive preparation. Use the lesson link above the challenge to return to the basis comparison.

## Chapter quiz

Answer each question in this lesson's assessment. The question count follows the four-state and basis-comparison coverage, not a fixed number. Read the explanations after submission, then retry the transfer problem using a statevector rather than a single histogram.

## Sources

- [Quantum information: multiple systems](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/multiple-systems/quantum-information). IBM Quantum Learning / John Watrous.
- [quantum_info API](https://quantum.cloud.ibm.com/docs/en/api/qiskit/quantum_info). IBM Quantum Documentation.
