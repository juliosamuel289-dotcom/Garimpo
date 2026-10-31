create table if not exists public.produtos (
  id text primary key,
  titulo text not null,
  link text not null,
  imagem text not null,
  preco text,
  preco_valor numeric(12, 2),
  categoria text,
  criado_em timestamptz not null default now(),
  busca tsvector generated always as (
    setweight(to_tsvector('portuguese', coalesce(titulo, '')), 'A')
    || setweight(to_tsvector('portuguese', coalesce(categoria, '')), 'B')
  ) stored
);

create index if not exists produtos_busca_gin_idx
  on public.produtos using gin (busca);

create index if not exists produtos_categoria_idx
  on public.produtos (categoria);

create index if not exists produtos_criado_em_idx
  on public.produtos (criado_em desc);

alter table public.produtos enable row level security;

revoke all on public.produtos from anon, authenticated;
grant select on public.produtos to anon, authenticated;

drop policy if exists "Produtos visiveis publicamente" on public.produtos;
create policy "Produtos visiveis publicamente"
  on public.produtos
  for select
  to anon, authenticated
  using (true);
