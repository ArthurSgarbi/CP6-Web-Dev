begin;
alter table public.contact_messages drop constraint contact_messages_status_check;
alter table public.contact_messages add constraint contact_messages_status_check check (status in ('new', 'read', 'responded', 'archived'));
create table public.featured_projects (
 id uuid primary key default gen_random_uuid(),
 repository_name text not null unique check (repository_name ~ '^[A-Za-z0-9_.-]{1,100}$'),
 position integer not null unique check (position between 0 and 3),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index featured_projects_name_lower on public.featured_projects (lower(repository_name));
alter table public.featured_projects enable row level security;
revoke all on public.featured_projects from public, anon, authenticated;
grant all on public.featured_projects to service_role;
insert into public.featured_projects(repository_name, position) values
 ('aether-front-end', 0), ('meu-caixa', 1), ('site-projeto-shopee', 2), ('anninha-site-novo', 3);
create function public.replace_featured_projects(names text[]) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
 if names is null or cardinality(names) > 4 then raise exception 'Invalid selection'; end if;
 lock table public.featured_projects in exclusive mode;
 delete from public.featured_projects;
 insert into public.featured_projects(repository_name, position)
 select name, (ordinality - 1)::integer from unnest(names) with ordinality as t(name, ordinality);
 return coalesce((select jsonb_agg(jsonb_build_object('repository_name', repository_name, 'position', position) order by position) from public.featured_projects), '[]'::jsonb);
end; $$;
create function public.admin_message_counts() returns jsonb
language sql security definer set search_path = public as $$
 select jsonb_build_object('new', count(*) filter (where status = 'new'), 'responded', count(*) filter (where status = 'responded')) from public.contact_messages;
$$;
revoke all on function public.replace_featured_projects(text[]), public.admin_message_counts() from public, anon, authenticated;
grant execute on function public.replace_featured_projects(text[]), public.admin_message_counts() to service_role;
commit;
