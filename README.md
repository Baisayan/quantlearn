# QuantLearn

Learn quantum computing, build a circuit, and see what it does. The [problem statement and delivery table](SIH26140.md) describe the full goal.

## What works

- Email/password login with Supabase and protected application pages.
- Five Learn modules, twenty chapters, 58 figures and 187 quiz questions.
- A Lab with drag-and-drop gate placement, a Python code editor and real Qiskit Aer, Cirq and PennyLane simulation.
- Histograms, complex statevectors, rotatable reduced Bloch views and circuit diagrams.
- Eight guided challenges, server grading and saved Learn/Lab results in Progress.
- A Gemini tutor for lessons, quiz hints and submitted-answer reviews, Lab explanations and debugging suggestions, plus an on-demand study plan in Progress.

The demo supports 1-3 qubits, up to 48 gates and 4096 shots. Python input is a documented circuit-building subset, parsed as data without executing arbitrary code. Terminal Z measurements are automatic. Noise, mid-circuit measurement, unrestricted Python and instructor tools are outside this release. PennyLane uses its built-in ideal `default.qubit` simulator; compare mode checks normalized probabilities across all three engines, while finite-shot counts can differ.

The tutor explains and suggests; it cannot execute code, modify circuits or grade work. Quiz review requires a saved attempt belonging to the learner. Unsubmitted quizzes use a hint-only prompt without answer keys; model instructions cannot guarantee that a determined user will never elicit a solution. Conversations stay in page memory and disappear on navigation/reload. Google receives questions and relevant page context; avoid entering personal information. Free-tier data may be used by Google to improve its products.

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
3. `supabase/lab.sql` to create or update learner-owned Lab attempts. Rerun it after this backend-engine change so the existing table accepts PennyLane submissions.

In Authentication → Sign In / Providers → Email, enable email/password registration and disable **Confirm email** for this demo. Under Authentication → URL Configuration, set the Site URL to `http://localhost:3000`. Passwords are managed by Supabase; don't create a separate users/password table.

Copy `frontend/.env.example` to `frontend/.env.local`. From Project Settings → API Keys, copy the publishable key; copy the project URL from the Connect dialog. Set the two `NEXT_PUBLIC_SUPABASE_*` values. Leave `LAB_API_URL=http://127.0.0.1:8000` for local development.

Create a Gemini API key in [Google AI Studio](https://aistudio.google.com/apikey), then set `GEMINI_API_KEY` in `frontend/.env.local` and in Vercel. Restart the dev server after changing it. The model is fixed in `frontend/lib/ai/provider.ts`; no model environment variable is needed. Missing keys or exhausted quotas show a retryable tutor error and do not block lessons, quizzes or Lab. Requests use at most six recent messages and have a per-instance burst guard; this is not a global daily quota across Vercel instances. Check your project's actual provider limits in AI Studio.

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

From `frontend/`: `npm run content:build`, `npm run lint`, and `npm run build`.
Also try a lesson explanation, a pre-submission quiz hint, Lab help, and a Progress study plan with a configured Gemini key.

## Deploy the demo

Use Vercel for `frontend/`, Render for the Python Lab Web Service, and Supabase for Auth and the database. Connect the GitHub repository in Render, choose **New → Web Service**, and select the repository. Choose Docker, use the free instance, leave the root directory at the repository root, set the Dockerfile path to `backend/Dockerfile`, leave Build Command and Start Command empty, and set the health check path to `/health`.

Keep environment variables separated by runtime:

| Runtime | Variables | Responsibility |
| --- | --- | --- |
| Vercel and local `frontend/.env.local` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser Supabase client and login session handling. These values are public by design. |
| Vercel and local `frontend/.env.local` | `LAB_API_URL` | Server-only URL used by the Next.js Lab proxy to reach FastAPI. Do not prefix it with `NEXT_PUBLIC_`. |
| Vercel and local `frontend/.env.local` | `GEMINI_API_KEY` | Server-only tutor API key. Never prefix it with `NEXT_PUBLIC_`. |
| Render and local `backend/.env` | `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` | FastAPI's token validation against Supabase Auth. |
| Render and local `backend/.env` | `SUPABASE_SECRET_KEY` | Backend-only permission to save trusted Lab assessments. |

In Render, set the three backend variables under the service's Environment page. Use the same project URL and publishable key as the frontend, and paste the Supabase secret key only into `SUPABASE_SECRET_KEY`. Never put that secret in Vercel, a `NEXT_PUBLIC_*` variable, Docker build arguments, or Git.

For Vercel, import the same repository, set the project root directory to `frontend`, and keep the Next.js framework preset. Add the two public Supabase variables, `LAB_API_URL` and `GEMINI_API_KEY` under Project Settings → Environment Variables, using the Render service's HTTPS URL for `LAB_API_URL`, then redeploy.

After the Render service deploys, open its `/health` URL. It should return `{"status":"ok","engines":["aer","cirq","pennylane"]}`. Then redeploy Vercel and set Supabase Authentication → URL Configuration → Site URL to the Vercel URL. Keep `http://localhost:3000` as an additional redirect URL for local testing. Render's free service sleeps after inactivity, so its first request may take about a minute; the Next.js Lab proxy allows up to 90 seconds for that wake-up.

For a local container smoke test, build from the repository root with `docker build -f backend/Dockerfile -t quantlearn-lab .` and run it with the backend variables and `-p 8000:8000`. The Docker command uses Render's injected `PORT` when deployed and falls back to `8000` locally.

## Where things live

- `frontend/`: pages, shared layout, editors and thin API forwarding routes.
- `backend/app/`: validation, constrained code parser, SDK adapters and grading.
- `content/`: authored lessons, quizzes, references, circuit fixtures and Lab challenges.
- `frontend/public/learn/visuals/`: the served Learn figures. Lab visuals render from live results.
- `supabase/`: database setup. Users can read their own Lab attempts, but only the backend writes scores.

`content:build` runs before development and production builds. It validates source content and prepares ignored bundles in `frontend/.generated/`. Reapply the generated Learn seed whenever quiz definitions change.
