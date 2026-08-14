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

// Realtime listener — fires immediately with current data, then again on every change.
export function subscribeProducts(callback) {
  const q = query(collection(db, PRODUCTS_COL), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function addProduct({ title, description, price, discount, category, thumbnail, featured }) {
  const slug = `${slugify(title)}-${Date.now().toString().slice(-5)}`;
  const numericPrice = Number(price) || 0;
  const numericDiscount = Number(discount) || 0;
  const oldPrice = numericDiscount > 0 ? Math.round(numericPrice / (1 - numericDiscount / 100)) : null;

  return addDoc(collection(db, PRODUCTS_COL), {
    name: title,
    slug,
    description: description || "",
    price: numericPrice,
    old: oldPrice,
    badge: numericDiscount > 0 ? `-${numericDiscount}%` : null,
    category,
    thumbnail: thumbnail || "",
    featured: !!featured,
    grad: ["#1a1610", "#332a18"], // fallback gradient if no thumbnail loads
    specs: { weights: [], handle: "-", edge: "-", playerType: "All" },
    createdAt: serverTimestamp(),
  });
}

export async function updateProduct(id, { title, description, price, discount, category, thumbnail, featured }) {
  const numericPrice = Number(price) || 0;
  const numericDiscount = Number(discount) || 0;
  const oldPrice = numericDiscount > 0 ? Math.round(numericPrice / (1 - numericDiscount / 100)) : null;

  return updateDoc(doc(db, PRODUCTS_COL, id), {
    name: title,
    description: description || "",
    price: numericPrice,
    old: oldPrice,
    badge: numericDiscount > 0 ? `-${numericDiscount}%` : null,
    category,
    thumbnail: thumbnail || "",
    featured: !!featured,
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