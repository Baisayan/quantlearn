# Single-qubit gates

## Learning objectives

By the end of this lesson, you should be able to:

- read the matrices for I, X, Y, Z and H;
- apply a gate to a general two-entry statevector;
- explain unitarity, inverses and ideal cancellation; and
- predict why gate order can change a later measurement.

## Why the concept matters

Gates are the verbs of a quantum program. A state tells you what is present; a gate tells you how amplitudes change. Memorizing a gate chart is useful only after you understand the matrix action underneath. That action explains why X swaps basis states, why Z can change phase without changing a Z histogram, and why H turns phase into an observable result.

This chapter also introduces a debugging habit that scales. Never validate a circuit only on $|0\rangle$. Apply the operation to a basis state, then to a superposition or general vector, and check the full statevector. A gate that looks correct on one input can still have the wrong phase convention.

## Plain-language intuition

An ideal gate is a reversible transformation of amplitudes. It does not inspect a qubit and pick a classical answer. It applies the same linear rule to every possible input branch. Because the rule is reversible, different input states stay distinguishable and total probability remains one.

The five gates in this chapter are a small vocabulary. I does nothing, X swaps 0 and 1, Z flips the phase of 1, Y swaps with imaginary phase factors, and H creates or analyzes equal superpositions. Their combinations are more important than their labels.

## Prerequisite recap

You know how to represent a qubit as $[\alpha,\beta]^T$, calculate squared magnitudes, and interpret relative phase. You also know that circuit time reads left to right while an operator product places the first operation on the right.

## Notation and vocabulary

The standard matrices are

$$
I=\begin{bmatrix}1&0\\0&1\end{bmatrix},\quad
X=\begin{bmatrix}0&1\\1&0\end{bmatrix},\quad
Y=\begin{bmatrix}0&-i\\i&0\end{bmatrix},
$$

$$
Z=\begin{bmatrix}1&0\\0&-1\end{bmatrix},\quad
H=\frac1{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}.
$$

The dagger $U^\dagger$ means conjugate transpose. A unitary gate satisfies $U^\dagger U=I$. The identity $I$ is the do-nothing transformation, not a measurement or a reset.

## Visual explanation before equations

Start with basis actions. X exchanges the basis states, Z keeps $|0\rangle$ and negates $|1\rangle$, Y adds $i$ or $-i$, and H creates the plus/minus pair.

![Basis-state actions for I, X, Y, Z and H.](/learn/visuals/gate-reference.svg)

The same gates act on every amplitude at once. This table is the bridge from a gate name to a statevector calculation.

![General statevector action for the main single-qubit gates.](/learn/visuals/gate-action.svg)

Unitarity is not an optional implementation detail. It is why a gate can be reversed and why the probabilities remain normalized.

![Unitary checks showing reversibility, norm preservation and no reset by ideal gates.](/learn/visuals/gate-unitarity.svg)

## Eigenstates and the geometric intuition

Some states are especially useful because a gate leaves their direction unchanged, possibly adding a phase. These are eigenstates. Z has $|0\rangle$ and $|1\rangle$ as eigenstates: $Z|0\rangle=|0\rangle$ and $Z|1\rangle=-|1\rangle$. H instead exchanges the plus and minus directions: $H|+\rangle=|0\rangle$ and $H|-\rangle=|1\rangle$. Thinking in these named states makes a long matrix multiplication easier to predict before calculating it.

On the Bloch sphere, X, Y and Z are half-turns around the corresponding axes, while H swaps the roles of the Z and X measurement axes. This geometric picture does not replace the statevector: it is a second representation for a single qubit that helps explain why a phase change can be invisible in one basis and obvious in another. When a later lesson uses two or more qubits, keep the matrix and tensor-product description as the authoritative representation.

## Worked example: apply X, Z and H to a general state

Let

$$
|\psi\rangle=\alpha|0\rangle+\beta|1\rangle
=\begin{bmatrix}\alpha\\\beta\end{bmatrix}.
$$

Applying X gives

$$
X|\psi\rangle=\begin{bmatrix}\beta\\\alpha\end{bmatrix}.
$$

Applying Z gives

$$
Z|\psi\rangle=\begin{bmatrix}\alpha\\-\beta\end{bmatrix}.
$$

Applying H gives

$$
H|\psi\rangle=\frac1{\sqrt2}\begin{bmatrix}\alpha+\beta\\\alpha-\beta\end{bmatrix}.
$$

Notice the different roles. X changes which amplitude belongs to each basis state. Z changes only relative phase. H adds and subtracts amplitudes, so it can expose cancellation.

## Second example: verify Y|0⟩ and compare probabilities

The vector for $|0\rangle$ is $[1,0]^T$. Multiplying by the first column of Y gives

$$
Y|0\rangle=\begin{bmatrix}0\\i\end{bmatrix}=i|1\rangle.
$$

The global factor $i$ does not change the final measurement probabilities, so a Z measurement still returns 1 with certainty. But the phase is part of the statevector and can matter when Y is followed by other gates.

Take $|\psi\rangle=(\sqrt3|0\rangle+i|1\rangle)/2$. X produces $[i/2,\sqrt3/2]^T$, so the Z probabilities become $[1/4,3/4]$. Z produces $[\sqrt3/2,-i/2]^T$, so the probabilities remain $[3/4,1/4]$. An unchanged histogram does not prove that Z did nothing.

## Why gate order matters

From $|0\rangle$, X then H gives

$$
H X|0\rangle=H|1\rangle=|-\rangle.
$$

H then X gives

$$
X H|0\rangle=X|+\rangle=|+\rangle.
$$

Both states are 50/50 in Z, so a direct histogram hides the difference. Apply a final H as an analyzer: $|-\rangle$ becomes $|1\rangle$, while $|+\rangle$ becomes $|0\rangle$.

![Two gate orders become distinguishable after a final Hadamard analyzer.](/learn/visuals/gate-order.svg)

## Reversibility and cancellation

For the standard matrices, $X^2=Y^2=Z^2=H^2=I$. Two identical gates cancel in the ideal model for every input, not just for $|0\rangle$. The statement is about the full matrix product. On hardware, each physical operation can add noise, so an ideal cancellation is a target rather than a promise about a measured device.

Measurement and reset are not exceptions to a forgotten rule. They are different operations because they either create a classical record or discard information. A unitary cannot map both orthogonal basis states to the same output and remain invertible.

## Interactive prediction

Choose a gate and a basis input, predict the output, then compare with the matrix action. After trying basis states, repeat the calculation for a general vector using the formulas above.

```interactive
{"widget":"gate-explorer","preset":"basis-actions"}
```

## Common mistakes

- Treating X as a classical bit flip without tracking the full amplitude vector.
- Calling Z ineffective because its immediate Z probabilities are unchanged.
- Forgetting the $i$ in $Y|0\rangle=i|1\rangle$.
- Writing H X when the circuit time is H then X. The rightmost operator acts first.
- Assuming any matrix that preserves one input is unitary.
- Testing a cancellation only on $|0\rangle$ and missing a phase error on a superposition.

## Summary and glossary

I, X, Y, Z and H are unitary single-qubit transformations. Their matrix action must be applied to the complete amplitude vector. X exchanges amplitudes, Z changes relative phase, Y combines exchange with imaginary factors, and H adds and subtracts paths. Unitarity preserves normalization and reversibility; order determines the operator product.

**Gate:** a state transformation. **Dagger:** conjugate transpose. **Unitary:** a matrix with a unitary inverse. **Basis action:** the result of applying a gate to $|0\rangle$ or $|1\rangle$. **Analyzer:** a later operation that makes a hidden phase difference measurable.

## Transfer problem

Start with $[\alpha,\beta]^T$ and calculate $XH|\psi\rangle$ and $HX|\psi\rangle$. Which terms are added and which are subtracted? Choose $\alpha=1/\sqrt2$ and $\beta=i/\sqrt2$ as a varied example. Your debugging prompt is: did you multiply the rightmost matrix first, and did you keep complex conjugation out of ordinary matrix multiplication?

## Assessment

Before the quiz, use the gate picker to check one basis action and one phase-sensitive action. Then explain why $U^\dagger U=I$ is stronger evidence than matching one histogram. The ten-question assessment should confirm this reasoning rather than introduce it.

## Lab connection

In the Lab, add X, Z and H one at a time and inspect the statevector after each run. Compare X then H with H then X, and add a final H to make the difference visible. If the output is wrong, check gate order, basis convention and whether the panel is showing exact state data or finite shots.

## Chapter quiz

Answer every question in order. This ten-question assessment covers matrix definitions, general state action, Y phase, unitarity, gate order and ideal versus physical cancellation. Review each explanation before retrying.

## Sources

- [Gates and operations](https://quantumai.google/cirq/build/gates). Google Quantum AI.
- [Quantum circuits](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/quantum-circuits). IBM Quantum Learning / John Watrous.
