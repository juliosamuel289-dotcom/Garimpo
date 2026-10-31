"use client";

import Link from "next/link";

export function BrandLink() {
  return (
    <Link
      className="brand"
      href="/"
      onClick={(event) => {
        event.preventDefault();
        window.location.reload();
      }}
    >
      <span className="brand-mark" aria-hidden="true">
        g
      </span>
      <span>
        garimpo<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
