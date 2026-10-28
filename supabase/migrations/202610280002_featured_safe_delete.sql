-- O banco exige WHERE em DELETE. Limita a substituicao as quatro posicoes validas.
begin;
create or replace function public.replace_featured_projects(names text[]) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if names is null or cardinality(names) > 4 then raise exception 'Invalid selection'; end if;
  lock table public.featured_projects in exclusive mode;
  delete from public.featured_projects where position between 0 and 3;
  insert into public.featured_projects(repository_name, position)
    select name, (ordinality - 1)::integer from unnest(names) with ordinality as t(name, ordinality);
  return coalesce((select jsonb_agg(jsonb_build_object('repository_name', repository_name, 'position', position) order by position) from public.featured_projects), '[]'::jsonb);
end;
$$;
revoke all on function public.replace_featured_projects(text[]) from public, anon, authenticated;
grant execute on function public.replace_featured_projects(text[]) to service_role;
commit;
