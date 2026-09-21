# QAOA and combinatorial optimization

The Quantum Approximate Optimization Algorithm turns a discrete optimization problem into a parameterized circuit. It does not remove the need to define a useful cost function or to search over parameters. Instead, it gives a family of quantum states whose measured bitstrings can be scored by a classical routine. A small MaxCut graph makes every piece visible.

## Learning objectives

By the end of this lesson you should be able to:

- encode a one-edge MaxCut objective with Pauli Z terms;
- explain the cost and mixer layers and the roles of `γ` and `β`;
- calculate the exact p=1 expected score for the one-edge example;
- distinguish a sampled bitstring score from the expected score; and
- trace the classical optimization loop without claiming automatic advantage.

## Why this concept matters

Many useful problems ask for the best bitstring under a constraint: a cut, assignment, schedule, or route. QAOA is a teaching bridge from quantum states to hybrid algorithms. The circuit prepares a distribution over candidate bitstrings, while a classical program evaluates and updates the parameters.

The separation of roles matters. The graph and cost function define what “good” means. The quantum circuit shapes a distribution. The optimizer chooses parameters based on noisy samples. A beautiful circuit is not evidence of a good solution until the objective is measured and compared with a baseline.

![A one-edge MaxCut graph assigns a score to each two-bit computational basis state.](/learn/visuals/qaoa-graph.svg)

## Plain-language intuition

Start every vertex in a fair coin state, so every assignment is initially possible. The cost layer rotates the phase of each assignment according to its score. The mixer then moves amplitude between assignments. The parameters decide how much phase and mixing to apply. After a few layers, high-scoring assignments may have greater probability, but the distribution is still sampled rather than guaranteed.

The optimizer is like a coach. It proposes angles, watches the average score from the circuit, and proposes new angles. The quantum processor is an objective evaluator inside that loop, not the whole algorithm.

## Prerequisite recap

You should know Pauli Z expectations, phase rotations, controlled gates, and the difference between an amplitude and a measured probability. From the previous chapter, recall that a cost can be a weighted sum of observable expectations and that finite shots make every estimate noisy.

## Notation and vocabulary

For two vertices connected by one edge, encode each side of the cut in a bit. Equal bits place the vertices on the same side and produce score zero. Different bits place them on opposite sides and produce score one. The cost operator is

$$
C_{01}=\frac{I-Z_0Z_1}{2}.
$$

Because `Z0Z1` has eigenvalue `+1` on `00` and `11`, their cost is zero. It has eigenvalue `-1` on `01` and `10`, so their cost is one.

The p=1 state has an initial `|+>` layer, a cost evolution controlled by `γ`, and a mixer evolution controlled by `β`. The one-edge exact expected score is

$$
\langle C\rangle_{p=1}=\frac12+\frac12\sin(4\beta)\sin(\gamma).
$$

The angles are in radians in the math and circuit labels. The classically displayed widget may use degrees so a learner can manipulate them easily.

## Visual explanation before equations

The graph should come first. It tells you what the bitstrings mean before the Hamiltonian is introduced. Then the circuit can be read as three stages: prepare, cost, mix.

![The p=1 circuit alternates a cost evolution with a mixer evolution.](/learn/visuals/qaoa-circuit.svg)

![The one-edge cost assigns zero to equal bits and one to different bits.](/learn/visuals/qaoa-cost.svg)

The parameter landscape is not a decoration. It is the objective surface that the classical optimizer is trying to explore.

![A small parameter table shows how gamma and beta change the exact one-edge expected cut.](/learn/visuals/qaoa-landscape.svg)

## Worked example 1: encode the edge

Evaluate `C=(I-Z0Z1)/2` on `|01>`. The first bit is zero, so Z gives `+1` on q1. The second bit is one, so Z gives `-1` on q0. Their product is `-1`, hence

$$
C|01> = \frac{1-(-1)}{2}|01> = |01>.
$$

The score is one. On `|00>`, both Z eigenvalues are positive and the product is `+1`, so the cost is zero. This operator is diagonal in the computational basis, which lets the cost layer attach a phase based on the classical score.

## Worked example 2: choose parameters

Use `γ=π/2` and `β=π/8`. Then `4β=π/2`, so both sine factors are one:

$$
\langle C\rangle=\frac12+\frac12(1)(1)=1.
$$

For this symmetric one-edge instance, the ideal measured distribution is `P(01)=P(10)=1/2`, with zero probability on `00` and `11`. Each sampled bitstring has score one, so the sample mean is also one in the noiseless infinite-shot ideal.

Now set `β=0`. The mixer is absent and the expected score returns to one half, the uniform baseline. Setting `γ=π` also returns one half because `sin(π)=0`. A parameter can be meaningful only relative to the state preparation and layer convention used in the derivation.

## The hybrid optimization loop

![QAOA alternates classical parameter proposals with quantum samples and a score calculation.](/learn/visuals/qaoa-loop.svg)

One loop is: the optimizer proposes `γ,β`; the circuit runs for a declared number of shots; the measurement distribution is scored classically; the optimizer updates the angles. The objective can be the average score, a penalty-adjusted score, or another estimator. The optimizer may use gradients, finite differences, random search, or a small grid in an educational example.

The measured best sample and the expected score are different outputs. A distribution can have a high expected score while still occasionally returning a lower-scoring assignment. Conversely, a single lucky sample does not prove that the parameters are good.

## From one edge to a graph

For a graph with edge set `E`, add one term per edge:

$$
C=\sum_{(i,j)\in E}w_{ij}\frac{I-Z_iZ_j}{2}.
$$

The weight allows one edge to matter more than another. On a sampled bitstring, evaluate the classical cut directly as a reliable cross-check. The expectation of the operator and the average of the classical sample scores should agree within sampling error when the convention and signs are correct.

The graph also introduces hardware concerns. A cost term involving distant qubits may require routing, and a mixer layer may be parallel only when its gates do not share qubits. Thus the logical layer count, physical depth, and number of two-qubit gates can diverge. This is an important reason to show both the abstract Hamiltonian and the compiled circuit in a fuller Lab challenge.

## Parameter conventions and reproducibility

Different references place signs in the definition of the cost Hamiltonian or write the mixer with a different factor of two. Those conventions can be equivalent after a parameter substitution, but a reproducible lesson must state its convention, units, initial state, and gate order. In this chapter `C` is maximized, `γ` multiplies cost evolution, `β` controls `RX(2β)`, and the state begins as `|++>`.

## Beyond p=1

Increasing p adds another cost and mixer pair. More layers increase expressive power but also add parameters, optimizer work, and hardware depth. A deeper circuit can represent a better distribution and still perform worse on hardware because noise accumulates. In a demo, p=1 is a useful microscope: every parameter effect can be checked against an exact formula before discussing larger graphs.

## Interactive prediction

Move the gamma and beta controls. Before changing them, predict whether the expected score will improve, stay at the uniform half, or fall after a sign change. The default is the analytic optimum for this one-edge convention.

```interactive
{"widget":"qaoa-explorer","preset":"one-edge-maxcut"}
```

Inline check: at `γ=90°` and `β=22.5°`, the exact expected score should be 1.000. At `β=0°`, it should be 0.500.

## Limits and honest claims

QAOA does not guarantee that a shallow circuit finds the global optimum on every graph. The landscape can be difficult, the optimizer can get stuck, and hardware noise changes the sampled objective. The cost Hamiltonian may be expensive to implement, and the number of layers increases circuit depth.

The one-edge example is a pedagogical benchmark, not evidence of a quantum advantage. A serious comparison needs a classical baseline, the same problem encoding, parameter optimization cost, sampling cost, compilation overhead, and noise assumptions.

## Common mistakes

- Forgetting that the graph defines the cost before choosing a circuit.
- Mixing degrees in the interface with radians in the formula.
- Calling one high-scoring sample the expected score.
- Assuming `C=(I-Z0Z1)/2` scores every graph without adding its edge terms.
- Claiming that a good p=1 toy result proves practical speedup.
- Omitting shot count and optimizer cost from a comparison.

## Summary and glossary

QAOA encodes a classical objective into a cost Hamiltonian, prepares a parameterized state, and alternates cost and mixer evolutions. For one edge, equal bits score zero and different bits score one. `γ` controls cost phase, `β` controls mixing, and a classical loop updates them from measured scores. The algorithm is hybrid and approximate.

Glossary: **MaxCut** partitions vertices to maximize crossing edges; **cost Hamiltonian** assigns an energy or score to bitstrings; **cost layer** applies score-dependent phases; **mixer** moves amplitude between assignments; **parameter landscape** maps angles to an expected objective; **sample score** is the value of one measured bitstring.

## Assessment

Answer the chapter quiz after deriving the one-edge operator. The questions cover graph encoding, parameter roles, the exact p=1 formula, samples versus expectations, and honest resource comparisons.

## Transfer problem

Add a second edge to a three-vertex path. Write the sum of two terms of the form `(I-ZiZj)/2`, then explain why a measured bitstring must be scored by both terms before computing the total objective.

## Lab connection

Try the QAOA challenge in the Lab and compare the circuit's sampled scores with the expected-score reasoning here. Debugging prompt: if equal-bit strings receive score one, inspect the sign in `(I-ZiZj)/2` and confirm the declared q0 convention.

Try this in Lab: [open the QAOA challenge](/lab?challenge=qaoa).

## Chapter quiz

Answer every question and read the explanations. The count follows the amount of graph, Hamiltonian, and optimization reasoning in this lesson.

## Sources

- Edward Farhi, Jeffrey Goldstone and Sam Gutmann, [A quantum approximate optimization algorithm](https://arxiv.org/abs/1411.4028).
- IBM Quantum, [QAOA tutorial](https://quantum.cloud.ibm.com/docs/en/tutorials/quantum-approximate-optimization-algorithm).
- Google Quantum AI, [Cirq expectation values](https://quantumai.google/reference/python/cirq/SimulatesExpectationValues).
