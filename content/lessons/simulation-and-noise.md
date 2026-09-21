# Simulation foundations

Simulation is the bridge between a circuit written on paper and the result panels shown by a quantum platform. It is also a source of easy confusion. An exact statevector is not a hardware measurement, a histogram can be exact or sampled, and a density matrix can describe a noisy ensemble that no single trajectory represents. This chapter gives you a vocabulary for choosing the right view before the framework chapters show the APIs.

## Learning objectives

By the end of this lesson you should be able to:

- distinguish statevector, sampling and density-matrix simulation;
- separate shot noise from device or channel noise;
- estimate dense statevector and density-matrix scaling;
- read circuit, statevector, histogram and Bloch panels together; and
- explain what seeds reproduce and what they do not.

## Why this concept matters

The same circuit can produce several valid outputs. A learner may need amplitudes to debug phase, probabilities to compare an exact distribution, counts to imitate an experiment, or a density matrix to describe noise. Choosing a result type is part of the experiment specification, not merely a display preference.

Simulation also makes the Lab reproducible. A fixed circuit, engine, basis convention, shot count and seed can be rerun locally. That is valuable for a teaching platform, but it must not be presented as evidence that a physical device will return the same exact state. A simulator evaluates a model; hardware samples an unknown physical state through measurements.

![One circuit can be read as operations, amplitudes, probabilities or local state summaries.](/learn/visuals/simulation-views.svg)

## Plain-language intuition

Imagine a movie of a circuit. The statevector is the full internal frame for an ideal pure-state simulation. A histogram is a stack of results collected after repeatedly asking the circuit to produce a classical outcome. A density matrix is a weighted album of possible states, useful when the preparation or channel is mixed. A Bloch sphere is a compact view of one qubit, not a complete picture of a multi-qubit register.

The panels can agree without being interchangeable. The statevector predicts the exact histogram. The histogram hides relative phase. The reduced Bloch vector can hide entanglement. The density matrix can retain coherence and mixture information that a single trajectory cannot.

## Prerequisite recap

You should know statevectors, the Born rule, density matrices and measurement bases. Recall that a statevector has one complex amplitude per computational-basis string. Recall also that measurement squares magnitudes, so phase information can disappear from a Z-basis histogram until a later gate makes it interfere.

## Notation and vocabulary

For `n` qubits, a dense pure statevector has `2^n` complex amplitudes. A dense density matrix has `2^n` rows and `2^n` columns, or `4^n` complex entries. These are storage counts, not universal runtime or memory predictions because tensor networks, stabilizer methods and trajectories can exploit structure.

**Exact simulation** calculates a state or distribution from a mathematical model. **Sampling** draws finite outcomes from that distribution. **Shots** is the number of repeated preparations and measurements. **Shot noise** is the variation caused by finite sampling. **Device noise** changes the state preparation, gates or measurement model. **Seed** makes pseudorandom choices repeatable within a defined implementation.

## Visual explanation before equations

Start with a fixed ideal Bell experiment. The exact distribution has probability one half on `00` and one half on `11`. A 32-shot sample can differ from a 128-shot sample even though the underlying probabilities are identical.

![Exact probabilities and two finite-shot histograms show sampling variation without changing the ideal circuit.](/learn/visuals/simulation-sampling.svg)

Now compare scaling. Two extra qubits multiply the dense statevector entry count by four, but they multiply the dense density-matrix entry count by sixteen. This is why a density-matrix simulation becomes expensive sooner when no special structure is available.

![Dense statevector and density-matrix entry counts grow at different exponential rates.](/learn/visuals/simulation-scaling.svg)

## Worked example 1: exact state to sampled histogram

Prepare the Bell state

$$
|\Phi^+\rangle=\frac{|00\rangle+|11\rangle}{\sqrt2}.
$$

The statevector in `00,01,10,11` order is `[1/sqrt(2),0,0,1/sqrt(2)]`. Squaring magnitudes gives exact probabilities `[1/2,0,0,1/2]`. A 10-shot sample might record `00:6, 11:4`; a 1,024-shot sample might record values near 512 each. Neither sample should contain `01` or `10` in the ideal model, but the counts are not required to be exactly equal.

The statevector is not the result of one measurement. It is the simulator's mathematical description before measurement. If a real device produces a count table, we cannot infer the exact hidden state from one finite table without assumptions and tomography.

## Worked example 2: shot noise versus channel noise

Prepare `|+>`, apply Z with probability `p`, then apply H and measure Z. If no Z occurred, H maps `|+>` to `|0>`. If Z occurred, H maps `|->` to `|1>`. Therefore the exact output distribution is

$$
P(0)=1-p,\qquad P(1)=p.
$$

At `p=1/4`, the ideal channel predicts 75 percent zeros and 25 percent ones. A 100-shot run might produce 73 and 27. That fluctuation is shot noise. The shift from the ideal `p=0` distribution to the `p=1/4` distribution is caused by the modeled phase-flip channel. More shots estimate the shifted distribution more precisely; they do not remove the channel.

The corresponding density matrix before the final H is

$$
\rho=\frac12\begin{pmatrix}1&1-2p\\1-2p&1\end{pmatrix}.
$$

At `p=1/2`, its off-diagonal coherence vanishes and the ensemble is `I/2`. At `p=1`, Z happens every time, so the state is pure `|->` before H. Maximum mixing in this example occurs in the middle, not at the endpoint.

![A phase-flip channel changes the underlying distribution, while finite shots add a separate layer of variation.](/learn/visuals/noise-comparison.svg)

## Four result panels

![Circuit, statevector, histogram and reduced Bloch panels answer complementary questions for a Bell pair.](/learn/visuals/result-panels.svg)

The circuit panel tells you what happened in time. The statevector panel tells you the exact amplitudes under a declared basis order. The histogram panel tells you exact probabilities or sampled counts, so its label should say which one. The Bloch panel summarizes one qubit's local state. For a Bell pair, the joint statevector is pure while each reduced local Bloch vector is at the center. A pair of surface arrows would be wrong because it would suggest each local qubit has its own pure state.

## Interactive prediction

Choose the representation, switch between exact and sampled output, and move the noise slider. Predict which panel changes first. Sampling changes the counts while the exact distribution stays fixed. A noise channel changes the predicted state or probability distribution itself.

```interactive
{"widget":"simulation-explorer","preset":"bell-noise-views"}
```

Inline check: if the same seed produces different values after changing the circuit or shot count, that is expected. A seed does not override the experiment definition.

## Reproducibility checklist

Record the circuit fixture or source code, framework version, simulator method, basis order, noise model, shots, seed, and result type. Two runs with the same seed inside one implementation should be repeatable if the library guarantees that behavior. Two different libraries can use different pseudorandom generators and still agree on the ideal distribution without producing identical count-by-count samples.

This is why the QuantLearn Lab compares probabilities and conventions before comparing sampled frequencies. A mismatch in `00` versus `01` can be a bit-order bug, while a small count difference may be ordinary sampling variation.

## Common mistakes

- Calling an exact statevector a hardware measurement.
- Treating a histogram as exact without checking whether it came from probabilities or finite shots.
- Calling shot noise device noise, or assuming more shots remove device bias.
- Using a local Bloch sphere to describe all correlations in an entangled register.
- Comparing frameworks before normalizing basis order and wire labels.
- Treating dense `2^n` and `4^n` counts as universal performance claims.

## Summary and glossary

Statevectors show exact pure-state amplitudes. Sampling produces finite classical counts. Density matrices describe mixed states and noisy ensembles. Bloch spheres summarize one-qubit views. Shot noise comes from finite repetitions; device noise changes the model or hardware behavior. Seeds support reproducibility within a setup, but identical seeds across frameworks do not guarantee identical samples.

Glossary: **statevector** is an amplitude vector for a pure state; **density matrix** represents pure or mixed states; **shots** are repeated experiments; **sampling noise** is finite-count variation; **device noise** changes the channel or measurement; **seed** initializes pseudorandom sampling; **basis order** maps array entries to bitstrings.

## Assessment

Answer the chapter quiz after comparing the four panels and the phase-flip example. The questions check representation choice, exponential scaling, sampling, density matrices and the limits of simulator claims.

## Transfer problem

You receive a histogram with `00:503, 11:521` from 1,024 shots and an exact statevector `[0.707,0,0,0.707]`. Explain which information is redundant, which is sampled, and what additional metadata you need before comparing it with another engine.

## Lab connection

Try this in Lab with the Bell-pair challenge. Run the same logical circuit and inspect the circuit, state, histogram and Bloch panels. Debugging prompt: if the ideal histogram contains `01` or `10`, check the entangling gate, bit order and whether a noise option was enabled before changing the shot count.

Try this in Lab: [open the Bell-pair challenge](/lab?challenge=bell).

## Chapter quiz

Answer every question and read the explanations. The question count follows the representation and noise content in this foundation chapter.

## Sources

- Qiskit Aer, [Simulators](https://qiskit.github.io/qiskit-aer/tutorials/1_aersimulator.html).
- Google Quantum AI, [Representing noise](https://quantumai.google/cirq/noise/representing_noise).
- PennyLane, [Measurements](https://docs.pennylane.ai/en/stable/introduction/measurements.html).
- IBM Quantum, [Visualization API](https://quantum.cloud.ibm.com/docs/en/api/qiskit/visualization).
