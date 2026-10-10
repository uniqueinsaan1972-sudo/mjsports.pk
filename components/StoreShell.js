import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsappFloat from "@/components/WhatsappFloat";
import { getAllProducts, getNavCategories } from "@/lib/serverData";
import { productPath, categorySlug } from "@/lib/categories";
import { existsSync } from "node:fs";
import { join } from "node:path";

// Public storefront chrome (announcement bar, header, footer). Admin pages do not use it.
export default async function StoreShell({ children }) {
  const [products, categories] = await Promise.all([getAllProducts(), getNavCategories()]);
  const logoImage = existsSync(join(process.cwd(), "public", "brand", "logo.png"));
  const labels = Object.fromEntries(categories.map((c) => [c.slug, c.label]));
  const searchIndex = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    thumbnail: p.thumbnail || "",
    href: productPath(p),
    categoryLabel: labels[categorySlug(p.category)] || p.category,
  }));
  return (
    <div className="shell">
      <a href="#content" className="skip-link">Skip to content</a>
      <div className="announce">
        <div className="container">
          <span>Advance payment orders</span>
          <span>Video of your exact article before packing</span>
          <span>Replacement guarantee</span>
        </div>
      </div>
      <Header categories={categories} searchIndex={searchIndex} logoImage={logoImage} />
      <main id="content">{children}</main>
      <Footer categories={categories} logoImage={logoImage} />
      <WhatsappFloat />
    </div>
  );
}
