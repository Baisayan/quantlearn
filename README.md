# QuantLearn

Learn quantum computing, build a circuit, and see what it does. The [problem statement and delivery table](SIH26140.md) describe the full goal.

## What works

- Email/password login with Supabase and protected application pages.
- Five Learn modules, fourteen chapters, 28 figures and 140 quiz questions.
- A Lab with drag-and-drop gate placement, a Python code editor and real Qiskit Aer/Cirq simulation.
- Histograms, complex statevectors, rotatable reduced Bloch views and circuit diagrams.
- Eight guided challenges, server grading and saved Learn/Lab results in Progress.

The demo supports 1-3 qubits, up to 48 gates and 4096 shots. Python input is a documented circuit-building subset, parsed as data without executing arbitrary code. Terminal Z measurements are automatic. Noise, mid-circuit measurement, unrestricted Python, PennyLane/qBraid, instructor tools and AI tutoring are outside this release. AI is the next phase.

## Run yourself

Install Node.js 20.9+ and Python 3.12 (or [uv](https://docs.astral.sh/uv/)). Clone this repository, then:

```sh
cd frontend
npm ci
npm run content:build
```

Create a Supabase project named **quantlearn** in your organization. Wait for provisioning, then open the project's SQL Editor and run these files in order:

1. `supabase/schema.sql` from the repository root, once for a new project.
2. `frontend/.generated/learn-seed.sql` to load the quiz answer keys.
3. `supabase/lab.sql` to add learner-owned Lab attempts.

In Authentication → Sign In / Providers → Email, enable email/password registration and disable **Confirm email** for this demo. Under Authentication → URL Configuration, set the Site URL to `http://localhost:3000`. Passwords are managed by Supabase; don't create a separate users/password table.

Copy `frontend/.env.example` to `frontend/.env.local`. From Project Settings → API Keys, copy the publishable key; copy the project URL from the Connect dialog. Set the two `NEXT_PUBLIC_SUPABASE_*` values. Leave `LAB_API_URL=http://127.0.0.1:8000` for local development.

Copy `backend/.env.example` to `backend/.env`. Set the same project URL and publishable key, plus a **secret key** from Project Settings → API Keys → Secret keys. The secret is only used by the Python server to save scores. Never put it in a `NEXT_PUBLIC_*` variable or commit either environment file.

From the repository root:

```sh
uv venv --python 3.12 backend/.venv
uv pip install --python backend/.venv -r backend/requirements.txt
uv run --python backend/.venv --no-project python -m uvicorn backend.app.main:app --reload
```

In a second terminal:

```sh
cd frontend
npm run dev
```

Open `http://localhost:3000`, create an account and open Lab. A quick first circuit is H on q0 followed by CX from q0 to q1. Run it, compare engines, then submit the Bell challenge. Progress should show the saved result.

## Checks

From `frontend/`: `npm run content:build`, `npm run lint`, `npm run build`.
From the root: `uv run --python backend/.venv --no-project python -m unittest discover -s backend/tests -v`.
The backend checks cover SDK agreement against all teaching fixtures, bit order, Bloch states, code parsing, grading and authenticated endpoint validation.

## Deployment

Deploy `frontend/` as a Next.js app. Build the Python image from the repository root with `docker build -f backend/Dockerfile -t quantlearn-lab .`, and run it with the backend environment variables and port 8000. Set the frontend's server-only `LAB_API_URL` to that service's HTTPS URL. Set Supabase's Site URL to your deployed frontend URL. The browser calls same-origin Next.js routes; those forward the user's token to Python, which validates it with Supabase. Both services need outbound access to Supabase.

## Where things live

- `frontend/`: pages, shared layout, editors and thin API forwarding routes.
- `backend/app/`: validation, constrained code parser, SDK adapters and grading.
- `content/`: authored lessons, quizzes, references, circuit fixtures and Lab challenges.
- `frontend/public/learn/visuals/`: the served Learn figures. Lab visuals render from live results.
- `supabase/`: database setup. Users can read their own Lab attempts, but only the backend writes scores.

`content:build` runs before development and production builds. It validates source content and prepares ignored bundles in `frontend/.generated/`. Reapply the generated Learn seed whenever quiz definitions change.
