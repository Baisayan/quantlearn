# QuantLearn curriculum and content architecture

The Learn content pack consists of five modules, fourteen chapters, 140 multiple-choice questions and twenty-eight original SVG figures. Each chapter has explicit objectives, explanations, worked examples, a summary, references and a ten-question recap quiz. The content is suitable for an introductory demo with basic algebra prerequisites; it is not a comprehensive degree-level course.

The supported execution engines are **Qiskit Aer and Cirq**. All four algorithms explicitly named in the problem statement remain in the curriculum. QAOA and VQE are algorithms, not framework dependencies: the examples here can be expressed with the gates and simulator facilities of either selected engine. AI remains a later phase.

## Deliverable coverage and ownership

The source of requirements is [SIH26140.md](../SIH26140.md), particularly its Delivery Table. The following mapping distinguishes prepared educational material from working application features.

| SIH item | Learn content prepared | Feature owner and remaining implementation |
|---|---|---|
| 1. Curriculum: qubits, gates and entanglement | Chapters 1–8 include state notation, probability, interference, measurement, gates, tensor products, Bell states and teleportation. | Learn overview and the shared chapter reader now render this content. Guided interactive examples remain future work; fixed SVGs alone do not fulfill interaction. |
| 1. Curriculum: Deutsch-Jozsa, Grover, QAOA and VQE | Chapters 9–12 cover every explicitly named algorithm with a small worked model, equations, diagrams, limitations and quiz. | Learn displays the material; Lab later supplies runnable practical exercises. “Etc.” is not an exhaustive algorithm list, so Shor/QFT are future extensions. |
| 2. Drag-and-drop circuit builder | Gate and circuit notation in chapters 4–8; reusable circuit fixtures. | Lab: actual editing, controls, validation and multi-qubit support. A diagram is not a circuit builder. |
| 2. Code editor with syntax highlighting | Chapter 14 contains two read-only Python examples. | Learn can highlight code; Lab owns editable code and isolated execution. |
| 3. Multi-framework simulation and real-time retrieval | Chapters 13–14 explain representations, execution and normalization; fixtures target Aer and Cirq. | FastAPI adapters and Lab run/result UI remain unimplemented. PennyLane/qBraid are explicitly deferred: two engines are the chosen MVP subset, not literal completion of all four named integrations. |
| 4. Bloch sphere | Chapter 1 has a projected single-qubit sphere; chapters 7 and 13 explain mixed local states. | Interactive camera/state controls and live Lab output remain future work. |
| 4. Statevector display | Chapters 1, 6, 7 and 13 show amplitudes, complex phase and ordering. | Lab should display returned amplitudes when a pure state is available. |
| 4. Measurement histograms | Chapters 3, 7, 9, 11 and 13 compare distributions; synthetic counts are explicitly labeled. | Learn displays fixed figures; Lab generates charts from actual simulator results. |
| 4. Circuit rendering | Bell, controlled gates, Deutsch-Jozsa, Grover, QAOA and teleportation diagrams are supplied. | Lab must render the current editable circuit. |
| 5. Quizzes and automated grading | Ten MCQs per chapter, one correct option each, with explanations. | Implemented: ten-question quizzes, trusted grading, saved attempts, explanations and retries. |
| 5. Coding challenges | Conceptual prerequisites are provided. | Lab owns assignment specifications, execution tests and practical grading; no placeholder assignments are created. |
| 5. Progress and analytics | Stable chapter/question IDs support reliable progress references. | Implemented: completion, Continue, best and recent scores, attempt counts and an average score. Supabase stores learner-owned progress and attempts. |
| 6. Responsive web UI, authentication, deployment, APIs | Existing Next.js application and auth files are present; local content preparation is wired into dev/build. | Learn and Progress are implemented with authenticated APIs. Lab remains a placeholder; deployment and simulator integration remain separate work. |

The problem statement's objectives also request AI tutoring and instructor dashboards. They are outside this content phase, with AI deferred and an instructor view belonging to a later Progress extension. The current work should be described as **implemented Learn MVP with static teaching figures, quizzes and progress**, not full SIH platform completion.

## Chapter plan

Each row links to the actual study material. Study-time estimates in the catalog include working through equations, diagrams and the quiz; they are editorial estimates rather than measured reading times.

| # | Chapter | Study material | Two prepared visual assets | Quiz recap |
|---|---|---|---|---|
| 1 | [Quantum bits and state notation](lessons/qubits.md) | Bit/qubit distinction; complex-number refresher; kets and vectors; normalization; Born probabilities; pure/mixed Bloch states. Worked state: sqrt(3)/2 on zero and i/2 on one. | Bloch sphere; amplitude/probability table. | Magnitudes, normalization, one measurement, sphere meaning. |
| 2 | [Superposition, phase and interference](lessons/superposition-and-phase.md) | Plus/minus states; basis dependence; global versus relative phase; adding amplitudes; HH/HZH; coherence versus a mixture. | Phase comparison; interference paths. | Identical histograms, HZH prediction, global phase, amplitude addition. |
| 3 | [Measurement and repeated shots](lessons/measurement.md) | Projective collapse; fresh preparation per shot; expected versus observed counts; uncertainty scaling; X/Z bases; eigenvalue averages. | Exact versus sampled histogram; basis-analyzer table. | Re-preparation, fluctuating counts, basis change, repeat measurement. |
| 4 | [Single-qubit gates](lessons/single-qubit-gates.md) | I/X/Y/Z/H; matrix action; unitarity; reversibility; cancellation; gate order; phase-sensitive comparison. | Gate reference; order comparison with final analyzer. | X action, Z phase, noncommuting sequences, unitarity. |
| 5 | [Phase and rotation gates](lessons/phase-and-rotation-gates.md) | S/T identities; Rx/Ry/Rz; radians and half angles; Ry probabilities; rotation versus powered-gate conventions; controlled global-phase caveat. | Rotation probability curve; phase-gate circuits. | T²=S, Ry(pi/2), S/Rz relation, angle conventions. |
| 6 | [Multi-qubit circuits](lessons/multi-qubit-circuits.md) | Tensor products; 2^n amplitudes; CX/CZ/SWAP; wires and classical results; gate count/depth; idle qubits; explicit bit ordering. | Controlled-X diagram; asymmetric bit-order diagram. | Ordering, CX truth-table action, state size, depth. |
| 7 | [Entanglement and Bell states](lessons/entanglement.md) | Bell preparation; pure-state factorization check; Bell family; classical versus quantum correlations; XX/ZZ comparison; reduced density matrices; no signaling. | Bell circuit; correlation histograms. | Preparation, limits of one histogram, mixed local state, complementary bases. |
| 8 | [Teleportation](lessons/teleportation.md) | Three-qubit ownership; Bell resource; Bell-basis analysis; measurement-bit naming; four correction branches; complex-state recovery; no cloning and classical communication. | Circuit with dashed classical control; correction table. | Resources, conditional X/Z, no cloning, Bob's unconditioned state. |
| 9 | [Deutsch-Jozsa](lessons/deutsch-jozsa.md) | Constant/balanced promise; reversible oracle; minus-state helper; phase kickback; n=2 XOR example; cancellation; deterministic query complexity caveat. | Three-qubit oracle circuit; constant/balanced distributions. | Promise, oracle calls, all-zero classification, non-universal 11 output. |
| 10 | [Grover](lessons/grover.md) | Four candidates/one marked state; phase oracle; mean-amplitude reflection; diffusion's global phase; one-iteration calculation; overshooting; oracle cost. | Full two-qubit circuit; signed-amplitude chart. | Phase versus probability, mean, ideal success, stopping. |
| 11 | [QAOA](lessons/qaoa.md) | One-edge max-cut; objective Hamiltonian; p=1 cost/mixer; sign conventions; exact parameter pair; sampled solutions versus expectation; classical loop; limitations. | Cost/mixer circuit; cut probabilities. | Cut scoring, alternating operations, classical optimizer, no speedup claim. |
| 12 | [VQE](lessons/vqe.md) | Hermitian Hamiltonian; ansatz; H=Z+0.5X; analytic energy; separate measurement bases; variational bound; sampling caveat; convergence versus optimality. | Measurement circuits; exact energy landscape. | Energy expression, X setting, variational principle, ansatz. |
| 13 | [Simulation and noise](lessons/simulation-and-noise.md) | Statevector/density matrix; dense scaling; exact versus sampled output; phase-flip channel; noise versus shot uncertainty; four result panels; hardware limitations. | Noise distribution comparison; result-panel reference. | Dense state size, sampling, phase-flip prediction, joint-state display. |
| 14 | [Qiskit Aer and Cirq](lessons/aer-and-cirq.md) | Paired Bell snippets; local engines; snapshots before measurement; qubit/measurement order; asymmetric test; choosing sampled, pure-state or mixed-state results. | Framework-order mapping; result-selection guide. | Ordering, reversal detection, sampling methods, random seeds. |

The progression contains just-in-time math refreshers rather than a separate mathematics course. Teleportation is an additional teaching bridge beyond the four named algorithms. Prerequisites suggest an order; they do not block browsing in the demo.

## Content ownership and rendering

| Path | Purpose |
|---|---|
| `content/catalog.json` | Five modules, chapter metadata, prerequisites and file references |
| `content/lessons/` | Canonical Markdown prose, equations, tables, read-only code and figure links |
| `content/quizzes/` | Ten questions per chapter, stable IDs, versions, private answers and explanations |
| `content/sources.json` | Primary-source URLs, publisher details and reuse notes |
| `content/examples/circuits.json` | Seventeen reference circuits for authoring checks |
| `content/scripts/` | Content validation, numerical checks and deterministic figure generation |
| `frontend/public/learn/visuals/` | The only served copy of the 28 teaching figures and review gallery |
| `frontend/.generated/` | Ignored server-only course bundle and private answer-key SQL seed |

The examples and scripts are used by the content build, not by a browser simulator. Keep them. Edit figure generators and fixtures rather than generated SVGs, which are overwritten during builds.

The server-only loader in `frontend/lib/learn/content.ts` imports the generated bundle and rejects unknown chapter IDs. One shared reader renders Markdown with GFM and KaTeX at `/learn/[chapterId]`. The template supplies the title, objectives and quiz without duplicating those Markdown sections. The quiz client receives prompts, options, IDs, difficulty and version, never the full bundle or answer key. Feedback arrives only after server grading.

The root layout owns the fixed header and radial background. Learn uses existing shadcn primitives and Tailwind. The KaTeX stylesheet version matches the renderer's dependency.

## Run and maintain the app

From `frontend/`:

~~~sh
npm install
npm run dev
~~~

Copy `.env.example` to `.env.local` and supply the project's public Supabase URL and publishable key before starting. Use the combined email/password page at `/login`; email confirmation is disabled for this demo. Authenticated users continue to `/learn`.

Development and production builds automatically run `content:build`. If content changes while the dev server is running, run it again. Build environments must include root `content/`, not only `frontend/`; runtime rendering uses the generated import and does not read outside the app directory.

For a new Supabase database:

1. Apply `supabase/schema.sql` once.
2. Run `npm run content:build`.
3. Apply `frontend/.generated/learn-seed.sql` through a trusted SQL session.
4. Start the matching frontend.

When question definitions or answers change, increment that chapter's quiz version, rebuild, apply the regenerated seed and deploy the matching frontend. Versions must be positive PostgreSQL integers. A mismatched submitted/database version is rejected. Historical attempts retain their original version and score; an assessment revision does not reset completion.

## Assessment and progress

Each chapter has ten four-option MCQs: three easy, four medium, then three hard. Each correct answer earns one point. Reading confirmation and a saved quiz submission complete a chapter, regardless of score. Retakes remain available; prerequisites guide reading order rather than locking lessons. This introductory curriculum does not certify practical proficiency or take a beginner to expert level.

`/api/progress` records a chapter opening after mount, not during link prefetch. `/api/grade` validates the session and request, calls trusted transactional grading and returns explanations. Supabase derives ownership from `auth.uid()`, reads private answer keys and saves the attempt and reading record together. Retrying the same submission ID cannot create a duplicate attempt. Learners cannot write scores or read another learner's records.

`frontend/lib/learn/progress.ts` loads only the selected chapter on detail routes. Course-wide pages paginate attempts to avoid silently losing history at the API row cap. Shared chapter summaries supply status, latest score, best score and attempt count. The Progress page also displays the average across all attempts and the ten most recent attempts. Question-level analytics and Lab results are deferred.

Pagination is adequate for this demo; database-side aggregates can replace loading the full history if real usage warrants it. No extra service layer or schema migration is required for this cleanup.

## Verification

Run from `frontend/`:

~~~sh
npm run content:build
npm run lint
npm run build
~~~

The build validates chapter/source references, ten questions, difficulty order, positive quiz versions, distinct options, answer IDs, Markdown delimiters, numerical examples and generated figures. It rejects orphan lesson/quiz files and em dashes in authored material. The authoring math utility is not a production simulator.

## Scientific conventions and sources

The lessons, worked models, MCQs and SVGs are original. References in [sources.json](sources.json) and each lesson establish definitions and API context; they do not grant permission to copy third-party lessons or imagery. The [figure gallery](../frontend/public/learn/visuals/index.html) includes all supplied visuals. Each figure has descriptive text and can be opened at full size.

Keep q0 as the least significant bit and specify Cirq ordering explicitly. Distinguish pre-measurement states from sampled results, relative from global phase, and sampling uncertainty from noise. A Bell subsystem is mixed; one histogram cannot prove entanglement. Preserve the stated Grover diffusion sign, QAOA maximize-cut convention and VQE exact-bound versus finite-shot distinction. Synthetic histograms must remain labeled, not presented as hardware measurements.

## What comes next

Build a small validated Lab circuit model and FastAPI execution for Aer and Cirq, beginning with Bell and asymmetric bit-order examples. Add live result panels, circuit editing and practical assessments with those working execution features. Editable Python requires isolation, not raw execution inside the API process.

Interactive teaching controls, drag-and-drop editing, code execution, live visualizations, coding challenges, AI tutoring, instructor views and deployment validation remain future work. The implemented Learn MVP does not satisfy the full SIH platform on its own.
