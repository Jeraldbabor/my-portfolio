-- Portfolio content: single row editable by authenticated users
create table if not exists public.portfolio_content (
  id int primary key default 1 check (id = 1),
  content jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- Allow public read
alter table public.portfolio_content enable row level security;

create policy "Public can read portfolio content"
  on public.portfolio_content for select
  using (true);

-- Only authenticated users (admin) can update/insert
create policy "Authenticated users can update portfolio content"
  on public.portfolio_content for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can insert portfolio content"
  on public.portfolio_content for insert
  to authenticated
  with check (true);

-- Seed empty so app can replace with default
insert into public.portfolio_content (id, content)
values (1, '{}')
on conflict (id) do nothing;
