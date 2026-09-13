"""Parse the documented circuit subset as data. Never execute submitted Python."""
import ast
import math
from .models import Circuit, GATE_ARITY


def number(node):
    if isinstance(node, ast.Constant) and type(node.value) in (int, float):
        return node.value
    if isinstance(node, ast.Name) and node.id == 'pi':
        return math.pi
    if isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.USub, ast.UAdd)):
        return (-1 if isinstance(node.op, ast.USub) else 1) * number(node.operand)
    if isinstance(node, ast.BinOp) and isinstance(node.op, (ast.Mult, ast.Div, ast.Add, ast.Sub)):
        a, b = number(node.left), number(node.right)
        if isinstance(node.op, ast.Mult): return a * b
        if isinstance(node.op, ast.Div): return a / b
        if isinstance(node.op, ast.Add): return a + b
        return a - b
    raise ValueError('Use numeric literals or pi with +, -, *, /.')


def parse_code(source, engine):
    try:
        tree = ast.parse(source)
    except SyntaxError as exc:
        raise ValueError(f'Line {exc.lineno}: {exc.msg}') from exc
    if len(list(ast.walk(tree))) > 1200:
        raise ValueError('Code is too large.')
    operations, qubits = [], None
    initialized = False
    names = {'H': 'h', 'X': 'x', 'Y': 'y', 'Z': 'z', 'S': 's', 'T': 't', 'CNOT': 'cx', 'CZ': 'cz', 'SWAP': 'swap'}
    for statement in tree.body:
        try:
            text = ast.unparse(statement)
            if text == 'from math import pi': continue
            if text == ('from qiskit import QuantumCircuit' if engine == 'aer' else 'import cirq'): continue
            if isinstance(statement, ast.Assign):
                if engine == 'aer' and len(statement.targets) == 1 and ast.unparse(statement.targets[0]) == 'circuit':
                    call = statement.value
                    if qubits is not None or not isinstance(call, ast.Call) or ast.unparse(call.func) != 'QuantumCircuit' or len(call.args) != 1 or call.keywords:
                        raise ValueError('Initialize circuit once with QuantumCircuit(number_of_qubits).')
                    qubits = number(call.args[0])
                    Circuit(qubits=qubits)
                    initialized = True
                    continue
                if engine == 'cirq' and len(statement.targets) == 1 and ast.unparse(statement.targets[0]) == 'qubits':
                    call = statement.value
                    if qubits is not None or not isinstance(call, ast.Call) or ast.unparse(call.func) != 'cirq.LineQubit.range' or len(call.args) != 1 or call.keywords:
                        raise ValueError('Initialize qubits once with cirq.LineQubit.range(n).')
                    qubits = number(call.args[0])
                    Circuit(qubits=qubits)
                    continue
                if engine == 'cirq' and text == 'circuit = cirq.Circuit()' and qubits is not None and not initialized:
                    initialized = True
                    continue
                raise ValueError('Only the documented circuit initialization is supported.')
            if not isinstance(statement, ast.Expr) or not isinstance(statement.value, ast.Call) or not initialized:
                raise ValueError('Use circuit gate calls after initializing the qubits.')
            call = statement.value
            if call.keywords: raise ValueError('Keyword arguments are not supported.')
            if engine == 'aer':
                if not isinstance(call.func, ast.Attribute) or ast.unparse(call.func.value) != 'circuit':
                    raise ValueError('Use circuit.gate(...) statements.')
                gate, args = call.func.attr, call.args
                angle = number(args[0]) if gate in ('rx', 'ry', 'rz', 'rzz') and args else None
                targets = [number(a) for a in (args[1:] if angle is not None else args)]
            else:
                if ast.unparse(call.func) != 'circuit.append' or len(call.args) != 1:
                    raise ValueError('Use circuit.append(cirq.GATE(qubits[index])).')
                inner = call.args[0]
                if not isinstance(inner, ast.Call) or inner.keywords: raise ValueError('Invalid gate call.')
                if isinstance(inner.func, ast.Call):
                    rotation = inner.func
                    qualified = ast.unparse(rotation.func)
                    if not qualified.startswith('cirq.'):
                        raise ValueError('Use the cirq namespace for gate calls.')
                    gate = qualified.removeprefix('cirq.')
                    if gate not in ('rx', 'ry', 'rz') or len(rotation.args) != 1 or rotation.keywords:
                        raise ValueError('Use cirq.rx(angle), cirq.ry(angle), or cirq.rz(angle).')
                    angle = number(rotation.args[0])
                else:
                    qualified = ast.unparse(inner.func)
                    gate = names.get(qualified.removeprefix('cirq.'), '') if qualified.startswith('cirq.') else ''
                    angle = None
                targets = []
                for arg in inner.args:
                    if not isinstance(arg, ast.Subscript) or ast.unparse(arg.value) != 'qubits':
                        raise ValueError('Address a wire with qubits[index].')
                    targets.append(number(arg.slice))
            if gate not in GATE_ARITY or any(type(q) is not int for q in targets):
                raise ValueError('Unsupported gate or non-integer qubit index.')
            operations.append({'gate': gate, 'targets': targets, **({'angle': angle} if angle is not None else {})})
        except (ValueError, TypeError, ZeroDivisionError, IndexError, OverflowError) as exc:
            raise ValueError(f'Line {statement.lineno}: {exc}') from exc
    if not initialized:
        raise ValueError('Initialize a circuit before running it.')
    return Circuit(qubits=qubits, operations=operations)
