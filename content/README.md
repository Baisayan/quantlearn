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

## What is stored where

~~~text
content/
  README.md                    Curriculum, requirements mapping and architecture review
  catalog.json                 Modules, chapter metadata, ordering and file references
  sources.json                 Primary-source registry, access dates and reuse notes
  lessons/<chapter-id>.md      Canonical prose, formulas, code and figure references
  quizzes/<chapter-id>.json    Ten MCQs, stable option IDs, answer keys, explanations
  examples/circuits.json       Seventeen small circuit fixtures and expected probabilities
  scripts/prepare.mjs          Validation, packaging and generated-asset preparation
  scripts/quantum.mjs          Offline numerical checks used during content preparation
  scripts/visuals.mjs          Original deterministic SVG rendering
  scripts/verify-frameworks.py Optional independent checks using actual Aer and Cirq

frontend/
  .generated/learn.json        Generated, ignored server-import bundle
  public/learn/visuals/*       Canonical public figures, metadata and review gallery
~~~

Authored lesson text is plain Markdown with dollar-delimited LaTeX. For the requested read-only phase this is sufficient and avoids embedding executable JSX in course prose. Interactive components can later use the catalog's stable visual IDs and numerical data. MDX remains an option if future lessons genuinely need embedded React; it is not required to serve this pack. See [react-markdown](https://github.com/remarkjs/react-markdown), [remark-math](https://github.com/remarkjs/remark-math) and [Next.js MDX](https://nextjs.org/docs/app/guides/mdx).

Lesson and quiz files remain the root content source. The SVG pack is stored once in frontend/public/learn/visuals because it is served directly by Next.js. Figures are generated deterministically from the authoring code and fixtures; editing an SVG directly will be overwritten on the next content build.

Run from frontend:

~~~sh
npm run content:build
npm run content:check
~~~

Normal npm dev and build commands run content preparation first. If lesson material changes while a development server is already running, rerun content:build; no extra filesystem watcher is installed. A deployed start command uses the outputs of its preceding build.

## Frontend access

The preparation step reads all canonical files, checks references to /learn/visuals URLs and writes the combined JSON bundle inside frontend/.generated. It also regenerates the single public visual pack. The Learn server loader imports that bundle, looks up a chapter by its catalog ID and renders only the requested chapter.

The loader in `frontend/lib/learn/content.ts` uses this server-only boundary and calls `notFound()` for unknown chapter IDs:

~~~ts
import "server-only";
import course from "@/.generated/learn.json";

export function getChapter(slug: string) {
  return course.chapters.find((chapter) => chapter.id === slug);
}
~~~

The application route must handle an unknown slug with notFound(). Do not form filesystem paths from route parameters. Use a Server Component for lesson loading and rendering. Use a small Client Component for MCQ selections and submission. Pass that component only the quiz version, question IDs, difficulty labels, prompts and options; the answer key and explanation can be returned after server-side submission. The entire course bundle must never be imported into a Client Component. The [Next.js server/client documentation](https://nextjs.org/docs/app/getting-started/server-and-client-components) explains that boundary.

The reader uses react-markdown, remark-gfm, remark-math, rehype-katex and katex; GFM is needed for the authored tables. Map headings, paragraphs, tables, code and images through a single lesson renderer with Tailwind classes. The shared reader imports the supplied KaTeX stylesheet. Use shadcn for cards, navigation, forms and quiz controls. No custom global.css class collection is needed.

Place the reader at /learn/[slug] while /learn remains the course overview. This is still one navigation area. Render the recap quiz after the study material and references, using its matching chapterId. Reuse the same template across all fourteen chapters.

Build-time packaging is deliberate. Next.js runtime file tracing normally excludes files above the frontend project root unless configured otherwise. Moving the required data into a statically imported generated bundle avoids relying on runtime reads of ../content. Build environments must still check out the repository's root content folder. Uploading only frontend/ before running its prebuild will fail. If runtime filesystem loading is chosen later, explicitly configure outputFileTracingRoot/includes and test the packaged deployment. See [Next.js output tracing](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).

Only nonprivate educational SVGs are placed in public/. Personal progress and quiz answer JSON are not published there. Educational assets being public does not make the authenticated lesson route public.

## Assessment and progress contract

Every chapter has exactly ten questions, four options per question and one correct answer. Use one point per correct response, with no negative marking. Present the result as a count out of ten and a percentage. Show explanations after submission and permit retries. Keep the authored order: questions 1 to 3 are easy recall checks, 4 to 7 apply the chapter's ideas, and 8 to 10 require calculation, comparison or explanation of a limitation. Difficulty is relative to this introductory course and has not been calibrated with student results.

For this demo, chapter completion means the learner finishes the reading and submits the chapter quiz. There is no arbitrary passing threshold. Completion and score are separate facts: a completed chapter can have a low score and remain available for review. Prerequisites are advisory. Use the combination of chapter ID, quiz version and question ID as the assessment reference. Titles are display text, not persistence keys.

Store each opened chapter and its quiz attempts per authenticated learner. Completion is derived from a saved quiz attempt, so it cannot disagree with a quiz save. Derive the user ID on the server and compute scores from the trusted answer key. Keep canonical educational content in Git. Supabase progress tables need intentional privileges and ownership policies; table access and row access are different checks. The schema is versioned in `supabase/schema.sql` and applied to the connected QuantLearn project. See [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security).

The expanded quizzes and catalog are version 2. Question IDs have been reassigned within that version to reflect the new order; do not interpret a version-1 answer against the version-2 key. Store and validate the submitted quiz version, and reject a stale version with a request to reload. Use chapter/quiz version numbers when assessment definitions change. A score should remain associated with the version answered. The Progress page will aggregate these attempts and later add Lab challenge results.

## Visual design and scientific conventions

All supplied figures are original, scalable SVGs using white and violet with light-violet comparisons. They include an SVG title/description and descriptive Markdown alt text. The [figure gallery](../frontend/public/learn/visuals/index.html) shows the complete set; opening an image gives its full-size view. Mobile lesson layouts should offer an accessible full-size view for dense diagrams.

No third-party diagrams, logos, course screenshots or stock photos are bundled. Scientific figures are derived from specified states, matrices and circuit operations. A raster illustration generator is not needed for this material.

The fixed assets intentionally have no sliders, camera controls or live simulator calls. Future interactive versions should reuse the following data and behavior:

| Visual family | Supplied reference | Future interaction |
|---|---|---|
| Single-qubit state | Exact amplitudes, angles, Bloch coordinates and projected sphere | Theta/phi controls with linked statevector/probability display |
| Phase/interference | HH, HZH, HSH and HTH fixtures | Select a phase and advance through the circuit |
| Measurement | Exact probabilities and fixed-seed synthetic samples | Change shots, re-sample and retain exact-reference bars |
| Gates/circuits | Labeled operations and ordered fixtures | Step through a read-only circuit; editable building stays in Lab |
| Bell correlation | XX/ZZ predictions for a coherent state and a specific mixture | Switch basis and compare the examples |
| Teleportation | Three-wire circuit and four conditional branches | Choose a branch to highlight the corresponding corrections |
| Deutsch-Jozsa/Grover | Concrete oracle instances and exact output predictions | Advance algorithm stages and inspect amplitudes |
| QAOA/VQE | Cost convention, parameter values and analytic landscapes | Change parameters and show derived objective/energy |

The tests enforce key conventions: q0 is the least significant bit; Cirq order is explicit; pre-measurement state is separate from sampled results; Grover diffusion may differ by global phase; QAOA uses a specified maximize-cut sign convention; and a Bell subsystem is mixed. The histogram of a single basis neither reveals relative phase nor proves entanglement.

## Architecture assessment

The existing small Next.js/FastAPI split is appropriate for this project. Next.js provides the authenticated application and course rendering. Aer and Cirq have Python APIs, so FastAPI is the planned execution boundary. The [Aer simulator guide](https://qiskit.github.io/qiskit-aer/tutorials/1_aersimulator.html) and [Cirq simulation guide](https://quantumai.google/cirq/simulate/simulation) support that choice.

| Observed structure | Assessment and action |
|---|---|
| frontend/app with Home, login, learn, lab and progress | Correct navigation areas. Learn includes the overview and /learn/[chapterId] reader; Progress shows saved results. Lab remains a placeholder. |
| frontend/components/ui | Existing shadcn primitives are an appropriate shared base. Add only primitives the new screens use. |
| frontend/lib/supabase/client.ts, server.ts and proxy.ts | The files have different runtime responsibilities; their separation is not redundant merely because the MVP is small. This report is not a new remote auth audit. |
| /login | Combined email/password login and registration. Confirmation is disabled for this demo; there is no confirmation callback. |
| frontend/proxy.ts | The existing route boundary can also cover nested Learn pages. Future API handlers still need appropriate authorization and error behavior. |
| backend/ | Empty at review time; it is a target for future implementation, not an implemented simulation server. Do not create empty routers/adapters now. |
| root content/ | Appropriate for shared educational assets. Previously empty; now populated and connected to the frontend build lifecycle. |
| Root-level content outside frontend/ | Requires an intentional packaging decision. The generated import bundle and canonical public assets provide it without runtime file reads outside the app directory. |
| API routes proposed in both Next.js and FastAPI | Valid if Next.js routes are thin forwarding/auth boundaries. Avoid two independent copies of grading or progress business logic. Learn MCQ grading may live in Next.js without depending on the simulator service. |
| Proposed qasm.py | Add only if the chosen Lab interchange format requires QASM. The MVP can first use a validated gate-operation JSON model; unsupported operations must fail explicitly. |
| Proposed adapters/base and registry | Two concrete adapters and a small engine selection function are sufficient initially. Add an abstract plugin system only if its real usage warrants it. |
| supabase/schema.sql | Progress tables, ownership policies and transactional quiz grading. The build generates answer-key seed SQL from canonical quizzes. |
| Original AGENTS architecture sketch | A target tree, not an inventory of finished implementation. It now records the actual /login route, Markdown statement, two-engine scope and content workflow. |

The curriculum authoring scripts are development utilities, not production circuit execution. The independent reference calculation must not be exposed as a third simulator or a user-code executor. Keep full Python execution out of Learn.

The eventual Lab backend should accept a small validated model with qubit count, allowed gates, target indices, numeric parameters, engine, shots and an explicit basis order. Add bounded request sizes, execution time and a clear error model with the execution feature. Editable Python needs an isolated runtime before it is accepted; a raw exec in the FastAPI process is not an appropriate design.

## Verification and implementation boundary

The normal content check validates ten questions per chapter, the 3/4/3 difficulty sequence, quiz version 2, distinct option text, absence of em dashes in lessons/quizzes, unique IDs, module membership, prerequisite order, referenced files, all figure references, source citations, four-option single-answer quiz structure, and matching generated SVG output. It rejects orphan lesson/quiz files. It also checks Markdown code/display-math delimiter balance; this is not a substitute for rendering every formula with the eventual Markdown/KaTeX component.

Numerical checks cover seventeen circuit predictions, the sign of the Grover output, seven VQE parameter values, twenty QAOA parameter pairs, sixteen teleportation branches across four inputs, and the classical-mixture/Bell comparison. Additional checks cover normalization, product-state probabilities, shot uncertainty, sampled energy/cut arithmetic, Grover overshoot and phase-flip endpoints. Independent SDK verification also passed for all seventeen fixtures, including state equivalence up to global phase, and for the exact two Python snippets presented in chapter 14. Tested versions are Qiskit 2.5.2, Qiskit Aer 0.17.2 and Cirq Core 1.7.0. The optional script pins these versions; run `uv run --script content/scripts/verify-frameworks.py` from the repository root to repeat that check without adding simulator dependencies to the frontend.

The read-only visual pack and content preparation are ready for integration. The reader, quizzes and per-user persistence are implemented. Remaining work includes interactive examples, simulator endpoints and practical challenges. These are not silently counted as completed SIH deliverables.

## Content review, 12 September 2026

All fourteen lessons and their quiz definitions were read against the unchanged SIH delivery table. The revised pack contains 140 questions, with four distinct options and a worked explanation for each correct answer. The quiz revision increases assessment breadth; it does not turn completion into evidence of practical proficiency.

### Accuracy and source checks

Definitions and conventions were cross-checked with the linked IBM Quantum Learning material, IBM's bit-ordering guide, Cirq's gate/simulation/noise documentation, the Aer simulator guide, and the original QAOA and VQE papers. Worked arithmetic is calculated for the stated teaching models rather than borrowed hardware results. This is a factual and numerical review, not a plagiarism scan or an independent subject-expert certification.

The review retained the distinctions most likely to cause wrong answers: squared complex magnitudes rather than ordinary squares; global versus relative phase; fresh shots versus repeated collapsed measurements; q0 as the least significant bit; Bell correlations versus a classical mixture; explicitly named teleportation measurement bits; the Deutsch-Jozsa promise and query model; Grover's diffusion sign and stopping point; QAOA's maximize-cut convention; and the exact VQE bound versus finite-shot estimates.

One wording correction specifies that strictly mixed qubit states lie inside the Bloch sphere, while pure states lie on its surface. The noise chapter now checks p=1 as well as p=1/2: a deterministic Z operation produces a pure minus state, not greater mixing. The figure for p=1/4 remains consistent with this explanation. No physical output is relabeled as measured hardware data.

### Beginner accessibility and remaining depth

The original chapters were too compressed for readers meeting the mathematics for the first time. Added explanations cover ket notation, normalization, row-by-row matrix multiplication, radians, tensor products, signed measurement averages, density matrices, classical control, oracle truth tables, graph scoring, eigenvalues and code-reading vocabulary. Each new calculation question is supported by the lesson's formulas or a worked example. Study-time estimates were increased by eight minutes per chapter for the additional reading and six additional questions; these are estimates, not measured timings.

This is enough for a focused introduction to every topic explicitly named in deliverable 1, including Deutsch-Jozsa, Grover, QAOA and VQE. It is not a beginner-to-expert curriculum. Students should leave able to explain and predict the supplied small examples, then practice constructing and debugging circuits in Lab. Difficulty labels are editorial judgments and need learner feedback; no beginner usability study has been performed.

A credible route toward expertise would add a linear-algebra and probability course, larger independent circuit assignments, density-operator/channel analysis, Fourier transforms and phase estimation, complexity and resource analysis, error correction, and evaluation on unfamiliar problems. These are follow-on studies, not extra empty modules in this MVP. The existing IBM course references provide a starting point for deeper theory.

### Verification results for this revision

Content build/check passed with 14 chapters, 140 MCQs, 28 SVG figures and 17 circuit fixtures. All seven in-memory malformed-quiz tests were rejected: wrong count, wrong difficulty order, duplicate option text, missing correct option, duplicate prompt, stale quiz version and an em dash. The checks did not alter canonical quiz files. Frontend ESLint and the Next.js production build passed. Both pinned SDKs passed the 17 reference circuits and the two displayed 1024-shot Bell examples.

These historical content checks establish data consistency, numerical examples and build compatibility. The Learn implementation adds browser tests; neither set of checks is a student usability study.

### Delivery-table conclusion

Every explicitly named curriculum topic has a lesson, read-only figures and a ten-question quiz. Every named visualization category has educational coverage. Interactive examples and live visualizations still need implementation. The two-engine MVP intentionally omits PennyLane and qBraid. The Learn implementation adds scoring UI, learner persistence and basic analytics. Circuit editing, simulation APIs, coding challenges, AI tutoring and instructor views remain future work. See the ownership table above for the page responsible for each item.

The canonical lesson and quiz Markdown/JSON files remain in content/. The SVG pack is stored once in frontend/public/learn/visuals. The existing authoring utilities are retained because the current build and numerical checks use them; this assessment revision does not add a Learn runtime simulator or new backend modules. No landing-page, login or global stylesheet changes are part of this work.

## Running the Learn MVP

From `frontend/`, run `npm install` and `npm run dev`. The existing `.env.local` connects to QuantLearn. Sign in at `/login` and open `/learn`. The root layout supplies the shared fixed header and gradient; Learn adds no global styles.

`/learn` groups fourteen chapters into five modules. `/learn/[chapterId]` renders the selected Markdown, KaTeX equations, GFM tables, read-only code and original figures. Two shared Learn components handle reading and quizzes; cards and navigation stay in the pages rather than separate one-use files. The chapter title, objectives and quiz introduction are supplied by the template, avoiding duplicated Markdown sections.

The only public client quiz props are the version, question IDs, prompts, difficulties and options. `/api/grade` validates the session and submission, calls transactional database grading, then returns feedback. `/api/progress` records an opened chapter after the page mounts, so link prefetch does not mark unread chapters as started.

`supabase/schema.sql` is the initial schema already applied to the connected project. It contains `lesson_progress`, `quiz_attempts`, ownership policies, and a restricted grading function. Learners can read only their own records and cannot write scores. The grading function reads private answer keys and derives identity from `auth.uid()`. It saves the attempt and reading record in one transaction. Repeating the same submission ID does not create duplicate attempts. Completion is derived from saved attempts; no passing score is required.

`npm run content:build` also generates ignored `.generated/learn-seed.sql` from the canonical quizzes. For a new database, apply the schema once, then this seed. After editing question definitions or answers, increment the quiz version, regenerate and apply the seed before deploying the matching frontend. No manually maintained second answer-key file is needed. An out-of-date database quiz version is rejected rather than silently graded.

`/progress` shows completion, best scores, total attempt counts, the mean across attempts and the ten most recent attempts. Detailed question-level analytics and Lab results are deferred.

Run `npm run content:check`, `npm run lint` and `npm run build` for local verification. For browser checks, start the app, run `npx playwright install chromium`, then `npm run test:learn`. Set `PLAYWRIGHT_BASE_URL` if it is not served on port 3000. The integration test creates a clearly named temporary account with confirmation disabled, signs its session out at the end, and writes its ID to `.generated/test-user-<id>.json` for removal from Supabase Auth after the run. It does not use a service key. Run this on the demo project rather than a production dataset.

Next: implement the Lab circuit model and Aer/Cirq execution for the asymmetric bit-order example and Bell pair. Add interactive state controls and coding assessments with those actual simulation features.

### Learn implementation verification

The content checks, ESLint and production build pass. The browser suite passes against both development and production servers: all fourteen chapters, 28 loaded figures, KaTeX rendering, mobile overflow, keyboard selection, full-size asset links, unknown routes, sign-in/sign-out, score persistence, failed-save recovery, retries, duplicate submissions and full-course completion. Initial lesson HTML does not contain quiz keys or explanations. Direct score changes are denied. Transactional SQL checks confirm that another learner cannot read progress or attempts; those fixtures are rolled back. Temporary browser accounts and their progress were removed after testing.

Supabase's security advisor reports the intentionally inaccessible private answer table has no RLS policy, and the existing demo Auth setting has leaked-password protection disabled. The answer table has no client table privileges; its restricted grading function performs the private lookup. No auth settings were changed by the Learn implementation.

## Sources

The registry retains publisher, URL, known publication date, access date, relevance and reuse notes. Undated documentation is not assigned an invented publication date. The lesson prose, worked numerical models, MCQs and SVGs are original; the references establish definitions, APIs and algorithmic context. Links are references, not permission to copy a publisher's course or imagery.

1. IBM Quantum Learning / John Watrous. [Quantum information: single systems](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information). Accessed 2026-09-11. State normalization, complex amplitudes, Born rule and unitary operations.

2. IBM Quantum Learning / John Watrous. [Quantum information: multiple systems](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/multiple-systems/quantum-information). Accessed 2026-09-11. Tensor products, composite states and subsystem measurements.

3. IBM Quantum Learning / John Watrous. [Quantum circuits](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/quantum-circuits). Accessed 2026-09-11. Circuit notation, gates and classical control.

4. IBM Quantum Learning / John Watrous. [Quantum teleportation](https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/entanglement-in-action/quantum-teleportation). Accessed 2026-09-11. Entanglement resource, two classical bits, conditional corrections and no cloning.

5. IBM Quantum Learning / John Watrous. [The Deutsch-Jozsa algorithm](https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/quantum-query-algorithms/deutsch-jozsa-algorithm). Accessed 2026-09-11. Promise problem, phase kickback and query complexity.

6. IBM Quantum Documentation. [Grover's algorithm](https://quantum.cloud.ibm.com/docs/en/tutorials/grovers-algorithm). Accessed 2026-09-11. Phase oracle, diffusion and small circuit construction.

7. Lov K. Grover. [A fast quantum mechanical algorithm for database search](https://arxiv.org/abs/quant-ph/9605043). Published 1996. Accessed 2026-09-11. Original search result and oracle-query advantage.

8. Edward Farhi, Jeffrey Goldstone and Sam Gutmann. [A Quantum Approximate Optimization Algorithm](https://arxiv.org/abs/1411.4028). Published 2014-11-14. Accessed 2026-09-11. Alternating cost and mixer evolution, approximation and depth parameter.

9. IBM Quantum Documentation. [Quantum approximate optimization algorithm](https://quantum.cloud.ibm.com/docs/en/tutorials/quantum-approximate-optimization-algorithm). Accessed 2026-09-11. Max-cut mapping and classical optimization workflow; our chapter uses an explicitly different maximize-cut sign convention.

10. Alberto Peruzzo et al. [A variational eigenvalue solver on a quantum processor](https://arxiv.org/abs/1304.3061). Published 2013-04-10. Accessed 2026-09-11. Variational energy estimation and hybrid optimization.

11. IBM Quantum Documentation. [Ground-state energy estimation of the Heisenberg chain with VQE](https://quantum.cloud.ibm.com/docs/en/tutorials/spin-chain-vqe). Accessed 2026-09-11. Ansatz, observable, energy minimization and scaling limitations.

12. IBM Quantum Documentation. [Bit-ordering in the Qiskit SDK](https://quantum.cloud.ibm.com/docs/en/guides/bit-ordering). Accessed 2026-09-11. q0 is the least significant bit; statevector and displayed bitstring ordering.

13. IBM Quantum Documentation. [visualization API](https://quantum.cloud.ibm.com/docs/en/api/qiskit/visualization). Accessed 2026-09-11. Bloch, statevector, histogram and circuit display concepts.

14. IBM Quantum Documentation. [quantum_info API](https://quantum.cloud.ibm.com/docs/en/api/qiskit/quantum_info). Accessed 2026-09-11. Statevector, density matrix, partial trace and state fidelity references.

15. Qiskit Aer Documentation. [Simulators](https://qiskit.github.io/qiskit-aer/tutorials/1_aersimulator.html). Accessed 2026-09-11. AerSimulator imports, transpilation, shots and statevector/density-matrix methods.

16. Google Quantum AI. [Simulation](https://quantumai.google/cirq/simulate/simulation). Accessed 2026-09-11. Simulator.run versus simulate, explicit qubit_order and density matrices.

17. Google Quantum AI. [Gates and operations](https://quantumai.google/cirq/build/gates). Accessed 2026-09-11. Gate versus operation, Pauli gates, rotations and controlled operations.

18. Google Quantum AI. [Circuits](https://quantumai.google/cirq/build/circuits). Accessed 2026-09-11. Circuit moments, qubits, measurement and circuit construction.

19. Google Quantum AI. [Representing noise](https://quantumai.google/cirq/noise/representing_noise). Accessed 2026-09-11. Noise channels, stochastic processes and density matrices.

20. Google Quantum AI. [cirq.SimulatesExpectationValues](https://quantumai.google/reference/python/cirq/SimulatesExpectationValues). Accessed 2026-09-11. Exact simulator expectation values versus estimates from hardware measurements.

21. Q-12 Education Partnership. [Computer Science + QISE Key Concepts K-12 Framework](https://q12education.org/learning-materials/learning-materials-framework/computer-science-qise-key-concepts). Accessed 2026-09-11. Foundational learning outcomes and prerequisite scaffolding; algorithm depth adapted for undergraduate beginners.

22. Next.js Documentation. [Guides: MDX](https://nextjs.org/docs/app/guides/mdx). Accessed 2026-09-11. Alternative for lessons that later require embedded React components.

23. Next.js Documentation. [next.config.js: output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output). Accessed 2026-09-11. Runtime file-tracing boundary for files outside frontend/.

24. remark / unified maintainers. [react-markdown](https://github.com/remarkjs/react-markdown). Accessed 2026-09-11. Markdown rendering, component overrides and GFM plugin integration.

25. remark / unified maintainers. [remark-math](https://github.com/remarkjs/remark-math). Accessed 2026-09-11. Markdown mathematics and rehype-katex rendering.

26. Next.js Documentation. [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components). Accessed 2026-09-11. Server rendering, serializable props and the server-only import boundary.

27. Supabase Documentation. [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security). Accessed 2026-09-12. Future learner-owned progress rows and the distinction between table grants and row policies.
