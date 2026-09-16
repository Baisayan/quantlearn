# QAOA and combinatorial optimization

## Learning objectives

Encode max-cut, read one cost/mixer layer and understand how classical parameter search fits the quantum circuit.

## A deliberately small optimization problem

Consider one graph edge joining vertices 0 and 1. Assign one bit to each vertex. A cut scores 1 when the bits differ and 0 when they match. For this chapter we maximize

$$
C=(I-Z_0Z_1)/2.
$$

The bitstrings 01 and 10 score 1; 00 and 11 score 0. This toy problem is solved instantly classically. Its purpose is to expose the algorithm's mechanics.

## Turn a graph into a score

A graph consists of vertices connected by edges. A cut puts each vertex into one of two groups; an edge contributes to the score when its endpoints are in different groups. Encode those groups as bits. On this one-edge graph, reading a sampled bitstring is enough to check its score classically.

Z has eigenvalue +1 on zero and -1 on one. Thus $Z_0Z_1$ has value +1 when the two bits match and -1 when they differ. Substitution into $(I-Z_0Z_1)/2$ gives exactly the desired scores zero and one. I means the identity, so it contributes value one here.

An expectation is the probability-weighted average score. With counts 00:10, 01:35, 10:45, 11:10, there are 80 cut samples out of 100 and the estimated expectation is 0.8. The most frequent string is 10, but its frequency of 0.45 is not the total cut score.

## Alternate two transformations

Start in |++>. For one layer, p=1, use

$$
|\gamma,\beta\rangle=e^{-i\beta(X_0+X_1)}e^{-i\gamma C}|++\rangle.
$$

The cost evolution adds phases according to cut score. The mixer combines amplitudes using X rotations. These parameters are angles, not probabilities.

![One QAOA layer with a cost RZZ gate followed by two Rx mixer gates.](/learn/visuals/qaoa-circuit.svg)

Under our convention, the cost block is RZZ(-gamma), up to global phase, and each mixer gate is Rx(2 beta). Some references minimize a ZZ Hamiltonian instead. Their parameter signs and scale need not match ours; changing conventions halfway produces wrong results.

## Check an exact point

For this one-edge model, direct multiplication gives

$$
\langle C\rangle=\frac12+\frac12\sin(4\beta)\sin\gamma.
$$

At gamma=pi/2 and beta=pi/8, the probabilities are [0,1/2,1/2,0]. Every ideal sample is a maximum cut. At beta=0, cost evolution alone leaves all four probabilities at 1/4.

![Cut-score table and exact distributions for zero mixing and an optimal one-edge parameter pair.](/learn/visuals/qaoa-cost.svg)

## The classical loop

Choose angles, prepare and measure the circuit repeatedly, calculate the average objective, then let a classical optimizer propose new angles. Repeat within a budget. Larger p repeats cost and mixer layers, introducing more parameters and greater depth.

The average objective guides optimization; final candidate bitstrings are sampled and their classical scores checked. These are distinct outputs.

## Check the parameter sign

Try the exact formula at beta=pi/8 and gamma=-pi/2. The sine factors are +1 and -1, giving expectation zero. Reversing a convention-dependent parameter sign can therefore change a good setting into a bad one. The optimizer's job is to search settings using the objective actually defined, not a formula copied from a differently signed Hamiltonian.

## Limitations

This exact one-edge solution does not demonstrate a useful quantum advantage. Finite shots, noise, poor optimization and difficult landscapes affect larger problems. Increasing depth does not guarantee that a practical optimizer finds a better solution.

## Summary

Specify the objective and sign convention before writing gates. Distinguish cost phases, mixing, expectation values and sampled solutions. QAOA can be taught and simulated using Aer, Cirq or PennyLane; the Lab currently exposes a small shared gate contract rather than a full optimizer API.

## Chapter quiz

Answer all 10 questions in order: 3 easy checks, 4 medium applications and 3 harder reasoning questions. Use the worked examples if you get stuck. After submitting, read the explanations and revisit the relevant section before retrying.

## Sources

- [A Quantum Approximate Optimization Algorithm](https://arxiv.org/abs/1411.4028). Edward Farhi, Jeffrey Goldstone and Sam Gutmann.
- [Quantum approximate optimization algorithm](https://quantum.cloud.ibm.com/docs/en/tutorials/quantum-approximate-optimization-algorithm). IBM Quantum Documentation.
- [cirq.SimulatesExpectationValues](https://quantumai.google/reference/python/cirq/SimulatesExpectationValues). Google Quantum AI.
