# Instructions for building QuantLearn

QuantLearn is an interactive web-based platform that enables users to learn, design, simulate, and visualize quantum algorithms. It offers structured learning modules covering quantum computing fundamentals, circuit design, and standard quantum algorithms. Users will be able to construct quantum circuits through a drag-and-drop interface or by writing code, execute them on multiple quantum simulators, and visualize quantum states and measurement outcomes.

Source: [the supplied problem statement](SIH26140.md). This describes the full platform. The current MVP implements deliberately narrow examples and supports **Qiskit Aer and Cirq only**; PennyLane and qBraid integrations are deferred. A contextual Gemini tutor supports Learn, Lab and Progress. Keep the original problem statement unchanged as the requirements reference.

## Screens and interaction

It has five navigation areas: **Home**, **Learn**, **Lab**, **Progress**, and **Login**. Lesson detail routes remain within Learn.

- **Home:** Landing Page, lists features, getting Started.
- **Learn:** five modules and fourteen chapters, lesson cards, completion state, Continue, study content and read-only figures. Each chapter ends with a ten-question multiple-choice quiz ordered by difficulty (3 easy, 4 medium, 3 hard). See `README.md` and `content/catalog.json`. Prerequisites guide the reading order rather than locking chapters in this demo.
- **Lab:** eight guided challenges and a free experiment, drag-and-drop gate placement/reordering, Circuit and Python Code tabs, Aer/Cirq selection, Run/Reset/Compare, live result panels and assignment submission. Static hints link to Learn; the optional AI panel explains browser snapshots and suggests code for manual review.
- **Progress:** completion tracking, scores, attempts, map to what have been completed and whats left, user progress, login info, etc, profile dashboard.
- Learn and its chapter routes render the static curriculum and ten-question quizzes. Progress shows Learn results and Lab submissions. `supabase/schema.sql` defines Learn records and transactional grading. `.generated/learn-seed.sql` supplies private quiz keys; apply it when quiz versions change. `supabase/lab.sql` defines Lab attempts; only the Python server may write scores.
- AI uses `frontend/app/api/ai/route.ts`, `frontend/lib/ai/` and the shared `components/ai/ai-panel.tsx`. Keep `GEMINI_API_KEY` server-only in frontend/Vercel and the model constant in code. Read lesson/progress context on the server. Verify quiz attempt ownership and version before including answers. AI has no execution, grading or database-write tools. Use safe Markdown, validated structured output and allowlisted citations. Progress offers an on-demand plan without chat. Chat is ephemeral; no AI database setup is required.
- **Login:** one combined email/password login and registration experience at `/login`, followed by redirect to Learn. Email confirmation is disabled for the demo.

## Architecture and stack

Use one repository with a small frontend/backend split for local development:

~~~text
quantlearn/
|-- frontend/                         Next.js App Router
|   |-- app/
|   |   |-- page.tsx                   Home
|   |   |-- learn/{page.tsx,[chapterId]/page.tsx}
|   |   |-- lab/page.tsx
|   |   |-- progress/page.tsx
|   |   |-- login/page.tsx
|   |   |-- api/{grade,progress}/route.ts
|   |   |-- api/lab/[action]/route.ts
|   |   |-- layout.tsx
|   |   `-- globals.css
|   |-- components/{learn,lab,ui}/
|   |-- lib/{learn,lab,supabase}/
|   |-- public/learn/visuals/       Canonical public teaching figures
|   `-- package.json
|-- backend/                           FastAPI
|   |-- app/
|   |   |-- main.py
|   |   |-- models.py
|   |   |-- code.py
|   |   `-- adapters.py
|   |-- tests/test_lab.py
|   |-- Dockerfile
|   |-- requirements.txt
|   `-- .env.example
|-- content/{lessons,quizzes,lab}/
|-- supabase/{schema,lab}.sql
`-- SIH26140.md
~~~

Qiskit Aer and Cirq expose Python-first SDKs, so simulation stays in FastAPI. Next.js calls the backend through normalized JSON endpoints; the browser does not import either simulator directly.

The tree above shows the implemented structure. Keep the two small SDK adapters in one module with the `ENGINES` registry; split only when it becomes useful. Keep Next.js forwarding routes thin and avoid duplicating grading/progress business logic in both servers. Supabase clients live under `frontend/lib/supabase/`.

Lab accepts 1-3 qubits, 48 operations, and up to 4096 shots. Its Python editor parses a documented subset into the circuit model without executing submitted code. Both SDKs use q0 as the least significant bit. Statevectors precede automatic terminal Z measurements; Bloch views use reduced single-qubit states. Mid-circuit measurement, noise and unrestricted Python are outside this demo. Backend authentication validates the caller with Supabase; the secret key in `backend/.env` is used only to persist trusted grading results.

`content/lab/challenges.json` is the canonical Lab exercise list and references existing teaching fixtures. Content builds validate these references and produce `.generated/lab.json` for the UI. MCQ quizzes remain in Learn. Backend grading compares exact target states up to global phase, or the QAOA/VQE objective, and checks gate constraints.

Lesson and quiz content is authored in root `content/`. The canonical teaching figures live once in `frontend/public/learn/visuals/` because Next.js serves them directly from `public/`. `npm run content:build` from `frontend/` validates the content, regenerates the public figures and prepares an ignored `frontend/.generated/learn.json` bundle; it also runs automatically before dev/build. Keep the full bundle and quiz answer keys in server-only imports. The authoring math utility is not the Lab simulator.

Progress loading and chapter summaries live in `frontend/lib/learn/progress.ts`. Detail routes filter by chapter; full-course history is paginated rather than assumed to fit one Supabase response. Keep historical quiz versions in storage but fetch only UI-used fields. Quiz revisions accept positive integer versions; regenerate and apply the private seed when definitions change.

Run `npm run content:build`, `npm run lint` and `npm run build` from `frontend/`. See `README.md` for the concise setup guide and feature boundaries.
Run `python -m unittest discover -s backend/tests -v` from the repository root using the backend virtual environment. Verify a signed-in browser run and saved submission after backend/schema changes. Never claim that a mocked persistence test proves live Supabase saving.

## References

- [Problem statement](SIH26140.md)
- [Qiskit Aer simulation](https://qiskit.github.io/qiskit-aer/tutorials/1_aersimulator.html)
- [Cirq simulation](https://quantumai.google/cirq/simulate/simulation)
