-- Apply after schema.sql. Scores are written only by the trusted Python backend.
create table if not exists public.lab_attempts (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_id text not null,
  engine text not null constraint lab_attempts_engine_check check (engine in ('aer', 'cirq', 'pennylane')),
  circuit jsonb not null check (jsonb_typeof(circuit) = 'object'),
  passed boolean not null,
  score integer not null check (score between 0 and 100),
  feedback text not null,
  submitted_at timestamptz not null default now()
);
alter table public.lab_attempts drop constraint if exists lab_attempts_engine_check;
alter table public.lab_attempts add constraint lab_attempts_engine_check check (engine in ('aer', 'cirq', 'pennylane'));
create index if not exists lab_attempts_user_submitted_idx on public.lab_attempts(user_id, submitted_at desc);
alter table public.lab_attempts enable row level security;
revoke all on public.lab_attempts from public, anon, authenticated;
grant select on public.lab_attempts to authenticated;
grant all on public.lab_attempts to service_role;
drop policy if exists "Read own lab attempts" on public.lab_attempts;
create policy "Read own lab attempts" on public.lab_attempts for select to authenticated using ((select auth.uid()) = user_id);
