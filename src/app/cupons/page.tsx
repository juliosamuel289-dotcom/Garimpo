import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";

import { CopyCouponButton } from "@/components/copy-coupon-button";
import { SiteHeader } from "@/components/site-header";
import { getCouponsFromSources } from "@/lib/coupons";

export const instant = false;

export const metadata: Metadata = {
  title: "Cupons disponíveis | Garimpo",
  description:
    "Cupons de desconto para Mercado Livre, Shopee e AliExpress, atualizados pela Méliuz.",
};

async function CouponCatalog() {
  const stores = await getCouponsFromSources();
  const couponsCount = stores.reduce(
    (total, result) => total + result.coupons.length,
    0,
  );
  if (couponsCount === 0 && stores.every((result) => result.error)) {
    return (
      <div className="notice error" role="alert">
        <p>As fontes de cupons estão temporariamente indisponíveis.</p>
        <ul>
          {stores.map((result) => (
            <li key={result.store.id}>
              {result.store.name}: {result.error}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <>
      <p className="coupon-updated">
        Atualização automática com cache de até uma hora.
      </p>
      {stores.map(({ store, coupons, error }) => {
        return (
          <section
            className="coupon-store-section"
            key={store.id}
            aria-labelledby={`coupon-store-${store.id}`}
          >
            <div className="coupon-store-heading">
              <h2 id={`coupon-store-${store.id}`}>{store.name}</h2>
              <Link href={store.url} target="_blank" rel="noopener noreferrer">
                Fonte: Méliuz <span aria-hidden="true">↗</span>
              </Link>
            </div>
            {error ? (
              <p className="notice error" role="status">{error}</p>
            ) : coupons.length > 0 ? (
              <div className="coupon-grid">
                {coupons.map((coupon) => (
                  <article className="coupon-card" key={coupon.id}>
                    <p className="eyebrow">{store.name}</p>
                    <h3>{coupon.title}</h3>
                    {coupon.rules ? (
                      <p className="coupon-rules">{coupon.rules}</p>
                    ) : null}
                    <div className="coupon-code">
                      <span>{coupon.code}</span>
                      <CopyCouponButton code={coupon.code} />
                    </div>
                    <Link
                      className="coupon-store-link"
                      href={store.storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ir para a loja <span aria-hidden="true">↗</span>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-state">Nenhum cupom disponível no momento.</p>
            )}
          </section>
        );
      })}
    </>
  );
}

export default function CouponsPage() {
  return (
    <main>
      <SiteHeader currentPage="coupons" />
      <section className="coupon-intro" aria-labelledby="coupon-page-title">
        <p className="eyebrow">Ofertas para aproveitar</p>
        <h1 id="coupon-page-title">Cupons disponíveis</h1>
        <p>
          Códigos publicados pela Méliuz para Mercado Livre, Shopee e AliExpress.
          Confira as regras e a disponibilidade na loja antes de finalizar a compra.
        </p>
      </section>
      <section className="coupon-catalog" aria-label="Lista de cupons">
        <p className="notice coupon-disclaimer">
          Alguns cupons podem ser exclusivos da Méliuz ou exigir condições
          específicas. A lista reflete as páginas da fonte e pode levar até uma hora
          para acompanhar alterações ou vencimentos.
        </p>
        <Suspense fallback={<p className="notice">Carregando cupons…</p>}>
          <CouponCatalog />
        </Suspense>
      </section>
      <footer className="site-footer">
        <p>Cupons e condições podem mudar. Confirme a validade no checkout da loja.</p>
      </footer>
    </main>
  );
}
