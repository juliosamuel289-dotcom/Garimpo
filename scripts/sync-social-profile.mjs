import { createClient } from "@supabase/supabase-js";
import * as cheerio from "cheerio";

const PROFILE_URL =
  "https://www.mercadolivre.com.br/social/juliosamuel000/lists";
const AFFILIATE_TOOL = process.env.MELI_AFFILIATE_TOOL;
const MAX_HTML_SIZE = 5 * 1024 * 1024;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36";

function assertAllowedHost(value, allowedDomain) {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    (url.hostname !== allowedDomain &&
      !url.hostname.endsWith(`.${allowedDomain}`))
  ) {
    throw new Error(`Unexpected external host: ${url.hostname}`);
  }
  return url;
}

function getAffiliateLink(value) {
  const url = assertAllowedHost(value.replace(/\?\?/, "?"), "mercadolivre.com.br");
  if (!/^\/(?:MLB-?\d+|[^/]+\/(?:p|up)\/MLB[^/]+)/i.test(url.pathname)) {
    throw new Error("Profile product link does not look like a Mercado Livre item.");
  }
  url.searchParams.set("matt_tool", AFFILIATE_TOOL);
  return url.href;
}

function getProductId(value) {
  const url = new URL(value.replace(/\?\?/, "?"));
  const hashParams = new URLSearchParams(url.hash.slice(1));
  const productIds = [
    url.searchParams.get("wid"),
    url.searchParams.get("pdp_filters")?.match(/item_id:(MLB-?\d+)/i)?.[1],
    hashParams.get("wid"),
    url.pathname.match(/MLB-?\d+/i)?.[0],
  ];

  for (const productId of productIds) {
    if (productId && /^MLB-?\d+$/i.test(productId)) {
      return productId.toUpperCase();
    }
  }

  throw new Error("Could not identify the product in its Mercado Livre URL.");
}

function parsePrice(value) {
  const match = value?.match(
    /(?:Agora:\s*)?([\d.]+)\s*reais?(?:\s+com\s+(\d+)\s+centavos?)?/i,
  );
  if (!match) {
    return { label: null, amount: null };
  }

  const whole = Number(match[1].replace(/\./g, ""));
  const cents = Number((match[2] ?? "0").padStart(2, "0"));
  if (!Number.isSafeInteger(whole) || !Number.isInteger(cents) || cents > 99) {
    throw new Error("Could not parse a product price from the public profile.");
  }

  return {
    label: `R$ ${whole.toLocaleString("pt-BR")},${String(cents).padStart(2, "0")}`,
    amount: whole + cents / 100,
  };
}

function parseProducts(html) {
  const $ = cheerio.load(html);
  const cards = $("main .poly-card");
  if (cards.length === 0) {
    throw new Error("No products found on the public profile; nothing was synced.");
  }

  const products = [];
  cards.each((_, card) => {
    const element = $(card);
    const titleElement = element.find("a.poly-component__title").first();
    const title = titleElement.text().trim();
    const rawLink = titleElement.attr("href");
    const imageUrl = element.find("img.poly-component__picture").first().attr("src");
    if (!title || !rawLink || !imageUrl) {
      throw new Error("A product is missing its title, link, or image.");
    }

    assertAllowedHost(imageUrl, "mlstatic.com");
    const affiliateLink = getAffiliateLink(rawLink);
    const price = parsePrice(
      element.find(".poly-price__current [aria-label]").first().attr("aria-label"),
    );

    products.push({
      id: getProductId(rawLink),
      titulo: title,
      link: affiliateLink,
      imagem: imageUrl,
      preco: price.label,
      preco_valor: price.amount,
      categoria: "Recomendados",
    });
  });

  return products;
}

async function fetchProducts() {
  const response = await fetch(PROFILE_URL, {
    headers: {
      "Accept-Language": "pt-BR,pt;q=0.9",
      "User-Agent": USER_AGENT,
    },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    throw new Error(`Mercado Livre profile returned HTTP ${response.status}.`);
  }

  const html = await response.text();
  if (Buffer.byteLength(html) > MAX_HTML_SIZE) {
    throw new Error("Mercado Livre profile response exceeded the size limit.");
  }
  return parseProducts(html);
}

async function main() {
  if (!AFFILIATE_TOOL || !/^\d+$/.test(AFFILIATE_TOOL)) {
    throw new Error("MELI_AFFILIATE_TOOL must contain the affiliate tracking code.");
  }

  const products = await fetchProducts();
  if (new Set(products.map((product) => product.id)).size !== products.length) {
    throw new Error("The public profile contains duplicate product IDs.");
  }

  if (process.argv.includes("--dry-run")) {
    console.log(`Found ${products.length} public profile products.`);
    for (const product of products) {
      console.log(
        `${product.id}: ${product.titulo} — ${product.preco ?? "sem preço"}`,
      );
    }
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured as runtime secrets.",
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
  const { error } = await supabase
    .from("produtos")
    .upsert(products, { onConflict: "id" });
  if (error) {
    throw new Error(`Supabase product sync failed: ${error.message}`);
  }

  console.log(`Synced ${products.length} public profile products.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
