-- iCantFind.it — Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ── Challenges ────────────────────────────────────────────────

create table if not exists challenges (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  ctf_name    text not null default '',
  category    text not null check (category in ('web','crypto','forensics','pwn','re','osint','misc')),
  difficulty  text not null check (difficulty in ('easy','medium','hard')) default 'medium',
  points      integer,
  status      text not null check (status in ('unsolved','partial','solved')) default 'unsolved',
  flag        text,
  notes       text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Payloads ──────────────────────────────────────────────────

create table if not exists payloads (
  id            uuid primary key default gen_random_uuid(),
  challenge_id  uuid not null references challenges(id) on delete cascade,
  label         text,
  content       text not null,
  created_at    timestamptz not null default now()
);

-- ── Cheatsheet Entries ────────────────────────────────────────

create table if not exists cheatsheet_entries (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  category    text not null check (category in ('web','crypto','forensics','pwn','re','osint','misc')),
  snippet     text not null,
  tags        text[] not null default '{}',
  source_url  text,
  created_at  timestamptz not null default now()
);

-- ── RLS — fully public (no auth) ─────────────────────────────

alter table challenges        enable row level security;
alter table payloads          enable row level security;
alter table cheatsheet_entries enable row level security;

create policy "public read challenges"        on challenges        for select using (true);
create policy "public insert challenges"      on challenges        for insert with check (true);
create policy "public update challenges"      on challenges        for update using (true);
create policy "public delete challenges"      on challenges        for delete using (true);

create policy "public read payloads"          on payloads          for select using (true);
create policy "public insert payloads"        on payloads          for insert with check (true);
create policy "public delete payloads"        on payloads          for delete using (true);

create policy "public read cheatsheet"        on cheatsheet_entries for select using (true);

-- ── Indexes ───────────────────────────────────────────────────

create index if not exists idx_challenges_category   on challenges(category);
create index if not exists idx_challenges_status     on challenges(status);
create index if not exists idx_challenges_updated_at on challenges(updated_at desc);
create index if not exists idx_payloads_challenge_id on payloads(challenge_id);
create index if not exists idx_cheatsheet_category   on cheatsheet_entries(category);
