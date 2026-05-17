create table if not exists portal_emails (
  id uuid default gen_random_uuid() primary key,
  resend_id text,
  from_email text not null,
  from_name text,
  subject text not null,
  body_html text,
  body_text text,
  is_read boolean default false,
  received_at timestamptz default now(),
  in_reply_to text,
  direction text default 'inbound' check (direction in ('inbound', 'outbound'))
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

-- Enable RLS but allow all for anon (portal is password-protected at app level)
alter table portal_emails enable row level security;
alter table portal_orders enable row level security;
create policy "allow all" on portal_emails for all using (true) with check (true);
create policy "allow all" on portal_orders for all using (true) with check (true);
