-- NeverAlone MVP Supabase setup
-- Run this in Supabase SQL Editor.
-- Creates profile photo storage, extends profiles, and adds traveler listings.

create extension if not exists pgcrypto;

-- 1) Profiles: editable profile + max 3 public photo URLs
alter table public.profiles
  add column if not exists full_name text,
  add column if not exists location text,
  add column if not exists bio text,
  add column if not exists languages text[] default '{}',
  add column if not exists activities text[] default '{}',
  add column if not exists photo_urls text[] default '{}',
  add column if not exists updated_at timestamptz default now();

alter table public.profiles
  add constraint profiles_photo_urls_max_3
  check (coalesce(array_length(photo_urls, 1), 0) <= 3)
  not valid;

do $$
begin
  begin
    alter table public.profiles validate constraint profiles_photo_urls_max_3;
  exception
    when others then null;
  end;
end $$;

-- 2) Storage bucket for public profile photos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-photos',
  'profile-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage policies: each user writes only into folder named by their auth.uid()
drop policy if exists "Profile photos are publicly readable" on storage.objects;
create policy "Profile photos are publicly readable"
on storage.objects for select
to public
using (bucket_id = 'profile-photos');

drop policy if exists "Users can upload own profile photos" on storage.objects;
create policy "Users can upload own profile photos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update own profile photos" on storage.objects;
create policy "Users can update own profile photos"
on storage.objects for update
to authenticated
using (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete own profile photos" on storage.objects;
create policy "Users can delete own profile photos"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 3) Traveler listings / own advert
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  city text not null,
  activity text not null,
  radius_meters integer not null default 2000,
  description text,
  status text not null default 'active' check (status in ('active', 'paused', 'deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_status_created_at_idx
  on public.listings (status, created_at desc);

create index if not exists listings_user_id_idx
  on public.listings (user_id);

alter table public.listings enable row level security;

drop policy if exists "Active listings are publicly readable" on public.listings;
create policy "Active listings are publicly readable"
on public.listings for select
to public
using (status = 'active');

drop policy if exists "Users can create own listings" on public.listings;
create policy "Users can create own listings"
on public.listings for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own listings" on public.listings;
create policy "Users can update own listings"
on public.listings for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own listings" on public.listings;
create policy "Users can delete own listings"
on public.listings for delete
to authenticated
using (auth.uid() = user_id);

-- Optional but useful: auto-update updated_at on listings
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_listings_updated_at on public.listings;
create trigger set_listings_updated_at
before update on public.listings
for each row execute function public.set_updated_at();
