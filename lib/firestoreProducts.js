import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const PRODUCTS_COL = "products";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// price entered by admin = ORIGINAL price. discount% is applied on top of it
// to get the actual sale price that customers pay.
function computePricing(price, discount) {
  const originalPrice = Number(price) || 0;
  const numericDiscount = Number(discount) || 0;
  const salePrice = numericDiscount > 0
    ? Math.round(originalPrice * (1 - numericDiscount / 100))
    : originalPrice;
  return {
    price: salePrice,
    old: numericDiscount > 0 ? originalPrice : null,
    badge: numericDiscount > 0 ? `-${numericDiscount}%` : null,
  };
}

// Realtime listener — fires immediately with current data, then again on every change.
export function subscribeProducts(callback) {
  const q = query(collection(db, PRODUCTS_COL), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => console.error("subscribeProducts error:", err)
  );
}

export async function addProduct({ title, description, price, discount, category, images, featured, variants }) {
  const slug = `${slugify(title)}-${Date.now().toString().slice(-5)}`;
  const pricing = computePricing(price, discount);
  const imageList = images && images.length ? images : [];

  return addDoc(collection(db, PRODUCTS_COL), {
    name: title,
    slug,
    description: description || "",
    ...pricing,
    category,
    images: imageList,
    thumbnail: imageList[0] || "",
    featured: !!featured,
    variants: variants || [],
    grad: ["#1a1610", "#332a18"], // fallback gradient if no image loads
    specs: { weights: [], handle: "-", edge: "-", playerType: "All" },
    createdAt: serverTimestamp(),
  });
}

export async function updateProduct(id, { title, description, price, discount, category, images, featured, variants }) {
  const pricing = computePricing(price, discount);
  const imageList = images && images.length ? images : [];

  return updateDoc(doc(db, PRODUCTS_COL, id), {
    name: title,
    description: description || "",
    ...pricing,
    category,
    images: imageList,
    thumbnail: imageList[0] || "",
    featured: !!featured,
    variants: variants || [],
  });
}

export function moveProductCategory(id, category) {
  return updateDoc(doc(db, PRODUCTS_COL, id), { category });
}

export function deleteProduct(id) {
  return deleteDoc(doc(db, PRODUCTS_COL, id));
}

export async function getProductBySlug(slug) {
  const q = query(collection(db, PRODUCTS_COL), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}