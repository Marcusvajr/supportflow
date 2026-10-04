alter function public.set_updated_at() set search_path = '';
alter function public.set_ticket_protocol() set search_path = '';
alter function public.audit_ticket_changes() set search_path = '';
alter function public.audit_ticket_activity() set search_path = '';

alter role authenticator reset pgrst.db_pre_request;

drop function if exists public.check_request();

create or replace function private.check_request()
returns void
language plpgsql
security invoker
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

revoke all on schema private from public;
grant usage on schema private to anon, authenticated, service_role;
revoke all on table private.anon_api_keys from public;
grant select on table private.anon_api_keys to anon, authenticated, service_role;
revoke all on function private.check_request() from public;
grant execute on function private.check_request() to anon, authenticated, service_role;

alter role authenticator set pgrst.db_pre_request = 'private.check_request';
notify pgrst, 'reload config';