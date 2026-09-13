from typing import Literal
from math import isfinite
from pydantic import BaseModel, ConfigDict, Field, StrictInt, model_validator

GATE_ARITY = {**dict.fromkeys(['h', 'x', 'y', 'z', 's', 't', 'rx', 'ry', 'rz'], 1), **dict.fromkeys(['cx', 'cz', 'swap', 'rzz'], 2)}


class Operation(BaseModel):
    model_config = ConfigDict(extra='forbid')
    gate: Literal['h', 'x', 'y', 'z', 's', 't', 'rx', 'ry', 'rz', 'cx', 'cz', 'swap', 'rzz']
    targets: list[StrictInt] = Field(min_length=1, max_length=2)
    angle: float | None = None

    @model_validator(mode='after')
    def check_gate(self):
        if len(self.targets) != GATE_ARITY[self.gate] or len(set(self.targets)) != len(self.targets):
            raise ValueError('Use distinct qubits and the correct number of targets.')
        if self.gate in ('rx', 'ry', 'rz', 'rzz'):
            if self.angle is None or not isfinite(self.angle) or abs(self.angle) > 100:
                raise ValueError('Rotation angles must be finite radians between -100 and 100.')
        elif self.angle is not None:
            raise ValueError('This gate does not take an angle.')
        return self


class Circuit(BaseModel):
    model_config = ConfigDict(extra='forbid')
    qubits: int = Field(ge=1, le=3, strict=True)
    operations: list[Operation] = Field(default_factory=list, max_length=48)

    @model_validator(mode='after')
    def check_targets(self):
        if any(q < 0 or q >= self.qubits for op in self.operations for q in op.targets):
            raise ValueError('A gate references a qubit outside this circuit.')
        return self


class RunRequest(BaseModel):
    model_config = ConfigDict(extra='forbid')
    engine: Literal['aer', 'cirq'] = 'aer'
    circuit: Circuit | None = None
    code: str | None = Field(default=None, max_length=12000)
    shots: int = Field(default=1024, ge=32, le=4096, strict=True)
    seed: int = Field(default=42, ge=0, le=2147483647, strict=True)
    challengeId: str | None = Field(default=None, max_length=80)
    attemptId: str | None = None

    @model_validator(mode='after')
    def check_source(self):
        if (self.circuit is None) == (self.code is None):
            raise ValueError('Supply exactly one circuit or code source.')
        return self
