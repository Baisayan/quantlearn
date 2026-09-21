# Quantum bits and state notation

## Learning objectives

By the end of this lesson, you should be able to:

- read ket notation and a two-entry statevector;
- turn complex amplitudes into Z-basis probabilities;
- distinguish global phase from relative phase; and
- use the Bloch sphere as a picture of one pure qubit.

## Why the concept matters

Every Lab circuit begins with a state. Before discussing gates, entanglement or algorithms, you need to know what a simulator is describing when it prints $[\alpha,\beta]^T$. A statevector is not a log of classical values and not a list of probabilities. It is a compact mathematical description that lets us predict the result of many possible measurements.

The distinction becomes especially important when two states produce the same immediate Z histogram but respond differently to a later gate. Learning to read the state first gives you a reliable way to debug circuits. It also explains why the Lab can show a statevector and a histogram without those panels being redundant.

## Prerequisite recap

From the previous lesson, amplitudes become probabilities through squared magnitude and a valid state has total squared norm one. From the math toolkit, you can read a complex number $a+bi$ and understand a two-entry column vector. The computational basis is the pair $|0\rangle,|1\rangle$.

## Notation and vocabulary

Read $|\psi\rangle$ as “the state psi.” A pure qubit can be written in ket form or column form:

$$
|\psi\rangle=\alpha|0\rangle+\beta|1\rangle
\quad\longleftrightarrow\quad
\begin{bmatrix}\alpha\\\beta\end{bmatrix},
\qquad |\alpha|^2+|\beta|^2=1.
$$

The first entry belongs to $|0\rangle$ and the second to $|1\rangle$. A Z-basis measurement returns 0 with probability $|\alpha|^2$ and 1 with probability $|\beta|^2$. A pure state has enough information to predict any ideal measurement, although a physical experiment needs repeated preparations to estimate those predictions.

## Visual explanation before equations

Consider

$$
|\psi\rangle=\frac{\sqrt3}{2}|0\rangle+\frac{i}{2}|1\rangle.
$$

The amplitudes are $\sqrt3/2$ and $i/2$. Their probabilities are $3/4$ and $1/4$. The $i$ does not create a negative probability because $|i/2|^2=1/4$.

![Two complex amplitudes, their squared magnitudes and labeled basis states.](/learn/visuals/statevector.svg)

The second figure shows how the same single-qubit state can be located on a sphere. This is a coordinate picture, not a claim that the qubit is a tiny ball travelling around a globe.

![A Bloch sphere with a single-qubit state at theta pi over three and phi pi over two.](/learn/visuals/qubit-state.svg)

## From amplitudes to the Bloch sphere

Ignoring an overall phase, every pure qubit can be written as

$$
|\psi\rangle=\cos\left(\frac{\theta}{2}\right)|0\rangle
 +e^{i\phi}\sin\left(\frac{\theta}{2}\right)|1\rangle.
$$

The corresponding Bloch coordinates are

$$
(x,y,z)=(\sin\theta\cos\phi,\sin\theta\sin\phi,\cos\theta).
$$

The north pole is $|0\rangle$ and the south pole is $|1\rangle$. The polar angle $\theta$ controls the Z-basis probabilities:

$$
P(0)=\cos^2(\theta/2),\qquad P(1)=\sin^2(\theta/2).
$$

The longitude $\phi$ is relative phase. Moving around a latitude does not change the direct Z probabilities, but it can change the result after an analyzing gate.

## Global phase and relative phase

Multiplying the entire state by $e^{i\gamma}$ gives a global phase:

$$
|\psi\rangle\longrightarrow e^{i\gamma}|\psi\rangle.
$$

This does not change any measurement probability. The states $|+\rangle$ and $i|+\rangle$ represent the same physical state for ordinary predictions. By contrast, changing the phase of only one basis component changes the relationship between the components. The plus and minus states,

$$
|+\rangle=\frac{|0\rangle+|1\rangle}{\sqrt2},
\qquad
|-\rangle=\frac{|0\rangle-|1\rangle}{\sqrt2},
$$

have the same Z probabilities but are different states. A final Hadamard maps them to different basis states.

![Bloch-sphere coordinates connect polar angle, relative phase and measurement probability.](/learn/visuals/qubit-phase.svg)

## Worked example: $[\sqrt3/2,i/2]^T$

Step 1: label the basis order. The vector means $\sqrt3/2$ for $|0\rangle$ and $i/2$ for $|1\rangle$.

Step 2: calculate squared magnitudes. $|\sqrt3/2|^2=3/4$ and $|i/2|^2=1/4$.

Step 3: check the total. $3/4+1/4=1$.

Step 4: interpret a Z measurement. A fresh copy returns 0 about three quarters of the time and 1 about one quarter of the time. A particular shot still returns only one outcome.

The phase on the second amplitude does not appear in this Z histogram. It is still part of the state and can appear after a different measurement basis is selected.

## Second example: $\theta=\pi/3,\phi=\pi/2$

For this point, $\sin\theta=\sqrt3/2$, $\cos\phi=0$ and $\sin\phi=1$. Therefore the coordinates are

$$
(x,y,z)=\left(0,\frac{\sqrt3}{2},\frac12\right).
$$

The Z probabilities are $P(0)=\cos^2(\pi/6)=3/4$ and $P(1)=1/4$. The vector lies on the surface because it represents a pure state. A mixed single-qubit state would be inside the sphere. A multi-qubit state cannot in general be represented by one sphere because correlations need a joint state description.

The sphere is also a warning about scope. It is excellent for one qubit because three real coordinates are enough after removing global phase. Two qubits need a joint description with four complex amplitudes before constraints, and entangled states cannot be reduced to two independent points without losing information. Use the sphere to build intuition for one local state, then return to the joint statevector when several qubits interact.

## Interactive prediction

Move the polar and azimuthal angles and watch the coordinates and Z probabilities update. This makes the separation visible: changing $\phi$ moves the point around a latitude while leaving the direct Z probabilities unchanged. The activity is a teaching visual, not a backend simulator.

```interactive
{"widget":"bloch-state","preset":"single-qubit"}
```

## Transfer problem

Compare $|+\rangle$ and $i|+\rangle$ first, then compare $|+\rangle$ and $|-\rangle$. The first pair differs only by global phase and should behave identically in every measurement. The second pair has a relative sign and should be separated by an H analyzer. If your answer uses only the direct Z histogram, you have not yet used all the state information.

## Lab connection

In the Lab, build $|+\rangle$ with H and inspect the statevector before measuring. Then add a Z gate between two H gates and compare the final result. The Lab's Bloch view is useful for a single-qubit snapshot, while the statevector remains the authoritative representation for complex phase and future multi-qubit lessons.

When reading the panels, follow a fixed order: identify the basis convention, read the amplitudes, square the magnitudes, and only then interpret the histogram. This routine prevents the common mistake of using a probability panel to answer a phase question. It also makes it clear which observation should change when you add an analyzer gate.

## Common mistakes

- Calling the vector entries probabilities. They are amplitudes until squared magnitude is taken.
- Treating the Bloch sphere as a physical trajectory or a multi-qubit replacement.
- Confusing global phase, which is unobservable by itself, with relative phase, which can affect interference.
- Forgetting that the basis order must be stated before reading a statevector.
- Inferring a full state from one histogram in one basis.

## Summary and glossary

A qubit is a normalized two-entry complex statevector. The Born rule turns amplitudes into probabilities for a selected basis. The Bloch sphere represents one pure qubit up to global phase. Polar angle controls Z probabilities, while relative phase controls how later transformations recombine amplitudes.

**Ket:** notation for a state. **Statevector:** ordered amplitude column. **Global phase:** a common complex phase multiplying the whole state. **Relative phase:** phase difference between components. **Bloch vector:** three real coordinates representing a single-qubit state. **Pure state:** a state represented by a point on the sphere surface.

## Chapter quiz

Answer every question and explain each probability using squared magnitudes. This eight-question check follows the notation, examples and Bloch-sphere activity. There is no pass threshold; use the explanations before retrying.

## Sources

- [Quantum information: single systems](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information). IBM Quantum Learning / John Watrous.
- [quantum_info API](https://quantum.cloud.ibm.com/docs/en/api/qiskit/quantum_info). IBM Quantum Documentation.
- [Computer Science + QISE Key Concepts K-12 Framework](https://q12education.org/learning-materials/learning-materials-framework/computer-science-qise-key-concepts). Q-12 Education Partnership.
