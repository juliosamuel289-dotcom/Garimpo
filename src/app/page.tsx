import Link from "next/link";
import { Suspense } from "react";

import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import type { Product } from "@/lib/database.types";
import { getSupabaseServerClient } from "@/lib/supabase";

const PAGE_SIZE = 24;
const MAX_QUERY_LENGTH = 100;

type SearchParams = Promise<{
  page?: string | string[];
  q?: string | string[];
}>;

type CatalogParams = {
  page: number;
  query: string;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function pageUrl(page: number, query: string) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (query) {
    params.set("q", query);
  }
  return `/?${params.toString()}#produtos`;
}

async function ProductCatalog({ params }: { params: CatalogParams }) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return (
      <p className="notice" role="status">
        Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
        em <code>.env.local</code> para conectar o catálogo ao Supabase.
      </p>
    );
  }

  let request = supabase
    .from("produtos")
    .select(
      "id, titulo, link, imagem, preco, preco_valor, categoria, criado_em, busca",
      { count: "exact" },
    )
    .order("criado_em", { ascending: false });

  if (params.query) {
    request = request.textSearch("busca", params.query, {
      config: "portuguese",
      type: "websearch",
    });
  }

  const offset = (params.page - 1) * PAGE_SIZE;
  const result = await request.range(offset, offset + PAGE_SIZE - 1);

  if (result.error) {
    console.error("Supabase product query failed:", result.error.message);
    return (
      <p className="notice error" role="alert">
        Não foi possível carregar os produtos. Confira o esquema SQL, as credenciais
        públicas e as políticas RLS do Supabase.
      </p>
    );
  }

  const products = (result.data ?? []) as Product[];
  const total = result.count ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (params.page > 1 && params.page > totalPages) {
    return (
      <div className="empty-state">
        <h2>Essa página não existe</h2>
        <Link href={pageUrl(1, params.query)}>Voltar ao catálogo</Link>
      </div>
    );
  }

  return (
    <>
      <div className="catalog-summary" aria-live="polite">
        <span>
          {total} {total === 1 ? "produto encontrado" : "produtos encontrados"}
        </span>
        {params.query ? <span>Busca: “{params.query}”</span> : null}
      </div>

      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>{params.query ? "Nenhum produto encontrado" : "Seu catálogo está vazio"}</h2>
          <p>
            {params.query
              ? "Tente outros termos para encontrar um achado."
              : "Quando os produtos forem cadastrados no Supabase, eles aparecerão aqui."}
          </p>
        </div>
      )}

      {totalPages > 1 ? (
        <nav className="pagination" aria-label="Paginação do catálogo">
          {params.page > 1 ? (
            <Link href={pageUrl(params.page - 1, params.query)}>← Anterior</Link>
          ) : (
            <span className="pagination-disabled">← Anterior</span>
          )}
          <span>
            Página {params.page} de {totalPages}
          </span>
          {params.page < totalPages ? (
            <Link href={pageUrl(params.page + 1, params.query)}>Próxima →</Link>
          ) : (
            <span className="pagination-disabled">Próxima →</span>
          )}
        </nav>
      ) : null}
    </>
  );
}

async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const values = await searchParams;
  const rawPage = Number.parseInt(firstParam(values.page) ?? "1", 10);
  const params: CatalogParams = {
    page: Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1,
    query: (firstParam(values.q) ?? "").trim().slice(0, MAX_QUERY_LENGTH),
  };

  return (
    <>
      <SiteHeader currentPage="products" />

      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">Uma seleção feita a dedo</p>
        <h1 id="page-title">
          Coisas boas.
          <br />
          <span>Preço justo.</span>
        </h1>
        <p className="intro-copy">
          Produtos úteis e ofertas selecionadas para deixar o dia a dia melhor.
        </p>
        <form className="search-form" action="/" method="get" role="search">
          <label htmlFor="product-search">O que você está procurando?</label>
          <div className="search-controls">
            <input
              id="product-search"
              type="search"
              name="q"
              maxLength={MAX_QUERY_LENGTH}
              placeholder="Ex.: mochila, tênis, casa…"
              defaultValue={params.query}
            />
            <button type="submit">Buscar</button>
          </div>
        </form>
      </section>

      <section className="catalog" id="produtos" aria-labelledby="catalog-title">
        <div className="catalog-heading">
          <div>
            <p className="eyebrow">A seleção</p>
            <h2 id="catalog-title">Achados recentes</h2>
          </div>
        </div>

        <Suspense fallback={<p className="notice">Carregando produtos…</p>}>
          <ProductCatalog params={params} />
        </Suspense>
      </section>

      <footer className="site-footer">
        <p>Preços e disponibilidade podem mudar. Confira as condições na loja.</p>
      </footer>
    </>
  );
}

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main>
      <Suspense fallback={<p className="notice">Carregando catálogo…</p>}>
        <CatalogPage searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
