# No-cloning, no-signalling and limits of entanglement

## Learning objectives

By the end of this chapter, you should be able to give an intuitive and inner-product proof of no-cloning, show how teleportation consumes its input, use a reduced state to explain no-signalling, and distinguish a strong correlation from a message that one party can choose and send instantly.

## Why this concept matters

Entanglement is powerful because it creates joint structure, but it is not an unlimited communication shortcut. Without clear limits, a learner can leave this module believing that an unknown quantum state can be duplicated, that teleportation creates a second copy, or that Alice can choose a measurement result to send Bob a bit immediately. These are not small details. They determine what a quantum protocol can mean physically and what a Lab result can legitimately claim.

The no-cloning and no-signalling ideas also protect the interpretation of the earlier chapters. A statevector is not a hidden classical database that can be read twice. A local histogram is not a delayed inbox. A correct explanation must track what is jointly correlated, what is locally observable, and when ordinary classical communication is available.

## Plain-language intuition

A copier can be built for known labels. If a machine is promised that its input is either $|0\rangle$ or $|1\rangle$, it can map $|0\rangle|0\rangle$ to $|0\rangle|0\rangle$ and $|1\rangle|0\rangle$ to $|1\rangle|1\rangle$. The problem is asking the same unknown machine to copy every superposition. Quantum operations are linear, so the machine must act on the pieces separately and add the results. A true duplicate would square the coefficients and create cross terms. Those expressions disagree in general.

For no-signalling, imagine Alice and Bob sharing $\Phi^+$. Alice can choose a measurement basis, but her result is random. Bob's local state, after averaging over Alice's unknown result, remains $I/2$. Bob cannot tell which basis Alice chose from his own data. The correlation becomes useful only after they compare records through an ordinary channel.

## Prerequisite recap

You should know linear state evolution, inner products, density matrices, partial trace and the teleportation branch table. Use the convention that local information is represented by a reduced density matrix, while joint information may remain in correlations that disappear from either local view.

## Notation and vocabulary

The no-cloning claim is about one fixed unitary copier U with a blank register $|0\rangle$:

$$
U(|\psi\rangle|0\rangle)=|\psi\rangle|\psi\rangle.
$$

“Unknown” means the device cannot be redesigned for the particular state after learning its amplitudes. “Linearity” means $U(\alpha|0\rangle+\beta|1\rangle)=\alpha U|0\rangle+\beta U|1\rangle$. “No-signalling” means no choice made locally by Alice changes Bob's unconditioned local statistics in a way he can read without classical communication. “Correlation” does not mean “controllable message.”

## Visual explanation before equations

![A copying-machine diagram showing the basis-state promise and the incompatible superposition requirement.](/learn/visuals/no-cloning.svg)

![A table showing that Bob's local state remains maximally mixed for different actions by Alice.](/learn/visuals/no-signalling.svg)

![Teleportation flow showing that Alice's input is consumed before Bob applies the classical correction.](/learn/visuals/teleportation-consumes.svg)

The visual order matters. First see the algebraic contradiction, then inspect Bob alone, then place the result back into teleportation. It is possible for two joint preparations to have striking correlations while every local histogram remains unchanged.

## Worked example: the linearity contradiction

Assume a copier works on the computational basis:

$$
U(|0\rangle|0\rangle)=|0\rangle|0\rangle,
\qquad
U(|1\rangle|0\rangle)=|1\rangle|1\rangle.
$$

Take an arbitrary input $|\psi\rangle=\alpha|0\rangle+\beta|1\rangle$. Linearity gives

$$
U(|\psi\rangle|0\rangle)=\alpha|00\rangle+\beta|11\rangle.
$$

But a true copy would be

$$
|\psi\rangle|\psi\rangle
=\alpha^2|00\rangle+\alpha\beta|01\rangle+\alpha\beta|10\rangle+\beta^2|11\rangle.
$$

For $\alpha=\beta=1/\sqrt2$, the linear output is $(|00\rangle+|11\rangle)/\sqrt2$, while the true duplicate is $(|00\rangle+|01\rangle+|10\rangle+|11\rangle)/2$. The missing 01 and 10 terms are not a small numerical error. They are the signature that one operation cannot clone every unknown state.

## Second proof: inner products cannot change that way

Suppose the same unitary copies two normalized states $|a\rangle$ and $|b\rangle$. Unitary operations preserve inner products, so

$$
\langle a|b\rangle
=\langle a|b\rangle\langle0|0\rangle
=\langle aa|bb\rangle
=\langle a|b\rangle^2.
$$

Therefore the overlap must satisfy $s=s^2$. The only solutions are $s=0$ or $s=1$: the states are either orthogonal and perfectly distinguishable or identical. Two different nonorthogonal states have $0<|s|<1$, so they cannot both be cloned by the same unitary. This proof is useful because it does not rely on choosing the computational basis. It applies to any candidate pair of nonorthogonal quantum states.

## Why teleportation consumes the input

Teleportation does not evade no-cloning. Alice's input interacts with her Bell half, then Alice measures q0 and q1. Those measurements destroy the original coherent input as a standalone system. Bob's qubit is reconstructed conditionally, but there is no untouched $|\psi\rangle$ left at Alice. The resource and the input have been consumed by the protocol.

The branch bits do not contain enough classical information to reconstruct arbitrary amplitudes on their own. They only select one known correction. Entanglement supplies the correlations; the classical channel supplies the timing and branch label.

## Worked no-signalling calculation

For $\Phi^+$, write the joint density matrix and trace out Alice. The result is

$$
\rho_B=\operatorname{Tr}_A(|\Phi^+\rangle\langle\Phi^+|)=I/2.
$$

If Alice measures Z, Bob sees 0 or 1 with equal probabilities when he ignores Alice's result. If Alice measures X, Bob still sees 0 or 1 with equal probabilities when he ignores her result. The conditional correlations differ, but the unconditional local distribution does not. Bob cannot infer Alice's chosen basis from his own samples.

This is why the phrase “instantaneous correlation” must be followed by “not an instantaneous message.” Alice cannot choose which random outcome she receives. Even if she chooses between Z and X, Bob's local density matrix is unchanged. They need a classical conversation to sort their records into matching or differing pairs.

## Interactive prediction

Choose a basis input or an arbitrary superposition, then test the copier algebra. The reveal shows whether linear evolution matches a true duplicate. The same widget also reminds you that Bob's local state is $I/2$ before classical bits arrive.

```interactive
{"widget":"no-cloning-explorer","preset":"linearity-and-local-state"}
```

## Common mistakes

- Saying no-cloning means known basis states cannot be copied. Orthogonal known states can be copied.
- Comparing only one basis and calling the result a universal proof of no-signalling.
- Treating teleportation's output as a second copy while ignoring measurement at Alice.
- Assuming entanglement lets Alice choose Bob's random outcome.
- Confusing a conditional joint correlation with a change in Bob's local marginal distribution.

## Summary and glossary

Linearity prevents one universal unitary from copying arbitrary unknown states. Inner-product preservation gives the same result for any pair of nonorthogonal states. Teleportation transfers a state only after consuming the input and sending two classical bits. Entanglement changes joint correlations, not Bob's unconditioned local state, so it cannot carry a chosen faster-than-light message.

Glossary: no-cloning theorem, linearity, inner product, overlap, orthogonal, nonorthogonal, no-signalling, local marginal, conditional correlation, classical communication.

## Transfer problem

Take two nonorthogonal states with overlap $s=1/2$. Use the inner-product proof to show why a single unitary copier would require $1/2=1/4$. Then imagine Alice choosing Z or X on her half of a Bell pair. Write the local distribution Bob records in each case and explain what extra information he needs to see the correlation.

## Assessment

Inline check: write the two different expressions for copying $\alpha|0\rangle+\beta|1\rangle$; state the overlap condition for two states that could share a universal copier; and name Bob's reduced state before teleportation bits arrive. A complete answer separates local statistics from joint correlations.

## Lab connection

Use [Create a Bell pair in Lab](/lab?challenge=bell) as the executable comparison for this chapter. Inspect the joint statevector and the measurement results, then ask what Bob alone could infer without Alice's record. The Lab cannot demonstrate faster-than-light signalling through a local run; it can help you inspect the distinction between a joint state and a local marginal.

## Chapter quiz

Answer each question in this lesson's assessment. The question count follows the proof, teleportation and no-signalling coverage rather than a fixed number. Read each explanation, then repeat the linearity reveal with a nontrivial superposition.

## Sources

- [Quantum teleportation](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/entanglement-in-action/quantum-teleportation). IBM Quantum Learning / John Watrous.
- [Quantum information: multiple systems](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/multiple-systems/quantum-information). IBM Quantum Learning / John Watrous.
- [Quantum circuits](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/quantum-circuits). IBM Quantum Learning / John Watrous.
