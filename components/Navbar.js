"use client";

import { useState } from "react";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import { useCart } from "@/components/CartContext";

export default function Navbar({ active }) {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  const links = [
    { label: "Bats", href: "/bats" },
    { label: "Caps", href: "/caps" },
    { label: "Kits", href: "/kits" },
    { label: "Gloves", href: "/gloves" },
    { label: "Balls", href: "/balls" },
  ];

  return (
    <header>
      <div className="nav">
        <BrandMark />
        <nav className="links">
          {links.map((l) => (
            <Link key={l.label} href={l.href} className={active === l.label ? "active" : ""}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <div className="icon-btn">&#128269;</div>
          <Link href="/cart" className="icon-btn" style={{ position: "relative" }}>
            &#128722;
            {count > 0 && (
              <span
                style={{
                  position: "absolute", top: -6, right: -6, background: "var(--gold)", color: "var(--ink)",
                  fontSize: 10, fontWeight: 800, width: 17, height: 17, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {count}
              </span>
            )}
          </Link>
          <button className="mobile-menu-btn" aria-label="Open menu" onClick={() => setOpen(!open)}>
            {open ? "\u2715" : "\u2630"}
          </button>
        </div>
      </div>
      <div className={`mobile-drawer ${open ? "open" : ""}`}>
        {links.map((l) => (
          <Link key={l.label} href={l.href} className={active === l.label ? "active" : ""} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
      </div>
    </header>
  );
}