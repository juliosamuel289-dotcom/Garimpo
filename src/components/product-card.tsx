import Image from "next/image";

import { ShareProductButton } from "@/components/share-product-button";
import type { Product } from "@/lib/database.types";

function safeHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function formatPrice(product: Product) {
  if (product.preco) {
    return product.preco;
  }

  if (product.preco_valor === null) {
    return null;
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.preco_valor);
}

export function ProductCard({ product }: { product: Product }) {
  const productUrl = safeHttpsUrl(product.link);
  const imageUrl = safeHttpsUrl(product.imagem);
  const price = formatPrice(product);

  return (
    <article className="product-card">
      <a
        className="product-image-link"
        href={productUrl ?? undefined}
        target={productUrl ? "_blank" : undefined}
        rel={productUrl ? "sponsored noopener noreferrer" : undefined}
        aria-label={`Ver oferta: ${product.titulo}`}
      >
        {imageUrl ? (
          <Image
            className="product-image"
            src={imageUrl}
            alt={product.titulo}
            fill
            sizes="(max-width: 620px) 50vw, (max-width: 900px) 33vw, 25vw"
            unoptimized
          />
        ) : (
          <span className="image-placeholder">Garimpo</span>
        )}
      </a>

      <div className="product-info">
        <div className="product-meta">
          <span>{product.categoria || "Achado"}</span>
          <span className="store-label">Mercado Livre</span>
        </div>
        <h2>{product.titulo}</h2>
        <div className="price-block">
          {price ? <strong>{price}</strong> : <span>Consulte a oferta</span>}
        </div>
        <div className="product-actions">
          <ShareProductButton
            productId={product.id}
            title={product.titulo}
            price={price}
            productUrl={productUrl}
          />
          {productUrl ? (
            <a
              className="product-link"
              href={productUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
            >
              Ver oferta <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <span className="product-link disabled">Link indisponível</span>
          )}
        </div>
      </div>
    </article>
  );
}
