"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FooterSimple, WhatsappFloat } from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useFavourites } from "@/components/FavouritesContext";
import { subscribeProducts } from "@/lib/firestoreProducts";

export default function FavouritesPage() {
  const { favourites } = useFavourites();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeProducts((data) => {
      setAllProducts(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const favouriteProducts = allProducts.filter((p) => favourites.includes(p.id));

  return (
    <>
      <Navbar active="" />

      <div className="page-hero">
        <div className="wrap">
          <div className="crumb"><Link href="/">Home</Link> / <span>Favourites</span></div>
          <h1>Your Favourites</h1>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 30, paddingBottom: 80 }}>
        {loading ? (
          <p style={{ color: "var(--muted)" }}>Loading...</p>
        ) : favouriteProducts.length === 0 ? (
          <div className="cart-empty">
            <p>No favourites yet &mdash; tap the heart on any product to save it here.</p>
            <Link href="/bats" className="btn-primary">Shop Bats</Link>
          </div>
        ) : (
          <div className="product-grid">
            {favouriteProducts.map((p) => (
              <ProductCard key={p.id} product={p} category={p.category} />
            ))}
          </div>
        )}
      </div>

      <FooterSimple />
      <WhatsappFloat />
    </>
  );
}