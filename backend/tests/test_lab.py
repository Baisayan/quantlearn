import json
import unittest
from unittest.mock import patch
import uuid
import httpx
from pathlib import Path
import numpy as np
from fastapi.testclient import TestClient
from backend.app.adapters import ENGINES, normalize
from backend.app.models import Circuit, RunRequest
from backend.app.code import parse_code
from backend.app.main import app, authenticate, grade_result, execute, CHALLENGES, FIXTURES


class LabTests(unittest.TestCase):
    def test_both_sdks_match_every_teaching_fixture(self):
        fixtures = json.loads(Path('content/examples/circuits.json').read_text())['circuits']
        for fixture in fixtures:
            with self.subTest(fixture=fixture['id']):
                circuit = Circuit(qubits=fixture['qubits'], operations=fixture['operations'])
                states = []
                for engine in ENGINES:
                    state, counts = ENGINES[engine](circuit, 128, 42)
                    self.assertEqual(sum(counts.values()), 128)
                    np.testing.assert_allclose(abs(state) ** 2, fixture['probabilities'], atol=1e-10)
                    states.append(state)
                self.assertAlmostEqual(abs(np.vdot(*states)), 1, places=10)

    def test_bell_reduced_states_are_mixed(self):
        circuit = Circuit(qubits=2, operations=[{'gate':'h','targets':[0]}, {'gate':'cx','targets':[0,1]}])
        for engine in ENGINES:
            state, counts = ENGINES[engine](circuit,128,42)
            result = normalize(state,counts,circuit,engine,128)
            for point in result['bloch']:
                np.testing.assert_allclose([point['x'],point['y'],point['z']],0,atol=1e-10)

    def test_code_parsers_and_invalid_programs(self):
        aer = 'from qiskit import QuantumCircuit\nfrom math import pi\ncircuit = QuantumCircuit(2)\ncircuit.ry(pi/2, 0)\ncircuit.cx(0, 1)'
        cirq = 'import cirq\nfrom math import pi\nqubits = cirq.LineQubit.range(2)\ncircuit = cirq.Circuit()\ncircuit.append(cirq.ry(pi/2)(qubits[0]))\ncircuit.append(cirq.CNOT(qubits[0], qubits[1]))'
        self.assertEqual(parse_code(aer,'aer'),parse_code(cirq,'cirq'))
        for source in ['qubits = cirq.LineQubit.range(2)\ncircuit.append(cirq.H(qubits[0]))', 'qubits = cirq.LineQubit.range(1)\ncircuit = cirq.Circuit()\ncircuit.append(H(qubits[0]))']:
            with self.subTest(source=source), self.assertRaises(ValueError): parse_code(source,'cirq')
        for source in ['import os', 'open("x")', 'while True: pass', 'circuit = QuantumCircuit(100)', 'circuit = QuantumCircuit(2)\ncircuit.cx(0,0)', 'circuit = QuantumCircuit(2)\ncircuit.rx(1/0,0)']:
            with self.subTest(source=source), self.assertRaises(ValueError): parse_code(source,'aer')

    def test_grading_phase_and_constraints(self):
        circuit = Circuit(qubits=2,operations=[{'gate':'h','targets':[0]},{'gate':'cx','targets':[0,1]}])
        request = RunRequest(circuit=circuit,challengeId='bell')
        state,counts = ENGINES['aer'](circuit,128,42)
        result = normalize(state,counts,circuit,'aer',128)
        self.assertTrue(grade_result(request,circuit,state,result)['passed'])
        wrong = state.copy(); wrong[3] *= -1
        self.assertFalse(grade_result(request,circuit,wrong,result)['passed'])
        self.assertTrue(grade_result(request,circuit,state * 1j,result)['passed'])

    def test_all_challenge_solutions_on_both_engines(self):
        for challenge in CHALLENGES:
            fixture = FIXTURES[challenge['fixture']]
            circuit = Circuit(qubits=fixture['qubits'], operations=fixture['operations'])
            for engine in ENGINES:
                with self.subTest(challenge=challenge['id'], engine=engine):
                    request = RunRequest(engine=engine, circuit=circuit, challengeId=challenge['id'], shots=32)
                    parsed, state, result = execute(request)
                    self.assertTrue(grade_result(request,parsed,state,result)['passed'])
                    empty = Circuit(qubits=challenge['qubits'])
                    request = RunRequest(engine=engine,circuit=empty,challengeId=challenge['id'],shots=32)
                    parsed, state, result = execute(request)
                    self.assertFalse(grade_result(request,parsed,state,result)['passed'])

    def test_grade_storage_and_retry(self):
        client = TestClient(app)
        user_id = str(uuid.uuid4())
        app.dependency_overrides[authenticate] = lambda: user_id
        payload = {'engine':'aer','circuit':{'qubits':1,'operations':[{'gate':'h','targets':[0]}]},'challengeId':'superposition','attemptId':str(uuid.uuid4())}
        try:
            with patch.dict('os.environ',{'SUPABASE_SECRET_KEY':'sb_secret_test'}), patch('backend.app.main.httpx.post') as post, patch('backend.app.main.httpx.get') as get:
                post.return_value = httpx.Response(201)
                response = client.post('/v1/grade',json=payload)
                self.assertEqual(response.status_code,200)
                self.assertTrue(response.json()['assessment']['passed'])
                row = post.call_args.kwargs['json']
                self.assertEqual(row['user_id'],user_id)
                self.assertEqual(row['score'],100)
                post.return_value = httpx.Response(409)
                get.return_value = httpx.Response(200,json=[row],request=httpx.Request('GET','https://example.com'))
                self.assertEqual(client.post('/v1/grade',json=payload).status_code,200)
                get.return_value = httpx.Response(200,json=[],request=httpx.Request('GET','https://example.com'))
                self.assertEqual(client.post('/v1/grade',json=payload).status_code,409)
                post.side_effect = httpx.ConnectError('offline')
                self.assertEqual(client.post('/v1/grade',json=payload).status_code,503)
        finally:
            app.dependency_overrides.clear()

    def test_http_validation_and_auth(self):
        client = TestClient(app)
        self.assertIn(client.post('/v1/simulate',json={}).status_code,(401,403))
        self.assertEqual(client.post('/v1/simulate',content='x' * 20001).status_code,413)
        app.dependency_overrides[authenticate] = lambda: 'test-user'
        try:
            response = client.post('/v1/simulate',json={'engine':'cirq','circuit':{'qubits':2,'operations':[{'gate':'x','targets':[0]}]}})
            self.assertEqual(response.status_code,200)
            self.assertEqual(response.json()['counts'],{'01':1024})
            self.assertEqual(client.post('/v1/simulate',json={'engine':'fake','circuit':{'qubits':1}}).status_code,422)
            self.assertEqual(client.post('/v1/simulate',json={'engine':'aer','code':'import os'}).status_code,422)
        finally: app.dependency_overrides.clear()


if __name__ == '__main__': unittest.main()
