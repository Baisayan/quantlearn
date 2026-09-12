# Measurement and repeated shots

## Learning objectives

Use the Born rule, interpret finite histograms, and distinguish Z measurement from X measurement.

## Probabilities become observations

For $|\psi\rangle=\alpha|0\rangle+\beta|1\rangle$, a Z measurement returns 0 with probability $|\alpha|^2$. Conditional on that result, an ideal projective measurement leaves the qubit in $|0\rangle$. A second Z measurement, with no intervening operation or noise, then returns 0 again.

To estimate the original distribution, prepare a fresh state for each repetition. These repeated prepare-operate-measure experiments are called shots. Repeatedly measuring the same collapsed state is a different experiment.

## Exact predictions and finite counts

Our example has $P(0)=3/4$. The expected count of 0 after $N$ shots is $3N/4$, but an observed count fluctuates. If the observations are independent, the standard deviation of the estimated probability is

$$
\sqrt{p(1-p)/N}.
$$

At $N=16$, this is about 0.108. At $N=1024$, it is about 0.0135. Increasing shots reduces sampling uncertainty; it does not repair a systematically biased experiment.

![An exact 75/25 distribution beside reproducible synthetic shot counts.](/learn/visuals/measurement.svg)

The sample counts in this figure are generated with a fixed seed for teaching. They are labeled synthetic and are not claimed to be hardware results.

## Choose the measurement basis

Z measurement distinguishes $|0\rangle$ and $|1\rangle$. X measurement distinguishes $|+\rangle$ and $|-\rangle$. In a circuit that measures in Z, insert H immediately before measurement to perform an X-basis measurement on the original state.

![Z measurement is direct; X measurement uses a Hadamard before the detector.](/learn/visuals/measurement-bases.svg)

For $|+\rangle$, direct Z outcomes are 50/50. Applying H first makes the outcome 0 certain. In that X measurement, the recorded bit 0 represents the +1 eigenvalue; bit 1 represents -1. The average eigenvalue is estimated by $(n_0-n_1)/N$.

## From a count table to an estimate

Suppose 100 independently prepared qubits give 70 zeros and 30 ones. The estimated probability of zero is $70/100=0.7$. If the recorded bits label a Pauli observable, convert them to signed values before averaging: bit zero contributes +1 and bit one contributes -1. The expectation estimate is then $(70-30)/100=0.4$, not 0.7.

An expectation is the average numerical value of an observable over repeated preparations. An eigenstate has a definite value for that observable. In an X measurement, plus has value +1 and minus has value -1. Since H sends minus to one, a detector bit of one in this setting means X value -1, not a negative probability.

The uncertainty formula scales with $1/\sqrt N$. Going from 100 to 400 shots halves the standard deviation. To halve it again takes 1600 shots, assuming the same independent preparation and no change in the distribution. Four times as much data does not give four times the precision.

Before interpreting a histogram, write down whether the qubit was freshly prepared, which basis was measured and how many shots were used. These details are part of the result, not optional labels.

## What measurement does not reveal

One measurement does not identify an unknown state. A statevector displayed by a simulator is internal mathematical information, not something a physical device returns in one shot. Reconstructing a state experimentally requires many preparations and appropriate measurement settings.

## Summary

Always identify the preparation, basis, shot count and whether a figure contains exact probabilities or sampled counts. Collapse and repetition are different parts of the experiment.

## Chapter quiz

Answer all 10 questions in order: 3 easy checks, 4 medium applications and 3 harder reasoning questions. Use the worked examples if you get stuck. After submitting, read the explanations and revisit the relevant section before retrying.

## Sources

- [Quantum information: single systems](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information). IBM Quantum Learning / John Watrous.
- [Simulation](https://quantumai.google/cirq/simulate/simulation). Google Quantum AI.
- [Simulators](https://qiskit.github.io/qiskit-aer/tutorials/1_aersimulator.html). Qiskit Aer Documentation.
