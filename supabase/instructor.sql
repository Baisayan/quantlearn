-- Instructor Analytics and Cohort Performance Engine
-- Apply after schema.sql and lab.sql.

create or replace function public.get_instructor_cohort_analytics()
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  v_total_learners integer;
  v_total_quiz_submissions integer;
  v_avg_quiz_score numeric;
  v_total_lab_submissions integer;
  v_passed_lab_submissions integer;
  v_chapter_stats jsonb;
  v_challenge_stats jsonb;
  v_recent_activity jsonb;
begin
  -- Total distinct students enrolled/active
  select count(distinct user_id) into v_total_learners
  from (
    select user_id from public.lesson_progress
    union
    select user_id from public.quiz_attempts
    union
    select user_id from public.lab_attempts
  ) active_users;

  -- Overall Quiz Metrics
  select count(*), coalesce(round(avg((score::numeric / total::numeric) * 100), 1), 0)
  into v_total_quiz_submissions, v_avg_quiz_score
  from public.quiz_attempts;

  -- Overall Lab Metrics
  select count(*), count(*) filter (where passed = true)
  into v_total_lab_submissions, v_passed_lab_submissions
  from public.lab_attempts;

  -- Chapter-level Aggregates (Friction Heatmap)
  select coalesce(jsonb_agg(row_to_json(c)), '[]'::jsonb)
  into v_chapter_stats
  from (
    select
      qa.chapter_id,
      count(*) as total_attempts,
      count(distinct qa.user_id) as active_students,
      round(avg((qa.score::numeric / qa.total::numeric) * 100), 1) as avg_score_percent,
      max(qa.submitted_at) as last_activity
    from public.quiz_attempts qa
    group by qa.chapter_id
    order by avg_score_percent asc
  ) c;

  -- Challenge-level Aggregates
  select coalesce(jsonb_agg(row_to_json(ch)), '[]'::jsonb)
  into v_challenge_stats
  from (
    select
      la.challenge_id,
      count(*) as total_attempts,
      count(distinct la.user_id) as active_students,
      count(*) filter (where la.passed = true) as passed_count,
      round((count(*) filter (where la.passed = true)::numeric / nullif(count(*), 0)::numeric) * 100, 1) as pass_rate,
      round(avg(la.score), 1) as avg_fidelity_score,
      count(*) filter (where la.engine = 'aer') as aer_count,
      count(*) filter (where la.engine = 'cirq') as cirq_count,
      count(*) filter (where la.engine = 'pennylane') as pennylane_count
    from public.lab_attempts la
    group by la.challenge_id
    order by pass_rate asc
  ) ch;

  -- Recent Submissions Feed (anonymized)
  select coalesce(jsonb_agg(row_to_json(act)), '[]'::jsonb)
  into v_recent_activity
  from (
    select
      'quiz' as type,
      qa.chapter_id as title,
      round((qa.score::numeric / qa.total::numeric) * 100) as score,
      qa.submitted_at
    from public.quiz_attempts qa
    union all
    select
      'challenge' as type,
      la.challenge_id as title,
      la.score,
      la.submitted_at
    from public.lab_attempts la
    order by submitted_at desc
    limit 20
  ) act;

  return jsonb_build_object(
    'totalLearners', coalesce(v_total_learners, 0),
    'totalQuizSubmissions', coalesce(v_total_quiz_submissions, 0),
    'avgQuizScorePercent', coalesce(v_avg_quiz_score, 0),
    'totalLabSubmissions', coalesce(v_total_lab_submissions, 0),
    'labPassRate', case when v_total_lab_submissions > 0 then round((v_passed_lab_submissions::numeric / v_total_lab_submissions::numeric) * 100, 1) else 0 end,
    'chapterStats', v_chapter_stats,
    'challengeStats', v_challenge_stats,
    'recentActivity', v_recent_activity
  );
end;
$$;

revoke all on function public.get_instructor_cohort_analytics() from public, anon;
grant execute on function public.get_instructor_cohort_analytics() to authenticated;
