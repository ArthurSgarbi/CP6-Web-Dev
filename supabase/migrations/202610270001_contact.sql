-- Execute pelo SQL Editor do Supabase. Nenhum acesso publico, nem para usuarios autenticados.
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  fingerprint text not null,
  name text not null check (length(name) between 3 and 120),
  email text not null check (length(email) between 3 and 254),
  subject text not null check (length(subject) between 5 and 180),
  message text not null check (length(message) between 20 and 1000),
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now(),
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'failed')),
  email_provider_id text,
  email_error text,
  last_attempt_at timestamptz not null default now()
);
create table public.contact_rate_limits (client_key text primary key, last_attempt_at timestamptz not null);
alter table public.contact_messages enable row level security;
alter table public.contact_rate_limits enable row level security;
revoke all on public.contact_messages, public.contact_rate_limits from anon, authenticated;
grant all on public.contact_messages, public.contact_rate_limits to service_role;

-- Os bloqueios e o intervalo entre envios persistem entre instâncias sem servidor. A nova tentativa usa a mesma mensagem.
create function public.reserve_contact(p_request uuid, p_client text, p_fingerprint text, p_data jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare existing public.contact_messages; last_attempt timestamptz; message_id uuid;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_request::text, 0));
  select * into existing from public.contact_messages where request_id = p_request;
  if found then
    if existing.fingerprint <> p_fingerprint then return jsonb_build_object('result', 'conflict'); end if;
    if existing.email_status = 'sent' then return jsonb_build_object('result', 'sent'); end if;
    -- O Resend mantém as chaves de idempotência por 24 horas; nunca repita o envio após esse prazo.
    if existing.created_at < now() - interval '23 hours' then return jsonb_build_object('result', 'conflict'); end if;
    if existing.last_attempt_at > now() - interval '60 seconds' then return jsonb_build_object('result', 'busy'); end if;
  end if;
  perform pg_advisory_xact_lock(hashtextextended(p_client, 1));
  select last_attempt_at into last_attempt from public.contact_rate_limits where client_key = p_client;
  if last_attempt > now() - interval '60 seconds' then return jsonb_build_object('result', 'limited'); end if;
  insert into public.contact_rate_limits values (p_client, now())
    on conflict (client_key) do update set last_attempt_at = now();
  if existing.id is not null then
    update public.contact_messages set email_status = 'pending', last_attempt_at = now() where id = existing.id;
    message_id := existing.id;
  else
    insert into public.contact_messages (request_id, fingerprint, name, email, subject, message)
    values (p_request, p_fingerprint, p_data->>'name', p_data->>'email', p_data->>'subject', p_data->>'message') returning id into message_id;
  end if;
  return jsonb_build_object('result', 'claimed', 'id', message_id);
end;
$$;
revoke all on function public.reserve_contact(uuid, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.reserve_contact(uuid, text, text, jsonb) to service_role;
