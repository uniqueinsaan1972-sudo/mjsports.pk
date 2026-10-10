// Server-side catalogue reads through the Firestore REST API (public-read rules),
// cached by Next for 60 seconds.
import { BASE_CATEGORIES, categorySlug, slugifyLabel } from "@/lib/categories";

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const BASE = `${process.env.FIRESTORE_REST_BASE || "https://firestore.googleapis.com"}/v1/projects/${PROJECT}/databases/(default)/documents`;

function parseValue(v) {
  if (!v) return null;
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("timestampValue" in v) return Date.parse(v.timestampValue);
  if ("arrayValue" in v) return (v.arrayValue.values || []).map(parseValue);
  if ("mapValue" in v) return parseFields(v.mapValue.fields || {});
  return null;
}
function parseFields(f) {
  const out = {};
  for (const k of Object.keys(f)) out[k] = parseValue(f[k]);
  return out;
}

async function listCollection(name) {
  if (!PROJECT || !KEY) return [];
  const docs = [];
  let token = "";
  do {
    const url = `${BASE}/${name}?pageSize=300&key=${KEY}${token ? `&pageToken=${encodeURIComponent(token)}` : ""}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Firestore ${name} ${res.status}`);
    const json = await res.json();
    docs.push(...(json.documents || []));
    token = json.nextPageToken || "";
  } while (token);
  return docs.map((d) => ({ id: d.name.split("/").pop(), ...parseFields(d.fields || {}) }));
}

export async function getAllProducts() {
  try {
    const list = await listCollection("products");
    return list
      .map((p) => ({ ...p, createdMs: typeof p.createdAt === "number" ? p.createdAt : 0 }))
      .sort((a, b) => b.createdMs - a.createdMs);
  } catch {
    return [];
  }
}

export async function getCategories() {
  const [products, custom] = await Promise.all([
    getAllProducts(),
    listCollection("categories").catch(() => []),
  ]);
  const map = new Map();
  for (const c of BASE_CATEGORIES) map.set(c.slug, { ...c });
  for (const c of custom) {
    const slug = slugifyLabel(c.id);
    if (slug && !map.has(slug)) map.set(slug, { slug, label: c.id, visible: true });
  }
  for (const p of products) {
    const slug = categorySlug(p.category);
    if (slug && !map.has(slug)) map.set(slug, { slug, label: p.category, visible: true });
  }
  return [...map.values()].map((c) => ({
    ...c,
    count: products.filter((p) => categorySlug(p.category) === c.slug).length,
  }));
}

export async function getNavCategories() {
  const cats = await getCategories();
  return cats.filter((c) => c.visible !== false || c.count > 0);
}

export async function getProduct(slug) {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug) || null;
}
