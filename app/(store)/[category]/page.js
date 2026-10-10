import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllProducts, getCategories } from "@/lib/serverData";
import { categorySlug } from "@/lib/categories";

async function load(slug) {
  const cats = await getCategories();
  const cat = cats.find((c) => c.slug === slug);
  return { cat, cats };
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const { cat } = await load(category);
  if (!cat) return { title: "Page not found", robots: { index: false } };
  return {
    title: `${cat.label} | Buy ${cat.label} Online in Pakistan`,
    description: `Shop ${cat.label.toLowerCase()} from MJ Sports, Sialkot. Advance payment, video of your exact article before packing, and a replacement guarantee.`,
    alternates: { canonical: `/${cat.slug}` },
    robots: cat.count === 0 ? { index: false, follow: true } : undefined,
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const { cat, cats } = await load(category);
  if (!cat) notFound();
  const all = await getAllProducts();
  const products = all.filter((p) => categorySlug(p.category) === cat.slug);
  const visible = cats.filter((c) => c.visible !== false || c.count > 0);

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: cat.label, href: `/${cat.slug}` }]} />
      <div className="container page-head"><h1>{cat.label}</h1></div>
      <div className="container" style={{ paddingBottom: 80 }}>
        <nav className="chips" aria-label="Categories">
          <Link className="chip" href="/shop">All</Link>
          {visible.map((c) => <Link key={c.slug} className="chip" href={`/${c.slug}`} aria-current={c.slug === cat.slug ? "page" : undefined}>{c.label}</Link>)}
        </nav>
        {products.length ? (
          <div className="product-grid">{products.map((p, i) => <ProductCard key={p.id} product={p} categoryLabel={cat.label} priority={i < 4} />)}</div>
        ) : (
          <div className="empty"><h2>No {cat.label.toLowerCase()} listed yet</h2><p>New stock is added regularly. <Link href="/shop" style={{ textDecoration: "underline" }}>Browse all products</Link> or ask us on WhatsApp.</p></div>
        )}
      </div>
    </>
  );
}
