create extension if not exists pgcrypto;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  reference_code varchar(40) not null unique,
  name varchar(120) not null,
  document_masked varchar(30),
  phone_masked varchar(30),
  city varchar(80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customers_name_length check (char_length(name) between 2 and 120)
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

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

alter table public.customers enable row level security;

comment on table public.customers is 'Clientes fictícios usados no ambiente acadêmico do SupportFlow.';
