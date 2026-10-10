import { notFound, permanentRedirect } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import ProductDetailView from "@/components/ProductDetailView";
import JsonLd from "@/components/JsonLd";
import { getAllProducts, getCategories } from "@/lib/serverData";
import { categorySlug, productPath } from "@/lib/categories";
import { img } from "@/lib/images";
import { SITE_URL } from "@/lib/siteConfig";

async function find(slug) {
  const all = await getAllProducts();
  return { all, product: all.find((p) => p.slug === slug) };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { product } = await find(slug);
  if (!product) return { title: "Product not found", robots: { index: false } };
  const desc = (product.description || `${product.name} from MJ Sports, Sialkot. Replacement guarantee and video of your exact article before packing.`).replace(/\s+/g, " ").slice(0, 155);
  const image = product.thumbnail ? img(product.thumbnail, 1200) : undefined;
  return {
    title: product.name,
    description: desc,
    alternates: { canonical: productPath(product) },
    openGraph: { type: "website", title: product.name, description: desc, url: productPath(product), images: image ? [{ url: image, alt: product.name }] : undefined },
  };
}

export default async function ProductPage({ params }) {
  const { category, slug } = await params;
  const { all, product } = await find(slug);
  if (!product) notFound();
  if (categorySlug(product.category) !== category) permanentRedirect(productPath(product));

  const cats = await getCategories();
  const catLabel = cats.find((c) => c.slug === category)?.label || product.category;
  const related = all.filter((p) => p.id !== product.id && categorySlug(p.category) === category).slice(0, 4);
  const images = (product.images?.length ? product.images : product.thumbnail ? [product.thumbnail] : []).map((u) => img(u, 1200));

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: catLabel, href: `/${category}` }, { label: product.name, href: productPath(product) }]} />
      <div className="container"><ProductDetailView product={product} /></div>
      {related.length > 0 && (
        <section className="section section--white" aria-labelledby="rel-h">
          <div className="container">
            <h2 id="rel-h">More {catLabel.toLowerCase()}</h2>
            <div className="product-grid">{related.map((p) => <ProductCard key={p.id} product={p} categoryLabel={catLabel} />)}</div>
          </div>
        </section>
      )}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description || undefined,
          image: images.length ? images : undefined,
          category: catLabel,
          brand: { "@type": "Brand", name: "MJ Sports" },
          offers: { "@type": "Offer", url: `${SITE_URL}${productPath(product)}`, priceCurrency: "PKR", price: String(product.price) },
        }}
      />
    </>
  );
}
