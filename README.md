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

## Deploy the demo

Use Vercel for `frontend/`, Render for the Python Lab service, and Supabase for Auth and the database. The repository includes a small `render.yaml` Blueprint for the Render service. Connect the GitHub repository in Render, choose **New → Blueprint**, and select the repository. Render will detect the Blueprint, build `backend/Dockerfile` from the repository root, and use `/health` as its health check. If creating a Web Service manually, choose Docker, keep the repository root as the context, set the Dockerfile path to `backend/Dockerfile`, and set the health check path to `/health`.

Keep environment variables separated by runtime:

| Runtime | Variables | Responsibility |
| --- | --- | --- |
| Vercel and local `frontend/.env.local` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser Supabase client and login session handling. These values are public by design. |
| Vercel and local `frontend/.env.local` | `LAB_API_URL` | Server-only URL used by the Next.js Lab proxy to reach FastAPI. Do not prefix it with `NEXT_PUBLIC_`. |
| Render and local `backend/.env` | `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` | FastAPI's token validation against Supabase Auth. |
| Render and local `backend/.env` | `SUPABASE_SECRET_KEY` | Backend-only permission to save trusted Lab assessments. |

In Render, set the three backend variables under the service's Environment page. Use the same project URL and publishable key as the frontend, and paste the Supabase secret key only into `SUPABASE_SECRET_KEY`. Never put that secret in Vercel, a `NEXT_PUBLIC_*` variable, `render.yaml`, Docker build arguments, or Git.

For Vercel, import the same repository, set the project root directory to `frontend`, and keep the Next.js framework preset. Add the two public Supabase variables and `LAB_API_URL` under Project Settings → Environment Variables, using the Render service's HTTPS URL for `LAB_API_URL`, then redeploy.

After the Render service deploys, open its `/health` URL. It should return `{"status":"ok","engines":["aer","cirq"]}`. Then redeploy Vercel and set Supabase Authentication → URL Configuration → Site URL to the Vercel URL. Keep `http://localhost:3000` as an additional redirect URL for local testing. Render's free service sleeps after inactivity, so its first request may take about a minute; the Next.js Lab proxy allows up to 90 seconds for that wake-up.

For a local container smoke test, build from the repository root with `docker build -f backend/Dockerfile -t quantlearn-lab .` and run it with the backend variables and `-p 8000:8000`. The Docker command uses Render's injected `PORT` when deployed and falls back to `8000` locally.

## Where things live

- `frontend/`: pages, shared layout, editors and thin API forwarding routes.
- `backend/app/`: validation, constrained code parser, SDK adapters and grading.
- `content/`: authored lessons, quizzes, references, circuit fixtures and Lab challenges.
- `frontend/public/learn/visuals/`: the served Learn figures. Lab visuals render from live results.
- `supabase/`: database setup. Users can read their own Lab attempts, but only the backend writes scores.

`content:build` runs before development and production builds. It validates source content and prepares ignored bundles in `frontend/.generated/`. Reapply the generated Learn seed whenever quiz definitions change.
