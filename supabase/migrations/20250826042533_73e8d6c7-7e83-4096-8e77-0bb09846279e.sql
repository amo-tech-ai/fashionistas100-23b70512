-- === Extensions ===
create extension if not exists pgcrypto;

-- === Enums ===
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin','organizer','attendee','sponsor','vendor');
  end if;

  if not exists (select 1 from pg_type where typname = 'profile_visibility') then
    create type public.profile_visibility as enum ('public','private');
  end if;
end $$;

-- === Core tables ===

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  full_name text,
  avatar_url text,
  is_active boolean not null default true,
  profile_visibility public.profile_visibility not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ensure trigger is recreated with EXECUTE FUNCTION
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- User preferences (1:1)
create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  prefs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_user_prefs_updated_at on public.user_preferences;
create trigger trg_user_prefs_updated_at
before update on public.user_preferences
for each row execute function public.set_updated_at();

-- Roles (N:1)
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique(user_id, role)
);

-- === Bootstrap on new auth user ===
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Create profile skeleton
  insert into public.profiles (id, email, phone, full_name, profile_visibility)
  values (
    new.id,
    new.email,
    new.phone,
    split_part(coalesce(new.email, new.phone, new.id::text || '@placeholder.local'), '@', 1),
    'private'
  )
  on conflict (id) do nothing;

  -- Give default attendee role
  insert into public.user_roles (user_id, role)
  values (new.id, 'attendee'::public.app_role)
  on conflict (user_id, role) do nothing;

  -- Initialize empty preferences
  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end $$;

-- recreate trigger using EXECUTE FUNCTION
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

-- === RLS ===
alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.user_roles enable row level security;

-- helper: check role
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

-- Policies: PROFILES
-- Public can view active public profiles
drop policy if exists "Public can view active public profiles" on public.profiles;
create policy "Public can view active public profiles"
  on public.profiles
  for select
  using (is_active and profile_visibility = 'public');

-- Users can view own profile
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Users can insert their own profile
drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Users can update their own profile
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Admins can read all profiles
drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
  on public.profiles
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Admins can modify all profiles
drop policy if exists "Admins can modify all profiles" on public.profiles;
create policy "Admins can modify all profiles"
  on public.profiles
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role))
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Admins can delete any profile
drop policy if exists "Admins can delete any profile" on public.profiles;
create policy "Admins can delete any profile"
  on public.profiles
  for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Policies: USER_PREFERENCES
-- Users can view own preferences
drop policy if exists "Users can view own preferences" on public.user_preferences;
create policy "Users can view own preferences"
  on public.user_preferences
  for select
  using (auth.uid() = user_id);

-- Users can insert own preferences
drop policy if exists "Users can insert own preferences" on public.user_preferences;
create policy "Users can insert own preferences"
  on public.user_preferences
  for insert
  with check (auth.uid() = user_id);

-- Users can update own preferences
drop policy if exists "Users can update own preferences" on public.user_preferences;
create policy "Users can update own preferences"
  on public.user_preferences
  for update
  using (auth.uid() = user_id);

-- Admins can read all preferences
drop policy if exists "Admins can read all preferences" on public.user_preferences;
create policy "Admins can read all preferences"
  on public.user_preferences
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Admins can modify all preferences
drop policy if exists "Admins can modify all preferences" on public.user_preferences;
create policy "Admins can modify all preferences"
  on public.user_preferences
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role))
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Policies: USER_ROLES (read own roles)
drop policy if exists "Users can view own roles" on public.user_roles;
create policy "Users can view own roles"
  on public.user_roles
  for select
  using (auth.uid() = user_id);

-- === Realtime ===
alter table public.profiles replica identity full;
alter table public.user_preferences replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'profiles'
  ) then
    alter publication supabase_realtime add table public.profiles;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'user_preferences'
  ) then
    alter publication supabase_realtime add table public.user_preferences;
  end if;
end $$;