-- Learn MVP. Apply once, then load the generated .generated/learn-seed.sql.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table private.learn_quizzes (
  chapter_id text primary key,
  version integer not null check (version > 0),
  answers jsonb not null check (jsonb_typeof(answers) = 'object')
);
alter table private.learn_quizzes enable row level security;
revoke all on private.learn_quizzes from public, anon, authenticated;

create table public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id text not null references private.learn_quizzes(chapter_id),
  last_opened_at timestamptz not null default now(),
  primary key (user_id, chapter_id)
);

create table public.quiz_attempts (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id text not null references private.learn_quizzes(chapter_id),
  quiz_version integer not null,
  answers jsonb not null,
  score integer not null,
  total integer not null check (total > 0 and total <= 20),
  submitted_at timestamptz not null default now(),
  check (score between 0 and total)
);
create index quiz_attempts_user_submitted_idx on public.quiz_attempts (user_id, submitted_at desc);
create index quiz_attempts_chapter_idx on public.quiz_attempts (chapter_id);
create index lesson_progress_chapter_idx on public.lesson_progress (chapter_id);

alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts enable row level security;
revoke all on public.lesson_progress, public.quiz_attempts from public, anon, authenticated;
grant select, insert, update on public.lesson_progress to authenticated;
grant select on public.quiz_attempts to authenticated;
create policy "Read own lessons" on public.lesson_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "Start own lessons" on public.lesson_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Revisit own lessons" on public.lesson_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Read own attempts" on public.quiz_attempts for select to authenticated using ((select auth.uid()) = user_id);

-- Privileged grading is isolated here because students cannot read the answer
-- table or write their own scores. Identity always comes from the verified JWT.
create function private.submit_learn_quiz(p_chapter_id text, p_version integer, p_answers jsonb, p_attempt_id uuid, p_read boolean)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  learner uuid := auth.uid();
  quiz private.learn_quizzes%rowtype;
  attempt public.quiz_attempts%rowtype;
  points integer;
begin
  if learner is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if p_read is distinct from true then raise exception 'Confirm that you have read the lesson' using errcode = '22023'; end if;
  select * into quiz from private.learn_quizzes where chapter_id = p_chapter_id;
  if not found or p_version is distinct from quiz.version then raise exception 'Quiz changed. Reload the lesson.' using errcode = '22023'; end if;
  if p_attempt_id is null or p_answers is null or jsonb_typeof(p_answers) <> 'object' then
    raise exception 'Invalid submission' using errcode = '22023';
  end if;
  if (select count(*) from jsonb_object_keys(p_answers)) <> (select count(*) from jsonb_each(quiz.answers))
     or exists (select 1 from jsonb_each_text(quiz.answers) q where not (p_answers ? q.key) or p_answers->>q.key is null or p_answers->>q.key not in ('a','b','c','d')) then
    raise exception 'Answer every question with a valid option' using errcode = '22023';
  end if;
  select count(*) into points from jsonb_each_text(quiz.answers) q where p_answers->>q.key = q.value;
  insert into public.quiz_attempts(id,user_id,chapter_id,quiz_version,answers,score,total)
    values(p_attempt_id,learner,p_chapter_id,p_version,p_answers,points,(select count(*) from jsonb_each(quiz.answers)))
    on conflict (id) do nothing;
  select * into attempt from public.quiz_attempts where id = p_attempt_id;
  if attempt.user_id <> learner or attempt.chapter_id <> p_chapter_id or attempt.quiz_version <> p_version or attempt.answers <> p_answers then
    raise exception 'Submission ID already used' using errcode = '22023';
  end if;
  insert into public.lesson_progress(user_id,chapter_id) values(learner,p_chapter_id)
    on conflict (user_id,chapter_id) do update set last_opened_at = now();
  return jsonb_build_object('score',attempt.score,'total',attempt.total,'submittedAt',attempt.submitted_at);
end;
$$;
revoke all on function private.submit_learn_quiz(text,integer,jsonb,uuid,boolean) from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.submit_learn_quiz(text,integer,jsonb,uuid,boolean) to authenticated;

create function public.submit_learn_quiz(p_chapter_id text, p_version integer, p_answers jsonb, p_attempt_id uuid, p_read boolean)
returns jsonb language sql security invoker set search_path = ''
as $$ select private.submit_learn_quiz(p_chapter_id,p_version,p_answers,p_attempt_id,p_read); $$;
revoke all on function public.submit_learn_quiz(text,integer,jsonb,uuid,boolean) from public, anon, authenticated;
grant execute on function public.submit_learn_quiz(text,integer,jsonb,uuid,boolean) to authenticated;
