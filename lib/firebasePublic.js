// Lightweight Firestore handle for storefront reads (no Auth SDK is loaded).
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const app = getApps().length
  ? getApp()
  : initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });

export const publicDb = getFirestore(app);

export async function fetchCoupon(code) {
  const id = String(code || "").trim().toUpperCase();
  if (!/^[A-Z0-9_-]{2,40}$/.test(id)) return null;
  const snap = await getDoc(doc(publicDb, "coupons", id));
  return snap.exists() ? snap.data() : null;
}
