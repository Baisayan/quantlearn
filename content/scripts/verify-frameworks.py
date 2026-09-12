# /// script
# requires-python = ">=3.12"
# dependencies = ["qiskit==2.5.2", "qiskit-aer==0.17.2", "cirq-core==1.7.0"]
# ///
"""Optional real-SDK verification of authored fixtures and read-only snippets.

Run: uv run --script content/scripts/verify-frameworks.py
This checks educational examples; it does not implement a Lab execution service.
"""
import contextlib
import io
import json
import math
import re
from importlib.metadata import version
from pathlib import Path

import cirq
import numpy as np
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

root = Path(__file__).resolve().parents[1]
fixtures = json.loads((root / "examples/circuits.json").read_text())["circuits"]
backend = AerSimulator(method="statevector")
for fixture in fixtures:
    n = fixture["qubits"]
    qc = QuantumCircuit(n)
    qs = cirq.LineQubit.range(n)
    cc = cirq.Circuit()
    for op in fixture["operations"]:
        gate, targets = op["gate"], op["targets"]
        angle = op.get("angle")
        getattr(qc, gate)(*(([angle] if angle is not None else []) + targets))
        if gate == "cx":
            cc.append(cirq.CNOT(qs[targets[0]], qs[targets[1]]))
        elif gate == "cz":
            cc.append(cirq.CZ(qs[targets[0]], qs[targets[1]]))
        elif gate == "rzz":
            cc.append(cirq.ZZPowGate(exponent=angle / math.pi, global_shift=-0.5).on(*[qs[q] for q in targets]))
        elif angle is not None:
            cc.append(getattr(cirq, gate)(angle).on(qs[targets[0]]))
        else:
            cc.append(getattr(cirq, gate.upper()).on(qs[targets[0]]))
    qc.save_statevector()
    aer = np.asarray(backend.run(transpile(qc, backend)).result().get_statevector())
    google = cirq.Simulator(dtype=np.complex128).simulate(cc, qubit_order=list(reversed(qs))).final_state_vector
    np.testing.assert_allclose(np.abs(aer) ** 2, fixture["probabilities"], atol=1e-9)
    np.testing.assert_allclose(np.abs(google) ** 2, fixture["probabilities"], atol=1e-9)
    np.testing.assert_allclose(abs(np.vdot(aer, google)), 1, atol=1e-9)

# Run exactly the two trusted, repository-authored snippets shown to learners.
chapter = (root / "lessons/aer-and-cirq.md").read_text(encoding="utf-8")
fence = chr(96) * 3
snippets = re.findall(fence + r"python\n(.*?)" + fence, chapter, flags=re.S)
assert len(snippets) == 2
for snippet in snippets:
    namespace = {}
    with contextlib.redirect_stdout(io.StringIO()):
        exec(compile(snippet, "aer-and-cirq.md", "exec"), namespace)
    counts = namespace["counts"]
    assert set(counts) == {"00", "11"}
    assert sum(counts.values()) == 1024
    assert abs(counts["00"] / 1024 - 0.5) < 0.1

print(f"Verified {len(fixtures)} fixtures on Aer and Cirq, including state equivalence up to global phase.")
print("Both exact chapter code snippets executed successfully (1024 Bell shots each).")
print("Versions:", ", ".join(f"{name}={version(name)}" for name in ("qiskit", "qiskit-aer", "cirq-core")))
