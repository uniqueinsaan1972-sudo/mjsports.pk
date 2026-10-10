"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { SearchIcon, CartIcon, HeartIcon, MenuIcon, CloseIcon, ChevronIcon } from "@/components/Icons";
import { useCart } from "@/components/CartContext";
import { useFavourites } from "@/components/FavouritesContext";
import { img } from "@/lib/images";

export default function Header({ categories, searchIndex, logoImage }) {
  const pathname = usePathname();
  const { count } = useCart();
  const { favourites } = useFavourites();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [shop, setShop] = useState(false);
  const [q, setQ] = useState("");
  const shopRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setMenu(false); setSearch(false); setShop(false); setQ("");
  }, [pathname]);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") { setMenu(false); setSearch(false); setShop(false); } }
    function onClick(e) { if (shopRef.current && !shopRef.current.contains(e.target)) setShop(false); }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, []);

  useEffect(() => { if (search) inputRef.current?.focus(); }, [search]);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    return searchIndex.filter((p) => `${p.name} ${p.categoryLabel}`.toLowerCase().includes(term)).slice(0, 6);
  }, [q, searchIndex]);

  const current = (href) => (pathname === href ? "page" : undefined);

  return (
    <header className="site-header">
      <div className="container nav">
        <Logo logoImage={logoImage} />
        <nav className="nav-links" aria-label="Main">
          <div className="dropdown" ref={shopRef}>
            <button className="nav-link" aria-expanded={shop} aria-haspopup="true" onClick={() => setShop((s) => !s)}>
              Shop <ChevronIcon size={16} />
            </button>
            {shop && (
              <div className="dropdown-panel">
                <Link href="/shop">All products</Link>
                {categories.map((c) => (
                  <Link key={c.slug} href={`/${c.slug}`}>{c.label}<small>{c.count}</small></Link>
                ))}
              </div>
            )}
          </div>
          <Link className="nav-link" href="/about" aria-current={current("/about")}>About</Link>
          <Link className="nav-link" href="/faq" aria-current={current("/faq")}>FAQ</Link>
          <Link className="nav-link" href="/contact" aria-current={current("/contact")}>Contact</Link>
        </nav>
        <div className="nav-actions">
          <button className="icon-btn" aria-label="Search products" aria-expanded={search} onClick={() => setSearch((s) => !s)}>
            <SearchIcon />
          </button>
          <Link className="icon-btn" href="/favourites" aria-label={`Favourites${favourites.length ? `, ${favourites.length} saved` : ""}`}>
            <HeartIcon />
            {favourites.length > 0 && <span className="badge-count">{favourites.length}</span>}
          </Link>
          <Link className="icon-btn" href="/cart" aria-label={`Cart${count ? `, ${count} items` : ""}`}>
            <CartIcon />
            {count > 0 && <span className="badge-count">{count}</span>}
          </Link>
          <button className="icon-btn menu-btn" aria-label="Open menu" onClick={() => setMenu(true)}><MenuIcon /></button>
        </div>
      </div>

      {search && (
        <div className="search-panel">
          <div className="container">
            <div className="search-box" role="search">
              <SearchIcon />
              <input ref={inputRef} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search bats, caps, kit bags..." aria-label="Search products" maxLength={60} />
            </div>
            {q.trim().length >= 2 && (
              results.length ? (
                <ul className="search-results">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link href={p.href}>
                        {p.thumbnail ? <img src={img(p.thumbnail, 120)} alt="" width="48" height="48" /> : <span style={{ width: 48 }} />}
                        <span className="meta"><span>{p.name}</span><small>{p.categoryLabel} · Rs {Number(p.price).toLocaleString()}</small></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="note" style={{ marginTop: 12 }}>No products match &ldquo;{q}&rdquo;.</p>
              )
            )}
          </div>
        </div>
      )}

      {menu && (
        <>
          <div className="drawer-backdrop" onClick={() => setMenu(false)} />
          <div className="drawer" role="dialog" aria-modal="true" aria-label="Menu">
            <div className="drawer-head">
              <Logo logoImage={logoImage} />
              <button className="icon-btn" aria-label="Close menu" onClick={() => setMenu(false)}><CloseIcon /></button>
            </div>
            <nav aria-label="Mobile">
              <Link href="/shop">All products</Link>
              <h3>Categories</h3>
              <div className="sub">
                {categories.map((c) => <Link key={c.slug} href={`/${c.slug}`}>{c.label}<small>{c.count}</small></Link>)}
              </div>
              <h3>Company</h3>
              <Link href="/about">About</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/favourites">Favourites</Link>
              <Link href="/cart">Cart{count ? ` (${count})` : ""}</Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
