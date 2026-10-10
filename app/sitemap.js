import { getAllProducts, getCategories } from "@/lib/serverData";
import { productPath } from "@/lib/categories";
import { SITE_URL } from "@/lib/siteConfig";

export const revalidate = 3600;

export default async function sitemap() {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()]);
  const now = new Date();
  const fixed = ["", "/shop", "/about", "/contact", "/faq", "/privacy-policy", "/terms-and-conditions"].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "daily" : "monthly",
    priority: p === "" ? 1 : 0.6,
  }));
  const cats = categories.filter((c) => c.count > 0).map((c) => ({ url: `${SITE_URL}/${c.slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 }));
  const prods = products.map((p) => ({
    url: `${SITE_URL}${productPath(p)}`,
    lastModified: p.createdMs ? new Date(p.createdMs) : now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  return [...fixed, ...cats, ...prods];
}
