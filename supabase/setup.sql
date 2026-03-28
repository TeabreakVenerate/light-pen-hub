-- Community & Monetization Hub schema
-- Run this in Supabase SQL editor.

create extension if not exists "pgcrypto";

-- Users are keyed by Clerk's user id, but we do not require Supabase Auth.
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  display_name text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create index if not exists users_clerk_user_id_idx
  on public.users (clerk_user_id);

-- Books are linked externally (no chapter database, no reading UI).
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author_name text,
  persona text, -- "Light Pen" | "Author Eliora" | "Heavenly_Daoist"
  description text,
  cover_image_url text not null,
  read_url text not null,
  external_button_label text default 'Read Now',
  created_at timestamptz not null default now()
);

create index if not exists books_persona_idx
  on public.books (persona);

-- Realtime comments per book.
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,

  -- Optional foreign-key for backfills; UI can rely on the Clerk fields.
  user_id uuid references public.users(id) on delete set null,

  clerk_user_id text not null,
  author_display_name text not null,
  author_avatar_url text,

  body text not null check (char_length(body) <= 2000),
  created_at timestamptz not null default now()
);

create index if not exists comments_book_id_created_at_idx
  on public.comments (book_id, created_at);

-- Gifts paid via Stripe Checkout.
create table if not exists public.gifts (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,

  -- Optional foreign-key for backfills; webhook update can use Stripe session id.
  from_user_id uuid references public.users(id) on delete set null,
  from_clerk_user_id text not null,

  amount_cents bigint not null check (amount_cents > 0),
  currency text not null default 'usd',

  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,

  status text not null default 'pending'
    check (status in ('pending','paid','failed','refunded')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gifts_book_id_created_at_idx
  on public.gifts (book_id, created_at);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists gifts_set_updated_at on public.gifts;
create trigger gifts_set_updated_at
before update on public.gifts
for each row execute procedure public.set_updated_at();

