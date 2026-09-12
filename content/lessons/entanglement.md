# Entanglement and Bell states

## Learning objectives

Prepare a Bell state, distinguish entanglement from ordinary correlation, and interpret a subsystem's Bloch sphere.

## Build a Bell pair

Begin with 00. Apply H to q0 and CX from q0 to q1:

$$
|00\rangle\longrightarrow\frac{|00\rangle+|01\rangle}{\sqrt2}
\longrightarrow|\Phi^+\rangle=\frac{|00\rangle+|11\rangle}{\sqrt2}.
$$

![Bell preparation circuit with explicit control and target.](/learn/visuals/bell-circuit.svg)

The final state cannot be written as a product of two single-qubit vectors. For a pure two-qubit vector with coefficients a00, a01, a10, a11, a product factorization would require a00 a11 = a01 a10. Here the left side is 1/2 and the right side is zero.

## Correlation alone is insufficient

In Z measurements, this Bell state returns 00 or 11 with equal probabilities. So does a classical source that prepares 00 half the time and 11 half the time. The Z histogram alone cannot distinguish them.

Measure both qubits in X by applying H to each before Z measurement. The Bell state still produces matching outcomes. The classical mixture now gives 00, 01, 10 and 11 equally.

![Bell and classical-mixture probabilities in ZZ and XX measurement settings.](/learn/visuals/bell-correlations.svg)

These two settings distinguish the specific examples shown. They are not a universal entanglement detector or a loophole-free Bell test.

## Why the product test works here

A product state has coefficients $ac,ad,bc,bd$. Multiplying its 00 and 11 coefficients gives $abcd$, exactly the same as multiplying its 01 and 10 coefficients. For a nonzero pure two-qubit vector, this equality is also sufficient for a product factorization.

For example, $[1/2,1/2,1/2,1/2]^T$ passes the test: both products are $1/4$. It is simply plus on each qubit. Four nonzero entries do not by themselves establish entanglement. The Bell vector fails the test. This shortcut is for pure two-qubit vectors, not a general test for arbitrary mixed states.

## A first look at density matrices

For a pure vector, form a matrix by multiplying each amplitude by the complex conjugate of each amplitude. Diagonal entries are the basis probabilities. Off-diagonal entries retain relationships between amplitudes that those probabilities omit. For a classical mixture, average the matrices of the possible preparations with their probabilities.

The equal 00/11 mixture has diagonal entries $[1/2,0,0,1/2]$ and no off-diagonal entries. Phi-plus has the same diagonal but also entries $1/2$ connecting 00 with 11. These different joint matrices explain why a second measurement setting can matter.

A reduced density matrix keeps only predictions for one subsystem. Both examples give I/2 for each individual qubit. Consequently, even knowing both separate local states does not recover their joint coherence.

## What a local sphere can show

For either qubit of the Bell pair, the reduced density matrix is $I/2$. Its Bloch vector is at the center, not an arrow to a definite surface point. Neither qubit has its own pure statevector even though the pair has a pure joint state.

Density matrices describe mixtures and subsystems. The Bell density matrix contains coherence between 00 and 11. The classical mixture lacks those off-diagonal terms.

## Related Bell states

Changing a relative sign gives $|\Phi^-\rangle=(|00\rangle-|11\rangle)/\sqrt2$. Exchanging one wire's basis values gives $|\Psi^\pm\rangle=(|01\rangle\pm|10\rangle)/\sqrt2$. All four are entangled, but their correlations depend on the chosen measurement basis.

## Common misconception

Entanglement does not let one party choose a remote measurement outcome or transmit a message faster than light. Local outcomes remain random; comparing correlations requires communication.

## Summary

A joint state contains information that separate one-qubit descriptions can lose. Use basis-sensitive comparisons to investigate coherence and avoid identifying entanglement from a single histogram.

## Chapter quiz

Answer all 10 questions in order: 3 easy checks, 4 medium applications and 3 harder reasoning questions. Use the worked examples if you get stuck. After submitting, read the explanations and revisit the relevant section before retrying.

## Sources

- [Quantum information: multiple systems](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/multiple-systems/quantum-information). IBM Quantum Learning / John Watrous.
- [quantum_info API](https://quantum.cloud.ibm.com/docs/en/api/qiskit/quantum_info). IBM Quantum Documentation.
