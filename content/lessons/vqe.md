# VQE and energy estimation

## Learning objectives

Define an ansatz and Hamiltonian, estimate an energy from Pauli measurements, and compare a trial state with a known minimum.

## An energy problem

VQE seeks low-energy states of a Hamiltonian. A Hamiltonian is a Hermitian operator; its eigenvalues are possible energies. The lowest eigenvalue is the ground-state energy.

We will use the one-qubit model

$$
\mathcal H=Z+\frac12X,\qquad |\psi(\theta)\rangle=R_y(\theta)|0\rangle.
$$

This is an analytic toy Hamiltonian, not a molecular calculation. The parameterized preparation is called an ansatz.

## Reading the linear algebra

An eigenvector v satisfies $\mathcal Hv=\lambda v$: applying the Hamiltonian changes its scale, not its direction. The number lambda is an eigenvalue. Hermitian means the matrix equals its conjugate transpose, which ensures real eigenvalues. For this model the matrix is $[[1,1/2],[1/2,-1]]$. Its eigenvalues solve $\lambda^2=1.25$.

Do not confuse the Hamiltonian symbol with a Hadamard gate. Here $\mathcal H$ is the energy operator to be estimated; the H gate in the measurement diagram changes basis.

You can check the minimum without an optimizer. Set $\delta=\arctan(1/2)$. The trigonometric identity gives $E(\theta)=\sqrt{1.25}\cos(\theta-\delta)$. Its smallest value occurs when theta-delta=pi. This also distinguishes the minimum from theta=delta, which gives the maximum.

## Calculate before optimizing

For this ansatz, the Z expectation is cos(theta), and the X expectation is sin(theta). Thus

$$
E(\theta)=\langle\mathcal H\rangle=\cos\theta+\frac12\sin\theta.
$$

At theta=0 the energy is 1. At theta=pi it is -1. At theta=pi+arctan(1/2) it is $-\sqrt{1.25}$, approximately -1.118. The Hamiltonian's eigenvalues are plus and minus sqrt(1.25), so this ansatz can reach its true ground state.

![Analytically computed energy versus theta and the exact ground-energy bound.](/learn/visuals/vqe-energy.svg)

The curve is an exact parameter sweep. It is not a claimed optimizer training history.

## Measure separate terms

To estimate Z, prepare the ansatz and measure directly. To estimate X, prepare a fresh copy, apply H, then measure. Convert each recorded bit to the eigenvalue +1 for 0 or -1 for 1. Combine the averages as mean(Z)+0.5 mean(X).

![Separate circuits for estimating Z and X contributions to the toy Hamiltonian.](/learn/visuals/vqe-measurements.svg)

A single Z-basis histogram cannot supply the X expectation. The basis change is part of the experiment.

## Calculate an energy from two experiments

Suppose the Z setting gives 80 zeros and 20 ones, while a fresh batch in the X setting gives 60 zeros and 40 ones. The signed averages are 0.6 and 0.2. The energy estimate is $0.6+0.5(0.2)=0.7$. It is not the fraction of zeros in either batch.

A practical iteration prepares both batches for the same theta, estimates energy, and passes that number to the classical optimizer. The next proposed theta requires new experiments. Learning the exact curve here provides a reference for later checking that process, not evidence that an optimizer has already run.

## The variational principle

For any normalized trial state, its exact energy expectation is at least the ground energy. An insufficient ansatz may not reach that bound. A finite-shot estimate can fluctuate below it, so an apparently lower sampled value does not disprove the principle.

A classical optimizer updates theta from measured energy estimates. Noise, shot cost and flat landscapes can make this difficult. A local convergence message is not proof of the global minimum.

## QAOA versus VQE

Both use parameterized circuits and classical optimization. QAOA imposes alternating cost/mixer structure for an objective. VQE chooses an ansatz to minimize an energy. Neither requires PennyLane: Aer and Cirq provide the operations and expectation calculations needed for our models.

## Summary

Keep the Hamiltonian, ansatz, measurement bases and optimizer distinct. Validate small instances against analytic answers before attempting a chemistry or materials example.

## Chapter quiz

Answer all 10 questions in order: 3 easy checks, 4 medium applications and 3 harder reasoning questions. Use the worked examples if you get stuck. After submitting, read the explanations and revisit the relevant section before retrying.

## Sources

- [A variational eigenvalue solver on a quantum processor](https://arxiv.org/abs/1304.3061). Alberto Peruzzo et al.
- [Ground-state energy estimation of the Heisenberg chain with VQE](https://quantum.cloud.ibm.com/docs/en/tutorials/spin-chain-vqe). IBM Quantum Documentation.
- [cirq.SimulatesExpectationValues](https://quantumai.google/reference/python/cirq/SimulatesExpectationValues). Google Quantum AI.
