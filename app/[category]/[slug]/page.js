"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { FooterSimple, WhatsappFloat } from "@/components/Footer";
import ProductDetailView from "@/components/ProductDetailView";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/products";
import { getProductBySlug, subscribeProducts } from "@/lib/firestoreProducts";

export default function ProductPage({ params }) {
  const { category, slug } = use(params);
  const catInfo = CATEGORIES.find((c) => c.slug === category);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getProductBySlug(slug).then((p) => {
      if (!active) return;
      setProduct(p);
      setLoading(false);
    });
    const unsub = subscribeProducts((all) => {
      setRelated(all.filter((p) => p.category === catInfo?.label && p.slug !== slug).slice(0, 4));
    });
    return () => { active = false; unsub(); };
  }, [slug, catInfo]);

  if (!loading && !product) notFound();

  return (
    <>
      <Navbar active={catInfo?.label} />
      <div className="page-hero" style={{ paddingBottom: 14 }}>
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> / <Link href={`/${category}`}>{catInfo?.label}</Link> / <span>{product?.name}</span>
          </div>
        </div>
      </div>
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 70 }}>
        {loading ? <p style={{ color: "var(--muted)" }}>Loading...</p> : <ProductDetailView product={product} />}
      </div>
      {!loading && related.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head" style={{ textAlign: "left", margin: "0 0 30px" }}>
              <h2 style={{ fontSize: 26 }}>You Might Also Like</h2>
            </div>
            <div className="product-grid">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} category={catInfo?.label} />
              ))}
            </div>
          </div>
        </section>
      )}
      <ScrollFadeUp>
  <section className="section" id="categories">
    ...same content...
  </section>
</ScrollFadeUp>
      <FooterSimple />
      <WhatsappFloat />
    </>
  );
}
