-- Re-run with idempotent policy/trigger creation compatible with Postgres
-- 1) Tables
create table if not exists public.user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  device text,
  ip_address text,
  user_agent text,
  expires_at timestamptz not null,
  last_activity timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_sessions enable row level security;

-- Policies for user_sessions
drop policy if exists "Users manage own sessions" on public.user_sessions;
drop policy if exists "Admins manage all sessions" on public.user_sessions;

create policy "Users manage own sessions"
  on public.user_sessions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admins manage all sessions"
  on public.user_sessions
  for all
  using (has_role(auth.uid(), 'admin'::public.app_role))
  with check (has_role(auth.uid(), 'admin'::public.app_role));

-- Indexes for user_sessions
create index if not exists idx_user_sessions_user_id on public.user_sessions(user_id);
create index if not exists idx_user_sessions_expires_at on public.user_sessions(expires_at);
create index if not exists idx_user_sessions_last_activity on public.user_sessions(last_activity);

-- updated_at trigger for user_sessions
drop trigger if exists update_user_sessions_updated_at on public.user_sessions;
create trigger update_user_sessions_updated_at
before update on public.user_sessions
for each row execute function public.set_updated_at();

-- Activity logs table
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  entity_id uuid not null,
  entity_type text,
  activity_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.activity_logs enable row level security;

-- Policies for activity_logs
drop policy if exists "Insert activity logs (self or anonymous)" on public.activity_logs;
drop policy if exists "Users read own activity logs" on public.activity_logs;
drop policy if exists "Admins read all activity logs" on public.activity_logs;

create policy "Insert activity logs (self or anonymous)"
  on public.activity_logs
  for insert
  with check (user_id is null or auth.uid() = user_id);

create policy "Users read own activity logs"
  on public.activity_logs
  for select
  using (user_id is not null and auth.uid() = user_id);

create policy "Admins read all activity logs"
  on public.activity_logs
  for select
  using (has_role(auth.uid(), 'admin'::public.app_role));

-- Indexes for activity_logs
create index if not exists idx_activity_logs_entity on public.activity_logs(entity_id);
create index if not exists idx_activity_logs_type on public.activity_logs(activity_type);
create index if not exists idx_activity_logs_created_at on public.activity_logs(created_at);
create index if not exists idx_activity_logs_entity_type_created on public.activity_logs(entity_id, activity_type, created_at);

-- Orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  event_id uuid not null,
  total_amount numeric(10,2) not null default 0,
  currency text not null default 'USD',
  order_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Policies for orders
drop policy if exists "Users manage own orders" on public.orders;
drop policy if exists "Organizers view event orders" on public.orders;
drop policy if exists "Admins read all orders" on public.orders;

create policy "Users manage own orders"
  on public.orders
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Organizers view event orders"
  on public.orders
  for select
  using (exists (
    select 1 from public.events e
    where e.id = orders.event_id and e.organizer_id = auth.uid()
  ));

create policy "Admins read all orders"
  on public.orders
  for select
  using (has_role(auth.uid(), 'admin'::public.app_role));

-- Indexes for orders
create index if not exists idx_orders_event on public.orders(event_id);
create index if not exists idx_orders_status on public.orders(order_status);
create index if not exists idx_orders_created_at on public.orders(created_at);
create index if not exists idx_orders_user on public.orders(user_id);

-- updated_at trigger for orders
drop trigger if exists update_orders_updated_at on public.orders;
create trigger update_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

-- 2) Functions with stable search_path
-- Clean up expired/idle sessions
create or replace function public.cleanup_expired_sessions()
returns integer
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  deleted_count integer;
begin
  delete from public.user_sessions
  where expires_at < now() or last_activity < (now() - interval '90 days');

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

-- Clean up old activity logs
create or replace function public.cleanup_old_activity_logs()
returns integer
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  deleted_count integer;
begin
  delete from public.activity_logs
  where created_at < (now() - interval '90 days');

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

-- Calculate event metrics for a specific date
create or replace function public.calculate_event_metrics(event_uuid uuid, target_date date default current_date)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  result jsonb;
  views_count integer;
  registrations_count integer;
  revenue_sum numeric(10,2);
begin
  -- Views
  select count(*) into views_count
  from public.activity_logs
  where entity_id = event_uuid
    and activity_type = 'view_event'
    and date(created_at) = target_date;

  -- Registrations
  select count(*) into registrations_count
  from public.event_registrations
  where event_id = event_uuid
    and date(created_at) = target_date;

  -- Revenue from confirmed orders
  select coalesce(sum(total_amount), 0)::numeric(10,2) into revenue_sum
  from public.orders
  where event_id = event_uuid
    and order_status = 'confirmed'
    and date(created_at) = target_date;

  result := jsonb_build_object(
    'event_id', event_uuid,
    'date', target_date,
    'views', coalesce(views_count, 0),
    'registrations', coalesce(registrations_count, 0),
    'revenue', coalesce(revenue_sum, 0)
  );

  return result;
end;
$$;