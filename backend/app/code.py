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


def parse_pennylane_code(source):
    """Parse the small PennyLane QNode form shown in the Lab editor."""
    try:
        tree = ast.parse(source)
    except SyntaxError as exc:
        raise ValueError(f'Line {exc.lineno}: {exc.msg}') from exc
    if len(list(ast.walk(tree))) > 1200:
        raise ValueError('Code is too large.')

    def dotted(node):
        return ast.unparse(node)

    def wires(node, arity):
        if isinstance(node, ast.Constant) and type(node.value) is int:
            values = [node.value]
        elif isinstance(node, (ast.List, ast.Tuple)):
            values = [number(item) for item in node.elts]
        else:
            raise ValueError('Use integer wire labels.')
        if len(values) != arity or any(type(value) is not int for value in values):
            raise ValueError('Use the correct number of distinct wires.')
        return values

    gate_names = {
        'Hadamard': ('h', 1),
        'PauliX': ('x', 1),
        'PauliY': ('y', 1),
        'PauliZ': ('z', 1),
        'S': ('s', 1),
        'T': ('t', 1),
        'CNOT': ('cx', 2),
        'CZ': ('cz', 2),
        'SWAP': ('swap', 2),
        'RX': ('rx', 1),
        'RY': ('ry', 1),
        'RZ': ('rz', 1),
        'IsingZZ': ('rzz', 2),
    }
    initialized = False
    seen_pennylane = False
    parsed = None
    for statement in tree.body:
        try:
            if isinstance(statement, ast.Import):
                if len(statement.names) != 1 or statement.names[0].name != 'pennylane' or statement.names[0].asname != 'qml':
                    raise ValueError('Import PennyLane as qml.')
                seen_pennylane = True
                continue
            if isinstance(statement, ast.ImportFrom):
                if statement.module != 'math' or len(statement.names) != 1 or statement.names[0].name != 'pi' or statement.names[0].asname:
                    raise ValueError('Only from math import pi is supported.')
                continue
            if isinstance(statement, ast.Assign):
                if len(statement.targets) != 1 or dotted(statement.targets[0]) != 'dev':
                    raise ValueError('Initialize dev with qml.device("default.qubit", wires=n).')
                if initialized:
                    raise ValueError('Initialize dev only once.')
                call = statement.value
                if not isinstance(call, ast.Call) or dotted(call.func) != 'qml.device' or len(call.args) != 1:
                    raise ValueError('Initialize dev with qml.device("default.qubit", wires=n).')
                if not isinstance(call.args[0], ast.Constant) or call.args[0].value != 'default.qubit':
                    raise ValueError('Use PennyLane default.qubit for this Lab.')
                if len(call.keywords) != 1 or call.keywords[0].arg != 'wires':
                    raise ValueError('Set the number of wires once.')
                qubits = number(call.keywords[0].value)
                Circuit(qubits=qubits)
                initialized = True
                continue
            if isinstance(statement, ast.FunctionDef):
                if (
                    not initialized
                    or parsed is not None
                    or statement.name != 'circuit'
                    or statement.args.posonlyargs
                    or statement.args.args
                    or statement.args.kwonlyargs
                    or statement.args.vararg
                    or statement.args.kwarg
                    or statement.args.defaults
                    or statement.args.kw_defaults
                ):
                    raise ValueError('Define one zero-argument circuit QNode after initializing dev.')
                if len(statement.decorator_list) != 1 or dotted(statement.decorator_list[0]) != 'qml.qnode(dev)':
                    raise ValueError('Decorate circuit with @qml.qnode(dev).')
                operations = []
                for index, line in enumerate(statement.body):
                    if isinstance(line, ast.Return):
                        if index != len(statement.body) - 1:
                            raise ValueError('Return qml.state() only as the final circuit statement.')
                        if not isinstance(line.value, ast.Call) or dotted(line.value.func) != 'qml.state' or line.value.args or line.value.keywords:
                            raise ValueError('Return qml.state() from the circuit.')
                        continue
                    if not isinstance(line, ast.Expr) or not isinstance(line.value, ast.Call):
                        raise ValueError('Use PennyLane gate calls inside circuit().')
                    call = line.value
                    qualified = dotted(call.func)
                    if not qualified.startswith('qml.') or qualified.removeprefix('qml.') not in gate_names:
                        raise ValueError('Use a supported PennyLane gate.')
                    name = qualified.removeprefix('qml.')
                    gate, arity = gate_names[name]
                    expected_args = 1 if gate in ('rx', 'ry', 'rz', 'rzz') else 0
                    if len(call.args) != expected_args or len(call.keywords) != 1 or call.keywords[0].arg != 'wires':
                        raise ValueError('Use the documented gate signature with wires=... .')
                    operation = {'gate': gate, 'targets': wires(call.keywords[0].value, arity)}
                    if expected_args:
                        operation['angle'] = number(call.args[0])
                    operations.append(operation)
                if not statement.body or not isinstance(statement.body[-1], ast.Return):
                    raise ValueError('Return qml.state() as the final circuit statement.')
                parsed = Circuit(qubits=qubits, operations=operations)
                continue
            raise ValueError('Only PennyLane imports, device setup and one circuit QNode are supported.')
        except (ValueError, TypeError, ZeroDivisionError, IndexError, OverflowError) as exc:
            raise ValueError(f'Line {statement.lineno}: {exc}') from exc
    if not seen_pennylane or not initialized or parsed is None:
        raise ValueError('Initialize dev and define a circuit QNode before running it.')
    return parsed


def parse_code(source, engine):
    if engine == 'pennylane':
        return parse_pennylane_code(source)
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
