-- Run this in Supabase SQL editor

create table if not exists portal_emails (
  id uuid default gen_random_uuid() primary key,
  resend_id text,
  account text not null default 'keramiker@henrietteduckert.dk',
  from_email text not null,
  from_name text,
  subject text not null,
  body_html text,
  body_text text,
  is_read boolean default false,
  received_at timestamptz default now(),
  in_reply_to text,
  thread_id text,
  direction text default 'inbound' check (direction in ('inbound', 'outbound')),
  deleted_at timestamptz
);

create table if not exists portal_orders (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  description text not null,
  status text default 'Afventer' check (status in ('Afventer', 'Behandler', 'Fuldført', 'Annulleret')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add new columns to existing tables (safe to run if tables already exist)
alter table portal_emails add column if not exists account text not null default 'keramiker@henrietteduckert.dk';
alter table portal_emails add column if not exists thread_id text;
alter table portal_emails add column if not exists deleted_at timestamptz;

-- RLS
alter table portal_emails enable row level security;
alter table portal_orders enable row level security;

drop policy if exists "allow all" on portal_emails;
drop policy if exists "allow all" on portal_orders;
create policy "allow all" on portal_emails for all using (true) with check (true);
create policy "allow all" on portal_orders for all using (true) with check (true);

-- Set thread_id = id for existing emails that don't have one
update portal_emails set thread_id = id::text where thread_id is null;
