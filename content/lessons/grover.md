# Grover search and amplitude amplification

Grover search is the canonical example of amplitude amplification. It does not magically inspect an unsorted database without cost. It starts with a uniform guess, uses an oracle to mark candidate answers by phase, and reflects amplitudes so that marked states become more likely to be measured. The iteration is a rotation, so stopping at the right time matters.

## Learning objectives

By the end of this lesson you should be able to:

- describe search as a checking problem with a phase oracle;
- calculate the first oracle and diffusion step for four candidates;
- explain diffusion as reflection about the mean;
- use the angle formula to choose an approximate iteration count; and
- explain why oracle cost and overshoot prevent a simplistic speedup claim.

## Why this concept matters

Many computational tasks have the form “given a candidate, check whether it satisfies the condition.” Grover separates that checking rule from the search logic. The oracle marks a good candidate with a minus sign. Diffusion changes the signed amplitude landscape. Repeated rounds rotate the state toward the good subspace, producing a quadratic query improvement in the ideal black-box model.

That improvement is a probability-shaping process. A measurement still returns one candidate. If the oracle is expensive, if the number of marked items is unknown, or if noise destroys the carefully prepared phases, the practical result can be much less impressive. The small four-item example lets us see the full mechanism exactly.

![A two-qubit Grover circuit marks 11 and applies the diffusion block.](/learn/visuals/grover-circuit.svg)

## Plain-language intuition

Think of four runners starting with equal signed weights. The oracle turns the marked runner's weight negative. The diffusion step finds the average weight and reflects every weight around that average. A negative marked weight can become large and positive after this reflection, while the other weights shrink. Repeating the process keeps rotating between the “good” direction and the combined “not good” direction.

The reflection is not a classical boost of a database row. It is a coherent transformation of amplitudes. The useful signal appears when the marked amplitude is squared at measurement.

## Prerequisite recap

You need superposition, phase kickback, and H gates. For two qubits, H on `|00>` prepares four equal amplitudes of `1/2`. A phase oracle can multiply one or more marked basis states by `-1` while preserving probabilities. The diffusion operation can be written as `D=2|s><s|-I`, where `|s>` is the uniform state.

## Notation and vocabulary

Let `N` be the number of candidates and `M` the number of marked candidates. Define `|G>` as the normalized good subspace and `|B>` as the normalized unmarked subspace. The uniform state can be written

$$
|s> = \sin(\theta)|G> + \cos(\theta)|B>,
\qquad \sin^2(\theta)=M/N.
$$

After `r` Grover iterations, the ideal success probability is

$$
P_{good}(r)=\sin^2((2r+1)\theta).
$$

For one marked item among four, `sin(θ)=1/2`, so `θ=π/6`. One iteration gives `sin²(π/2)=1`. A second iteration gives `sin²(5π/6)=1/4`, which is the overshoot in this tiny example.

## Visual explanation before equations

The first figure below shows signed amplitudes, not probabilities. That distinction is essential: the oracle changes a sign without changing the Z-basis histogram, and the diffusion step uses that sign.

![Uniform, phase-marked, and amplified signed amplitudes for a four-item search.](/learn/visuals/grover-amplitudes.svg)

![The two-dimensional angle view shows Grover as rotation toward the good subspace.](/learn/visuals/grover-geometry.svg)

The success sequence makes the stopping rule visible. In a four-item problem the first iteration is perfect, but repeated iterations do not keep improving probability.

![The ideal success curve rises and then oscillates because each Grover round is a rotation.](/learn/visuals/grover-success.svg)

## Worked example 1: mark 11

Start with

$$
|s> = \frac{1}{2}(|00>+|01>+|10>+|11>).
$$

Choose `11` as the marked item. The phase oracle gives

$$
|s'>=\frac{1}{2}(|00>+|01>+|10>-|11>).
$$

The amplitudes are `[0.5,0.5,0.5,-0.5]`. Their mean is `(0.5+0.5+0.5-0.5)/4=0.25`. The diffusion map sends each amplitude `a` to `2(0.25)-a`:

$$
0.5\mapsto 0,\qquad -0.5\mapsto 1.
$$

The state becomes `|11>` and measurement succeeds with probability one. This is a complete round: oracle first, diffusion second.

![The marked amplitude becomes dominant, while the unmarked amplitudes shrink to zero.](/learn/visuals/grover-overshoot.svg)

## Worked example 2: why another iteration is worse

Applying the same Grover round to `|11>` does not leave it fixed. The phase oracle changes its amplitude to `-1`. The other three amplitudes are zero, so the mean is `-1/4`. Diffusion sends each unmarked zero to `-1/2` and the marked `-1` to `-1/2`. Up to a global sign, the state is again uniform. Its success probability is now `1/4`.

The angle formula predicts this without expanding every gate. With `θ=π/6`, `r=0` gives `sin²(π/6)=1/4`, `r=1` gives `sin²(π/2)=1`, and `r=2` gives `sin²(5π/6)=1/4`. The best integer is near `π/(4θ)-1/2`, not “as many iterations as possible.”

## Oracle cost and unknown search structure

The black-box query count is approximately `O(sqrt(N/M))` when the number of marked items is known or controlled. Each round still calls the marking oracle. Building a condition checker can be the dominant cost, and a real device pays for depth, ancillas, routing, uncomputation, readout, and noise.

If `M` is unknown, a practical algorithm must use a schedule or estimate the marked fraction. If there are many marked items, the initial success probability may already be high. If no item is marked, the phase oracle and diffusion do not produce the promised search result. These cases belong in the specification of the problem.

## Why the diffusion formula works

Let the amplitudes after the oracle be `a_x` and let their mean be `m`. The diffusion operator sends every amplitude to `2m-a_x`. This is a reflection because applying the map twice returns `a_x`: `2m-(2m-a_x)=a_x`. It also preserves the norm when implemented as `2|s><s|-I`, because it is a unitary reflection about the uniform direction.

In the four-item example, the three unmarked amplitudes are all equal, so they form one direction called the bad subspace. The marked basis vector forms the good direction. The entire state stays in the two-dimensional plane spanned by those directions, even though the circuit acts on a four-dimensional register. That reduction is why the angle picture can predict the probability without writing every matrix product.

## Several marked states

If there are `M` marked states, the initial good-subspace probability is `M/N`, not `1/N`. The angle satisfies `sin²(θ)=M/N`, and each iteration advances the state by `2θ` in the good-bad plane. When `M` is large, fewer rounds are useful. When the oracle marks a superposition of good states, measurement returns one of them according to the final amplitudes, so finding a solution still requires a classical verification step.

## What a fair benchmark includes

A search comparison should specify how candidates are loaded, how the predicate is implemented, how many oracle calls are made, how many shots are used, and how a returned candidate is verified. A classical algorithm may stop early on an easy instance, while a quantum run may require repetitions to reach a desired confidence. The asymptotic black-box statement is important, but the engineering boundary is part of the result.

The same checklist helps debug a classroom experiment. First verify the marked predicate on each basis label. Next verify that the oracle changes only the intended phase. Then inspect the mean before diffusion and compare the predicted amplitudes with the circuit result. Finally sample enough times to distinguish a probability near one from a single lucky outcome. This staged approach keeps algebra, circuit construction, and statistics separate.

## Interactive prediction

Select the marked state and move the iteration control through zero, one, and two. Predict the success probability before moving the control. For the default marked state `11`, the first iteration reaches one and the second drops back to one quarter.

```interactive
{"widget":"grover-explorer","preset":"four-candidates"}
```

Inline check: if changing the marked label changes the identity of the peak but not the ideal probability sequence, the widget is showing symmetry correctly.

## Common mistakes

- Treating the phase oracle as a measurement. It only changes amplitudes.
- Plotting probability bars when the explanation needs signed amplitudes.
- Assuming diffusion means “make the marked item larger” without calculating the mean reflection.
- Running more rounds after the peak and expecting monotonic improvement.
- Ignoring the cost of constructing and calling the marking oracle.
- Applying the one-marked-item angle to an instance with a different `M`.

## Summary and glossary

Grover begins with a uniform superposition, marks good states by a phase oracle, and reflects amplitudes about their mean. Each round rotates the state toward the good subspace. For `N=4,M=1`, the first round gives probability one, while the next overshoots. The query advantage is an ideal black-box statement and must be reported with oracle and hardware costs.

Glossary: **marked state** satisfies the search predicate; **phase oracle** flips its amplitude sign; **diffusion** is reflection about the uniform mean; **good subspace** spans marked states; **overshoot** is the fall in success after rotating past the peak; **query complexity** counts oracle calls.

## Assessment

Answer the chapter quiz after calculating the mean in the four-item example. The questions check oracle-versus-diffusion roles, signed amplitudes, the angle formula, stopping, and implementation caveats.

## Transfer problem

Suppose `N=16` and `M=1`. Estimate `θ` from `sin²(θ)=1/16`, then use the success formula to compare zero and one iteration. Explain why the continuous optimum still needs an integer schedule.

## Lab connection

Try the Grover challenge in the Lab. Mark the requested state, run the circuit, and compare the sampled histogram with the amplitude reasoning. Debugging prompt: if the marked state remains at one quarter, check that the oracle applies a phase and that the diffusion block is applied after it, not before it.

Try this in Lab: [open the Grover challenge](/lab?challenge=grover).

## Chapter quiz

Answer every question and inspect the explanations. The question count follows the search and amplification content rather than a fixed ten-question requirement.

## Sources

- Lov Grover, [A fast quantum mechanical algorithm for database search](https://arxiv.org/abs/quant-ph/9605043).
- IBM Quantum, [Grover's algorithm](https://quantum.cloud.ibm.com/docs/en/tutorials/grovers-algorithm).
