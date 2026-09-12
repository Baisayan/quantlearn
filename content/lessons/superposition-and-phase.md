# Superposition, phase and interference

## Learning objectives

Recognize superposition, distinguish relative from global phase, and predict two simple gate sequences.

## Superposition depends on a basis

The states $|+\rangle=(|0\rangle+|1\rangle)/\sqrt2$ and $|-\rangle=(|0\rangle-|1\rangle)/\sqrt2$ are equal-weight superpositions in the Z basis. Both produce 50/50 Z outcomes. They are nevertheless different states.

Multiplying every amplitude by the same complex factor $e^{i\gamma}$ changes global phase and leaves physical predictions unchanged. Changing the phase of one amplitude relative to another can change later interference.

![Plus and minus have identical probabilities but opposite relative phase.](/learn/visuals/phase-comparison.svg)

## Follow amplitudes through a circuit

A Hadamard sends $|0\rangle$ to $|+\rangle$ and $|1\rangle$ to $|-\rangle$. Apply it twice:

$$
H|+\rangle=\tfrac12[(|0\rangle+|1\rangle)+(|0\rangle-|1\rangle)]=|0\rangle.
$$

The two contributions to $|1\rangle$ cancel. The contributions to $|0\rangle$ add. This is interference.

Now put a Z gate between the two Hadamards. Z changes $|+\rangle$ to $|-\rangle$. The final Hadamard produces $|1\rangle$. Read the figure from left to right; in matrix notation the last gate appears on the left.

![HH returns zero, while HZH returns one in an ideal experiment.](/learn/visuals/interference.svg)

## A worked phase experiment

For a relative phase $\phi$, begin with $(|0\rangle+e^{i\phi}|1\rangle)/\sqrt2$. After H, the amplitude of 0 is $(1+e^{i\phi})/2$. Squaring its magnitude gives

$$
P(0)=\frac{1+\cos\phi}{2}.
$$

At $\phi=0$, the result is always 0. At $\phi=\pi/2$, it is 50/50. At $\phi=\pi$, it is always 1. All three inputs had the same Z probabilities before H. This is why a histogram alone is not a complete description of a quantum state.

## Coherence matters

A classical 50/50 mixture of 0 and 1 has no definite relative phase between those alternatives. It does not behave like $|+\rangle$ under this interference experiment. Coherence is the phase relationship that enables the cancellation.

## A calculation you can do by hand

H acts on a general vector $[a,b]^T$ by producing $[(a+b)/\sqrt2,(a-b)/\sqrt2]^T$. For plus, the entries add in the first position and cancel in the second. For minus, they cancel in the first position and add in the second. The minus sign is not an instruction to subtract probabilities.

Compare two preparations on paper. In experiment A, prepare plus and apply H: every ideal Z result is zero. In experiment B, toss a classical coin to prepare either zero or one, then apply H. Either coin result produces a state with equal Z probabilities, so averaging the two cases still gives 50/50. Equal input histograms do not make these preparations equivalent.

The phase formula also has an important limitation. Suppose the final probability of zero is $3/4$. Rearranging gives $\cos\phi=1/2$. Both $\phi=\pi/3$ and $\phi=-\pi/3$ fit. One measurement setting does not uniquely identify the phase.

"Superposition depends on a basis" means that plus is a superposition of zero and one, but is itself a single basis state in the X basis. It is not a claim that changing a label physically changes a qubit.

## Common misconception

Superposition does not by itself provide every answer to a computation. A useful algorithm must construct and combine amplitudes, then extract a suitable measurement result.

## Summary

Add complex amplitudes before squaring. Relative phase affects interference; global phase does not. Specify both the circuit and measurement basis when comparing states.

## Chapter quiz

Answer all 10 questions in order: 3 easy checks, 4 medium applications and 3 harder reasoning questions. Use the worked examples if you get stuck. After submitting, read the explanations and revisit the relevant section before retrying.

## Sources

- [Quantum information: single systems](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information). IBM Quantum Learning / John Watrous.
- [Gates and operations](https://quantumai.google/cirq/build/gates). Google Quantum AI.
