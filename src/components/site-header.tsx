import Link from "next/link";

import { BrandLink } from "@/components/brand-link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader({
  currentPage,
}: {
  currentPage: "products" | "coupons";
}) {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Navegação principal">
        {currentPage === "products" ? (
          <Link href="/cupons">Cupons</Link>
        ) : (
          <Link href="/">Produtos</Link>
        )}
      </nav>
      <div className="site-brand-group">
        <BrandLink />
        <p>Garimpou, levou.</p>
      </div>
      <ThemeToggle />
    </header>
  );
}
