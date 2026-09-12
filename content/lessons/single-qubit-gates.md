# Single-qubit gates

## Learning objectives

Apply I, X, Y, Z and H, understand unitarity, and recognize order-sensitive circuits.

## Gates transform amplitudes

A unitary gate acts by matrix multiplication. For an ideal closed system, its matrix satisfies $U^\dagger U=I$. This preserves normalization and gives an inverse. Measurement is not a unitary gate.

The Pauli gates and Hadamard are

$$
X=\begin{pmatrix}0&1\\1&0\end{pmatrix},\quad
Y=\begin{pmatrix}0&-i\\i&0\end{pmatrix},\quad
Z=\begin{pmatrix}1&0\\0&-1\end{pmatrix},\quad
H=\frac1{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix}.
$$

I leaves the state unchanged. X exchanges the two amplitudes. Z changes the sign of the second amplitude. Y combines an exchange with phase factors.

![Gate effects on the zero and one basis states.](/learn/visuals/gate-reference.svg)

## How to multiply a gate and a state

For a two-by-two matrix with rows $(u,v)$ and $(w,z)$, acting on $[\alpha,\beta]^T$ gives $[u\alpha+v\beta,w\alpha+z\beta]^T$. Work one row at a time. For X, the first row selects beta and the second selects alpha. For Y on zero, multiplying by $[1,0]^T$ selects the first column of Y, which is $[0,i]^T$. Thus $Y|0\rangle=i|1\rangle$.

The dagger in $U^\dagger$ means transpose the matrix and conjugate each entry. Conjugation replaces $a+bi$ with $a-bi$. You do not need to memorize this notation separately from its purpose: $U^\dagger$ undoes U for a unitary gate.

A reversible gate cannot send both zero and one to the same zero state. If it did, its inverse could not determine which input to recover. Resetting a qubit is a different kind of operation from applying an isolated unitary. Measurement also produces a recorded outcome and a conditional state, rather than acting as one reversible matrix on the qubit alone.

When checking a cancellation, test the complete matrix or general amplitudes. Matching one input's histogram is weaker evidence and can miss a phase error.

## Work an example instead of memorizing a label

Let $|\psi\rangle=(\sqrt3|0\rangle+i|1\rangle)/2$. After X, the vector becomes $[i/2,\sqrt3/2]^T$. Its Z probabilities are now 1/4 and 3/4. After Z instead, the vector is $[\sqrt3/2,-i/2]^T$, whose Z probabilities remain 3/4 and 1/4.

An unchanged histogram therefore does not imply that a gate did nothing. A subsequent basis change can reveal the phase difference.

## Order changes a computation

Starting from 0, apply X and then H: the result is $|-\rangle$. Apply H and then X instead: the result is $|+\rangle$. Both look 50/50 in a Z histogram. A final H distinguishes them: the first path gives 1 and the second gives 0.

![Two gate orders with a final Hadamard analyzer yield different outcomes.](/learn/visuals/gate-order.svg)

In operator notation these paths are $HX|0\rangle$ and $XH|0\rangle$. The rightmost operator acts first. Circuit time goes left to right.

## Reversibility and cancellation

Each of X, Y, Z and H squares to I. Two adjacent identical gates cancel ideally. Cancellation is a statement about the complete transformation, not merely one input's probabilities. Real implementations may still accumulate noise while executing those gates.

## Summary

Track the full state, including phase. Unitary gates preserve total probability. Gate order and the final measurement basis jointly determine what you observe.

## Chapter quiz

Answer all 10 questions in order: 3 easy checks, 4 medium applications and 3 harder reasoning questions. Use the worked examples if you get stuck. After submitting, read the explanations and revisit the relevant section before retrying.

## Sources

- [Gates and operations](https://quantumai.google/cirq/build/gates). Google Quantum AI.
- [Quantum circuits](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/quantum-circuits). IBM Quantum Learning / John Watrous.
