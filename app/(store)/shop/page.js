import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllProducts, getNavCategories } from "@/lib/serverData";
import { categorySlug } from "@/lib/categories";

export const metadata = {
  title: "Shop All Cricket Gear",
  description: "Browse all MJ Sports products: cricket bats, caps, kit bags, gloves and more, made and sold from Sialkot, Pakistan.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getNavCategories()]);
  const labels = Object.fromEntries(categories.map((c) => [c.slug, c.label]));
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }]} />
      <div className="container page-head"><h1>All products</h1></div>
      <div className="container" style={{ paddingBottom: 80 }}>
        <nav className="chips" aria-label="Categories">
          <Link className="chip" href="/shop" aria-current="page">All</Link>
          {categories.map((c) => <Link key={c.slug} className="chip" href={`/${c.slug}`}>{c.label}</Link>)}
        </nav>
        {products.length ? (
          <div className="product-grid">{products.map((p, i) => <ProductCard key={p.id} product={p} categoryLabel={labels[categorySlug(p.category)]} priority={i < 4} />)}</div>
        ) : (
          <div className="empty"><h2>No products yet</h2><p>Please check back soon or message us on WhatsApp.</p></div>
        )}
      </div>
    </>
  );
}
