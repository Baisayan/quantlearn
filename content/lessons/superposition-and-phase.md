# Superposition, phase and interference

## Learning objectives

By the end of this lesson, you should be able to:

- describe superposition without treating it as readable classical parallelism;
- distinguish global phase from relative phase;
- explain constructive and destructive interference; and
- predict the outcomes of H-H and H-Z-H on $|0\rangle$.

## Why the concept matters

Superposition is often introduced as “a qubit is 0 and 1 at once.” That phrase is memorable but incomplete. The useful statement is that a quantum state is a linear combination of basis states, with amplitudes that can later add or cancel. The power is not that a detector reads every branch. The power is that a circuit can transform phase relationships into a measurable bias.

Interference is the bridge from state notation to algorithms. Hadamard gates create and recombine paths. A phase gate changes the sign or angle of an amplitude without necessarily changing its immediate Z histogram. A later gate can make that hidden difference visible.

## Prerequisite recap

You know that a qubit state is normalized and that squared magnitudes give measurement probabilities. You have seen that $|+\rangle$ and $|-\rangle$ both give 50/50 in Z, and that H maps them to $|0\rangle$ and $|1\rangle$. You also know that measurement basis matters.

## Notation and vocabulary

The balanced states are

$$
|+\rangle=\frac{|0\rangle+|1\rangle}{\sqrt2},
\qquad
|-\rangle=\frac{|0\rangle-|1\rangle}{\sqrt2}.
$$

Superposition means a linear combination of basis states. Relative phase is the phase difference between terms. Interference is the addition of amplitudes before squared magnitude is taken. Constructive interference increases an amplitude; destructive interference reduces or cancels it.

## Visual explanation before equations

The two states below have identical Z-basis probabilities. The sign is still a real difference in the statevector.

![Two equal-probability states with different relative phases.](/learn/visuals/phase-comparison.svg)

Apply H to each state. Since

$$
H|+\rangle=|0\rangle,
\qquad H|-\rangle=|1\rangle,
$$

the final measurement is different. In the $|+\rangle$ case, contributions add in the $|0\rangle$ output and cancel in $|1\rangle$. In the $|-\rangle$ case, the sign swap reverses which output receives constructive interference.

![Hadamard recombination makes a relative-phase difference visible.](/learn/visuals/interference.svg)

The signed amplitude picture is often more explanatory than a histogram. The histogram squares away signs. The amplitude view shows the cancellation before probabilities are formed.

![Signed amplitudes add before they are squared into final probabilities.](/learn/visuals/interference-amplitudes.svg)

## Global phase versus relative phase

Multiplying both terms by $i$ gives $i|+\rangle$. Every amplitude rotates by the same angle, so all measurement predictions remain unchanged. That is a global phase. Multiplying only the $|1\rangle$ term by $-1$ turns $|+\rangle$ into $|-\rangle$. The phase relationship inside the superposition changed, so a later H produces a different outcome.

The practical test is simple: if a change multiplies the whole state by the same nonzero phase, it is global. If it changes one path relative to another, it may affect interference. You do not need to assign physical meaning to the global angle for a single isolated state; you do need to track relative phases inside a circuit.

## Worked example: H-H

Start with $|0\rangle$. The first H creates $|+\rangle$:

$$
|0\rangle\xrightarrow{H}\frac{|0\rangle+|1\rangle}{\sqrt2}.
$$

The second H recombines the branches:

$$
H\frac{|0\rangle+|1\rangle}{\sqrt2}=|0\rangle.
$$

Therefore a Z measurement returns 0 with probability one. The intermediate superposition did not create a permanently random output. The second gate used the relative phase of the two branches to cancel the $|1\rangle$ amplitude.

## Second example: H-Z-H

Again start with $|0\rangle$. The first H creates $|+\rangle$. Z leaves $|0\rangle$ alone and changes the sign of $|1\rangle$:

$$
Z|+\rangle=|-\rangle.
$$

The final H maps $|-\rangle$ to $|1\rangle$. Therefore

$$
H Z H |0\rangle=|1\rangle.
$$

The first and last H are the same as before. The only change is a phase flip between them, yet the final classical result changes from certain 0 to certain 1. That is interference turning phase into an observable bit.

## A phase slider as a family of states

For the family

$$
|\psi(\phi)\rangle=\frac{|0\rangle+e^{i\phi}|1\rangle}{\sqrt2},
$$

the direct Z probabilities remain 1/2 and 1/2 for every $\phi$. After a final H, the probability of 0 is

$$
P(0)=\frac{1+\cos\phi}{2}.
$$

At $\phi=0$, the paths reinforce the zero output. At $\phi=\pi$, they reinforce the one output. At $\phi=\pi/2$, they share the output evenly. A phase slider is therefore a compact way to see why “same histogram now” does not imply “same behavior later.”

This formula also explains why a phase gate can look inactive if you inspect the wrong panel. Before the final H, every value of $\phi$ in this balanced family gives the same Z histogram. After the H, the cosine term converts the phase into an output bias. The circuit is not creating information from nowhere; it is choosing an observable that is sensitive to a relationship already present in the state.

## Interactive prediction

Choose H-H or H-Z-H, predict the final bit, and then run the local calculation. The widget exposes the final state and explanation without creating another Lab circuit or storing an attempt.

```interactive
{"widget":"phase-interference","preset":"hzh","labChallenge":"interference"}
```

## Transfer problem

Predict the final distribution for $|0\rangle\to H\to S\to H\to M$. The phase is $\phi=\pi/2$, so the formula gives $P(0)=1/2$ and $P(1)=1/2$. Compare this with H-H and H-Z-H. The three circuits have the same preparation and analyzer but different phase evolution, so the output makes the hidden middle step visible.

## Lab connection

The adjacent Lab challenges turn this idea into construction: first prepare a plus state, then place Z between two H gates and inspect the result. After the quiz, the page offers the matching challenge cards so you can build the circuit in the real workspace. The lesson explains the prediction; the Lab handles execution, grading and saved attempts.

Use three checkpoints while debugging: inspect the state after the first H, inspect it after the phase gate, and inspect the final measurement after the second H. If the first histogram looks unchanged, that is expected. The useful evidence is the statevector sign or angle between preparation and analysis, followed by the final change in output probabilities.

## Common mistakes

- Saying superposition means a detector returns both basis values in one shot.
- Calling every phase global. Only a common phase on the whole state is global.
- Squaring amplitudes before adding paths. Interference happens at the amplitude level first.
- Assuming equal Z histograms prove equal states.
- Forgetting that gate order matters: HZH is not HH.
- Treating an interference result as a claim that one branch travelled a classical route.

## Summary and glossary

Superposition is a state description. Relative phase changes how amplitudes recombine, while global phase does not change isolated measurement probabilities. H-H returns $|0\rangle$ from $|0\rangle$; H-Z-H returns $|1\rangle$. Interference is the reason a phase that is hidden in one basis can become visible after a circuit transformation.

**Superposition:** linear combination of basis states. **Relative phase:** phase difference between terms. **Global phase:** common phase on the full state. **Interference:** amplitude addition and cancellation before probability calculation. **Phase flip:** Z's sign change on the $|1\rangle$ component.

## Chapter quiz

Answer every question and predict the final state before doing the matrix multiplication. This eight-question check focuses on phase, H-H, H-Z-H and amplitude cancellation. There is no pass threshold; read each explanation before retrying.

## Sources

- [Quantum information: single systems](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information). IBM Quantum Learning / John Watrous.
- [Gates and operations](https://quantumai.google/cirq/build/gates). Google Quantum AI.
