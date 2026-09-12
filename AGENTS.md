# Instructions for building QuantLearn

QuantLearn is an interactive web-based platform that enables users to learn, design, simulate, and visualize quantum algorithms. It offers structured learning modules covering quantum computing fundamentals, circuit design, and standard quantum algorithms. Users will be able to construct quantum circuits through a drag-and-drop interface or by writing code, execute them on multiple quantum simulators, and visualize quantum states and measurement outcomes.

Source: [the supplied problem statement](SIH26140.md). This describes the full platform. The current MVP implements deliberately narrow examples and supports **Qiskit Aer and Cirq only**; PennyLane and qBraid integrations are deferred. AI is deferred until Learn and Lab are established. Keep the original problem statement unchanged as the requirements reference.

## Screens and interaction

It has five navigation areas: **Home**, **Learn**, **Lab**, **Progress**, and **Login**. Lesson detail routes remain within Learn.

- **Home:** Landing Page, lists features, getting Started.
- **Learn:** five modules and fourteen chapters, lesson cards, completion state, Continue, study content and read-only figures. Each chapter ends with a ten-question multiple-choice quiz ordered by difficulty (3 easy, 4 medium, 3 hard). See `content/README.md` and `content/catalog.json`. Prerequisites guide the reading order rather than locking chapters in this demo.
- **Lab:** lesson text and target on the left; Circuit and Code tabs in the center; Run/Reset above the result panels; tutor drawer on the right; quiz and assignment below.
- **Progress:** completion tracking, scores, attempts, map to what have been completed and whats left, user progress, login info, etc, profile dashboard.
- **Login:** one combined email/password login and registration experience at `/login`, followed by redirect to Learn. Email confirmation is disabled for the demo.

## Architecture and stack

Use one repository with a small frontend/backend split for local development:

~~~text
quantlearn/
|-- frontend/                         Next.js App Router
|   |-- app/
|   |   |-- page.tsx                   Home
|   |   |-- learn/page.tsx
|   |   |-- lab/page.tsx
|   |   |-- progress/page.tsx
|   |   |-- login/page.tsx
|   |   |-- api/{simulate,tutor,grade,progress}/route.ts
|   |   |-- layout.tsx
|   |   `-- globals.css
|   |-- components/{circuit,visualizations,lessons,tutor,progress}/
|   |-- lib/{supabase.ts,api.ts}
|   |-- public/learn/visuals/       Canonical public teaching figures
|   `-- package.json
|-- backend/                           FastAPI
|   |-- app/
|   |   |-- main.py
|   |   |-- models.py
|   |   |-- auth.py
|   |   |-- qasm.py
|   |   |-- routes/{simulate,tutor,grade,progress}.py
|   |   `-- adapters/{base,registry,aer,cirq}.py
|   |-- tests/
|   |-- requirements.txt
|   `-- .env.example
|-- content/{lessons,quizzes}/
|-- supabase/schema.sql
`-- SIH26140.md
~~~

Qiskit Aer and Cirq expose Python-first SDKs, so simulation stays in FastAPI. Next.js calls the backend through normalized JSON endpoints; the browser does not import either simulator directly.

The tree above is a target architecture, not a list of already implemented files. Add backend routes/adapters and Lab assignments only when their features are implemented; do not create empty placeholder modules. Keep Next.js forwarding routes thin and avoid duplicating grading/progress business logic in both servers. The actual Supabase clients currently live under `frontend/lib/supabase/`.

Lesson and quiz content is authored in root `content/`. The canonical teaching figures live once in `frontend/public/learn/visuals/` because Next.js serves them directly from `public/`. `npm run content:build` from `frontend/` validates the content, regenerates the public figures and prepares an ignored `frontend/.generated/learn.json` bundle; it also runs automatically before dev/build. Keep the full bundle and quiz answer keys in server-only imports when the lesson reader is implemented. `npm run content:check` verifies authored content, numerical examples and public visuals. The authoring math utility is not the Lab simulator.

## References

- [Problem statement](SIH26140.md)
- [Qiskit Aer simulation](https://qiskit.github.io/qiskit-aer/tutorials/1_aersimulator.html)
- [Cirq simulation](https://quantumai.google/cirq/simulate/simulation)
