# Deutsch-Jozsa

Deutsch-Jozsa is a clean first example of an algorithm that uses an oracle, phase kickback, and interference together. Its result is strongest when read precisely: under a promise that a Boolean function is either constant or balanced, one ideal quantum query distinguishes the two cases. The promise and the oracle model are part of the problem.

## Learning objectives

By the end of this lesson you should be able to:

- state the constant-or-balanced promise and recognize a function outside it;
- trace constant-zero, constant-one, and two-input XOR examples;
- explain why final Hadamards make the all-zero amplitude cancel for balanced functions;
- understand why a balanced function does not always return `11`; and
- separate the one-query statement from the cost of constructing a real oracle.

## Why this concept matters

Classically, a deterministic algorithm may need to inspect more than half of a promised function's table before it can be certain whether the function is constant or balanced. The quantum circuit queries a superposition once, uses the function values as phases, and asks one global interference question. That is a compact demonstration of how algorithms use amplitudes without claiming that a measurement exposes every branch.

The lesson is also a discipline in algorithm communication. The circuit is not a general-purpose classifier for arbitrary truth tables. The conclusion “all zero means constant” is valid because the input function is promised to belong to one of two families. If the promise is broken, the output may be nonzero for a function that is neither constant nor balanced.

![A three-qubit circuit uses a minus-state helper, an XOR oracle, and final input Hadamards.](/learn/visuals/dj-circuit.svg)

## Plain-language intuition

Imagine every input `x` sending a path through the oracle. A constant function gives every path the same sign. A balanced function gives half the paths a plus sign and half a minus sign. The final Hadamards recombine these paths at output labels. At the all-zero label, equal signs reinforce and equal numbers of opposite signs cancel.

This is not a lookup table printed in parallel. The measurement returns one output string. The algorithm has arranged that one property of the whole truth table is visible in that output distribution.

## Prerequisite recap

You should know the reversible oracle interface from the previous chapter:

$$
U_f|x\rangle|y\rangle=|x\rangle|y\oplus f(x)\rangle.
$$

With helper `|->`, this becomes phase kickback. You should also know that H maps `|0>` to `|+>` and maps `|+>` back to `|0>`. Finally, recall that probabilities are squared magnitudes, so a negative final amplitude can still produce probability one.

## Notation and vocabulary

For an n-bit input, a function is **constant** if all `2^n` outputs are the same. It is **balanced** if exactly half are zero and half are one. The promise says one of those cases is guaranteed.

The quantum input starts as `|0>^n`, then H creates

$$
\frac{1}{\sqrt{2^n}}\sum_x|x\rangle.
$$

After phase kickback, the input is

$$
\frac{1}{\sqrt{2^n}}\sum_x(-1)^{f(x)}|x\rangle.
$$

After final H gates, the amplitude of `|0>^n` is

$$
a_{0^n}=\frac{1}{2^n}\sum_x(-1)^{f(x)}.
$$

The quantum query count counts uses of `U_f`. The elementary CX, X, H and routing gates used to build it still affect circuit depth and hardware cost.

## Visual explanation before equations

Read the truth table before reading the circuit. The examples below show that the promise is a classification of tables, not a label attached to any arbitrary oracle.

![Constant and balanced truth tables are compared before running the algorithm.](/learn/visuals/dj-truth-table.svg)

For constant zero, all phase signs are positive. For constant one, all are negative. For XOR, the two input bits differ on `01` and `10`, so the signs in the order `00,01,10,11` are `+,-,-,+`.

![Signed paths add at the all-zero output for constants and cancel for balanced functions.](/learn/visuals/dj-cancellation.svg)

The output chart shows one useful example, not a universal balanced answer. A balanced function only guarantees that `00` has zero probability. Other output strings identify the particular phase pattern.

![Constant zero and balanced XOR produce distinct ideal input-register distributions in a two-bit example.](/learn/visuals/dj-results.svg)

## Worked example 1: the constant-zero function

Let `f(x)=0` for every two-bit input. The input H layer creates

$$
\frac{1}{2}(|00>+|01>+|10>+|11>).
$$

The oracle does not change any sign because `(-1)^0=+1`. The final H transform is the inverse of the first H layer, so the input returns to `|00>`. Measuring gives `00` with probability one.

The helper began in `|->`, but it is not the register used for the classification. It remains factored from the input and can be ignored after the query. This is a useful reminder: the helper enables phase kickback, then the input interference carries the evidence.

## Worked example 2: the constant-one and XOR functions

For `f(x)=1`, all four input branches receive a minus sign. The input state is `-|++>`. Final H gates return `-|00>`. The global minus has no observable effect, so the measurement is still `00` with probability one. This is why the algorithm identifies both constant functions together.

For XOR, the phase pattern is `+,-,-,+`. The all-zero amplitude is

$$
a_{00}=\frac{1}{4}(1-1-1+1)=0.
$$

The remaining amplitude in this specific arrangement lands at `11`, so the ideal output is `11`. Do not generalize this result to every balanced function. A different balanced rule can return another nonzero string.

For a three-input example, take the truth table `00001111`. It is balanced. The all-zero amplitude still cancels because four terms contribute `+1` and four contribute `-1`. The rest of the distribution depends on how the signs are arranged across input labels.

## Query complexity and implementation cost

For n input bits, an exact deterministic classical strategy may need `2^(n-1)+1` queries in the worst case. After that many identical results, a balanced function is impossible under the promise. The quantum circuit uses one oracle invocation.

![The one-query comparison is meaningful only when the oracle construction cost is reported separately.](/learn/visuals/dj-query-cost.svg)

This is a query-model statement. If `f` is given as an explicit circuit, constructing and compiling it may dominate the run. A fair explanation therefore reports the promise, the oracle gate count, the depth, and the measurement model. The point of Deutsch-Jozsa is the interference pattern, not a blanket claim that every practical task gets exponential speedup.

## Reading the amplitude formula carefully

The expression for `a_{0^n}` is a signed average. There are `2^n` terms, each with magnitude one before the normalization factor. A constant-zero table contributes `2^n` positive terms. A constant-one table contributes `2^n` negative terms. Both have squared probability one at the all-zero result. A balanced table has equal positive and negative counts, so its signed sum is zero. This calculation says nothing about the exact distribution at the other output labels until the individual input positions are included.

That last point is a good example of a partial measurement claim. The algorithm is designed to answer one property with one carefully chosen output test. It does not identify the complete truth table, and it does not distinguish two functions that produce the same relevant Fourier coefficient. The promised classification is narrower than function reconstruction.

## Three-input thought experiment

Take `f(x)=x_2`, where the most significant bit is the output. The table in order `000,001,010,011,100,101,110,111` is `0,0,0,0,1,1,1,1`, so it is balanced. The first four phase signs are positive and the last four are negative. The all-zero component cancels. Because the pattern is a single input bit, the nonzero signal appears at the corresponding output label rather than necessarily at `111`. This is why the final bitstring contains structure about the function while the all-zero test contains the classification.

## Interactive prediction

Choose constant zero, constant one, or XOR. Before revealing the result, predict whether the all-zero input will appear. Then inspect both the signs and the final distribution. Selecting XOR should show a balanced phase pattern and a nonzero output other than `00` for this two-input instance.

```interactive
{"widget":"deutsch-jozsa-explorer","preset":"two-input-promise"}
```

Inline check: if your selected function produces a nonzero probability at `00`, ask whether it actually satisfies the promise. A broken promise is a problem-definition issue, not necessarily a gate error.

## Common mistakes

- Saying that balanced always means output `11`. Only all-zero is excluded.
- Forgetting the helper preparation. Without `|->`, the oracle writes a bit rather than kickback phase.
- Treating the all-negative constant state as balanced because its amplitudes are negative. Squared magnitude ignores global phase.
- Claiming that one query means one elementary gate. The oracle can contain many gates.
- Applying the conclusion to a truth table that is neither constant nor balanced.

## Summary and glossary

Deutsch-Jozsa solves a promised classification problem. H creates a uniform input superposition, phase kickback writes `(-1)^{f(x)}` into the input amplitudes, and final H gates test the signed sum. Constant functions return the all-zero input with certainty. Balanced functions have zero all-zero probability, but their nonzero output depends on the function.

Glossary: **constant** means one function value everywhere; **balanced** means equal numbers of zero and one outputs; **promise** restricts valid inputs; **phase pattern** is the list of signs after kickback; **query complexity** counts oracle uses; **oracle construction cost** counts the real circuit resources.

## Assessment

Answer the chapter quiz after tracing all three small examples. The questions cover the promise, phase signs, cancellation, output interpretation, and the classical-versus-quantum query comparison. Read the explanations because the caveat about oracle construction is part of the learning goal.

## Transfer problem

Construct a three-input balanced truth table that is not `00001111`. Predict only whether the final all-zero measurement is possible, then explain why you cannot predict the exact nonzero bitstring without calculating the phase transform.

## Lab connection

Try the Deutsch-Jozsa challenge in the Lab. Build the promised oracle, run it, and compare the measured input register with your sign prediction. Debugging prompt: check the declared bit order and confirm that final H gates are applied to every input qubit, not the helper.

Try this in Lab: [open the Deutsch-Jozsa challenge](/lab?challenge=deutsch-jozsa).

## Chapter quiz

Answer every question and read the feedback after submission. The question count follows the scope of the chapter and is not a fixed lesson template.

## Sources

- IBM Quantum, [Deutsch-Jozsa algorithm](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/deutsch-jozsa-algorithm).
- IBM Quantum, [Quantum circuits](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/quantum-circuits).
- Google Quantum AI, [Cirq gates](https://quantumai.google/cirq/build/gates).
