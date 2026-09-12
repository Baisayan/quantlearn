# Quantum bits and state notation

## Learning objectives

Read a statevector, calculate measurement probabilities, and explain what one qubit can reveal.

## Reading the notation

Read $|\psi\rangle$ aloud as "the state psi." The vertical line and bracket are notation, not an absolute-value calculation. By contrast, $|\alpha|$ means the magnitude of a number. The superscript T turns a written row into a column. You only need to track two entries at this stage.

The symbol $i$ satisfies $i^2=-1$. Its magnitude is one. This explains why an imaginary amplitude can give a positive probability. A square root reverses squaring: $(\sqrt3/2)^2=3/4$.

## From a bit to a qubit

A classical bit has a value of 0 or 1. A qubit is a physical system with two distinguishable basis states, written $|0\rangle$ and $|1\rangle$. A pure qubit state is described by two complex amplitudes:

$$
|\psi\rangle=\alpha|0\rangle+\beta|1\rangle,\qquad |\alpha|^2+|\beta|^2=1.
$$

The column vector $[\alpha,\beta]^T$ and the ket describe the same state. Amplitudes can carry phase; probabilities are nonnegative real numbers. A measurement in this basis returns one classical outcome. It does not print both amplitudes.

## A small math refresher

For a complex number $a+bi$, its squared magnitude is $a^2+b^2$. For example, $|i/2|^2=1/4$, not $-1/4$. A vector is an ordered list. Its order matters: the first entry below belongs to $|0\rangle$, the second to $|1\rangle$.

For example:

$$
|\psi\rangle=\frac{\sqrt3}{2}|0\rangle+\frac{i}{2}|1\rangle.
$$

The squared magnitudes are $3/4$ and $1/4$, which sum to one. If many independent copies are measured in the Z basis, approximately 75% return 0. This is a prediction about a distribution, not a promise about the next four outcomes.

![Two complex amplitudes, their squared magnitudes and labeled basis states.](/learn/visuals/statevector.svg)

## Check normalization yourself

Try the vector $[3/5,4/5]^T$. Its squared magnitudes are $9/25$ and $16/25$, which add to one. Its probability of zero is therefore $9/25$, not $3/5$.

Now try $[1/2,1/2]^T$. The total is only $1/2$, so this is not yet a normalized state. To normalize a nonzero vector, divide each entry by the square root of its total squared magnitude. Here that means multiplying each entry by $\sqrt2$, giving $[1/\sqrt2,1/\sqrt2]^T$. The zero vector cannot be normalized.

For the sphere formula below, first check the poles: theta=0 gives zero with certainty and theta=pi gives one with certainty. The longitude phi does not affect direct Z probabilities. You can use these checks before calculating any three-dimensional coordinates.

## The Bloch representation

Ignoring overall phase, every pure qubit can be written as

$$
|\psi\rangle=\cos(\theta/2)|0\rangle+e^{i\phi}\sin(\theta/2)|1\rangle.
$$

Its Bloch coordinates are $(\sin\theta\cos\phi,\sin\theta\sin\phi,\cos\theta)$. Our example has $\theta=\pi/3$ and $\phi=\pi/2$. The arrow lies on the surface. Its north/south position determines the Z measurement probabilities; moving around a latitude changes relative phase.

![Bloch sphere with the example state at theta pi/3 and phi pi/2.](/learn/visuals/qubit-state.svg)

This sphere is a representation of a state, not a picture of a particle orbit. A strictly mixed qubit lies inside the sphere; pure states lie on its surface. Multi-qubit states need a larger description; one sphere cannot represent all their correlations.

## Common misconception

A qubit is not a way to read unlimited classical information from one measurement. Algorithms must arrange interference so that useful properties become observable.

## Summary

Keep amplitudes, probabilities and observed outcomes distinct. Normalize with squared magnitudes. Use the Bloch sphere for a single qubit and always label the measurement basis.

## Chapter quiz

Answer all 10 questions in order: 3 easy checks, 4 medium applications and 3 harder reasoning questions. Use the worked examples if you get stuck. After submitting, read the explanations and revisit the relevant section before retrying.

## Sources

- [Quantum information: single systems](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information). IBM Quantum Learning / John Watrous.
- [quantum_info API](https://quantum.cloud.ibm.com/docs/en/api/qiskit/quantum_info). IBM Quantum Documentation.
- [Computer Science + QISE Key Concepts K-12 Framework](https://q12education.org/learning-materials/learning-materials-framework/computer-science-qise-key-concepts). Q-12 Education Partnership.
