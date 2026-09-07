'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { FooterSimple, WhatsappFloat } from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES } from '@/lib/products';
import { subscribeProducts } from '@/lib/firestoreProducts';

export default function CategoryPage({ params }) {
  const { category } = use(params);
  const catInfo = CATEGORIES.find((c) => c.slug === category);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeProducts((all) => {
      setProducts(all.filter((p) => p.category === catInfo?.label));
      setLoading(false);
    });
    return () => unsub();
  }, [catInfo]);

  if (!catInfo) return <div>Category not found</div>;

  return (
    <>
      <Navbar active={catInfo.label} />
      <div className="page-hero" style={{ paddingBottom: 14 }}>
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Home</Link> / <span>{catInfo.label}</span>
          </div>
        </div>
      </div>
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 70 }}>
        <h1>{catInfo.label}</h1>
        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Loading...</p>
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} category={catInfo.label} />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--muted)' }}>No products found</p>
        )}
      </div>
      <FooterSimple />
      <WhatsappFloat />
    </>
  );
}