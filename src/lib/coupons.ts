import * as cheerio from "cheerio";

export const COUPON_STORES = [
  {
    id: "mercado-livre",
    name: "Mercado Livre",
    url: "https://www.meliuz.com.br/desconto/cupom-desconto-mercado-livre",
    storeUrl: "https://www.mercadolivre.com.br/",
  },
  {
    id: "shopee",
    name: "Shopee",
    url: "https://www.meliuz.com.br/desconto/cupom-shopee",
    storeUrl: "https://shopee.com.br/",
  },
  {
    id: "aliexpress",
    name: "AliExpress",
    url: "https://www.meliuz.com.br/desconto/cupom-aliexpress",
    storeUrl: "https://pt.aliexpress.com/",
  },
] as const;

export type Coupon = {
  id: string;
  title: string;
  code: string;
  rules: string;
};

export type CouponStoreResult = {
  store: (typeof COUPON_STORES)[number];
  coupons: Coupon[];
  error: string | null;
};

const MAX_HTML_SIZE = 5 * 1024 * 1024;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36";

async function fetchStoreCoupons(
  store: (typeof COUPON_STORES)[number],
): Promise<CouponStoreResult> {
  try {
    const response = await fetch(store.url, {
      headers: {
        "Accept-Language": "pt-BR,pt;q=0.9",
        "User-Agent": USER_AGENT,
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) {
      throw new Error(`a fonte respondeu com HTTP ${response.status}`);
    }
    if (new URL(response.url).hostname !== "www.meliuz.com.br") {
      throw new Error("a fonte redirecionou para um endereço inesperado");
    }

    const html = await response.text();
    if (Buffer.byteLength(html) > MAX_HTML_SIZE) {
      throw new Error("a resposta da fonte excedeu o limite de tamanho");
    }

    const $ = cheerio.load(html);
    const coupons: Coupon[] = [];
    $(".offer-cpn[data-offer-id][data-offer-code]").each((_, card) => {
      const element = $(card);
      const sourceId = element.attr("data-offer-id")?.trim() ?? "";
      const code = element.attr("data-offer-code")?.trim() ?? "";
      const title =
        element.attr("data-offer-title")?.trim() ??
        element.find(".offer-cpn__title").first().text().trim();

      if (
        !/^\d+$/.test(sourceId) ||
        !/^[A-Za-z0-9_-]{2,64}$/.test(code) ||
        !title
      ) {
        return;
      }

      coupons.push({
        id: `${store.id}-${sourceId}`,
        title: title.slice(0, 300),
        code,
        rules: element
          .find(".cpn-layout__rules")
          .first()
          .text()
          .trim()
          .slice(0, 1000),
      });
    });

    if (coupons.length === 0) {
      throw new Error("nenhum cupom foi encontrado na página da fonte");
    }
    if (new Set(coupons.map((coupon) => coupon.id)).size !== coupons.length) {
      throw new Error("a fonte retornou cupons duplicados");
    }

    return { store, coupons, error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "erro inesperado ao consultar a fonte";
    console.error(`Coupon source request failed for ${store.name}:`, error);
    return {
      store,
      coupons: [],
      error: `Não foi possível carregar os cupons agora (${message}).`,
    };
  }
}

export function getCouponsFromSources() {
  return Promise.all(COUPON_STORES.map(fetchStoreCoupons));
}
