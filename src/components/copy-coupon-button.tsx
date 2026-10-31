"use client";

import { useState } from "react";

export function CopyCouponButton({ code }: { code: string }) {
  const [message, setMessage] = useState("");

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setMessage("Código copiado.");
    } catch {
      setMessage("Não foi possível copiar. Selecione e copie o código manualmente.");
    }
  }

  return (
    <div className="coupon-copy">
      <button className="coupon-copy-button" type="button" onClick={copyCode}>
        Copiar código
      </button>
      <span className="coupon-copy-message" role="status" aria-live="polite">
        {message}
      </span>
    </div>
  );
}
