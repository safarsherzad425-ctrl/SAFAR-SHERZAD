-- Run this in Supabase Dashboard > SQL Editor.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(12,2) not null default 0 check (price >= 0),
  category text default '',
  description text default '',
  image_url text default '',
  published boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.products enable row level security;

-- Public visitors can see only published products.
create policy "Anyone can read published products"
on public.products for select
to anon, authenticated
using (published = true);

-- Authenticated owner can manage products only if their email matches.
-- Replace with the exact Owner email if it changes.
create policy "Owner can insert products"
on public.products for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'safarsherzad425@gmail.com');

create policy "Owner can update products"
on public.products for update
to authenticated
using ((auth.jwt() ->> 'email') = 'safarsherzad425@gmail.com')
with check ((auth.jwt() ->> 'email') = 'safarsherzad425@gmail.com');

create policy "Owner can delete products"
on public.products for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'safarsherzad425@gmail.com');

-- IMPORTANT:
-- In Supabase Authentication, create the account safarsherzad425@gmail.com
-- and verify its email. Use a strong password. Do not expose service_role keys.
