# Density matrices and reduced states

## Learning objectives

By the end of this chapter, you should be able to construct a density matrix for a pure state or a classical mixture, identify diagonal probabilities and off-diagonal coherence, take a partial trace, and explain why a local Bloch vector can sit at the center even when the joint pair is perfectly prepared.

## Why this concept matters

Statevectors are a beautiful description of an isolated pure state, but they are not the right container for every question. A simulator may prepare a random state from a known ensemble. A measurement may leave one qubit entangled with another. A noise process may turn a pure preparation into a mixed state. If we insist on printing one statevector for every situation, we either hide the uncertainty or accidentally invent a state that was never prepared.

Density matrices give one language for all of these cases. They retain the probabilities of measurement outcomes, the coherence that can later interfere, and the local predictions available after another subsystem is ignored. This is the bridge from “the circuit has a statevector” to “what can this particular observer actually predict?”

## Plain-language intuition

Think of a statevector as a recipe for one coherent wave of amplitudes. A density matrix is a more general record of preparation knowledge and observable relationships. If the recipe is definitely $|\psi\rangle$, the density matrix is $|\psi\rangle\langle\psi|$. If a source flips a coin and prepares $|0\rangle$ or $|1\rangle$, the density matrix averages those two alternatives. The average is not the same thing as the superposition $(|0\rangle+|1\rangle)/\sqrt2$.

That distinction is visible in the off-diagonal entries. A coherent superposition has cross terms that allow later gates to add amplitudes. A classical mixture has only the weighted alternatives. The two preparations can have the same Z-basis histogram while behaving differently after a basis change.

## Prerequisite recap

You already know that a normalized statevector has one amplitude for each basis state and that probabilities come from squared magnitudes. For two qubits, QuantLearn writes entries in $|q_1q_0\rangle$ order: 00, 01, 10, 11. The density-matrix chapter keeps that ordering. A matrix row labels the bra side and a column labels the ket side, so the entry $\rho_{ij}$ connects basis state $i$ to basis state $j$.

## Notation and vocabulary

For a pure state, write

$$
\rho=|\psi\rangle\langle\psi|.
$$

The symbol $\rho$ is the density operator. It is Hermitian, has trace one, and is positive semidefinite. A mixed state is a weighted ensemble:

$$
\rho=\sum_k p_k|\psi_k\rangle\langle\psi_k|,
\qquad p_k\ge 0,
\qquad\sum_kp_k=1.
$$

The diagonal entry $\rho_{ii}$ gives the probability of computational-basis outcome $i$. An off-diagonal entry $\rho_{ij}$ records coherence between basis states $i$ and $j$. A reduced density matrix is obtained with a partial trace, written $\rho_A=\operatorname{Tr}_B(\rho_{AB})$, when only subsystem A is being described.

## Visual explanation before equations

![Statevector, pure density matrix, mixture and reduced-state representations compared side by side.](/learn/visuals/density-matrix-views.svg)

![Partial trace showing how a joint state becomes a local density matrix.](/learn/visuals/reduced-state.svg)

![Pure surface state and maximally mixed center state shown on two Bloch spheres.](/learn/visuals/mixed-bloch.svg)

The visuals give a reading order: first ask which preparation is known, then keep the joint system or discard a subsystem, and only then interpret the matrix entries. The Bloch sphere is still useful for one reduced qubit, but a point at the center means “maximally mixed local predictions,” not “the qubit is absent.”

## Worked example: the Bell state density matrix

Start with

$$
|\Phi^+\rangle=\frac{|00\rangle+|11\rangle}{\sqrt2}.
$$

Write the statevector in the order 00, 01, 10, 11:

$$
v=\begin{bmatrix}1/\sqrt2\\0\\0\\1/\sqrt2\end{bmatrix}.
$$

The density matrix is $vv^\dagger$:

$$
\rho_{\Phi^+}=\frac12
\begin{bmatrix}
1&0&0&1\\
0&0&0&0\\
0&0&0&0\\
1&0&0&1
\end{bmatrix}.
$$

The diagonal is $[1/2,0,0,1/2]$, so a Z measurement gives 00 or 11. The two corner entries are also $1/2$. Those off-diagonal terms are the coherence between the 00 and 11 branches. They are why a later X-basis measurement can show a relationship that the first histogram does not explain.

The trace is the diagonal sum, $1/2+1/2=1$. Squaring the density matrix gives the same matrix, so $\operatorname{Tr}(\rho^2)=1$. That is the purity test for this pure state.

## Second example: a classical 00/11 mixture

Now imagine a classical source that prepares 00 half the time and 11 half the time, with no coherent phase between the two alternatives. Its density matrix is

$$
\rho_{\mathrm{mix}}=\frac12|00\rangle\langle00|+\frac12|11\rangle\langle11|
=\frac12\begin{bmatrix}1&0&0&0\\0&0&0&0\\0&0&0&0\\0&0&0&1\end{bmatrix}.
$$

The diagonal matches $\rho_{\Phi^+}$ exactly. A Z histogram cannot distinguish the preparations. The off-diagonal terms do not match: the mixture has zero 00-to-11 coherence. Its purity is $\operatorname{Tr}(\rho_{\mathrm{mix}}^2)=1/2$, which confirms that it is mixed.

Apply H to both qubits before measuring. The Bell coherence keeps the outcomes correlated in X, while the classical mixture becomes uniform across the four X-basis outcomes. This is not magic information appearing from nowhere. The basis change makes the surviving or missing off-diagonal terms observable.

## Worked reduction: why the local state is I/2

To keep qubit 1 and trace out qubit 0, group the joint basis by the q1 label. For $\Phi^+$, only 00 and 11 appear. The reduced diagonal probabilities are

$$
P(q_1=0)=P(00)+P(01)=\frac12,
\qquad
P(q_1=1)=P(10)+P(11)=\frac12.
$$

The cross terms connect different values of q0, so they disappear when q0 is not observed. The result is

$$
\rho_{q_1}=\operatorname{Tr}_{q_0}(\rho_{\Phi^+})
=\begin{bmatrix}1/2&0\\0&1/2\end{bmatrix}=I/2.
$$

The same reduction occurs for the classical 00/11 mixture. This is the important warning: identical local density matrices do not imply identical joint states. Correlations and coherence may live only in the joint description.

## Interactive prediction

Choose statevector or density-matrix view, then keep both qubits or remove one subsystem. Predict whether the off-diagonal coherence remains visible. The widget computes only the small displayed Bell example in the browser; it does not call a simulator or claim to run a noisy experiment.

```interactive
{"widget":"density-matrix-explorer","preset":"bell-reduction"}
```

## Common mistakes

- Calling every density matrix a mixed state. Pure states also have density matrices.
- Reading every matrix entry as a probability. Only the computational-basis diagonal has that direct meaning.
- Averaging statevectors instead of averaging density matrices. Relative phases can cancel in an ensemble.
- Treating $I/2$ for one qubit as proof that the pair is uncorrelated. It is a local statement.
- Forgetting the basis order before taking a partial trace. A correct formula with swapped labels still produces a misleading result.

## Summary and glossary

A statevector is a compact pure-state description. A density matrix covers pure states, classical mixtures, noisy ensembles and subsystems. The diagonal gives basis probabilities; off-diagonal entries carry coherence. A partial trace removes a subsystem while preserving every prediction available to the subsystem kept. A pure joint state can have a maximally mixed reduced state.

Glossary: density matrix, density operator, pure state, mixed state, coherence, trace, purity, reduced state, partial trace, local state, joint correlation.

## Transfer problem

Compare $|\Psi^+\rangle=(|01\rangle+|10\rangle)/\sqrt2$ with the classical mixture that prepares 01 or 10 with equal probability. Write both 4-by-4 density matrices, identify their common Z histogram, and choose a basis change that could reveal their different coherence. Then explain why each individual reduced state is still $I/2$.

## Assessment

Before the chapter quiz, check yourself: if two preparations have the same diagonal but different off-diagonal entries, what experiment could separate them? If a reduced state is $I/2$, what does it say about a local Z measurement and what does it not say about the joint pair? Your answer should mention basis choice and correlations, not just the word “entangled.”

## Lab connection

The nearest executable handoff is [Create a Bell pair in Lab](/lab?challenge=bell). Build H(q0) followed by CX(q0,q1), then compare the returned statevector and measurement histogram. The Lab owns execution and grading; this lesson supplies the density-matrix reasoning that explains why the local Bloch views can still look maximally mixed.

## Chapter quiz

Answer each question in this lesson's assessment. The number of questions follows the density-matrix concepts rather than a fixed ten-question template. After submission, read every explanation and retry the inline transfer problem if the diagonal, coherence or partial-trace distinction is unclear.

## Sources

- [Quantum information: multiple systems](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/multiple-systems/quantum-information). IBM Quantum Learning / John Watrous.
- [quantum_info API](https://quantum.cloud.ibm.com/docs/en/api/qiskit/quantum_info). IBM Quantum Documentation.
- [visualization API](https://quantum.cloud.ibm.com/docs/en/api/qiskit/visualization). IBM Quantum Documentation.
