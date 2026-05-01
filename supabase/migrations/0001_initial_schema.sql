-- Laburapp initial schema
-- Run once on a fresh Supabase project (SQL Editor or `supabase db push`).

-- ============================================================
-- Extensions
-- ============================================================
create extension if not exists "pgcrypto";

-- ============================================================
-- Enums
-- ============================================================
create type public.swipe_action as enum ('pass', 'match', 'super');

-- ============================================================
-- profiles
-- ============================================================
create table public.profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  display_name          text not null,
  headline              text,
  bio                   text,
  location              text,
  photo_url             text,
  birthdate             date,
  is_employer_enabled   boolean not null default true,
  is_employee_enabled   boolean not null default true,
  categories            text[] not null default '{}',
  skills                text[] not null default '{}',
  hourly_rate           integer,
  currency              text check (currency in ('ARS', 'USD')),
  verified              boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index profiles_categories_gin on public.profiles using gin (categories);
create index profiles_skills_gin     on public.profiles using gin (skills);
create index profiles_location_idx   on public.profiles (location);

-- ============================================================
-- swipes
-- ============================================================
create table public.swipes (
  id           uuid primary key default gen_random_uuid(),
  swiper_id    uuid not null references public.profiles(id) on delete cascade,
  target_id    uuid not null references public.profiles(id) on delete cascade,
  swiper_role  text not null check (swiper_role in ('employee', 'employer')),
  action       public.swipe_action not null,
  created_at   timestamptz not null default now(),
  unique (swiper_id, target_id, swiper_role),
  check (swiper_id <> target_id)
);

create index swipes_target_idx       on public.swipes(target_id);
create index swipes_swiper_role_idx  on public.swipes(swiper_id, swiper_role);

-- ============================================================
-- matches (mutual interest)
-- enforce stable ordering so (a,b) and (b,a) are the same row
-- ============================================================
create table public.matches (
  id          uuid primary key default gen_random_uuid(),
  user_a_id   uuid not null references public.profiles(id) on delete cascade,
  user_b_id   uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  check (user_a_id < user_b_id),
  unique (user_a_id, user_b_id)
);

create index matches_user_a_idx on public.matches(user_a_id);
create index matches_user_b_idx on public.matches(user_b_id);

-- ============================================================
-- messages
-- ============================================================
create table public.messages (
  id          uuid primary key default gen_random_uuid(),
  match_id    uuid not null references public.matches(id) on delete cascade,
  sender_id   uuid not null references public.profiles(id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now(),
  read_at     timestamptz
);

create index messages_match_created_idx on public.messages(match_id, created_at desc);

-- ============================================================
-- reviews
-- ============================================================
create table public.reviews (
  id           uuid primary key default gen_random_uuid(),
  reviewer_id  uuid not null references public.profiles(id) on delete cascade,
  reviewee_id  uuid not null references public.profiles(id) on delete cascade,
  rating       smallint not null check (rating between 1 and 5),
  comment      text,
  created_at   timestamptz not null default now(),
  unique (reviewer_id, reviewee_id),
  check (reviewer_id <> reviewee_id)
);

create index reviews_reviewee_idx on public.reviews(reviewee_id);

-- ============================================================
-- Triggers
-- ============================================================

-- Auto-create profile on auth.users insert
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at maintenance
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.swipes   enable row level security;
alter table public.matches  enable row level security;
alter table public.messages enable row level security;
alter table public.reviews  enable row level security;

-- profiles
create policy "profiles_read_authenticated" on public.profiles
  for select to authenticated using (true);

create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- swipes
create policy "swipes_read_own" on public.swipes
  for select to authenticated using (auth.uid() = swiper_id);

create policy "swipes_insert_own" on public.swipes
  for insert to authenticated with check (auth.uid() = swiper_id);

-- matches
create policy "matches_read_participant" on public.matches
  for select to authenticated
  using (auth.uid() = user_a_id or auth.uid() = user_b_id);

-- messages
create policy "messages_read_participant" on public.messages
  for select to authenticated using (
    exists (
      select 1 from public.matches m
      where m.id = match_id
        and (auth.uid() = m.user_a_id or auth.uid() = m.user_b_id)
    )
  );

create policy "messages_insert_sender" on public.messages
  for insert to authenticated with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.matches m
      where m.id = match_id
        and (auth.uid() = m.user_a_id or auth.uid() = m.user_b_id)
    )
  );

-- reviews
create policy "reviews_read_authenticated" on public.reviews
  for select to authenticated using (true);

create policy "reviews_insert_own" on public.reviews
  for insert to authenticated
  with check (auth.uid() = reviewer_id and reviewer_id <> reviewee_id);

-- ============================================================
-- Helper RPC: create_match_if_mutual
-- Called after a match/super swipe; idempotent.
-- ============================================================
create or replace function public.create_match_if_mutual(
  p_swiper uuid,
  p_target uuid
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_match_id uuid;
  v_a uuid;
  v_b uuid;
begin
  -- only create if there's a reciprocal positive swipe
  if not exists (
    select 1 from public.swipes
    where swiper_id = p_target
      and target_id = p_swiper
      and action in ('match', 'super')
  ) then
    return null;
  end if;

  if p_swiper < p_target then
    v_a := p_swiper; v_b := p_target;
  else
    v_a := p_target; v_b := p_swiper;
  end if;

  insert into public.matches (user_a_id, user_b_id)
  values (v_a, v_b)
  on conflict (user_a_id, user_b_id) do update
    set created_at = public.matches.created_at
  returning id into v_match_id;

  return v_match_id;
end;
$$;

grant execute on function public.create_match_if_mutual(uuid, uuid) to authenticated;
