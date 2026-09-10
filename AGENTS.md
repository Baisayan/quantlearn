# Instructions for building QuantLearn

QuantLearn is an interactive web-based platform that enables users to learn, design, simulate, and visualize quantum algorithms. It offers structured learning modules covering quantum computing fundamentals, circuit design, and standard quantum algorithms. Users will be able to construct quantum circuits through a drag-and-drop interface or by writing code, execute them on multiple quantum simulators, and visualize quantum states and measurement outcomes.

Source: [the supplied problem statement](SIH26140.pdf). The PDF describes the full platform; this prototype demonstrates every required area with deliberately narrow breadth.
## Screens and interaction

It has five pages: **Home**, **Learn**, **Lab**, **Progress**, and **Sign-in**.

- **Home:** concise product introduction, featured lesson, quick-start Lab action, and links to Learn and Progress.
- **Learn:** lesson cards, completion state, Continue, and a small revisit recommendation.
- **Lab:** lesson text and target on the left; Circuit and Code tabs in the center; Run/Reset above the result panels; tutor drawer on the right; quiz and assignment below.
- **Progress:** learner completion, best scores, attempts, and last feedback.
- **Sign-in:** sign-in form with learner demo account, followed by redirect to Home.

Use a light-themed, minimal, aesthetic UI for pages.
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
|   |   |-- sign-in/page.tsx
|   |   |-- api/{simulate,tutor,grade,progress}/route.ts
|   |   |-- layout.tsx
|   |   `-- globals.css
|   |-- components/{circuit,visualizations,lessons,tutor,progress}/
|   |-- lib/{supabase.ts,api.ts}
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
|-- content/{lessons,quizzes,assignments}/
|-- supabase/schema.sql
|-- prototype.md
`-- SIH26140.pdf
~~~
Qiskit Aer and Cirq expose Python-first SDKs, so simulation stays in FastAPI. Next.js calls the backend through normalized JSON endpoints; the browser does not import either simulator directly.
## References

- [Problem statement PDF](SIH26140.pdf)
- [Qiskit Aer simulation](https://qiskit.github.io/qiskit-aer/tutorials/1_aersimulator.html)
- [Cirq simulation](https://quantumai.google/cirq/simulate/simulation)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [FastAPI](https://fastapi.tiangolo.com/)
