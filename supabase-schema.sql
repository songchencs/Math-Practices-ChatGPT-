create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  visitor_id uuid not null,
  event_type text not null check (event_type in ('visit', 'practice_started', 'problem_answered', 'practice_completed')),
  locale text not null default 'unknown', metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.analytics_events enable row level security;
revoke all on public.analytics_events from anon, authenticated;
grant insert on public.analytics_events to anon;
grant usage, select on sequence public.analytics_events_id_seq to anon;
create policy "Anonymous visitors can record events" on public.analytics_events for insert to anon with check (char_length(event_type) <= 40 and char_length(locale) <= 20);
create or replace function public.dashboard_stats() returns jsonb language sql security definer set search_path = public as $$
  select jsonb_build_object(
    'visitors', (select count(distinct visitor_id) from analytics_events),
    'problems', (select count(*) from analytics_events where event_type = 'problem_answered'),
    'sessions', (select count(*) from analytics_events where event_type = 'practice_completed'),
    'accuracy', coalesce((select round(100.0 * avg((metadata->>'correct')::int), 0) from analytics_events where event_type = 'problem_answered'), 0),
    'locales', coalesce((select jsonb_agg(row_to_json(x)) from (select locale, count(*)::int as visitors from analytics_events group by locale order by visitors desc limit 4) x), '[]'::jsonb)
  );
$$;
revoke all on function public.dashboard_stats() from public;
grant execute on function public.dashboard_stats() to anon;
