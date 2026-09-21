# Phase and rotation gates

## Learning objectives

By the end of this lesson, you should be able to:

- distinguish S and T from continuous rotations;
- use radians and half-angle formulas correctly;
- explain how phase becomes visible after a basis change; and
- connect Rx, Ry and Rz to motion on the Bloch sphere.

## Why the concept matters

The Pauli and Hadamard gates provide a small discrete vocabulary. Phase and rotation gates make that vocabulary continuous. They let an algorithm choose an angle, prepare a family of states, and search for a parameter that produces a useful probability or expectation value. This is the mathematical foundation for later variational circuits.

These gates also expose a subtle boundary. Two isolated gates can differ only by global phase and therefore have the same measurement predictions, yet their controlled versions can behave differently because the phase becomes relative between control branches. Treating all phase as invisible is just as dangerous as treating all phase as directly measurable.

## Plain-language intuition

S and T are fixed phase steps. They rotate an amplitude in the complex plane without changing its magnitude. Rx, Ry and Rz are adjustable rotations. A Y rotation moves probability between the north and south poles of the Bloch sphere. A Z rotation moves a state around a latitude and changes relative phase without directly changing Z probabilities.

The practical question is always: relative to which basis, and before or after which analyzer? A phase gate can look inactive in one histogram and become decisive after H.

## Prerequisite recap

You know that H creates $|+\rangle$ and $|-\rangle$, that relative phase can affect interference, and that a gate acts by matrix multiplication. You also know that the Bloch sphere uses polar angle for Z probabilities and azimuthal angle for relative phase.

## Notation and vocabulary

The discrete phase gates are

$$
S=\begin{bmatrix}1&0\\0&i\end{bmatrix},
\qquad
T=\begin{bmatrix}1&0\\0&e^{i\pi/4}\end{bmatrix}.
$$

They add $\pi/2$ and $\pi/4$ to the $|1\rangle$ phase. The continuous rotations are

$$
R_x(\theta)=e^{-i\theta X/2},\quad
R_y(\theta)=e^{-i\theta Y/2},\quad
R_z(\theta)=e^{-i\theta Z/2}.
$$

Angles are in radians. A quarter turn is $\pi/2$, a half turn is $\pi$, and a full turn is $2\pi$.

## Visual explanation before equations

The phase-gate comparison shows why S and T need a final H to become visible in Z. The initial H creates equal paths, the phase gate changes their relationship, and the final H recombines them.

![S, T and Z phase sequences with exact final probabilities.](/learn/visuals/phase-gates.svg)

For Y rotations, the important curve is

$$
R_y(\theta)|0\rangle=\cos(\theta/2)|0\rangle+\sin(\theta/2)|1\rangle,
\qquad
P(1)=\sin^2(\theta/2).
$$

![The exact probability curve for Ry(theta) from zero to two pi.](/learn/visuals/rotation-curve.svg)

The same formula can be read geometrically. The state moves along a great circle, reaches the equator at $\pi/2$, reaches $|1\rangle$ at $\pi$, and returns to $-|0\rangle$ at $2\pi$.

![Reference points connecting Ry angles, Bloch motion and output probabilities.](/learn/visuals/rotation-bloch.svg)

![A compact comparison of fixed phase gates and continuous rotation gates.](/learn/visuals/rotation-reference.svg)

## Worked example: H-S-H and H-T-H

Start with $|0\rangle$. After H, the state is $|+\rangle$. S changes the second amplitude by $i$, producing

$$
\frac{|0\rangle+i|1\rangle}{\sqrt2}.
$$

The final H turns the relative phase $\phi=\pi/2$ into

$$
P(0)=\frac{1+\cos(\pi/2)}2=\frac12,
\qquad P(1)=\frac12.
$$

For T, the relative phase is $\pi/4$:

$$
P(0)=\frac{1+\cos(\pi/4)}2=\frac{1+1/\sqrt2}2\approx0.854,
$$

and $P(1)\approx0.146$. Neither phase gate changes the direct Z probabilities before the final H. The analyzer changes what is observable.

## Second example: Ry at four angles

Use $P(1)=\sin^2(\theta/2)$.

- At $\theta=0$, $R_y(0)|0\rangle=|0\rangle$, so $P(1)=0$.
- At $\theta=\pi/2$, the state is $(|0\rangle+|1\rangle)/\sqrt2$, so $P(1)=1/2$.
- At $\theta=\pi$, the state is $|1\rangle$, so $P(1)=1$.
- At $\theta=2\pi$, the state is $-|0\rangle$, so $P(1)=0$ and the isolated global sign is unobservable.

The final case is a useful warning. The statevector changes sign, but the measurement probabilities do not. If the rotated qubit later participates in a controlled operation, however, an apparently global phase may become relative to a branch that did not receive the rotation.

## Rx, Ry and Rz as complementary controls

The three rotation families are easiest to remember by the axis they turn around on the Bloch sphere. $R_x$ rotates around the x-axis, $R_y$ around the y-axis, and $R_z$ around the z-axis. Their matrices are

$$
R_x(\theta)=\begin{bmatrix}\cos(\theta/2)&-i\sin(\theta/2)\\-i\sin(\theta/2)&\cos(\theta/2)\end{bmatrix},
\quad
R_y(\theta)=\begin{bmatrix}\cos(\theta/2)&-\sin(\theta/2)\\\sin(\theta/2)&\cos(\theta/2)\end{bmatrix},
$$

$$
R_z(\theta)=\begin{bmatrix}e^{-i\theta/2}&0\\0&e^{i\theta/2}\end{bmatrix}.
$$

Starting from $|0\rangle$, $R_y$ changes the Z-basis probabilities directly because it moves the Bloch vector away from the north pole. $R_z$ leaves those probabilities unchanged because it spins around the measurement axis; its effect appears after a basis-changing gate such as H. $R_x$ can also change the Z probabilities, but it introduces an imaginary relative phase along the way. This gives a practical selection rule: use $R_y$ when you want a real amplitude sweep, use $R_z$ when you want to encode phase, and use $R_x$ when the x-axis rotation itself is the concept being tested.

For a quick check, apply $R_y(\pi/2)$ to $|0\rangle$ and measure in Z: the result is balanced. Apply $R_z(\pi/2)$ to $|0\rangle$ instead: the state receives only a global factor, so the Z result remains 0 with certainty. Apply H before and after that same $R_z$ and the phase is converted into a different population pattern. The gates have not “created probability”; they changed the coordinate basis in which the existing phase can interfere.

## Global phase and controlled gates

$R_z(\pi/2)$ has diagonal entries $e^{-i\pi/4}$ and $e^{i\pi/4}$. Factoring out $e^{-i\pi/4}$ leaves the S matrix, so the two isolated gates differ by global phase. If a control qubit is in a superposition, control 0 may apply I while control 1 applies the selected operation. A phase on only one branch is no longer global for the joint state. This is why controlled constructions must use the full matrix convention rather than a casual “same up to phase” shortcut.

## Interactive prediction

Move a Y-rotation angle and predict whether the state is near $|0\rangle$, balanced, or near $|1\rangle$. Then compare the exact probability. The widget is deliberately local and uses the displayed half-angle formula instead of invoking the Lab simulator.

```interactive
{"widget":"rotation-explorer","preset":"ry-sweep"}
```

## Common mistakes

- Entering degrees into a helper that expects radians.
- Forgetting the half angle in $R_y(\theta)|0\rangle$.
- Assuming S or T changes a direct Z histogram of $|+\rangle$.
- Treating $R_y(2\pi)=-I$ as a bit flip.
- Treating S and $R_z(\pi/2)$ as identical matrices rather than globally equivalent isolated gates.
- Calling a change of relative phase a global phase when only one branch changed.

## Summary and glossary

S and T add fixed relative phases. Rx, Ry and Rz add adjustable rotations, with angles expressed in radians and half-angle formulas controlling amplitudes. A final basis change can turn phase into probability. Global phase is invisible for an isolated state, but a controlled operation can make that factor relative between branches.

**Phase gate:** a diagonal operation that changes amplitude angles. **Rotation:** a continuous gate family indexed by an angle. **Radian:** the angle unit used by the matrix formulas. **Great circle:** the shortest full circle traced by a pure state under a suitable Bloch rotation.

## Transfer problem

Predict the final Z probabilities for $|0\rangle\to H\to T\to H\to M$, then repeat for $S$. Next, predict $R_y(\pi/2)|0\rangle$ without using a phase analyzer. Your debugging prompt is: did you calculate the phase change and the rotation angle in the same units, and did you apply the final H only when the circuit actually contains it?

## Assessment

Use the rotation slider at $0$, $\pi/2$, $\pi$ and $2\pi$ before starting the quiz. Inline checks should make the half-angle pattern familiar. The ten-question assessment then tests discrete phases, continuous rotations, global phase and controlled-gate caveats.

## Lab connection

In the Lab, compare H-S-H with H-T-H and run Ry at the four reference angles. Inspect the statevector and histogram together. If a phase gate seems to do nothing, add the basis-changing H and check whether your angle is expressed in radians.

## Chapter quiz

Answer every question in order. This ten-question assessment covers S, T, Rx, Ry, Rz, radians, half-angle probabilities, global phase and controlled-gate phase behavior. Review explanations before retrying.

## Sources

- [Gates and operations](https://quantumai.google/cirq/build/gates). Google Quantum AI.
- [Quantum information: single systems](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information). IBM Quantum Learning / John Watrous.
