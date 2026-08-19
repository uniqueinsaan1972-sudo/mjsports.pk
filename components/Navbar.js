"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import { useCart } from "@/components/CartContext";
import { subscribeProducts } from "@/lib/firestoreProducts";

export default function Navbar() {
  const { count } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [liveProducts, setLiveProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const unsub = subscribeProducts(setLiveProducts);
    return () => unsub();
  }, []);

  // Close the 3-dot menu when clicking outside of it
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const allProducts = liveProducts;
  const results =
    query.trim().length > 0
      ? allProducts.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6)
      : [];

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  return (
    <header>
      <div className="nav">
        <BrandMark />
        <div className="nav-actions">
          <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(!searchOpen)}>
            &#128269;
          </button>
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

          <div style={{ position: "relative" }} ref={menuRef}>
            <button className="icon-btn" aria-label="More options" onClick={() => setMenuOpen(!menuOpen)}>
              &#8942;
            </button>
            {menuOpen && (
              <div className="nav-dropdown">
                <Link href="/about" onClick={() => setMenuOpen(false)}>MJ Sports Story</Link>
                <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>
                <Link href="/favourites" onClick={() => setMenuOpen(false)}>Favourites</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="search-overlay">
          <div className="search-bar">
            <span className="search-icon">&#128269;</span>
            <input
              autoFocus
              type="text"
              placeholder="Search bats, caps, kits..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="search-close" onClick={closeSearch} aria-label="Close search">&#10005;</button>
          </div>
          {query.trim().length > 0 && (
            <div className="search-results">
              {results.length === 0 ? (
                <p className="search-empty">No products found for &quot;{query}&quot;</p>
              ) : (
                results.map((p) => (
                  <Link key={p.id || p.slug} href={`/product/${p.slug}`} className="search-result-item" onClick={closeSearch}>
                    <div className="search-result-thumb" style={{ background: `linear-gradient(160deg, ${p.grad?.[0] || "#241a0e"}, ${p.grad?.[1] || "#3a2612"})` }}>
                      {(p.thumbnail || p.images?.[0]) && <img src={p.thumbnail || p.images[0]} alt={p.name} />}
                    </div>
                    <div>
                      <div className="search-result-name">{p.name}</div>
                      <div className="search-result-cat">{p.category} &middot; Rs {Number(p.price).toLocaleString()}</div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}