export const BASE_CATEGORIES = [
  { slug: "bats", label: "Bats", visible: true },
  { slug: "caps", label: "Caps", visible: true },
  { slug: "kit-bags", label: "Kit Bags", visible: true },
  { slug: "gloves", label: "Gloves", visible: true },
  { slug: "balls", label: "Balls", visible: false },
  { slug: "apparel", label: "Apparel", visible: true },
  { slug: "sports-shoes", label: "Sports Shoes", visible: true },
];

export function slugifyLabel(text = "") {
  return String(text).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
export const categorySlug = slugifyLabel;
export function productPath(p) {
  return `/${categorySlug(p.category)}/${p.slug}`;
}
