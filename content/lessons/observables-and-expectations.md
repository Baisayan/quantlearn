# Observables, expectations and cost functions

Quantum algorithms do not usually hand a classical optimizer a full statevector. They prepare a state, measure selected observables, and turn the resulting counts into numbers. Those numbers become objectives such as a cut score or an energy. This chapter makes that measurement-to-objective pipeline explicit before QAOA and VQE use it.

## Learning objectives

By the end of this lesson you should be able to:

- explain observables as operators with measurable eigenvalues;
- identify the measurement basis for Pauli X, Y and Z;
- compute an expectation from counts and distinguish it from a probability;
- combine estimates into a weighted cost function; and
- explain why finite shots and separate measurement settings matter.

## Why this concept matters

An algorithm can optimize only what it can score. A quantum state is not a single number, and a circuit cannot reveal every property in one measurement basis. Instead, the experimenter chooses an observable, repeats the preparation, and averages the signed outcomes. If the objective contains several non-commuting terms, each term needs its own basis setting or a justified grouping strategy.

This is the common language shared by algorithm families. In QAOA, the observable encodes whether graph edges are cut. In VQE, a Hamiltonian is decomposed into Pauli terms whose expectations add to the energy. The classical loop sees estimates, not an oracle that exposes the exact wavefunction.

![A basis-changing gate lets a standard Z detector measure a different Pauli observable.](/learn/visuals/observable-bases.svg)

## Plain-language intuition

Think of an observable as a question with signed answers. A Z measurement asks whether the qubit is aligned with the north or south pole and records `+1` or `-1`. The expectation is the long-run average of those answers. If 70 of 100 shots are positive and 30 are negative, the estimate is `(70 - 30)/100 = 0.40`.

This is different from the probability of the positive outcome, which is `0.70`. The expectation packages both sides into one signed number. It is zero for a balanced result, positive when the positive eigenvalue is more common, and negative when the negative result dominates.

## Prerequisite recap

You should be comfortable with amplitudes, the Born rule, and the idea that H changes the measurement basis. Recall that the computational measurement after no analyzer is a Z measurement. Applying H immediately before the detector makes the detector distinguish `|+>` from `|->`, which is an X measurement in the original state.

## Notation and vocabulary

An observable `A` is a Hermitian operator. Its eigenvalues are the possible measurement values. For a state `|ψ>`, the exact expectation is

$$
\langle A\rangle_\psi = \langle\psi|A|\psi\rangle.
$$

For a mixed state `ρ`, use `Tr(ρA)`. In a shot experiment, if the outcomes are `a_i`, estimate the same quantity with

$$
\widehat{\langle A\rangle} = \frac{1}{N}\sum_{i=1}^{N}a_i.
$$

Pauli X, Y and Z have eigenvalues `+1` and `-1`. A cost function may be a weighted sum, for example `C = <Z> + 0.5<X>`. A Hamiltonian is a physical or toy energy operator, often written as a sum of Pauli strings.

## Visual explanation before equations

The detector hardware can stay the same while the analyzer changes. Z needs no basis change. X uses H before Z measurement. Y uses `S†` followed by H. The outcome labels are still the detector's zero and one, but we reinterpret them as the observable's positive and negative eigenvalues.

![Counts are converted to a signed expectation by assigning positive and negative eigenvalues.](/learn/visuals/counts-expectation.svg)

The visual distinction to remember is: a histogram shows a distribution of outcomes, while an expectation compresses that distribution into a signed average. Keeping both is useful because the expectation alone does not reveal how many shots produced it.

## Worked example 1: estimate Z from counts

Suppose a state is prepared 100 times and a Z detector records 70 zeros and 30 ones. In the Z basis, zero has eigenvalue `+1` and one has eigenvalue `-1`. Therefore

$$
\widehat{\langle Z\rangle} = \frac{70(+1)+30(-1)}{100} = 0.40.
$$

The positive probability is 0.70 and the negative probability is 0.30. The expectation is their difference, `0.70 - 0.30`. If the same state were measured with 1,000 shots, the estimate would usually move closer to the exact expectation, but a random finite sample would not be guaranteed to equal it.

Now consider a balanced sample of 512 zeros and 512 ones. Its Z estimate is zero. That does not prove that the state is maximally mixed in every basis. It only answers the Z question for the preparation and shots used.

## Worked example 2: estimate X after a basis change

Prepare `|+>`. Its exact X expectation is `+1`, because `|+>` is the positive X eigenstate. A direct Z detector would show approximately half zeros and half ones, which might look uninformative. Apply H before the detector. Since `H|+> = |0>`, the transformed experiment returns zero on every ideal shot. Reinterpreting zero as the positive X eigenvalue gives `hat(<X>) = +1`.

For `|->`, the same analyzer gives `H|-> = |1>`, so the result is always the negative eigenvalue and `hat(<X>) = -1`. The Z histograms of `|+>` and `|->` are identical, but their X expectations differ. This is why one basis cannot characterize every state.

## From expectations to costs

Suppose two independently measured terms give `hat(<Z>)=0.40` and `hat(<X>)=-0.20`. For

$$
C = \langle Z\rangle + 0.5\langle X\rangle,
$$

the estimated cost is `0.40 + 0.5(-0.20) = 0.30`. The coefficient is part of the problem definition. It is not a probability and does not need to lie between zero and one. If the terms came from separate shot batches, report those shot counts and uncertainties separately.

![A weighted sum combines separately estimated observable terms into one cost.](/learn/visuals/cost-terms.svg)

## Interactive prediction

Choose an observable and counts, predict the sign of the expectation, then let the local calculator evaluate it. For X and Y, pay attention to the basis-change note. This widget intentionally uses arithmetic only; it does not call the Lab simulator.

```interactive
{"widget":"observable-explorer","preset":"counts-to-expectation"}
```

The transfer question is: can two different histograms have the same expectation? Yes. For example, 7 positive and 3 negative shots and 70 positive and 30 negative shots both estimate 0.40, but the second is usually more precise.

## Shot noise and measurement planning

The exact expectation is a property of the state and observable. The estimate is a random variable because shots are finite. More shots reduce sampling variation roughly with the familiar inverse-square-root trend. They do not fix a wrong basis, an incorrect circuit, readout bias, or a hardware error.

When a cost contains non-commuting terms, prepare fresh copies for each measurement setting. Reusing a collapsed state would mix up the experiment. For a large Hamiltonian, measurement grouping, importance allocation, and variance reduction become engineering choices. For this platform, the important beginner habit is to name the term, analyzer, shot count, and estimate.

## A basis-change derivation

The X measurement rule follows from `H X H = Z`. If the original state is `|ψ>`, applying H and then measuring Z produces the same distribution as measuring X on `|ψ>`. For Y, the corresponding analyzer is `H S†`, with the right-to-left matrix convention understood. The hardware detector has not changed; only the state has been rotated into the detector basis.

This is also why a state can have a flat Z histogram and still have a definite X expectation. The detector is asking a different question after the analyzer. A lesson or Lab panel should label the analyzer explicitly so that learners do not confuse a result from the transformed circuit with a direct Z statement about the original state.

## Exact versus sampled objective values

For a simulator, an exact expectation may be calculated directly from the statevector or density matrix. A shot-based estimate imitates what a device returns and exposes uncertainty. Both views are useful, but they answer different questions. Exact values help check algebra and widget correctness. Sampled values help learners reason about confidence, reproducibility, and why an optimizer can see a jagged landscape even when the underlying function is smooth.

![Shot count changes the spread of an estimate while the exact expectation remains fixed.](/learn/visuals/shot-noise-expectation.svg)

## Common mistakes

- Confusing `P(0)` with `<Z>`. For a qubit measured in Z, `<Z> = P(0)-P(1)`.
- Assuming a Z histogram reveals `<X>` or `<Y>`. Basis changes are required.
- Treating an expectation as a probability. Expectations may be negative or greater than one for weighted costs.
- Combining counts from different analyzers without labeling the terms.
- Claiming that more shots remove systematic device bias. They mainly reduce sampling uncertainty.
- Using one collapsed state to estimate several incompatible observables. Each setting needs fresh preparation.

## Summary and glossary

An observable supplies signed eigenvalues. An expectation is their exact or sampled average. Pauli X, Y and Z use different eigenbases, although a standard Z detector can measure them after suitable basis rotations. Cost functions and Hamiltonians combine term expectations with weights. Shot noise affects estimates, so a transparent algorithm reports both the calculation and the sampling context.

Glossary: **observable** is a Hermitian measurable operator; **eigenvalue** is a possible signed result; **expectation** is the average result; **basis rotation** maps a desired eigenbasis to the detector basis; **cost function** is the scalar objective optimized by a classical loop; **shot noise** is finite-sample variation.

## Assessment

Answer the chapter questions after using the calculator. The quiz checks counts-to-expectation arithmetic, basis selection, weighted costs, and the limits of sampled estimates. Inline checks in the lesson are deliberately smaller so the quiz is not doing all the teaching.

## Transfer problem

Design a measurement plan for `C = 0.7<Z> - 0.2<X>`. State the analyzer before each term and explain why the two estimates should use fresh preparations.

## Lab connection

You now have the measurement vocabulary needed for optimization. Try the QAOA challenge next and identify the observable or score being estimated. Debugging prompt: if a cost seems outside its expected range, first check whether you are mixing a probability with a signed expectation or using the wrong coefficient.

Try this in Lab: [open the QAOA challenge](/lab?challenge=qaoa).

## Chapter quiz

Answer every question and read each explanation. The number of questions follows the amount of measurement reasoning in this chapter.

## Sources

- IBM Quantum, [Quantum information](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information).
- IBM Quantum, [QAOA tutorial](https://quantum.cloud.ibm.com/docs/en/tutorials/quantum-approximate-optimization-algorithm).
- Google Quantum AI, [Cirq expectation values](https://quantumai.google/reference/python/cirq/SimulatesExpectationValues).
