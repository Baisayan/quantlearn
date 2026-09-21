# VQE and energy estimation

The Variational Quantum Eigensolver turns energy estimation into a hybrid search. A parameterized circuit prepares candidate states, measurements estimate the Hamiltonian terms, and a classical optimizer changes the parameters. The variational principle supplies a safety rail: for a correctly specified Hamiltonian, the expectation value of any trial state cannot be below the ground-state energy.

This chapter uses a one-qubit toy Hamiltonian, `H=Z+0.5X`. It is small enough to solve exactly and rich enough to show ansatz choice, separate measurement bases, shot noise, and optimizer behavior. It is not a chemistry calculation, and its simplicity is part of the teaching design.

## Learning objectives

By the end of this lesson you should be able to:

- define a Hamiltonian, ansatz, energy expectation, and variational bound;
- derive the exact energy curve for `Ry(θ)|0>`;
- measure separate Pauli terms and add their weighted estimates;
- interpret a noisy optimizer trace; and
- distinguish an educational toy model from a scalable chemistry workflow.

## Why this concept matters

Ground-state energy is a central task in chemistry and materials science, but a quantum device cannot simply print an eigenvalue. VQE makes the task operational: pick a state family, estimate its energy, and search for a low point. The same pattern appears in many hybrid algorithms, so understanding the measurement and optimization loop is more valuable than memorizing the acronym.

The practical difficulty is visible even here. Every Hamiltonian term may require a different analyzer. Every estimate uses finite shots. The optimizer sees an imperfect objective and can stop at a local minimum or be misled by noise. A rigorous demo should show those boundaries instead of hiding them.

![The one-qubit ansatz and Hamiltonian define a searchable energy model.](/learn/visuals/vqe-model.svg)

## Plain-language intuition

Imagine a landscape with height equal to energy. The ansatz is the path the learner is allowed to walk. The parameter `θ` chooses a point on that path. The quantum circuit estimates the height, while a classical optimizer decides where to step next. If the path contains the true ground state, the lowest point reaches the exact answer. If the ansatz is too restricted, the best reachable point can remain above it.

The word variational means “search over allowed trial states.” It does not mean that any arbitrary noisy estimate is automatically a valid bound. The Hamiltonian, state preparation, and estimator all need to be correct.

## Prerequisite recap

You should know Pauli expectations from the previous chapter. Recall that Z can be measured directly and X can be measured by applying H before a Z detector. You should also understand that a cost or energy is a weighted sum of expectations and that fresh shots are needed for separate basis settings.

## Notation and vocabulary

The Hamiltonian is

$$
H=Z+0.5X.
$$

The ansatz is

$$
|\psi(\theta)\rangle=R_y(\theta)|0\rangle
=\cos(\theta/2)|0\rangle+\sin(\theta/2)|1\rangle.
$$

For this real state, the exact expectations are `⟨Z⟩=cos(θ)` and `⟨X⟩=sin(θ)`, so

$$
E(\theta)=\langle H\rangle=\cos(\theta)+0.5\sin(\theta).
$$

The derivative is `-sin(θ)+0.5cos(θ)`. Setting it to zero gives `tan(θ)=0.5` in the appropriate quadrant. The minimum is `-sqrt(1.25)`, approximately `-1.118`.

## Visual explanation before equations

First separate the measurements. The Z term uses a direct detector. The X term uses H as an analyzer. Only after both estimates are obtained should the coefficient 0.5 be applied and the energy added.

![Z and X terms use separate analyzer settings before their energy contributions are combined.](/learn/visuals/vqe-terms.svg)

![A measurement panel separates Z and X counts before combining their energy contributions.](/learn/visuals/vqe-measurements.svg)

![The energy curve has a known analytic minimum for the one-qubit teaching Hamiltonian.](/learn/visuals/vqe-energy.svg)

The optimizer trace is another view of the same curve. It should show proposals, measured values, and the best point so that a learner can distinguish search behavior from the exact benchmark.

![A short optimizer trace compares proposed angles with the exact energy values.](/learn/visuals/vqe-optimizer.svg)

## Worked example 1: derive the exact energy

At `θ=0`, the ansatz is `|0>`. Its Z expectation is one and its X expectation is zero, so `E(0)=1`. At `θ=π/2`, the state is `|+>`. Now `⟨Z⟩=0` and `⟨X⟩=1`, giving `E(π/2)=0.5`.

At `θ=π+arctan(0.5)`, both sine and cosine are negative in the third quadrant. Substituting the derivative condition gives the minimum energy `-sqrt(1+0.5²)=-sqrt(1.25)≈-1.118`. The value is a benchmark for the widget and Lab, not something the optimizer is allowed to assume in a real unknown problem.

## Worked example 2: estimate energy from shots

Suppose a Z measurement gives 600 zeros and 424 ones in 1,024 shots. The estimated Z expectation is

$$
\widehat{\langle Z\rangle}=\frac{600-424}{1024}\approx0.172.
$$

In a separate X-basis run, suppose 700 positive outcomes and 324 negative outcomes are recorded. Then `hat(<X>)=(700-324)/1024≈0.367`. The energy estimate is

$$
\hat E=0.172+0.5(0.367)\approx0.356.
$$

This arithmetic is valid even though it differs from the exact curve at the selected angle. The difference can reflect a different angle, finite shots, readout error, or a bug. Reporting the two term estimates makes that diagnosis possible.

## The variational principle and ansatz limits

For a Hermitian Hamiltonian with ground energy `E0`, any normalized trial state satisfies `⟨H⟩ >= E0`. This is why lowering the energy is meaningful. But the result is only as useful as the ansatz family. A shallow `Ry` path can represent every pure one-qubit state up to phase, but a chemistry ansatz over many orbitals may need entangling layers and symmetry constraints.

A toy Hamiltonian also hides costs. A real VQE workflow must map a physical model to qubits, decompose its Hamiltonian, allocate shots among terms, mitigate errors when appropriate, and compare against classical methods. The educational loop is a faithful pattern, not a claim that one qubit solves chemistry.

## Why the ground-state bound follows

Write a normalized trial state in the eigenbasis of H as `|ψ>=Σ_k c_k|E_k>`, where `E_0` is the smallest eigenvalue. Then

$$
\langle H\rangle = \sum_k |c_k|^2 E_k.
$$

The coefficients `|c_k|²` are nonnegative and sum to one, so the expectation is a weighted average of eigenvalues. It cannot be lower than the smallest one. Equality requires the trial state to have support only on the ground eigenspace. This derivation explains both the power and the limitation of VQE: the ansatz must be expressive enough to reach or approach the desired eigenspace.

## Measurement allocation

If one term has a large coefficient or high variance, it may deserve more shots than a small stable term. A fixed equal-shot allocation is simple and transparent for a demo, but it is not always statistically efficient. The estimate should still disclose the allocation because two energy numbers with the same total shots can have different uncertainty.

## Noise and optimizer behavior

An optimizer sees objective estimates, not the exact curve. Readout errors can shift both term estimates. Gate noise can change the prepared state. A noisy energy can make a good step look bad, causing premature stopping or wandering. Replaying a fixed optimizer trace is useful pedagogically because it separates the logic of proposing a parameter from the randomness of a live backend run.

## Toy model versus chemistry

The one-qubit Hamiltonian has an analytic solution, no encoding overhead, and a complete Bloch-sphere description. Molecular VQE adds orbital mapping, symmetry, many Pauli strings, entangling ansatz design, measurement grouping, and often error mitigation. The same objective-estimation pattern survives, but the resource and validation story becomes much harder. A convincing demo should label the model as educational rather than implying that the example is a chemistry benchmark.

## Interactive prediction

Move the θ slider and predict the signs of `<Z>`, `<X>`, and the energy before reading the numbers. Then step through the small optimizer trace. The local widget computes the exact toy model and illustrates the shape of the loop without sending work to a backend.

```interactive
{"widget":"vqe-explorer","preset":"one-qubit-toy-hamiltonian"}
```

Inline check: near `θ=π+arctan(0.5)` or `206.6°`, the energy should be close to `-1.118`. At `θ=0`, it should be exactly `1` in the ideal formula.

## Common mistakes

- Treating the Hamiltonian as a probability distribution. Its eigenvalues and weighted terms define energy.
- Measuring Z and calling it an X expectation without a basis change.
- Reusing one collapsed shot batch for incompatible terms.
- Assuming the optimizer must find the analytic minimum from any starting point.
- Presenting a toy one-qubit result as a chemistry advantage claim.
- Ignoring shot count, term weights, and the distinction between exact and sampled energy.

## Summary and glossary

VQE prepares `|ψ(θ)>`, measures Hamiltonian terms, adds their weighted expectations, and lets a classical optimizer search for a low energy. For `H=Z+0.5X` and `Ry(θ)|0>`, `E(θ)=cos(θ)+0.5sin(θ)` and the exact minimum is about `-1.118`. Separate analyzers and finite shots are part of the algorithm, not optional presentation details.

Glossary: **Hamiltonian** is the energy operator; **ansatz** is the parameterized state family; **ground energy** is the lowest eigenvalue; **variational principle** gives the trial-state lower-bound relationship; **term grouping** is a measurement strategy for multiple observables; **optimizer trace** records proposals and objective estimates.

## Assessment

Answer the chapter quiz after deriving the energy formula and doing the shot calculation. The questions cover ansatz, Pauli term measurement, the variational bound, exact versus sampled energy, and optimizer limitations.

## Transfer problem

Change the Hamiltonian to `H=0.8Z-0.3X`. Write the exact energy for the same ansatz and explain which quadrant contains its minimum. State what must change in the measurement estimator.

## Lab connection

Try the VQE challenge in the Lab. Compare the backend estimates for the Pauli terms with the exact teaching curve and record the shot count. Debugging prompt: if the energy is inconsistent with the displayed terms, check whether the X contribution was measured in the H-rotated basis and multiplied by its coefficient.

Try this in Lab: [open the VQE challenge](/lab?challenge=vqe).

## Chapter quiz

Answer every question and read the explanations. The question count follows the Hamiltonian, measurement, and optimization content in this lesson.

## Sources

- Peruzzo et al., [A variational eigenvalue solver on a photonic quantum processor](https://arxiv.org/abs/1304.3061).
- IBM Quantum, [VQE spin-chain tutorial](https://quantum.cloud.ibm.com/docs/en/tutorials/spin-chain-vqe).
- Google Quantum AI, [Cirq expectation values](https://quantumai.google/reference/python/cirq/SimulatesExpectationValues).
