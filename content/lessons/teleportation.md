# Teleportation and classical control

## Learning objectives

Trace a three-qubit protocol and recover an unknown input using two classical measurement results.

## Resources and wire names

Let q0 hold the input $|\psi\rangle=\alpha|0\rangle+\beta|1\rangle$. Alice also holds q1; Bob holds q2. Prepare a Bell pair on q1 and q2 with H(q1), CX(q1,q2). The input can remain unknown to both parties.

Alice applies CX(q0,q1), then H(q0). She measures q0 into m0 and q1 into m1. Bob applies X if m1=1, then Z if m0=1. These are classical conditions.

![Teleportation circuit with dashed classical control links and separate input, Alice and Bob wires.](/learn/visuals/teleportation.svg)

## Read the correction table carefully

With the outcomes written m0m1, Bob's state before correction and his action are:

| m0m1 | Before correction | Apply in time order |
|---|---|---|
| 00 | psi | I |
| 01 | X psi | X |
| 10 | Z psi | Z |
| 11 | XZ psi | X, then Z |

![Four equally probable measurement branches and their correction operations.](/learn/visuals/teleportation-corrections.svg)

The outcome order here is explicitly m0m1, not the default printed Qiskit register order. The table's labels define its meaning.

## Verify one branch

For outcome 01, Bob holds $\beta|0\rangle+\alpha|1\rangle$. Applying X gives $\alpha|0\rangle+\beta|1\rangle$. For outcome 11, applying X then Z undoes the branch's XZ transformation. Overall phase is irrelevant to the recovered state.

Each branch occurs with probability 1/4 in the ideal protocol. A complex test input, $\sqrt3|0\rangle/2+i|1\rangle/2$, checks that the recovery preserves phase as well as probabilities. Testing only inputs 0 and 1 would miss some errors.

## Follow a correction without assuming the answer

Use the complex test input and suppose Alice reports m0m1=10. Bob then has $[\sqrt3/2,-i/2]^T$. Z changes the sign of the second entry, recovering $[\sqrt3/2,i/2]^T$. The correction restores phase, not just the probabilities 3/4 and 1/4.

For outcome 11, the pre-correction vector is $[-i/2,\sqrt3/2]^T$. X first gives $[\sqrt3/2,-i/2]^T$, and Z then gives the original vector. This row-by-row calculation is safer than relying on an unlabeled string of gate letters.

The two measurement bits do not contain a readable list of the unknown amplitudes. Their four possible values occur equally often in the ideal protocol, independently of those amplitudes. The entangled resource and the conditional operations are essential to recovery.

If testing an implementation, include zero, one and a superposition with nontrivial relative phase. A missing Z correction may look harmless on basis-state inputs because a sign there can be global. On a superposition it can change the physical state. Compare the full recovered state up to global phase, rather than accepting matching Z probabilities as sufficient.

## What is transported?

The protocol transfers a quantum state using a shared entangled resource and two classical bits. It does not transport matter. Alice's measurements consume the original input state and the Bell resource, so this is not cloning.

Before receiving the classical bits, Bob's unconditioned state is $I/2$. He cannot recover a usable message early. The need for classical communication preserves the usual limit on signaling speed.

## Summary

Identify ownership, measurements, bit names and correction order. A successful test compares recovered states up to global phase, not merely a Z histogram.

## Chapter quiz

Answer all 10 questions in order: 3 easy checks, 4 medium applications and 3 harder reasoning questions. Use the worked examples if you get stuck. After submitting, read the explanations and revisit the relevant section before retrying.

## Sources

- [Quantum teleportation](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/entanglement-in-action/quantum-teleportation). IBM Quantum Learning / John Watrous.
- [Quantum circuits](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/quantum-circuits). IBM Quantum Learning / John Watrous.
