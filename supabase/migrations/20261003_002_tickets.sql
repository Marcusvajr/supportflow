create sequence if not exists public.ticket_protocol_seq start 1;

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  protocol varchar(20) not null unique,
  customer_id uuid not null references public.customers(id) on delete restrict,
  title varchar(150) not null,
  description text not null,
  category varchar(40) not null,
  status varchar(20) not null default 'OPEN',
  priority varchar(20) not null,
  assigned_to_user_id varchar(128),
  created_by_user_id varchar(128) not null,
  last_modified_by_user_id varchar(128) not null,
  resolution text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz,
  constraint tickets_title_length check (char_length(title) between 5 and 150),
  constraint tickets_description_length check (char_length(description) between 10 and 5000),
  constraint tickets_category_check check (category in ('NO_CONNECTION','SLOW_CONNECTION','INTERMITTENCE','WIFI','EQUIPMENT','ACCESS_TO_SERVICE','OTHER')),
  constraint tickets_status_check check (status in ('OPEN','DIAGNOSING','ESCALATED','RESOLVED')),
  constraint tickets_priority_check check (priority in ('LOW','MEDIUM','HIGH','CRITICAL'))
);

create table if not exists public.ticket_activities (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  author_user_id varchar(128) not null,
  type varchar(30) not null,
  description text not null,
  created_at timestamptz not null default now(),
  constraint ticket_activities_type_check check (type in ('NOTE','TEST','DIAGNOSIS')),
  constraint ticket_activities_description_length check (char_length(description) between 2 and 5000)
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  entity_type varchar(30) not null,
  entity_id uuid not null,
  action varchar(40) not null,
  actor_user_id varchar(128) not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_ticket_protocol()
returns trigger
language plpgsql
as $$
begin
  if new.protocol is null or new.protocol = '' then
    new.protocol := 'SF-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.ticket_protocol_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists tickets_set_protocol on public.tickets;
create trigger tickets_set_protocol
before insert on public.tickets
for each row execute function public.set_ticket_protocol();

drop trigger if exists tickets_set_updated_at on public.tickets;
create trigger tickets_set_updated_at
before update on public.tickets
for each row execute function public.set_updated_at();

create or replace function public.audit_ticket_changes()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.audit_events(entity_type, entity_id, action, actor_user_id, metadata)
    values ('TICKET', new.id, 'TICKET_CREATED', new.created_by_user_id,
      jsonb_build_object('status', new.status, 'priority', new.priority, 'protocol', new.protocol));
    return new;
  end if;

  if old.status is distinct from new.status then
    insert into public.audit_events(entity_type, entity_id, action, actor_user_id, metadata)
    values ('TICKET', new.id,
      case when old.status = 'RESOLVED' and new.status = 'DIAGNOSING' then 'TICKET_REOPENED' else 'STATUS_CHANGED' end,
      new.last_modified_by_user_id,
      jsonb_build_object('from', old.status, 'to', new.status));
  end if;

  if old.priority is distinct from new.priority then
    insert into public.audit_events(entity_type, entity_id, action, actor_user_id, metadata)
    values ('TICKET', new.id, 'PRIORITY_CHANGED', new.last_modified_by_user_id,
      jsonb_build_object('from', old.priority, 'to', new.priority));
  end if;

  if old.assigned_to_user_id is distinct from new.assigned_to_user_id then
    insert into public.audit_events(entity_type, entity_id, action, actor_user_id, metadata)
    values ('TICKET', new.id, 'ASSIGNEE_CHANGED', new.last_modified_by_user_id,
      jsonb_build_object('from', old.assigned_to_user_id, 'to', new.assigned_to_user_id));
  end if;

  if old.resolution is distinct from new.resolution and new.resolution is not null then
    insert into public.audit_events(entity_type, entity_id, action, actor_user_id, metadata)
    values ('TICKET', new.id, 'RESOLUTION_RECORDED', new.last_modified_by_user_id,
      jsonb_build_object('resolution', new.resolution));
  end if;

  return new;
end;
$$;

drop trigger if exists tickets_audit_changes on public.tickets;
create trigger tickets_audit_changes
after insert or update on public.tickets
for each row execute function public.audit_ticket_changes();

create or replace function public.audit_ticket_activity()
returns trigger
language plpgsql
as $$
begin
  insert into public.audit_events(entity_type, entity_id, action, actor_user_id, metadata)
  values ('TICKET', new.ticket_id, 'ACTIVITY_ADDED', new.author_user_id,
    jsonb_build_object('activityId', new.id, 'type', new.type));
  return new;
end;
$$;

drop trigger if exists ticket_activities_audit on public.ticket_activities;
create trigger ticket_activities_audit
after insert on public.ticket_activities
for each row execute function public.audit_ticket_activity();

create index if not exists tickets_customer_id_idx on public.tickets(customer_id);
create index if not exists tickets_status_idx on public.tickets(status);
create index if not exists tickets_priority_idx on public.tickets(priority);
create index if not exists ticket_activities_ticket_id_idx on public.ticket_activities(ticket_id, created_at);
create index if not exists audit_events_entity_idx on public.audit_events(entity_type, entity_id, created_at);

alter table public.tickets enable row level security;
alter table public.ticket_activities enable row level security;
alter table public.audit_events enable row level security;
