"""SDK adapters share little-endian basis ordering: |q(n-1)...q0>."""
import numpy as np
import cirq
import pennylane as qml
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from .models import Circuit


def aer(circuit: Circuit, shots: int, seed: int):
    qc = QuantumCircuit(circuit.qubits)
    for op in circuit.operations:
        args = ([op.angle] if op.angle is not None else []) + op.targets
        getattr(qc, op.gate)(*args)
    exact = qc.copy()
    exact.save_statevector()
    simulator = AerSimulator(method='statevector', max_parallel_threads=1)
    state = np.asarray(simulator.run(transpile(exact, simulator), seed_simulator=seed).result().data(0)['statevector'])
    qc.measure_all()
    counts = simulator.run(transpile(qc, simulator), shots=shots, seed_simulator=seed).result().get_counts()
    return state, counts


def cirq_engine(circuit: Circuit, shots: int, seed: int):
    qubits = cirq.LineQubit.range(circuit.qubits)
    qc = cirq.Circuit(cirq.I(q) for q in qubits)
    fixed = {'h': cirq.H, 'x': cirq.X, 'y': cirq.Y, 'z': cirq.Z, 's': cirq.S, 't': cirq.T, 'cx': cirq.CNOT, 'cz': cirq.CZ, 'swap': cirq.SWAP}
    for op in circuit.operations:
        if op.gate == 'rzz':
            gate = cirq.ZZPowGate(exponent=op.angle / np.pi, global_shift=-0.5)
        elif op.angle is not None:
            gate = {'rx': cirq.rx, 'ry': cirq.ry, 'rz': cirq.rz}[op.gate](op.angle)
        else:
            gate = fixed[op.gate]
        qc.append(gate(*(qubits[q] for q in op.targets)))
    simulator = cirq.Simulator(seed=seed, dtype=np.complex128)
    order = list(reversed(qubits))
    state = simulator.simulate(qc, qubit_order=order).final_state_vector
    qc.append(cirq.measure(*order, key='bits'))
    counts = {format(int(k), f'0{circuit.qubits}b'): int(v) for k, v in simulator.run(qc, repetitions=shots).histogram(key='bits').items()}
    return state, counts


def _apply_pennylane(circuit: Circuit):
    """Queue one normalized circuit on the active PennyLane QNode."""
    one_qubit = {
        'h': qml.Hadamard,
        'x': qml.PauliX,
        'y': qml.PauliY,
        'z': qml.PauliZ,
        's': qml.S,
        't': qml.T,
    }
    for op in circuit.operations:
        if op.gate in one_qubit:
            one_qubit[op.gate](wires=op.targets[0])
        elif op.gate in ('rx', 'ry', 'rz'):
            getattr(qml, op.gate.upper())(op.angle, wires=op.targets[0])
        elif op.gate == 'cx':
            qml.CNOT(wires=op.targets)
        elif op.gate == 'cz':
            qml.CZ(wires=op.targets)
        elif op.gate == 'swap':
            qml.SWAP(wires=op.targets)
        elif op.gate == 'rzz':
            qml.IsingZZ(op.angle, wires=op.targets)


def _reverse_bits(index: int, width: int):
    return int(format(index, f'0{width}b')[::-1], 2)


def pennylane_engine(circuit: Circuit, shots: int, seed: int):
    """Run the shared circuit with PennyLane's local default.qubit device."""
    exact_device = qml.device('default.qubit', wires=circuit.qubits)

    @qml.qnode(exact_device)
    def exact_circuit():
        _apply_pennylane(circuit)
        return qml.state()

    raw_state = np.asarray(exact_circuit(), dtype=np.complex128)
    width = circuit.qubits
    state = np.asarray(
        [raw_state[_reverse_bits(index, width)] for index in range(len(raw_state))],
        dtype=np.complex128,
    )
    sampled_device = qml.device('default.qubit', wires=circuit.qubits, seed=seed)

    @qml.set_shots(shots=shots)
    @qml.qnode(sampled_device)
    def sampled_circuit():
        _apply_pennylane(circuit)
        return qml.counts(all_outcomes=True)

    raw_counts = sampled_circuit()
    counts = {
        format(_reverse_bits(int(key, 2), width), f'0{width}b'): int(value)
        for key, value in raw_counts.items()
        if value
    }
    return state, counts


ENGINES = {'aer': aer, 'cirq': cirq_engine, 'pennylane': pennylane_engine}


def normalize(state, counts, circuit, engine, shots):
    bloch = []
    for q in range(circuit.qubits):
        pairs = [(i, i | (1 << q)) for i in range(len(state)) if not i & (1 << q)]
        coherence = sum(np.conj(state[a]) * state[b] for a, b in pairs)
        z = sum(abs(state[a]) ** 2 - abs(state[b]) ** 2 for a, b in pairs)
        bloch.append({'qubit': q, 'x': float(2 * coherence.real), 'y': float(2 * coherence.imag), 'z': float(z)})
    return {'engine': engine, 'shots': shots, 'circuit': circuit.model_dump(exclude_none=True), 'counts': counts,
            'statevector': [{'basis': format(i, f'0{circuit.qubits}b'), 'real': float(v.real), 'imag': float(v.imag), 'probability': float(abs(v) ** 2)} for i, v in enumerate(state)], 'bloch': bloch}
