create extension if not exists pgcrypto;

create table if not exists restaurant_tables (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  qr_code_url text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  table_id uuid references restaurant_tables(id) on delete cascade,
  table_slug text not null,
  status text not null default 'active',
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table if not exists menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references menu_categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  table_slug text not null,
  status text not null default 'new',
  total_amount numeric(10,2) not null default 0,
  special_note text,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id) on delete set null,
  quantity int not null default 1,
  item_price numeric(10,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists service_requests (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  table_slug text not null,
  request_type text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  table_slug text not null,
  amount numeric(10,2) not null,
  status text not null default 'created',
  method text,
  gateway_order_id text,
  gateway_payment_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

insert into restaurant_tables (slug, name)
values ('t1', 'Table 1'), ('t2', 'Table 2'), ('t3', 'Table 3')
on conflict (slug) do nothing;
