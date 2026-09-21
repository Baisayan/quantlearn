# Classical and quantum information

## Learning objectives

By the end of this lesson, you should be able to:

- distinguish a classical bit, a probability distribution and a qubit state;
- explain why a qubit is not simply a hidden pair of classical bits;
- separate state, probability, measurement and information; and
- explain what one measurement can and cannot reveal.

## Why quantum information matters

Quantum computing starts with a change in language. A classical computer stores and manipulates bits. A quantum computer manipulates physical systems whose states are described by amplitudes, transformed by operations, and finally converted into classical results by measurement. If those ideas are mixed together, almost every later topic sounds like magic: superposition becomes “both answers at once,” measurement becomes a way to read a whole state, and interference becomes an unexplained trick.

The useful mental model is more careful. A quantum algorithm prepares a state, applies transformations, and chooses a measurement that makes a useful property visible. The state is not the same thing as the result of one measurement. A probability distribution is not the same thing as an amplitude vector. Keeping those layers separate is the foundation for reading a circuit correctly.

This matters in the Lab because the same circuit can produce a statevector, exact probabilities, and sampled counts. Each view answers a different question. A statevector can show phase; a histogram of Z-basis shots usually cannot.

## Prerequisite recap

You only need basic algebra and the idea that a probability is a number between zero and one. Probabilities for mutually exclusive outcomes add to one. For example, a classical coin model can be described by $P(0)=0.5$ and $P(1)=0.5$. One flip gives one outcome, while many independent flips reveal the distribution more clearly.

## Notation and vocabulary

A classical bit is written as 0 or 1. The two reference states of a qubit are written $|0\rangle$ and $|1\rangle$. The vertical bars are ket notation, not an absolute-value operation. A pure qubit state is commonly written

$$
|\psi\rangle=\alpha|0\rangle+\beta|1\rangle,
\qquad |\alpha|^2+|\beta|^2=1.
$$

The pair $(\alpha,\beta)$ is an amplitude description. A Z-basis measurement returns 0 with probability $|\alpha|^2$ and 1 with probability $|\beta|^2$. A shot is one prepare, operate and measure trial. Information is what an observer can infer from the state and the measurement data; it is not automatically every number appearing in a simulator panel.

## Visual explanation before equations

The following figure puts three descriptions next to one another. A classical bit has a definite value. A classical distribution stores probabilities directly. A qubit stores amplitudes, which can be complex and can later interfere.

![Comparison of a classical bit, a probability distribution, and a qubit amplitude description.](/learn/visuals/information-models.svg)

An amplitude is converted to a probability by squared magnitude, not by copying its value. For a state with amplitudes $1/\sqrt2$ and $i/\sqrt2$,

$$
\left|\frac{1}{\sqrt2}\right|^2=\frac12,
\qquad
\left|\frac{i}{\sqrt2}\right|^2=\frac12.
$$

The imaginary unit changes phase, but the squared magnitude is still a valid nonnegative probability. This is why amplitudes are richer than a probability list.

![A side-by-side amplitude and probability calculation for a balanced qubit.](/learn/visuals/amplitude-probability.svg)

## A qubit is not a hidden pair of bits

The expression $\alpha|0\rangle+\beta|1\rangle$ does not mean that the qubit secretly contains two readable classical values. It describes one state in a two-dimensional vector space. When measured in the Z basis, the device returns one classical bit. The amplitudes determine the distribution of that bit, and their relative phase can influence a later operation.

A classical random bit can also produce 0 or 1 with chosen probabilities. The difference is that a classical mixture has uncertainty about which value was selected, while a coherent quantum state can retain phase relationships between alternatives. Those phase relationships are not visible in every measurement. They become useful only when a later gate recombines the alternatives.

This distinction also prevents an information-theoretic overclaim. A single qubit measurement gives one ordinary outcome. It does not reveal both complex amplitudes, an entire probability table, or unlimited classical data. Quantum algorithms use many preparations and carefully chosen transformations to extract a limited but useful property.

## State, probability, measurement and information

Use four questions whenever you inspect a result:

1. What state was prepared before measurement?
2. Which basis or observable was measured?
3. Is the panel showing an exact probability or finite-shot counts?
4. What conclusion is justified by those observations?

For example, $|+\rangle=(|0\rangle+|1\rangle)/\sqrt2$ has a 50/50 Z-basis distribution. That does not make it identical to a classical coin mixture. Applying a Hadamard to $|+\rangle$ gives $|0\rangle$, whereas applying a Hadamard to a classical mixture of 0 and 1 still produces a 50/50 mixture in an ideal model. The future experiment distinguishes the present descriptions.

## Worked example: one qubit, two descriptions

Consider

$$
|\psi\rangle=\frac{\sqrt3}{2}|0\rangle+\frac{i}{2}|1\rangle.
$$

Step 1: identify amplitudes. The amplitude of $|0\rangle$ is $\sqrt3/2$ and the amplitude of $|1\rangle$ is $i/2$.

Step 2: square magnitudes. The probabilities are $3/4$ and $1/4$.

Step 3: check normalization. $3/4+1/4=1$, so the state is valid.

Step 4: interpret a shot. A single Z-basis measurement returns either 0 or 1. It does not return “75% zero.” That percentage is a long-run prediction over freshly prepared copies.

The classical distribution $(0.75,0.25)$ matches this one measurement basis, but it does not retain the phase information in $i/2$. A later circuit can expose that difference.

## Second example: repeated shots

Suppose the same state is freshly prepared 16 times. The expected count is 12 zeros and 4 ones, but the actual sample could be 10 and 6 or 13 and 3. The exact probabilities do not change when the sample fluctuates. Increasing the number of shots makes the estimate more stable; it does not turn a random sample into a deterministic list.

The figure below emphasizes this boundary. A one-shot experiment yields one bit. Repeating the preparation produces evidence about a distribution. State reconstruction would require still more carefully selected measurements.

![One measurement gives one classical result while fresh repetitions estimate a distribution.](/learn/visuals/one-shot.svg)

## Interactive prediction

Predict before revealing: what can one Z-basis measurement of $|+\rangle$ tell you? The small activity asks for the most precise answer and then restates the exact 50/50 distribution. It is intentionally local to the lesson; it is not a second simulator and it does not save Lab state.

```interactive
{"widget":"information-basics","preset":"plus-z"}
```

## Common mistakes

- Calling $|\alpha|^2$ an amplitude. It is a probability for the stated basis.
- Saying a qubit is both 0 and 1 in the same classical sense. A superposition is a vector state with amplitudes.
- Treating one shot as an estimate of the whole distribution. One shot is one sample.
- Assuming a Z histogram proves two states are identical. Relative phase can be hidden from that basis.
- Reading simulator statevector output as if a physical detector returned it directly.

## Summary and glossary

A bit is a classical value. A distribution predicts frequencies. A qubit state is an amplitude vector whose squared magnitudes give probabilities in a chosen basis. Measurement produces one classical result, and information depends on both the state and the measurement used to interrogate it.

**Amplitude:** a complex coefficient in a state description. **Basis:** the set of outcomes used to describe or measure a state. **Shot:** one fresh experiment and readout. **Superposition:** a linear combination of basis states. **Phase:** an angle carried by an amplitude; relative phase can affect interference.

## Chapter quiz

Answer every question, then review the explanations. This chapter uses a short eight-question check because the worked examples and prediction activity already provide practice. There is no pass threshold, and you can retry after revisiting any idea that felt uncertain.

## Sources

- [Quantum information: single systems](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information). IBM Quantum Learning / John Watrous.
- [Computer Science + QISE Key Concepts K-12 Framework](https://q12education.org/learning-materials/learning-materials-framework/computer-science-qise-key-concepts). Q-12 Education Partnership.
