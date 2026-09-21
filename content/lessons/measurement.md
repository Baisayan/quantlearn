# Measurement and repeated shots

## Learning objectives

By the end of this lesson, you should be able to:

- apply the Born rule to a statevector;
- distinguish collapse, fresh preparation and finite-shot sampling;
- estimate probabilities and expectation values from counts; and
- explain how Z and X measurement bases differ.

## Why the concept matters

Measurement is where a quantum state becomes ordinary data. It is also where many beginner explanations become misleading. A statevector contains amplitudes, but a detector records a classical outcome. A probability is an exact model prediction, but a finite histogram is a sample. A collapsed state is not the same experiment as preparing a fresh state for every shot.

These distinctions matter in the Lab. When you increase the shots setting, the circuit is not changing its ideal state. You are collecting more samples from the same prepared distribution. When you add a Hadamard before a detector, you are changing the measurement basis, not merely decorating the circuit.

## Prerequisite recap

You know that a normalized qubit can be written $|\psi\rangle=\alpha|0\rangle+\beta|1\rangle$ and that Z-basis probabilities are squared magnitudes. You also know that $|+\rangle$ and $|-\rangle$ have equal Z probabilities even though their relative phases differ.

## Notation and vocabulary

The Born rule says that a Z measurement returns 0 with $P(0)=|\alpha|^2$ and 1 with $P(1)=|\beta|^2$. Collapse means that after an ideal result 0, the measured qubit is in $|0\rangle$ for an immediate repeat in the same basis. A shot means one complete prepare, operate and measure trial. A histogram estimates the exact distribution from a finite number of shots.

An expectation value is an average of signed observable outcomes. For a Pauli measurement, map detector bit 0 to eigenvalue $+1$ and bit 1 to eigenvalue $-1$:

$$
\langle Z\rangle\approx\frac{n_0-n_1}{N}.
$$

## Visual explanation before equations

Take the state from the previous lesson, with $P(0)=3/4$ and $P(1)=1/4$. The exact distribution is fixed. A synthetic sample of 16 shots may be 11 zeros and 5 ones, while a larger sample is usually closer to 75/25.

![Exact probabilities compared with reproducible finite-shot samples.](/learn/visuals/measurement.svg)

The rough sampling uncertainty of an estimated probability is

$$
\sqrt{\frac{p(1-p)}{N}}.
$$

For $p=0.75$, this is about 0.108 at 16 shots and 0.0135 at 1,024 shots. More samples reduce random sampling uncertainty. They do not remove a systematic device bias, a wrong circuit, or a mistaken basis convention.

![A shot-count comparison showing expected zeros, sampling precision and the limit of more data.](/learn/visuals/measurement-sampling.svg)

## Choose the measurement basis

Z measurement distinguishes $|0\rangle$ and $|1\rangle$. X measurement distinguishes $|+\rangle$ and $|-\rangle$. A common circuit implementation is to apply H immediately before a Z detector. That H rotates the X basis into the computational basis.

![The same state can be measured directly in Z or analyzed in X with a final Hadamard.](/learn/visuals/measurement-bases.svg)

For $|+\rangle$, direct Z measurement is 50/50. Applying H first produces $|0\rangle$, so the X-basis result is deterministic. For $|-\rangle$, H produces $|1\rangle$. The detector bit is still a classical 0 or 1, but its interpretation as an observable eigenvalue depends on the basis.

## Collapse versus fresh preparation

Suppose you prepare $|+\rangle$ and measure in Z. If the result is 0, an immediate second Z measurement of that same collapsed system returns 0 ideally. That does not mean that the original $|+\rangle$ had probability one for zero. It means the first measurement changed the state.

To estimate the original 50/50 distribution, prepare a new $|+\rangle$ for every shot. The experiment is therefore:

1. prepare a fresh state;
2. apply the chosen gates;
3. measure once; and
4. record the outcome.

Repeating the final measurement without re-preparing answers a different question about the post-measurement state.

## Worked example: 3/4 across different shot counts

For $p=3/4$, the expected zero count is $3N/4$. At 16 shots the expected count is 12 zeros and 4 ones. At 100 shots it is 75 and 25. At 1,024 shots it is 768 and 256. These are expected counts, not promises about every run.

If an actual 16-shot run gives 11 zeros, its estimate is $11/16=0.6875$. That does not disprove the 0.75 model. It is a normal finite sample. If a large run stays far from the model, check the circuit, basis, noise settings and implementation.

## Second example: estimate an expectation

Suppose 100 fresh preparations produce 70 detector zeros and 30 ones. The estimated probability of zero is $0.7$. If these bits encode a Pauli observable, the expectation is

$$
\frac{70(+1)+30(-1)}{100}=\frac{70-30}{100}=0.4.
$$

The answer is not 0.7 because an expectation uses signed eigenvalues. This conversion is essential in variational algorithms, where energy is built from observable averages.

## Reading finite counts honestly

Always record the state preparation, measurement basis, shot count and whether the values are exact or sampled. A simulator may show exact probabilities beside sampled counts. A real device may add readout errors and gate noise on top of sampling variation. More shots help separate random fluctuation from a persistent offset, but they cannot correct the experiment by themselves.

The inverse-square-root rule is easy to underestimate. Going from 100 shots to 400 shots halves the random uncertainty, but it requires four times as many trials. If the experiment has a fixed readout error, estimates may cluster around the wrong value even as the bars become visually stable. A careful report names both statistical uncertainty and possible systematic error.

## Interactive prediction

Choose a shot count and run a deterministic teaching sample for a state with $P(0)=0.75$. The bars keep exact probability and sample frequency side by side so the lesson can focus on interpretation without calling the Lab backend.

```interactive
{"widget":"measurement-shots","preset":"three-quarter"}
```

## Transfer problem

Suppose a fresh state is prepared 400 times and 302 zeros are recorded. Report the estimate $302/400=0.755$, then state whether this is an exact probability or a sample estimate. If the same device always returns about 0.755 for a known 0.75 state, more shots can make the offset more certain but do not prove the device is unbiased.

## Lab connection

In the Lab, run the same circuit at 16, 100 and 1,024 shots. Keep the circuit and basis fixed, then compare the histograms. Use the result panel to distinguish sampling variation from a changed circuit. This handoff makes the next practical question concrete without duplicating the Lab execution code in the lesson.

## Common mistakes

- Repeating a measurement on a collapsed state and calling it repeated sampling of the original state.
- Treating expected counts as guaranteed counts.
- Increasing shots and assuming hardware bias disappears.
- Calling an X-basis measurement a different state preparation.
- Confusing a probability such as 0.7 with an expectation such as 0.4.
- Omitting the basis when reporting a histogram.

## Summary and glossary

The Born rule maps amplitudes to probabilities. Measurement produces one outcome and can collapse the state. Fresh preparations are needed for repeated samples of the original distribution. X and Z measurements ask different questions, and expectation values convert outcome counts into signed averages.

**Collapse:** state update conditioned on a measurement outcome. **Shot:** one complete trial. **Sampling uncertainty:** variation caused by a finite number of trials. **Basis:** the set of outcomes the detector distinguishes. **Expectation value:** the average eigenvalue of an observable.

## Chapter quiz

Answer every question and show whether you are discussing an exact probability, a finite estimate or a signed expectation. This eight-question check is shorter because the worked examples and shot activity already provide practice. There is no pass threshold, and you can retry after reading the explanations.

## Sources

- [Quantum information: single systems](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information). IBM Quantum Learning / John Watrous.
- [Simulation](https://quantumai.google/cirq/simulate/simulation). Google Quantum AI.
- [Simulators](https://qiskit.github.io/qiskit-aer/tutorials/1_aersimulator.html). Qiskit Aer Documentation.
