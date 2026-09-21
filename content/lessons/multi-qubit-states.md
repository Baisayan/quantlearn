# Multi-qubit states and tensor products

## Learning objectives

By the end of this lesson, you should be able to:

- distinguish a product state from an entangled state;
- calculate a two-qubit tensor product by hand;
- keep basis order consistent when reading amplitudes; and
- explain why an n-qubit register needs $2^n$ amplitudes.

## Why the concept matters

One qubit has two basis states and two amplitudes. A register of two qubits has four basis states, and the statevector must name all four possibilities even when some amplitudes are zero. This is the first point where an apparently small circuit acquires a larger bookkeeping problem.

Tensor products are the rule for combining separate quantum systems. They let you build a joint state before adding controlled gates or entanglement. If the tensor order is reversed, every later probability label can look plausible while being attached to the wrong basis state. This is why QuantLearn repeats its convention throughout the course: q0 is the top wire and least significant bit, while displayed strings are written $|q_1q_0\rangle$.

## Plain-language intuition

Imagine two independent lists of amplitudes. The tensor product does not add the lists. It pairs every amplitude from the first list with every amplitude from the second list. Each pair becomes one amplitude for a joint basis state.

For two qubits there are four pairs: 00, 01, 10 and 11. For three qubits there are eight. The number of coordinates grows exponentially because each extra qubit doubles the number of binary strings that must be represented.

A product state can be separated back into one state per qubit. An entangled state cannot. The tensor-product calculation still gives the right starting point, but later gates can create correlations that no pair of independent single-qubit vectors can capture.

## Prerequisite recap

You can multiply complex numbers, normalize a vector, and read a single-qubit statevector. You also know that measurement probabilities are squared magnitudes and that circuit wire position is not automatically the same as printed bit significance.

## Notation and vocabulary

The tensor product is written $\otimes$. If

$$
|a\rangle=\begin{bmatrix}a_0\\a_1\end{bmatrix},
\qquad
|b\rangle=\begin{bmatrix}b_0\\b_1\end{bmatrix},
$$

then, using the first vector as q1 and the second as q0,

$$
|a\rangle\otimes|b\rangle=
\begin{bmatrix}a_0b_0\\a_0b_1\\a_1b_0\\a_1b_1\end{bmatrix}.
$$

The entries are ordered 00, 01, 10, 11. A product state is separable. An entangled state is a valid joint state that cannot be written as one single-qubit vector tensor another.

## Visual explanation before equations

The tensor product expands every pair of local amplitudes into a joint vector. The table also labels which factor contributes to outcome 10.

![A tensor-product expansion from two one-qubit vectors into four ordered basis amplitudes.](/learn/visuals/tensor-products.svg)

The dimension grows quickly even before any gate is applied. The count is a structural fact about the basis, not a claim that every amplitude will be nonzero.

![The number of computational-basis strings and amplitudes doubles with every added qubit.](/learn/visuals/basis-growth.svg)

Here is a circuit-level view of the convention. q0 is visually on top but is the rightmost bit in a displayed two-qubit string.

![An asymmetric two-qubit circuit showing the declared wire and bitstring convention.](/learn/visuals/multi-qubit.svg)

## Worked example: |0⟩ ⊗ |+⟩

Use $|0\rangle=[1,0]^T$ and $|+\rangle=[1/\sqrt2,1/\sqrt2]^T$. The first factor is q1 and the second is q0:

$$
|0\rangle\otimes|+\rangle
=\begin{bmatrix}1\\0\end{bmatrix}\otimes
\begin{bmatrix}1/\sqrt2\\1/\sqrt2\end{bmatrix}
=\begin{bmatrix}1/\sqrt2\\1/\sqrt2\\0\\0\end{bmatrix}.
$$

Only 00 and 01 have nonzero amplitude. Their probabilities are 1/2 each. The q1 bit is always zero, while q0 is balanced. This is a product state because the vector was built directly from two one-qubit factors.

## Second example: calculate P(10)

Take q1 as $[\sqrt3/2,1/2]^T$ and q0 as $[1/\sqrt2,1/\sqrt2]^T$. The full vector is

$$
\begin{bmatrix}
\sqrt3/(2\sqrt2)\\
\sqrt3/(2\sqrt2)\\
1/(2\sqrt2)\\
1/(2\sqrt2)
\end{bmatrix}.
$$

The basis state 10 means q1=1 and q0=0, so select the third entry, $1/(2\sqrt2)$. Its probability is

$$
P(10)=\left|\frac1{2\sqrt2}\right|^2=\frac18.
$$

The other probabilities are 3/8, 3/8 and 1/8. They sum to one. The order is doing real work: if you selected the second entry instead, you would be calculating P(01), not P(10).

## Normalization and marginal checks

Tensor products preserve normalization. If $u$ and $v$ are normalized one-qubit vectors, then

$$
\lVert u\otimes v\rVert^2=\lVert u\rVert^2\lVert v\rVert^2=1.
$$

For the second example, the four probabilities are $3/8,3/8,1/8,1/8$. Grouping entries by q1 gives $3/8+3/8=3/4$ for q1=0 and $1/8+1/8=1/4$ for q1=1. Grouping by q0 gives $3/8+1/8=1/2$ for q0=0 and $3/8+1/8=1/2$ for q0=1. These marginals match the original one-qubit factors: q1 had probabilities $3/4,1/4$, and q0 was $|+\rangle$ with probabilities $1/2,1/2$.

This is a useful debugging habit. First check that every probability is non-negative and that the total is one. Then sum over the other qubit to recover the marginal you expected. A vector can have the right total while still assigning amplitudes to the wrong basis labels, so normalization alone does not prove that the ordering is correct. Marginal checks expose that mistake quickly, especially when the input factors are intentionally asymmetric.

## Product states and entanglement

A CX applied to a basis product state can produce another basis product state. It does not automatically create entanglement. If a gate acts on a superposition, however, its conditional branches can become correlated. The Bell state $(|00\rangle+|11\rangle)/\sqrt2$ cannot be factored into two independent one-qubit vectors.

The useful diagnostic is not “did I use a two-qubit gate?” It is “can the final joint vector be written as $u\otimes v$?” In later chapters, you will compare joint probabilities, reduced states and phase coherence because a single marginal histogram cannot answer this question.

## Interactive prediction

Choose simple local states for q1 and q0. The builder expands the tensor product, prints the fixed basis order and highlights P(10). It is a small calculation aid, not a general-purpose multi-qubit simulator.

```interactive
{"widget":"tensor-builder","preset":"q1-zero-q0-plus"}
```

## Common mistakes

- Adding vectors instead of taking their tensor product.
- Writing q0 first in the statevector while interpreting entries as q1q0.
- Calling every two-qubit state with four entries entangled.
- Forgetting that probability is squared magnitude of the selected joint amplitude.
- Assuming a zero amplitude means the basis state does not exist.
- Increasing qubit count without acknowledging the $2^n$ representation cost.

## Summary and glossary

Tensor products combine local amplitudes into a joint state. The declared factor order determines which entry represents each bitstring. Two qubits need four amplitudes and n qubits need $2^n$. A product state factors into subsystem states; an entangled state does not, even though both live in the same joint vector space.

**Tensor product:** ordered pairing of subsystem amplitudes. **Product state:** separable joint state. **Joint basis:** the combined set of bitstrings. **Register dimension:** the number of amplitudes needed to describe the basis, $2^n$ for n qubits.

## Transfer problem

Calculate $|+\rangle\otimes|1\rangle$ in 00, 01, 10, 11 order. Then identify P(01) and explain why P(10) is zero. As a debugging prompt, write the factor order above the vector before doing any multiplication. If you reverse the factors, the numbers may look the same while the labels change.

## Assessment

Use the tensor builder for $|0\rangle\otimes|+\rangle$ and $|+\rangle\otimes|1\rangle$ before the quiz. The inline check should make the basis order visible so the ten-question assessment can focus on reasoning rather than memorizing a four-entry list.

## Lab connection

In the Lab, start with two qubits and build a product state using single-qubit gates. Inspect the full statevector in 00, 01, 10, 11 order before adding a controlled gate. If a probability appears in the wrong slot, check factor order and the declared q0 convention before changing the circuit.

## Chapter quiz

Answer every question in order. This ten-question assessment covers tensor multiplication, basis order, $2^n$ scaling, product states, joint probabilities and the boundary between product and entangled states.

## Sources

- [Quantum information: multiple systems](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/multiple-systems/quantum-information). IBM Quantum Learning / John Watrous.
- [quantum_info API](https://quantum.cloud.ibm.com/docs/en/api/qiskit/quantum_info). IBM Quantum Documentation.
- [Computer Science + QISE Key Concepts K-12 Framework](https://q12education.org/learning-materials/learning-materials-framework/computer-science-qise-key-concepts). Q-12 Education Partnership.
