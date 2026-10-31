import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase";

export const instant = false;

type ProductShare = {
  id: string;
  titulo: string;
  link: string;
  imagem: string;
  preco: string | null;
  preco_valor: number | null;
};

type ProductParams = {
  params: Promise<{ id: string }>;
};

async function getProduct(id: string) {
  "use cache";

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const result = await supabase
    .from("produtos")
    .select("id, titulo, link, imagem, preco, preco_valor")
    .eq("id", id)
    .maybeSingle();

  if (result.error) {
    console.error("Supabase shared product query failed:", result.error.message);
    return null;
  }

  return result.data as ProductShare | null;
}

function safeHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function formatPrice(product: ProductShare) {
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

export async function generateMetadata({
  params,
}: ProductParams): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Produto não encontrado | Garimpo" };
  }

  const imageUrl = safeHttpsUrl(product.imagem);
  const price = formatPrice(product);
  const description = [
    price ? `${product.titulo}. Preço: ${price}.` : product.titulo,
    "Veja este achado no Garimpo.",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    title: `${product.titulo} | Garimpo`,
    description,
    openGraph: {
      title: product.titulo,
      description,
      type: "website",
      ...(imageUrl
        ? { images: [{ url: imageUrl, alt: product.titulo }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: product.titulo,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

export default async function SharedProductPage({ params }: ProductParams) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const imageUrl = safeHttpsUrl(product.imagem);
  const productUrl = safeHttpsUrl(product.link);
  const price = formatPrice(product);

  return (
    <main>
      <article className="product-card">
        {imageUrl ? (
          <div className="product-image-link">
            <Image
              className="product-image"
              src={imageUrl}
              alt={product.titulo}
              fill
              sizes="(max-width: 620px) 100vw, 620px"
              unoptimized
            />
          </div>
        ) : null}
        <div className="product-info">
          <div className="product-meta">
            <span>Achado</span>
            <span className="store-label">Mercado Livre</span>
          </div>
          <h1>{product.titulo}</h1>
          <div className="price-block">
            {price ? <strong>{price}</strong> : <span>Consulte a oferta</span>}
          </div>
          {productUrl ? (
            <a
              className="product-link"
              href={productUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
            >
              Ver oferta <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </article>
    </main>
  );
}
