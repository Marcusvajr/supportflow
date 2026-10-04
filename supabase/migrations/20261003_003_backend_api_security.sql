create schema if not exists private;

create table if not exists private.anon_api_keys (
  id uuid primary key,
  name text not null unique
);

create or replace function public.check_request()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  req_app_api_key text := current_setting('request.headers', true)::json->>'x-app-api-key';
  jwt_role text := current_setting('request.jwt.claims', true)::json->>'role';
  is_registered boolean := false;
begin
  if jwt_role <> 'anon' then
    return;
  end if;

  if req_app_api_key is not null
    and req_app_api_key ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  then
    select exists(
      select 1 from private.anon_api_keys where id = req_app_api_key::uuid
    ) into is_registered;
  end if;

  if not is_registered then
    raise sqlstate 'PGRST' using
      message = '{"code":"backend_key_required","message":"Forbidden"}',
      detail = '{"status":403,"status_text":"Forbidden"}';
  end if;
end;
$$;

revoke all on function public.check_request() from public;
grant execute on function public.check_request() to anon, authenticated, service_role;

alter role authenticator set pgrst.db_pre_request = 'public.check_request';
notify pgrst, 'reload config';

grant select, insert, update on table public.customers to anon;
grant select, insert, update on table public.tickets to anon;
grant select, insert on table public.ticket_activities to anon;
grant select, insert on table public.audit_events to anon;
grant usage, select on sequence public.ticket_protocol_seq to anon;

create policy supportflow_backend_customers_select on public.customers for select to anon using (true);
create policy supportflow_backend_customers_insert on public.customers for insert to anon with check (true);
create policy supportflow_backend_customers_update on public.customers for update to anon using (true) with check (true);

create policy supportflow_backend_tickets_select on public.tickets for select to anon using (true);
create policy supportflow_backend_tickets_insert on public.tickets for insert to anon with check (true);
create policy supportflow_backend_tickets_update on public.tickets for update to anon using (true) with check (true);

create policy supportflow_backend_activities_select on public.ticket_activities for select to anon using (true);
create policy supportflow_backend_activities_insert on public.ticket_activities for insert to anon with check (true);

create policy supportflow_backend_audit_select on public.audit_events for select to anon using (true);
create policy supportflow_backend_audit_insert on public.audit_events for insert to anon with check (true);

-- Provisionamento do valor de private.anon_api_keys é externo ao versionamento
-- e deve ser feito apenas no ambiente de execução seguro.
