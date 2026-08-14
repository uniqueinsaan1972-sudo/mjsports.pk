"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { FooterSimple, WhatsappFloat } from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/products";
import { subscribeProducts } from "@/lib/firestoreProducts";

export default function CategoryPage({ params }) {
  const { category } = use(params);
  const catInfo = CATEGORIES.find((c) => c.slug === category);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!catInfo) return;
    const unsub = subscribeProducts((all) => {
      setProducts(all.filter((p) => p.category === catInfo.label));
      setLoading(false);
    });
    return () => unsub();
  }, [catInfo]);

  if (!catInfo) notFound();

  return (
    <>
      <Navbar active={catInfo.label} />
      <div className="page-hero">
        <div className="wrap">
          <div className="crumb"><Link href="/">Home</Link> / <span>{catInfo.label}</span></div>
          <h1>Shop {catInfo.label}</h1>
        </div>
      </div>
      <div className="wrap" style={{ paddingTop: 30, paddingBottom: 70 }}>
        {loading ? (
          <p style={{ color: "var(--muted)" }}>Loading...</p>
        ) : products.length === 0 ? (
          <div className="admin-empty">No products in this category yet. Check back soon!</div>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} category={catInfo.label} />
            ))}
          </div>
        )}
      </div>
      <FooterSimple />
      <WhatsappFloat />
    </>
  );
}