import json
import os
import uuid
from pathlib import Path
from threading import BoundedSemaphore
import httpx
import numpy as np
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.responses import JSONResponse
from .models import Circuit, RunRequest
from .code import parse_code
from .adapters import ENGINES, normalize

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / 'backend' / '.env')
load_dotenv(ROOT / 'frontend' / '.env.local')
CHALLENGES = json.loads((ROOT / 'content/lab/challenges.json').read_text())
FIXTURES = {c['id']: c for c in json.loads((ROOT / 'content/examples/circuits.json').read_text())['circuits']}
app = FastAPI(title='QuantLearn Lab', version='1.0.0')
slots = BoundedSemaphore(2)


class BodyLimit:
    """Bound request buffering even when the backend is called directly."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope['type'] != 'http' or scope['method'] != 'POST':
            return await self.app(scope, receive, send)
        messages, size = [], 0
        while True:
            message = await receive()
            if message['type'] == 'http.disconnect':
                return
            size += len(message.get('body', b''))
            if size > 20000:
                return await JSONResponse({'detail': 'Submission is too large.'}, status_code=413)(scope, receive, send)
            messages.append(message)
            if not message.get('more_body'):
                break

        async def replay():
            return messages.pop(0) if messages else await receive()

        await self.app(scope, replay, send)


app.add_middleware(BodyLimit)


def authenticate(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    url = os.getenv('SUPABASE_URL') or os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    key = os.getenv('SUPABASE_PUBLISHABLE_KEY') or os.getenv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
    if not url or not key: raise HTTPException(503, 'Backend authentication is not configured.')
    try:
        response = httpx.get(f'{url}/auth/v1/user', headers={'apikey': key, 'Authorization': f'Bearer {credentials.credentials}'}, timeout=10)
        if response.status_code != 200: raise HTTPException(401, 'Please sign in again.')
        return response.json()['id']
    except httpx.HTTPError as exc:
        raise HTTPException(503, 'Authentication is temporarily unavailable.') from exc


@app.get('/health')
def health():
    return {'status': 'ok', 'engines': list(ENGINES)}


def execute(request):
    try:
        circuit = parse_code(request.code, request.engine) if request.code is not None else request.circuit
    except (ValueError, RecursionError) as exc:
        raise HTTPException(422, str(exc)) from exc
    if not slots.acquire(blocking=False): raise HTTPException(429, 'The simulator is busy. Try again shortly.')
    try:
        state, counts = ENGINES[request.engine](circuit, request.shots, request.seed)
        result = normalize(state, counts, circuit, request.engine, request.shots)
        result['energy'] = result['bloch'][0]['z'] + 0.5 * result['bloch'][0]['x'] if circuit.qubits == 1 else None
        result['cutScore'] = sum(v['probability'] for v in result['statevector'] if v['basis'] in ('01', '10')) if circuit.qubits == 2 else None
        return circuit, state, result
    finally:
        slots.release()


@app.post('/v1/simulate')
def simulate(request: RunRequest, user_id: str = Depends(authenticate)):
    return execute(request)[2]


def grade_result(request, circuit, state, result):
    challenge = next((c for c in CHALLENGES if c['id'] == request.challengeId), None)
    if not challenge: raise HTTPException(404, 'Challenge not found.')
    constraints = circuit.qubits == challenge['qubits'] and len(circuit.operations) <= challenge['maxGates'] and all(g in [op.gate for op in circuit.operations] for g in challenge.get('requiredGates', []))
    fidelity = 0.0
    if circuit.qubits == challenge['qubits']:
        if challenge['id'] == 'vqe': fidelity = min(1, max(0, -result['energy'] / np.sqrt(1.25)))
        elif challenge['id'] == 'qaoa': fidelity = result['cutScore']
        else:
            fixture = FIXTURES[challenge['fixture']]
            expected, _ = ENGINES[request.engine](Circuit(qubits=fixture['qubits'], operations=fixture['operations']), 32, 42)
            fidelity = float(abs(np.vdot(expected, state)) ** 2)
    passed = constraints and (result['energy'] < -1.11 if challenge['id'] == 'vqe' else fidelity >= 0.99)
    return {'passed': passed, 'score': round(min(1, fidelity) * 100), 'feedback': 'Target reached. Your challenge is complete.' if passed else 'Keep experimenting. Check the target state, required gates, qubit count and gate limit.', 'challengeId': challenge['id']}


@app.post('/v1/grade')
def grade(request: RunRequest, user_id: str = Depends(authenticate)):
    try: attempt_id = str(uuid.UUID(request.attemptId or ''))
    except ValueError as exc: raise HTTPException(422, 'A valid submission ID is required.') from exc
    circuit, state, result = execute(request)
    assessment = grade_result(request, circuit, state, result)
    url = os.getenv('SUPABASE_URL') or os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    secret = os.getenv('SUPABASE_SECRET_KEY')
    if not secret: raise HTTPException(503, 'Saving Lab assessments requires the backend Supabase secret key.')
    row = {'id': attempt_id, 'user_id': user_id, 'challenge_id': request.challengeId, 'engine': request.engine, 'circuit': circuit.model_dump(exclude_none=True), **{k: assessment[k] for k in ('passed', 'score', 'feedback')}}
    headers = {'apikey': secret, **({'Authorization': f'Bearer {secret}'} if secret.startswith('eyJ') else {})}
    try:
        response = httpx.post(f'{url}/rest/v1/lab_attempts', headers={**headers, 'Prefer': 'return=minimal'}, json=row, timeout=10)
        if response.status_code == 409:
            previous = httpx.get(f'{url}/rest/v1/lab_attempts', headers=headers, params={'id': f'eq.{attempt_id}', 'user_id': f'eq.{user_id}', 'select': '*'}, timeout=10)
            previous.raise_for_status()
            rows = previous.json()
            if not rows or any(rows[0][k] != row[k] for k in ('challenge_id', 'engine', 'circuit')): raise HTTPException(409, 'Submission ID already used.')
        elif not response.is_success: raise HTTPException(503, 'Assessment could not be saved. Please retry.')
    except httpx.HTTPError as exc: raise HTTPException(503, 'Assessment storage is unavailable.') from exc
    return {**result, 'assessment': assessment}
