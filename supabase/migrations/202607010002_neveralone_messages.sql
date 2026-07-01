-- NeverAlone Sprint: listing responses, conversations, messages
-- Run this in Supabase SQL Editor after 202607010001_neveralone_profiles_storage_listings.sql.

create extension if not exists pgcrypto;

create table if not exists public.listing_responses (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  responder_id uuid not null references auth.users(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint listing_responses_not_self check (responder_id <> owner_id)
);

create unique index if not exists listing_responses_unique_active_idx
  on public.listing_responses (listing_id, responder_id)
  where status in ('pending', 'accepted');

create index if not exists listing_responses_owner_idx
  on public.listing_responses (owner_id, created_at desc);

create index if not exists listing_responses_responder_idx
  on public.listing_responses (responder_id, created_at desc);

alter table public.listing_responses enable row level security;

drop policy if exists "Users can read own listing responses" on public.listing_responses;
create policy "Users can read own listing responses"
on public.listing_responses for select
to authenticated
using (auth.uid() = responder_id or auth.uid() = owner_id);

drop policy if exists "Users can respond to active listings" on public.listing_responses;
create policy "Users can respond to active listings"
on public.listing_responses for insert
to authenticated
with check (
  auth.uid() = responder_id
  and responder_id <> owner_id
  and exists (
    select 1 from public.listings
    where listings.id = listing_id
      and listings.user_id = owner_id
      and listings.status = 'active'
  )
);

drop policy if exists "Listing owners can update responses" on public.listing_responses;
create policy "Listing owners can update responses"
on public.listing_responses for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete set null,
  response_id uuid references public.listing_responses(id) on delete set null,
  participant_a uuid not null references auth.users(id) on delete cascade,
  participant_b uuid not null references auth.users(id) on delete cascade,
  last_message text,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint conversations_two_people check (participant_a <> participant_b)
);

create unique index if not exists conversations_response_unique_idx
  on public.conversations (response_id)
  where response_id is not null;

create index if not exists conversations_participant_a_idx
  on public.conversations (participant_a, updated_at desc);

create index if not exists conversations_participant_b_idx
  on public.conversations (participant_b, updated_at desc);

alter table public.conversations enable row level security;

drop policy if exists "Participants can read conversations" on public.conversations;
create policy "Participants can read conversations"
on public.conversations for select
to authenticated
using (auth.uid() = participant_a or auth.uid() = participant_b);

drop policy if exists "Participants can create conversations" on public.conversations;
create policy "Participants can create conversations"
on public.conversations for insert
to authenticated
with check (auth.uid() = participant_a or auth.uid() = participant_b);

drop policy if exists "Participants can update conversations" on public.conversations;
create policy "Participants can update conversations"
on public.conversations for update
to authenticated
using (auth.uid() = participant_a or auth.uid() = participant_b)
with check (auth.uid() = participant_a or auth.uid() = participant_b);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index if not exists messages_conversation_created_idx
  on public.messages (conversation_id, created_at asc);

create index if not exists messages_sender_idx
  on public.messages (sender_id, created_at desc);

alter table public.messages enable row level security;

drop policy if exists "Participants can read messages" on public.messages;
create policy "Participants can read messages"
on public.messages for select
to authenticated
using (
  exists (
    select 1 from public.conversations
    where conversations.id = messages.conversation_id
      and (conversations.participant_a = auth.uid() or conversations.participant_b = auth.uid())
  )
);

drop policy if exists "Participants can send messages" on public.messages;
create policy "Participants can send messages"
on public.messages for insert
to authenticated
with check (
  auth.uid() = sender_id
  and exists (
    select 1 from public.conversations
    where conversations.id = conversation_id
      and (conversations.participant_a = auth.uid() or conversations.participant_b = auth.uid())
  )
);

drop policy if exists "Participants can mark messages read" on public.messages;
create policy "Participants can mark messages read"
on public.messages for update
to authenticated
using (
  exists (
    select 1 from public.conversations
    where conversations.id = messages.conversation_id
      and (conversations.participant_a = auth.uid() or conversations.participant_b = auth.uid())
  )
)
with check (
  exists (
    select 1 from public.conversations
    where conversations.id = messages.conversation_id
      and (conversations.participant_a = auth.uid() or conversations.participant_b = auth.uid())
  )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_listing_responses_updated_at on public.listing_responses;
create trigger set_listing_responses_updated_at
before update on public.listing_responses
for each row execute function public.set_updated_at();

drop trigger if exists set_conversations_updated_at on public.conversations;
create trigger set_conversations_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();

create or replace function public.touch_conversation_from_message()
returns trigger
language plpgsql
as $$
begin
  update public.conversations
  set last_message = new.body,
      last_message_at = new.created_at,
      updated_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists touch_conversation_after_message on public.messages;
create trigger touch_conversation_after_message
after insert on public.messages
for each row execute function public.touch_conversation_from_message();
