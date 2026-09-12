# Grover search and amplitude amplification

## Learning objectives

Understand a phase oracle, calculate a diffusion step and explain why amplification must stop.

## Search as a checking problem

Suppose four candidate bitstrings contain one marked solution, 11. A checker recognizes a solution. Its reversible phase-oracle version changes the sign of a marked amplitude. For this small example, CZ is the oracle.

Prepare the uniform state using H on both qubits. The amplitudes, ordered 00, 01, 10, 11, are [1/2,1/2,1/2,1/2]. The oracle changes them to [1/2,1/2,1/2,-1/2]. Their probabilities have not yet changed.

## Diffusion converts phase into amplitude

Define $D=2|s\rangle\langle s|-I$, where s is the uniform state. For real amplitudes, this reflects each amplitude about their mean. The mean after the oracle is 1/4. Each new amplitude is $2(1/4)-a$, giving [0,0,0,1].

![Signed amplitudes before the oracle, after the phase flip and after mathematical diffusion.](/learn/visuals/grover-amplitudes.svg)

The table separates signed amplitudes from nonnegative probabilities. A phase flip is not a negative probability.

## A concrete circuit

The circuit below uses H-X-CZ-X-H on both wires for diffusion. That gate decomposition implements -D, so its final state is -|11> rather than |11>. The difference is global phase; measurement still returns 11 with probability one. The visual labels this convention explicitly.

![Two-qubit Grover circuit with phase oracle and decomposed diffusion.](/learn/visuals/grover-circuit.svg)

## When to stop

With M marked states among N candidates, define $\sin^2\theta=M/N$. After r mathematical Grover iterations, the success probability is

$$
\sin^2((2r+1)\theta).
$$

For N=4 and M=1, one iteration succeeds ideally with certainty. A second iteration drops the probability to 1/4. More iterations are not always better.

## Separate the checker from the search result

We name 11 in advance so that the small circuit and its arithmetic can be inspected. In a search problem the checker answers whether a candidate satisfies a condition; it need not hand back the solution. Hardcoding CZ for this known teaching target illustrates an oracle but is not a general database-search implementation.

In the diffusion expression, $|s\rangle\langle s|$ is a projector onto the uniform state. For the real numbers in our example, you can calculate its action using the mean instead of multiplying a four-by-four matrix. Keep amplitudes and probabilities in separate columns. After the phase oracle, the marked amplitude is negative but its probability is still 1/4. Only after diffusion does that probability rise.

To check the stopping rule, use $M/N=1/4$. Choosing theta between zero and pi/2 gives theta=pi/6. At r=0 the formula gives 1/4; at r=1 it gives $\sin^2(\pi/2)=1$; at r=2 it gives $\sin^2(5\pi/6)=1/4$. These are iterations, each containing an oracle and a diffusion step, not individual gates.

A measured candidate should still be checked against the condition. For instances without certainty at the selected iteration count, a single run need not return a solution.

## Practical limits

The query count scales as $O(\sqrt{N/M})$ when the marked fraction is known and the standard assumptions hold. This is an oracle-query result. It does not say that arbitrary databases can be loaded for free or that this tiny simulator example outperforms ordinary code. Oracle construction and noise can dominate a real implementation.

## Summary

Mark using phase, amplify using interference and stop near the probability maximum. Distinguish mathematical diffusion from equivalent circuit decompositions with a global phase.

## Chapter quiz

Answer all 10 questions in order: 3 easy checks, 4 medium applications and 3 harder reasoning questions. Use the worked examples if you get stuck. After submitting, read the explanations and revisit the relevant section before retrying.

## Sources

- [A fast quantum mechanical algorithm for database search](https://arxiv.org/abs/quant-ph/9605043). Lov K. Grover.
- [Grover's algorithm](https://quantum.cloud.ibm.com/docs/en/tutorials/grovers-algorithm). IBM Quantum Documentation.
