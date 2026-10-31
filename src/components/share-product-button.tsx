"use client";

type ShareProductButtonProps = {
  productId: string;
  title: string;
  price: string | null;
  productUrl: string | null;
};

export function ShareProductButton({
  productId,
  title,
  price,
  productUrl,
}: ShareProductButtonProps) {
  function shareOnWhatsApp() {
    const productPageUrl = `${window.location.origin}/produto/${encodeURIComponent(productId)}`;
    const message = [
      title,
      price ? `Preço: ${price}` : null,
      productPageUrl,
      productUrl ? `Oferta: ${productUrl}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <button
      className="share-button"
      type="button"
      onClick={shareOnWhatsApp}
      aria-label={`Compartilhar ${title} pelo WhatsApp`}
    >
      WhatsApp
    </button>
  );
}
