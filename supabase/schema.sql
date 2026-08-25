-- Run in Supabase: SQL Editor → New query → Run
-- Personal markdown notes grouped by topic.

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null default 'Untitled',
  category text not null default 'software',
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notes add column if not exists title text;
alter table public.notes add column if not exists category text;
alter table public.notes add column if not exists updated_at timestamptz;

update public.notes
set title = coalesce(
  nullif(title, ''),
  nullif(left(split_part(content, E'\n', 1), 80), ''),
  'Untitled'
)
where title is null or title = '';

update public.notes
set category = coalesce(nullif(category, ''), 'software')
where category is null or category = '';

update public.notes
set updated_at = coalesce(updated_at, created_at, now())
where updated_at is null;

alter table public.notes alter column title set default 'Untitled';
alter table public.notes alter column title set not null;
alter table public.notes alter column category set default 'software';
alter table public.notes alter column category set not null;
alter table public.notes alter column updated_at set default now();
alter table public.notes alter column updated_at set not null;

alter table public.notes drop constraint if exists notes_category_check;
alter table public.notes add constraint notes_category_check
  check (category in ('network', 'system', 'devops', 'software'));

alter table public.notes enable row level security;

drop policy if exists "own notes" on public.notes;

create policy "own notes"
on public.notes
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
