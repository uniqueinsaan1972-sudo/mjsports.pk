import { doc, setDoc, deleteDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CATEGORIES_COL = "categories";

export function subscribeCategories(callback) {
  return onSnapshot(collection(db, CATEGORIES_COL), (snap) => {
    callback(snap.docs.map((d) => d.id));
  });
}

export function addCategory(name) {
  return setDoc(doc(db, CATEGORIES_COL, name.trim()), { createdAt: Date.now() });
}

export function deleteCategory(name) {
  return deleteDoc(doc(db, CATEGORIES_COL, name));
}