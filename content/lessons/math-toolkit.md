# The mathematics toolkit

## Learning objectives

By the end of this lesson, you should be able to:

- read a complex number and calculate its magnitude and squared magnitude;
- normalize a two-entry statevector;
- interpret a matrix as a transformation; and
- use an inner product as a simple comparison of vectors.

## Why the math matters

Quantum notation can look more advanced than the calculations actually are. For the first chapters, you need a compact toolkit rather than a full linear algebra course. Complex numbers carry phase, vectors list amplitudes in a fixed basis, and matrices describe gates. Normalization is the rule that keeps total probability equal to one.

The point of learning these operations is not to do symbolic algebra for its own sake. Each operation answers a physical question. A squared magnitude predicts a measurement frequency. A matrix-vector product predicts the next state. An inner product tells us how much one state overlaps another. Once these meanings are clear, the notation stops feeling like a wall of symbols.

## Prerequisite recap

You should be comfortable with fractions, square roots and the Pythagorean theorem. Remember that a square root is nonnegative in these examples and that multiplying a vector by a scalar multiplies every entry. If a vector is written as $[a,b]^T$, the transpose indicates a column arrangement and the order means $a$ belongs to $|0\rangle$ while $b$ belongs to $|1\rangle$.

## Notation and vocabulary

A complex number has the form $a+bi$, where $i^2=-1$. Its magnitude is

$$
|a+bi|=\sqrt{a^2+b^2},
\qquad |a+bi|^2=a^2+b^2.
$$

A statevector is an ordered column of amplitudes. Its squared norm is the sum of squared magnitudes. A matrix is a rectangular array that maps one vector to another. A unitary matrix is a quantum-valid transformation because it preserves inner products and therefore normalization.

## Visual explanation before equations

The complex plane gives a useful picture. The horizontal coordinate is the real part, the vertical coordinate is the imaginary part, the distance from the origin is magnitude, and the angle is phase. The same distance with a different angle can produce the same immediate probability but a different later interference pattern.

![A complex amplitude drawn as a vector with magnitude and phase on the complex plane.](/learn/visuals/complex-plane.svg)

Do not square the number itself when it is complex. For $i/2$, ordinary algebra gives $(i/2)^2=-1/4$, but probability uses squared magnitude:

$$
\left|\frac{i}{2}\right|^2=\frac14.
$$

The result is nonnegative, as a probability must be.

## Vectors and normalization

The vector $[1/2,1/2]^T$ has squared norm

$$
\left|\frac12\right|^2+\left|\frac12\right|^2=\frac14+\frac14=\frac12.
$$

It is not a valid standalone qubit state because the total is not one. The norm is the square root of that total, $1/\sqrt2$. Divide each entry by the norm:

$$
\frac{1}{1/\sqrt2}\begin{bmatrix}1/2\\1/2\end{bmatrix}
=
\begin{bmatrix}1/\sqrt2\\1/\sqrt2\end{bmatrix}.
$$

The normalized state has probabilities $1/2$ and $1/2$. The zero vector cannot be normalized because it has no direction and a zero norm.

![A normalization table shows how a raw vector becomes a valid statevector.](/learn/visuals/normalization.svg)

## Matrices as transformations

The Hadamard matrix is

$$
H=\frac{1}{\sqrt2}
\begin{bmatrix}1&1\\1&-1\end{bmatrix}.
$$

Apply it to $|0\rangle=[1,0]^T$ by multiplying rows by the input column:

$$
H\begin{bmatrix}1\\0\end{bmatrix}
=\frac{1}{\sqrt2}\begin{bmatrix}1\\1\end{bmatrix}
=|+\rangle.
$$

The same matrix applied to $|1\rangle$ gives $| - \rangle=[1,-1]^T/\sqrt2$. The minus sign is an amplitude phase, not a negative probability. A matrix acts on the complete vector, so changing the input changes every output amplitude at once.

![Matrix-vector multiplication for H applied to the computational basis states.](/learn/visuals/matrix-action.svg)

## Inner products as comparison

For real two-entry vectors, the inner product is the first entry multiplied by the first entry plus the second multiplied by the second. For complex states, conjugate the entries of the first vector. The inner product of a state with itself is its squared norm. The inner product of $|0\rangle$ and $|1\rangle$ is zero, so they are orthogonal and perfectly distinguishable in the computational basis.

The overlap between $|0\rangle$ and $|+\rangle$ is $1/\sqrt2$. Squaring its magnitude gives $1/2$, exactly the probability that a plus state produces zero in a Z measurement. This is a preview of the general rule: projection onto a measurement state becomes a probability after squared magnitude.

It is useful to separate three kinds of arithmetic. Complex arithmetic changes an amplitude while preserving its real and imaginary parts. Norm arithmetic checks whether a vector can represent a valid state. Matrix arithmetic predicts how a gate redistributes amplitudes. If a result has a negative probability, check the magnitude step. If probabilities do not add to one, check normalization. If a gate result is wrong while the input is normalized, check matrix order and basis order.

## Worked example: normalize [1/2, 1/2]

First calculate the squared norm: $1/2$. Then take its square root: $1/\sqrt2$. Divide each original entry by that number. Both entries become $1/\sqrt2$. Finally square the magnitudes: each contributes $1/2$, so the total is one. If you skip the normalization step and call each raw entry a probability, the total would be $1/2$, which cannot describe all possible outcomes.

## Second example: apply H to a general state

Start with $[\alpha,\beta]^T$. Multiplication gives

$$
H\begin{bmatrix}\alpha\\\beta\end{bmatrix}
=\frac{1}{\sqrt2}
\begin{bmatrix}\alpha+\beta\\\alpha-\beta\end{bmatrix}.
$$

Take $\alpha=\beta=1/\sqrt2$. The first output is 1 and the second is 0, so $H|+\rangle=|0\rangle$. The two input amplitudes add constructively in the first row and cancel in the second. This is the mathematical seed of interference.

## Interactive prediction

Adjust one entry of a small raw vector, then calculate the norm and normalized entries. The component keeps the calculation local to the page. It is a visual check of the same arithmetic, not a connection to the Lab simulator.

```interactive
{"widget":"normalization","preset":"half-half"}
```

## Transfer problem

Try the vector $[1/2,i/2]^T$ without looking at the answer. Its squared norm is $1/2$, so the normalized vector is $[1/\sqrt2,i/\sqrt2]^T$. In the Z basis it is balanced. Now ask what a later H can reveal: the imaginary relative phase means you should not reuse the real-number cancellation shortcut blindly. The representation tells you which operation is safe to apply next.

## Lab connection

In the Lab, use a one-qubit circuit with no gates, then add H. Compare the statevector panel with the measured histogram. The statevector exposes signed or complex amplitudes; the histogram exposes sampled basis outcomes. This is a handoff to the execution environment, not a second implementation of the simulator inside the lesson.

## Common mistakes

- Treating a complex square as a squared magnitude. Probability uses $|z|^2=z^*z$.
- Forgetting that vector order is part of the meaning.
- Normalizing probabilities instead of amplitudes.
- Applying a matrix to one entry and leaving the other untouched.
- Assuming every matrix is a valid gate. Quantum gates must preserve inner products.
- Reading a minus amplitude as a negative probability.

## Summary and glossary

Complex numbers carry magnitude and phase. Vectors package amplitudes in basis order. Normalization makes squared magnitudes sum to one. Matrices transform vectors, and inner products compare vectors or compute projections.

**Magnitude:** distance of a complex number from the origin. **Norm:** length of a vector. **Normalization:** rescaling a nonzero vector to norm one. **Matrix:** a linear transformation written as an array. **Inner product:** a conjugate-aware comparison between vectors. **Unitary:** a norm-preserving transformation used for ideal quantum gates.

## Chapter quiz

Answer every question and use the feedback to check the arithmetic, not just the final option. This chapter uses eight questions because the lesson includes two worked calculations and an interactive normalization check. There is no pass threshold, and retries are encouraged.

## Sources

- [Quantum information: single systems](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information). IBM Quantum Learning / John Watrous.
- [quantum_info API](https://quantum.cloud.ibm.com/docs/en/api/qiskit/quantum_info). IBM Quantum Documentation.
- [Computer Science + QISE Key Concepts K-12 Framework](https://q12education.org/learning-materials/learning-materials-framework/computer-science-qise-key-concepts). Q-12 Education Partnership.
