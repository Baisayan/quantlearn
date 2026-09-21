# PennyLane

PennyLane presents a quantum program as a quantum function bound to a device through a QNode. The device decides how the circuit is executed, the operations act on named wires, and the return statement chooses the measurement contract. The same parameterized function can return an exact state, probabilities, finite counts or expectation values. That flexibility is the foundation for differentiable hybrid algorithms.

## Learning objectives

By the end of this lesson you should be able to:

- explain devices, wires, quantum functions and QNodes;
- choose between `qml.state()`, `qml.probs()`, `qml.counts()` and expectation returns;
- describe what `default.qubit` means and does not mean;
- use finite shots for sampled results; and
- understand a basic gradient of a parameterized `RY` circuit.

## Why this concept matters

PennyLane makes the measurement contract visible in the function body. That is useful when teaching because a learner can see whether a program is asking for amplitudes, probabilities, counts or a scalar objective. It also makes the connection to QAOA and VQE direct: a classical optimizer can call the same QNode at many parameter values and use an expectation or gradient.

The abstraction should not be confused with a physical backend. `default.qubit` is a local ideal simulator. A device object is an execution target, but the target can be a simulator, plugin or hardware service depending on the selected configuration. This lesson keeps the example local and safe.

## Plain-language intuition

Think of a quantum function as a recipe that accepts parameters. A device is the kitchen where the recipe is evaluated. A QNode is the wrapper that binds the recipe to that kitchen. The final measurement line is the question you ask: show me the state, the probabilities, sampled counts, or the average of an observable.

Changing only the measurement return can change the type of answer without changing the logical gate sequence. Changing `shots` turns exact probabilities into a finite sample. Changing `theta` changes the prepared state and therefore every measurement derived from it.

## Prerequisite recap

You should know `RY(theta)|0>`, statevectors, Born-rule probabilities, counts, expectation values and the VQE parameter loop. You should also understand that finite shots require repeated measurement and that an expectation is not the same object as a probability.

## Notation and vocabulary

`qml.device("default.qubit", wires=1)` creates a local ideal simulator with one wire. A quantum function is a Python function containing operations such as `qml.RY(theta, wires=0)`. `@qml.qnode(device)` wraps that function into an executable QNode. `qml.state()` returns exact amplitudes for an unmeasured ideal run. `qml.probs()` returns exact basis probabilities when shots are not finite. `qml.counts()` returns a sampled count map when shots are configured. `qml.expval(qml.PauliZ(0))` returns an expectation value.

Gradients require a differentiable parameter, a compatible device and a differentiable measurement. The simple `RY` example has a known exact derivative, which lets the widget show the idea without pretending that every backend supports every gradient method identically.

## Visual explanation before equations

The device and QNode relationship comes first.

![A PennyLane device supplies wires and execution while a QNode binds the quantum function.](/learn/visuals/pennylane-device.svg)

The QNode then chooses its return measurement.

![A single PennyLane QNode can return state, probabilities, counts or an expectation value.](/learn/visuals/pennylane-qnode.svg)

The four returns answer different questions.

![PennyLane measurement returns are compared by exactness, sampling and downstream use.](/learn/visuals/pennylane-measurements.svg)

## Worked example 1: parameterized state and measurements

```python
import pennylane as qml

dev = qml.device("default.qubit", wires=1)

@qml.qnode(dev)
def state_circuit(theta):
    qml.RY(theta, wires=0)
    return qml.state()

@qml.qnode(dev)
def probability_circuit(theta):
    qml.RY(theta, wires=0)
    return qml.probs(wires=0)
```

At `theta=0`, the state is `|0>` and the probabilities are `[1,0]`. At `theta=π`, the state is `|1>` up to the convention used by the rotation and the probabilities are `[0,1]`. At `theta=π/2`, the probabilities are `[1/2,1/2]`. The two QNodes use the same logical preparation but return different mathematical objects.

## Worked example 2: finite counts and a gradient

```python
sample_dev = qml.device("default.qubit", wires=1, shots=256)

@qml.qnode(sample_dev)
def count_circuit(theta):
    qml.RY(theta, wires=0)
    return qml.counts(wires=0, all_outcomes=True)

exact_dev = qml.device("default.qubit", wires=1)

@qml.qnode(exact_dev)
def energy(theta):
    qml.RY(theta, wires=0)
    return qml.expval(qml.PauliZ(0))
```

At `theta=π/2`, the exact Z expectation is zero, but a 256-shot count run may return a small positive or negative imbalance. The analytic function here is `E(theta)=cos(theta)`, so `dE/dtheta=-sin(theta)`. At `theta=π/2`, the derivative is `-1`, meaning a small increase in theta lowers the energy locally. A real gradient call may use parameter-shift evaluations or another supported differentiation method; the device and interface determine the implementation details.

![The parameterized PennyLane example connects theta, expectation and a gradient direction.](/learn/visuals/pennylane-gradients.svg)

## Interactive prediction

Move the `RY(theta)` slider, switch the return type, and change the device from exact to sampled mode. Predict the state and probability before revealing them. Then inspect the gradient sign near `theta=π/2`.

```interactive
{"widget":"pennylane-explorer","preset":"ry-measurements"}
```

Inline check: changing from `qml.probs()` to `qml.counts()` changes the output contract and introduces sampling variation; it does not change the underlying ideal circuit.

## Device and backend boundaries

PennyLane's device interface can target simulators and plugins, but `default.qubit` is not a physical backend. A hardware device may have limited operations, finite shots, queueing, calibration drift and device-specific wire behavior. A local exact QNode is excellent for checking an algorithmic idea, but it is not proof that a remote device will match the exact amplitudes.

The differentiable programming story also has boundaries. Not every measurement is differentiable in the same way, and finite-shot gradients can be noisy. A classical optimizer should record the measurement return, shot count, parameter values, gradient method and device name alongside its objective history.

## Common mistakes

- Calling `default.qubit` a quantum processor. It is a local ideal simulator.
- Returning `qml.state()` and describing it as sampled hardware data.
- Expecting `qml.counts()` with finite shots to equal exact probabilities every run.
- Forgetting that wire labels are part of the circuit contract.
- Comparing a gradient from one shot setting with an exact expectation without labeling the difference.
- Assuming every PennyLane device supports the same operations, shots and differentiation method.

## Summary and glossary

PennyLane binds a quantum function to a device through a QNode. Operations use named wires and the return measurement chooses the result type. State and probability returns are exact for an ideal unmeasured simulator; counts are sampled when shots are finite; expectations support cost functions; gradients connect the QNode to a classical optimizer. `default.qubit` is a local simulator, not automatic hardware access.

Glossary: **device** is an execution target; **wire** is a qubit label; **quantum function** is a parameterized circuit recipe; **QNode** binds a function to a device; **measurement return** selects result data; **shots** enable sampling; **gradient** is a parameter sensitivity used by an optimizer.

## Assessment

Answer the chapter quiz after running the state, probability and count examples conceptually. The questions check device versus backend, QNodes, measurement returns, finite shots and basic gradients.

## Transfer problem

Design two QNodes for `RY(theta)|0>`: one should return `<Z>` exactly and another should return sampled counts with 100 shots. State what stays the same, what changes, and what metadata should be recorded for comparison.

## Lab connection

Try the Bell-pair challenge in Lab and compare the PennyLane-style measurement choices with the Lab's result panels. Debugging prompt: if a count result looks different from an exact probability, check shots and compare frequencies rather than expecting identical integers.

Try this in Lab: [open the Bell-pair challenge](/lab?challenge=bell).

## Chapter quiz

Answer every question and read the feedback. The count follows the device, measurement and differentiability content in this chapter.

## Sources

- PennyLane, [Circuits](https://docs.pennylane.ai/en/stable/introduction/circuits.html).
- PennyLane, [Measurements](https://docs.pennylane.ai/en/stable/introduction/measurements.html).
- PennyLane, [Interfaces](https://docs.pennylane.ai/en/stable/introduction/interfaces.html).
