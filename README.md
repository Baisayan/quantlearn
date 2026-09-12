# QuantLearn

QuantLearn is am AI-powered hands-on quantum learning platform. The goal is to
help people move from quantum theory to clear visuals, circuits, simulations
and practical exercises.

For the full requirements and delivery table, read the [problem statement](SIH26140.md).

## What is working now

- A responsive Next.js app with Home, Learn, Lab, Progress and Login areas.
- Supabase email/password authentication with protected application routes.
- A Learn MVP with five modules, fourteen chapters, read-only figures and 140
  multiple-choice questions.
- Saved chapter completion, quiz attempts, scores and progress summaries.
- Qiskit Aer and Cirq as the deliberately narrow simulator scope for this MVP.

The Lab route is currently a small placeholder. Live circuit editing, code
execution and simulator results are the next major build step. AI tutoring is
planned after Learn and Lab are stable. PennyLane and qBraid are deferred for
now.

## Planned features

The next pieces are a drag-and-drop circuit builder, a quantum code editor,
multi-qubit circuits, Aer/Cirq execution through a FastAPI backend, result
visualizations, coding challenges and richer progress analytics. AI
explanations, personalized learning and instructor features can follow once
the core learning and lab flows work well.

## Run it locally

You will need Node.js 20 or newer and a Supabase project.

```sh
git clone https://github.com/Baisayan/quantlearn.git
cd quantlearn/frontend
npm install
cp .env.example .env.local
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env.local` instead of the
`cp` command. Add your Supabase project URL and publishable key to
`.env.local`, then open <http://localhost:3000>.

For the first setup, run `supabase/schema.sql` in the Supabase SQL editor,
then run `npm run content:build` from `frontend/` and apply the generated
`frontend/.generated/learn-seed.sql` in a trusted SQL session. Email
confirmation is disabled for this demo, so registration can go straight to
Learn. Keep `.env.local` private. The `.generated/` folder is ignored, while
the generated public figures are tracked because the app serves them directly.

Useful commands from `frontend/`:

```sh
npm run content:build
npm run lint
npm run build
```

Content generation also runs automatically before `dev` and `build`. It reads
the authored lessons and quizzes from `content/`, validates them, and writes
the served figures to `frontend/public/learn/visuals/` plus ignored build
artifacts under `frontend/.generated/`.

## Project map

- `frontend/`: Next.js App Router UI, auth, Learn pag and Supabase APIs.
- `content/`: source Markdown lessons, quiz JSON, references and build scripts.
- `frontend/public/learn/visuals/`: the single served copy of the static Learn figures.
- `supabase/schema.sql`: learner progress, quiz attempts and trusted grading setup.
- `backend/`: reserved for the future FastAPI simulator service.
- `SIH26140.md`: problem statement and delivery table.
